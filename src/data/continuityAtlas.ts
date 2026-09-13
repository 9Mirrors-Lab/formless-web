/**
 * Continuity v2 — the atlas model.
 *
 * Shapes the existing continuity facts (src/data/continuityHome.ts) into a
 * spatial, human-oriented map: territories around Eyes Closed, relationships
 * between them, four ways in, and three depths of information per system.
 *
 * Contains no passwords, API keys, tokens, recovery codes, or secret values.
 */

import {
  CONTINUITY_ASSETS,
  CONTINUITY_CREDENTIALS,
  CONTINUITY_DOMAIN,
  CONTINUITY_FORMLESS,
  CONTINUITY_PEOPLE,
  CONTINUITY_RUNNING,
  CONTINUITY_SOCIAL,
  CONTINUITY_SUPABASE,
  CONTINUITY_VERCEL,
  CONTINUITY_WEBSITE,
  type ContinuityAsset,
  type ContinuityCredential,
  type ContinuityImportance,
  type ContinuityPerson,
  type ContinuityRunningService,
  type ContinuitySocialChannel,
} from '@/data/continuityHome';

export const CONTINUITY_V2_PATH = '/continuityv2';

export const ATLAS_HEADLINE = 'Continuity';

export const ATLAS_LEDE =
  'Everything needed to understand, access, and continue Eyes Closed.';

export const ATLAS_INTRO =
  'I put this together so you have one place to understand Eyes Closed, find everything connected to it, and know what to do next without having to piece it together yourself.';

/* ------------------------------------------------------------------ */
/* Service marks                                                       */
/* ------------------------------------------------------------------ */

export type ServiceMarkId =
  | 'eyes-closed'
  | 'website'
  | 'domain'
  | 'vercel'
  | 'github'
  | 'supabase'
  | 'amazon'
  | 'kindle'
  | 'audible'
  | 'google-drive'
  | 'onepassword'
  | 'zoho'
  | 'instagram'
  | 'linkedin'
  | 'posthog'
  | 'canva'
  | 'email'
  | 'formless'
  | 'assets'
  | 'accounts'
  | 'payments'
  | 'people'
  | 'social'
  | 'publishing';

/* ------------------------------------------------------------------ */
/* Four ways in                                                        */
/* ------------------------------------------------------------------ */

export type ContinuityPathId = 'understand' | 'access' | 'running' | 'help';

export type ContinuityPathDef = {
  id: ContinuityPathId;
  index: string;
  label: string;
  question: string;
  /** Section ids that belong to this path, in reading order. */
  sections: readonly string[];
};

export const CONTINUITY_PATHS: readonly ContinuityPathDef[] = [
  {
    id: 'understand',
    index: '01',
    label: 'Understand',
    question: 'What is Eyes Closed and how does everything fit together?',
    sections: ['atlas', 'begin', 'picture', 'website', 'formless', 'social'],
  },
  {
    id: 'access',
    index: '02',
    label: 'Access',
    question: 'Where are the accounts, files, and ownership controls?',
    sections: ['access', 'assets', 'domain'],
  },
  {
    id: 'running',
    index: '03',
    label: 'Keep It Running',
    question: 'What needs to stay active, paid, renewed, or protected?',
    sections: ['running', 'principles'],
  },
  {
    id: 'help',
    index: '04',
    label: 'Get Help',
    question: 'Who knows what, and who should be contacted?',
    sections: ['help'],
  },
] as const;

export type ContinuitySectionDef = {
  id: string;
  label: string;
  path: ContinuityPathId;
};

export const CONTINUITY_SECTIONS: readonly ContinuitySectionDef[] = [
  { id: 'atlas', label: 'The Continuity Map', path: 'understand' },
  { id: 'begin', label: 'Begin Here', path: 'understand' },
  { id: 'picture', label: 'The Big Picture', path: 'understand' },
  { id: 'website', label: 'The Website', path: 'understand' },
  { id: 'formless', label: 'Formless', path: 'understand' },
  { id: 'social', label: 'Social & Audience', path: 'understand' },
  { id: 'access', label: 'Access & Credentials', path: 'access' },
  { id: 'assets', label: 'Asset Library', path: 'access' },
  { id: 'domain', label: 'The Domain', path: 'access' },
  { id: 'running', label: 'What Keeps Running', path: 'running' },
  { id: 'principles', label: 'Before a Major Change', path: 'running' },
  { id: 'help', label: 'Who Can Help', path: 'help' },
] as const;

/* ------------------------------------------------------------------ */
/* Atlas territories and nodes                                         */
/* ------------------------------------------------------------------ */

export type AtlasTerritoryId = 'experience' | 'powers' | 'belongs' | 'people';

export type AtlasTerritory = {
  id: AtlasTerritoryId;
  label: string;
  blurb: string;
  /** Compass degrees (0 = top, clockwise) for the arc band. */
  startAngle: number;
  endAngle: number;
  tint: string;
};

export const ATLAS_TERRITORIES: readonly AtlasTerritory[] = [
  {
    id: 'experience',
    label: 'The Experience',
    blurb: 'What people actually meet.',
    startAngle: 308,
    endAngle: 52,
    tint: '#f2f0e9',
  },
  {
    id: 'powers',
    label: 'What Powers It',
    blurb: 'The quiet machinery underneath.',
    startAngle: 56,
    endAngle: 150,
    tint: '#9fb5aa',
  },
  {
    id: 'belongs',
    label: 'What Belongs To It',
    blurb: 'The things Eyes Closed owns.',
    startAngle: 156,
    endAngle: 252,
    tint: '#cc5833',
  },
  {
    id: 'people',
    label: 'The People',
    blurb: 'Who carries it forward.',
    startAngle: 256,
    endAngle: 304,
    tint: '#d8cfa8',
  },
] as const;

