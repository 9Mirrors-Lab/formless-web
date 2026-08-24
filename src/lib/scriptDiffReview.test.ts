import { describe, expect, it } from 'vitest';

import { diffManuscriptTexts } from '@/lib/scriptWordDiff';
import {
  aggregateReviewCounts,
  differenceFingerprints,
  filterDifferenceIds,
  groupReviewRowsByChapter,
  mergeReviewStores,
  normalizeReviewStatus,
  parseDifferenceFingerprint,
  parseReviewStoreKey,
  reviewCounts,
  reviewStoreKey,
  rowsToReviewStore,
  statusForFingerprint,
  upsertReviewStatus,
  type DiffReviewStore,
  type ScriptDiffReviewDetailRow,
} from '@/lib/scriptDiffReview';

describe('scriptDiffReview', () => {
  it('keeps the same fingerprint when an earlier difference shifts chunk ids', () => {
    const first = diffManuscriptTexts(
      'Hello the story had embedded itself so deeply now',
      'Hello the story so deeply now',
    );
    const later = diffManuscriptTexts(
      'Intro Hello the story had embedded itself so deeply now',
      'Preface Intro Hello the story so deeply now',
    );

    const firstMap = differenceFingerprints(first.chunks);
    const laterMap = differenceFingerprints(later.chunks);

    const firstDelete = first.chunks.find((chunk) => chunk.kind === 'delete');
    const laterDelete = later.chunks.find((chunk) => chunk.kind === 'delete');
    expect(firstDelete).toBeTruthy();
    expect(laterDelete).toBeTruthy();
    expect(firstDelete!.id).not.toBe(laterDelete!.id);
    expect(firstMap.get(firstDelete!.id)).toBe(laterMap.get(laterDelete!.id));
  });

  it('gives different fingerprints to the same words in different places', () => {
    const result = diffManuscriptTexts(
      'alpha missing word one beta missing word two',
      'alpha one beta two',
    );
    const deletes = result.chunks.filter((chunk) => chunk.kind === 'delete');
    expect(deletes).toHaveLength(2);
    const map = differenceFingerprints(result.chunks);
    expect(map.get(deletes[0]!.id)).not.toBe(map.get(deletes[1]!.id));
  });

  it('scopes stored status by chapter and whisper model', () => {
    const empty: DiffReviewStore = {};
    const next = upsertReviewStatus(empty, {
      chapterId: 2,
      model: 'medium',
      fingerprint: 'delete|had embedded|',
      status: 'cleared',
    });

    expect(
      statusForFingerprint(next, {
        chapterId: 2,
        model: 'medium',
        fingerprint: 'delete|had embedded|',
      }),
    ).toBe('cleared');
    expect(
      statusForFingerprint(next, {
        chapterId: 2,
        model: 'base',
        fingerprint: 'delete|had embedded|',
      }),
    ).toBeNull();
    expect(reviewStoreKey(2, 'medium', 'delete|had embedded|')).toContain(
      '2:medium:',
    );
  });

  it('filters and counts open, cleared, as-spoken, needs-update, and record differences', () => {
    const result = diffManuscriptTexts(
      'one missing two extra three swapped four',
      'one two bonus three changed four',
    );
    const fingerprints = differenceFingerprints(result.chunks);
    let store: DiffReviewStore = {};
    const [firstId, secondId, thirdId] = result.differenceIds;
    expect(firstId).toBeDefined();
    expect(secondId).toBeDefined();
    expect(thirdId).toBeDefined();

    store = upsertReviewStatus(store, {
      chapterId: 4,
      model: 'base',
      fingerprint: fingerprints.get(firstId!)!,
      status: 'cleared',
    });
    store = upsertReviewStatus(store, {
      chapterId: 4,
      model: 'base',
      fingerprint: fingerprints.get(secondId!)!,
      status: 'as-spoken',
    });
    store = upsertReviewStatus(store, {
      chapterId: 4,
      model: 'base',
      fingerprint: fingerprints.get(thirdId!)!,
      status: 'needs-update',
    });

    const scope = { chapterId: 4 as const, model: 'base' as const };
    expect(
      filterDifferenceIds(result.differenceIds, fingerprints, store, scope, 'open')
        .length,
    ).toBe(result.differenceIds.length - 3);
    expect(
      filterDifferenceIds(
        result.differenceIds,
        fingerprints,
        store,
        scope,
        'cleared',
      ),
    ).toEqual([firstId]);
    expect(
      filterDifferenceIds(
        result.differenceIds,
        fingerprints,
        store,
        scope,
        'as-spoken',
      ),
    ).toEqual([secondId]);
    expect(
      filterDifferenceIds(
        result.differenceIds,
        fingerprints,
        store,
        scope,
        'needs-update',
      ),
    ).toEqual([thirdId]);

    const counts = reviewCounts(
      result.differenceIds,
      fingerprints,
      store,
      scope,
    );
    expect(counts.cleared).toBe(1);
    expect(counts.asSpoken).toBe(1);
    expect(counts.needsUpdate).toBe(1);
    expect(counts.record).toBe(0);
    expect(counts.open).toBe(result.differenceIds.length - 3);
    expect(counts.all).toBe(result.differenceIds.length);
  });

  it('clears a status back to open when set to null', () => {
    const store = upsertReviewStatus(
      upsertReviewStatus(
        {},
        {
          chapterId: 6,
          model: 'medium',
          fingerprint: 'abc',
          status: 'needs-update',
        },
      ),
      {
        chapterId: 6,
        model: 'medium',
        fingerprint: 'abc',
        status: null,
      },
    );
    expect(
      statusForFingerprint(store, {
        chapterId: 6,
        model: 'medium',
        fingerprint: 'abc',
      }),
    ).toBeNull();
  });

  it('parses a stored review key back into chapter, model, and fingerprint', () => {
    const key = reviewStoreKey(2, 'medium', 'delete|had embedded itself|hello the story');
    expect(parseReviewStoreKey(key)).toEqual({
      chapterId: 2,
      model: 'medium',
      fingerprint: 'delete|had embedded itself|hello the story',
    });
    expect(parseReviewStoreKey('not-a-key')).toBeNull();
  });

  it('filters record marks separately from needs-update', () => {
    const store = upsertReviewStatus(
      {},
      {
        chapterId: 2,
        model: 'medium',
        fingerprint: 'delete|chapter|',
        status: 'record',
      },
    );
    const fingerprints = new Map<number, string>([[11, 'delete|chapter|']]);
    const scope = { chapterId: 2, model: 'medium' };
    expect(
      filterDifferenceIds([11], fingerprints, store, scope, 'record'),
    ).toEqual([11]);
    expect(
      filterDifferenceIds([11], fingerprints, store, scope, 'needs-update'),
    ).toEqual([]);
    expect(
      reviewCounts([11], fingerprints, store, scope).record,
    ).toBe(1);
  });

  it('rebuilds the review store from supabase rows', () => {
    const store = rowsToReviewStore([
      {
        book_slug: 'formless',
        chapter_id: 2,
        script_model: 'medium',
        fingerprint: 'delete|had embedded|',
        fingerprint_key: 'abc',
        status: 'cleared',
        updated_at: '2026-08-21T20:00:00.000Z',
      },
    ]);
    expect(
      statusForFingerprint(store, {
        chapterId: 2,
        model: 'medium',
        fingerprint: 'delete|had embedded|',
      }),
    ).toBe('cleared');
  });

  it('keeps looks-fine, as-spoken, needs-update, and record as separate marks', () => {
    expect(normalizeReviewStatus('cleared')).toBe('cleared');
    expect(normalizeReviewStatus('as-spoken')).toBe('as-spoken');
    expect(normalizeReviewStatus('needs-update')).toBe('needs-update');
    expect(normalizeReviewStatus('record')).toBe('record');
    expect(normalizeReviewStatus('open')).toBeNull();
  });

  it('keeps the newer status when merging local cache with supabase', () => {
    const local: DiffReviewStore = {
      '2:medium:one': {
        status: 'needs-update',
        updatedAt: '2026-08-21T21:00:00.000Z',
      },
      '2:medium:two': {
        status: 'cleared',
        updatedAt: '2026-08-21T18:00:00.000Z',
      },
    };
    const remote: DiffReviewStore = {
      '2:medium:two': {
        status: 'needs-update',
        updatedAt: '2026-08-21T19:00:00.000Z',
      },
      '2:medium:three': {
        status: 'cleared',
        updatedAt: '2026-08-21T20:00:00.000Z',
      },
    };
    const merged = mergeReviewStores(local, remote);
    expect(merged['2:medium:one']?.status).toBe('needs-update');
    expect(merged['2:medium:two']?.status).toBe('needs-update');
    expect(merged['2:medium:three']?.status).toBe('cleared');
  });

  it('adds review counts across chapters for a whole-book total', () => {
    const book = aggregateReviewCounts([
      {
        open: 15,
        cleared: 1,
        asSpoken: 1,
        needsUpdate: 0,
        record: 2,
        all: 19,
      },
      {
        open: 40,
        cleared: 2,
        asSpoken: 0,
        needsUpdate: 3,
        record: 1,
        all: 46,
      },
    ]);
    expect(book).toEqual({
      open: 55,
      cleared: 3,
      asSpoken: 1,
      needsUpdate: 3,
      record: 3,
      all: 65,
    });
    expect(aggregateReviewCounts([])).toEqual({
      open: 0,
      cleared: 0,
      asSpoken: 0,
      needsUpdate: 0,
      record: 0,
      all: 0,
    });
  });

  it('unpacks stored fingerprints into book, audio, and neighbor words', () => {
    expect(
      parseDifferenceFingerprint(
        'replace|smaller|similar|or unfairness these|moments matter because',
      ),
    ).toEqual({
      kind: 'replace',
      book: 'smaller',
      audio: 'similar',
      before: 'or unfairness these',
      after: 'moments matter because',
      occurrence: 0,
    });
    expect(
      parseDifferenceFingerprint(
        'delete|chapter|||2 awareness and',
      ),
    ).toEqual({
      kind: 'delete',
      book: 'chapter',
      audio: '',
      before: '',
      after: '2 awareness and',
      occurrence: 0,
    });
    expect(
      parseDifferenceFingerprint('replace|are|were|when you|present#1'),
    ).toEqual({
      kind: 'replace',
      book: 'are',
      audio: 'were',
      before: 'when you',
      after: 'present',
      occurrence: 1,
    });
    expect(parseDifferenceFingerprint('cleared|nope')).toBeNull();
  });

  it('groups record rows by listen order and mark time', () => {
    const rows: ScriptDiffReviewDetailRow[] = [
      {
        id: 'later-ch4',
        book_slug: 'formless',
        chapter_id: 4,
        script_model: 'medium',
        fingerprint: 'replace|your|the|life they were|inner refusal of',
        fingerprint_key: 'b',
        status: 'record',
        created_at: '2026-08-22T19:16:43.000Z',
        updated_at: '2026-08-22T19:16:43.702Z',
      },
      {
        id: 'ch2',
        book_slug: 'formless',
        chapter_id: 2,
        script_model: 'medium',
        fingerprint: 'delete|chapter|||2 awareness and',
        fingerprint_key: 'a',
        status: 'record',
        created_at: '2026-08-22T18:55:42.000Z',
        updated_at: '2026-08-22T18:55:42.062Z',
      },
      {
        id: 'earlier-ch4',
        book_slug: 'formless',
        chapter_id: 4,
        script_model: 'medium',
        fingerprint: 'replace|smaller|similar|or unfairness these|moments matter because',
        fingerprint_key: 'c',
        status: 'record',
        created_at: '2026-08-22T19:16:43.000Z',
        updated_at: '2026-08-22T19:16:43.374Z',
      },
    ];
    const groups = groupReviewRowsByChapter(rows, [13, 0, 1, 2, 3, 4, 5, 6]);
    expect(groups.map((group) => group.chapterId)).toEqual([2, 4]);
    expect(groups[0]?.rows.map((row) => row.id)).toEqual(['ch2']);
    expect(groups[1]?.rows.map((row) => row.id)).toEqual([
      'earlier-ch4',
      'later-ch4',
    ]);
  });
});
