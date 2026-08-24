/** Formless launch campaign. Dated runway before Sep 1, launch day, and teaching after. */

import { LAUNCH_PIECES } from './bookLaunchPieces';

export { LAUNCH_PIECES } from './bookLaunchPieces';
export {
  LAUNCH_ADS,
  LAUNCH_CALENDAR,
  LAUNCH_LANDING,
  LAUNCH_SCRIPTS,
} from './bookLaunchAssets';

export type LaunchChannelId =
  | 'warm'
  | 'waitlist'
  | 'stay-close'
  | 'advance'
  | 'linkedin'
  | 'x';

export type LaunchPieceKind = 'email' | 'post';

export type LaunchRunwayId = 'before' | 'launch' | 'after';

export type LaunchPhaseId =
  | 'quiet'
  | 'approach'
  | 'eve'
  | 'launch-day'
  | 'settle'
  | 'week-2'
  | 'month-1'
  | 'month-2'
  | 'month-3';

export type LaunchView =
  | 'all'
  | LaunchChannelId
  | 'landing'
  | 'calendar'
  | 'intake';

export type LaunchPiece = {
  id: string;
  channel: LaunchChannelId;
  kind: LaunchPieceKind;
  number: number;
  title: string;
  send: string;
  phase: LaunchPhaseId;
  purpose: string;
  subjects: string[];
  preview?: string;
  body: string;
};

export type LaunchChannel = {
  id: LaunchChannelId;
  title: string;
  shortTitle: string;
  audience: string;
  tone: string;
  cadence: string[];
  rule: string;
  pieceKind: LaunchPieceKind;
};

export type LaunchPhase = {
  id: LaunchPhaseId;
  label: string;
  dates: string;
  runway: LaunchRunwayId;
};

export type LaunchRunway = {
  id: LaunchRunwayId;
  label: string;
  job: string;
};

export type LaunchIntakeSection = {
  id: string;
  channel: 'both' | 'warm' | 'lists';
  title: string;
  questions: string[];
  placeholders?: string[];
  note?: string;
};

export type LaunchDeskFilters = {
  campaign: LaunchView;
  piece: string | null;
};

export const LAUNCH_DESK_PATH = '/brand/book-launch-campaign';

export const LAUNCH_POSITIONING = {
  book: 'Formless',
  subtitle: 'Who you truly are beyond the mind. A journey within.',
  author: 'Sonika Cottman',
  imprint: 'Eyes Closed',
  launchDate: 'Tuesday, September 1, 2026',
  launchWeek: 'September 1-7, 2026',
  formats: 'Kindle, print, and Audible',
  site: 'https://www.eyesclosed.love/book',
  coreBenefit:
    'You can be at peace regardless of outer circumstances, because you are not the mind that suffers them.',
  formula:
    "Formless helps people who have had enough of stress, pain, anger, and not-enough stop living from the mind's stories by recognizing they are the awareness watching those stories.",
  angle:
    'The world keeps handing you a new outer fix. The exhaustion is the signal. The book is a doorway back to the one who is already here.',
  tone: 'Calm, direct, spacious. Personal with the people closest to Soni. Quiet with everyone else.',
} as const;

export const LAUNCH_CHANNEL_IDS = [
  'warm',
  'waitlist',
  'stay-close',
  'advance',
  'linkedin',
  'x',
] as const satisfies readonly LaunchChannelId[];

export const LAUNCH_VIEWS = [
  'all',
  'warm',
  'waitlist',
  'stay-close',
  'advance',
  'linkedin',
  'x',
  'landing',
  'calendar',
  'intake',
] as const satisfies readonly LaunchView[];

export const LAUNCH_RUNWAYS: readonly LaunchRunway[] = [
  {
    id: 'before',
    label: 'Before launch',
    job: 'Recognition and ready words. No countdown. No launch-team homework.',
  },
  {
    id: 'launch',
    label: 'Launch day',
    job: 'Flip the site. One letter. One post. Personal notes to the closest people.',
  },
  {
    id: 'after',
    label: 'After launch',
    job: 'Thanks, then teaching. The book is the doorway. The relationship is the work.',
  },
];

