export type SitePageCategory =
  | 'public'
  | 'legal'
  | 'auth'
  | 'design'
  | 'client'
  | 'redirect'
  | 'static'
  | 'build';

export type SitePageEntry = {
  id: string;
  title: string;
  path: string;
  category: SitePageCategory;
  description: string;
  source: string;
  /** When set, the list item links elsewhere (redirects, aliases). */
  href?: string;
  /** Hide from default grid when true (e.g. duplicate alias routes). */
  alias?: boolean;
};

export const SITE_PAGE_CATEGORIES: Record<
  SitePageCategory,
  { label: string; description: string }
> = {
  public: {
    label: 'Public site',
    description: 'Marketing and teaching pages in the live visitor journey.',
  },
  legal: {
    label: 'Legal',
    description: 'Privacy, terms, and disclaimer.',
  },
  auth: {
    label: 'Auth & account',
    description: 'Supabase member sign-in and account flows.',
  },
  design: {
    label: 'Design & experiments',
    description: 'Internal reference, explorations, and layout tests.',
  },
  client: {
    label: 'Client',
    description: 'Client-facing design review hub, archived previews, and update views.',
  },
  redirect: {
    label: 'Redirects & aliases',
    description: 'Legacy URLs that resolve to another route.',
  },
  static: {
    label: 'Static HTML (repo)',
    description: 'Standalone HTML files in docs/ and design/. Open from the repo or serve separately in dev.',
  },
  build: {
    label: 'Separate builds',
    description: 'Alternate Vite entry points and build outputs.',
  },
};

