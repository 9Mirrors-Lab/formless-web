/**
 * Continuity Home copy and maps.
 * Tells someone where the keys live. Does not store passwords, API keys,
 * recovery codes, or secret environment values.
 */

export type ContinuityImportance = 'critical' | 'important' | 'supporting';

export type ContinuityNodeId =
  | 'website'
  | 'formless'
  | 'domain'
  | 'files'
  | 'accounts'
  | 'email'
  | 'payments'
  | 'social'
  | 'distribution'
  | 'infrastructure'
  | 'people'
  | 'what-to-do';

export type ContinuityMapGroupId =
  | 'orient'
  | 'presence'
  | 'work'
  | 'keep'
  | 'access'
  | 'stewards';

export type ContinuityDeskId = ContinuityNodeId | 'start-here' | 'picture';

export const CONTINUITY_HEADLINE = 'Continuity';

export const CONTINUITY_LEDE =
  'Everything needed to understand, protect, and continue Eyes Closed.';

export type ContinuityMapNode = {
  id: ContinuityNodeId;
  label: string;
  href: string;
  group: ContinuityMapGroupId;
  /** Percent positions for the desktop constellation. */
  x: number;
  y: number;
  summary: string;
};

export const CONTINUITY_MAP_GROUPS: Record<
  ContinuityMapGroupId,
  { label: string; order: number }
> = {
  orient: { label: 'Find your footing', order: 0 },
  presence: { label: 'How people arrive', order: 1 },
  work: { label: 'The book', order: 2 },
  keep: { label: 'Where things live', order: 3 },
  access: { label: 'How it stays reachable', order: 4 },
  stewards: { label: 'Who continues it', order: 5 },
};

export const CONTINUITY_MAP_NODES: readonly ContinuityMapNode[] = [
  {
    id: 'website',
    label: 'Website',
    href: '#website',
    group: 'presence',
    x: 18,
    y: 22,
    summary: 'The public teaching site at eyesclosed.love.',
  },
  {
    id: 'domain',
    label: 'Domain',
    href: '#domain',
    group: 'presence',
    x: 18,
    y: 48,
    summary: 'The address people type to reach Eyes Closed.',
  },
  {
    id: 'formless',
    label: 'Formless',
    href: '#formless',
    group: 'work',
    x: 82,
    y: 22,
    summary: 'The book, audiobook, and teaching that the site carries.',
  },
  {
    id: 'distribution',
    label: 'Book Distribution',
    href: '#distribution',
    group: 'work',
    x: 82,
    y: 48,
    summary: 'Amazon, Audible, and how readers find Formless.',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    href: '#infrastructure',
    group: 'keep',
    x: 50,
    y: 14,
    summary: 'GitHub, Vercel, and Supabase working together.',
  },
  {
    id: 'files',
    label: 'Files & Assets',
    href: '#files',
    group: 'keep',
    x: 50,
    y: 72,
    summary: 'Logos, covers, manuscript, and audio masters.',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    href: '#accounts',
    group: 'access',
    x: 22,
    y: 86,
    summary: 'Where each login is stored, not the password itself.',
  },
  {
    id: 'email',
    label: 'Email',
    href: '#email',
    group: 'access',
    x: 50,
    y: 90,
    summary: 'hello@eyesclosed.love and newsletter sending.',
  },
  {
    id: 'payments',
    label: 'Payments',
    href: '#payments',
    group: 'access',
    x: 78,
    y: 86,
    summary: 'What must stay paid so the site and domain continue.',
  },
  {
    id: 'social',
    label: 'Social',
    href: '#social',
    group: 'stewards',
    x: 82,
    y: 64,
    summary: 'Public channels and who owns them.',
  },
  {
    id: 'people',
    label: 'People',
    href: '#people',
    group: 'stewards',
    x: 18,
    y: 64,
    summary: 'Who to call, and for what.',
  },
  {
    id: 'what-to-do',
    label: 'What To Do',
    href: '#what-to-do',
    group: 'stewards',
    x: 50,
    y: 50,
    summary: 'Calm first steps if Ryan is not available.',
  },
] as const;

export type ContinuityMapEdge = {
  from: ContinuityNodeId;
  to: ContinuityNodeId;
};

export const CONTINUITY_MAP_EDGES: readonly ContinuityMapEdge[] = [
  { from: 'what-to-do', to: 'website' },
  { from: 'what-to-do', to: 'domain' },
  { from: 'what-to-do', to: 'formless' },
  { from: 'what-to-do', to: 'distribution' },
  { from: 'what-to-do', to: 'infrastructure' },
  { from: 'what-to-do', to: 'files' },
  { from: 'what-to-do', to: 'people' },
  { from: 'what-to-do', to: 'social' },
  { from: 'website', to: 'domain' },
  { from: 'website', to: 'infrastructure' },
  { from: 'formless', to: 'distribution' },
  { from: 'formless', to: 'files' },
  { from: 'accounts', to: 'email' },
  { from: 'email', to: 'payments' },
  { from: 'payments', to: 'domain' },
  { from: 'people', to: 'accounts' },
] as const;

