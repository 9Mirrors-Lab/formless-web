import { describe, expect, it } from 'vitest';

import { diffManuscriptTexts } from '@/lib/scriptWordDiff';
import {
  differenceFingerprints,
  filterDifferenceIds,
  mergeReviewStores,
  parseReviewStoreKey,
  reviewCounts,
  reviewStoreKey,
  rowsToReviewStore,
  statusForFingerprint,
  upsertReviewStatus,
  type DiffReviewStore,
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

  it('filters and counts open, cleared, and needs-update differences', () => {
    const result = diffManuscriptTexts(
      'one missing two extra three swapped four',
      'one two bonus three changed four',
    );
    const fingerprints = differenceFingerprints(result.chunks);
    let store: DiffReviewStore = {};
    const [firstId, secondId] = result.differenceIds;
    expect(firstId).toBeDefined();
    expect(secondId).toBeDefined();

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
      status: 'needs-update',
    });

    const scope = { chapterId: 4 as const, model: 'base' as const };
    expect(
      filterDifferenceIds(result.differenceIds, fingerprints, store, scope, 'open')
        .length,
    ).toBeGreaterThan(0);
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
        'needs-update',
      ),
    ).toEqual([secondId]);

    const counts = reviewCounts(
      result.differenceIds,
      fingerprints,
      store,
      scope,
    );
    expect(counts.cleared).toBe(1);
    expect(counts.needsUpdate).toBe(1);
    expect(counts.open).toBe(result.differenceIds.length - 2);
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
});