export const LAUNCH_PHASES: readonly LaunchPhase[] = [
  {
    id: 'quiet',
    label: 'Quiet open',
    dates: 'Sat Aug 22 - Thu Aug 27',
    runway: 'before',
  },
  {
    id: 'approach',
    label: 'Approach',
    dates: 'Fri Aug 28 - Sun Aug 30',
    runway: 'before',
  },
  {
    id: 'eve',
    label: 'Day before',
    dates: 'Mon Aug 31',
    runway: 'before',
  },
  {
    id: 'launch-day',
    label: 'Launch day',
    dates: 'Tue Sep 1',
    runway: 'launch',
  },
  {
    id: 'settle',
    label: 'Settle',
    dates: 'Wed Sep 2 - Sun Sep 7',
    runway: 'after',
  },
  {
    id: 'week-2',
    label: 'First teaching week',
    dates: 'Mon Sep 8 - Sun Sep 14',
    runway: 'after',
  },
  {
    id: 'month-1',
    label: 'Late September',
    dates: 'Sep 15 - Sep 30',
    runway: 'after',
  },
  {
    id: 'month-2',
    label: 'October',
    dates: 'October 2026',
    runway: 'after',
  },
  {
    id: 'month-3',
    label: 'November',
    dates: 'November 2026',
    runway: 'after',
  },
];

export const LAUNCH_CHANNELS: Record<LaunchChannelId, LaunchChannel> = {
  warm: {
    id: 'warm',
    title: 'Warm circle',
    shortTitle: 'Warm',
    audience:
      'Fifteen to forty people who know Soni: family, close friends, colleagues, former teammates, people who have been part of the writing.',
    tone: 'Personal, sincere, one story at a time. From Soni, not from a sequence.',
    cadence: [
      'One note this weekend',
      'One why mid-week',
      'Kit only to people who already offered to help',
      'Launch morning, then thanks',
    ],
    rule: 'A human note. One why. One date. One optional ask. Never "join my launch team."',
    pieceKind: 'email',
  },
  waitlist: {
    id: 'waitlist',
    title: 'Book waitlist',
    shortTitle: 'Waitlist',
    audience:
      'People who wanted to hear when the book is out. The notify form on /book. They opted in for one clear letter, not a relationship sequence.',
    tone: 'Direct, unhurried, one letter at a time.',
    cadence: [
      'One almost-here letter',
      'One available letter on September 1',
      'Thanks, then an optional review note to people who met the book',
      'One teaching letter after launch week',
    ],
    rule: 'They wanted to hear. Tell them once. Do not manufacture a week of reminders.',
    pieceKind: 'email',
  },
  'stay-close': {
    id: 'stay-close',
    title: 'Stay Close',
    shortTitle: 'Stay Close',
    audience:
      'People who joined Stay Close from the about page. An ongoing relationship, not a launch list.',
    tone: 'Quieter than the waitlist. Same facts. Less announcement.',
    cadence: [
      'A quieter almost-here note',
      'The same available letter, softened',
      'Thanks, then teaching',
    ],
    rule: 'Stay Close stays a relationship. Mixing it with the waitlist makes both feel like marketing.',
    pieceKind: 'email',
  },
  advance: {
    id: 'advance',
    title: 'Advance listen',
    shortTitle: 'Advance',
    audience:
      'People who already crossed the audio gate. Early companions, not a second list to squeeze.',
    tone: 'Companion-to-companion. They already heard the work.',
    cadence: [
      'No extra sequence before the day',
      'A note that the audiobook is public',
      'Invite into the teaching after',
    ],
    rule: 'They already crossed a threshold. No countdown. No extra ask.',
    pieceKind: 'email',
  },
  linkedin: {
    id: 'linkedin',
    title: 'LinkedIn',
    shortTitle: 'LinkedIn',
    audience:
      "Soni's personal profile. People who know the HR and tech work, and people who will meet the teaching for the first time.",
    tone: 'Reflective and story-driven. Lived, not promotional.',
    cadence: [
      'One story before launch',
      'Who it is for, then the day',
      'After the week: teaching, not recap',
    ],
    rule: 'Story first. Put the buy link in the first comment, not the post body.',
    pieceKind: 'post',
  },
  x: {
    id: 'x',
    title: 'X',
    shortTitle: 'X',
    audience:
      'A quieter public room. People who find a single recognition line and follow it inward.',
    tone: 'Compressed. One claim. No thread until the teaching weeks.',
    cadence: [
      'Two short notes before the day',
      'One on September 1',
      'Then excerpts, not availability',
    ],
    rule: 'Open with the insight. Do not open with the book title.',
    pieceKind: 'post',
  },
};

