import {
  getBrowserSupabaseClient,
  hasSupabaseEnv,
} from '@/lib/supabase';
import {
  AMAZON_KINDLE_RANK_LABELS,
  type AmazonKindleRankSnapshot,
  type AmazonRankHistoryEntry,
} from '@/data/amazonRankings';

export type KindleRankRow = {
  id: string;
  best_seller_rank: number;
  personal_transformation_spirituality: number;
  dating_relationships_spirituality: number;
  spiritual_healing: number;
  captured_at: string;
  created_at: string;
};

export type FetchKindleRanksResult =
  | { ok: true; rows: KindleRankRow[]; snapshot: AmazonKindleRankSnapshot }
  | { ok: false; error: string };

const KINDLE_RANK_SELECT =
  'id, best_seller_rank, personal_transformation_spirituality, dating_relationships_spirituality, spiritual_healing, captured_at, created_at';

/** Calendar date (UTC) for history keys and comparisons. */
export function kindleRankAsOf(capturedAt: string): string {
  const date = new Date(capturedAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

export function kindleRankHistoryLabel(asOf: string): string {
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

export function mapKindleRankRows(
  rows: KindleRankRow[],
): AmazonKindleRankSnapshot | null {
  if (rows.length === 0) return null;

  const ordered = [...rows].sort((a, b) =>
    a.captured_at.localeCompare(b.captured_at),
  );
  const latest = ordered[ordered.length - 1];
  if (!latest) return null;

  const history: AmazonRankHistoryEntry[] = ordered.map((row) => {
    const asOf = kindleRankAsOf(row.captured_at);
    return {
      asOf,
      label: kindleRankHistoryLabel(asOf),
      storeRank: row.best_seller_rank,
      personalTransformation: row.personal_transformation_spirituality,
      datingRelationships: row.dating_relationships_spirituality,
      spiritualHealing: row.spiritual_healing,
    };
  });

  const asOf = kindleRankAsOf(latest.captured_at);

  return {
    storeRank: latest.best_seller_rank,
    storeLabel: AMAZON_KINDLE_RANK_LABELS.store.label,
    personalTransformation: {
      key: 'personalTransformation',
      label: AMAZON_KINDLE_RANK_LABELS.personalTransformation.label,
      shortLabel: AMAZON_KINDLE_RANK_LABELS.personalTransformation.shortLabel,
      rank: latest.personal_transformation_spirituality,
    },
    datingRelationships: {
      key: 'datingRelationships',
      label: AMAZON_KINDLE_RANK_LABELS.datingRelationships.label,
      shortLabel: AMAZON_KINDLE_RANK_LABELS.datingRelationships.shortLabel,
      rank: latest.dating_relationships_spirituality,
    },
    spiritualHealing: {
      key: 'spiritualHealing',
      label: AMAZON_KINDLE_RANK_LABELS.spiritualHealing.label,
      shortLabel: AMAZON_KINDLE_RANK_LABELS.spiritualHealing.shortLabel,
      rank: latest.spiritual_healing,
    },
    asOf,
    history,
  };
}

function isKindleRankRow(value: unknown): value is KindleRankRow {
  if (!value || typeof value !== 'object') return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === 'string' &&
    typeof row.best_seller_rank === 'number' &&
    typeof row.personal_transformation_spirituality === 'number' &&
    typeof row.dating_relationships_spirituality === 'number' &&
    typeof row.spiritual_healing === 'number' &&
    typeof row.captured_at === 'string' &&
    typeof row.created_at === 'string'
  );
}

export async function fetchKindleRanks(): Promise<FetchKindleRanksResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: 'Supabase is not configured in this environment.' };
  }

  const supabase = getBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('kindle_ranks')
    .select(KINDLE_RANK_SELECT)
    .order('captured_at', { ascending: true });

  if (error) {
    return { ok: false, error: error.message };
  }

  const rows = (data ?? []).filter(isKindleRankRow);
  const snapshot = mapKindleRankRows(rows);
  if (!snapshot) {
    return { ok: false, error: 'No Kindle rank snapshots have been saved yet.' };
  }

  return { ok: true, rows, snapshot };
}
