import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AUDIO_LISTEN_CHUNK_BYTES,
  capByteRange,
  googleDriveUpstreamUrl,
} from '@/lib/googleDriveMedia';
import { fetchGoogleDriveMedia } from '@/lib/streamGoogleDriveMedia';

const FILE_ID = '1SuU-J6AJhNMN0V4wx5fTvP1U7aL6y7jN';

function mediaRequest(init?: {
  method?: string;
  id?: string | null;
  range?: string;
}) {
  const url = new URL('http://localhost/api/drive/media');
  if (init?.id !== null) url.searchParams.set('id', init?.id ?? FILE_ID);
  const headers = new Headers();
  if (init?.range) headers.set('Range', init.range);
  return new Request(url, { method: init?.method ?? 'GET', headers });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('capByteRange', () => {
  it('turns a missing or open-ended Range into a closed listen chunk', () => {
    expect(capByteRange(null)).toBe(`bytes=0-${AUDIO_LISTEN_CHUNK_BYTES - 1}`);
    expect(capByteRange('bytes=20000000-')).toBe(
      `bytes=20000000-${20000000 + AUDIO_LISTEN_CHUNK_BYTES - 1}`,
    );
  });

  it('keeps small closed ranges and caps oversized closed ranges', () => {
    expect(capByteRange('bytes=0-1')).toBe('bytes=0-1');
    expect(capByteRange('bytes=100-9999999')).toBe(
      `bytes=100-${100 + AUDIO_LISTEN_CHUNK_BYTES - 1}`,
    );
  });
});

describe('fetchGoogleDriveMedia', () => {
  it('rejects non-GET methods', async () => {
    const response = await fetchGoogleDriveMedia(mediaRequest({ method: 'POST' }));
    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('GET, HEAD');
  });

  it('rejects missing or unsafe file ids', async () => {
    const missing = await fetchGoogleDriveMedia(mediaRequest({ id: null }));
    expect(missing.status).toBe(400);

    const unsafe = await fetchGoogleDriveMedia(mediaRequest({ id: 'abc123' }));
    expect(unsafe.status).toBe(400);
  });

  it('proxies audio bytes and forwards Range with global fetch', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe(googleDriveUpstreamUrl(FILE_ID));
      expect(new Headers(init?.headers).get('Range')).toBe('bytes=0-1');
      return new Response('AB', {
        status: 206,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': '2',
          'Content-Range': 'bytes 0-1/1039226',
        },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await fetchGoogleDriveMedia(
      mediaRequest({ range: 'bytes=0-1' }),
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(response.status).toBe(206);
    expect(response.headers.get('Content-Type')).toBe('audio/mpeg');
    expect(response.headers.get('Accept-Ranges')).toBe('bytes');
    expect(response.headers.get('Content-Range')).toBe('bytes 0-1/1039226');
    expect(await response.text()).toBe('AB');
  });

  it('caps open-ended seek ranges before calling Drive', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(new Headers(init?.headers).get('Range')).toBe(
        `bytes=20000000-${20000000 + AUDIO_LISTEN_CHUNK_BYTES - 1}`,
      );
      return new Response('chunk', {
        status: 206,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': '5',
          'Content-Range': `bytes 20000000-${20000000 + AUDIO_LISTEN_CHUNK_BYTES - 1}/86501921`,
        },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await fetchGoogleDriveMedia(
      mediaRequest({ range: 'bytes=20000000-' }),
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(response.status).toBe(206);
    expect(await response.text()).toBe('chunk');
  });

  it('returns 502 when Drive serves an HTML confirmation page', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response('<html>confirm</html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }),
      ),
    );

    const response = await fetchGoogleDriveMedia(mediaRequest());
    expect(response.status).toBe(502);
    expect(await response.text()).toMatch(/confirmation page/i);
  });
});
