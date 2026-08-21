/** Live word-level diff for ARC manuscript vs chapter audio script. */

export type DiffKind = 'equal' | 'delete' | 'insert' | 'replace';

/** Line/paragraph break that followed this word in the source text. */
export type BreakAfter = 'line' | 'paragraph';

export type WordToken = {
  /** Original surface form (punctuation kept). */
  display: string;
  /** Normalized key used for matching. */
  key: string;
  /** Preserved from source whitespace; not used for matching. */
  breakAfter?: BreakAfter;
};

export type DiffChunk = {
  id: number;
  kind: DiffKind;
  left: WordToken[];
  right: WordToken[];
};

export type DiffStats = {
  leftWords: number;
  rightWords: number;
  matchedWords: number;
  missingFromScript: number;
  onlyInScript: number;
  replacements: number;
  /** Matched / max(left, right) style ratio as percent, 1 decimal. */
  similarityPct: number;
};

export type WordDiffResult = {
  chunks: DiffChunk[];
  stats: DiffStats;
  /** Chunk ids that are not equal (for next/prev navigation). */
  differenceIds: number[];
};

const WORD_RE = /[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)?|[^\sA-Za-z0-9]+/g;

export function normalizeWordKey(raw: string): string {
  return raw
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9']/g, '');
}

function classifyBreak(gap: string): BreakAfter | undefined {
  if (!/\n/.test(gap)) return undefined;
  // Blank line (two+ newlines, optional spaces) → paragraph; else soft line break.
  if (/\n[ \t\u00a0]*\n/.test(gap)) return 'paragraph';
  return 'line';
}

function applyBreakFromGap(token: WordToken, gap: string): void {
  const next = classifyBreak(gap);
  if (!next) return;
  // Prefer the stronger break if multiple gaps land on the same word.
  if (token.breakAfter === 'paragraph') return;
  token.breakAfter = next;
}

export function tokenizeWords(text: string): WordToken[] {
  const tokens: WordToken[] = [];
  let lastEnd = 0;
  for (const match of text.matchAll(WORD_RE)) {
    const display = match[0];
    const start = match.index ?? 0;
    const end = start + display.length;

    if (tokens.length > 0 && start > lastEnd) {
      applyBreakFromGap(tokens[tokens.length - 1]!, text.slice(lastEnd, start));
    }

    const key = normalizeWordKey(display);
    if (key) {
      tokens.push({ display, key });
    }
    lastEnd = end;
  }

  if (tokens.length > 0 && lastEnd < text.length) {
    applyBreakFromGap(tokens[tokens.length - 1]!, text.slice(lastEnd));
  }

  return tokens;
}

/** Copy ARC line/paragraph breaks onto aligned audio words for side-by-side reading. */
function transferBreaks(left: WordToken[], right: WordToken[]): WordToken[] {
  if (right.length === 0) return right;
  const out = right.map((token) => ({ ...token }));
  const n = Math.min(left.length, out.length);
  for (let i = 0; i < n; i += 1) {
    const br = left[i]?.breakAfter;
    if (br) out[i]!.breakAfter = br;
  }
  // If lengths differ, keep any remaining left breaks on the last right word.
  if (left.length > out.length) {
    for (let i = out.length; i < left.length; i += 1) {
      const br = left[i]?.breakAfter;
      if (br) {
        const last = out[out.length - 1]!;
        if (last.breakAfter !== 'paragraph') last.breakAfter = br;
      }
    }
  }
  return out;
}

type Match = { a: number; b: number; size: number };

/** difflib-style longest contiguous match inside [alo,ahi) × [blo,bhi). */
function findLongestMatch(
  a: string[],
  b: string[],
  alo: number,
  ahi: number,
  blo: number,
  bhi: number,
): Match {
  let best: Match = { a: alo, b: blo, size: 0 };
  const b2j = new Map<string, number[]>();
  for (let j = blo; j < bhi; j += 1) {
    const key = b[j]!;
    const list = b2j.get(key);
    if (list) list.push(j);
    else b2j.set(key, [j]);
  }

  let j2len = new Map<number, number>();
  for (let i = alo; i < ahi; i += 1) {
    const next = new Map<number, number>();
    const indexes = b2j.get(a[i]!) ?? [];
    for (const j of indexes) {
      const length = (j2len.get(j - 1) ?? 0) + 1;
      next.set(j, length);
      if (length > best.size) {
        best = { a: i - length + 1, b: j - length + 1, size: length };
      }
    }
    j2len = next;
  }
  return best;
}

