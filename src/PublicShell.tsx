import { useLayoutEffect } from 'react';
import { isPublicSiteRestricted } from './config/publicSite';
import { AuthProvider } from './context/AuthContext';
import { SiteAccessProvider } from './context/SiteAccessContext';
import { ContentProvider, useContentStatus } from './context/ContentContext';
import App from './App';
import DesignSystem from './DesignSystem';
import DesignFrameworkPage from './pages/DesignFrameworkPage';
import ShaderPage from './pages/ShaderPage';
import BackgroundsPage from './pages/BackgroundsPage';
import BriefPage from './pages/BriefPage';
import BriefPage2 from './pages/BriefPage2';
import MoodboardPage from './pages/MoodboardPage';
import IconsPage from './pages/IconsPage';
import WorkPage from './pages/WorkPage';
import Work2Page from './pages/Work2Page';
import BookPage from './pages/BookPage';
import SciencePage from './pages/SciencePage';
import AboutPage from './pages/AboutPage';
import ColorsPage from './pages/ColorsPage';
import FontsPage from './pages/FontsPage';
import ComponentsPage from './pages/ComponentsPage';
import EyesClosedLogoOptionsPage from './pages/EyesClosedLogoOptionsPage';
import BrandKitExportPage from './pages/BrandKitExportPage';
import BrandPage from './pages/BrandPage';
import SpeakerSheetPage from './pages/SpeakerSheetPage';
import ZoomBackgroundsPage from './pages/ZoomBackgroundsPage';
import LayoutTestsPage from './pages/LayoutTestsPage';
import CosmicConceptsPage from './pages/CosmicConceptsPage';
import PatternMirrorPage from './pages/PatternMirrorPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AccountPage } from './pages/AccountPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import ClientSiteUpdatesPage from './pages/ClientSiteUpdatesPage';
import ClientDesignReviewPage from './pages/ClientDesignReviewPage';
import ClientReviewHeroClassicPage from './pages/ClientReviewHeroClassicPage';
import ClientReviewHelixLockupPage from './pages/ClientReviewHelixLockupPage';
import ClientReviewHelixDustPage from './pages/ClientReviewHelixDustPage';
import SiteHubPage from './pages/SiteHubPage';
import AudioStudioMockupPage from './pages/AudioStudioMockupPage';
import AudioEditorialMockupPage from './pages/AudioEditorialMockupPage';
import AdvanceListenPage from './pages/AdvanceListenPage';
import AudioCompanionKitPage from './pages/AudioCompanionKitPage';
import AudioSendTakePage from './pages/AudioSendTakePage';
import AudioFilesPage from './pages/AudioFilesPage';
import { applyClientFeedbackRevision } from './data/clientFeedbackRevisionContent';
import { PostHogPageView } from './components/PostHogPageView';
import { DevMenu } from './components/DevMenu';
import { PageLayout } from './components/PageLayout';
import { HomePageContent } from './components/HomePageContent';
import { RequireInternalAuth } from './components/RequireInternalAuth';
import { isInternalAuthPath } from './config/internalAccess';

const publicSiteRestricted = isPublicSiteRestricted();

function BackgroundsLegacyRedirect() {
  useLayoutEffect(() => {
    const url = new URL(window.location.href);
    url.pathname = '/backgrounds';
    window.location.replace(`${url.pathname}${url.search}${url.hash}`);
  }, []);
  return null;
}

function EditorialV2LegacyRedirect() {
  useLayoutEffect(() => {
    window.location.replace('/advance-listen');
  }, []);
  return null;
}

function LegacyLayoutTestsRedirect() {
  useLayoutEffect(() => {
    window.location.replace('/layout-tests');
  }, []);
  return null;
}

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
      <PageLayout dark>
        <HomePageContent />
      </PageLayout>
    </>
  );
}