export type AtlasNodeId =
  | 'website'
  | 'formless'
  | 'social'
  | 'email'
  | 'domain'
  | 'vercel'
  | 'github'
  | 'supabase'
  | 'assets'
  | 'accounts'
  | 'publishing'
  | 'payments'
  | 'help'
  | 'ownership'
  | 'contacts';

export type AtlasDetailRow = { label: string; value: string };

export type AtlasNode = {
  id: AtlasNodeId;
  label: string;
  territory: AtlasTerritoryId;
  mark: ServiceMarkId;
  /** Compass degrees, 0 = top, clockwise. */
  angle: number;
  /** Distance from centre in viewBox units. */
  radius: number;
  /** Level 1 — recognition. One plain sentence. */
  recognition: string;
  /** Why this matters, in one sentence. */
  matters: string;
  /** Level 2 — what a person taking over would actually need. */
  practical: readonly AtlasDetailRow[];
  /** Level 3 — only a developer would need this. */
  technical?: readonly AtlasDetailRow[];
  manage?: { label: string; href: string };
  jumpTo?: string;
  importance: ContinuityImportance;
};

export const ATLAS_NODES: readonly AtlasNode[] = [
  /* ---- The Experience ---- */
  {
    id: 'email',
    label: 'Email',
    territory: 'experience',
    mark: 'email',
    angle: 320,
    radius: 332,
    recognition: 'Carries letters between Eyes Closed and the people who follow it.',
    matters: 'It is how readers hear from Sonika, and how account recovery reaches you.',
    practical: [
      { label: 'Mailbox', value: 'hello@eyesclosed.love' },
      { label: 'Newsletter sending', value: 'Zoho Campaigns' },
      { label: 'Signups also land in', value: 'Supabase' },
      { label: 'Credentials', value: '1Password · Eyes Closed · Email' },
    ],
    jumpTo: 'social',
    importance: 'important',
  },
  {
    id: 'social',
    label: 'Social',
    territory: 'experience',
    mark: 'social',
    angle: 348,
    radius: 246,
    recognition: 'The public channels where the teaching keeps showing up.',
    matters: 'This is where the audience already is; the accounts should stay owned and reachable.',
    practical: [
      { label: 'Primary', value: '@eyesclosed.love on Instagram' },
      { label: 'Author presence', value: 'LinkedIn · sonika-cottman' },
      { label: 'Owner', value: 'Sonika' },
      { label: 'Credentials', value: '1Password · Eyes Closed · per channel' },
    ],
    jumpTo: 'social',
    importance: 'important',
  },
  {
    id: 'website',
    label: 'Website',
    territory: 'experience',
    mark: 'website',
    angle: 16,
    radius: 228,
    recognition: 'The live experience at eyesclosed.love.',
    matters: 'It is the front door: teaching, the book doorway, and the way people stay close.',
    practical: [
      { label: 'Live at', value: CONTINUITY_WEBSITE.productionUrl },
      { label: 'Source of truth', value: 'GitHub · 9Mirrors-Lab/formless-web' },
      { label: 'Published by', value: 'Vercel' },
      { label: 'Stored information from', value: 'Supabase' },
    ],
    technical: [
      { label: 'Deployment branch', value: CONTINUITY_VERCEL.deploymentBranch },
      { label: 'Preview host', value: CONTINUITY_VERCEL.previewUrl },
      { label: 'Also answers at', value: CONTINUITY_WEBSITE.alsoAt.join(', ') },
    ],
    manage: { label: 'Open live website', href: CONTINUITY_WEBSITE.productionUrl },
    jumpTo: 'website',
    importance: 'critical',
  },
  {
    id: 'formless',
    label: 'Formless',
    territory: 'experience',
    mark: 'formless',
    angle: 46,
    radius: 322,
    recognition: 'The book and audiobook at the centre of the work.',
    matters: 'Everything else exists to carry this to a reader.',
    practical: [
      { label: 'Title', value: `${CONTINUITY_FORMLESS.title} — ${CONTINUITY_FORMLESS.subtitle}` },
      { label: 'Author', value: CONTINUITY_FORMLESS.author },
      { label: 'Kindle', value: `Live · ASIN ${CONTINUITY_FORMLESS.kindleAsin}` },
      { label: 'Audible', value: `Live · ASIN ${CONTINUITY_FORMLESS.audibleAsin}` },
    ],
    technical: [
      { label: 'Print ISBN', value: CONTINUITY_FORMLESS.printIsbn },
      { label: 'Print status', value: CONTINUITY_FORMLESS.printStatus },
    ],
    manage: { label: 'Open Kindle listing', href: CONTINUITY_FORMLESS.kindleUrl },
    jumpTo: 'formless',
    importance: 'critical',
  },

  /* ---- What Powers It ---- */
  {
    id: 'domain',
    label: 'Domain',
    territory: 'powers',
    mark: 'domain',
    angle: 64,
    radius: 252,
    recognition: 'eyesclosed.love — the address people type to arrive.',
    matters: 'Lose the name and nobody can find the work, even though every file is safe.',
    practical: [
      { label: 'Domain', value: CONTINUITY_DOMAIN.name },
      { label: 'Registrar', value: CONTINUITY_DOMAIN.registrar },
      { label: 'Auto-renew', value: CONTINUITY_DOMAIN.automaticRenewal },
      { label: 'DNS provider', value: CONTINUITY_DOMAIN.dnsProvider },
    ],
    technical: [
      { label: 'Nameservers', value: CONTINUITY_DOMAIN.nameservers },
      { label: 'Renewal payment', value: CONTINUITY_DOMAIN.renewalPayment },
    ],
    jumpTo: 'domain',
    importance: 'critical',
  },
  {
    id: 'vercel',
    label: 'Vercel',
    territory: 'powers',
    mark: 'vercel',
    angle: 92,
    radius: 238,
    recognition: 'Publishes the Eyes Closed website to the internet.',
    matters: 'If Vercel stops, the domain still exists but there is nothing to serve.',
    practical: [
      { label: 'Project', value: CONTINUITY_VERCEL.projectName },
      { label: 'Team', value: CONTINUITY_VERCEL.organization },
      { label: 'Connected repository', value: CONTINUITY_VERCEL.githubRepository },
      { label: 'Production branch', value: CONTINUITY_VERCEL.deploymentBranch },
    ],
    technical: [
      { label: 'Production URL', value: CONTINUITY_VERCEL.productionUrl },
      { label: 'Preview URL', value: CONTINUITY_VERCEL.previewUrl },
      { label: 'Last deployment', value: CONTINUITY_VERCEL.lastDeployment },
      { label: 'Secret values', value: CONTINUITY_VERCEL.envValuePolicy },
    ],
    manage: { label: 'Open hosting', href: CONTINUITY_VERCEL.dashboardUrl },
    jumpTo: 'website',
    importance: 'critical',
  },
  {
    id: 'github',
    label: 'GitHub',
    territory: 'powers',
    mark: 'github',
    angle: 120,
    radius: 330,
    recognition: 'Stores the code the website is built from, and every change ever made.',
    matters: 'This is the master copy. A developer starts here, not on a personal laptop.',
    practical: [
      { label: 'Organization', value: CONTINUITY_WEBSITE.github.organization },
      { label: 'Repository', value: CONTINUITY_WEBSITE.github.repository },
      { label: 'Default branch', value: CONTINUITY_WEBSITE.github.defaultBranch },
      { label: 'Visibility', value: CONTINUITY_WEBSITE.github.visibility },
    ],
    technical: [{ label: 'Related repositories', value: CONTINUITY_WEBSITE.github.related }],
    manage: { label: 'Open website files', href: CONTINUITY_WEBSITE.github.url },
    jumpTo: 'website',
    importance: 'critical',
  },
  {
    id: 'supabase',
    label: 'Supabase',
    territory: 'powers',
    mark: 'supabase',
    angle: 146,
    radius: 252,
    recognition: 'Holds the information the website saves and reads back.',
    matters: 'Page copy, sign-ins, and every email someone left live here.',
    practical: [
      { label: 'Project', value: CONTINUITY_SUPABASE.projectName },
      { label: 'Project URL', value: CONTINUITY_SUPABASE.projectUrl },
      { label: 'Region', value: CONTINUITY_SUPABASE.region },
      { label: 'Backups', value: CONTINUITY_SUPABASE.backupStatus },
    ],
    technical: CONTINUITY_SUPABASE.importantTables.map((table) => ({
      label: table.name,
      value: table.purpose,
    })),
    manage: { label: 'Open backend', href: CONTINUITY_SUPABASE.dashboardUrl },
    jumpTo: 'website',
    importance: 'critical',
  },

  /* ---- What Belongs To It ---- */
  {
    id: 'publishing',
    label: 'Publishing',
    territory: 'belongs',
    mark: 'publishing',
    angle: 166,
    radius: 326,
    recognition: 'Where Formless is actually sold and listened to.',
    matters: 'These accounts hold the listings, the rights, and the royalties.',
    practical: [
      { label: 'Written work', value: 'Amazon KDP → Kindle → print (forthcoming)' },
      { label: 'Spoken work', value: 'ACX → Audible' },
      { label: 'Rights', value: CONTINUITY_FORMLESS.publishingRights },
      { label: 'Royalties', value: CONTINUITY_FORMLESS.royaltyDestination },
    ],
    jumpTo: 'formless',
    importance: 'important',
  },
  {
    id: 'assets',
    label: 'Files & Assets',
    territory: 'belongs',
    mark: 'assets',
    angle: 194,
    radius: 242,
    recognition: 'Logos, artwork, manuscript, covers, and audiobook masters.',
    matters: 'These are the originals. Everything visible is made from them.',
    practical: [
      { label: 'Brand files', value: 'Website repository · design/ and public/brand' },
      { label: 'Book files', value: 'KDP uploads, with originals in Drive' },
      { label: 'Audio masters', value: 'formless-web/masters plus Google Drive' },
      { label: 'Needs consolidation', value: 'Several collections still live in two places' },
    ],
    jumpTo: 'assets',
    importance: 'important',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    territory: 'belongs',
    mark: 'accounts',
    angle: 222,
    radius: 250,
    recognition: 'Every login that controls a piece of Eyes Closed.',
    matters: 'Continuity tells you where each key is kept. It never becomes the key.',
    practical: [
      { label: 'Vault', value: '1Password · Eyes Closed' },
      { label: 'Critical logins', value: 'Domain, GitHub, Vercel, Supabase, Google' },
      { label: 'Stored here', value: 'Nothing secret. Locations only.' },
    ],
    jumpTo: 'access',
    importance: 'critical',
  },
  {
    id: 'payments',
    label: 'Payments',
    territory: 'belongs',
    mark: 'payments',
    angle: 248,
    radius: 332,
    recognition: 'The handful of subscriptions that keep the lights on.',
    matters: 'Three of them would take Eyes Closed offline if they lapsed.',
    practical: [
      { label: 'Critical', value: 'Domain, Vercel, Supabase, 1Password' },
      { label: 'Important', value: 'Email mailbox, Zoho Campaigns, GitHub' },
      { label: 'Card details', value: 'Never stored here. Confirm in 1Password.' },
    ],
    jumpTo: 'running',
    importance: 'critical',
  },

  /* ---- The People ---- */
  {
    id: 'ownership',
    label: 'Ownership',
    territory: 'people',
    mark: 'people',
    angle: 262,
    radius: 250,
    recognition: 'Who ultimately decides what happens to the work.',
    matters: 'Decisions about the teaching, the book, and the public voice start here.',
    practical: [
      { label: 'Owner', value: 'Sonika Cottman' },
      { label: 'Holds', value: 'Publishing rights, teaching, brand voice' },
      { label: 'Technical steward', value: 'Ryan Riley' },
    ],
    jumpTo: 'help',
    importance: 'critical',
  },
  {
    id: 'help',
    label: 'Who Can Help',
    territory: 'people',
    mark: 'people',
    angle: 281,
    radius: 336,
    recognition: 'The person to reach for each kind of question.',
    matters: 'Nothing here needs to be solved alone.',
    practical: [
      { label: 'Website or hosting', value: 'Technical — Ryan Riley' },
      { label: 'Book or audiobook', value: 'Publishing — Sonika Cottman' },
      { label: 'Ownership', value: 'Business — Sonika Cottman' },
    ],
    jumpTo: 'help',
    importance: 'important',
  },
  {
    id: 'contacts',
    label: 'Contacts',
    territory: 'people',
    mark: 'people',
    angle: 300,
    radius: 242,
    recognition: 'How to reach each of them.',
    matters: 'Phone numbers stay in 1Password, not on a web page.',
    practical: [
      { label: 'Sonika', value: 'sonikacottman@gmail.com · hello@eyesclosed.love' },
      { label: 'Ryan', value: 'riles4@gmail.com' },
      { label: 'Phone numbers', value: 'Confirm in 1Password' },
    ],
    jumpTo: 'help',
    importance: 'important',
  },
] as const;

