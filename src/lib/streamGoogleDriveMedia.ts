import { Readable } from 'node:stream';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { Agent, fetch as undiciFetch } from 'undici';

import { googleDriveUpstreamUrl, parseGoogleDriveFileId } from './googleDriveMedia';

const driveAgent = new Agent({
  connectTimeout: 30_000,
  headersTimeout: 60_000,
  bodyTimeout: 0,
});

function headerValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function fail(res: ServerResponse, status: number, message: string) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(message);
}

export async function streamGoogleDriveMedia(
  req: IncomingMessage,
  res: ServerResponse,
  fileIdRaw: string | null,
): Promise<void> {
  const method = req.method ?? 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    fail(res, 405, 'Method not allowed.');
    return;
  }

  const fileId = parseGoogleDriveFileId(fileIdRaw);
  if (!fileId) {
    fail(res, 400, 'Invalid Drive file id.');
    return;
  }

  const range = headerValue(req.headers.range);
  const upstream = await undiciFetch(googleDriveUpstreamUrl(fileId), {
    dispatcher: driveAgent,
    headers: {
      Accept: 'audio/mpeg,application/octet-stream,*/*',
      ...(range ? { Range: range } : {}),
    },
    redirect: 'follow',
  });

  const contentType = upstream.headers.get('content-type') ?? '';
  if (contentType.includes('text/html')) {
    fail(res, 502, 'Drive returned a confirmation page instead of audio.');
    return;
  }
  if (!upstream.ok && upstream.status !== 206) {
    fail(res, 502, 'Drive master is not available.');
    return;
  }

  res.statusCode = upstream.status;
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  const length = upstream.headers.get('content-length');
  if (length) res.setHeader('Content-Length', length);
  const contentRange = upstream.headers.get('content-range');
  if (contentRange) res.setHeader('Content-Range', contentRange);

  if (method === 'HEAD' || !upstream.body) {
    res.end();
    return;
  }

  const nodeStream = Readable.fromWeb(
    upstream.body as import('node:stream/web').ReadableStream,
  );
  const onAbort = () => {
    nodeStream.destroy();
  };
  req.on('aborted', onAbort);
  res.on('close', onAbort);
  nodeStream.on('error', (error: Error) => {
    req.off('aborted', onAbort);
    res.off('close', onAbort);
    if (!res.headersSent) {
      fail(res, 502, 'Drive stream failed.');
      return;
    }
    res.destroy(error);
  });
  nodeStream.on('end', () => {
    req.off('aborted', onAbort);
    res.off('close', onAbort);
  });
  nodeStream.pipe(res);
}
