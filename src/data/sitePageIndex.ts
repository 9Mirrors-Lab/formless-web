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
    description: 'Client-facing review and update views.',
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
    id: 'design-system',
    title: 'Design system',
    path: '/design-system',
    category: 'design',
    description: 'Color, type, motion tokens and icon animation registry.',
    source: 'src/DesignSystem.tsx',
  },
  {
    id: 'icons',
    title: 'Iconography',
    path: '/icons',
    category: 'design',
    description: 'All teaching marks with GSAP loops, light and dark previews.',
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
    id: 'pattern-mirror',
    title: 'Pattern mirror',
    path: '/pattern-mirror',
    category: 'design',
    description: 'Pattern mirror teaching visual.',
    source: 'src/pages/PatternMirrorPage.tsx',
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