export type AtlasEdgeKind =
  | 'delivery'
  | 'source'
  | 'data'
  | 'publish'
  | 'supply'
  | 'billing'
  | 'stewardship';

export type AtlasEdge = {
  from: AtlasNodeId;
  to: AtlasNodeId;
  kind: AtlasEdgeKind;
  /** Spine edges stay faintly visible at rest. */
  spine?: boolean;
  reading: string;
};

export const ATLAS_EDGES: readonly AtlasEdge[] = [
  { from: 'domain', to: 'website', kind: 'delivery', spine: true, reading: 'The domain points visitors at the website.' },
  { from: 'github', to: 'vercel', kind: 'source', spine: true, reading: 'GitHub hands the source to Vercel.' },
  { from: 'vercel', to: 'website', kind: 'delivery', spine: true, reading: 'Vercel publishes the live website.' },
  { from: 'supabase', to: 'website', kind: 'data', spine: true, reading: 'Supabase supplies saved information.' },
  { from: 'formless', to: 'publishing', kind: 'publish', spine: true, reading: 'Formless reaches readers through Amazon and Audible.' },
  { from: 'website', to: 'formless', kind: 'publish', spine: true, reading: 'The website is the doorway to the book.' },
  { from: 'assets', to: 'website', kind: 'supply', reading: 'Artwork and images come from the asset library.' },
  { from: 'assets', to: 'formless', kind: 'supply', spine: true, reading: 'The manuscript, cover, and masters live in the archive.' },
  { from: 'assets', to: 'social', kind: 'supply', reading: 'Social posts draw on the same archive.' },
  { from: 'payments', to: 'domain', kind: 'billing', reading: 'The domain renews annually.' },
  { from: 'payments', to: 'vercel', kind: 'billing', reading: 'Hosting bills monthly.' },
  { from: 'payments', to: 'supabase', kind: 'billing', reading: 'The database bills monthly.' },
  { from: 'payments', to: 'email', kind: 'billing', reading: 'The mailbox and newsletter are paid services.' },
  { from: 'accounts', to: 'domain', kind: 'stewardship', reading: 'The registrar login is in the vault.' },
  { from: 'accounts', to: 'github', kind: 'stewardship', reading: 'The GitHub login is in the vault.' },
  { from: 'accounts', to: 'vercel', kind: 'stewardship', reading: 'The Vercel login is in the vault.' },
  { from: 'accounts', to: 'supabase', kind: 'stewardship', reading: 'The Supabase login is in the vault.' },
  { from: 'accounts', to: 'publishing', kind: 'stewardship', reading: 'KDP and ACX logins are in the vault.' },
  { from: 'accounts', to: 'social', kind: 'stewardship', reading: 'Channel logins are in the vault.' },
  { from: 'accounts', to: 'email', kind: 'stewardship', reading: 'The mailbox login is in the vault.' },
  { from: 'email', to: 'social', kind: 'supply', reading: 'The newsletter and channels speak to the same audience.' },
  { from: 'ownership', to: 'formless', kind: 'stewardship', spine: true, reading: 'Sonika owns the work itself.' },
  { from: 'ownership', to: 'accounts', kind: 'stewardship', reading: 'Ownership ultimately controls the accounts.' },
  { from: 'help', to: 'website', kind: 'stewardship', reading: 'Technical questions go to Ryan.' },
  { from: 'help', to: 'publishing', kind: 'stewardship', reading: 'Publishing questions go to Sonika.' },
  { from: 'contacts', to: 'help', kind: 'stewardship', reading: 'Contact details sit behind each role.' },
] as const;

