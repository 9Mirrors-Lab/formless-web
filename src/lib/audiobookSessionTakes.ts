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

const ALLOWED_MIME = new Set([
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/vnd.wave',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
  'audio/m4a',
]);

const ALLOWED_EXT = new Set(['.wav', '.wave', '.m4a']);

const MAX_BYTES = 104857600;

function extensionOf(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx).toLowerCase() : '';
}

export function formatFileBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateSessionTakeFile(file: File): string | null {
  if (file.size <= 0) return 'File is empty.';
  if (file.size > MAX_BYTES) return 'File must be 100 MB or smaller.';

  const ext = extensionOf(file.name);
  const mimeOk = file.type ? ALLOWED_MIME.has(file.type) : false;
  const extOk = ALLOWED_EXT.has(ext);
  if (!mimeOk && !extOk) {
    return 'Use a WAV or M4A file.';
  }
  return null;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120);
}

function resolveMime(file: File): string {
  if (file.type && ALLOWED_MIME.has(file.type)) return file.type;
  const ext = extensionOf(file.name);
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
    default:
      return file.type || 'application/octet-stream';
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
      const body = xhr.response as { message?: string; error?: string } | null;
      const message =
        body?.message || body?.error || `Upload failed (${xhr.status}).`;
      resolve({ ok: false, error: message });
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
