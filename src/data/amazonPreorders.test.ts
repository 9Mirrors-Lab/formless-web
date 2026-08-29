import { describe, expect, it } from 'vitest';

import {
  AMAZON_PREORDERS,
  amazonPreorderDailyTotals,
  amazonPreorderTotal,
  amazonPreorderUnitsForDate,
  formatPreorderDate,
} from '@/data/amazonPreorders';

describe('amazonPreorders', () => {
  it('aggregates pre-order units by day', () => {
    expect(amazonPreorderUnitsForDate('2026-08-27')).toBe(3);
    expect(amazonPreorderUnitsForDate('2026-08-26')).toBe(7);
    expect(amazonPreorderUnitsForDate('2026-08-21')).toBe(17);
  });

  it('orders daily totals newest first', () => {
    const daily = amazonPreorderDailyTotals();
    expect(daily[0]?.orderDate).toBe('2026-08-29');
    expect(daily[0]?.units).toBe(14);
    expect(daily.at(-1)?.orderDate).toBe('2026-08-20');
  });

  it('sums the full pre-order total', () => {
    expect(amazonPreorderTotal()).toBe(68);
  });

  it('labels today from the snapshot as-of date', () => {
    expect(formatPreorderDate('2026-08-29', AMAZON_PREORDERS.asOf)).toBe('Today');
    expect(formatPreorderDate('2026-08-26', AMAZON_PREORDERS.asOf)).toBe('Aug 26');
  });
});
