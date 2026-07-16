export type ClientReviewStatus = 'live' | 'reference' | 'experiment' | 'promoted';

export type ClientReviewSectionId =
  | 'hero-home'
  | 'layout-pages'
  | 'motion-shaders'
  | 'brand-identity'
  | 'strategy';

export const CLIENT_REVIEW_SECTIONS: Record<
  ClientReviewSectionId,
  { label: string; description: string }
> = {
  'hero-home': {
    label: 'Hero & home',
    description: 'Homepage lockups, book aside variants, and archived hero directions.',
  },
  'layout-pages': {
    label: 'Layout & pages',
    description: 'Full-page layout playgrounds and alternate page treatments.',
  },
  'motion-shaders': {
    label: 'Motion & backgrounds',
    description: 'Shader heroes, animated backgrounds, and icon motion studies.',
  },
  'brand-identity': {
    label: 'Brand & identity',
    description: 'Logo options, type exploration, tokens, and export kits.',
  },
  strategy: {
    label: 'Strategy & briefs',
    description: 'Creative briefs, moodboards, and design framework notes.',
  },
};

export const CLIENT_REVIEW_STATUS_LABELS: Record<ClientReviewStatus, string> = {
  live: 'Live on site',
  reference: 'Archived reference',
  experiment: 'In review',
  promoted: 'Promoted direction',
};

export type ClientReviewEntry = {
  id: string;
  title: string;
  href: string;
  section: ClientReviewSectionId;
  status: ClientReviewStatus;
  description: string;
  source?: string;
};

const SECTION_ORDER: ClientReviewSectionId[] = [
  'hero-home',
  'layout-pages',
  'motion-shaders',
  'brand-identity',
  'strategy',
];

