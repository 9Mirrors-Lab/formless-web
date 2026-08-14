import {
  AUDIO_LISTEN_ORDER,
  audiobookListenOrderRank,
  canonicalChapterTitle,
  chapterStatusFromSources,
  isAudioChapterId,
  type AudioChapter,
} from '@/data/audioBook';
import { manuscriptForChapter } from '@/data/audioManuscripts';
import {
  googleDriveMediaUrl,
  isGoogleDriveMediaUrl,
  parseGoogleDriveFileId,
} from '@/lib/googleDriveMedia';
import { GOOGLE_DRIVE_STORAGE_PROVIDER } from '@/lib/googleDriveUpload';
import { getBrowserSupabaseClient, hasSupabaseEnv } from '@/lib/supabase';

export { googleDriveMediaUrl, isGoogleDriveMediaUrl };

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

export function audiobookPublicUrl(bucket: string, path: string): string {
  if (bucket === GOOGLE_DRIVE_STORAGE_PROVIDER || parseGoogleDriveFileId(path)) {
    return googleDriveMediaUrl(path);
  }
  const base = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
  if (!base) return '';
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

/** Drive ids play through the same-origin proxy. Object keys use public storage. */
export function audiobookTrackPublicUrl(
  source: AudiobookTrackSource,
  bucket: string,
  path: string,
): string {
  switch (source) {
    case 'optimized':
    case 'original':
      return audiobookPublicUrl(bucket, path);
    default: {
      const _exhaustive: never = source;
      return _exhaustive;
    }
  }
}

export { audiobookListenOrderRank };

function mapRow(row: AudiobookTrackRow): AudiobookTrack {
  const duration =
    row.duration_seconds == null ? null : Number(row.duration_seconds);
  return {
    id: row.id,
    bookSlug: row.book_slug,
    chapterNumber: row.chapter_number,
    chapterTitle: canonicalChapterTitle(row.chapter_number, row.chapter_title),
    source: row.source,
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    durationSeconds: Number.isFinite(duration) ? duration : null,
    fileSizeBytes: row.file_size_bytes,
    originalFilename: row.original_filename,
    publicUrl: audiobookTrackPublicUrl(row.source, row.storage_bucket, row.storage_path),
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
    .filter((row) => isAudioChapterId(row.chapter_number))
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
      optimized?.durationSeconds ?? original?.durationSeconds ?? null,
    tracks,
  };
}

export function chaptersFromTracks(tracks: AudiobookTrack[]): AudioChapter[] {
  return AUDIO_LISTEN_ORDER.map((id) => {
    const original = tracks.find(
      (track) => track.chapterNumber === id && track.source === 'original',
    );
    const optimized = tracks.find(
      (track) => track.chapterNumber === id && track.source === 'optimized',
    );
    const duration = optimized?.durationSeconds ?? original?.durationSeconds ?? 0;
    return {
      id,
      title: canonicalChapterTitle(id),
      length: Number.isFinite(duration) ? Math.round(duration) : 0,
      status: chapterStatusFromSources(Boolean(original), Boolean(optimized)),
      manuscript: manuscriptForChapter(id),
    };
  });
}

export function chapterAudioFromTracks(
  tracks: AudiobookTrack[],
  chapterNumber: number,
): ChapterAudioUrls {
  const chapterTracks = tracks.filter((track) => track.chapterNumber === chapterNumber);
  const original = chapterTracks.find((track) => track.source === 'original') ?? null;
  const optimized = chapterTracks.find((track) => track.source === 'optimized') ?? null;
  return {
    originalUrl: original?.publicUrl ?? null,
    optimizedUrl: optimized?.publicUrl ?? null,
    durationSeconds:
      optimized?.durationSeconds ?? original?.durationSeconds ?? null,
    tracks: chapterTracks,
  };
}
