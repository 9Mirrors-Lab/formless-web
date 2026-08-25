import { describe, expect, it } from 'vitest';

import { emptySignupSummary, type SiteSignup } from '@/lib/siteSignups';
import {
  audiblePulse,
  formatPulseWhen,
  signupHistoryBuckets,
  signupPulse,
} from '@/lib/brandPulse';
import type { StudioRungId } from '@/data/studioLadder';

const now = new Date(2026, 7, 18, 15, 0, 0);

const latest: SiteSignup = {
  id: 'book_release:1',
  email: 'ada@house.com',
  firstName: 'Ada',
  lastName: 'House',
  source: 'book_page',
  list: 'book_release',
  createdAt: new Date(2026, 7, 17, 9, 0, 0).toISOString(),
};

function counts(overrides: Partial<Record<StudioRungId, number>> = {}) {
  return {
    'not-recorded': 0,
    'session-saved': 0,
    'original-wav': 0,
    mastered: 0,
    published: 0,
    approved: 0,
    ...overrides,
  } satisfies Record<StudioRungId, number>;
}

describe('brandPulse', () => {
  it('names today and yesterday from calendar days', () => {
    expect(formatPulseWhen(new Date(2026, 7, 18, 1, 0, 0).toISOString(), now)).toBe(
      'today',
    );
    expect(formatPulseWhen(new Date(2026, 7, 17, 23, 0, 0).toISOString(), now)).toBe(
      'yesterday',
    );
    expect(formatPulseWhen(new Date(2026, 7, 14, 12, 0, 0).toISOString(), now)).toBe(
      '4 days ago',
    );
  });

  it('leads signup copy with people, then the lists', () => {
    const summary = {
      ...emptySignupSummary(),
      total: 6,
      uniqueEmails: 47,
      byList: {
        book_release: 12,
        newsletter: 8,
        advance_listen: 4,
        account: 0,
      },
    };
    const pulse = signupPulse('ready', summary, latest, now);
    expect(pulse.headline).toBe('47 people have signed up.');
    expect(pulse.detail).toMatch(/last arrived yesterday/i);
    expect(pulse.href).toBe('/brand/signups');
  });

  it('uses singular copy for one person', () => {
    const summary = {
      ...emptySignupSummary(),
      total: 1,
      uniqueEmails: 1,
      byList: {
        ...emptySignupSummary().byList,
        book_release: 1,
      },
    };
    expect(signupPulse('ready', summary, null).headline).toBe(
      '1 person has signed up.',
    );
  });

  it('keeps the signup door when lists are empty or failing', () => {
    expect(signupPulse('loading', emptySignupSummary(), null).detail).toMatch(/loading/i);
    expect(signupPulse('error', emptySignupSummary(), null).detail).toMatch(/could not load/i);
    expect(signupPulse('ready', emptySignupSummary(), null).headline).toMatch(/no one/i);
    expect(signupPulse('ready', emptySignupSummary(), null).detail).toBe('');
  });

  it('leads audible copy with masters toward upload, then what is open', () => {
    const pulse = audiblePulse(
      {
        total: 12,
        towardAudible: 9,
        counts: counts({ 'not-recorded': 3, mastered: 2, published: 7 }),
      },
      1,
    );
    expect(pulse.headline).toBe('9 of 12 chapters have a master.');
    expect(pulse.detail).toMatch(/3 still need a take/);
    expect(pulse.detail).toMatch(/re-record script is open/);
    expect(pulse.href).toBe('/audio/editorial2');
  });

  it('says when every chapter is signed off', () => {
    const pulse = audiblePulse(
      {
        total: 12,
        towardAudible: 12,
        counts: counts({ approved: 12 }),
      },
      0,
    );
    expect(pulse.headline).toBe('All 12 chapters are signed off for Audible.');
  });

  it('bins signup history from first arrival to now', () => {
    const rows: SiteSignup[] = [
      {
        id: 'book_release:1',
        email: 'ada@house.com',
        firstName: null,
        lastName: null,
        source: 'book_page',
        list: 'book_release',
        createdAt: new Date(2026, 5, 1, 12).toISOString(),
      },
      {
        id: 'newsletter:2',
        email: 'ada@house.com',
        firstName: null,
        lastName: null,
        source: 'about_stay_close',
        list: 'newsletter',
        createdAt: new Date(2026, 6, 1, 12).toISOString(),
      },
      {
        id: 'advance_listen:3',
        email: 'new@house.com',
        firstName: null,
        lastName: null,
        source: 'advance_listen',
        list: 'advance_listen',
        createdAt: new Date(2026, 7, 18, 12).toISOString(),
      },
    ];
    const buckets = signupHistoryBuckets(rows, 12, now);
    expect(buckets).toHaveLength(12);
    expect(buckets[0].book_release).toBe(1);
    expect(buckets.some((point) => point.newsletter === 1)).toBe(true);
    expect(buckets[11].advance_listen).toBe(1);
  });
});
