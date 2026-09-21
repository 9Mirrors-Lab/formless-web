/**
 * Interactive page design explorations for the brand studio (/brand/designs).
 * Shipped pages live in brandMaterials; this list is for review-only directions.
 */

export type PageExplorationArea = 'home' | 'formless' | 'science' | 'about' | 'work' | 'other';

export type PageExploration = {
  id: string;
  title: string;
  href: string;
  area: PageExplorationArea;
  description: string;
  /** Card screenshot of the live direction. */
  previewSrc: string;
  /** Static HTML under /design/ */
  external?: boolean;
};

export const PAGE_EXPLORATION_AREA_LABELS: Record<PageExplorationArea, string> = {
  home: 'Home',
  formless: 'Formless',
  science: 'Science',
  about: 'About',
  work: 'The Practice',
  other: 'Supporting & other',
};

/** Production page order in the site nav. */
export const PAGE_EXPLORATION_AREA_ORDER: readonly PageExplorationArea[] = [
  'home',
  'formless',
  'science',
  'about',
  'work',
  'other',
] as const;

export type PageExplorationAreaMeta = {
  label: string;
  /** Live production route when one exists. */
  productionHref?: string;
  blurb: string;
};

export const PAGE_EXPLORATION_AREA_META: Record<
  PageExplorationArea,
  PageExplorationAreaMeta
> = {
  home: {
    label: 'Home',
    productionHref: '/',
    blurb: 'Homepage heroes, invitation rhythm, and book-aside lockups.',
  },
  formless: {
    label: 'Formless',
    productionHref: '/book',
    blurb: 'Purchase layout, quotes, themes, and closing bands.',
  },
  science: {
    label: 'Science',
    productionHref: '/science',
    blurb: 'Spirituality & Science page structure, icons, and orbit grammar.',
  },
  about: {
    label: 'About',
    productionHref: '/about',
    blurb: 'Editorial about layouts and portrait treatments.',
  },
  work: {
    label: 'The Practice',
    productionHref: '/work',
    blurb: 'Work page rhythm and video-forward layouts.',
  },
  other: {
    label: 'Supporting & other',
    blurb: 'Cross-page mood keys and standalone teaching visuals.',
  },
};

export const BRAND_PAGE_EXPLORATIONS: readonly PageExploration[] = [
  {
    id: 'layout-tests',
    title: 'Hero & section templates',
    href: '/layout-tests',
    area: 'home',
    previewSrc: '/design/previews/page-layout-tests.jpg',
    description: 'Homepage rhythm: hero, reflection, practice grid, and section templates.',
  },
  {
    id: 'cosmic-concepts',
    title: 'Cosmic home concepts',
    href: '/cosmic-concepts',
    area: 'home',
    previewSrc: '/design/previews/page-cosmic-concepts.jpg',
    description: 'Four home directions using science orbits and teaching marks.',
  },
  {
    id: 'monument-home',
    title: 'Monument · home',
    href: '/monument-home',
    area: 'home',
    previewSrc: '/design/previews/page-monument-home.jpg',
    description: 'Southwestern surreal home. Matte charcoal, monoliths, horizon light.',
  },
  {
    id: 'book-preview',
    title: 'Book page redesign',
    href: '/book-preview',
    area: 'formless',
    previewSrc: '/design/previews/page-book-preview.jpg',
    description: 'Editorial book direction with insights, quotes, and chapter samples.',
  },
  {
    id: 'monument-book',
    title: 'Monument · book',
    href: '/monument-book',
    area: 'formless',
    previewSrc: '/design/previews/page-monument-book.jpg',
    description: 'Same book copy in architectural slab layout.',
  },
  {
    id: 'science-explore',
    title: 'Science page concepts',
    href: '/science-explore',
    area: 'science',
    previewSrc: '/design/previews/page-science-explore.jpg',
    description: 'Five science compositions with different icons and lockups.',
  },
  {
    id: 'science-directions',
    title: 'Science · dark directions',
    href: '/design/science-page-v2-directions.html',
    area: 'science',
    previewSrc: '/design/previews/page-science-directions.jpg',
    description: 'Vault, Atelier, Observatory Press. HTML specimen board.',
    external: true,
  },
  {
    id: 'about-layouts',
    title: 'About · layout studies',
    href: '/design/about-page-layouts.html',
    area: 'about',
    previewSrc: '/design/previews/page-about-layouts.jpg',
    description: 'Editorial split, portrait hero, manifesto, magazine.',
    external: true,
  },
  {
    id: 'about-magazine',
    title: 'About · magazine layout',
    href: '/about-magazine',
    area: 'about',
    previewSrc: '/design/previews/page-about-magazine.jpg',
    description: 'About page using layout variant 4.',
  },
  {
    id: 'work2',
    title: 'The Practice · alt layout',
    href: '/work2',
    area: 'work',
    previewSrc: '/design/previews/page-work2.jpg',
    description: 'Alternate work page structure and video treatment.',
  },
  {
    id: 'pattern-mirror',
    title: 'Pattern mirror',
    href: '/pattern-mirror',
    area: 'other',
    previewSrc: '/design/previews/page-pattern-mirror.jpg',
    description: 'Teaching visual for mind-body pattern mirroring.',
  },
  {
    id: 'inquire-with-sonika',
    title: 'Inquire with Sonika',
    href: '/inquire',
    area: 'other',
    previewSrc: '/design/previews/page-layout-tests.jpg',
    description:
      'Anonymous inquiry doorway with six live Q&As. Demo shell remains at /qa.',
  },
  {
    id: 'colors',
    title: 'Supporting page themes',
    href: '/colors',
    area: 'other',
    previewSrc: '/design/previews/page-colors.jpg',
    description: 'Dark keys for Work, About, and Science mood studies.',
  },
] as const;

export type PageExplorationGroup = {
  area: PageExplorationArea;
  meta: PageExplorationAreaMeta;
  entries: PageExploration[];
};

export function pageExplorationsGrouped(): PageExplorationGroup[] {
  return PAGE_EXPLORATION_AREA_ORDER.flatMap((area) => {
    const entries = BRAND_PAGE_EXPLORATIONS.filter((entry) => entry.area === area);
    if (entries.length === 0) return [];
    return [{ area, meta: PAGE_EXPLORATION_AREA_META[area], entries: [...entries] }];
  });
}

export function pageExplorationsByArea(
  area: PageExplorationArea | 'all',
): PageExploration[] {
  if (area === 'all') return [...BRAND_PAGE_EXPLORATIONS];
  return BRAND_PAGE_EXPLORATIONS.filter((entry) => entry.area === area);
}
