import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  filterSignups,
  isExcludedSignupEmail,
  mergeSignupsByEmail,
  signupDeskHref,
  signupDeskListFromSearch,
  signupListLabel,
  signupListMeaning,
  signupListPath,
  signupMetricHelp,
  signupsToCsv,
  summarizeSignups,
  type SiteSignup,
} from '@/lib/siteSignups';

const rows: SiteSignup[] = [
  {
    id: 'book_release:1',
    email: 'ada@house.com',
    firstName: 'Ada',
    lastName: 'House',
    source: 'book_page',
    list: 'book_release',
    createdAt: '2026-08-14T12:00:00.000Z',
  },
  {
    id: 'newsletter:2',
    email: 'ada@house.com',
    firstName: 'Ada',
    lastName: 'House',
    source: 'about_stay_close',
    list: 'newsletter',
    createdAt: '2026-08-13T12:00:00.000Z',
  },
  {
    id: 'account:3',
    email: 'new@house.com',
    firstName: null,
    lastName: null,
    source: 'account',
    list: 'account',
    createdAt: '2026-08-12T12:00:00.000Z',
  },
];

describe('siteSignups', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('labels each list', () => {
    expect(signupListLabel('book_release')).toBe('Book waitlist');
    expect(signupListLabel('newsletter')).toBe('Newsletter');
    expect(signupListLabel('advance_listen')).toBe('Advance listen');
    expect(signupListLabel('account')).toBe('Account');
    expect(signupListPath('book_release')).toBe('/book');
  });

  it('opens a signup desk tab from a brand metric', () => {
    expect(signupDeskHref()).toBe('/brand/signups');
    expect(signupDeskHref('all')).toBe('/brand/signups');
    expect(signupDeskHref('newsletter')).toBe('/brand/signups?list=newsletter');
    expect(signupDeskListFromSearch('?list=advance_listen')).toBe('advance_listen');
    expect(signupDeskListFromSearch('?list=account')).toBe('all');
  });

  it('names what each list is asking for', () => {
    expect(signupListMeaning('book_release')).toBe('Tell me when the book is out.');
    expect(signupListMeaning('newsletter')).toBe('Keep me on the about-page list.');
    expect(signupListMeaning('advance_listen')).toBe('I signed in to hear audio.');
    expect(signupListMeaning('account')).toMatch(/advance listen/i);
  });

  it('explains each count tile', () => {
    expect(signupMetricHelp('people')).toMatch(/unique email/i);
    expect(signupMetricHelp('entries')).toMatch(/twice/i);
    expect(signupMetricHelp('book_release')).toMatch(/book/i);
    expect(signupMetricHelp('newsletter')).toMatch(/stay close/i);
    expect(signupMetricHelp('advance_listen')).toMatch(/listen/i);
    expect(signupMetricHelp('account')).toMatch(/advance listen/i);
  });

  it('counts unique people and overlap across lists', () => {
    expect(summarizeSignups(rows)).toEqual({
      total: 3,
      uniqueEmails: 2,
      overlapCount: 1,
      byList: {
        book_release: 1,
        newsletter: 1,
        advance_listen: 0,
        account: 1,
      },
    });
  });

  it('filters by list and search', () => {
    expect(filterSignups(rows, { list: 'newsletter', query: '' })).toEqual([
      rows[1],
    ]);
    expect(filterSignups(rows, { list: 'all', query: 'NEW@' })).toEqual([
      rows[2],
    ]);
    expect(filterSignups(rows, { list: 'all', query: 'waitlist' })).toEqual([
      rows[0],
    ]);
  });

  it('exports a csv of the visible rows', () => {
    const csv = signupsToCsv(rows.slice(0, 1));
    expect(csv).toBe(
      [
        'email,first_name,last_name,list,source,page,created_at',
        'ada@house.com,Ada,House,Book waitlist,book_page,/book,2026-08-14T12:00:00.000Z',
      ].join('\n'),
    );
  });

  it('loads all four signup sources', async () => {
    const from = vi.fn((table: string) => {
      const data =
        table === 'book_release_signups'
          ? [
              {
                id: '1',
                email: 'Ada@House.com',
                first_name: 'Ada',
                last_name: 'House',
                source: 'book_page',
                created_at: '2026-08-14T12:00:00.000Z',
              },
            ]
          : table === 'profiles'
            ? [
                {
                  id: '3',
                  email: 'new@house.com',
                  created_at: '2026-08-12T12:00:00.000Z',
                },
              ]
            : [];

      return {
        select: () => ({
          order: async () => ({ data, error: null }),
        }),
      };
    });

    vi.doMock('@/lib/supabase', () => ({
      hasSupabaseEnv: () => true,
      getBrowserSupabaseClient: () => ({ from }),
    }));

    const { fetchSiteSignups } = await import('@/lib/siteSignups');
    const result = await fetchSiteSignups();

    expect(result).toEqual({
      ok: true,
      rows: [
        {
          id: 'book_release:1',
          email: 'ada@house.com',
          firstName: 'Ada',
          lastName: 'House',
          source: 'book_page',
          list: 'book_release',
          createdAt: '2026-08-14T12:00:00.000Z',
        },
        {
          id: 'advance_listen:3',
          email: 'new@house.com',
          firstName: null,
          lastName: null,
          source: 'advance_listen',
          list: 'advance_listen',
          createdAt: '2026-08-12T12:00:00.000Z',
        },
      ],
    });
    expect(from).toHaveBeenCalledWith('book_release_signups');
    expect(from).toHaveBeenCalledWith('newsletter_signups');
    expect(from).toHaveBeenCalledWith('advance_listen_signups');
    expect(from).toHaveBeenCalledWith('profiles');
  });

  it('skips a missing signup table instead of failing the whole list', async () => {
    const from = vi.fn((table: string) => {
      if (table === 'advance_listen_signups') {
        return {
          select: () => ({
            order: async () => ({
              data: null,
              error: {
                message: "Could not find the table 'public.advance_listen_signups' in the schema cache",
              },
            }),
          }),
        };
      }

      return {
        select: () => ({
          order: async () => ({ data: [], error: null }),
        }),
      };
    });

    vi.doMock('@/lib/supabase', () => ({
      hasSupabaseEnv: () => true,
      getBrowserSupabaseClient: () => ({ from }),
    }));

    const { fetchSiteSignups } = await import('@/lib/siteSignups');
    const result = await fetchSiteSignups();

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.rows).toEqual([]);
  });

  it('drops internal and test emails from every list', () => {
    expect(isExcludedSignupEmail('riles4@gmail.com')).toBe(true);
    expect(isExcludedSignupEmail('RilesTrade@house.com')).toBe(true);
    expect(isExcludedSignupEmail('riles@example.com')).toBe(true);
    expect(isExcludedSignupEmail('soni@house.com')).toBe(true);
    expect(isExcludedSignupEmail('sonikacottman@gmial.com')).toBe(true);
    expect(isExcludedSignupEmail('testing@gmail.com')).toBe(true);
    expect(isExcludedSignupEmail('publisher.preview@example.com')).toBe(true);
    expect(isExcludedSignupEmail('advance-listen-verify@example.com')).toBe(true);
    expect(isExcludedSignupEmail('qa@Example.ORG')).toBe(true);
    expect(isExcludedSignupEmail('ada@house.com')).toBe(false);
    expect(isExcludedSignupEmail('rimproving@gmail.com')).toBe(false);
  });

  it('omits excluded emails when loading signup sources', async () => {
    const from = vi.fn((table: string) => {
      const data =
        table === 'book_release_signups'
          ? [
              {
                id: 'keep',
                email: 'ada@house.com',
                source: 'book_page',
                created_at: '2026-08-14T12:00:00.000Z',
              },
              {
                id: 'drop',
                email: 'riles4@gmail.com',
                source: 'book_page',
                created_at: '2026-08-14T11:00:00.000Z',
              },
            ]
          : table === 'newsletter_signups'
            ? [
                {
                  id: 'soni',
                  email: 'sonikacottman@gmail.com',
                  source: 'about_stay_close',
                  created_at: '2026-08-13T12:00:00.000Z',
                },
              ]
            : table === 'advance_listen_signups'
              ? [
                  {
                    id: 'preview',
                    email: 'publisher.preview@example.com',
                    source: 'advance_listen',
                    created_at: '2026-08-14T08:37:00.000Z',
                  },
                  {
                    id: 'verify',
                    email: 'advance-listen-verify@example.com',
                    source: 'advance_listen',
                    created_at: '2026-08-14T08:35:00.000Z',
                  },
                ]
            : table === 'profiles'
              ? [
                  {
                    id: 'test',
                    email: 'testing@gmail.com',
                    created_at: '2026-08-12T12:00:00.000Z',
                  },
                ]
              : [];

      return {
        select: () => ({
          order: async () => ({ data, error: null }),
        }),
      };
    });

    vi.doMock('@/lib/supabase', () => ({
      hasSupabaseEnv: () => true,
      getBrowserSupabaseClient: () => ({ from }),
    }));

    const { fetchSiteSignups } = await import('@/lib/siteSignups');
    const result = await fetchSiteSignups();

    expect(result).toEqual({
      ok: true,
      rows: [
        {
          id: 'book_release:keep',
          email: 'ada@house.com',
          firstName: null,
          lastName: null,
          source: 'book_page',
          list: 'book_release',
          createdAt: '2026-08-14T12:00:00.000Z',
        },
      ],
    });
  });

  it('keeps one advance-listen row per email', () => {
    expect(
      mergeSignupsByEmail([
        {
          id: 'advance_listen:table',
          email: 'ada@house.com',
          firstName: null,
          lastName: null,
          source: 'advance_listen',
          list: 'advance_listen',
          createdAt: '2026-08-14T12:00:00.000Z',
        },
        {
          id: 'advance_listen:profile',
          email: 'ada@house.com',
          firstName: null,
          lastName: null,
          source: 'advance_listen',
          list: 'advance_listen',
          createdAt: '2026-08-01T12:00:00.000Z',
        },
      ]),
    ).toEqual([
      {
        id: 'advance_listen:profile',
        email: 'ada@house.com',
        firstName: null,
        lastName: null,
        source: 'advance_listen',
        list: 'advance_listen',
        createdAt: '2026-08-01T12:00:00.000Z',
      },
    ]);
  });
});