export type ContinuityDeskTopic = {
  id: ContinuityDeskId;
  label: string;
  group: ContinuityMapGroupId;
  href: string;
  summary: string;
  question: string;
};

export const CONTINUITY_DESK_TOPICS: readonly ContinuityDeskTopic[] = [
  {
    id: 'start-here',
    label: 'Start here',
    group: 'orient',
    href: '#start-here',
    summary: 'Five calm steps if Ryan is not available.',
    question: 'What should I do first?',
  },
  {
    id: 'picture',
    label: 'How it fits',
    group: 'orient',
    href: '#picture',
    summary: 'How a visitor reaches Eyes Closed, without reading code.',
    question: 'How does the whole thing work?',
  },
  ...CONTINUITY_MAP_NODES.map((node) => ({
    id: node.id,
    label: node.label,
    group: node.group,
    href: node.href,
    summary: node.summary,
    question:
      node.id === 'files'
        ? 'Where are the logos, covers, manuscript, and audio?'
        : node.id === 'website'
          ? 'What is the live site, and where is the master copy?'
          : node.id === 'domain'
            ? 'Who owns eyesclosed.love, and does it renew?'
            : node.id === 'infrastructure'
              ? 'What are GitHub, Vercel, and Supabase each for?'
              : node.id === 'formless'
                ? 'Where is the book sold, and who holds the rights?'
                : node.id === 'distribution'
                  ? 'How do readers buy Kindle, Audible, and print?'
                  : node.id === 'accounts'
                    ? 'Where are the logins kept?'
                    : node.id === 'email'
                      ? 'How does hello@ and the newsletter work?'
                      : node.id === 'payments'
                        ? 'What must stay paid so nothing goes dark?'
                        : node.id === 'social'
                          ? 'Which public channels exist, and who owns them?'
                          : node.id === 'people'
                            ? 'Who do I call, and for what?'
                            : 'What should I avoid while I am tired?',
  })),
] as const;

export const CONTINUITY_DESK_DEFAULT: ContinuityDeskId = 'start-here';

const DESK_IDS = new Set<string>(CONTINUITY_DESK_TOPICS.map((topic) => topic.id));

