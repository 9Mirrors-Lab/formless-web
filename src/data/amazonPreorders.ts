export type AmazonMarketplace = 'Amazon.com' | 'Amazon.ca';

export type AmazonPreorderRow = {
  orderDate: string;
  marketplace: AmazonMarketplace;
  preOrderUnits: number;
};

export type AmazonPreorderDay = {
  orderDate: string;
  label: string;
  units: number;
};

export type AmazonPreorderSnapshot = {
  /** ISO date of the latest order row. */
  asOf: string;
  rows: AmazonPreorderRow[];
};

/** Kindle pre-order units from KDP reports. Update when new orders arrive. */
export const AMAZON_PREORDERS: AmazonPreorderSnapshot = {
  asOf: '2026-08-29',
  rows: [
    { orderDate: '2026-08-29', marketplace: 'Amazon.com', preOrderUnits: 14 },
    { orderDate: '2026-08-27', marketplace: 'Amazon.com', preOrderUnits: 2 },
    { orderDate: '2026-08-27', marketplace: 'Amazon.ca', preOrderUnits: 1 },
    { orderDate: '2026-08-26', marketplace: 'Amazon.com', preOrderUnits: 6 },
    { orderDate: '2026-08-26', marketplace: 'Amazon.ca', preOrderUnits: 1 },
    { orderDate: '2026-08-25', marketplace: 'Amazon.com', preOrderUnits: 7 },
    { orderDate: '2026-08-23', marketplace: 'Amazon.com', preOrderUnits: 4 },
    { orderDate: '2026-08-23', marketplace: 'Amazon.ca', preOrderUnits: 2 },
    { orderDate: '2026-08-22', marketplace: 'Amazon.com', preOrderUnits: 10 },
    { orderDate: '2026-08-22', marketplace: 'Amazon.ca', preOrderUnits: 2 },
    { orderDate: '2026-08-21', marketplace: 'Amazon.com', preOrderUnits: 16 },
    { orderDate: '2026-08-21', marketplace: 'Amazon.ca', preOrderUnits: 1 },
    { orderDate: '2026-08-20', marketplace: 'Amazon.com', preOrderUnits: 2 },
  ],
};

export function formatPreorderDate(iso: string, asOf = AMAZON_PREORDERS.asOf): string {
  if (iso === asOf) return 'Today';

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function amazonPreorderDailyTotals(
  snapshot: AmazonPreorderSnapshot = AMAZON_PREORDERS,
): AmazonPreorderDay[] {
  const byDate = new Map<string, number>();

  for (const row of snapshot.rows) {
    byDate.set(row.orderDate, (byDate.get(row.orderDate) ?? 0) + row.preOrderUnits);
  }

  return [...byDate.entries()]
    .map(([orderDate, units]) => ({
      orderDate,
      label: formatPreorderDate(orderDate, snapshot.asOf),
      units,
    }))
    .sort((a, b) => b.orderDate.localeCompare(a.orderDate));
}

export function amazonPreorderTotal(
  snapshot: AmazonPreorderSnapshot = AMAZON_PREORDERS,
): number {
  return snapshot.rows.reduce((sum, row) => sum + row.preOrderUnits, 0);
}

export function amazonPreorderUnitsForDate(
  orderDate: string,
  snapshot: AmazonPreorderSnapshot = AMAZON_PREORDERS,
): number {
  return snapshot.rows
    .filter((row) => row.orderDate === orderDate)
    .reduce((sum, row) => sum + row.preOrderUnits, 0);
}
