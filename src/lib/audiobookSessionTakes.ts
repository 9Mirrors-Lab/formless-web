import { getBrowserSupabaseClient, hasSupabaseEnv } from '@/lib/supabase';

export const SESSION_TAKE_BUCKET = 'audiobook-takes';

export type SessionTakeKind =
  | 'initial_calibration'
  | 'session_calibration'
  | 'chapter_draft';

export type SessionTakeStatus =
  | 'received'
  | 'reviewing'
  | 'accepted'
  | 'rejected';

export type UploadPhase = 'preparing' | 'uploading' | 'saving' | 'complete' | 'error';

export type UploadProgress = {
  phase: UploadPhase;
  /** Bytes sent to storage so far. */
  loadedBytes: number;
  /** Total file size in bytes. */
  totalBytes: number;
  /** 0–100 for the storage transfer. */
  percent: number;
  message: string;
};

export type UploadSessionTakeInput = {
  file: File;
  bookSlug?: string;
  takeKind?: SessionTakeKind;
  notes?: string;
  roomToneSeconds?: number;
  onProgress?: (progress: UploadProgress) => void;
  signal?: AbortSignal;
};

export type UploadSessionTakeResult =
  | { ok: true; id: string; storagePath: string }
  | { ok: false; error: string; aborted?: boolean };

const ALLOWED_EXT = new Set([
  '.wav',
  '.wave',
  '.m4a',
  '.mp3',
  '.aac',
  '.flac',
  '.ogg',
  '.oga',
  '.opus',
  '.aiff',
  '.aif',
  '.caf',
  '.wma',
  '.webm',
  '.3gp',
  '.amr',
  '.aup3',
]);

const MAX_BYTES = 629145600; // 600 MB

/** Audacity 3 project files are SQLite, not audio/*; browsers often report octet-stream. */
const AUP3_MIME = 'application/x-audacity-project';

function extensionOf(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx).toLowerCase() : '';
}

function isAllowedTakeFile(file: File): boolean {
  const ext = extensionOf(file.name);
  if (ext === '.aup3') return true;
  const type = file.type.trim().toLowerCase();
  if (type.startsWith('audio/')) return true;
  return ALLOWED_EXT.has(ext);
}

export function formatFileBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateSessionTakeFile(file: File): string | null {
  if (file.size <= 0) return 'File is empty.';
  if (file.size > MAX_BYTES) return 'File must be 600 MB or smaller.';
  if (!isAllowedTakeFile(file)) {
    return 'Use an audio recording or Audacity project (.aup3).';
  }
  return null;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120);
}

function resolveMime(file: File): string {
  const ext = extensionOf(file.name);
  if (ext === '.aup3') return AUP3_MIME;

  const type = file.type.trim().toLowerCase();
  if (type.startsWith('audio/')) {
    return type;
  }
  switch (ext) {
    case '.wav':
    case '.wave':
      return 'audio/wav';
    case '.mp3':
      return 'audio/mpeg';
    case '.m4a':
      return 'audio/mp4';
    case '.aac':
      return 'audio/aac';
    case '.flac':
      return 'audio/flac';
    case '.ogg':
    case '.oga':
      return 'audio/ogg';
    case '.opus':
      return 'audio/opus';
    case '.aiff':
    case '.aif':
      return 'audio/aiff';
    case '.caf':
      return 'audio/x-caf';
    case '.wma':
      return 'audio/x-ms-wma';
    case '.webm':
      return 'audio/webm';
    case '.3gp':
      return 'audio/3gpp';
    case '.amr':
      return 'audio/amr';
    default:
      return type || 'application/octet-stream';
  }
}

function reportProgress(
  onProgress: UploadSessionTakeInput['onProgress'],
  progress: UploadProgress,
) {
  onProgress?.(progress);
}