export const LAUNCH_INTAKE: readonly LaunchIntakeSection[] = [
  {
    id: 'ops-lists',
    channel: 'both',
    title: 'Who hears from which list',
    questions: [
      'Is the warm circle a named list of 15-40 people, not a BCC blast?',
      'Can book waitlist, Stay Close, and advance listen each receive their own send?',
      'Who sends, from which address, and with which tool?',
    ],
    note: 'Copy without a send path is not communication. This is the only ops gate that can silently kill launch day.',
  },
  {
    id: 'ops-links',
    channel: 'both',
    title: 'Live links',
    questions: [
      'What is the Kindle URL?',
      'What is the Audible URL?',
      'What is the Amazon review URL once the listing is live?',
      'Is print available on day one, or Kindle and Audible only?',
    ],
    placeholders: ['[Kindle Link]', '[Audible Link]', '[Amazon Review Link]'],
  },
  {
    id: 'ops-site',
    channel: 'both',
    title: 'Site flip',
    questions: [
      'Who flips /book from waitlist to buy/listen on the morning of September 1?',
      'Does the homepage doorway stay a sanctuary, or does it grow a storefront row?',
    ],
    note: 'Launch day is a state change on the site, not a campaign blast.',
  },
  {
    id: 'warm-names',
    channel: 'warm',
    title: 'The warm circle',
    questions: [
      'Who is actually on the list?',
      'Who already has the ARC, if anyone?',
      'Who already offered to share, so they receive the kit instead of a homework assignment?',
    ],
    note: 'If someone has to be convinced to help, they are not on this list.',
  },
  {
    id: 'review-posture',
    channel: 'both',
    title: 'Reviews',
    questions: [
      'Are we willing to ask only people who have actually read or listened?',
      'Is the language staying: reviews are optional and should be honest?',
    ],
    note: 'Never pay or perk for a review. Two or three sentences is enough.',
  },
];

export const LAUNCH_QUICK_QUESTIONS: readonly string[] = [
  'Who is in the warm circle of 15-40 names?',
  'Which tool sends book waitlist, Stay Close, and advance listen as three separate letters on September 1?',
  'What are the Kindle, Audible, and review URLs?',
  'Who flips /book that morning?',
  'Who already offered to share, and should receive the kit?',
];

export const LAUNCH_CHANNEL_LABEL: Record<LaunchChannelId, string> = {
  warm: 'Warm circle',
  waitlist: 'Book waitlist',
  'stay-close': 'Stay Close',
  advance: 'Advance listen',
  linkedin: 'LinkedIn',
  x: 'X',
};

export const LAUNCH_VIEW_LABEL: Record<LaunchView, string> = {
  all: 'All campaigns',
  warm: 'Warm circle',
  waitlist: 'Book waitlist',
  'stay-close': 'Stay Close',
  advance: 'Advance listen',
  linkedin: 'LinkedIn',
  x: 'X',
  landing: 'Book page',
  calendar: 'Calendar',
  intake: 'Ops remaining',
};

export const LAUNCH_RUNWAY_LABEL: Record<LaunchRunwayId, string> = {
  before: 'Before launch',
  launch: 'Launch day',
  after: 'After launch',
};

function isLaunchView(value: string | null): value is LaunchView {
  return LAUNCH_VIEWS.some((view) => view === value);
}

function campaignFromSearch(value: string | null): LaunchView {
  if (value === 'professional' || value === 'list') return 'waitlist';
  return isLaunchView(value) ? value : 'all';
}

export function runwayForPhase(phase: LaunchPhaseId): LaunchRunwayId {
  const found = LAUNCH_PHASES.find((item) => item.id === phase);
  return found?.runway ?? 'before';
}

export function findLaunchPiece(
  id: string | null | undefined,
  pieces: readonly LaunchPiece[] = LAUNCH_PIECES,
): LaunchPiece | null {
  if (!id) return null;
  return pieces.find((piece) => piece.id === id) ?? null;
}

export function piecesForChannel(
  channel: LaunchChannelId,
  pieces: readonly LaunchPiece[] = LAUNCH_PIECES,
): LaunchPiece[] {
  return pieces.filter((piece) => piece.channel === channel);
}

