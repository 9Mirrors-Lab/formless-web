import { getBrowserSupabaseClient, hasSupabaseEnv } from '@/lib/supabase';

export type AudiobookTrackSource = 'original' | 'optimized';

export const AUDIOBOOK_TRACK_SOURCE_LABELS: Record<AudiobookTrackSource, string> = {
  original: 'Original',
  optimized: 'Optimized',
};

export type AudiobookTrack = {
  id: string;
  bookSlug: string;
  chapterNumber: number;
  chapterTitle: string;
  source: AudiobookTrackSource;
  storageBucket: string;
  storagePath: string;
  mimeType: string;
  durationSeconds: number | null;
  fileSizeBytes: number | null;
  originalFilename: string | null;
  publicUrl: string;
};

type AudiobookTrackRow = {
  id: string;
  book_slug: string;
  chapter_number: number;
  chapter_title: string;
  source: AudiobookTrackSource;
  storage_bucket: string;
  storage_path: string;
  mime_type: string;
  duration_seconds: number | string | null;
  file_size_bytes: number | null;
  original_filename: string | null;
};

const TRACK_SELECT =
  'id, book_slug, chapter_number, chapter_title, source, storage_bucket, storage_path, mime_type, duration_seconds, file_size_bytes, original_filename';

function publicObjectUrl(bucket: string, path: string): string {
  const base = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
  if (!base) return '';
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

/** Listen order: Opening Credits, Introduction, chapters 1–11, Acknowledgments. */
export function audiobookListenOrderRank(chapterNumber: number): number {
  if (chapterNumber === 13) return 0;
  if (chapterNumber === 0) return 1;
  if (chapterNumber === 12) return 13;
  return chapterNumber + 1;
}

function mapRow(row: AudiobookTrackRow): AudiobookTrack {
  const duration =
    row.duration_seconds == null ? null : Number(row.duration_seconds);
  return {
    id: row.id,
    bookSlug: row.book_slug,
    chapterNumber: row.chapter_number,
    chapterTitle: row.chapter_title,
    source: row.source,
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    durationSeconds: Number.isFinite(duration) ? duration : null,
    fileSizeBytes: row.file_size_bytes,
    originalFilename: row.original_filename,
    publicUrl: publicObjectUrl(row.storage_bucket, row.storage_path),
  };
}

export type ChapterAudioUrls = {
  originalUrl: string | null;
  optimizedUrl: string | null;
  durationSeconds: number | null;
  tracks: AudiobookTrack[];
};

export type AudiobookTrackListResult =
  | { ok: true; tracks: AudiobookTrack[] }
  | { ok: false; error: string };

export type AudiobookTrackActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function listPublishedAudiobookTracks(
  bookSlug = 'formless',
): Promise<AudiobookTrackListResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: 'Supabase is not configured in this environment.' };
  }

  const supabase = getBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('audiobook_tracks')
    .select(TRACK_SELECT)
    .eq('book_slug', bookSlug)
    .eq('is_published', true)
    .order('chapter_number', { ascending: true });

  if (error) {
    return {
      ok: false,
      error: error.message || 'Could not load published audiobook tracks.',
    };
  }

  const tracks = ((data as AudiobookTrackRow[] | null) ?? [])
    .map(mapRow)
    .sort((a, b) => {
      const order = audiobookListenOrderRank(a.chapterNumber)
        - audiobookListenOrderRank(b.chapterNumber);
      if (order !== 0) return order;
      if (a.source === b.source) return 0;
      return a.source === 'original' ? -1 : 1;
    });

  return { ok: true, tracks };
}

export function downloadAudiobookTrack(track: AudiobookTrack): AudiobookTrackActionResult {
  if (!track.publicUrl) {
    return { ok: false, error: 'Missing public download URL for this track.' };
  }

  const filename =
    track.originalFilename?.trim() ||
    track.storagePath.split('/').pop() ||
    'audiobook-track';

  const anchor = document.createElement('a');
  anchor.href = track.publicUrl;
  anchor.download = filename;
  anchor.rel = 'noopener';
  anchor.target = '_blank';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  return { ok: true };
}

export async function fetchChapterAudio(
  chapterNumber: number,
  bookSlug = 'formless',
): Promise<ChapterAudioUrls> {
  if (!hasSupabaseEnv()) {
    return { originalUrl: null, optimizedUrl: null, durationSeconds: null, tracks: [] };
  }

  const supabase = getBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('audiobook_tracks')
    .select(TRACK_SELECT)
    .eq('book_slug', bookSlug)
    .eq('chapter_number', chapterNumber)
    .eq('is_published', true);

  if (error) {
    console.error('audiobook_tracks fetch failed', error.message);
    return { originalUrl: null, optimizedUrl: null, durationSeconds: null, tracks: [] };
  }

  const tracks = (data as AudiobookTrackRow[] | null)?.map(mapRow) ?? [];
  const original = tracks.find((t) => t.source === 'original') ?? null;
  const optimized = tracks.find((t) => t.source === 'optimized') ?? null;

  return {
    originalUrl: original?.publicUrl ?? null,
    optimizedUrl: optimized?.publicUrl ?? null,
    durationSeconds:
      original?.durationSeconds ?? optimized?.durationSeconds ?? null,
    tracks,
  };
}
