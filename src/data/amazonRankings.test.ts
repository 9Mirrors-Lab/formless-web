import { describe, expect, it } from 'vitest';

import {
  AMAZON_KINDLE_RANK,
  amazonBestMovement,
  amazonImprovedCategoryCount,
  amazonRankDelta,
  amazonRankDeltasFromHistory,
  amazonRankDisplayRows,
  formatAmazonRank,
  formatAmazonRankAsOf,
  formatAmazonRankDelta,
} from '@/data/amazonRankings';

describe('amazonRankings', () => {
  it('formats rank numbers with grouping', () => {
    expect(formatAmazonRank(51_869)).toBe('#51,869');
    expect(formatAmazonRank(23)).toBe('#23');
  });

  it('keeps the offline fixture fields', () => {
    expect(AMAZON_KINDLE_RANK.storeRank).toBe(51_869);
    expect(AMAZON_KINDLE_RANK.personalTransformation.rank).toBe(23);
    expect(AMAZON_KINDLE_RANK.datingRelationships.rank).toBe(37);
    expect(AMAZON_KINDLE_RANK.spiritualHealing.rank).toBe(40);
    expect(AMAZON_KINDLE_RANK.history).toHaveLength(3);
  });

  it('orders Kindle Store first, then the three categories', () => {
    const rows = amazonRankDisplayRows();
    expect(rows.map((row) => row.key)).toEqual([
      'store',
      'personalTransformation',
      'datingRelationships',
      'spiritualHealing',
    ]);
    expect(rows[0]?.rank).toBe(51_869);
    expect(rows[1]?.rank).toBe(23);
  });

  it('names today from the as-of date', () => {
    const now = new Date(2026, 7, 28, 12, 0, 0);
    expect(formatAmazonRankAsOf('2026-08-28', now)).toBe('Checked today');
    expect(formatAmazonRankAsOf('2026-08-27', now)).toBe('Checked yesterday');
  });

  it('treats a lower rank as an improvement', () => {
    expect(amazonRankDelta(32, 30)).toBe(2);
    expect(amazonRankDelta(70_468, 58_953)).toBe(11_515);
    expect(formatAmazonRankDelta(11_515)).toBe('↑ 11,515');
    expect(formatAmazonRankDelta(-3)).toBe('↓ 3');
  });

  it('computes deltas from Aug 27 to today', () => {
    expect(amazonRankDeltasFromHistory()).toEqual({
      store: 7_084,
      personalTransformation: 7,
      datingRelationships: 7,
      spiritualHealing: 13,
    });
    expect(amazonImprovedCategoryCount()).toBe(4);
    expect(amazonBestMovement()).toEqual({
      label: 'Kindle Store',
      delta: 7_084,
    });
  });
});
