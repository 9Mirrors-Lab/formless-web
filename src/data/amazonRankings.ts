import { kindlePreorderHref } from '@/data/preorderLanding';

export type AmazonRankKey =
  | 'store'
  | 'personalTransformation'
  | 'datingRelationships'
  | 'spiritualHealing';

export type AmazonRankPoint = {
  key: AmazonRankKey;
  label: string;
  shortLabel: string;
  rank: number;
};

export type KindleRankCheckSlot = {
  hour: number;
  minute: number;
  reason: string;
};

/** Six Central Time capture windows for Kindle rank checks. */
export const KINDLE_RANK_CT_ZONE = 'America/Chicago';

export const KINDLE_RANK_CHECK_SLOTS: readonly KindleRankCheckSlot[] = [
  { hour: 2, minute: 0, reason: 'Overnight baseline' },
  { hour: 6, minute: 0, reason: 'Early-morning state' },
  { hour: 10, minute: 0, reason: 'Morning shopping activity' },
  { hour: 14, minute: 0, reason: 'Midday' },
  { hour: 18, minute: 0, reason: 'Evening shopping window' },
  { hour: 22, minute: 0, reason: 'End-of-day snapshot' },
] as const;

export type AmazonRankHistoryEntry = {
  /** Full capture timestamp from the database. */
  capturedAt: string;
  /** Calendar date in Central Time (YYYY-MM-DD). */
  asOf: string;
  /** Primary history label, e.g. "Aug 30 · 2:00 PM". */
  label: string;
  /** Clock label in Central Time, e.g. "2:00 PM". */
  timeLabel: string;
  /** Matched check-window reason. */
  slotReason: string;
  storeRank: number;
  personalTransformation: number;
  datingRelationships: number;
  spiritualHealing: number;
};

export type AmazonKindleRankSnapshot = {
  storeRank: number;
  storeLabel: string;
  personalTransformation: AmazonRankPoint;
  datingRelationships: AmazonRankPoint;
  spiritualHealing: AmazonRankPoint;
  /** Central Time calendar date of the latest capture. */
  asOf: string;
  /** ISO timestamp of the latest capture. */
  capturedAt: string;
  history: AmazonRankHistoryEntry[];
};

/** Category copy shared by live Supabase rows and local fixtures. */
export const AMAZON_KINDLE_RANK_LABELS = {
  store: {
    label: 'Kindle Store',
    shortLabel: 'Kindle Store',
  },
  personalTransformation: {
    label: 'Personal Transformation & Spirituality',
    shortLabel: 'Personal Transformation',
  },
  datingRelationships: {
    label: 'Dating, Relationships & Spirituality',
    shortLabel: 'Dating, Relationships',
  },
  spiritualHealing: {
    label: 'Spiritual Healing',
    shortLabel: 'Spiritual Healing',
  },
} as const;

type CtClockParts = {
  asOf: string;
  month: number;
  day: number;
  hour24: number;
  minute: number;
};

function readCtPart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((part) => part.type === type)?.value ?? '';
}

/** Break a capture timestamp into Central Time calendar + clock parts. */
export function kindleRankCtParts(capturedAt: string): CtClockParts | null {
  const date = new Date(capturedAt);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: KINDLE_RANK_CT_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const year = readCtPart(parts, 'year');
  const month = readCtPart(parts, 'month');
  const day = readCtPart(parts, 'day');
  const hour = readCtPart(parts, 'hour');
  const minute = readCtPart(parts, 'minute');
  if (!year || !month || !day || hour === '' || minute === '') return null;

  return {
    asOf: `${year}-${month}-${day}`,
    month: Number(month),
    day: Number(day),
    hour24: Number(hour),
    minute: Number(minute),
  };
}

function minutesSinceMidnight(hour: number, minute: number): number {
  return hour * 60 + minute;
}

/** Nearest of the six CT check windows for a capture time. */
export function kindleRankNearestCheckSlot(
  hour24: number,
  minute: number,
): KindleRankCheckSlot {
  const target = minutesSinceMidnight(hour24, minute);
  let best = KINDLE_RANK_CHECK_SLOTS[0]!;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const slot of KINDLE_RANK_CHECK_SLOTS) {
    const slotMinutes = minutesSinceMidnight(slot.hour, slot.minute);
    const direct = Math.abs(target - slotMinutes);
    const wrap = 24 * 60 - direct;
    const distance = Math.min(direct, wrap);
    if (distance < bestDistance) {
      best = slot;
      bestDistance = distance;
    }
  }

  return best;
}

