const FILE_ID_PATTERN = /^[A-Za-z0-9_-]{20,80}$/;
const BYTE_RANGE_PATTERN = /^bytes=(\d+)-(\d+)?$/i;
const AUDIO_LISTEN_CHUNK_BYTES = 1024 * 1024;

function capByteRange(rangeHeader: string | undefined): string {
  const match = BYTE_RANGE_PATTERN.exec(rangeHeader?.trim() ?? '');
  const start = match ? Number(match[1]) : 0;
  const requestedEnd =
    match?.[2] != null ? Number(match[2]) : start + AUDIO_LISTEN_CHUNK_BYTES - 1;
  const end = Math.min(requestedEnd, start + AUDIO_LISTEN_CHUNK_BYTES - 1);
  return `bytes=${start}-${end}`;
}

function parseGoogleDriveFileId(value: string | null | undefined): string | null {
  const id = value?.trim() ?? '';
  if (!FILE_ID_PATTERN.test(id)) return null;
  return id;
}

function googleDriveUpstreamUrl(fileId: string): string {
  return `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download`;
}

function headerValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

type ApiRequest = {
  method?: string;
  url?: string;
  query?: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  send: (body: string | Buffer) => void;
};

export const config = {
  maxDuration: 60,
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    const method = (req.method ?? 'GET').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
      res.setHeader('Allow', 'GET, HEAD');
      res.status(405).send('Method not allowed.');
      return;
    }

    const url = new URL(req.url ?? '', 'http://localhost/api/drive/media');
    const fileId = parseGoogleDriveFileId(
      url.searchParams.get('id') ?? headerValue(req.query?.id),
    );
    if (!fileId) {
      res.status(400).send('Invalid Drive file id.');
      return;
    }

    const range = capByteRange(headerValue(req.headers.range));
    const upstream = await fetch(googleDriveUpstreamUrl(fileId), {
      headers: {
        Accept: 'audio/mpeg,application/octet-stream,*/*',
        Range: range,
      },
      redirect: 'follow',
    });

    const contentType = upstream.headers.get('content-type') ?? '';
    if (contentType.includes('text/html')) {
      res.status(502).send('Drive returned a confirmation page instead of audio.');
      return;
    }
    if (!upstream.ok && upstream.status !== 206) {
      res.status(502).send('Drive master is not available.');
      return;
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    const length = upstream.headers.get('content-length');
    if (length) res.setHeader('Content-Length', length);
    const contentRange = upstream.headers.get('content-range');
    if (contentRange) res.setHeader('Content-Range', contentRange);

    if (method === 'HEAD') {
      res.status(upstream.status).send('');
      return;
    }

    const bytes = Buffer.from(await upstream.arrayBuffer());
    res.status(upstream.status).send(bytes);
  } catch (error) {
    console.error('Drive media proxy failed', error);
    const message = error instanceof Error ? error.message : 'Drive proxy failed.';
    res.status(502).send(message);
  }
}
