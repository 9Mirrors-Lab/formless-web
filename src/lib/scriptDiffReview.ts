/** Persist review status for book-vs-audio differences. */

import type { DiffChunk, DiffKind } from '@/lib/scriptWordDiff';

export const DIFF_REVIEW_STORAGE_KEY = 'formless.scriptCompare.reviews';

export type DiffReviewStatus =
  | 'cleared'
  | 'as-spoken'
  | 'needs-update'
  | 'record';

export type DiffReviewFilter =
  | 'open'
  | 'cleared'
  | 'as-spoken'
  | 'needs-update'
  | 'record'
  | 'all';

const REVIEW_STATUSES: readonly DiffReviewStatus[] = [
  'cleared',
  'as-spoken',
  'needs-update',
  'record',
];

export function isDiffReviewStatus(value: unknown): value is DiffReviewStatus {
  return REVIEW_STATUSES.includes(value as DiffReviewStatus);
}

export function normalizeReviewStatus(value: unknown): DiffReviewStatus | null {
  return isDiffReviewStatus(value) ? value : null;
}

export type DiffReviewRecord = {
  status: DiffReviewStatus;
  updatedAt: string;
};

export type DiffReviewStore = Record<string, DiffReviewRecord>;

export type DiffReviewScope = {
  chapterId: number;
  model: string;
};

const CONTEXT_WORDS = 3;

function neighborKeys(
  chunks: DiffChunk[],
  index: number,
  side: 'before' | 'after',
): string {
  if (side === 'before') {
    for (let i = index - 1; i >= 0; i -= 1) {
      const chunk = chunks[i];
      if (!chunk || chunk.kind !== 'equal') continue;
      return chunk.left
        .map((token) => token.key)
        .slice(-CONTEXT_WORDS)
        .join(' ');
    }
    return '';
  }
  for (let i = index + 1; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    if (!chunk || chunk.kind !== 'equal') continue;
    return chunk.left
      .map((token) => token.key)
      .slice(0, CONTEXT_WORDS)
      .join(' ');
  }
  return '';
}

export function reviewStoreKey(
  chapterId: number,
  model: string,
  fingerprint: string,
): string {
  return `${chapterId}:${model}:${fingerprint}`;
}

/** Stable ids for differences so a review survives later chunk-id shifts. */
export function differenceFingerprints(
  chunks: DiffChunk[],
): Map<number, string> {
  const seen = new Map<string, number>();
  const out = new Map<number, string>();
  chunks.forEach((chunk, index) => {
    if (chunk.kind === 'equal') return;
    const left = chunk.left.map((token) => token.key).join(' ');
    const right = chunk.right.map((token) => token.key).join(' ');
    const before = neighborKeys(chunks, index, 'before');
    const after = neighborKeys(chunks, index, 'after');
    const base = `${chunk.kind}|${left}|${right}|${before}|${after}`;
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    out.set(chunk.id, n === 0 ? base : `${base}#${n}`);
  });
  return out;
}

export function statusForFingerprint(
  store: DiffReviewStore,
  scope: DiffReviewScope & { fingerprint: string },
): DiffReviewStatus | null {
  return (
    store[reviewStoreKey(scope.chapterId, scope.model, scope.fingerprint)]
      ?.status ?? null
  );
}

export function upsertReviewStatus(
  store: DiffReviewStore,
  input: DiffReviewScope & {
    fingerprint: string;
    status: DiffReviewStatus | null;
  },
): DiffReviewStore {
  const key = reviewStoreKey(input.chapterId, input.model, input.fingerprint);
  const next = { ...store };
  if (input.status == null) {
    delete next[key];
    return next;
  }
  next[key] = {
    status: input.status,
    updatedAt: new Date().toISOString(),
  };
  return next;
}

export function filterDifferenceIds(
  differenceIds: readonly number[],
  fingerprints: Map<number, string>,
  store: DiffReviewStore,
  scope: DiffReviewScope,
  filter: DiffReviewFilter,
): number[] {
  if (filter === 'all') return [...differenceIds];
  return differenceIds.filter((id) => {
    const fingerprint = fingerprints.get(id);
    if (!fingerprint) return filter === 'open';
    const status = statusForFingerprint(store, { ...scope, fingerprint });
    switch (filter) {
      case 'open':
        return status == null;
      case 'cleared':
        return status === 'cleared';
      case 'as-spoken':
        return status === 'as-spoken';
      case 'needs-update':
        return status === 'needs-update';
      case 'record':
        return status === 'record';
      default: {
        const _exhaustive: never = filter;
        return _exhaustive;
      }
    }
  });
}

export type DiffReviewCounts = {
  open: number;
  cleared: number;
  asSpoken: number;
  needsUpdate: number;
  record: number;
  all: number;
};

export function reviewCounts(
  differenceIds: readonly number[],
  fingerprints: Map<number, string>,
  store: DiffReviewStore,
  scope: DiffReviewScope,
): DiffReviewCounts {
  let open = 0;
  let cleared = 0;
  let asSpoken = 0;
  let needsUpdate = 0;
  let record = 0;
  for (const id of differenceIds) {
    const fingerprint = fingerprints.get(id);
    const status = fingerprint
      ? statusForFingerprint(store, { ...scope, fingerprint })
      : null;
    if (status === 'cleared') cleared += 1;
    else if (status === 'as-spoken') asSpoken += 1;
    else if (status === 'needs-update') needsUpdate += 1;
    else if (status === 'record') record += 1;
    else open += 1;
  }
  return {
    open,
    cleared,
    asSpoken,
    needsUpdate,
    record,
    all: differenceIds.length,
  };
}