export function formatKindleRankCtTime(hour24: number, minute: number): string {
  const date = new Date(Date.UTC(2020, 0, 1, hour24, minute));
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatKindleRankCtDayLabel(asOf: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(asOf);
  if (!match) return asOf;
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/** Build history labels from a capture timestamp in Central Time. */
export function kindleRankHistoryFromCapturedAt(capturedAt: string): Pick<
  AmazonRankHistoryEntry,
  'capturedAt' | 'asOf' | 'label' | 'timeLabel' | 'slotReason'
> {
  const parts = kindleRankCtParts(capturedAt);
  if (!parts) {
    return {
      capturedAt,
      asOf: '',
      label: capturedAt,
      timeLabel: '',
      slotReason: '',
    };
  }

  const slot = kindleRankNearestCheckSlot(parts.hour24, parts.minute);
  const timeLabel = formatKindleRankCtTime(slot.hour, slot.minute);
  const dayLabel = formatKindleRankCtDayLabel(parts.asOf);

  return {
    capturedAt,
    asOf: parts.asOf,
    label: `${dayLabel} · ${timeLabel}`,
    timeLabel,
    slotReason: slot.reason,
  };
}

/**
 * Local fixture for unit tests and offline fallback.
 * Live Brand Studio data comes from `public.kindle_ranks` via `fetchKindleRanks`.
 */
export const AMAZON_KINDLE_RANK: AmazonKindleRankSnapshot = {
  storeRank: 51_869,
  storeLabel: AMAZON_KINDLE_RANK_LABELS.store.label,
  personalTransformation: {
    key: 'personalTransformation',
    label: AMAZON_KINDLE_RANK_LABELS.personalTransformation.label,
    shortLabel: AMAZON_KINDLE_RANK_LABELS.personalTransformation.shortLabel,
    rank: 23,
  },
  datingRelationships: {
    key: 'datingRelationships',
    label: AMAZON_KINDLE_RANK_LABELS.datingRelationships.label,
    shortLabel: AMAZON_KINDLE_RANK_LABELS.datingRelationships.shortLabel,
    rank: 37,
  },
  spiritualHealing: {
    key: 'spiritualHealing',
    label: AMAZON_KINDLE_RANK_LABELS.spiritualHealing.label,
    shortLabel: AMAZON_KINDLE_RANK_LABELS.spiritualHealing.shortLabel,
    rank: 40,
  },
  asOf: '2026-08-28',
  capturedAt: '2026-08-28T19:00:00+00:00',
  history: [
    {
      ...kindleRankHistoryFromCapturedAt('2026-08-26T19:00:00+00:00'),
      storeRank: 70_468,
      personalTransformation: 32,
      datingRelationships: 47,
      spiritualHealing: 59,
    },
    {
      ...kindleRankHistoryFromCapturedAt('2026-08-27T19:00:00+00:00'),
      storeRank: 58_953,
      personalTransformation: 30,
      datingRelationships: 44,
      spiritualHealing: 53,
    },
    {
      ...kindleRankHistoryFromCapturedAt('2026-08-28T19:00:00+00:00'),
      storeRank: 51_869,
      personalTransformation: 23,
      datingRelationships: 37,
      spiritualHealing: 40,
    },
  ],
};

/** Display order: bestseller first, then the three category rows. */
export function amazonRankDisplayRows(
  snapshot: AmazonKindleRankSnapshot = AMAZON_KINDLE_RANK,
): AmazonRankPoint[] {
  return [
    {
      key: 'store',
      label: snapshot.storeLabel,
      shortLabel: snapshot.storeLabel,
      rank: snapshot.storeRank,
    },
    snapshot.personalTransformation,
    snapshot.datingRelationships,
    snapshot.spiritualHealing,
  ];
}

export function kindleListingHref(): string {
  return kindlePreorderHref();
}

export function formatAmazonRank(rank: number): string {
  return `#${rank.toLocaleString('en-US')}`;
}

/** Lower rank is better. Positive delta means the book moved up. */
export function amazonRankDelta(previous: number, current: number): number {
  return previous - current;
}

export function formatAmazonRankDelta(delta: number): string {
  if (delta === 0) return '—';
  const amount = Math.abs(delta).toLocaleString('en-US');
  return delta > 0 ? `↑ ${amount}` : `↓ ${amount}`;
}

/**
 * Movement since the previous capture (check-to-check).
 * With six CT checks per day, this is the last window vs the current one.
 */
export function amazonRankDeltasFromHistory(
  snapshot: AmazonKindleRankSnapshot = AMAZON_KINDLE_RANK,
): Record<AmazonRankKey, number> {
  const history = snapshot.history;
  const previous = history.at(-2);
  const current = history.at(-1);

  if (!previous || !current) {
    return {
      store: 0,
      personalTransformation: 0,
      datingRelationships: 0,
      spiritualHealing: 0,
    };
  }

  return {
    store: amazonRankDelta(previous.storeRank, current.storeRank),
    personalTransformation: amazonRankDelta(
      previous.personalTransformation,
      current.personalTransformation,
    ),
    datingRelationships: amazonRankDelta(
      previous.datingRelationships,
      current.datingRelationships,
    ),
    spiritualHealing: amazonRankDelta(
      previous.spiritualHealing,
      current.spiritualHealing,
    ),
  };
}

export function amazonImprovedCategoryCount(
  snapshot: AmazonKindleRankSnapshot = AMAZON_KINDLE_RANK,
): number {
  return Object.values(amazonRankDeltasFromHistory(snapshot)).filter(
    (delta) => delta > 0,
  ).length;
}

export function amazonBestMovement(
  snapshot: AmazonKindleRankSnapshot = AMAZON_KINDLE_RANK,
): { label: string; delta: number } | null {
  const rows = amazonRankDisplayRows(snapshot);
  const deltas = amazonRankDeltasFromHistory(snapshot);
  let best: { label: string; delta: number } | null = null;

  for (const row of rows) {
    const delta = deltas[row.key];
    if (delta <= 0) continue;
    if (!best || delta > best.delta) {
      best = { label: row.shortLabel, delta };
    }
  }

  return best;
}

export function formatAmazonRankAsOf(iso: string, now = new Date()): string {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const startToday = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const startThen = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((startToday - startThen) / 86_400_000);

  if (days === 0) return 'Checked today';
  if (days === 1) return 'Checked yesterday';
  if (days > 1 && days < 7) return `Checked ${days} days ago`;

  return `Checked ${new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date)}`;
}
