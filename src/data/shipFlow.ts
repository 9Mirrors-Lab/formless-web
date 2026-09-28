/**
 * Solo-scale ship flow for formless-web.
 * Source for /brand/workflow: lanes, real commit examples, labels, milestones.
 */

export type ShipLaneId = 'everyday' | 'tracked' | 'branch';

export type ShipLane = {
  id: ShipLaneId;
  number: 1 | 2 | 3;
  title: string;
  short: string;
  when: string;
  steps: string[];
  example: {
    sha: string;
    message: string;
  };
};

export type ShipLabel = {
  name: string;
  kind: 'surface' | 'kind';
  meaning: string;
  color: string;
};

export type ShipMilestone = {
  title: string;
  meaning: string;
};

export type ShipRelease = {
  tag: string;
  title: string;
  sha: string;
  when: string;
  status: 'published' | 'next';
  note: string;
};

export type ShipCheatCommand = {
  lane: ShipLaneId | 'release';
  label: string;
  command: string;
};

export const SHIP_LANES: readonly ShipLane[] = [
  {
    id: 'everyday',
    number: 1,
    title: 'Everyday',
    short: 'Commit on main, push',
    when: 'Copy tweaks, type fixes, small section refinements. One story, low revert risk.',
    steps: [
      'Make the change',
      'Commit on main with a plain-language message',
      'Push; Vercel deploys production',
    ],
    example: {
      sha: '03e636f',
      message: 'Use sans type for the /qa section index.',
    },
  },
  {
    id: 'tracked',
    number: 2,
    title: 'Tracked',
    short: 'Issue first, then ship',
    when: 'Anything you still care about next week. Park the idea so it survives between sessions.',
    steps: [
      'Open a one-line issue (idea or bug template)',
      'Do the work on main (or a branch if it turns risky)',
      'Close it from the commit: Closes #12',
    ],
    example: {
      sha: '0c11419',
      message: 'Add Engagement desk with Signups and Inquiries tabs.',
    },
  },
  {
    id: 'branch',
    number: 3,
    title: 'Branch + PR',
    short: 'Isolate, then merge',
    when:
      'Auth, Supabase schema or RLS, redesign of a live page, or work that will pause mid-flight.',
    steps: [
      'Branch from main: type/short-slug',
      'Open a PR with a short summary',
      'Merge when checks are green; Vercel deploys',
    ],
    example: {
      sha: 'pr-1',
      message: 'Add direct Google Drive companion uploads (PR #1).',
    },
  },
] as const;

export const SHIP_DECISION = {
  q1: {
    prompt: 'Risky? Auth, Supabase schema, live page redesign, or spans sessions?',
    yes: 'Lane 3: branch + PR',
    no: 'Ask the next question',
  },
  q2: {
    prompt: 'Will I still care next week?',
    yes: 'Lane 2: open an issue first',
    no: 'Lane 1: commit to main, push',
  },
  release: {
    prompt: 'Milestone or a coherent batch of changes?',
    yes: 'Publish the draft Release with a plain-language name',
    no: 'Leave it as the draft ship notes; keep shipping',
  },
} as const;

export const SHIP_LABELS: readonly ShipLabel[] = [
  { name: 'site', kind: 'surface', meaning: 'Public site pages and nav', color: '#6b8f7a' },
  { name: 'book', kind: 'surface', meaning: 'Book page and purchase lockups', color: '#c4a574' },
  { name: 'audio', kind: 'surface', meaning: 'Audible, masters, listen desks', color: '#8a9bb5' },
  {
    name: 'brand-desk',
    kind: 'surface',
    meaning: 'Internal Brand Studio tools',
    color: '#9fb5aa',
  },
  { name: 'data', kind: 'surface', meaning: 'Supabase, ranks, inquiries', color: '#a78b9a' },
  { name: 'idea', kind: 'kind', meaning: 'Something to build later', color: '#7d9a6a' },
  { name: 'bug', kind: 'kind', meaning: 'Something broken', color: '#c45c5c' },
  { name: 'copy', kind: 'kind', meaning: 'Words and messaging', color: '#b5a06a' },
  { name: 'design', kind: 'kind', meaning: 'Layout, type, visual polish', color: '#7a8fc4' },
  { name: 'blocker', kind: 'kind', meaning: 'Stops a launch or ship', color: '#c47a3a' },
] as const;

export const SHIP_MILESTONES: readonly ShipMilestone[] = [
  {
    title: 'Book launch runway',
    meaning: 'Print, Kindle, Audible, launch comms',
  },
  {
    title: 'Audible',
    meaning: 'Masters, re-records, ACX package',
  },
  {
    title: 'Brand desks',
    meaning: 'Engagement, Designs, Schedule, ship flow',
  },
  {
    title: 'Site polish',
    meaning: 'Public pages and small fixes',
  },
] as const;

export const SHIP_RELEASES: readonly ShipRelease[] = [
  {
    tag: '2026.08-kindle-ranks',
    title: 'Kindle ranks in Supabase',
    sha: '0e02cab',
    when: '2026-08',
    status: 'published',
    note: 'Store Kindle ranks and load them on the brand card.',
  },
  {
    tag: '2026.09-continuity-v2',
    title: 'Continuity handoff pages',
    sha: '8c2a6e4',
    when: '2026-09',
    status: 'published',
    note: 'Add Continuity handoff pages for Eyes Closed.',
  },
  {
    tag: '2026.09-print-live',
    title: 'Print book live',
    sha: '9fcbeee',
    when: '2026-09',
    status: 'published',
    note: 'Amazon Books links on home and book pages.',
  },
  {
    tag: '2026.09-sonika-inquiries',
    title: 'Inquire with Sonika',
    sha: '1090d3c',
    when: '2026-09',
    status: 'published',
    note: 'Move Inquire with Sonika to /inquire and clean up the tray.',
  },
  {
    tag: 'next',
    title: 'Next milestone',
    sha: '',
    when: 'Open',
    status: 'next',
    note: 'Publish the draft ship notes when a coherent batch lands.',
  },
] as const;

export const SHIP_CHEAT_SHEET: readonly ShipCheatCommand[] = [
  {
    lane: 'everyday',
    label: 'Push everyday work',
    command: 'git add -A && git commit -m "Your plain message." && git push origin HEAD',
  },
  {
    lane: 'tracked',
    label: 'Open a tracked idea',
    command: 'gh issue create --title "Add something" --label "idea,brand-desk"',
  },
  {
    lane: 'tracked',
    label: 'Close an issue from the commit',
    command: 'git commit -m "Add the thing. Closes #12"',
  },
  {
    lane: 'branch',
    label: 'Start a branch + PR',
    command:
      'git checkout -b feat/short-slug origin/main && git push -u origin HEAD && gh pr create',
  },
  {
    lane: 'release',
    label: 'Publish the draft ship notes',
    command:
      'gh release edit draft-ship-notes --draft=false --tag 2026.09-slug --title "Plain title"',
  },
] as const;

export const DRAFT_RELEASE_TAG = 'draft-ship-notes';
export const DRAFT_RELEASE_TITLE = 'Draft ship notes';

export const GITHUB_REPO_URL = 'https://github.com/9Mirrors-Lab/formless-web';
export const GITHUB_RELEASES_URL = `${GITHUB_REPO_URL}/releases`;
export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;
