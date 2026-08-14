import type { IncomingMessage, ServerResponse } from 'node:http';

import { streamGoogleDriveMedia } from '../../src/lib/streamGoogleDriveMedia';

export const config = {
  maxDuration: 60,
  supportsResponseStreaming: true,
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const fileId = new URL(req.url ?? '', 'http://localhost').searchParams.get('id');
  await streamGoogleDriveMedia(req, res, fileId);
}