export function atlasNodeById(id: AtlasNodeId): AtlasNode {
  const node = ATLAS_NODES.find((item) => item.id === id);
  if (!node) throw new Error(`Unknown atlas node: ${id}`);
  return node;
}

export function atlasRelatedIds(id: AtlasNodeId): Set<AtlasNodeId> {
  const related = new Set<AtlasNodeId>([id]);
  for (const edge of ATLAS_EDGES) {
    if (edge.from === id) related.add(edge.to);
    if (edge.to === id) related.add(edge.from);
  }
  return related;
}

/* ------------------------------------------------------------------ */
/* Begin Here                                                          */
/* ------------------------------------------------------------------ */

export type BeginStepVisual = 'map' | 'pillars' | 'chain' | 'shelf' | 'quadrant';

export type BeginStep = {
  index: string;
  title: string;
  body: string;
  visual: BeginStepVisual;
  action: { label: string; section: string };
  anchors?: readonly { label: string; blurb: string; mark: ServiceMarkId }[];
  chips?: readonly string[];
};

export const BEGIN_HERE_INTRO =
  'You do not need to understand everything at once. These are the first things worth knowing before changing anything.';

export const BEGIN_HERE_STEPS: readonly BeginStep[] = [
  {
    index: '01',
    title: 'See the whole picture',
    body: 'Eyes Closed is made of several connected services, but most of them operate automatically.',
    visual: 'map',
    action: { label: 'View how everything connects', section: 'atlas' },
  },
  {
    index: '02',
    title: 'Know what keeps it online',
    body: 'Only a few things are truly essential to keeping Eyes Closed functioning.',
    visual: 'pillars',
    anchors: [
      { label: 'Domain', blurb: 'Where people find Eyes Closed.', mark: 'domain' },
      { label: 'Website', blurb: 'Where the live experience runs.', mark: 'vercel' },
      { label: 'Database', blurb: 'Where dynamic information is stored.', mark: 'supabase' },
    ],
    action: { label: 'See what keeps running', section: 'running' },
  },
  {
    index: '03',
    title: 'Know where access lives',
    body: 'Passwords and secure credentials are not stored here. Continuity tells you where they are safely kept and which account controls each service.',
    visual: 'chain',
    chips: ['Service', 'Account', 'Vault', '2FA', 'Recovery', 'Owner'],
    action: { label: 'Open access map', section: 'access' },
  },
  {
    index: '04',
    title: 'Know where everything belongs',
    body: 'Every original file has a home. These are the six collections the whole brand is built from.',
    visual: 'shelf',
    chips: ['Eyes Closed', 'Formless', 'Brand', 'Publishing', 'Audio', 'Social'],
    action: { label: 'Explore assets', section: 'assets' },
  },
  {
    index: '05',
    title: 'Know who can help',
    body: 'Start with the kind of question you have, not with a name.',
    visual: 'quadrant',
    chips: ['Technical', 'Publishing', 'Business', 'Ownership'],
    action: { label: 'See who can help', section: 'help' },
  },
] as const;

