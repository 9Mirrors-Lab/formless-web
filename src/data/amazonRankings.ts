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

export type AmazonRankHistoryEntry = {
  asOf: string;
  label: string;
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
  /** ISO date when ranks were last checked on Amazon. */
  asOf: string;
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
  history: [
    {
      asOf: '2026-08-26',
      label: 'Aug 26',
      storeRank: 70_468,
      personalTransformation: 32,
      datingRelationships: 47,
      spiritualHealing: 59,
    },
    {
      asOf: '2026-08-27',
      label: 'Aug 27',
      storeRank: 58_953,
      personalTransformation: 30,
      datingRelationships: 44,
      spiritualHealing: 53,
    },
    {
      asOf: '2026-08-28',
      label: 'Today',
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