export function parseContinuityHash(hash: string): ContinuityDeskId {
  const raw = hash.replace(/^#/, '').trim();
  if (raw === 'supabase-home') return 'infrastructure';
  if (DESK_IDS.has(raw)) return raw as ContinuityDeskId;
  return CONTINUITY_DESK_DEFAULT;
}

export type ContinuitySearchHit = {
  topicId: ContinuityDeskId;
  label: string;
  reason: string;
};

function haystack(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(' ').toLowerCase();
}

export function searchContinuityDesk(query: string): ContinuitySearchHit[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  const hits: ContinuitySearchHit[] = [];
  const seen = new Set<string>();

  const add = (hit: ContinuitySearchHit) => {
    const key = `${hit.topicId}:${hit.label}:${hit.reason}`;
    if (seen.has(key)) return;
    seen.add(key);
    hits.push(hit);
  };

  for (const topic of CONTINUITY_DESK_TOPICS) {
    if (haystack(topic.label, topic.summary, topic.question).includes(needle)) {
      add({ topicId: topic.id, label: topic.label, reason: topic.question });
    }
  }

  for (const asset of CONTINUITY_ASSETS) {
    if (haystack(asset.category, asset.primaryLocation, asset.backupLocation, asset.fileOwner).includes(needle)) {
      add({
        topicId: 'files',
        label: asset.category,
        reason: `${asset.brand} · ${asset.primaryLocation}`,
      });
    }
  }

  for (const row of CONTINUITY_CREDENTIALS) {
    if (haystack(row.service, row.credentialLocation, row.accountEmail).includes(needle)) {
      add({ topicId: 'accounts', label: row.service, reason: row.credentialLocation });
    }
  }

  for (const person of CONTINUITY_PEOPLE) {
    if (haystack(person.name, person.role, person.knows, person.whenToContact).includes(needle)) {
      add({ topicId: 'people', label: person.name, reason: person.whenToContact });
    }
  }

  for (const row of CONTINUITY_RUNNING) {
    if (haystack(row.service, row.purpose).includes(needle)) {
      add({ topicId: 'payments', label: row.service, reason: row.purpose });
    }
  }

  for (const channel of CONTINUITY_SOCIAL) {
    if (haystack(channel.name, channel.username, channel.purpose).includes(needle)) {
      add({ topicId: 'social', label: channel.name, reason: channel.purpose });
    }
  }

  if (haystack(CONTINUITY_DOMAIN.name, CONTINUITY_DOMAIN.registrar, CONTINUITY_DOMAIN.whyItMatters).includes(needle)) {
    add({ topicId: 'domain', label: CONTINUITY_DOMAIN.name, reason: CONTINUITY_DOMAIN.whyItMatters });
  }

  if (
    haystack(
      CONTINUITY_FORMLESS.title,
      CONTINUITY_FORMLESS.kindleAsin,
      CONTINUITY_FORMLESS.audibleAsin,
      CONTINUITY_FORMLESS.printIsbn,
      CONTINUITY_FORMLESS.explainer,
    ).includes(needle)
  ) {
    add({ topicId: 'formless', label: CONTINUITY_FORMLESS.title, reason: CONTINUITY_FORMLESS.explainer });
  }

  return hits.slice(0, 12);
}

export function continuityDeskTopicById(id: ContinuityDeskId): ContinuityDeskTopic {
  const topic = CONTINUITY_DESK_TOPICS.find((item) => item.id === id);
  if (!topic) return CONTINUITY_DESK_TOPICS[0];
  return topic;
}

export const CONTINUITY_START_HERE = {
  id: 'start-here',
  title: "If you're opening this because Ryan isn't available",
  lede: 'You do not need to fix anything tonight. Read these five steps in order. They are meant to slow the moment down.',
  steps: [
    {
      title: 'Nothing needs to be changed immediately.',
      body: 'The website can keep running without anyone touching it. Visitors can still reach eyesclosed.love. Do not log into hosting tools just to feel busy.',
    },
    {
      title: 'Make sure the few essential services stay paid.',
      body: 'The domain, website hosting, and database are the ones that would actually go dark if billing stopped. Open What Keeps Running. Confirm those three are still renewing. Leave everything else for later.',
    },
    {
      title: 'Confirm you can reach the important accounts.',
      body: 'Passwords are not on this page. They live in the password manager listed under Access. Check that you can open that vault, or that someone who can is reachable. Do not share a master password.',
    },
    {
      title: 'Talk to Technical Help before changing anything technical.',
      body: 'If a developer or technically capable person is listed under Who Can Help, contact them before touching GitHub, Vercel, Supabase, or DNS. A wrong click in those places is harder to undo than waiting a day.',
    },
    {
      title: 'Use the rest of this page as a map, not a to-do list.',
      body: 'Everything below explains how Eyes Closed is put together. Read it when you have quiet. You are not behind. The work is already running.',
    },
  ],
} as const;

export type ContinuityPictureStep = {
  id: string;
  label: string;
  explanation: string;
};

export const CONTINUITY_BIG_PICTURE: readonly ContinuityPictureStep[] = [
  {
    id: 'visitor',
    label: 'A visitor',
    explanation:
      'Someone arrives because they heard the teaching, found the book, or typed the name. They do not need an account to read the public pages.',
  },
  {
    id: 'domain-step',
    label: 'eyesclosed.love',
    explanation:
      'The domain is the street address. If this name is lost or allowed to expire, people cannot find the site even if the files are still safe.',
  },
  {
    id: 'vercel-step',
    label: 'Website hosted on Vercel',
    explanation:
      'Vercel is the printer and the storefront. It takes the built website and serves it on the domain. The live site is the Vercel production deployment.',
  },
  {
    id: 'github-step',
    label: 'Code stored in GitHub',
    explanation:
      'GitHub holds the master copy of the website files and a history of every change. A developer works here. They do not need a ZIP file from a personal computer.',
  },
  {
    id: 'supabase-step',
    label: 'Supabase holds living information',
    explanation:
      'Supabase is the database and sign-in system. Page copy, waitlist emails, member accounts, Kindle rank captures, and audiobook file records live here. The public pages still have a design even if this is down, but forms and much of the copy would not.',
  },
  {
    id: 'external-step',
    label: 'Outside services where they are needed',
    explanation:
      'Amazon, Audible, email sending, analytics, Google Drive for audio, and the password manager sit outside the website. The site points to them. It does not replace them.',
  },
] as const;

export const CONTINUITY_WEBSITE = {
  name: 'Eyes Closed',
  primaryDomain: 'eyesclosed.love',
  productionUrl: 'https://www.eyesclosed.love',
  alsoAt: ['https://eyesclosed.love'],
  purpose:
    'The public home of Eyes Closed. It offers a quiet teaching journey, the Formless book doorway, practice, science, and a way to stay close by email. It is not an admin console and it is not a storefront first.',
  github: {
    organization: '9Mirrors-Lab',
    repository: 'formless-web',
    url: 'https://github.com/9Mirrors-Lab/formless-web',
    defaultBranch: 'main',
    visibility: 'Private unless the GitHub settings say otherwise. Confirm in the GitHub organization.',
    related: 'This is the primary website repository.',
    ifSomeoneNeedsToUpdate:
      "Give the developer access to this GitHub repository. They should not need a personal computer, a ZIP of the site, or anyone's master password. Create their own GitHub seat.",
  },
  githubExplainer:
    'GitHub stores the source files used to build the website. Think of it as the master copy of the website.',
  vercelExplainer:
    'Vercel takes the website stored in GitHub and publishes it to eyesclosed.love.',
} as const;

export const CONTINUITY_VERCEL = {
  projectName: 'formless-web',
  accountOwner: "Ryan's Vercel team (ryan-s-projects-311c1e92)",
  organization: 'ryan-s-projects-311c1e92',
  dashboardUrl: 'https://vercel.com/ryan-s-projects-311c1e92/formless-web',
  productionUrl: 'https://www.eyesclosed.love',
  previewUrl: 'https://formless-web.vercel.app',
  githubRepository: '9Mirrors-Lab/formless-web',
  deploymentBranch: 'main',
  lastDeployment:
    'Open the Vercel project dashboard for the current production deployment. This page does not store live timestamps.',
  currentStatus:
    'Treat the live domain as the status check. If eyesclosed.love loads, Vercel is serving the site.',
  envValuePolicy:
    'Secret values are not shown here. Only names. The actual values live in Vercel project settings and in the password manager.',
  environmentVariableNames: [
    {
      name: 'VITE_SUPABASE_URL',
      containedIn: 'Vercel project env, and the local env file on the development machine.',
    },
    {
      name: 'VITE_SUPABASE_ANON_KEY',
      containedIn: 'Vercel project env and local env. Public-facing anon key, still not pasted on this page.',
    },
    {
      name: 'VITE_PUBLIC_POSTHOG_KEY',
      containedIn: 'Vercel project env when analytics is on.',
    },
    {
      name: 'VITE_PUBLIC_POSTHOG_HOST',
      containedIn: 'Vercel project env. Default host is PostHog US.',
    },
    {
      name: 'VITE_PUBLIC_POSTHOG_DISABLED',
      containedIn: 'Optional flag in Vercel or local env.',
    },
    {
      name: 'VITE_PUBLIC_SITE_RESTRICTED',
      containedIn: 'Optional flag. When on, the public site shows the home experience only.',
    },
    {
      name: 'VITE_PUBLIC_MEMBER_AUTH_NAV',
      containedIn: 'Optional flag. Shows Sign in in the public nav.',
    },
    {
      name: 'VITE_KINDLE_PREORDER_URL',
      containedIn: 'Optional override for the Kindle listing URL.',
    },
    {
      name: 'VITE_AUDIBLE_URL',
      containedIn: 'Optional override for the Audible listing URL.',
    },
    {
      name: 'VITE_AMAZON_BOOKS_URL',
      containedIn: 'Optional override for the print listing when it is live.',
    },
    {
      name: 'SUPABASE_SERVICE_ROLE_KEY',
      containedIn: 'Server-only. Vercel or a locked 1Password item. Never a VITE_ public variable.',
    },
    {
      name: 'GOOGLE_DRIVE_CLIENT_ID',
      containedIn: 'Vercel server env for audiobook Drive access.',
    },
    {
      name: 'GOOGLE_DRIVE_CLIENT_SECRET',
      containedIn: 'Vercel server env. Password manager.',
    },
    {
      name: 'GOOGLE_DRIVE_REFRESH_TOKEN',
      containedIn: 'Vercel server env. Password manager.',
    },
    {
      name: 'GOOGLE_DRIVE_FOLDER_ID',
      containedIn: 'Vercel server env for the Drive audio folder.',
    },
  ],
} as const;

export const CONTINUITY_DOMAIN = {
  critical: true as const,
  name: 'eyesclosed.love',
  registrar: 'Confirm in 1Password, Eyes Closed vault, Domain item.',
  registrarAccount: 'The email on the registrar login. Confirm in the same 1Password item.',
  expirationDate: 'Confirm on the registrar dashboard. Record it in 1Password when you next open the account.',
  automaticRenewal: 'Confirm that auto-renew is on. This is the single most important billing toggle.',
  renewalPayment:
    'Card or PayPal on the registrar account. This page does not store card numbers. Describe the last four digits only inside 1Password.',
  dnsProvider: 'Confirm whether DNS is at the registrar or pointed at Vercel.',
  nameservers: 'Copy the live nameservers from the registrar when you verify. Do not guess.',
  whyItMatters:
    'The domain is the address people use to reach Eyes Closed. Losing control of the domain would be one of the most serious things that could happen, so maintaining access and renewal is critical.',
} as const;

export const CONTINUITY_SUPABASE = {
  explainer:
    'Supabase stores information used by parts of the website. It is the website\'s database and backend system.',
  organization: 'Confirm the org name in the Supabase dashboard (the project is the Eyes Closed / Formless cloud project).',
  projectName: 'formless-web (local CLI name). Cloud project ref mkssukztjbpkovvyxhiz.',
  projectUrl: 'https://mkssukztjbpkovvyxhiz.supabase.co',
  dashboardUrl: 'https://supabase.com/dashboard/project/mkssukztjbpkovvyxhiz',
  region: 'Confirm in Supabase project settings. Do not change the region.',
  storedInformation: [
    'Public page copy (the words visitors read)',
    'Member sign-in accounts',
    'Newsletter, book, and early-listen email signups',
    'Kindle rank captures for Brand Studio',
    'Audiobook track records and recording-session takes',
  ],
  authentication:
    'Supabase Auth signs members into Brand Studio, Continuity, and related private rooms. Approved emails are listed in the internal access list in the website code.',
  storage: [
    'audiobook: chapter audio used for review playback',
    'audiobook-takes: private author session recordings',
    'Some masters also stream from Google Drive through a server route',
  ],
  importantTables: [
    { name: 'content', purpose: 'Site copy by page, section, and key' },
    { name: 'profiles', purpose: 'User profiles tied to sign-in' },
    { name: 'newsletter_signups', purpose: 'Stay Close / newsletter emails' },
    { name: 'book_release_signups', purpose: 'Book notify emails' },
    { name: 'advance_listen_signups', purpose: 'Early-listen emails' },
    { name: 'kindle_ranks', purpose: 'Captured Amazon ranks' },
    { name: 'audiobook_tracks', purpose: 'Chapter audio metadata' },
    { name: 'audiobook_session_takes', purpose: 'Recording takes' },
  ],
  backupStatus:
    'Confirm backups in the Supabase dashboard. If a Drive copy of backups exists, it will be named in 1Password, not here.',
} as const;

export type ContinuityCredential = {
  service: string;
  accountEmail: string;
  credentialLocation: string;
  twoFactor: string;
  recoveryMethod: string;
  importance: ContinuityImportance;
  notes?: string;
};

export const CONTINUITY_CREDENTIALS: readonly ContinuityCredential[] = [
  {
    service: 'Domain registrar',
    accountEmail: 'Confirm in 1Password, Eyes Closed, Domain',
    credentialLocation: '1Password, Eyes Closed, Domain',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'Registrar account recovery plus 1Password emergency access',
    importance: 'critical',
  },
  {
    service: 'GitHub',
    accountEmail: "Ryan's GitHub (organization 9Mirrors-Lab)",
    credentialLocation: '1Password, Eyes Closed, GitHub',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'GitHub recovery codes stored only in 1Password, not on this page',
    importance: 'critical',
  },
  {
    service: 'Vercel',
    accountEmail: 'Confirm in 1Password, Eyes Closed, Vercel',
    credentialLocation: '1Password, Eyes Closed, Vercel',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'Vercel account recovery plus 1Password emergency access',
    importance: 'critical',
  },
  {
    service: 'Supabase',
    accountEmail: 'Confirm in 1Password, Eyes Closed, Supabase',
    credentialLocation: '1Password, Eyes Closed, Supabase',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'Supabase account recovery plus 1Password emergency access',
    importance: 'critical',
  },
  {
    service: 'Google',
    accountEmail: 'The Google account that owns Drive audio and any OAuth clients',
    credentialLocation: '1Password, Eyes Closed, Google',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'Google account recovery. Do not keep backup codes on this site.',
    importance: 'critical',
  },
  {
    service: 'Amazon / KDP',
    accountEmail: 'Author publishing account. Confirm in 1Password.',
    credentialLocation: '1Password, Eyes Closed, Amazon KDP',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'Amazon account recovery',
    importance: 'important',
  },
  {
    service: 'Audible / ACX',
    accountEmail: 'ACX publisher or rights-holder login. Confirm in 1Password.',
    credentialLocation: '1Password, Eyes Closed, ACX',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'ACX / Audible account recovery',
    importance: 'important',
  },
  {
    service: 'Email (hello@eyesclosed.love)',
    accountEmail: 'hello@eyesclosed.love',
    credentialLocation: '1Password, Eyes Closed, Email',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'Mailbox host recovery. Domain access is required if the mailbox host is lost.',
    importance: 'important',
  },
  {
    service: 'Zoho Campaigns',
    accountEmail: 'Confirm in 1Password. Used to send waitlist and Stay Close letters.',
    credentialLocation: '1Password, Eyes Closed, Zoho',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'Zoho account recovery',
    importance: 'important',
  },
  {
    service: 'Instagram',
    accountEmail: 'Confirm in 1Password',
    credentialLocation: '1Password, Eyes Closed, Instagram',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'Meta account recovery',
    importance: 'important',
  },
  {
    service: 'PostHog',
    accountEmail: 'Confirm in 1Password',
    credentialLocation: '1Password, Eyes Closed, PostHog',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'PostHog account recovery',
    importance: 'supporting',
  },
  {
    service: 'Canva / design tools',
    accountEmail: 'Confirm in 1Password',
    credentialLocation: '1Password, Eyes Closed, Canva',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'Design-tool account recovery',
    importance: 'supporting',
  },
  {
    service: 'Google Drive (audio and files)',
    accountEmail: 'Same Google account as above unless 1Password says otherwise',
    credentialLocation: '1Password, Eyes Closed, Google Drive',
    twoFactor: 'Confirm in the vault item',
    recoveryMethod: 'Google account recovery',
    importance: 'important',
  },
] as const;

export type ContinuityAsset = {
  brand: 'Eyes Closed' | 'Formless';
  category: string;
  primaryLocation: string;
  backupLocation: string;
  fileOwner: string;
  lastVerified: string;
  needsConsolidation?: boolean;
};

export const CONTINUITY_ASSETS: readonly ContinuityAsset[] = [
  {
    brand: 'Eyes Closed',
    category: 'Logos',
    primaryLocation: 'Website repo: design/eyes-closed-logo-variations and public/brand/',
    backupLocation: 'Brand Studio export page /brand-kit-export. Confirm a Drive copy in 1Password.',
    fileOwner: 'Ryan (repo). Sonika (brand).',
    lastVerified: 'On each Brand Studio logo export review. Record a date in 1Password.',
  },
  {
    brand: 'Eyes Closed',
    category: 'Brand files',
    primaryLocation: 'formless-web design tokens and DESIGN.md',
    backupLocation: 'Not yet a single archive. Needs consolidation.',
    fileOwner: 'Ryan',
    lastVerified: 'Not dated on this page',
    needsConsolidation: true,
  },
  {
    brand: 'Eyes Closed',
    category: 'Fonts',
    primaryLocation: 'Self-hosted in the website repo (not a Google Fonts link)',
    backupLocation: 'Repo history on GitHub',
    fileOwner: 'Ryan',
    lastVerified: 'With the live site',
  },
  {
    brand: 'Eyes Closed',
    category: 'Photography',
    primaryLocation: 'public/ and about-page assets in the repo. Confirm portrait originals in Drive.',
    backupLocation: 'Confirm in 1Password / Drive',
    fileOwner: 'Sonika',
    lastVerified: 'Not dated on this page',
    needsConsolidation: true,
  },
  {
    brand: 'Eyes Closed',
    category: 'Artwork',
    primaryLocation: 'Cover painting files under public/book-covers/ and Brand Studio',
    backupLocation: 'Confirm original painting files in Drive',
    fileOwner: 'Sonika',
    lastVerified: 'Cover family in src/data/brandMaterials.ts',
  },
  {
    brand: 'Eyes Closed',
    category: 'Social templates',
    primaryLocation: 'Canva, listed under Brand Studio template ideas',
    backupLocation: 'Not mirrored in the repo. Needs consolidation.',
    fileOwner: 'Sonika / Ryan',
    lastVerified: 'Not dated on this page',
    needsConsolidation: true,
  },
  {
    brand: 'Eyes Closed',
    category: 'Website images',
    primaryLocation: 'formless-web/public/',
    backupLocation: 'GitHub repository history',
    fileOwner: 'Ryan',
    lastVerified: 'With each production deploy',
  },
  {
    brand: 'Formless',
    category: 'Manuscript',
    primaryLocation: 'Working manuscript sources in the repo under src/data/manuscripts/ and related docs',
    backupLocation: 'Confirm the author original in Drive or 1Password notes',
    fileOwner: 'Sonika',
    lastVerified: 'Not dated on this page',
    needsConsolidation: true,
  },
  {
    brand: 'Formless',
    category: 'Final book files',
    primaryLocation: 'KDP upload. Local copies: confirm in 1Password.',
    backupLocation: 'Needs a named Drive folder',
    fileOwner: 'Sonika',
    lastVerified: 'Not dated on this page',
    needsConsolidation: true,
  },
  {
    brand: 'Formless',
    category: 'Cover files',
    primaryLocation: 'public/book-covers/formless-ebook.jpg (use this). Print ISBN 9798996734511.',
    backupLocation: 'High-resolution print master path is reserved; confirm the file is stored off-site.',
    fileOwner: 'Sonika / Ryan',
    lastVerified: 'Brand materials ledger',
  },
  {
    brand: 'Formless',
    category: 'Audiobook masters',
    primaryLocation: 'ACX listen-order files under formless-web/masters/, plus Google Drive catalog',
    backupLocation: 'Google Drive published tracks. Keep both until consolidation is finished.',
    fileOwner: 'Ryan (engineering). Sonika (performance).',
    lastVerified: 'After the live Audible release',
    needsConsolidation: true,
  },
  {
    brand: 'Formless',
    category: 'Audiobook artwork',
    primaryLocation: 'Same jacket family as the ebook cover',
    backupLocation: 'Brand Studio / Drive',
    fileOwner: 'Sonika',
    lastVerified: 'With Audible listing',
  },
  {
    brand: 'Formless',
    category: 'Promotional graphics',
    primaryLocation: 'Brand Studio designs and Canva',
    backupLocation: 'Split today. Needs consolidation.',
    fileOwner: 'Ryan / Sonika',
    lastVerified: 'Not dated on this page',
    needsConsolidation: true,
  },
  {
    brand: 'Formless',
    category: 'Launch materials',
    primaryLocation: 'Brand Studio book-launch campaign page and Zoho email HTML in /emails/',
    backupLocation: 'GitHub',
    fileOwner: 'Ryan',
    lastVerified: 'With the live book pages',
  },
] as const;

export const CONTINUITY_FORMLESS = {
  title: 'Formless',
  subtitle: 'Who You Truly Are Beyond the Mind',
  author: 'Sonika Cottman',
  kindleUrl: 'https://www.amazon.com/dp/B0HFYC45QC',
  kindleAsin: 'B0HFYC45QC',
  kdpAccount: 'Amazon KDP account in 1Password, Eyes Closed, Amazon KDP',
  audibleUrl: 'https://www.audible.com/pd/Formless-Audiobook/B0HHHJXR6W',
  audibleAsin: 'B0HHHJXR6W',
  acx: 'ACX is how the audiobook was delivered to Audible. Chapter names use Chicago-style title case.',
  websitePages: ['/book', '/special-preview', 'home book doorway'],
  printIsbn: '9798996734511',
  printStatus: 'Print is forthcoming. Do not publish a fake store listing.',
  royaltyDestination: 'Confirm the bank or Amazon payments account in 1Password. Do not store account numbers here.',
  publishingRights: 'Author-owned. Confirm contracts in 1Password or the legal folder named there.',
  supportContacts: [
    'Amazon KDP Support, through the KDP dashboard',
    'ACX Support, through the ACX dashboard (formatted Audible description updates go through ACX Support)',
  ],
  explainer:
    'Formless is the book inside Eyes Closed: Kindle is for sale, Audible is live, print is on the way. The website is the doorway. Amazon and Audible are where most readers buy.',
} as const;

export type ContinuitySocialChannel = {
  name: string;
  username: string;
  url?: string;
  owner: string;
  emailUsed: string;
  credentialLocation: string;
  twoFactor: string;
  purpose: string;
};

export const CONTINUITY_SOCIAL: readonly ContinuitySocialChannel[] = [
  {
    name: 'Instagram',
    username: '@eyesclosed.love',
    url: 'https://www.instagram.com/eyesclosed.love/',
    owner: 'Sonika',
    emailUsed: 'Confirm in 1Password',
    credentialLocation: '1Password, Eyes Closed, Instagram',
    twoFactor: 'Confirm in the vault item',
    purpose: 'Public teaching, From Soni notes, and a living presence for the work.',
  },
  {
    name: 'LinkedIn',
    username: 'sonika-cottman',
    url: 'https://www.linkedin.com/in/sonika-cottman/',
    owner: 'Sonika',
    emailUsed: 'Confirm in 1Password',
    credentialLocation: '1Password, Eyes Closed, LinkedIn',
    twoFactor: 'Confirm in the vault item',
    purpose: 'Author presence. Not the primary teaching channel.',
  },
  {
    name: 'Newsletter / Stay Close',
    username: 'hello@eyesclosed.love list via Zoho Campaigns',
    owner: 'Sonika, with Ryan on the technical send',
    emailUsed: 'hello@eyesclosed.love',
    credentialLocation: '1Password, Eyes Closed, Zoho',
    twoFactor: 'Confirm in the vault item',
    purpose: 'The email list collected on the site. Signups also land in Supabase.',
  },
  {
    name: 'Facebook',
    username: 'Not documented in the website repo',
    owner: 'Confirm with Sonika',
    emailUsed: 'Confirm in 1Password if an account exists',
    credentialLocation: '1Password, Eyes Closed, if present',
    twoFactor: 'Unknown until verified',
    purpose: 'Do not assume a page exists. Add it here once confirmed.',
  },
  {
    name: 'TikTok',
    username: 'Not documented in the website repo',
    owner: 'Confirm with Sonika',
    emailUsed: 'Confirm in 1Password if an account exists',
    credentialLocation: '1Password, Eyes Closed, if present',
    twoFactor: 'Unknown until verified',
    purpose: 'Do not assume an account exists. Add it here once confirmed.',
  },
  {
    name: 'YouTube',
    username: 'Not documented in the website repo',
    owner: 'Confirm with Sonika',
    emailUsed: 'Confirm in 1Password if an account exists',
    credentialLocation: '1Password, Eyes Closed, if present',
    twoFactor: 'Unknown until verified',
    purpose: 'Do not assume a channel exists. Add it here once confirmed.',
  },
] as const;

export type ContinuityRunningService = {
  service: string;
  purpose: string;
  billing: string;
  renewal: string;
  importance: ContinuityImportance;
};

export const CONTINUITY_RUNNING: readonly ContinuityRunningService[] = [
  {
    service: 'Domain',
    purpose: 'eyesclosed.love stays the public address',
    billing: 'Annual at the registrar',
    renewal: 'Confirm auto-renew and the next date on the registrar',
    importance: 'critical',
  },
  {
    service: 'Vercel',
    purpose: 'Puts the website online',
    billing: 'Monthly (plan depends on the Vercel team)',
    renewal: 'Automatic while a payment method is on the team',
    importance: 'critical',
  },
  {
    service: 'Supabase',
    purpose: 'Database, sign-in, and related storage',
    billing: 'Monthly (plan depends on the project)',
    renewal: 'Automatic while a payment method is on the org',
    importance: 'critical',
  },
  {
    service: 'Email mailbox',
    purpose: 'hello@eyesclosed.love',
    billing: 'Monthly or annual at the mail host',
    renewal: 'Confirm with the mailbox provider',
    importance: 'important',
  },
  {
    service: 'Zoho Campaigns',
    purpose: 'Newsletter sending',
    billing: 'Confirm plan in Zoho',
    renewal: 'Automatic if a card is on file',
    importance: 'important',
  },
  {
    service: 'GitHub',
    purpose: 'Source history and access for developers',
    billing: 'Confirm org plan',
    renewal: 'Automatic if a card is on the org',
    importance: 'important',
  },
  {
    service: '1Password',
    purpose: 'Where the actual credentials live',
    billing: 'Confirm family or team plan',
    renewal: 'Automatic if a card is on file',
    importance: 'critical',
  },
  {
    service: 'PostHog',
    purpose: 'Site analytics (public pages only)',
    billing: 'Confirm current plan',
    renewal: 'Automatic if a card is on file',
    importance: 'supporting',
  },
] as const;

export const CONTINUITY_COSTS = {
  monthly:
    'Not recorded on this page. Add verified amounts in 1Password after you open the statements.',
  annual:
    'Not recorded on this page. Domain is annual; most other tools are monthly. Do not invent a total.',
} as const;

export type ContinuityPersonCategory =
  | 'Partner / Owner'
  | 'Technical'
  | 'Publishing'
  | 'Legal / Business';

export type ContinuityPerson = {
  name: string;
  category: ContinuityPersonCategory;
  role: string;
  email: string;
  phone: string;
  knows: string;
  whenToContact: string;
};

export const CONTINUITY_PEOPLE: readonly ContinuityPerson[] = [
  {
    name: 'Sonika Cottman',
    category: 'Partner / Owner',
    role: 'Author and the person who ultimately controls Eyes Closed',
    email: 'sonikacottman@gmail.com, and hello@eyesclosed.love',
    phone: 'Confirm in 1Password. Not stored here.',
    knows: 'The teaching, the book, the audience, publishing intent, and brand voice.',
    whenToContact: 'For any decision about the work itself, publishing, or public voice.',
  },
  {
    name: 'Ryan Riley',
    category: 'Technical',
    role: 'Technical steward for the website and related systems',
    email: 'riles4@gmail.com',
    phone: 'Confirm in 1Password. Not stored here.',
    knows: 'GitHub, Vercel, Supabase, DNS, deployments, Brand Studio, and audiobook engineering.',
    whenToContact:
      'Before changing code, hosting, the database, or DNS. If Ryan is not available, still do not make those changes until another technically capable person has access to the GitHub repository.',
  },
  {
    name: 'Sonika Cottman',
    category: 'Publishing',
    role: 'KDP, ACX, and Audible rights holder',
    email: 'hello@eyesclosed.love',
    phone: 'Confirm in 1Password.',
    knows: 'Amazon KDP, ACX, Audible listing, and reader-facing publishing questions.',
    whenToContact: 'For store listings, royalties, and publisher support tickets.',
  },
] as const;

export const CONTINUITY_WHAT_NOT_TO_DO: readonly string[] = [
  'Do not cancel the domain.',
  'Do not turn off automatic renewal on eyesclosed.love.',
  'Do not delete the GitHub repository.',
  'Do not delete the Vercel project.',
  'Do not delete the Supabase project.',
  'Do not change DNS settings unless someone understands why the change is being made.',
  'Do not share API keys, service-role keys, or recovery codes in email, chat, or this page.',
  'Do not give someone your personal master password. Create their own access instead.',
  'Do not paste secret environment values into the website, a ticket, or a screenshot.',
  'Do not assume a quiet day means something is broken. The site is meant to keep running on its own.',
] as const;

const SECRETISH = /eyJ[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{10,}|BEGIN (RSA |OPENSSH )?PRIVATE/i;

export function continuityTextBlob(): string {
  return JSON.stringify({
    nodes: CONTINUITY_MAP_NODES,
    start: CONTINUITY_START_HERE,
    picture: CONTINUITY_BIG_PICTURE,
    website: CONTINUITY_WEBSITE,
    vercel: CONTINUITY_VERCEL,
    domain: CONTINUITY_DOMAIN,
    supabase: CONTINUITY_SUPABASE,
    credentials: CONTINUITY_CREDENTIALS,
    assets: CONTINUITY_ASSETS,
    formless: CONTINUITY_FORMLESS,
    social: CONTINUITY_SOCIAL,
    running: CONTINUITY_RUNNING,
    costs: CONTINUITY_COSTS,
    people: CONTINUITY_PEOPLE,
    warnings: CONTINUITY_WHAT_NOT_TO_DO,
  });
}

export function continuityContainsForbiddenSecrets(blob = continuityTextBlob()): boolean {
  return SECRETISH.test(blob);
}

export function continuityAssetsNeedingConsolidation(): ContinuityAsset[] {
  return CONTINUITY_ASSETS.filter((asset) => asset.needsConsolidation);
}

export function continuityNodeById(id: ContinuityNodeId): ContinuityMapNode | undefined {
  return CONTINUITY_MAP_NODES.find((node) => node.id === id);
}