export const BEGIN_HERE_CLOSE =
  'Everything else in Continuity is here when you need it.';

/* ------------------------------------------------------------------ */
/* The Big Picture — source to visitor                                 */
/* ------------------------------------------------------------------ */

export type SignalStage = {
  id: string;
  label: string;
  mark: ServiceMarkId;
  whatThisIs: string;
  whyItMatters: string;
  manage?: { label: string; href: string };
  technical?: readonly AtlasDetailRow[];
};

export const SIGNAL_STAGES: readonly SignalStage[] = [
  {
    id: 'visitor',
    label: 'Someone visits Eyes Closed',
    mark: 'people',
    whatThisIs:
      'A person arrives because they heard the teaching, found the book, or typed the name. No account is needed to read the public pages.',
    whyItMatters: 'Everything downstream exists to make this moment work.',
  },
  {
    id: 'domain',
    label: 'eyesclosed.love directs them',
    mark: 'domain',
    whatThisIs:
      'The domain is the street address. It tells the internet where the Eyes Closed website is currently kept.',
    whyItMatters: 'Without the name, people cannot arrive even though every file is safe.',
    technical: [
      { label: 'DNS provider', value: CONTINUITY_DOMAIN.dnsProvider },
      { label: 'Nameservers', value: CONTINUITY_DOMAIN.nameservers },
    ],
  },
  {
    id: 'vercel',
    label: 'Vercel delivers the website',
    mark: 'vercel',
    whatThisIs:
      'Vercel takes the built website and serves it on the domain. The live site is the Vercel production deployment.',
    whyItMatters: 'This is the service that actually answers when someone visits.',
    manage: { label: 'Open hosting', href: CONTINUITY_VERCEL.dashboardUrl },
    technical: [
      { label: 'Project', value: CONTINUITY_VERCEL.projectName },
      { label: 'Production branch', value: CONTINUITY_VERCEL.deploymentBranch },
      { label: 'Team', value: CONTINUITY_VERCEL.organization },
    ],
  },
  {
    id: 'github',
    label: 'The website comes from GitHub',
    mark: 'github',
    whatThisIs:
      'GitHub holds the master copy of the website files and a history of every change. A developer works here.',
    whyItMatters: 'Give a developer this repository and they can continue the site without anything of Ryan’s.',
    manage: { label: 'Open website files', href: CONTINUITY_WEBSITE.github.url },
    technical: [
      { label: 'Repository', value: `${CONTINUITY_WEBSITE.github.organization}/${CONTINUITY_WEBSITE.github.repository}` },
      { label: 'Default branch', value: CONTINUITY_WEBSITE.github.defaultBranch },
    ],
  },
  {
    id: 'supabase',
    label: 'Supabase provides information',
    mark: 'supabase',
    whatThisIs:
      'Supabase is the database and sign-in system. Page copy, signups, member accounts, and audiobook records live here.',
    whyItMatters: 'The pages still have a design without it, but forms and much of the copy would not work.',
    manage: { label: 'Open backend', href: CONTINUITY_SUPABASE.dashboardUrl },
    technical: [
      { label: 'Project ref', value: CONTINUITY_SUPABASE.projectUrl },
      { label: 'Authentication', value: CONTINUITY_SUPABASE.authentication },
    ],
  },
  {
    id: 'external',
    label: 'Other services connect where required',
    mark: 'amazon',
    whatThisIs:
      'Amazon, Audible, email sending, analytics, Google Drive, and the password manager sit outside the website. The site points to them.',
    whyItMatters: 'These are separate businesses. The website does not replace any of them.',
  },
] as const;

