/** Match a book-vs-audio difference to a Record Sessions listen beat. */

import {
  manuscriptDiffFindings,
  type ManuscriptFinding,
} from '@/data/audioManuscriptFindings';
import {
  cueStartForChunk,
  tokenizeWords,
  type DiffChunk,
} from '@/lib/scriptWordDiff';

const MIN_PHRASE = 2;
const LONG_OVERLAP = 5;
const TIME_PAD_SECONDS = 12;
const MAX_TIME_WINDOW_SECONDS = 45;

function keysOf(text: string): string[] {
  return tokenizeWords(text).map((token) => token.key);
}

function longestContiguousOverlap(a: string[], b: string[]): number {
  let best = 0;
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < b.length; j += 1) {
      let length = 0;
      while (
        i + length < a.length &&
        j + length < b.length &&
        a[i + length] === b[j + length]
      ) {
        length += 1;
      }
      if (length > best) best = length;
    }
  }
  return best;
}

function phraseHit(chunkKeys: string[], findingKeys: string[]): boolean {
  if (chunkKeys.length === 0 || findingKeys.length === 0) return false;
  const overlap = longestContiguousOverlap(chunkKeys, findingKeys);
  if (overlap >= LONG_OVERLAP) return true;
  const shorter = Math.min(chunkKeys.length, findingKeys.length);
  if (shorter < MIN_PHRASE) return false;
  return overlap >= shorter || overlap >= Math.ceil(shorter * 0.75);
}

function inSeekWindow(
  time: number | null,
  finding: ManuscriptFinding,
): boolean {
  if (time == null) return false;
  const span = finding.trackEndSeconds - finding.trackStartSeconds;
  if (span > MAX_TIME_WINDOW_SECONDS) return false;
  return (
    time >= finding.trackStartSeconds - TIME_PAD_SECONDS &&
    time <= finding.trackEndSeconds + TIME_PAD_SECONDS
  );
}

export function recordSessionFindingForDiff(
  chapterId: number,
  chunk: DiffChunk | null,
  trackTime: number | null,
  findings: readonly ManuscriptFinding[] = manuscriptDiffFindings(),
): ManuscriptFinding | null {
  if (!chunk || chunk.kind === 'equal') return null;

  const left = chunk.left.map((token) => token.key);
  const right = chunk.right.map((token) => token.key);
  let best: { finding: ManuscriptFinding; score: number } | null = null;

  for (const finding of findings) {
    if (finding.chapterId !== chapterId) continue;
    const book = keysOf(finding.finalScriptText);
    const spoken = keysOf(finding.trackScriptText);
    let score = 0;
    if (phraseHit(left, book)) score += 3;
    if (phraseHit(right, spoken)) score += 3;
    const timed = inSeekWindow(trackTime, finding);
    if (timed) score += 1;
    if (timed) {
      const bookSet = new Set(book);
      const spokenSet = new Set(spoken);
      const bookOnly = left.some(
        (key) => bookSet.has(key) && !spokenSet.has(key),
      );
      const spokenOnly = right.some(
        (key) => spokenSet.has(key) && !bookSet.has(key),
      );
      if (bookOnly || spokenOnly) score += 2;
    }
    if (score < 2) continue;
    if (!best || score > best.score) best = { finding, score };
  }

  return best?.finding ?? null;
}

export function recordSessionFindingForChunk(
  chapterId: number,
  chunks: DiffChunk[],
  chunk: DiffChunk | null,
  findings: readonly ManuscriptFinding[] = manuscriptDiffFindings(),
): ManuscriptFinding | null {
  if (!chunk || chunk.kind === 'equal') return null;
  return recordSessionFindingForDiff(
    chapterId,
    chunk,
    cueStartForChunk(chunks, chunk.id),
    findings,
  );
}
