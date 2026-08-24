import { FORMLESS_BOOK_COVER } from '@/data/bookCover';

/**
 * Canonical ledger of shipped designs, Zoho templates, and final files.
 * Agents: read this file before hunting Drive, chat, or public/.
 * Studio page: /brand/designs
 *
 * One row is one job. Explorations, system boards, and intended mocks
 * sit as versions on that row. Do not flatten them into sibling designs.
 */

export type MaterialStatus = 'active' | 'archived' | 'draft';

export type DesignKind = 'microsite' | 'page' | 'zoho-email' | 'kit';

export type DesignVersionRole = 'live' | 'intended' | 'system' | 'exploration' | 'mock';

export type DesignChipFacet = 'kind' | 'campaign' | 'audience' | 'channel' | 'owner';

export type DesignChip = {
  id: string;
  label: string;
  facet: DesignChipFacet;
};

export type DesignVersion = {
  id: string;
  label: string;
  role: DesignVersionRole;
  /** Original filename. Keep this stable so agents can find the file. */
  filename: string;
  previewSrc: string;
  /** Live HTML or page for this version, if it exists. */
  href?: string;
  /** Same label stacks these versions on one gallery row. */
  row?: string;
  /** Landscape board: span two columns and show the full image. */
  wide?: boolean;
  notes?: string;
};

export type BrandDesign = {
  id: string;
  title: string;
  status: MaterialStatus;
  kind: DesignKind;
  campaign: string;
  audience: string;
  channel: string;
  owner: string;
  liveFrom?: string;
  liveUntil?: string;
  /** Plain sentence: who sees it, and why it exists. Omit when the card should stay quiet. */
  usedFor?: string;
  href?: string;
  aliases?: readonly string[];
  currentVersionId: string;
  versions: readonly DesignVersion[];
  source: string;
  notes?: string;
};

export type BrandAssetVariant = {
  id: string;
  label: string;
  format: string;
  status: MaterialStatus;
  /** Public URL used in the product today. */
  src: string;
  /** Where a distinct file should live if it is not the same as src. */
  canonicalPath: string;
  usedOn: readonly string[];
  notes?: string;
};

export type BrandAssetFamily = {
  id: string;
  title: string;
  kind: 'cover' | 'mark';
  summary: string;
  variants: readonly BrandAssetVariant[];
};

export function materialStatusLabel(status: MaterialStatus): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'archived':
      return 'Archived';
    case 'draft':
      return 'Draft';
    default: {
      const _never: never = status;
      return _never;
    }
  }
}

export function designKindLabel(kind: DesignKind): string {
  switch (kind) {
    case 'microsite':
      return 'Microsite';
    case 'page':
      return 'Page';
    case 'zoho-email':
      return 'Zoho email';
    case 'kit':
      return 'Kit';
    default: {
      const _never: never = kind;
      return _never;
    }
  }
}

export function designVersionRoleLabel(role: DesignVersionRole): string {
  switch (role) {
    case 'live':
      return 'Live';
    case 'intended':
      return 'Intended';
    case 'system':
      return 'System';
    case 'exploration':
      return 'Exploration';
    case 'mock':
      return 'Mock';
    default: {
      const _never: never = role;
      return _never;
    }
  }
}

export function formatShortDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function liveWindowLabel(from: string, until: string): string {
  return `${formatShortDate(from)} – ${formatShortDate(until)}`;
}

export function designChipFacetLabel(facet: DesignChipFacet): string {
  switch (facet) {
    case 'kind':
      return 'Kind';
    case 'campaign':
      return 'Campaign';
    case 'audience':
      return 'Audience';
    case 'channel':
      return 'Channel';
    case 'owner':
      return 'Owner';
    default: {
      const _never: never = facet;
      return _never;
    }
  }
}

export function designChips(design: BrandDesign): DesignChip[] {
  return [
    { id: `${design.id}-kind`, label: designKindLabel(design.kind), facet: 'kind' },
    { id: `${design.id}-campaign`, label: design.campaign, facet: 'campaign' },
    { id: `${design.id}-audience`, label: design.audience, facet: 'audience' },
    { id: `${design.id}-channel`, label: design.channel, facet: 'channel' },
    { id: `${design.id}-owner`, label: design.owner, facet: 'owner' },
  ];
}

export function designVersionById(
  design: BrandDesign,
  versionId: string,
): DesignVersion | undefined {
  return design.versions.find((version) => version.id === versionId);
}

export function designCurrentVersion(design: BrandDesign): DesignVersion {
  return (
    designVersionById(design, design.currentVersionId) ??
    design.versions[0] ?? {
      id: 'missing',
      label: design.title,
      role: 'exploration',
      filename: '',
      previewSrc: '',
    }
  );
}

export function designPreviewSrc(design: BrandDesign): string {
  return designCurrentVersion(design).previewSrc;
}

