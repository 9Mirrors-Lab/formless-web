import { useLayoutEffect } from 'react';
import { isPublicSiteRestricted } from './config/publicSite';
import { SiteAccessProvider } from './context/SiteAccessContext';
import { ContentProvider, useContentStatus } from './context/ContentContext';
import App from './App';
import DesignSystem from './DesignSystem';
import DesignFrameworkPage from './pages/DesignFrameworkPage';
import ShaderPage from './pages/ShaderPage';
import BriefPage from './pages/BriefPage';
import BriefPage2 from './pages/BriefPage2';
import MoodboardPage from './pages/MoodboardPage';
import IconsPage from './pages/IconsPage';
import WorkPage from './pages/WorkPage';
import BookPage from './pages/BookPage';
import SciencePage from './pages/SciencePage';
import AboutPage from './pages/AboutPage';
import ColorsPage from './pages/ColorsPage';
import EyesClosedLogoOptionsPage from './pages/EyesClosedLogoOptionsPage';
import { DevMenu } from './components/DevMenu';
import { PageLayout } from './components/PageLayout';
import { HomePageContent } from './components/HomePageContent';

const publicSiteRestricted = isPublicSiteRestricted();

function NormalizeToRoot({ path }: { path: string }) {
  useLayoutEffect(() => {
    const normalized = path.replace(/\/+$/, '') || '/';
    if (normalized !== '/') {
      window.history.replaceState(null, '', '/');
    }
  }, [path]);
  return null;
}

/** Same home as `App`; deep URLs become `/` when the site is restricted. */
function RestrictedPublicHome({ path }: { path: string }) {
  return (
    <>
      <NormalizeToRoot path={path} />
      <PageLayout>
        <HomePageContent />
      </PageLayout>
    </>
  );
}

export function Root({ path }: { path: string }) {
  const isWork = path === '/work';
  const isBook = path === '/book';
  const isScience = path === '/science';
  const isAbout = path === '/about';
  const isColors = path === '/colors';
  const isEyesClosedLogoOptions =
    path === '/eyes-closed-logo-options' ||
    path === '/design/eyes-closed-logo-variations/04-options.html';

  const isBrief = path === '/brief';
  const isBrief2 = path === '/brief2';
  const isMoodboard = path === '/moodboard';
  const isDesignSystem = path === '/design-system';
  const isShader = path === '/shader';
  const isDesignFramework = path === '/design-framework';
  const isIcons = path === '/icons';

  if (isWork) return <WorkPage />;
  if (isBook) return <BookPage />;
  if (isScience) return <SciencePage />;
  if (isAbout) return <AboutPage />;
  if (isColors) return <ColorsPage />;
  if (isEyesClosedLogoOptions) return <EyesClosedLogoOptionsPage />;

  if (isBrief) return <BriefPage />;
  if (isBrief2) return <BriefPage2 />;
  if (isMoodboard) return <MoodboardPage />;
  if (isDesignSystem) return <DesignSystem />;
  if (isShader) return <ShaderPage />;
  if (isDesignFramework) return <DesignFrameworkPage />;
  if (isIcons) return <IconsPage />;
  return <App />;
}

function AppContentShell({ path }: { path: string }) {
  const { status, errorMessage } = useContentStatus();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream font-sans text-sm tracking-wide text-charcoal">
        Loading…
      </div>
    );
  }

  if (status === 'misconfigured' || status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 text-center font-sans text-charcoal">
        <p className="font-serif text-xl italic">Content unavailable</p>
        <p className="max-w-md text-sm text-charcoal/70">{errorMessage}</p>
      </div>
    );
  }

  return (
    <>
      {publicSiteRestricted ? <RestrictedPublicHome path={path} /> : <Root path={path} />}
      <DevMenu />
    </>
  );
}

export function PublicShell({ path }: { path: string }) {
  return (
    <SiteAccessProvider value={{ restricted: publicSiteRestricted }}>
      <ContentProvider>
        <AppContentShell path={path} />
      </ContentProvider>
    </SiteAccessProvider>
  );
}