/* ------------------------------------------------------------------ */
/* Access landscape                                                    */
/* ------------------------------------------------------------------ */

export type AccessGroupId = 'ownership' | 'running' | 'publishing' | 'audience' | 'tools';

export type AccessGroup = {
  id: AccessGroupId;
  label: string;
  blurb: string;
  services: readonly string[];
};

export const ACCESS_PRINCIPLE =
  'Continuity tells you where the key is. It does not become the key.';

export const ACCESS_GROUPS: readonly AccessGroup[] = [
  {
    id: 'ownership',
    label: 'Controls Ownership',
    blurb: 'Hold these and you hold Eyes Closed.',
    services: ['Domain registrar', 'Google', '1Password'],
  },
  {
    id: 'running',
    label: 'Keeps Eyes Closed Running',
    blurb: 'The website stops without these.',
    services: ['GitHub', 'Vercel', 'Supabase'],
  },
  {
    id: 'publishing',
    label: 'Publishing',
    blurb: 'Where the book and audiobook are sold.',
    services: ['Amazon / KDP', 'Audible / ACX'],
  },
  {
    id: 'audience',
    label: 'Audience',
    blurb: 'How the work stays in touch.',
    services: ['Email (hello@eyesclosed.love)', 'Zoho Campaigns', 'Instagram'],
  },
  {
    id: 'tools',
    label: 'Tools',
    blurb: 'Supporting services. Useful, not load-bearing.',
    services: ['PostHog', 'Canva / design tools', 'Google Drive (audio and files)'],
  },
] as const;

export const ACCESS_MARKS: Record<string, ServiceMarkId> = {
  'Domain registrar': 'domain',
  GitHub: 'github',
  Vercel: 'vercel',
  Supabase: 'supabase',
  Google: 'google-drive',
  'Amazon / KDP': 'amazon',
  'Audible / ACX': 'audible',
  'Email (hello@eyesclosed.love)': 'email',
  'Zoho Campaigns': 'zoho',
  Instagram: 'instagram',
  PostHog: 'posthog',
  'Canva / design tools': 'canva',
  'Google Drive (audio and files)': 'google-drive',
  '1Password': 'onepassword',
};

export function accessCredentialByService(service: string): ContinuityCredential | undefined {
  return CONTINUITY_CREDENTIALS.find((row) => row.service === service);
}

/** The vault is a service in the running list, not the credential list. */
export const ACCESS_VAULT_ENTRY: ContinuityCredential = {
  service: '1Password',
  accountEmail: 'The shared Eyes Closed vault account',
  credentialLocation: 'The vault itself. Emergency access is configured inside 1Password.',
  twoFactor: 'On. Confirm the recovery kit is stored offline.',
  recoveryMethod: '1Password Emergency Kit plus family or team emergency access',
  importance: 'critical',
  notes: 'Every other credential location on this page points back here.',
};

export function accessEntries(group: AccessGroup): ContinuityCredential[] {
  return group.services.map(
    (service) => accessCredentialByService(service) ?? ACCESS_VAULT_ENTRY,
  );
}

/* ------------------------------------------------------------------ */
/* Asset archive                                                       */
/* ------------------------------------------------------------------ */

export type AssetCollectionId =
  | 'eyes-closed'
  | 'formless'
  | 'brand'
  | 'publishing'
  | 'audio'
  | 'social';

export type AssetCollection = {
  id: AssetCollectionId;
  label: string;
  blurb: string;
  /** Categories drawn from CONTINUITY_ASSETS. */
  categories: readonly string[];
  preview?: { src: string; alt: string };
};

export const ASSET_COLLECTIONS: readonly AssetCollection[] = [
  {
    id: 'eyes-closed',
    label: 'Eyes Closed',
    blurb: 'The identity itself: marks, type, and the images the site is built from.',
    categories: ['Logos', 'Fonts', 'Website images'],
  },
  {
    id: 'formless',
    label: 'Formless',
    blurb: 'The book as a set of files: words, cover, and final uploads.',
    categories: ['Manuscript', 'Final book files', 'Cover files'],
    preview: { src: '/book-covers/formless-ebook.jpg', alt: 'Formless cover painting' },
  },
  {
    id: 'brand',
    label: 'Brand',
    blurb: 'Working design material and the photography behind the public pages.',
    categories: ['Brand files', 'Photography', 'Artwork'],
  },
  {
    id: 'publishing',
    label: 'Publishing',
    blurb: 'Everything made to carry the book outward.',
    categories: ['Promotional graphics', 'Launch materials'],
    preview: { src: '/book-covers/formless-print.jpg', alt: 'Formless print edition cover' },
  },
  {
    id: 'audio',
    label: 'Audio',
    blurb: 'The recorded voice: masters, takes, and the jacket that carries them.',
    categories: ['Audiobook masters', 'Audiobook artwork'],
    preview: { src: '/book-covers/formless-audible.png', alt: 'Formless audiobook artwork' },
  },
  {
    id: 'social',
    label: 'Social',
    blurb: 'Reusable templates for the channels.',
    categories: ['Social templates'],
  },
] as const;