function encodeStorageObjectPath(path: string): string {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

/**
 * Supabase Free projects hard-cap uploads at 50 MB via the *global* Storage
 * setting. Bucket limits (e.g. 600 MB) cannot exceed that ceiling.
 */
function explainStorageUploadError(raw: string, fileBytes: number): string {
  const lower = raw.toLowerCase();
  const looksLikeSize =
    lower.includes('maximum') ||
    lower.includes('exceeded') ||
    lower.includes('too large') ||
    lower.includes('payload') ||
    lower.includes('entity too large') ||
    lower.includes('file size');

  if (looksLikeSize) {
    return (
      `File is ${formatFileBytes(fileBytes)}, but this Supabase project’s global ` +
      `upload limit is 50 MB on the Free plan. Upgrade the Eyes_Closed org to Pro, ` +
      `then set Storage → Settings → Global file size limit to 600 MB.`
    );
  }
  return raw;
}

type StorageUploadResult =
  | { ok: true }
  | { ok: false; error: string; aborted?: boolean };

/**
 * XHR upload so browsers can report real transfer progress (bytes + %).
 * Supabase storage-js `.upload()` does not expose upload progress events.
 */
function uploadFileWithProgress(options: {
  url: string;
  anonKey: string;
  accessToken: string;
  file: File;
  contentType: string;
  onProgress?: (loaded: number, total: number) => void;
  signal?: AbortSignal;
}): Promise<StorageUploadResult> {
  const { url, anonKey, accessToken, file, contentType, onProgress, signal } = options;

  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve({ ok: false, error: 'Upload cancelled.', aborted: true });
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    xhr.setRequestHeader('apikey', anonKey);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.setRequestHeader('x-upsert', 'false');

    const onAbort = () => {
      xhr.abort();
    };
    signal?.addEventListener('abort', onAbort, { once: true });

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress?.(event.loaded, event.total);
    };

    xhr.onload = () => {
      signal?.removeEventListener('abort', onAbort);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ ok: true });
        return;
      }
      const body = xhr.response as { message?: string; error?: string; statusCode?: string } | null;
      const raw = body?.message || body?.error || `Upload failed (${xhr.status}).`;
      resolve({ ok: false, error: explainStorageUploadError(raw, file.size) });
    };

    xhr.onerror = () => {
      signal?.removeEventListener('abort', onAbort);
      resolve({ ok: false, error: 'Network error while uploading.' });
    };

    xhr.onabort = () => {
      signal?.removeEventListener('abort', onAbort);
      resolve({ ok: false, error: 'Upload cancelled.', aborted: true });
    };

    xhr.send(file);
  });
}