function matchingBlocks(a: string[], b: string[]): Match[] {
  const queue: Array<[number, number, number, number]> = [
    [0, a.length, 0, b.length],
  ];
  const matches: Match[] = [];
  while (queue.length > 0) {
    const [alo, ahi, blo, bhi] = queue.pop()!;
    const match = findLongestMatch(a, b, alo, ahi, blo, bhi);
    if (match.size < 1) continue;
    matches.push(match);
    if (alo < match.a && blo < match.b) {
      queue.push([alo, match.a, blo, match.b]);
    }
    const aEnd = match.a + match.size;
    const bEnd = match.b + match.size;
    if (aEnd < ahi && bEnd < bhi) {
      queue.push([aEnd, ahi, bEnd, bhi]);
    }
  }
  matches.sort((x, y) => x.a - y.a || x.b - y.b);
  // Collapse adjacent
  const collapsed: Match[] = [];
  for (const m of matches) {
    const prev = collapsed[collapsed.length - 1];
    if (
      prev &&
      prev.a + prev.size === m.a &&
      prev.b + prev.size === m.b
    ) {
      prev.size += m.size;
    } else {
      collapsed.push({ ...m });
    }
  }
  collapsed.push({ a: a.length, b: b.length, size: 0 });
  return collapsed;
}

export function diffWordTokens(
  left: WordToken[],
  right: WordToken[],
): WordDiffResult {
  const aKeys = left.map((t) => t.key);
  const bKeys = right.map((t) => t.key);
  const blocks = matchingBlocks(aKeys, bKeys);

  const chunks: DiffChunk[] = [];
  let id = 0;
  let i = 0;
  let j = 0;
  let matchedWords = 0;
  let missingFromScript = 0;
  let onlyInScript = 0;
  let replacements = 0;

  const push = (
    kind: DiffKind,
    leftSlice: WordToken[],
    rightSlice: WordToken[],
  ) => {
    if (leftSlice.length === 0 && rightSlice.length === 0) return;
    chunks.push({
      id: id++,
      kind,
      left: leftSlice,
      right: rightSlice,
    });
  };

  for (const block of blocks) {
    const leftGap = left.slice(i, block.a);
    const rightGap = right.slice(j, block.b);
    if (leftGap.length > 0 && rightGap.length > 0) {
      push('replace', leftGap, transferBreaks(leftGap, rightGap));
      replacements += 1;
      missingFromScript += leftGap.length;
      onlyInScript += rightGap.length;
    } else if (leftGap.length > 0) {
      push('delete', leftGap, []);
      missingFromScript += leftGap.length;
    } else if (rightGap.length > 0) {
      push('insert', [], rightGap);
      onlyInScript += rightGap.length;
    }

    if (block.size > 0) {
      const leftEq = left.slice(block.a, block.a + block.size);
      const rightEq = right.slice(block.b, block.b + block.size);
      push('equal', leftEq, transferBreaks(leftEq, rightEq));
      matchedWords += block.size;
    }
    i = block.a + block.size;
    j = block.b + block.size;
  }

  const denom = Math.max(left.length, right.length, 1);
  const similarityPct = Math.round((matchedWords / denom) * 1000) / 10;

  return {
    chunks,
    stats: {
      leftWords: left.length,
      rightWords: right.length,
      matchedWords,
      missingFromScript,
      onlyInScript,
      replacements,
      similarityPct,
    },
    differenceIds: chunks.filter((c) => c.kind !== 'equal').map((c) => c.id),
  };
}

export function diffManuscriptTexts(
  arcText: string,
  scriptText: string,
): WordDiffResult {
  return diffWordTokens(tokenizeWords(arcText), tokenizeWords(scriptText));
}

export function scriptTextFromCues(
  cues: Array<{ text: string }>,
): string {
  return cues.map((cue) => cue.text.trim()).filter(Boolean).join(' ');
}
