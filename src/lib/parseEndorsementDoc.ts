import type {
  EndorsementCut,
  EndorsementPlacement,
  EndorsementTheme,
  EndorsementVoice,
} from '../data/endorsements.js';

const SHORT_PULL_CHARS = 160;
const NAME_SUFFIX = /^(PhD|MC|LLC|RNBN|MD|Jr\.?|Sr\.?)$/i;
const RULE = /^\s*_{5,}\s*$/m;
const TRIMMED_HEADING = /^\s*trimmed\s*$/i;
const OR_LINE = /^\s*or\s*$/i;
const DASH_PREFIX = /^[—–-]\s*/;
const SKIP_LINE = /^(tab\s*\d+|formless endorsements)$/i;
const NOTE_LINE =
  /^(came in later:?)$|i['’]m sure you know|if you need that|quote is from page/i;
const JOB_STARTER =
  /^(Licensed|Neuroscientist|CEO|Data|Registered|Author|Nurse|Sr\.?)\b/;

export type ParsedEndorsement = {
  id: string;
  name: string;
  role: string;
  credentials?: string[];
  note?: string;
  cuts: EndorsementCut[];
};

export function endorsementIdFromName(name: string): string {
  return name
    .replace(/\b(PhD|MC|LLC|RNBN|MD|Jr\.?|Sr\.?)\b/gi, ' ')
    .replace(/\b[A-Z]\.\s*/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseEndorsementDoc(raw: string): ParsedEndorsement[] {
  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const blocks = text.split(RULE).map((block) => block.trim()).filter(Boolean);

  const rows: ParsedEndorsement[] = [];
  for (const block of blocks) {
    const parsed = parseBlock(block);
    if (parsed) rows.push(parsed);
  }
  return rows;
}

function parseBlock(block: string): ParsedEndorsement | null {
  const lines = block.split('\n').map((line) => line.replace(/\s+$/, ''));
  const headingIndex = lines.findIndex((line) => TRIMMED_HEADING.test(line));
  const fullLines = headingIndex >= 0 ? lines.slice(0, headingIndex) : lines;
  const restLines = headingIndex >= 0 ? lines.slice(headingIndex + 1) : [];

  const { quoteLines, notes, attribution, credentials } =
    splitFullSection(fullLines);
  if (!attribution) return null;

  const { name, role } = splitAttribution(attribution);
  const id = endorsementIdFromName(name);
  if (!id) return null;

  const fullText = joinQuote(quoteLines);
  if (!fullText) return null;

  const cuts: EndorsementCut[] = [
    { id: `${id}-full`, kind: 'full', text: fullText },
  ];

  const rest = parseRestCuts(id, restLines);
  cuts.push(...rest);

  if (
    rest.length === 0 &&
    fullText.length <= SHORT_PULL_CHARS &&
    !fullText.includes('\n')
  ) {
    cuts.push({ id: `${id}-pull`, kind: 'pull', text: fullText });
  }

  const note = notes.length > 0 ? notes.join(' ') : undefined;
  return {
    id,
    name,
    role,
    credentials: credentials.length > 0 ? credentials : undefined,
    note,
    cuts,
  };
}

function splitFullSection(lines: string[]): {
  quoteLines: string[];
  notes: string[];
  attribution: string | null;
  credentials: string[];
} {
  const useful = lines.filter((line) => !SKIP_LINE.test(line.trim()));
  const attrIndex = useful.findIndex((line) => isDashedAttribution(line));
  const bylineIndex =
    attrIndex >= 0
      ? attrIndex
      : findLastIndex(useful, (line) => looksLikePersonByline(line));

  if (bylineIndex < 0) {
    return { quoteLines: [], notes: [], attribution: null, credentials: [] };
  }

  const { body, notes } = extractNotes(useful.slice(0, bylineIndex));
  const credentials = useful
    .slice(bylineIndex + 1)
    .map((line) => unwrapQuotes(line.trim()))
    .filter(Boolean);

  return {
    quoteLines: body,
    notes,
    attribution: useful[bylineIndex] ?? null,
    credentials,
  };
}

function parseRestCuts(id: string, lines: string[]): EndorsementCut[] {
  const chunks: string[] = [];
  let sawOr = false;
  let buf: string[] = [];

  const flush = () => {
    const text = joinQuote(buf);
    buf = [];
    if (text) chunks.push(text);
  };

  for (const line of lines) {
    if (OR_LINE.test(line)) {
      flush();
      sawOr = true;
      continue;
    }
    if (isDashedAttribution(line) || looksLikePersonByline(line)) {
      flush();
      continue;
    }
    buf.push(line);
  }
  flush();

  if (chunks.length === 0) return [];

  if (sawOr) {
    return chunks.map((text, index) => {
      const variant: 'a' | 'b' | undefined =
        index === 0 ? 'a' : index === 1 ? 'b' : undefined;
      return {
        id: variant ? `${id}-trimmed-${variant}` : `${id}-trimmed-${index + 1}`,
        kind: 'trimmed' as const,
        variant,
        text,
      };
    });
  }

  const [first, ...rest] = chunks;
  const cuts: EndorsementCut[] = [
    { id: `${id}-trimmed`, kind: 'trimmed', text: first! },
  ];
  rest.forEach((text, index) => {
    cuts.push({
      id: index === 0 ? `${id}-pull` : `${id}-pull-${index + 1}`,
      kind: 'pull',
      text,
    });
  });
  return cuts;
}

function extractNotes(lines: string[]): { body: string[]; notes: string[] } {
  const body: string[] = [];
  const notes: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (NOTE_LINE.test(trimmed)) {
      notes.push(trimmed.replace(/:$/, ''));
      continue;
    }
    body.push(line);
  }
  return { body, notes };
}

function joinQuote(lines: string[]): string {
  const paragraphs: string[] = [];
  let buf: string[] = [];
  for (const line of lines) {
    if (!line.trim()) {
      if (buf.length > 0) {
        paragraphs.push(buf.join(' '));
        buf = [];
      }
      continue;
    }
    buf.push(unwrapQuotes(line.trim()));
  }
  if (buf.length > 0) paragraphs.push(buf.join(' '));
  return paragraphs.filter(Boolean).join('\n\n');
}

function unwrapQuotes(value: string): string {
  return value
    .replace(/^[“”"‘’]+/, '')
    .replace(/[“”"‘’]+$/, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function isDashedAttribution(line: string): boolean {
  const trimmed = line.trim();
  return DASH_PREFIX.test(trimmed) && trimmed.includes(',');
}

function looksLikePersonByline(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 8 || trimmed.length > 180) return false;
  if (/^[“”"‘’]/.test(trimmed)) return false;
  if (JOB_STARTER.test(trimmed)) return false;
  if (DASH_PREFIX.test(trimmed)) return false;
  return /^[A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+)+\s*,\s+\S/.test(trimmed);
}

function splitAttribution(line: string): { name: string; role: string } {
  const cleaned = line.replace(DASH_PREFIX, '').replace(/\s+/g, ' ').trim();
  const parts = cleaned
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return { name: cleaned, role: '' };
  if (parts.length === 1) return { name: parts[0]!, role: '' };
  if (parts.length === 2 && NAME_SUFFIX.test(parts[1]!)) {
    return { name: parts[0]!, role: parts[1]! };
  }

  let name = parts[0]!;
  let index = 1;
  if (parts[1] && NAME_SUFFIX.test(parts[1])) {
    name = `${name}, ${parts[1]}`;
    index = 2;
  }
  return { name, role: parts.slice(index).join(', ') };
}

function findLastIndex<T>(
  items: readonly T[],
  predicate: (item: T) => boolean,
): number {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (predicate(items[index]!)) return index;
  }
  return -1;
}

export function inferVoices(role: string): EndorsementVoice[] {
  const value = role.toLowerCase();
  const voices: EndorsementVoice[] = [];
  if (/(psycholog|neuro|nurse|rn\b|rnbn|therapist|counselor|clinician)/.test(value)) {
    voices.push('clinical');
  }
  if (/(mother|mom\b|artist|retired|recovery|facilitator|partner)/.test(value)) {
    voices.push('lived');
  }
  if (/(friend|reader|supporter)/.test(value)) {
    voices.push('peer');
  }
  if (/(engineer|consultant|analyst|officer|ceo|controller|teacher)/.test(value)) {
    voices.push('professional');
  }
  if (voices.length === 0) voices.push('professional');
  return voices;
}

export function inferThemes(text: string): EndorsementTheme[] {
  const value = text.toLowerCase();
  const themes: EndorsementTheme[] = [];
  if (/peace|happiness|within ourselves|look within|look inward/.test(value)) {
    themes.push('peace-within');
  }
  if (/present|presence|this moment|the now/.test(value)) {
    themes.push('presence');
  }
  if (/authentic/.test(value)) themes.push('authenticity');
  if (/neuro|science|psycholog|mind-body/.test(value)) themes.push('science');
  if (/addict|recovery|compulsive/.test(value)) themes.push('recovery');
  if (/change the world|society needs/.test(value)) {
    themes.push('world-change');
  }
  if (/self-worth|self-esteem|self-love/.test(value)) themes.push('self-worth');
  if (themes.length === 0) themes.push('authenticity');
  return themes;
}

export function inferPlacements(
  voices: readonly EndorsementVoice[],
): EndorsementPlacement[] {
  if (voices.includes('clinical')) {
    return ['cover', 'press', 'amazon', 'website'];
  }
  return ['website', 'amazon'];
}