export function designVersionRows(
  design: BrandDesign,
): Array<{ label: string; versions: DesignVersion[] }> {
  const rows: Array<{ label: string; versions: DesignVersion[] }> = [];
  for (const version of design.versions) {
    const label = version.row ?? '';
    const last = rows[rows.length - 1];
    if (last && last.label === label) {
      last.versions.push(version);
      continue;
    }
    rows.push({ label, versions: [version] });
  }
  return rows;
}

export const BRAND_DESIGNS: readonly BrandDesign[] = [
  {
    id: 'special-preview',
    title: 'Special preview',
    status: 'active',
    kind: 'microsite',
    campaign: 'Pre-launch',
    audience: 'Waitlist',
    channel: 'Email',
    owner: 'Soni',
    liveFrom: '2026-08-22',
    liveUntil: '2026-09-14',
    usedFor:
      'Soni emails waitlist with a link here. Hear the Introduction, then a quiet Kindle pre-order. Comes down September 14.',
    href: '/special-preview',
    aliases: ['/preorder'],
    currentVersionId: 'live',
    versions: [
      {
        id: 'live',
        label: 'Live page',
        role: 'live',
        filename: 'special-preview.jpg',
        previewSrc: '/design/previews/special-preview.jpg',
        notes: 'What is on /special-preview now.',
      },
    ],
    source: 'src/pages/PreorderLandingPage.tsx',
    notes: 'Live microsite only. No exploration thumbs on this card.',
  },
  {
    id: 'audible-illuminated-manuscript',
    title: 'Audible Master · Illuminated Manuscript',
    status: 'draft',
    kind: 'page',
    campaign: 'Audible Master',
    audience: 'Author + producer',
    channel: 'Web',
    owner: 'Ryan',
    usedFor:
      'Parallel design exploration for reviewing original recordings, comparing optimized masters, and preparing Formless chapters for Audible submission.',
    currentVersionId: 'dark',
    versions: [
      {
        id: 'light',
        label: 'Light manuscript',
        role: 'exploration',
        filename: 'formless-audible-illuminated-manuscript-light.png',
        previewSrc: '/design/previews/formless-audible-illuminated-manuscript-light.png',
        row: 'Parallel design exploration',
        wide: true,
        notes: 'Warm editorial manuscript opened inside the Eyes Closed sanctuary.',
      },
      {
        id: 'dark',
        label: 'Dark manuscript',
        role: 'exploration',
        filename: 'formless-audible-illuminated-manuscript-dark.png',
        previewSrc: '/design/previews/formless-audible-illuminated-manuscript-dark.png',
        row: 'Parallel design exploration',
        wide: true,
        notes: 'Black-paper manuscript with the same Audible and ACX preparation structure.',
      },
    ],
    source: 'Parallel design exploration · The Illuminated Manuscript',
    notes: 'Blind exploration. Keep the light and dark treatments together as one design job.',
  },
  {
    id: 'stay-close-letter',
    title: 'Stay Close',
    status: 'draft',
    kind: 'zoho-email',
    campaign: 'Stay Close',
    audience: 'Teaching list',
    channel: 'Email',
    owner: 'Soni',
    currentVersionId: 'template',
    versions: [
      {
        id: 'waitlist-thankyou-brandkit',
        label: 'Waitlist thank-you kit',
        role: 'system',
        filename: 'formless-waitlist-thankyou-brandkit.png',
        previewSrc: '/design/previews/formless-waitlist-thankyou-brandkit.png',
        row: 'Waitlist thank-you kit',
        wide: true,
        notes: 'Waitlist thank-you brand kit.',
      },
      {
        id: 'listen-first',
        label: 'Listen first',
        role: 'exploration',
        filename: 'formless-waitlist-listen-first-page.png',
        previewSrc: '/design/previews/formless-waitlist-listen-first-page.png',
        row: 'Waitlist thank-you kit',
        notes: 'Listen-first page board.',
      },
      {
        id: 'editorial',
        label: 'Editorial page',
        role: 'exploration',
        filename: 'formless-waitlist-editorial-page.png',
        previewSrc: '/design/previews/formless-waitlist-editorial-page.png',
        row: 'Waitlist thank-you kit',
        notes: 'Editorial page board.',
      },
      {
        id: 'preorder-concepts',
        label: 'Pre-order concepts',
        role: 'exploration',
        filename: 'formless-preorder-page-concepts.png',
        previewSrc: '/design/previews/formless-preorder-page-concepts.png',
        row: 'Waitlist thank-you kit',
        notes: 'Pre-order page concepts board.',
      },
      {
        id: 'brandkit',
        label: 'Teaching-letter board',
        role: 'system',
        filename: 'formless-stay-close-newsletter-brandkit.png',
        previewSrc: '/design/previews/formless-stay-close-newsletter-brandkit.png',
        row: 'Teaching-letter board',
        wide: true,
        notes: 'Stay Close teaching-letter system board.',
      },
      {
        id: 'template',
        label: 'Readable letter',
        role: 'mock',
        filename: 'formless-stay-close-newsletter-template.png',
        previewSrc: '/design/previews/formless-stay-close-newsletter-template.png',
        row: 'Teaching-letter board',
        notes: 'Readable mock of the Stay Close letter.',
      },
    ],
    source: 'Zoho email template',
    notes: 'One Stay Close shelf. Do not split these onto Special preview.',
  },
  {
    id: 'waitlist-letter',
    title: 'Waitlist letter',
    status: 'draft',
    kind: 'zoho-email',
    campaign: 'Pre-launch',
    audience: 'Waitlist',
    channel: 'Email',
    owner: 'Soni',
    usedFor:
      'The coded waitlist send. Jacket, Introduction listen, and a short thank-you. Open /emails/formless-waitlist-preview.html. Paste /emails/formless-waitlist-zoho.html into Zoho Campaigns.',
    href: '/emails/formless-waitlist-preview.html',
    currentVersionId: 'html',
    versions: [
      {
        id: 'html',
        label: 'Coded letter',
        role: 'live',
        filename: 'formless-waitlist-preview.html',
        previewSrc: '/design/previews/formless-waitlist-email-html.png',
        href: '/emails/formless-waitlist-preview.html',
        notes: 'Browser letter. Paste /emails/formless-waitlist-zoho.html into Zoho. Merge tags $[FNAME]$ and $[UNSUBSCRIBE]$.',
      },
    ],
    source: 'public/emails/formless-waitlist-preview.html',
    notes: 'This row is the coded waitlist send.',
  },
  {
    id: 'kindle-preorder',
    title: 'Kindle preorder',
    status: 'draft',
    kind: 'zoho-email',
    campaign: 'Pre-launch',
    audience: 'Waitlist',
    channel: 'Email',
    owner: 'Soni',
    usedFor:
      'Soni sends this when the Kindle page is open. Cream letter, jacket lockup, $0.99, September 1, Amazon button, socials. Pick the version below: jacket only, or jacket plus Introduction.',
    href: '/emails/formless-preorder.html',
    currentVersionId: 'html',
    versions: [
      {
        id: 'html',
        label: 'Jacket lockup',
        role: 'live',
        filename: 'formless-preorder.html',
        previewSrc: '/design/previews/formless-preorder-email.png',
        href: '/emails/formless-preorder.html',
        notes: 'Cream letter with side-by-side jacket. Paste /emails/formless-preorder-zoho.html into Zoho.',
      },
      {
        id: 'intro',
        label: 'With Introduction',
        role: 'exploration',
        filename: 'formless-preorder-intro.html',
        previewSrc: '/design/previews/formless-preorder-intro-email.png',
        href: '/emails/formless-preorder-intro.html',
        notes:
          'Same cream letter plus the Introduction listen block. Zoho: upload /emails/zoho-import/formless-preorder-intro.html and formless-preorder-intro-assets.zip.',
      },
    ],
    source: 'public/emails/formless-preorder.html',
  },
];