/** Canonical inventory of every page and artifact in formless-web. */
export const SITE_PAGE_INDEX: SitePageEntry[] = [
  // — Public —
  {
    id: 'home',
    title: 'Home',
    path: '/',
    category: 'public',
    description: 'Hero and curtain reveal teaching moment.',
    source: 'src/components/HomePageContent.tsx, src/App.tsx',
  },
  {
    id: 'work',
    title: 'The Practice',
    path: '/work',
    category: 'public',
    description: 'Practice page: life-domain accordion, reframe band, book CTA.',
    source: 'src/pages/WorkPage.tsx',
  },
  {
    id: 'work2',
    title: 'The Practice (alt)',
    path: '/work2',
    category: 'public',
    description: 'Alternate work page exploration.',
    source: 'src/pages/Work2Page.tsx',
  },
  {
    id: 'book',
    title: 'Formless (book)',
    path: '/book',
    category: 'public',
    description: 'Book doorway, themes, waitlist, pause/observe/recognize quotes.',
    source: 'src/pages/BookPage.tsx',
  },
  {
    id: 'science',
    title: 'Spirituality & Science',
    path: '/science',
    category: 'public',
    description: 'Science pillars and closing bridge back to practice and book.',
    source: 'src/pages/SciencePage.tsx',
  },
  {
    id: 'about',
    title: 'About',
    path: '/about',
    category: 'public',
    description: 'Author story, future offerings, Stay Close email.',
    source: 'src/pages/AboutPage.tsx',
  },
  {
    id: 'about-magazine',
    title: 'About (magazine layout)',
    path: '/about-magazine',
    category: 'public',
    description: 'About page using layout variant 4.',
    source: 'src/pages/AboutPage.tsx (defaultLayout={4})',
  },

  // — Legal —
  {
    id: 'privacy',
    title: 'Privacy',
    path: '/privacy',
    category: 'legal',
    description: 'Eyes Closed privacy policy.',
    source: 'src/pages/PrivacyPage.tsx',
  },
  {
    id: 'terms',
    title: 'Terms',
    path: '/terms',
    category: 'legal',
    description: 'Terms of use.',
    source: 'src/pages/TermsPage.tsx',
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer',
    path: '/disclaimer',
    category: 'legal',
    description: 'Educational content disclaimer.',
    source: 'src/pages/DisclaimerPage.tsx',
  },

  // — Auth —
  {
    id: 'login',
    title: 'Sign in',
    path: '/login',
    category: 'auth',
    description: 'Member login.',
    source: 'src/pages/LoginPage.tsx',
  },
  {
    id: 'signup',
    title: 'Sign up',
    path: '/signup',
    category: 'auth',
    description: 'Member registration.',
    source: 'src/pages/SignupPage.tsx',
  },
  {
    id: 'account',
    title: 'Account',
    path: '/account',
    category: 'auth',
    description: 'Signed-in account view.',
    source: 'src/pages/AccountPage.tsx',
  },
  {
    id: 'auth-callback',
    title: 'Auth callback',
    path: '/auth/callback',
    category: 'auth',
    description: 'Supabase OAuth redirect handler.',
    source: 'src/pages/AuthCallbackPage.tsx',
  },

  // — Design & experiments —
  {
    id: 'brand',
    title: 'Brand',
    path: '/brand',
    category: 'design',
    description: 'Owner desk: signups, Audible progress, and production materials.',
    source: 'src/pages/BrandPage.tsx',
  },
  {
    id: 'brand-signups',
    title: 'Signups',
    path: '/brand/signups',
    category: 'design',
    description: 'Brand Studio list of emails from the book waitlist, newsletter, and advance listen.',
    source: 'src/pages/BrandSignupsPage.tsx, src/lib/siteSignups.ts',
  },
  {
    id: 'brand-endorsements',
    title: 'Endorsements',
    path: '/brand/endorsements',
    category: 'design',
    description:
      'Formless reader letters, trimmed cuts, and pull quotes from the Google Doc, sorted by voice and theme.',
    source: 'src/pages/BrandEndorsementsPage.tsx, src/lib/endorsementDoc.ts',
  },
  {
    id: 'brand-schedule',
    title: 'Schedule',
    path: '/brand/schedule',
    category: 'design',
    description:
      'Launch communication runway: who does what, when, on which channel.',
    source:
      'src/pages/BrandSchedulePage.tsx, src/data/launchCommsSchedule.ts',
  },
  {
    id: 'brand-book-launch-campaign',
    title: 'Book launch campaign',
    path: '/brand/book-launch-campaign',
    category: 'design',
    description:
      'Formless runway before September 1 and teaching after: warm circle, waitlist, LinkedIn, and X.',
    source:
      'src/pages/BrandBookLaunchCampaignPage.tsx, src/data/bookLaunchCampaign.ts',
  },
  {
    id: 'speaker-sheet',
    title: 'Speaker sheet',
    path: '/speaker-sheet',
    category: 'design',
    description: 'Speaker one-sheet layout concepts A/B/C for venue and booking use.',
    source: 'src/pages/SpeakerSheetPage.tsx',
  },
  {
    id: 'zoom-backgrounds',
    title: 'Zoom backgrounds',
    path: '/zoom-backgrounds',
    category: 'design',
    description: 'Virtual Zoom backgrounds for podcasts, interviews, and sessions.',
    source: 'src/pages/ZoomBackgroundsPage.tsx',
  },
  {
    id: 'design-system',
    title: 'Design system',
    path: '/design-system',
    category: 'design',
    description:
      'Color, type, motion tokens, and teaching icons with stable ids for TeachingIconMark / Callout use.',
    source: 'src/DesignSystem.tsx, src/components/iconography/teachingIcons.tsx',
  },
  {
    id: 'components',
    title: 'Components',
    path: '/components',
    category: 'design',
    description: 'Visual component options: status callouts and related site patterns.',
    source: 'src/pages/ComponentsPage.tsx, src/components/ui/Callout.tsx',
  },
  {
    id: 'icons',
    title: 'Iconography',
    path: '/icons',
    category: 'design',
    description: 'Approved teaching marks with GSAP loops, light and dark previews.',
    source: 'src/pages/IconsPage.tsx',
  },
  {
    id: 'colors',
    title: 'Colors',
    path: '/colors',
    category: 'design',
    description: 'Dark theme explorations for supporting pages.',
    source: 'src/pages/ColorsPage.tsx',
  },
  {
    id: 'fonts',
    title: 'Fonts',
    path: '/fonts',
    category: 'design',
    description: 'Font exploration and availability checks.',
    source: 'src/pages/FontsPage.tsx',
  },
  {
    id: 'backgrounds',
    title: 'Backgrounds',
    path: '/backgrounds',
    category: 'design',
    description: 'Hero background picker and shader-backed options.',
    source: 'src/pages/BackgroundsPage.tsx',
  },
  {
    id: 'shader',
    title: 'Shader',
    path: '/shader',
    category: 'design',
    description: 'Shader experiments.',
    source: 'src/pages/ShaderPage.tsx',
  },
  {
    id: 'brief',
    title: 'Brief',
    path: '/brief',
    category: 'design',
    description: 'Website strategy and creative brief (immersive dark).',
    source: 'src/pages/BriefPage.tsx',
  },
  {
    id: 'brief2',
    title: 'Brief 2.0',
    path: '/brief2',
    category: 'design',
    description: 'Expanded brief presentation.',
    source: 'src/pages/BriefPage2.tsx',
  },
  {
    id: 'moodboard',
    title: 'Moodboard (SPA route)',
    path: '/moodboard',
    category: 'design',
    description: 'In-app moodboard route.',
    source: 'src/pages/MoodboardPage.tsx',
  },
  {
    id: 'layout-tests',
    title: 'Layout tests',
    path: '/layout-tests',
    category: 'design',
    description: 'Experimental homepage and layout playground.',
    source: 'src/pages/LayoutTestsPage.tsx',
  },
  {
    id: 'cosmic-concepts',
    title: 'Cosmic concepts (A–D)',
    path: '/cosmic-concepts',
    category: 'design',
    description:
      'Four cosmic home variants built from design-system icons and /science orbit language.',
    source: 'src/pages/CosmicConceptsPage.tsx',
  },
  {
    id: 'pattern-mirror',
    title: 'Pattern mirror',
    path: '/pattern-mirror',
    category: 'design',
    description: 'Pattern mirror teaching visual.',
    source: 'src/pages/PatternMirrorPage.tsx',
  },
  {
    id: 'audio-studio',
    title: 'Audiobook review · Studio',
    path: '/audio',
    category: 'design',
    description:
      'Studio compare for Formless chapter audio (Original vs Optimized, T toggle, read-along).',
    source: 'src/pages/AudioStudioPage.tsx',
  },
  {
    id: 'audio-editorial',
    title: 'Audiobook review · Editorial',
    path: '/audio/editorial',
    category: 'design',
    description:
      'Audible Master: Listen / Analysis / Master phases workspace for Formless chapter audio.',
    source: 'src/pages/AudioEditorialPage.tsx',
  },
  {
    id: 'audio-process',
    title: 'Audible process',
    path: '/audio/process',
    category: 'design',
    description:
      'ACX submit guide: track specs, cover art, ID3 tags, and the upload review path.',
    source: 'src/pages/AudibleProcessPage.tsx, public/audible-process.html',
  },
  {
    id: 'audio-record-sessions',
    title: 'Record Sessions',
    path: '/audio/record-sessions',
    category: 'design',
    description:
      'Author re-record scripts. Chapter 9 productivity punch.',
    source: 'src/pages/AudioRecordSessionsPage.tsx',
  },
  {
    id: 'audio-script-compare',
    title: 'Book vs audio',
    path: '/audio/script-compare',
    category: 'design',
    description:
      'Printed book text vs timed audio script, live word-level diff.',
    source: 'src/pages/AudioScriptComparePage.tsx',
  },
  {
    id: 'audio-editorial-2',
    title: 'Audiobook review · Studio ladder',
    path: '/audio/editorial2',
    category: 'design',
    description:
      'Studio ladder opens on master phases: six-phase log per track, no listen player.',
    source: 'src/pages/AudioEditorial2Page.tsx',
  },
  {
    id: 'audio-master-phases',
    title: 'Audiobook review · Master phases',
    path: '/audio/editorial?view=master-phases',
    category: 'design',
    description:
      'Per-track six-phase mastering log. Written after Phase 6; Ready for Final QC.',
    source: 'src/components/audio-review/MasterPhasesWorkspace.tsx',
  },
  {
    id: 'audio-advance-listen',
    title: 'Advance listen',
    path: '/advance-listen',
    category: 'design',
    description:
      'Standalone Formless listen world: optimized master, mobile now-playing, chapter drawer.',
    source: 'src/pages/AdvanceListenPage.tsx',
  },
  {
    id: 'audio-companion',
    title: 'Audiobook · Companion kit',
    path: '/audio/companion',
    category: 'design',
    description:
      'Audible companion page: Audacity setup, room tone, calibration, send take.',
    source: 'src/pages/AudioCompanionKitPage.tsx',
  },
  {
    id: 'audio-send-take',
    title: 'Audiobook · Send take',
    path: '/audio/send-take',
    category: 'design',
    description:
      'Mobile-first upload page for room tone + calibration takes, with live size and percent status.',
    source: 'src/pages/AudioSendTakePage.tsx',
  },
  {
    id: 'audio-files',
    title: 'Audiobook · Files',
    path: '/audio/files',
    category: 'design',
    description:
      'Admin table to list, download, status-update, and delete client session takes.',
    source: 'src/pages/AudioFilesPage.tsx',
  },
  {
    id: 'design-framework',
    title: 'Design framework',
    path: '/design-framework',
    category: 'design',
    description: 'Seed → vibration → geometry → manifestation process UI.',
    source: 'src/pages/DesignFrameworkPage.tsx',
  },
  {
    id: 'brand-kit-export',
    title: 'Brand kit export',
    path: '/brand-kit-export',
    category: 'design',
    description: 'Brand kit download and export tools.',
    source: 'src/pages/BrandKitExportPage.tsx',
  },
  {
    id: 'eyes-closed-logo-options',
    title: 'Eyes Closed logo options',
    path: '/eyes-closed-logo-options',
    category: 'design',
    description: 'Logo variation review.',
    source: 'src/pages/EyesClosedLogoOptionsPage.tsx',
  },

  // — Client —
  {
    id: 'client-design-review',
    title: 'Design review',
    path: '/client/review',
    category: 'client',
    description: 'Client hub for hero variants, layout tests, shaders, brand studies, and briefs.',
    source: 'src/pages/ClientDesignReviewPage.tsx, src/data/clientDesignReviewIndex.ts',
  },
  {
    id: 'client-review-hero-classic',
    title: 'Original home hero (archived)',
    path: '/client/review/hero-classic',
    category: 'client',
    description: 'Pre–layout-test hero lockup kept for side-by-side client comparison.',
    source: 'src/pages/ClientReviewHeroClassicPage.tsx, src/components/Hero.tsx',
  },
  {
    id: 'client-review-helix-lockup',
    title: 'Helix teaching lockup',
    path: '/client/review/helix-lockup',
    category: 'client',
    description:
      'Pause / Observe / Recognize double-helix lockup with Unwind, Trace, and Current motion options.',
    source:
      'src/pages/ClientReviewHelixLockupPage.tsx, src/components/HelixTeachingLockup.tsx',
  },
  {
    id: 'client-review-helix-dust',
    title: 'Helix dust study',
    path: '/client/review/helix-dust',
    category: 'client',
    description:
      'Dust-only helix study with three sunlit particle variations; teaching lockup removed.',
    source:
      'src/pages/ClientReviewHelixDustPage.tsx, src/components/HelixDustStudy.tsx',
  },
  {
    id: 'client-site-updates',
    title: 'Client site updates',
    path: '/client/site-updates',
    category: 'client',
    description: 'Client-facing site update log.',
    source: 'src/pages/ClientSiteUpdatesPage.tsx',
  },

  // — Redirects —
  {
    id: 'shader-ec',
    title: 'Shader EC (legacy)',
    path: '/shaderEC',
    category: 'redirect',
    description: 'Legacy backgrounds URL.',
    source: 'src/PublicShell.tsx',
    href: '/backgrounds',
  },
  {
    id: 'client-feedback-revision',
    title: 'Client feedback revision (legacy)',
    path: '/client-feedback-revision',
    category: 'redirect',
    description: 'Former revision preview URL.',
    source: 'src/PublicShell.tsx',
    href: '/layout-tests',
  },
  {
    id: 'logo-options-html',
    title: 'Logo options (HTML alias)',
    path: '/design/eyes-closed-logo-variations/04-options.html',
    category: 'redirect',
    description: 'Legacy static path mapped to React logo options page.',
    source: 'src/PublicShell.tsx',
    href: '/eyes-closed-logo-options',
    alias: true,
  },

  // — Static HTML in repo —
  {
    id: 'html-formless-hub',
    title: 'Eyes Closed project hub',
    path: 'docs/formless-hub.html',
    category: 'static',
    description: 'Static project hub document.',
    source: 'docs/formless-hub.html',
  },
  {
    id: 'html-project-brief',
    title: 'Formless project brief',
    path: 'docs/formless-project-brief.html',
    category: 'static',
    description: 'Static brief export.',
    source: 'docs/formless-project-brief.html',
  },
  {
    id: 'html-website-feedback',
    title: 'Website feedback',
    path: 'docs/notes/website-feedback.html',
    category: 'static',
    description: 'Feedback notes.',
    source: 'docs/notes/website-feedback.html',
  },
  {
    id: 'html-content-arch',
    title: 'Website content architecture guide',
    path: 'docs/website-content-arch-guide.html',
    category: 'static',
    description: 'Content architecture reference.',
    source: 'docs/website-content-arch-guide.html',
  },
  {
    id: 'html-roadmap-notes',
    title: 'Roadmap website notes',
    path: 'docs/roadmap-website-notes.html',
    category: 'static',
    description: 'Roadmap notes.',
    source: 'docs/roadmap-website-notes.html',
  },
  {
    id: 'html-publishing-channels',
    title: 'Publishing channels',
    path: 'docs/publishing-channels.html',
    category: 'static',
    description: 'Publishing channel notes.',
    source: 'docs/publishing-channels.html',
  },
  {
    id: 'html-publishing-savings',
    title: 'Publishing in-house savings',
    path: 'docs/publishing-in-house-savings.html',
    category: 'static',
    description: 'In-house publishing savings analysis.',
    source: 'docs/publishing-in-house-savings.html',
  },
  {
    id: 'html-publishing-roadmap',
    title: 'Publishing roadmap notes',
    path: 'docs/publishing-roadmap-notes.html',
    category: 'static',
    description: 'Publishing roadmap.',
    source: 'docs/publishing-roadmap-notes.html',
  },
  {
    id: 'html-substack',
    title: 'Substack approach',
    path: 'docs/substack-approach.html',
    category: 'static',
    description: 'Substack strategy notes.',
    source: 'docs/substack-approach.html',
  },
  {
    id: 'html-adr-supabase',
    title: 'ADR: Supabase content',
    path: 'docs/adr/001-supabase-content-and-nextjs.html',
    category: 'static',
    description: 'Architecture decision record.',
    source: 'docs/adr/001-supabase-content-and-nextjs.html',
  },
  {
    id: 'html-about-layouts',
    title: 'About page layouts',
    path: 'design/About Page Layouts.html',
    category: 'static',
    description: 'About layout explorations.',
    source: 'design/About Page Layouts.html',
  },
  {
    id: 'html-science-v2',
    title: 'Science page v2 (standalone)',
    path: 'design/Science page v2 _standalone.html',
    category: 'static',
    description: 'Standalone science page mock.',
    source: 'design/Science page v2 _standalone.html',
  },
  {
    id: 'html-logo-index',
    title: 'Logo variations index',
    path: 'design/eyes-closed-logo-variations/index.html',
    category: 'static',
    description: 'Logo variation gallery (static).',
    source: 'design/eyes-closed-logo-variations/index.html',
  },
  {
    id: 'html-logo-options',
    title: 'Logo options (static)',
    path: 'design/eyes-closed-logo-variations/04-options.html',
    category: 'static',
    description: 'Static logo options page (also routed in SPA).',
    source: 'design/eyes-closed-logo-variations/04-options.html',
  },
  {
    id: 'html-proposal-idea',
    title: 'Proposal idea capture',
    path: 'design/proposal/idea-capture.html',
    category: 'static',
    description: 'Proposal capture artifact.',
    source: 'design/proposal/idea-capture.html',
  },

  // — Separate builds —
  {
    id: 'moodboard-entry',
    title: 'Moodboard (separate entry)',
    path: 'moodboard.html',
    category: 'build',
    description: 'Alternate Vite entry; run npm run build:moodboard → dist-moodboard/.',
    source: 'moodboard.html, src/moodboard-entry.tsx, vite.moodboard.config.ts',
  },
];

export function sitePagesByCategory(category: SitePageCategory): SitePageEntry[] {
  return SITE_PAGE_INDEX.filter((entry) => entry.category === category);
}

export function isSpaRoute(path: string): boolean {
  return path.startsWith('/');
}

/** Dev-only URL for static HTML under docs/ or design/. */
export function staticRepoHref(repoPath: string): string | undefined {
  if (repoPath.startsWith('docs/')) {
    return `/repo-docs/${repoPath.slice('docs/'.length)}`;
  }
  if (repoPath.startsWith('design/')) {
    return `/repo-design/${repoPath.slice('design/'.length)}`;
  }
  return undefined;
}
