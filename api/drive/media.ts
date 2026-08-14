import type { IncomingMessage, ServerResponse } from 'node:http';

import {
  fetchGoogleDriveMedia,
  nodeIncomingToRequest,
  streamGoogleDriveMedia,
} from '../../src/lib/streamGoogleDriveMedia';

export const config = {
  maxDuration: 60,
  supportsResponseStreaming: true,
};

function isWebRequest(req: IncomingMessage | Request): req is Request {
  return typeof (req as Request).headers?.get === 'function';
}

export async function GET(request: Request) {
  return fetchGoogleDriveMedia(request);
}

export async function HEAD(request: Request) {
  return fetchGoogleDriveMedia(request);
}

export default async function handler(
  req: IncomingMessage | Request,
  res?: ServerResponse,
) {
  try {
    if (isWebRequest(req) || !res) {
      const request = isWebRequest(req) ? req : nodeIncomingToRequest(req);
      return fetchGoogleDriveMedia(request);
    }

    await streamGoogleDriveMedia(req, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Drive proxy failed.';
    if (res && !res.headersSent) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(message);
      return;
    }
    return new Response(message, {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