export async function uploadSessionTake(
  input: UploadSessionTakeInput,
): Promise<UploadSessionTakeResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: 'Supabase is not configured in this environment.' };
  }

  const totalBytes = input.file.size;
  const validationError = validateSessionTakeFile(input.file);
  if (validationError) {
    reportProgress(input.onProgress, {
      phase: 'error',
      loadedBytes: 0,
      totalBytes,
      percent: 0,
      message: validationError,
    });
    return { ok: false, error: validationError };
  }

  reportProgress(input.onProgress, {
    phase: 'preparing',
    loadedBytes: 0,
    totalBytes,
    percent: 0,
    message: `Preparing ${formatFileBytes(totalBytes)}…`,
  });

  const bookSlug = input.bookSlug ?? 'formless';
  const takeKind = input.takeKind ?? 'initial_calibration';
  const roomToneSeconds = input.roomToneSeconds ?? 30;
  const mimeType = resolveMime(input.file);
  const safeName = sanitizeFilename(input.file.name || 'take.wav');
  const storagePath = `${bookSlug}/${takeKind}/${Date.now()}-${safeName}`;

  const supabase = getBrowserSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  const accessToken = session?.access_token ?? anonKey;
  const objectUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/${SESSION_TAKE_BUCKET}/${encodeStorageObjectPath(storagePath)}`;

  reportProgress(input.onProgress, {
    phase: 'uploading',
    loadedBytes: 0,
    totalBytes,
    percent: 0,
    message: `Uploading 0 B of ${formatFileBytes(totalBytes)} · 0%`,
  });

  const storageResult = await uploadFileWithProgress({
    url: objectUrl,
    anonKey,
    accessToken,
    file: input.file,
    contentType: mimeType,
    signal: input.signal,
    onProgress: (loaded, total) => {
      const percent = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
      reportProgress(input.onProgress, {
        phase: 'uploading',
        loadedBytes: loaded,
        totalBytes: total,
        percent,
        message: `Uploading ${formatFileBytes(loaded)} of ${formatFileBytes(total)} · ${percent}%`,
      });
    },
  });

  if (!storageResult.ok) {
    reportProgress(input.onProgress, {
      phase: 'error',
      loadedBytes: 0,
      totalBytes,
      percent: 0,
      message: storageResult.error,
    });
    return {
      ok: false,
      error: storageResult.error,
      aborted: storageResult.aborted,
    };
  }

  reportProgress(input.onProgress, {
    phase: 'saving',
    loadedBytes: totalBytes,
    totalBytes,
    percent: 100,
    message: `Uploaded ${formatFileBytes(totalBytes)}. Saving take…`,
  });

  const takeId = crypto.randomUUID();
  const { error } = await supabase.from('audiobook_session_takes').insert({
    id: takeId,
    book_slug: bookSlug,
    take_kind: takeKind,
    storage_bucket: SESSION_TAKE_BUCKET,
    storage_path: storagePath,
    mime_type: mimeType,
    file_size_bytes: input.file.size,
    original_filename: input.file.name,
    room_tone_seconds: roomToneSeconds,
    notes: input.notes ?? null,
    uploaded_by: user?.id ?? null,
    status: 'received' satisfies SessionTakeStatus,
  });

  if (error) {
    await supabase.storage.from(SESSION_TAKE_BUCKET).remove([storagePath]);
    const message = error.message || 'Could not save take metadata.';
    reportProgress(input.onProgress, {
      phase: 'error',
      loadedBytes: totalBytes,
      totalBytes,
      percent: 100,
      message,
    });
    return { ok: false, error: message };
  }

  reportProgress(input.onProgress, {
    phase: 'complete',
    loadedBytes: totalBytes,
    totalBytes,
    percent: 100,
    message: `Take received · ${formatFileBytes(totalBytes)}`,
  });

  return { ok: true, id: takeId, storagePath };
}

export type SessionTakeRow = {
  id: string;
  book_slug: string;
  take_kind: SessionTakeKind;
  storage_bucket: string;
  storage_path: string;
  mime_type: string;
  file_size_bytes: number | null;
  original_filename: string | null;
  sample_rate_hz: number | null;
  channels: number | null;
  duration_seconds: number | null;
  room_tone_seconds: number;
  notes: string | null;
  uploaded_by: string | null;
  status: SessionTakeStatus;
  created_at: string;
  updated_at: string;
};

export type SessionTakeListResult =
  | { ok: true; takes: SessionTakeRow[] }
  | { ok: false; error: string };

export type SessionTakeActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type SignedDownloadResult =
  | { ok: true; url: string; filename: string }
  | { ok: false; error: string };

export const SESSION_TAKE_STATUS_LABELS: Record<SessionTakeStatus, string> = {
  received: 'Received',
  reviewing: 'Reviewing',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export const SESSION_TAKE_KIND_LABELS: Record<SessionTakeKind, string> = {
  initial_calibration: 'Initial calibration',
  session_calibration: 'Session calibration',
  chapter_draft: 'Chapter draft',
};

const SESSION_TAKE_SELECT =
  'id, book_slug, take_kind, storage_bucket, storage_path, mime_type, file_size_bytes, original_filename, sample_rate_hz, channels, duration_seconds, room_tone_seconds, notes, uploaded_by, status, created_at, updated_at';

export async function fetchCurrentUserIsAdmin(): Promise<boolean> {
  if (!hasSupabaseEnv()) return false;
  const supabase = getBrowserSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (error) return false;
  return Boolean(data?.is_admin);
}

export async function listSessionTakes(): Promise<SessionTakeListResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: 'Supabase is not configured in this environment.' };
  }

  const supabase = getBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('audiobook_session_takes')
    .select(SESSION_TAKE_SELECT)
    .order('created_at', { ascending: false });

  if (error) {
    return { ok: false, error: error.message || 'Could not load session takes.' };
  }

  return { ok: true, takes: (data ?? []) as SessionTakeRow[] };
}

export async function updateSessionTakeStatus(
  id: string,
  status: SessionTakeStatus,
): Promise<SessionTakeActionResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: 'Supabase is not configured in this environment.' };
  }

  const supabase = getBrowserSupabaseClient();
  const { error } = await supabase
    .from('audiobook_session_takes')
    .update({ status })
    .eq('id', id);

  if (error) {
    return { ok: false, error: error.message || 'Could not update status.' };
  }
  return { ok: true };
}

export async function createSessionTakeDownloadUrl(
  take: Pick<SessionTakeRow, 'storage_bucket' | 'storage_path' | 'original_filename'>,
  expiresInSeconds = 3600,
): Promise<SignedDownloadResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: 'Supabase is not configured in this environment.' };
  }

  const supabase = getBrowserSupabaseClient();
  const { data, error } = await supabase.storage
    .from(take.storage_bucket || SESSION_TAKE_BUCKET)
    .createSignedUrl(take.storage_path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    return {
      ok: false,
      error: error?.message || 'Could not create a download link.',
    };
  }

  const filename =
    take.original_filename?.trim() ||
    take.storage_path.split('/').pop() ||
    'session-take';

  return { ok: true, url: data.signedUrl, filename };
}

export async function downloadSessionTake(
  take: Pick<SessionTakeRow, 'storage_bucket' | 'storage_path' | 'original_filename'>,
): Promise<SessionTakeActionResult> {
  const signed = await createSessionTakeDownloadUrl(take);
  if (!signed.ok) return signed;

  const anchor = document.createElement('a');
  anchor.href = signed.url;
  anchor.download = signed.filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  return { ok: true };
}

export async function deleteSessionTake(
  take: Pick<SessionTakeRow, 'id' | 'storage_bucket' | 'storage_path'>,
): Promise<SessionTakeActionResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: 'Supabase is not configured in this environment.' };
  }

  const supabase = getBrowserSupabaseClient();
  const bucket = take.storage_bucket || SESSION_TAKE_BUCKET;
  const { error: storageError } = await supabase.storage
    .from(bucket)
    .remove([take.storage_path]);

  if (storageError) {
    return {
      ok: false,
      error: storageError.message || 'Could not delete the storage object.',
    };
  }

  const { error } = await supabase
    .from('audiobook_session_takes')
    .delete()
    .eq('id', take.id);

  if (error) {
    return {
      ok: false,
      error: error.message || 'File removed from storage, but metadata delete failed.',
    };
  }

  return { ok: true };
}