export const BRAND_ASSET_FAMILIES: readonly BrandAssetFamily[] = [
  {
    id: 'formless-cover',
    title: 'Formless cover art',
    kind: 'cover',
    summary:
      'Final jacket for Kindle and print. Same painting. Two named finals so agents do not mix drafts with what ships.',
    variants: [
      {
        id: 'ebook',
        label: 'Kindle / ebook',
        format: 'JPEG · 5:8',
        status: 'active',
        src: FORMLESS_BOOK_COVER.src,
        canonicalPath: '/book-covers/formless-ebook.jpg',
        usedOn: ['/special-preview', '/preorder', '/book', '/advance-listen'],
        notes: 'Title, subtitle, and author are in the art. This is the file the site uses.',
      },
      {
        id: 'print',
        label: 'Print book',
        format: 'Print front',
        status: 'active',
        src: FORMLESS_BOOK_COVER.src,
        canonicalPath: '/book-covers/formless-print.jpg',
        usedOn: ['KDP / print listing'],
        notes:
          'Front matches the Kindle jacket. When a distinct wrap exists, put it at /book-covers/formless-print.jpg.',
      },
    ],
  },
];

export const DESIGN_KINDS_IN_USE: readonly DesignKind[] = [
  ...new Set(BRAND_DESIGNS.map((design) => design.kind)),
];

export function designById(id: string): BrandDesign | undefined {
  return BRAND_DESIGNS.find((design) => design.id === id);
}

export function activeDesigns(): BrandDesign[] {
  return BRAND_DESIGNS.filter((design) => design.status === 'active');
}

export function draftDesigns(): BrandDesign[] {
  return BRAND_DESIGNS.filter((design) => design.status === 'draft');
}

export function designsByKind(kind: DesignKind | 'all'): BrandDesign[] {
  if (kind === 'all') return [...BRAND_DESIGNS];
  return BRAND_DESIGNS.filter((design) => design.kind === kind);
}

export function designKindCounts(): { all: number } & Record<DesignKind, number> {
  return {
    all: BRAND_DESIGNS.length,
    microsite: designsByKind('microsite').length,
    page: designsByKind('page').length,
    'zoho-email': designsByKind('zoho-email').length,
    kit: designsByKind('kit').length,
  };
}
