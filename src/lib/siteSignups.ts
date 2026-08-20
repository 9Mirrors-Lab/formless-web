import { getBrowserSupabaseClient, hasSupabaseEnv } from '@/lib/supabase';

export const SIGNUP_LISTS = [
  'book_release',
  'newsletter',
  'advance_listen',
  'account',
] as const;

export type SignupList = (typeof SIGNUP_LISTS)[number];

export type SignupMetricKey = 'people' | 'entries' | SignupList;

export type SiteSignup = {
  id: string;
  email: string;
  source: string;
  list: SignupList;
  createdAt: string;
};

export type SignupSummary = {
  total: number;
  uniqueEmails: number;
  overlapCount: number;
  byList: Record<SignupList, number>;
};

export type FetchSiteSignupsResult =
  | { ok: true; rows: SiteSignup[] }
  | { ok: false; error: string };

type SignupRow = {
  id: string;
  email: string | null;
  source?: string | null;
  created_at: string;
};

export function signupListLabel(list: SignupList): string {
  switch (list) {
    case 'book_release':
      return 'Book waitlist';
    case 'newsletter':
      return 'Newsletter';
    case 'advance_listen':
      return 'Advance listen';
    case 'account':
      return 'Account';
    default: {
      const _exhaustive: never = list;
      return _exhaustive;
    }
  }
}

export function signupListMeaning(list: SignupList): string {
  switch (list) {
    case 'book_release':
      return 'Tell me when the book is out.';
    case 'newsletter':
      return 'Keep me on the about-page list.';
    case 'advance_listen':
      return 'I signed in to hear audio.';
    case 'account':
      return 'Counted under Advance listen.';
    default: {
      const _exhaustive: never = list;
      return _exhaustive;
    }
  }
}

