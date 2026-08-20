import {
  ENDORSEMENTS,
  ENDORSEMENT_OVERLAYS,
  statusFromCuts,
  type Endorsement,
  type EndorsementOverlay,
} from '../data/endorsements';
import {
  inferPlacements,
  inferThemes,
  inferVoices,
  parseEndorsementDoc,
  type ParsedEndorsement,
} from './parseEndorsementDoc';

export const ENDORSEMENT_DOC_ID = '1JkeEdciMh2ytvVM-uh-rvSio374oiajUA-G26wI6eps';
export const ENDORSEMENT_DOC_EDIT_URL = `https://docs.google.com/document/d/${ENDORSEMENT_DOC_ID}/edit`;
export const ENDORSEMENT_DOC_EXPORT_URL = `https://docs.google.com/document/d/${ENDORSEMENT_DOC_ID}/export?format=txt`;
export const ENDORSEMENT_API_PATH = '/api/endorsements';

const CACHE_TTL_MS = 45_000;

export type EndorsementDocPayload = {
  rows: Endorsement[];
  fetchedAt: string;
  source: 'live' | 'fallback';
};

export type FetchEndorsementDocResult =
  | ({ ok: true } & EndorsementDocPayload)
  | { ok: false; error: string };

type CacheEntry = {
  at: number;
  payload: EndorsementDocPayload;
};

let memoryCache: CacheEntry | null = null;

export function hydrateEndorsement(
  parsed: ParsedEndorsement,
  received: number,
): Endorsement {
  const overlay = ENDORSEMENT_OVERLAYS[parsed.id];
  const cuts = parsed.cuts;
  const status = statusFromCuts(cuts);
  const voices = overlay?.voices ?? inferVoices(parsed.role);
  const themes =
    overlay?.themes ?? inferThemes(cuts.map((cut) => cut.text).join('\n'));
  const placements = overlay?.placements ?? inferPlacements(voices);

  return {
    id: parsed.id,
    name: overlay?.name ?? parsed.name,
    role: overlay?.role ?? parsed.role,
    credentials: overlay?.credentials ?? parsed.credentials,
    voices,
    themes,
    placements,
    status,
    received,
    note: mergedNote(parsed.note, overlay, status),
    cuts,
  };
}

export function endorsementsFromDocText(raw: string): Endorsement[] {
  return parseEndorsementDoc(raw).map((row, index) =>
    hydrateEndorsement(row, index + 1),
  );
}

export async function loadEndorsementDoc(options?: {
  refresh?: boolean;
}): Promise<EndorsementDocPayload> {
  const refresh = options?.refresh === true;
  if (!refresh && memoryCache && Date.now() - memoryCache.at < CACHE_TTL_MS) {
    return memoryCache.payload;
  }

  try {
    const text = await fetchEndorsementDocText();
    const rows = endorsementsFromDocText(text);
    if (rows.length === 0) {
      throw new Error('The Google Doc did not contain any letters.');
    }
    const payload: EndorsementDocPayload = {
      rows,
      fetchedAt: new Date().toISOString(),
      source: 'live',
    };
    memoryCache = { at: Date.now(), payload };
    return payload;
  } catch {
    return {
      rows: ENDORSEMENTS,
      fetchedAt: new Date().toISOString(),
      source: 'fallback',
    };
  }
}

export async function fetchLiveEndorsements(options?: {
  refresh?: boolean;
}): Promise<FetchEndorsementDocResult> {
  const url = options?.refresh
    ? `${ENDORSEMENT_API_PATH}?refresh=1`
    : ENDORSEMENT_API_PATH;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: options?.refresh ? 'no-store' : 'default',
    });
    if (!response.ok) {
      return {
        ok: true,
        rows: ENDORSEMENTS,
        fetchedAt: new Date().toISOString(),
        source: 'fallback',
      };
    }
    const body: unknown = await response.json();
    const payload = asPayload(body);
    if (!payload) {
      return {
        ok: true,
        rows: ENDORSEMENTS,
        fetchedAt: new Date().toISOString(),
        source: 'fallback',
      };
    }
    return { ok: true, ...payload };
  } catch {
    return {
      ok: false,
      error: 'Could not read the endorsements Google Doc.',
    };
  }
}

export async function fetchEndorsementDocText(): Promise<string> {
  const response = await fetch(ENDORSEMENT_DOC_EXPORT_URL, {
    headers: {
      Accept: 'text/plain,text/html;q=0.8,*/*;q=0.5',
      'User-Agent':
        'Mozilla/5.0 (compatible; FormlessEndorsements/1.0; +https://eyesclosed.co)',
    },
    redirect: 'follow',
  });
  if (!response.ok) {
    throw new Error(`Google Doc export failed (${response.status}).`);
  }
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('text/html')) {
    throw new Error('Google Doc export returned a sign-in page.');
  }
  return response.text();
}

function mergedNote(
  parsedNote: string | undefined,
  overlay: EndorsementOverlay | undefined,
  status: Endorsement['status'],
): string | undefined {
  const overlayNote = overlay?.note;
  if (overlayNote && /still needs|still in play/i.test(overlayNote)) {
    if (status === 'ready') return parsedNote;
    return overlayNote;
  }
  return overlayNote ?? parsedNote;
}

function asPayload(value: unknown): EndorsementDocPayload | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Partial<EndorsementDocPayload>;
  if (!Array.isArray(record.rows) || record.rows.length === 0) return null;
  if (!record.rows.every(isEndorsementShape)) return null;
  if (record.source !== 'live' && record.source !== 'fallback') return null;
  if (typeof record.fetchedAt !== 'string') return null;
  return {
    rows: record.rows,
    fetchedAt: record.fetchedAt,
    source: record.source,
  };
}

function isEndorsementShape(value: unknown): value is Endorsement {
  if (!value || typeof value !== 'object') return false;
  const row = value as Partial<Endorsement>;
  return (
    typeof row.id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.role === 'string' &&
    Array.isArray(row.cuts) &&
    row.cuts.length > 0
  );
}
