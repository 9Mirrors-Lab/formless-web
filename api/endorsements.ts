import { loadEndorsementDoc } from '../src/lib/endorsementDoc.js';

type ApiRequest = {
  method?: string;
  url?: string;
  query?: Record<string, string | string[] | undefined>;
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

function wantsRefresh(req: ApiRequest): boolean {
  const url = new URL(req.url ?? '', 'http://localhost/api/endorsements');
  if (url.searchParams.get('refresh') === '1') return true;
  return headerValue(req.query?.refresh) === '1';
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const method = (req.method ?? 'GET').toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const payload = await loadEndorsementDoc({ refresh: wantsRefresh(req) });
  res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate');
  res.status(200).json(payload);
}
