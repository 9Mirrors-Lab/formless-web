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
  kindleRankHistoryFromCapturedAt,
  kindleRankNearestCheckSlot,
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
    expect(AMAZON_KINDLE_RANK.capturedAt).toBe('2026-08-28T19:00:00+00:00');
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

  it('computes deltas from the previous capture to the latest', () => {
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

  it('maps Central Time captures onto the six check windows', () => {
    // 2:00 PM CDT = 19:00 UTC in August
    const midday = kindleRankHistoryFromCapturedAt('2026-08-28T19:00:00+00:00');
    expect(midday.asOf).toBe('2026-08-28');
    expect(midday.timeLabel).toBe('2:00 PM');
    expect(midday.slotReason).toBe('Midday');
    expect(midday.label).toBe('Aug 28 · 2:00 PM');

    // 10:00 PM CDT = 03:00 UTC next calendar day in UTC
    const endOfDay = kindleRankHistoryFromCapturedAt('2026-08-31T03:00:00+00:00');
    expect(endOfDay.asOf).toBe('2026-08-30');
    expect(endOfDay.timeLabel).toBe('10:00 PM');
    expect(endOfDay.slotReason).toBe('End-of-day snapshot');

    expect(kindleRankNearestCheckSlot(2, 5).reason).toBe('Overnight baseline');
    expect(kindleRankNearestCheckSlot(18, 0).reason).toBe(
      'Evening shopping window',
    );
  });
});