export function signupMetricHelp(key: SignupMetricKey): string {
  switch (key) {
    case 'people':
      return 'Unique email addresses. Someone on two lists still counts as one person.';
    case 'entries':
      return 'Total rows. The same person on two lists counts twice.';
    case 'book_release':
      return `${signupListMeaning('book_release')} Emails from the notify form on the book page.`;
    case 'newsletter':
      return `${signupListMeaning('newsletter')} Emails from Stay Close on the about page.`;
    case 'advance_listen':
      return `${signupListMeaning('advance_listen')} Includes Auth accounts from /advance-listen.`;
    case 'account':
      return 'The public /signup page. Those emails now count under Advance listen.';
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}

export const SIGNUP_DESK_PATH = '/brand/signups';

export type SignupDeskList = Exclude<SignupList, 'account'>;

export function isSignupDeskList(value: string | null): value is SignupDeskList {
  return value === 'book_release' || value === 'newsletter' || value === 'advance_listen';
}

export function signupDeskHref(list?: SignupDeskList | 'all'): string {
  if (!list || list === 'all') return SIGNUP_DESK_PATH;
  return `${SIGNUP_DESK_PATH}?list=${list}`;
}

export function signupDeskListFromSearch(search: string): SignupDeskList | 'all' {
  const query = search.startsWith('?') ? search : `?${search}`;
  const value = new URLSearchParams(query).get('list');
  return isSignupDeskList(value) ? value : 'all';
}

export function signupListPath(list: SignupList): string {
  switch (list) {
    case 'book_release':
      return '/book';
    case 'newsletter':
      return '/about';
    case 'advance_listen':
      return '/advance-listen';
    case 'account':
      return '/signup';
    default: {
      const _exhaustive: never = list;
      return _exhaustive;
    }
  }
}

export function emptySignupSummary(): SignupSummary {
  return {
    total: 0,
    uniqueEmails: 0,
    overlapCount: 0,
    byList: {
      book_release: 0,
      newsletter: 0,
      advance_listen: 0,
      account: 0,
    },
  };
}

export function summarizeSignups(rows: SiteSignup[]): SignupSummary {
  const byList = emptySignupSummary().byList;
  const listsByEmail = new Map<string, Set<SignupList>>();

  for (const row of rows) {
    byList[row.list] += 1;
    const lists = listsByEmail.get(row.email) ?? new Set<SignupList>();
    lists.add(row.list);
    listsByEmail.set(row.email, lists);
  }

  let overlapCount = 0;
  for (const lists of listsByEmail.values()) {
    if (lists.size > 1) overlapCount += 1;
  }

  return {
    total: rows.length,
    uniqueEmails: listsByEmail.size,
    overlapCount,
    byList,
  };
}

export function filterSignups(
  rows: SiteSignup[],
  options: { list: SignupList | 'all'; query: string },
): SiteSignup[] {
  const needle = options.query.trim().toLowerCase();

  return rows.filter((row) => {
    if (options.list !== 'all' && row.list !== options.list) return false;
    if (!needle) return true;

    const haystack = [
      row.email,
      signupListLabel(row.list),
      row.source,
      signupListPath(row.list),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(needle);
  });
}

function csvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export function signupsToCsv(rows: SiteSignup[]): string {
  const header = ['email', 'list', 'source', 'page', 'created_at'];
  const lines = rows.map((row) =>
    [
      csvCell(row.email),
      csvCell(signupListLabel(row.list)),
      csvCell(row.source),
      csvCell(signupListPath(row.list)),
      csvCell(row.createdAt),
    ].join(','),
  );
  return [header.join(','), ...lines].join('\n');
}

function isMissingRelationError(message: string | undefined): boolean {
  if (!message) return false;
  return /could not find the table/i.test(message) || /does not exist/i.test(message);
}

function queryRows(
  result: { data: SignupRow[] | null; error: { message: string } | null },
): { ok: true; rows: SignupRow[] | null } | { ok: false; error: string } {
  if (!result.error) return { ok: true, rows: result.data };
  if (isMissingRelationError(result.error.message)) return { ok: true, rows: [] };
  return { ok: false, error: result.error.message };
}

/** Internal and test addresses that should never appear on signup lists. */
const EXCLUDED_SIGNUP_EMAIL_NEEDLES = [
  'riles',
  'rilestrade',
  'soni',
  'sonikacottman',
  'testing@gmail',
] as const;

const EXCLUDED_SIGNUP_EMAIL_DOMAINS = [
  'example.com',
  'example.net',
  'example.org',
  'localhost',
  'invalid',
  'test',
] as const;

function signupEmailDomain(email: string): string {
  const at = email.lastIndexOf('@');
  if (at < 0) return '';
  return email.slice(at + 1);
}

function isExcludedSignupDomain(domain: string): boolean {
  if (!domain) return false;
  return EXCLUDED_SIGNUP_EMAIL_DOMAINS.some(
    (suffix) => domain === suffix || domain.endsWith(`.${suffix}`),
  );
}

export function isExcludedSignupEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  if (isExcludedSignupDomain(signupEmailDomain(normalized))) return true;
  return EXCLUDED_SIGNUP_EMAIL_NEEDLES.some((needle) => normalized.includes(needle));
}

function mapSignupRows(
  rows: SignupRow[] | null,
  list: SignupList,
  fallbackSource: string,
): SiteSignup[] {
  const mapped: SiteSignup[] = [];
  for (const row of rows ?? []) {
    const email = row.email?.trim().toLowerCase();
    if (!email || isExcludedSignupEmail(email)) continue;
    mapped.push({
      id: `${list}:${row.id}`,
      email,
      source: row.source?.trim() || fallbackSource,
      list,
      createdAt: row.created_at,
    });
  }
  return mapped;
}

/** Keep one row per email. Prefer the earlier timestamp. */
export function mergeSignupsByEmail(rows: SiteSignup[]): SiteSignup[] {
  const byEmail = new Map<string, SiteSignup>();
  for (const row of rows) {
    const existing = byEmail.get(row.email);
    if (!existing || row.createdAt < existing.createdAt) {
      byEmail.set(row.email, row);
    }
  }
  return [...byEmail.values()];
}

export async function fetchSiteSignups(): Promise<FetchSiteSignupsResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: 'Supabase is not configured in this environment.' };
  }

  const supabase = getBrowserSupabaseClient();
  const signupSelect = 'id, email, source, created_at';

  const [book, newsletter, advanceListen, accounts] = await Promise.all([
    supabase
      .from('book_release_signups')
      .select(signupSelect)
      .order('created_at', { ascending: false }),
    supabase
      .from('newsletter_signups')
      .select(signupSelect)
      .order('created_at', { ascending: false }),
    supabase
      .from('advance_listen_signups')
      .select(signupSelect)
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('id, email, created_at')
      .order('created_at', { ascending: false }),
  ]);

  const bookResult = queryRows(book);
  const newsletterResult = queryRows(newsletter);
  const advanceListenResult = queryRows(advanceListen);
  const accountsResult = queryRows(accounts);

  const firstError =
    (!bookResult.ok && bookResult.error) ||
    (!newsletterResult.ok && newsletterResult.error) ||
    (!advanceListenResult.ok && advanceListenResult.error) ||
    (!accountsResult.ok && accountsResult.error);

  if (firstError) {
    return { ok: false, error: firstError };
  }

  const rows = [
    ...mapSignupRows(bookResult.ok ? bookResult.rows : null, 'book_release', 'book_page'),
    ...mapSignupRows(
      newsletterResult.ok ? newsletterResult.rows : null,
      'newsletter',
      'about_stay_close',
    ),
    ...mergeSignupsByEmail([
      ...mapSignupRows(
        advanceListenResult.ok ? advanceListenResult.rows : null,
        'advance_listen',
        'advance_listen',
      ),
      ...mapSignupRows(
        accountsResult.ok ? accountsResult.rows : null,
        'advance_listen',
        'advance_listen',
      ),
    ]),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { ok: true, rows };
}
