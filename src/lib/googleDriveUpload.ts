import type { UploadProgress } from '@/lib/audiobookSessionTakes';

export const GOOGLE_DRIVE_STORAGE_PROVIDER = 'google-drive';

type DriveFile = {
  id: string;
  name?: string;
  mimeType?: string;
  size?: string;
  webViewLink?: string;
};

type DriveUploadResult =
  | { ok: true; file: DriveFile }
  | { ok: false; error: string; aborted?: boolean };

function readError(xhr: XMLHttpRequest, fallback: string) {
  const response = xhr.response as { error?: string | { message?: string } } | null;
  if (typeof response?.error === 'string') return response.error;
  if (response?.error && typeof response.error.message === 'string') {
    return response.error.message;
  }
  return fallback;
}

function putFile(options: {
  uploadUrl: string;
  file: File;
  contentType: string;
  signal?: AbortSignal;
  onProgress?: (loaded: number, total: number) => void;
}): Promise<DriveUploadResult> {
  const { uploadUrl, file, contentType, signal, onProgress } = options;

  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve({ ok: false, error: 'Upload cancelled.', aborted: true });
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', contentType);

    const abort = () => xhr.abort();
    signal?.addEventListener('abort', abort, { once: true });

    xhr.upload.onprogress = (event) => {
      onProgress?.(event.loaded, event.lengthComputable ? event.total : file.size);
    };
    xhr.onload = () => {
      signal?.removeEventListener('abort', abort);
      if (xhr.status >= 200 && xhr.status < 300) {
        const driveFile = xhr.response as DriveFile | null;
        if (driveFile?.id) {
          resolve({ ok: true, file: driveFile });
          return;
        }
      }
      resolve({
        ok: false,
        error: readError(xhr, `Google Drive upload failed (${xhr.status}).`),
      });
    };
    xhr.onerror = () => {
      signal?.removeEventListener('abort', abort);
      resolve({ ok: false, error: 'Network error while uploading to Google Drive.' });
    };
    xhr.onabort = () => {
      signal?.removeEventListener('abort', abort);
      resolve({ ok: false, error: 'Upload cancelled.', aborted: true });
    };
    xhr.send(file);
  });
}

export async function uploadFileToGoogleDrive(options: {
  file: File;
  contentType: string;
  signal?: AbortSignal;
  onProgress?: (progress: UploadProgress) => void;
}): Promise<DriveUploadResult> {
  const { file, contentType, signal, onProgress } = options;
  const sessionResponse = await fetch('/api/drive/initiate-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      mimeType: contentType,
      size: file.size,
    }),
    signal,
  });
  const session = (await sessionResponse.json().catch(() => null)) as {
    uploadUrl?: string;
    error?: string;
  } | null;

  if (!sessionResponse.ok || !session?.uploadUrl) {
    return {
      ok: false,
      error: session?.error || 'Could not prepare the Google Drive upload.',
      aborted: signal?.aborted,
    };
  }

  return putFile({
    uploadUrl: session.uploadUrl,
    file,
    contentType,
    signal,
    onProgress: (loaded, total) => {
      const percent = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
      onProgress?.({
        phase: 'uploading',
        loadedBytes: loaded,
        totalBytes: total,
        percent,
        message: `Uploading to Google Drive · ${percent}%`,
      });
    },
  });
}