export const EMPTY_REVIEW_COUNTS: DiffReviewCounts = {
  open: 0,
  cleared: 0,
  asSpoken: 0,
  needsUpdate: 0,
  record: 0,
  all: 0,
};

export function addReviewCounts(
  a: DiffReviewCounts,
  b: DiffReviewCounts,
): DiffReviewCounts {
  return {
    open: a.open + b.open,
    cleared: a.cleared + b.cleared,
    asSpoken: a.asSpoken + b.asSpoken,
    needsUpdate: a.needsUpdate + b.needsUpdate,
    record: a.record + b.record,
    all: a.all + b.all,
  };
}

export function aggregateReviewCounts(
  parts: readonly DiffReviewCounts[],
): DiffReviewCounts {
  return parts.reduce(addReviewCounts, EMPTY_REVIEW_COUNTS);
}

export type ScriptDiffReviewRow = {
  book_slug: string;
  chapter_id: number;
  script_model: string;
  fingerprint: string;
  fingerprint_key: string;
  status: string;
  updated_at: string;
  id?: string;
  created_at?: string;
};

export type ScriptDiffReviewDetailRow = ScriptDiffReviewRow & {
  id: string;
  created_at: string;
};

export type DifferenceKind = Exclude<DiffKind, 'equal'>;

export type ParsedDifferenceFingerprint = {
  kind: DifferenceKind;
  book: string;
  audio: string;
  before: string;
  after: string;
  occurrence: number;
};

function isDifferenceKind(value: string): value is DifferenceKind {
  return value === 'delete' || value === 'insert' || value === 'replace';
}

/** Unpack the stored book-vs-audio fingerprint into readable parts. */
export function parseDifferenceFingerprint(
  fingerprint: string,
): ParsedDifferenceFingerprint | null {
  const hashMatch = /#(\d+)$/.exec(fingerprint);
  const occurrence = hashMatch ? Number(hashMatch[1]) : 0;
  const raw = hashMatch ? fingerprint.slice(0, hashMatch.index) : fingerprint;
  const parts = raw.split('|');
  if (parts.length !== 5) return null;
  const kind = parts[0];
  if (!kind || !isDifferenceKind(kind)) return null;
  return {
    kind,
    book: parts[1] ?? '',
    audio: parts[2] ?? '',
    before: parts[3] ?? '',
    after: parts[4] ?? '',
    occurrence,
  };
}

export type RecordReviewChapterGroup = {
  chapterId: number;
  rows: ScriptDiffReviewDetailRow[];
};

export function groupReviewRowsByChapter(
  rows: readonly ScriptDiffReviewDetailRow[],
  chapterOrder: readonly number[],
): RecordReviewChapterGroup[] {
  const byChapter = new Map<number, ScriptDiffReviewDetailRow[]>();
  for (const row of rows) {
    const list = byChapter.get(row.chapter_id) ?? [];
    list.push(row);
    byChapter.set(row.chapter_id, list);
  }
  const seen = new Set<number>();
  const groups: RecordReviewChapterGroup[] = [];
  for (const chapterId of chapterOrder) {
    const list = byChapter.get(chapterId);
    if (!list || list.length === 0) continue;
    seen.add(chapterId);
    groups.push({
      chapterId,
      rows: [...list].sort((a, b) => a.updated_at.localeCompare(b.updated_at)),
    });
  }
  const leftover = [...byChapter.keys()]
    .filter((chapterId) => !seen.has(chapterId))
    .sort((a, b) => a - b);
  for (const chapterId of leftover) {
    const list = byChapter.get(chapterId);
    if (!list) continue;
    groups.push({
      chapterId,
      rows: [...list].sort((a, b) => a.updated_at.localeCompare(b.updated_at)),
    });
  }
  return groups;
}

export const SCRIPT_DIFF_REVIEW_BOOK_SLUG = 'formless';

export function parseReviewStoreKey(
  key: string,
): { chapterId: number; model: string; fingerprint: string } | null {
  const match = /^(\d+):(base|medium):(.*)$/.exec(key);
  if (!match) return null;
  return {
    chapterId: Number(match[1]),
    model: match[2]!,
    fingerprint: match[3]!,
  };
}

export function rowsToReviewStore(
  rows: readonly ScriptDiffReviewRow[],
): DiffReviewStore {
  const store: DiffReviewStore = {};
  for (const row of rows) {
    const status = normalizeReviewStatus(row.status);
    if (!status) continue;
    store[reviewStoreKey(row.chapter_id, row.script_model, row.fingerprint)] = {
      status,
      updatedAt: row.updated_at,
    };
  }
  return store;
}

export function mergeReviewStores(
  local: DiffReviewStore,
  remote: DiffReviewStore,
): DiffReviewStore {
  const merged: DiffReviewStore = { ...remote };
  for (const [key, record] of Object.entries(local)) {
    const existing = merged[key];
    if (!existing || record.updatedAt > existing.updatedAt) {
      merged[key] = record;
    }
  }
  return merged;
}

export function readReviewStore(): DiffReviewStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(DIFF_REVIEW_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    const store: DiffReviewStore = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!value || typeof value !== 'object' || !('status' in value)) continue;
      const status = normalizeReviewStatus(value.status);
      if (!status) continue;
      store[key] = {
        status,
        updatedAt:
          'updatedAt' in value && typeof value.updatedAt === 'string'
            ? value.updatedAt
            : '',
      };
    }
    return store;
  } catch {
    return {};
  }
}

export function writeReviewStore(store: DiffReviewStore): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DIFF_REVIEW_STORAGE_KEY, JSON.stringify(store));
}