/** Client-facing index of design explorations and review URLs. */
export const CLIENT_DESIGN_REVIEW_INDEX: ClientReviewEntry[] = [
  // Hero & home
  {
    id: 'hero-classic',
    title: 'Original home hero',
    href: '/client/review/hero-classic',
    section: 'hero-home',
    status: 'reference',
    description:
      'Pre–layout-test hero: single-column serif lockup, GSAP entrance and scroll fade, desert photo background. No Formless book panel.',
    source: 'src/components/Hero.tsx',
  },
  {
    id: 'hero-current',
    title: 'Current live home',
    href: '/',
    section: 'hero-home',
    status: 'live',
    description: 'What visitors see today: updated lockup and type scale. Book aside off by default.',
    source: 'src/components/LayoutTestHeroSection.tsx',
  },
  {
    id: 'hero-book-aside',
    title: 'Home with Formless panel',
    href: '/?heroBookAside=1',
    section: 'hero-home',
    status: 'experiment',
    description:
      'Two-column hero with Formless title, release date, page-12 quote, and waitlist CTA on the right.',
    source: 'src/components/LayoutTestHeroSection.tsx',
  },
  {
    id: 'layout-tests',
    title: 'Layout test playground',
    href: '/layout-tests',
    section: 'hero-home',
    status: 'experiment',
    description:
      'Full homepage rhythm experiment: hero with book aside, reflection, practice grid, science split, and notes.',
    source: 'src/pages/LayoutTestsPage.tsx',
  },

  // Layout & pages
  {
    id: 'work2',
    title: 'The Practice (alt layout)',
    href: '/work2',
    section: 'layout-pages',
    status: 'experiment',
    description: 'Alternate work page structure and video placeholder treatment.',
    source: 'src/pages/Work2Page.tsx',
  },
  {
    id: 'about-magazine',
    title: 'About (magazine layout)',
    href: '/about-magazine',
    section: 'layout-pages',
    status: 'experiment',
    description: 'About page using layout variant 4: editorial magazine rhythm.',
    source: 'src/pages/AboutPage.tsx',
  },
  {
    id: 'pattern-mirror',
    title: 'Pattern mirror',
    href: '/pattern-mirror',
    section: 'layout-pages',
    status: 'experiment',
    description: 'Teaching visual for mind-body pattern mirroring.',
    source: 'src/pages/PatternMirrorPage.tsx',
  },
  {
    id: 'colors',
    title: 'Colors (supporting pages)',
    href: '/colors',
    section: 'layout-pages',
    status: 'experiment',
    description: 'Dark theme explorations for work, book, science, and about.',
    source: 'src/pages/ColorsPage.tsx',
  },

  // Motion & shaders
  {
    id: 'shader',
    title: 'Shader showcase',
    href: '/shader',
    section: 'motion-shaders',
    status: 'experiment',
    description: 'Standalone shader hero experiments and motion backdrop studies.',
    source: 'src/pages/ShaderPage.tsx',
  },
  {
    id: 'backgrounds',
    title: 'Background picker (shader hero)',
    href: '/backgrounds',
    section: 'motion-shaders',
    status: 'experiment',
    description:
      'Interactive hero background switcher with shader-backed themes and full home scroll-through.',
    source: 'src/pages/BackgroundsPage.tsx',
  },
  {
    id: 'icons',
    title: 'Iconography & motion',
    href: '/icons',
    section: 'motion-shaders',
    status: 'reference',
    description: 'Teaching marks with GSAP loops, light and dark previews.',
    source: 'src/pages/IconsPage.tsx',
  },

  // Brand & identity
  {
    id: 'design-system',
    title: 'Design system',
    href: '/design-system',
    section: 'brand-identity',
    status: 'reference',
    description: 'Color, type, motion tokens, and icon animation registry.',
    source: 'src/DesignSystem.tsx',
  },
  {
    id: 'fonts',
    title: 'Font exploration',
    href: '/fonts',
    section: 'brand-identity',
    status: 'experiment',
    description: 'Type pairing trials and availability checks.',
    source: 'src/pages/FontsPage.tsx',
  },
  {
    id: 'logo-options',
    title: 'Eyes Closed logo options',
    href: '/eyes-closed-logo-options',
    section: 'brand-identity',
    status: 'experiment',
    description: 'Logo variation review gallery.',
    source: 'src/pages/EyesClosedLogoOptionsPage.tsx',
  },
  {
    id: 'brand-kit-export',
    title: 'Brand kit export',
    href: '/brand-kit-export',
    section: 'brand-identity',
    status: 'reference',
    description: 'Brand kit download and export tools.',
    source: 'src/pages/BrandKitExportPage.tsx',
  },

  // Strategy & briefs
  {
    id: 'brief',
    title: 'Creative brief',
    href: '/brief',
    section: 'strategy',
    status: 'reference',
    description: 'Website strategy and creative brief (immersive dark).',
    source: 'src/pages/BriefPage.tsx',
  },
  {
    id: 'brief2',
    title: 'Brief 2.0',
    href: '/brief2',
    section: 'strategy',
    status: 'reference',
    description: 'Expanded brief presentation with quantum dust hero.',
    source: 'src/pages/BriefPage2.tsx',
  },
  {
    id: 'moodboard',
    title: 'Moodboard',
    href: '/moodboard',
    section: 'strategy',
    status: 'reference',
    description: 'Visual direction board for tone, texture, and reference imagery.',
    source: 'src/pages/MoodboardPage.tsx',
  },
  {
    id: 'design-framework',
    title: 'Design framework',
    href: '/design-framework',
    section: 'strategy',
    status: 'reference',
    description: 'Seed → vibration → geometry → manifestation process UI.',
    source: 'src/pages/DesignFrameworkPage.tsx',
  },
];

export const CLIENT_REVIEW_SECTION_ORDER = SECTION_ORDER;

export function clientReviewEntriesBySection(section: ClientReviewSectionId): ClientReviewEntry[] {
  return CLIENT_DESIGN_REVIEW_INDEX.filter((entry) => entry.section === section);
}
