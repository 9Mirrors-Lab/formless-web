import { OAuth2Client } from 'google-auth-library';

const DEFAULT_FOLDER_ID = '1rJIHMxtvbK9qd9mxHdmNYADxbWEsihjB';
const MAX_BYTES = 629_145_600;
const ALLOWED_EXTENSIONS = new Set(['.wav', '.wave', '.m4a', '.mp3', '.aup3']);

type ApiRequest = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type UploadRequest = {
  filename?: unknown;
  mimeType?: unknown;
  size?: unknown;
};

function extensionOf(filename: string) {
  const dot = filename.lastIndexOf('.');
  return dot >= 0 ? filename.slice(dot).toLowerCase() : '';
}

function safeFilename(filename: string) {
  return filename
    .normalize('NFKC')
    .replace(/[/\\<>:"|?*]+/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

function getAuthorizedClient() {
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN?.trim();
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET?.trim();

  if (refreshToken && clientId && clientSecret) {
    const client = new OAuth2Client(clientId, clientSecret);
    client.setCredentials({ refresh_token: refreshToken });
    return client;
  }
  throw new Error('Google Drive owner authorization is not configured.');
}

function requestOrigin(req: ApiRequest) {
  const value = req.headers.origin;
  return Array.isArray(value) ? value[0] : value;
}

function originIsAllowed(req: ApiRequest) {
  const origin = requestOrigin(req);
  if (!origin) return true;

  const configured = process.env.DRIVE_UPLOAD_ALLOWED_ORIGIN?.trim();
  if (configured) {
    const allowed = configured
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    return allowed.includes(origin);
  }

  return (
    origin === 'https://eyesclosed.love' ||
    origin === 'https://www.eyesclosed.love' ||
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
    /^https:\/\/formless(?:-web)?(?:-[a-z0-9]+)+\.vercel\.app$/.test(origin) ||
    origin === 'https://formless-web.vercel.app'
  );
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  if (!originIsAllowed(req)) {
    res.status(403).json({ error: 'Upload origin is not allowed.' });
    return;
  }

  const body = (req.body ?? {}) as UploadRequest;
  const filename = typeof body.filename === 'string' ? safeFilename(body.filename) : '';
  const mimeType = typeof body.mimeType === 'string' ? body.mimeType.trim() : '';
  const size = typeof body.size === 'number' ? body.size : Number.NaN;

  if (!filename || !ALLOWED_EXTENSIONS.has(extensionOf(filename))) {
    res.status(400).json({ error: 'Use a WAV, M4A, MP3, or Audacity project (.aup3).' });
    return;
  }
  if (!Number.isSafeInteger(size) || size <= 0 || size > MAX_BYTES) {
    res.status(400).json({ error: 'File must be 600 MB or smaller.' });
    return;
  }

  try {
    const client = await getAuthorizedClient();
    const accessToken = await client.getAccessToken();
    const token = typeof accessToken === 'string' ? accessToken : accessToken.token;
    if (!token) throw new Error('Could not authorize the Drive upload.');

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim() || DEFAULT_FOLDER_ID;
    const driveResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,mimeType,size,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Length': String(size),
          'X-Upload-Content-Type': mimeType || 'application/octet-stream',
        },
        body: JSON.stringify({
          name: filename,
          parents: [folderId],
          appProperties: { source: 'formless-companion' },
        }),
      },
    );

    if (!driveResponse.ok) {
      const detail = await driveResponse.text();
      console.error('Drive upload session failed', driveResponse.status, detail);
      res.status(502).json({ error: 'Google Drive could not prepare the upload.' });
      return;
    }

    const uploadUrl = driveResponse.headers.get('location');
    if (!uploadUrl) {
      res.status(502).json({ error: 'Google Drive did not return an upload session.' });
      return;
    }

    res.status(200).json({ uploadUrl });
  } catch (error) {
    console.error('Drive upload initialization error', error);
    const message = error instanceof Error ? error.message : 'Could not prepare the upload.';
    res.status(message.includes('not configured') ? 503 : 500).json({ error: message });
  }
}
