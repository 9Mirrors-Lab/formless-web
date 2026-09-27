import {
  parseSonikaInquiryNotifyPayload,
  sendSonikaInquiryNotifyEmail,
} from '../src/lib/sonikaInquiryEmail.js';

type ApiRequest = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

function headerValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function requestOrigin(req: ApiRequest): string | undefined {
  return headerValue(req.headers?.origin);
}

function originIsAllowed(req: ApiRequest): boolean {
  const origin = requestOrigin(req);
  if (!origin) return true;

  const configured = process.env.INQUIRY_NOTIFY_ALLOWED_ORIGIN?.trim();
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

  const method = (req.method ?? 'GET').toUpperCase();
  if (method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(204).json({});
    return;
  }

  if (method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  if (!originIsAllowed(req)) {
    res.status(403).json({ error: 'Origin not allowed.' });
    return;
  }

  const parsed = parseSonikaInquiryNotifyPayload(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  try {
    const result = await sendSonikaInquiryNotifyEmail(parsed.payload);
    if (!result.ok) {
      res.status(result.status ?? 502).json({ error: result.error });
      return;
    }
    res.status(200).json({ ok: true, id: result.id ?? null });
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error ? error.message : 'Failed to send inquiry email.',
    });
  }
}
