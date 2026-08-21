import { getBrowserSupabaseClient, hasSupabaseEnv } from '@/lib/supabase';
import {
  SCRIPT_DIFF_REVIEW_BOOK_SLUG,
  mergeReviewStores,
  parseReviewStoreKey,
  readReviewStore,
  rowsToReviewStore,
  writeReviewStore,
  type DiffReviewStatus,
  type DiffReviewStore,
  type ScriptDiffReviewRow,
} from '@/lib/scriptDiffReview';

const TABLE = 'script_diff_reviews';

const ROW_SELECT =
  'book_slug, chapter_id, script_model, fingerprint, fingerprint_key, status, updated_at';

export async function fingerprintKey(fingerprint: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(fingerprint),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export async function fetchScriptDiffReviews(): Promise<
  { ok: true; store: DiffReviewStore } | { ok: false; error: string }
> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: 'Supabase is not configured.' };
  }
  const supabase = getBrowserSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select(ROW_SELECT);
  if (error) return { ok: false, error: error.message };
  return {
    ok: true,
    store: rowsToReviewStore((data ?? []) as ScriptDiffReviewRow[]),
  };
}

export async function persistScriptDiffReview(input: {
  chapterId: number;
  model: string;
  fingerprint: string;
  status: DiffReviewStatus | null;
  userId?: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: 'Supabase is not configured.' };
  }
  const supabase = getBrowserSupabaseClient();
  const key = await fingerprintKey(input.fingerprint);

  if (input.status == null) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('book_slug', SCRIPT_DIFF_REVIEW_BOOK_SLUG)
      .eq('chapter_id', input.chapterId)
      .eq('script_model', input.model)
      .eq('fingerprint_key', key);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  const { error } = await supabase.from(TABLE).upsert(
    {
      book_slug: SCRIPT_DIFF_REVIEW_BOOK_SLUG,
      chapter_id: input.chapterId,
      script_model: input.model,
      fingerprint: input.fingerprint,
      fingerprint_key: key,
      status: input.status,
      reviewed_by: input.userId ?? null,
    },
    { onConflict: 'book_slug,chapter_id,script_model,fingerprint_key' },
  );
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function pushLocalReviews(
  merged: DiffReviewStore,
  remote: DiffReviewStore,
  userId?: string | null,
): Promise<void> {
  for (const [key, record] of Object.entries(merged)) {
    const existing = remote[key];
    if (existing && existing.updatedAt >= record.updatedAt) continue;
    const parsed = parseReviewStoreKey(key);
    if (!parsed) continue;
    await persistScriptDiffReview({
      ...parsed,
      status: record.status,
      userId,
    });
  }
}

export async function syncScriptDiffReviews(
  userId?: string | null,
): Promise<DiffReviewStore> {
  const local = readReviewStore();
  const remote = await fetchScriptDiffReviews();
  if (!remote.ok) return local;
  const merged = mergeReviewStores(local, remote.store);
  writeReviewStore(merged);
  await pushLocalReviews(merged, remote.store, userId);
  return merged;
}
