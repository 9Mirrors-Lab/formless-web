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
    expect(formatAmazonRank(58_953)).toBe('#58,953');
    expect(formatAmazonRank(30)).toBe('#30');
  });

  it('keeps the live snapshot fields', () => {
    expect(AMAZON_KINDLE_RANK.storeRank).toBe(58_953);
    expect(AMAZON_KINDLE_RANK.personalTransformation.rank).toBe(30);
    expect(AMAZON_KINDLE_RANK.datingRelationships.rank).toBe(44);
    expect(AMAZON_KINDLE_RANK.spiritualHealing.rank).toBe(53);
    expect(AMAZON_KINDLE_RANK.history).toHaveLength(2);
  });

  it('orders Kindle Store first, then the three categories', () => {
    const rows = amazonRankDisplayRows();
    expect(rows.map((row) => row.key)).toEqual([
      'store',
      'personalTransformation',
      'datingRelationships',
      'spiritualHealing',
    ]);
    expect(rows[0]?.rank).toBe(58_953);
    expect(rows[1]?.rank).toBe(30);
  });

  it('names today from the as-of date', () => {
    const now = new Date(2026, 7, 27, 12, 0, 0);
    expect(formatAmazonRankAsOf('2026-08-27', now)).toBe('Checked today');
    expect(formatAmazonRankAsOf('2026-08-26', now)).toBe('Checked yesterday');
  });

  it('treats a lower rank as an improvement', () => {
    expect(amazonRankDelta(32, 30)).toBe(2);
    expect(amazonRankDelta(70_468, 58_953)).toBe(11_515);
    expect(formatAmazonRankDelta(11_515)).toBe('↑ 11,515');
    expect(formatAmazonRankDelta(-3)).toBe('↓ 3');
  });

  it('computes deltas from Aug 26 to today', () => {
    expect(amazonRankDeltasFromHistory()).toEqual({
      store: 11_515,
      personalTransformation: 2,
      datingRelationships: 3,
      spiritualHealing: 6,
    });
    expect(amazonImprovedCategoryCount()).toBe(4);
    expect(amazonBestMovement()).toEqual({
      label: 'Kindle Store',
      delta: 11_515,
    });
  });
});
