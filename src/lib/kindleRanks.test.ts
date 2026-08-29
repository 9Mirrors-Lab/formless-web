import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AMAZON_KINDLE_RANK } from '@/data/amazonRankings';
import {
  kindleRankAsOf,
  kindleRankHistoryLabel,
  mapKindleRankRows,
  type KindleRankRow,
} from '@/lib/kindleRanks';

const SAMPLE_ROWS: KindleRankRow[] = [
  {
    id: 'a',
    best_seller_rank: 70_468,
    personal_transformation_spirituality: 32,
    dating_relationships_spirituality: 47,
    spiritual_healing: 59,
    captured_at: '2026-08-26T12:00:00+00:00',
    created_at: '2026-08-26T12:00:00+00:00',
  },
  {
    id: 'b',
    best_seller_rank: 58_953,
    personal_transformation_spirituality: 30,
    dating_relationships_spirituality: 44,
    spiritual_healing: 53,
    captured_at: '2026-08-27T12:00:00+00:00',
    created_at: '2026-08-27T12:00:00+00:00',
  },
  {
    id: 'c',
    best_seller_rank: 51_869,
    personal_transformation_spirituality: 23,
    dating_relationships_spirituality: 37,
    spiritual_healing: 40,
    captured_at: '2026-08-28T12:00:00+00:00',
    created_at: '2026-08-28T12:00:00+00:00',
  },
];

describe('kindleRanks', () => {
  it('derives UTC as-of dates and short history labels', () => {
    expect(kindleRankAsOf('2026-08-28T12:00:00+00:00')).toBe('2026-08-28');
    expect(kindleRankHistoryLabel('2026-08-26')).toBe('Aug 26');
  });

  it('builds a snapshot matching the Brand Studio fixture', () => {
    const snapshot = mapKindleRankRows([...SAMPLE_ROWS].reverse());
    expect(snapshot).not.toBeNull();
    expect(snapshot?.storeRank).toBe(AMAZON_KINDLE_RANK.storeRank);
    expect(snapshot?.personalTransformation.rank).toBe(
      AMAZON_KINDLE_RANK.personalTransformation.rank,
    );
    expect(snapshot?.datingRelationships.rank).toBe(
      AMAZON_KINDLE_RANK.datingRelationships.rank,
    );
    expect(snapshot?.spiritualHealing.rank).toBe(
      AMAZON_KINDLE_RANK.spiritualHealing.rank,
    );
    expect(snapshot?.asOf).toBe('2026-08-28');
    expect(snapshot?.history).toHaveLength(3);
    expect(snapshot?.history.map((entry) => entry.asOf)).toEqual([
      '2026-08-26',
      '2026-08-27',
      '2026-08-28',
    ]);
  });

  it('returns null for an empty row set', () => {
    expect(mapKindleRankRows([])).toBeNull();
  });
});

describe('fetchKindleRanks', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('maps Supabase rows into a ready snapshot', async () => {
    const order = vi.fn().mockResolvedValue({ data: SAMPLE_ROWS, error: null });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });

    vi.doMock('@/lib/supabase', () => ({
      hasSupabaseEnv: () => true,
      getBrowserSupabaseClient: () => ({ from }),
    }));

    const { fetchKindleRanks } = await import('@/lib/kindleRanks');
    const result = await fetchKindleRanks();

    expect(from).toHaveBeenCalledWith('kindle_ranks');
    expect(select).toHaveBeenCalled();
    expect(order).toHaveBeenCalledWith('captured_at', { ascending: true });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.snapshot.storeRank).toBe(51_869);
      expect(result.rows).toHaveLength(3);
    }
  });

  it('returns an error when Supabase is not configured', async () => {
    vi.doMock('@/lib/supabase', () => ({
      hasSupabaseEnv: () => false,
      getBrowserSupabaseClient: () => {
        throw new Error('should not create a client');
      },
    }));

    const { fetchKindleRanks } = await import('@/lib/kindleRanks');
    const result = await fetchKindleRanks();
    expect(result).toEqual({
      ok: false,
      error: 'Supabase is not configured in this environment.',
    });
  });
});
