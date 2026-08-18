import { type SignupSummary, type SiteSignup } from '@/lib/siteSignups';
import type { StudioRungId } from '@/data/studioLadder';

export type PulseLoad = 'loading' | 'ready' | 'error';

export type BrandPulse = {
  headline: string;
  detail: string;
  href: string;
};

export type AudibleProgress = {
  total: number;
  towardAudible: number;
  counts: Record<StudioRungId, number>;
};

const SIGNUP_HREF = '/brand/signups';
const AUDIBLE_HREF = '/audio/editorial2';

export const AUDIENCE_CHART_WEEKS = 12;

export const AUDIENCE_CHARTS = [
  { list: 'book_release', label: 'Book waitlist', color: '#9fb5aa' },
  { list: 'newsletter', label: 'Stay Close', color: '#f2f0e9' },
  { list: 'advance_listen', label: 'Advance listen', color: '#cc5833' },
] as const;

export type AudienceChartList = (typeof AUDIENCE_CHARTS)[number]['list'];

export type SignupWeekPoint = {
  weekIndex: number;
  book_release: number;
  newsletter: number;
  advance_listen: number;
};

export function formatPulseWhen(iso: string, now = new Date()): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return '';

  const startToday = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const startThen = Date.UTC(then.getFullYear(), then.getMonth(), then.getDate());
  const days = Math.round((startToday - startThen) / 86_400_000);

  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days > 1 && days < 7) return `${days} days ago`;

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(then);
}

function peoplePhrase(count: number): string {
  if (count === 1) return '1 person has signed up.';
  return `${count} people have signed up.`;
}

export function signupPulse(
  state: PulseLoad,
  summary: SignupSummary,
  latest: SiteSignup | null,
  now = new Date(),
): BrandPulse {
  if (state === 'loading') {
    return {
      headline: 'People on the lists.',
      detail: 'Loading the lists.',
      href: SIGNUP_HREF,
    };
  }

  if (state === 'error') {
    return {
      headline: 'People on the lists.',
      detail: 'Could not load signups.',
      href: SIGNUP_HREF,
    };
  }

  if (summary.uniqueEmails === 0) {
    return {
      headline: 'No one has signed up yet.',
      detail: 'Book waitlist, Stay Close, and advance listen will land here.',
      href: SIGNUP_HREF,
    };
  }

  const arrived = latest ? formatPulseWhen(latest.createdAt, now) : '';

  return {
    headline: peoplePhrase(summary.uniqueEmails),
    detail: arrived ? `Last arrived ${arrived}.` : '',
    href: SIGNUP_HREF,
  };
}

export function signupHistoryBuckets(
  rows: SiteSignup[],
  bucketCount = AUDIENCE_CHART_WEEKS,
  now = new Date(),
): SignupWeekPoint[] {
  const points: SignupWeekPoint[] = Array.from({ length: bucketCount }, (_, weekIndex) => ({
    weekIndex,
    book_release: 0,
    newsletter: 0,
    advance_listen: 0,
  }));

  const dated: Array<{ list: AudienceChartList; time: number }> = [];
  for (const row of rows) {
    if (row.list === 'account') continue;
    const time = new Date(row.createdAt).getTime();
    if (Number.isNaN(time)) continue;
    dated.push({ list: row.list, time });
  }

  if (dated.length === 0) return points;

  const min = Math.min(...dated.map((item) => item.time));
  const max = Math.max(now.getTime(), ...dated.map((item) => item.time));
  const span = Math.max(max - min, 1);

  for (const item of dated) {
    const index = Math.min(
      bucketCount - 1,
      Math.max(0, Math.floor(((item.time - min) / span) * bucketCount)),
    );
    points[index][item.list] += 1;
  }

  return points;
}

export function signupWeekSeries(
  points: SignupWeekPoint[],
  list: AudienceChartList,
): number[] {
  return points.map((point) => point[list]);
}

export function audiblePulse(
  progress: AudibleProgress,
  rerecordCount: number,
): BrandPulse {
  const { total, towardAudible, counts } = progress;
  const stillNeedTake = counts['not-recorded'];
  const waitingSignOff = counts.published;
  const masteredOnly = counts.mastered;

  let headline: string;
  if (counts.approved === total && total > 0) {
    headline = `All ${total} chapters are signed off for Audible.`;
  } else if (towardAudible === 0) {
    headline = `None of the ${total} chapters have a master yet.`;
  } else if (towardAudible === total) {
    headline = `All ${total} chapters have a master.`;
  } else {
    headline = `${towardAudible} of ${total} chapters have a master.`;
  }

  const parts: string[] = [];
  if (stillNeedTake > 0) {
    parts.push(
      stillNeedTake === 1
        ? '1 still needs a take'
        : `${stillNeedTake} still need a take`,
    );
  }
  if (masteredOnly > 0) {
    parts.push(
      masteredOnly === 1
        ? '1 master is local, not published'
        : `${masteredOnly} masters are local, not published`,
    );
  }
  if (waitingSignOff > 0 && counts.approved !== total) {
    parts.push(
      waitingSignOff === 1
        ? '1 published chapter still needs sign-off'
        : `${waitingSignOff} published chapters still need sign-off`,
    );
  }
  if (rerecordCount > 0) {
    parts.push(
      rerecordCount === 1
        ? '1 re-record script is open'
        : `${rerecordCount} re-record scripts are open`,
    );
  }

  const detail =
    parts.length === 0
      ? 'Open the studio ladder to scan each chapter.'
      : `${parts.join('. ')}.`;

  return {
    headline,
    detail,
    href: AUDIBLE_HREF,
  };
}