export function assetsForCollection(collection: AssetCollection): ContinuityAsset[] {
  return CONTINUITY_ASSETS.filter((asset) => collection.categories.includes(asset.category));
}

/* ------------------------------------------------------------------ */
/* Formless ecosystem                                                  */
/* ------------------------------------------------------------------ */

export type FormlessBranchId = 'written' | 'spoken' | 'source' | 'audience' | 'commercial';

export type FormlessBranch = {
  id: FormlessBranchId;
  label: string;
  blurb: string;
  /** Compass degrees, 0 = top, clockwise. */
  angle: number;
  items: readonly { label: string; detail: string; mark?: ServiceMarkId; href?: string }[];
};

export const FORMLESS_BRANCHES: readonly FormlessBranch[] = [
  {
    id: 'written',
    label: 'Written Work',
    blurb: 'The book as people buy it.',
    angle: 36,
    items: [
      { label: 'Kindle', detail: `Live · ASIN ${CONTINUITY_FORMLESS.kindleAsin}`, mark: 'kindle', href: CONTINUITY_FORMLESS.kindleUrl },
      { label: 'Amazon KDP', detail: CONTINUITY_FORMLESS.kdpAccount, mark: 'amazon' },
      { label: 'Print', detail: `ISBN ${CONTINUITY_FORMLESS.printIsbn} · ${CONTINUITY_FORMLESS.printStatus}`, mark: 'amazon' },
    ],
  },
  {
    id: 'spoken',
    label: 'Spoken Work',
    blurb: 'The book as people hear it.',
    angle: 108,
    items: [
      { label: 'Audible', detail: `Live · ASIN ${CONTINUITY_FORMLESS.audibleAsin}`, mark: 'audible', href: CONTINUITY_FORMLESS.audibleUrl },
      { label: 'ACX', detail: CONTINUITY_FORMLESS.acx, mark: 'audible' },
      { label: 'Audiobook masters', detail: 'ACX listen-order files, plus the Drive catalog', mark: 'google-drive' },
    ],
  },
  {
    id: 'source',
    label: 'Source',
    blurb: 'The originals everything is made from.',
    angle: 180,
    items: [
      { label: 'Manuscript', detail: 'Author original. Confirm the off-site copy in Drive.', mark: 'assets' },
      { label: 'Cover', detail: 'public/book-covers/formless-ebook.jpg', mark: 'assets' },
      { label: 'Source artwork', detail: 'Original painting files with Sonika', mark: 'assets' },
    ],
  },
  {
    id: 'audience',
    label: 'Audience',
    blurb: 'How readers find it.',
    angle: 252,
    items: [
      { label: 'Website', detail: CONTINUITY_FORMLESS.websitePages.join(' · '), mark: 'website' },
      { label: 'Social', detail: '@eyesclosed.love', mark: 'instagram' },
      { label: 'Launch materials', detail: 'Campaign pages and email letters', mark: 'email' },
    ],
  },
  {
    id: 'commercial',
    label: 'Commercial Structure',
    blurb: 'Who is paid, and who decides.',
    angle: 324,
    items: [
      { label: 'Publishing rights', detail: CONTINUITY_FORMLESS.publishingRights, mark: 'people' },
      { label: 'Royalties', detail: CONTINUITY_FORMLESS.royaltyDestination, mark: 'payments' },
      { label: 'Support', detail: CONTINUITY_FORMLESS.supportContacts.join(' · '), mark: 'people' },
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/* What keeps running                                                  */
/* ------------------------------------------------------------------ */

export type RunningDependency = {
  service: string;
  mark: ServiceMarkId;
  sustains: string;
  ifItStopped: string;
};

export const RUNNING_DEPENDENCIES: readonly RunningDependency[] = [
  {
    service: 'Domain',
    mark: 'domain',
    sustains: 'Lets people reach Eyes Closed',
    ifItStopped: 'The address stops resolving. Visitors see nothing, and the name can be bought by someone else.',
  },
  {
    service: 'Vercel',
    mark: 'vercel',
    sustains: 'Keeps the website online',
    ifItStopped: 'The domain still works but there is no site to serve.',
  },
  {
    service: 'Supabase',
    mark: 'supabase',
    sustains: 'Keeps website information available',
    ifItStopped: 'Pages lose their copy, forms stop saving, and sign-in stops working.',
  },
  {
    service: '1Password',
    mark: 'onepassword',
    sustains: 'Keeps access to everything else',
    ifItStopped: 'Every other recovery path becomes much harder.',
  },
  {
    service: 'Email mailbox',
    mark: 'email',
    sustains: 'Keeps communication active',
    ifItStopped: 'Readers cannot reach Eyes Closed, and account recovery emails have nowhere to land.',
  },
  {
    service: 'Zoho Campaigns',
    mark: 'zoho',
    sustains: 'Keeps the newsletter sending',
    ifItStopped: 'Signups still save, but no letters go out.',
  },
  {
    service: 'GitHub',
    mark: 'github',
    sustains: 'Keeps the source and its history',
    ifItStopped: 'The live site keeps running, but future changes become far harder.',
  },
  {
    service: 'PostHog',
    mark: 'posthog',
    sustains: 'Keeps public-page analytics',
    ifItStopped: 'Nothing visitor-facing changes. Only measurement is lost.',
  },
] as const;

export function runningServiceByName(service: string): ContinuityRunningService | undefined {
  return CONTINUITY_RUNNING.find((row) => row.service === service);
}

export const RUNNING_COST_NOTE =
  'Approximate monthly and annual totals are not recorded here. Open the statements, then write the verified amounts into 1Password rather than into this page.';

/* ------------------------------------------------------------------ */
/* Who can help                                                        */
/* ------------------------------------------------------------------ */

export type HelpSituation = {
  id: string;
  situation: string;
  role: string;
  knows: readonly string[];
  personName: string;
};

export const HELP_SITUATIONS: readonly HelpSituation[] = [
  {
    id: 'technical',
    situation: 'Something is wrong with the website',
    role: 'Technical',
    knows: ['GitHub', 'Vercel', 'Supabase', 'DNS', 'Deployments'],
    personName: 'Ryan Riley',
  },
  {
    id: 'publishing',
    situation: 'Something involves the book or audiobook',
    role: 'Publishing',
    knows: ['Amazon KDP', 'ACX', 'Audible', 'Book files', 'Publishing accounts'],
    personName: 'Sonika Cottman',
  },
  {
    id: 'business',
    situation: 'Something involves ownership or business',
    role: 'Business / Legal',
    knows: ['Publishing rights', 'Royalties', 'Brand decisions'],
    personName: 'Sonika Cottman',
  },
  {
    id: 'unclear',
    situation: 'Something is unclear',
    role: 'Primary Continuity Contact',
    knows: ['How the whole system fits together', 'Where to look first'],
    personName: 'Ryan Riley',
  },
] as const;

export function helpPersonFor(situation: HelpSituation): ContinuityPerson | undefined {
  const byCategory = CONTINUITY_PEOPLE.find(
    (person) =>
      person.name === situation.personName &&
      (situation.role === 'Publishing'
        ? person.category === 'Publishing'
        : situation.role === 'Business / Legal'
          ? person.category === 'Partner / Owner'
          : person.category === 'Technical'),
  );
  return byCategory ?? CONTINUITY_PEOPLE.find((person) => person.name === situation.personName);
}

/* ------------------------------------------------------------------ */
/* Continuity principles                                               */
/* ------------------------------------------------------------------ */

export type ContinuityPrinciple = {
  id: string;
  title: string;
  body: string;
  mark: ServiceMarkId;
};

export const CONTINUITY_PRINCIPLES: readonly ContinuityPrinciple[] = [
  { id: 'domain', title: 'Keep the domain', body: 'Do not cancel eyesclosed.love, and leave automatic renewal on.', mark: 'domain' },
  { id: 'source', title: 'Keep the source', body: 'Do not delete the GitHub repository. It is the master copy of the site.', mark: 'github' },
  { id: 'project', title: 'Keep the live project', body: 'Do not delete the Vercel project. It is what answers when someone visits.', mark: 'vercel' },
  { id: 'data', title: 'Keep the data', body: 'Do not delete the Supabase project. Copy, signups, and accounts live there.', mark: 'supabase' },
  { id: 'keys', title: 'Protect private keys', body: 'Never publish API keys or private credentials, and never paste them into a page, ticket, or screenshot.', mark: 'onepassword' },
  { id: 'dns', title: 'Ask before changing DNS', body: 'DNS changes can disconnect the domain from the website. Confirm why first.', mark: 'domain' },
];

export const CONTINUITY_PRINCIPLES_CLOSE =
  'When unsure, leave the system as it is and contact the person listed under Who Can Help.';

/* ------------------------------------------------------------------ */
/* Social                                                              */
/* ------------------------------------------------------------------ */

export type SocialPurpose = 'Publishing' | 'Community' | 'Promotion' | 'Communication';

export const SOCIAL_PURPOSES: Record<string, SocialPurpose> = {
  Instagram: 'Community',
  LinkedIn: 'Promotion',
  'Newsletter / Stay Close': 'Communication',
  Facebook: 'Community',
  TikTok: 'Promotion',
  YouTube: 'Publishing',
};

export const SOCIAL_MARKS: Record<string, ServiceMarkId> = {
  Instagram: 'instagram',
  LinkedIn: 'linkedin',
  'Newsletter / Stay Close': 'zoho',
  Facebook: 'social',
  TikTok: 'social',
  YouTube: 'social',
};

export function socialByPurpose(purpose: SocialPurpose): ContinuitySocialChannel[] {
  return CONTINUITY_SOCIAL.filter((channel) => SOCIAL_PURPOSES[channel.name] === purpose);
}

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

export const ATLAS_CENTER = { x: 600, y: 430 };

/** Compass degrees (0 = top, clockwise) to viewBox coordinates. */
export function polarPoint(angle: number, radius: number): { x: number; y: number } {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: ATLAS_CENTER.x + Math.cos(radians) * radius,
    y: ATLAS_CENTER.y + Math.sin(radians) * radius,
  };
}

/**
 * Quadratic path bundled toward the centre, the way a radial atlas reads:
 * short hops stay near the rim, long relationships pass through the middle.
 */
export function bundledPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  bundle = 0.42,
): string {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const cx = ATLAS_CENTER.x + (midX - ATLAS_CENTER.x) * bundle;
  const cy = ATLAS_CENTER.y + (midY - ATLAS_CENTER.y) * bundle;
  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
}

/**
 * Arc path used for territory bands and their curved labels. Arcs sitting along
 * the bottom of the map are drawn anticlockwise so their label still reads
 * left to right instead of upside down.
 */
export function arcPath(startAngle: number, endAngle: number, radius: number): string {
  const sweep = (endAngle - startAngle + 360) % 360;
  const midAngle = (startAngle + sweep / 2) % 360;
  const flip = midAngle > 130 && midAngle < 230;
  const from = polarPoint(flip ? endAngle : startAngle, radius);
  const to = polarPoint(flip ? startAngle : endAngle, radius);
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} A ${radius} ${radius} 0 ${largeArc} ${flip ? 0 : 1} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
}