export function piecesForPhase(
  phase: LaunchPhaseId,
  pieces: readonly LaunchPiece[] = LAUNCH_PIECES,
): LaunchPiece[] {
  return pieces.filter((piece) => piece.phase === phase);
}

export function piecesForRunway(
  runway: LaunchRunwayId,
  pieces: readonly LaunchPiece[] = LAUNCH_PIECES,
): LaunchPiece[] {
  return pieces.filter((piece) => runwayForPhase(piece.phase) === runway);
}

export function piecesForView(
  view: LaunchView,
  pieces: readonly LaunchPiece[] = LAUNCH_PIECES,
): LaunchPiece[] {
  switch (view) {
    case 'all':
    case 'intake':
    case 'landing':
    case 'calendar':
      return [...pieces];
    case 'warm':
    case 'waitlist':
    case 'stay-close':
    case 'advance':
    case 'linkedin':
    case 'x':
      return piecesForChannel(view, pieces);
    default: {
      const _never: never = view;
      return _never;
    }
  }
}

export function phasesUsedBy(
  pieces: readonly LaunchPiece[],
): LaunchPhase[] {
  const used = new Set(pieces.map((piece) => piece.phase));
  return LAUNCH_PHASES.filter((phase) => used.has(phase.id));
}

export function phasesForRunway(runway: LaunchRunwayId): LaunchPhase[] {
  return LAUNCH_PHASES.filter((phase) => phase.runway === runway);
}

export function summarizeLaunchCampaign(
  pieces: readonly LaunchPiece[] = LAUNCH_PIECES,
): {
  total: number;
  emails: number;
  posts: number;
  byChannel: Record<LaunchChannelId, number>;
  byRunway: Record<LaunchRunwayId, number>;
} {
  const byChannel: Record<LaunchChannelId, number> = {
    warm: 0,
    waitlist: 0,
    'stay-close': 0,
    advance: 0,
    linkedin: 0,
    x: 0,
  };
  const byRunway: Record<LaunchRunwayId, number> = {
    before: 0,
    launch: 0,
    after: 0,
  };
  let emails = 0;
  let posts = 0;

  for (const piece of pieces) {
    byChannel[piece.channel] += 1;
    byRunway[runwayForPhase(piece.phase)] += 1;
    if (piece.kind === 'email') emails += 1;
    else posts += 1;
  }

  return {
    total: pieces.length,
    emails,
    posts,
    byChannel,
    byRunway,
  };
}

export function pieceKindLabel(kind: LaunchPieceKind): string {
  switch (kind) {
    case 'email':
      return 'Email';
    case 'post':
      return 'Post';
    default: {
      const _never: never = kind;
      return _never;
    }
  }
}

export function pieceShortLabel(piece: LaunchPiece): string {
  const kind = pieceKindLabel(piece.kind);
  return `${kind} ${piece.number}`;
}

export function formatLaunchSubjects(piece: LaunchPiece): string {
  if (piece.subjects.length === 0) return '';
  return piece.subjects
    .map((subject, index) => `${index + 1}. ${subject}`)
    .join('\n');
}

export function formatLaunchPieceCopy(
  piece: LaunchPiece,
  subjectIndex = 0,
): string {
  if (piece.kind === 'post') return piece.body;

  const subject =
    piece.subjects[subjectIndex] ?? piece.subjects[0] ?? piece.title;
  return `Subject: ${subject}\n\n${piece.body}`;
}

export function launchDeskHref(filters: Partial<LaunchDeskFilters> = {}): string {
  const params = new URLSearchParams();
  if (filters.campaign && filters.campaign !== 'all') {
    params.set('campaign', filters.campaign);
  }
  if (filters.piece) params.set('piece', filters.piece);
  const query = params.toString();
  return query ? `${LAUNCH_DESK_PATH}?${query}` : LAUNCH_DESK_PATH;
}

export function launchFiltersFromSearch(search: string): LaunchDeskFilters {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const campaignRaw = params.get('campaign');
  const campaign = campaignFromSearch(campaignRaw);
  const pieceRaw = params.get('piece');
  const piece = findLaunchPiece(pieceRaw);
  return {
    campaign,
    piece: piece?.id ?? null,
  };
}