export function Root({ path }: { path: string }) {
  const isWork = path === '/work';
  const isWork2 = path === '/work2';
  const isBook = path === '/book';
  const isScience = path === '/science';
  const isAbout = path === '/about';
  const isColors = path === '/colors';
  const isFonts = path === '/fonts';
  const isComponents = path === '/components';
  const isAboutMagazine = path === '/about-magazine';
  const isEyesClosedLogoOptions =
    path === '/eyes-closed-logo-options' ||
    path === '/design/eyes-closed-logo-variations/04-options.html';
  const isBrandKitExport = path === '/brand-kit-export';
  const isBrand = path === '/brand';
  const isSpeakerSheet = path === '/speaker-sheet';
  const isZoomBackgrounds = path === '/zoom-backgrounds';
  const isLayoutTests = path === '/layout-tests';
  const isCosmicConcepts = path === '/cosmic-concepts';
  const isPatternMirror = path === '/pattern-mirror';
  const isPrivacy = path === '/privacy';
  const isTerms = path === '/terms';
  const isDisclaimer = path === '/disclaimer';
  const isLogin = path === '/login';
  const isSignup = path === '/signup';
  const isAccount = path === '/account';
  const isAuthCallback = path === '/auth/callback';
  const isClientSiteUpdates = path === '/client/site-updates';
  const isClientDesignReview = path === '/client/review';
  const isClientReviewHeroClassic = path === '/client/review/hero-classic';
  const isClientReviewHelixLockup = path === '/client/review/helix-lockup';
  const isClientReviewHelixDust = path === '/client/review/helix-dust';
  const isAudioStudio = path === '/audio';
  const isAudioEditorial = path === '/audio/editorial';
  const isAudioAdvanceListen = path === '/advance-listen';
  const isAudioEditorialV2Legacy = path === '/audio/editorial-v2';
  const isAudioCompanion = path === '/audio/companion';
  const isAudioSendTake = path === '/audio/send-take';
  const isAudioFiles = path === '/audio/files';

  const isBrief = path === '/brief';
  const isBrief2 = path === '/brief2';
  const isMoodboard = path === '/moodboard';
  const isDesignSystem = path === '/design-system';
  const isShader = path === '/shader';
  const isBackgrounds = path === '/backgrounds' || path === '/shaderEC';
  const isDesignFramework = path === '/design-framework';
  const isIcons = path === '/icons';
  const isHub = path === '/hub';

  if (isWork) return <WorkPage />;
  if (isWork2) return <Work2Page />;
  if (isBook) return <BookPage />;
  if (isScience) return <SciencePage />;
  if (isAbout) return <AboutPage />;
  if (isAboutMagazine) return <AboutPage defaultLayout={4} />;
  if (isColors) return <ColorsPage />;
  if (isFonts) return <FontsPage />;
  if (isComponents) return <ComponentsPage />;
  if (isEyesClosedLogoOptions) return <EyesClosedLogoOptionsPage />;
  if (isBrandKitExport) return <BrandKitExportPage />;
  if (isBrand) return <BrandPage />;
  if (isSpeakerSheet) return <SpeakerSheetPage />;
  if (isZoomBackgrounds) return <ZoomBackgroundsPage />;
  if (isLayoutTests) return <LayoutTestsPage />;
  if (isCosmicConcepts) return <CosmicConceptsPage />;
  if (isPatternMirror) return <PatternMirrorPage />;
  if (isPrivacy) return <PrivacyPage />;
  if (isTerms) return <TermsPage />;
  if (isDisclaimer) return <DisclaimerPage />;
  if (isLogin) return <LoginPage />;
  if (isSignup) return <SignupPage />;
  if (isAccount) return <AccountPage />;
  if (isAuthCallback) return <AuthCallbackPage />;
  if (isClientSiteUpdates) return <ClientSiteUpdatesPage />;
  if (isClientDesignReview) return <ClientDesignReviewPage />;
  if (isClientReviewHeroClassic) return <ClientReviewHeroClassicPage />;
  if (isClientReviewHelixLockup) return <ClientReviewHelixLockupPage />;
  if (isClientReviewHelixDust) return <ClientReviewHelixDustPage />;
  if (isAudioStudio) return <AudioStudioMockupPage />;
  if (isAudioEditorial) return <AudioEditorialMockupPage />;
  if (isAudioAdvanceListen) return <AdvanceListenPage />;
  if (isAudioEditorialV2Legacy) return <EditorialV2LegacyRedirect />;
  if (isAudioCompanion) return <AudioCompanionKitPage />;
  if (isAudioSendTake) return <AudioSendTakePage />;
  if (isAudioFiles) return <AudioFilesPage />;

  if (isBrief) return <BriefPage />;
  if (isBrief2) return <BriefPage2 />;
  if (isMoodboard) return <MoodboardPage />;
  if (isDesignSystem) return <DesignSystem />;
  if (isShader) return <ShaderPage />;
  if (isBackgrounds) {
    if (path === '/shaderEC') {
      return <BackgroundsLegacyRedirect />;
    }
    return <BackgroundsPage />;
  }
  if (isDesignFramework) return <DesignFrameworkPage />;
  if (isIcons) return <IconsPage />;
  if (isHub) return <SiteHubPage />;
  return <App />;
}

function isUnrestrictedPath(path: string): boolean {
  return (
    path === '/hub' ||
    path === '/brand' ||
    path === '/speaker-sheet' ||
    path === '/zoom-backgrounds' ||
    path === '/brand-kit-export' ||
    path === '/eyes-closed-logo-options' ||
    path === '/design/eyes-closed-logo-variations/04-options.html' ||
    path === '/login' ||
    path === '/signup' ||
    path === '/account' ||
    path === '/auth/callback' ||
    path === '/client/site-updates' ||
    path === '/client/review' ||
    path.startsWith('/client/review/') ||
    path === '/audio' ||
    path === '/audio/editorial' ||
    path === '/advance-listen' ||
    path === '/audio/editorial-v2' ||
    path === '/audio/companion' ||
    path === '/audio/send-take' ||
    path === '/audio/files'
  );
}

function AppContentShell({ path }: { path: string }) {
  const { status, errorMessage } = useContentStatus();
  const page = <Root path={path} />;

  if (isInternalAuthPath(path)) {
    return (
      <>
        <RequireInternalAuth>{page}</RequireInternalAuth>
        <DevMenu path={path} />
      </>
    );
  }

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
      {publicSiteRestricted && !isUnrestrictedPath(path) ? (
        <RestrictedPublicHome path={path} />
      ) : (
        page
      )}
      <DevMenu path={path} />
    </>
  );
}

export function PublicShell({ path }: { path: string }) {
  const normalizedPath = path.replace(/\/+$/, '').toLowerCase() || '/';

  if (normalizedPath === '/client-feedback-revision') {
    return <LegacyLayoutTestsRedirect />;
  }

  return (
    <SiteAccessProvider value={{ restricted: publicSiteRestricted }}>
      <AuthProvider>
        <ContentProvider transformTree={applyClientFeedbackRevision}>
          <PostHogPageView />
          <AppContentShell path={normalizedPath} />
        </ContentProvider>
      </AuthProvider>
    </SiteAccessProvider>
  );
}
