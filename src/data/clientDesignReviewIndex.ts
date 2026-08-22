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
  {
    id: 'cosmic-concepts',
    title: 'Cosmic design-system heroes (A–D)',
    href: '/cosmic-concepts',
    section: 'hero-home',
    status: 'experiment',
    description:
      'Four radical home directions: annotated observatory, icon constellation, pillar index, nucleus witness. Uses /science orbits and /icons teaching marks.',
    source: 'src/pages/CosmicConceptsPage.tsx',
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
    id: 'design-lab',
    title: 'Design Lab',
    href: '/design-lab',
    section: 'layout-pages',
    status: 'experiment',
    description: 'Client direction room: curated layout, science, and atmosphere studies in one place.',
    source: 'src/pages/DesignLabPage.tsx',
  },
  {
    id: 'about-layouts',
    title: 'About · layout studies',
    href: '/design/about-page-layouts.html',
    section: 'layout-pages',
    status: 'experiment',
    description: 'Editorial split, portrait hero, manifesto, magazine. Four quiet compositions.',
    source: 'public/design/about-page-layouts.html',
  },
  {
    id: 'science-directions',
    title: 'Science · dark directions',
    href: '/design/science-page-v2-directions.html',
    section: 'layout-pages',
    status: 'experiment',
    description: 'Vault, Atelier, Observatory Press. First exploration beyond the ordinary science page.',
    source: 'public/design/science-page-v2-directions.html',
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
    id: 'audio-editorial',
    title: 'Audiobook review · Editorial',
    href: '/audio/editorial',
    section: 'layout-pages',
    status: 'experiment',
    description:
      'Audible Master: listen compare, analysis, and master-phase track records for Formless chapter audio.',
    source: 'src/pages/AudioEditorialPage.tsx',
  },
  {
    id: 'audio-process',
    title: 'Audible process',
    href: '/audio/process',
    section: 'layout-pages',
    status: 'experiment',
    description:
      'What ACX needs to submit: chapter masters, cover art, ID3 tags, and review gates.',
    source: 'src/pages/AudibleProcessPage.tsx, public/audible-process.html',
  },
  {
    id: 'audio-record-sessions',
    title: 'Record Sessions',
    href: '/audio/record-sessions',
    section: 'layout-pages',
    status: 'experiment',
    description:
      'Author re-record scripts. Chapter 9 productivity punch.',
    source: 'src/pages/AudioRecordSessionsPage.tsx',
  },
  {
    id: 'audio-editorial-2',
    title: 'Audiobook review · Studio ladder',
    href: '/audio/editorial2',
    section: 'layout-pages',
    status: 'experiment',
    description:
      'Studio ladder opens on master phases: six-phase log per track, no listen player.',
    source: 'src/pages/AudioEditorial2Page.tsx',
  },
  {
    id: 'audio-master-phases',
    title: 'Audiobook review · Master phases',
    href: '/audio/editorial?view=master-phases',
    section: 'layout-pages',
    status: 'experiment',
    description:
      'Six-phase mastering log per track. Stops at Ready for Final QC.',
    source: 'src/components/audio-review/MasterPhasesWorkspace.tsx',
  },
  {
    id: 'audio-advance-listen',
    title: 'Advance listen',
    href: '/advance-listen',
    section: 'layout-pages',
    status: 'experiment',
    description:
      'Standalone Formless listen: optimized master, mobile now-playing, chapter drawer.',
    source: 'src/pages/AdvanceListenPage.tsx',
  },
  {
    id: 'audio-companion',
    title: 'Audiobook · Companion',
    href: '/audio/companion',
    section: 'layout-pages',
    status: 'experiment',
    description:
      'Audible companion page: setup, room tone, calibration passage, send take.',
    source: 'src/pages/AudioCompanionKitPage.tsx',
  },
  {
    id: 'audio-send-take',
    title: 'Audiobook · Send take',
    href: '/audio/send-take',
    section: 'layout-pages',
    status: 'experiment',
    description:
      'Phone-first send page: choose audio or Audacity .aup3, animated upload status, live bytes and percent.',
    source: 'src/pages/AudioSendTakePage.tsx',
  },
  {
    id: 'audio-files',
    title: 'Audiobook · Files',
    href: '/audio/files',
    section: 'layout-pages',
    status: 'experiment',
    description:
      'Admin file table: download client takes, update review status, delete rows and storage objects.',
    source: 'src/pages/AudioFilesPage.tsx',
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
    status: 'promoted',
    description:
      'Approved teaching marks with GSAP loops, light and dark previews. Same set in /design-system foundations.',
    source: 'src/pages/IconsPage.tsx, src/components/iconography/',
  },
  {
    id: 'helix-lockup',
    title: 'Helix teaching lockup',
    href: '/client/review/helix-lockup',
    section: 'motion-shaders',
    status: 'promoted',
    description:
      'Approved Trace helix for /book mobile. Marks above each word; recognize = solid · vertical dash · hollow.',
    source:
      'src/components/HelixTeachingLockup.tsx, src/pages/BookPage.tsx',
  },
  {
    id: 'helix-dust',
    title: 'Helix dust study',
    href: '/client/review/helix-dust',
    section: 'motion-shaders',
    status: 'experiment',
    description:
      'Animation-only dust helix. Three sunlit-mote variations (Sunshaft, Volume, Catchlight). No teaching copy.',
    source:
      'src/components/HelixDustStudy.tsx, src/pages/ClientReviewHelixDustPage.tsx',
  },

  // Brand & identity
  {
    id: 'brand',
    title: 'Brand page',
    href: '/brand',
    section: 'brand-identity',
    status: 'live',
    description: 'Owner desk: signups, Audible progress, and production materials.',
    source: 'src/pages/BrandPage.tsx',
  },
  {
    id: 'brand-signups',
    title: 'Signups',
    href: '/brand/signups',
    section: 'brand-identity',
    status: 'live',
    description: 'Collected emails from the book waitlist, newsletter, and advance listen accounts.',
    source: 'src/pages/BrandSignupsPage.tsx',
  },
  {
    id: 'brand-endorsements',
    title: 'Endorsements',
    href: '/brand/endorsements',
    section: 'brand-identity',
    status: 'live',
    description:
      'Formless reader letters with full, trimmed, and pull cuts, grouped by voice and theme.',
    source: 'src/pages/BrandEndorsementsPage.tsx',
  },
  {
    id: 'brand-schedule',
    title: 'Schedule',
    href: '/brand/schedule',
    section: 'brand-identity',
    status: 'live',
    description:
      'Launch communication runway by person, date, and channel.',
    source: 'src/pages/BrandSchedulePage.tsx',
  },
  {
    id: 'brand-book-launch-campaign',
    title: 'Book launch campaign',
    href: '/brand/book-launch-campaign',
    section: 'brand-identity',
    status: 'live',
    description:
      'Formless runway before September 1 and teaching after: warm circle, waitlist, LinkedIn, and X.',
    source: 'src/pages/BrandBookLaunchCampaignPage.tsx',
  },
  {
    id: 'speaker-sheet',
    title: 'Speaker sheet',
    href: '/speaker-sheet',
    section: 'brand-identity',
    status: 'experiment',
    description: 'Speaker one-sheet concepts A/B/C with full-size preview.',
    source: 'src/pages/SpeakerSheetPage.tsx',
  },
  {
    id: 'zoom-backgrounds',
    title: 'Zoom backgrounds',
    href: '/zoom-backgrounds',
    section: 'brand-identity',
    status: 'experiment',
    description: 'Four 16:9 virtual backgrounds for podcasts, interviews, and sessions.',
    source: 'src/pages/ZoomBackgroundsPage.tsx',
  },
  {
    id: 'design-system',
    title: 'Design system',
    href: '/design-system',
    section: 'brand-identity',
    status: 'reference',
    description: 'Color, type, motion tokens, and approved teaching-icon registry.',
    source: 'src/DesignSystem.tsx',
  },
  {
    id: 'components',
    title: 'Components (callouts)',
    href: '/components',
    section: 'brand-identity',
    status: 'promoted',
    description:
      'Status callout variants and anti-patterns. Editorial rule is live on /book; pills reserved for nav/controls.',
    source: 'src/pages/ComponentsPage.tsx, src/components/ui/Callout.tsx',
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
