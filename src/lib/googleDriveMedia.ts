export const GOOGLE_DRIVE_MEDIA_API_PATH = '/api/drive/media';

/** ~43 s of 192 kbps audio. Keeps Vercel from buffering the rest of a chapter on seek. */
export const AUDIO_LISTEN_CHUNK_BYTES = 1024 * 1024;

const FILE_ID_PATTERN = /^[A-Za-z0-9_-]{20,80}$/;
const BYTE_RANGE_PATTERN = /^bytes=(\d+)-(\d+)?$/i;

export function parseGoogleDriveFileId(value: string | null | undefined): string | null {
  const id = value?.trim() ?? '';
  if (!FILE_ID_PATTERN.test(id)) return null;
  return id;
}

export function googleDriveUpstreamUrl(fileId: string): string {
  return `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download`;
}

/** Same-origin URL so Chrome can play Drive masters (ORB blocks Drive hosts). */
export function googleDriveMediaUrl(fileId: string): string {
  const id = parseGoogleDriveFileId(fileId);
  if (!id) return '';
  return `${GOOGLE_DRIVE_MEDIA_API_PATH}?id=${encodeURIComponent(id)}`;
}

export function isGoogleDriveMediaUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url, 'http://localhost');
    if (
      parsed.pathname === GOOGLE_DRIVE_MEDIA_API_PATH ||
      parsed.pathname.endsWith('/api/drive/media')
    ) {
      return true;
    }
    const host = parsed.hostname;
    return (
      host === 'drive.google.com' ||
      host === 'docs.google.com' ||
      host === 'drive.usercontent.google.com'
    );
  } catch {
    return false;
  }
}

/** Close open-ended or oversized Range headers so a seek does not download to EOF. */
export function capByteRange(
  rangeHeader: string | null | undefined,
  chunkBytes = AUDIO_LISTEN_CHUNK_BYTES,
): string {
  const match = BYTE_RANGE_PATTERN.exec(rangeHeader?.trim() ?? '');
  const start = match ? Number(match[1]) : 0;
  const requestedEnd =
    match?.[2] != null ? Number(match[2]) : start + chunkBytes - 1;
  const end = Math.min(requestedEnd, start + chunkBytes - 1);
  return `bytes=${start}-${end}`;
}
