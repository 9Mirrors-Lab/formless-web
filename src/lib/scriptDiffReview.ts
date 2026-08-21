/** Persist review status for book-vs-audio differences. */

import type { DiffChunk } from '@/lib/scriptWordDiff';

export const DIFF_REVIEW_STORAGE_KEY = 'formless.scriptCompare.reviews';

export type DiffReviewStatus = 'cleared' | 'needs-update';

export type DiffReviewFilter = 'open' | 'cleared' | 'needs-update' | 'all';

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
  return store[reviewStoreKey(scope.chapterId, scope.model, scope.fingerprint)]
    ?.status ?? null;
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
      case 'needs-update':
        return status === 'needs-update';
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
  needsUpdate: number;
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
  let needsUpdate = 0;
  for (const id of differenceIds) {
    const fingerprint = fingerprints.get(id);
    const status = fingerprint
      ? statusForFingerprint(store, { ...scope, fingerprint })
      : null;
    if (status === 'cleared') cleared += 1;
    else if (status === 'needs-update') needsUpdate += 1;
    else open += 1;
  }
  return {
    open,
    cleared,
    needsUpdate,
    all: differenceIds.length,
  };
}

export type ScriptDiffReviewRow = {
  book_slug: string;
  chapter_id: number;
  script_model: string;
  fingerprint: string;
  fingerprint_key: string;
  status: DiffReviewStatus;
  updated_at: string;
};

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
    if (row.status !== 'cleared' && row.status !== 'needs-update') continue;
    store[reviewStoreKey(row.chapter_id, row.script_model, row.fingerprint)] = {
      status: row.status,
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
      if (
        value &&
        typeof value === 'object' &&
        'status' in value &&
        (value.status === 'cleared' || value.status === 'needs-update')
      ) {
        store[key] = {
          status: value.status,
          updatedAt:
            'updatedAt' in value && typeof value.updatedAt === 'string'
              ? value.updatedAt
              : '',
        };
      }
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
