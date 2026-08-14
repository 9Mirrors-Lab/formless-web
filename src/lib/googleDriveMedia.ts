export const GOOGLE_DRIVE_MEDIA_API_PATH = '/api/drive/media';

const FILE_ID_PATTERN = /^[A-Za-z0-9_-]{20,80}$/;

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
