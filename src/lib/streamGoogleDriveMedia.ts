import type { IncomingMessage, ServerResponse } from 'node:http';

import { googleDriveUpstreamUrl, parseGoogleDriveFileId } from './googleDriveMedia';

function headerValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function textResponse(
  status: number,
  message: string,
  extra?: Record<string, string>,
): Response {
  return new Response(message, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...extra,
    },
  });
}

type NodeOrVercelRequest = IncomingMessage & {
  query?: Record<string, string | string[] | undefined>;
};

export function nodeIncomingToRequest(req: NodeOrVercelRequest): Request {
  const url = new URL(req.url ?? '', 'http://localhost/api/drive/media');
  const queryId = headerValue(req.query?.id);
  if (queryId && !url.searchParams.get('id')) {
    url.searchParams.set('id', queryId);
  }
  const headers = new Headers();
  const range = headerValue(req.headers.range);
  if (range) headers.set('Range', range);
  return new Request(url, { method: req.method ?? 'GET', headers });
}

export async function fetchGoogleDriveMedia(request: Request): Promise<Response> {
  const method = request.method.toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') {
    return textResponse(405, 'Method not allowed.', { Allow: 'GET, HEAD' });
  }

  const fileId = parseGoogleDriveFileId(new URL(request.url).searchParams.get('id'));
  if (!fileId) {
    return textResponse(400, 'Invalid Drive file id.');
  }

  const range = request.headers.get('range');
  const upstream = await fetch(googleDriveUpstreamUrl(fileId), {
    headers: {
      Accept: 'audio/mpeg,application/octet-stream,*/*',
      ...(range ? { Range: range } : {}),
    },
    redirect: 'follow',
  });

  const contentType = upstream.headers.get('content-type') ?? '';
  if (contentType.includes('text/html')) {
    return textResponse(502, 'Drive returned a confirmation page instead of audio.');
  }
  if (!upstream.ok && upstream.status !== 206) {
    return textResponse(502, 'Drive master is not available.');
  }

  const headers = new Headers();
  headers.set('Content-Type', 'audio/mpeg');
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'public, max-age=3600');
  const length = upstream.headers.get('content-length');
  if (length) headers.set('Content-Length', length);
  const contentRange = upstream.headers.get('content-range');
  if (contentRange) headers.set('Content-Range', contentRange);

  return new Response(method === 'HEAD' ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
}

export async function writeWebResponseToNode(
  response: Response,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (req.method === 'HEAD' || !response.body) {
    res.end();
    return;
  }

  const reader = response.body.getReader();
  const abort = () => {
    void reader.cancel();
  };
  req.on('aborted', abort);

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      const chunk = Buffer.from(value);
      if (!res.write(chunk)) {
        await new Promise<void>((resolve) => res.once('drain', resolve));
      }
    }
    res.end();
  } catch (error) {
    if (res.writableEnded) return;
    if (!res.headersSent) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Drive stream failed.');
      return;
    }
    res.destroy(error instanceof Error ? error : undefined);
  } finally {
    req.off('aborted', abort);
  }
}

export async function streamGoogleDriveMedia(
  req: IncomingMessage,
  res: ServerResponse,
  fileIdRaw?: string | null,
): Promise<void> {
  const request = nodeIncomingToRequest(req);
  if (fileIdRaw && !new URL(request.url).searchParams.get('id')) {
    const url = new URL(request.url);
    url.searchParams.set('id', fileIdRaw);
    const headers = new Headers(request.headers);
    const ranged = new Request(url, { method: request.method, headers });
    const response = await fetchGoogleDriveMedia(ranged);
    await writeWebResponseToNode(response, req, res);
    return;
  }

  const response = await fetchGoogleDriveMedia(request);
  await writeWebResponseToNode(response, req, res);
}
