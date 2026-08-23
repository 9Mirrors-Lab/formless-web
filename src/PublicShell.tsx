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
import BrandSignupsPage from './pages/BrandSignupsPage';
import BrandEndorsementsPage from './pages/BrandEndorsementsPage';
import BrandBookLaunchCampaignPage from './pages/BrandBookLaunchCampaignPage';
import BrandSchedulePage from './pages/BrandSchedulePage';
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
import AudioStudioPage from './pages/AudioStudioPage';
import AudioEditorialPage from './pages/AudioEditorialPage';
import AudioEditorial2Page from './pages/AudioEditorial2Page';
import AudibleProcessPage from './pages/AudibleProcessPage';
import AudioRecordSessionsPage from './pages/AudioRecordSessionsPage';
import AudioScriptComparePage from './pages/AudioScriptComparePage';
import AdvanceListenPage from './pages/AdvanceListenPage';
import PreorderLandingPage from './pages/PreorderLandingPage';
import AudioCompanionKitPage from './pages/AudioCompanionKitPage';
import AudioSendTakePage from './pages/AudioSendTakePage';
import AudioFilesPage from './pages/AudioFilesPage';
import DesignLabPage from './pages/DesignLabPage';
import { applyClientFeedbackRevision } from './data/clientFeedbackRevisionContent';
import { isDesignLabPath } from './data/designLabCatalog';
import { DesignLabPicker } from './components/design-lab/DesignLabPicker';
import { PostHogPageView } from './components/PostHogPageView';
import { DevMenu } from './components/DevMenu';
import { PageLayout } from './components/PageLayout';
import { HomePageContent } from './components/HomePageContent';
import { RequireAdvanceListenEmail } from './components/RequireAdvanceListenEmail';
import { RequireInternalAuth } from './components/RequireInternalAuth';
import { isAdvanceListenPath, isInternalAuthPath } from './config/internalAccess';
import { isPreorderPath, preorderAudienceFromPath } from './config/preorderAccess';
import { hasAuthCallbackCode } from './lib/auth';

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
  const isBrandSignups = path === '/brand/signups';
  const isBrandEndorsements = path === '/brand/endorsements';
  const isBrandBookLaunch = path === '/brand/book-launch-campaign';
  const isBrandSchedule = path === '/brand/schedule';
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
  const isAudioEditorial2 = path === '/audio/editorial2';
  const isAudibleProcess = path === '/audio/process';
  const isAudioRecordSessions = path === '/audio/record-sessions';
  const isAudioScriptCompare = path === '/audio/script-compare';
  const isAudioAdvanceListen = path === '/advance-listen';
  const isAudioEditorialV2Legacy = path === '/audio/editorial-v2';
  const isAudioCompanion = path === '/audio/companion';
  const isAudioSendTake = path === '/audio/send-take';
  const isAudioFiles = path === '/audio/files';

  const isBrief = path === '/brief';
  const isBrief2 = path === '/brief2';
  const isMoodboard = path === '/moodboard';
  const isDesignSystem = path === '/design-system';
  const isDesignLab = path === '/design-lab';
  const isShader = path === '/shader';
  const isBackgrounds = path === '/backgrounds' || path === '/shaderEC';
  const isDesignFramework = path === '/design-framework';
  const isIcons = path === '/icons';
  const isHub = path === '/hub';
  const preorderAudience = preorderAudienceFromPath(path);

  if (preorderAudience) return <PreorderLandingPage audience={preorderAudience} />;

  if (isDesignLab) return <DesignLabPage />;
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
  if (isBrandSignups) return <BrandSignupsPage />;
  if (isBrandEndorsements) return <BrandEndorsementsPage />;
  if (isBrandBookLaunch) return <BrandBookLaunchCampaignPage />;
  if (isBrandSchedule) return <BrandSchedulePage />;
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
  if (isAudioStudio) return <AudioStudioPage />;
  if (isAudioEditorial) return <AudioEditorialPage />;
  if (isAudioEditorial2) return <AudioEditorial2Page />;
  if (isAudibleProcess) return <AudibleProcessPage />;
  if (isAudioRecordSessions) return <AudioRecordSessionsPage />;
  if (isAudioScriptCompare) return <AudioScriptComparePage />;
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
    path === '/brand/signups' ||
    path === '/brand/endorsements' ||
    path === '/brand/book-launch-campaign' ||
    path === '/brand/schedule' ||
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
    path === '/design-lab' ||
    path.startsWith('/design/') ||
    path === '/audio' ||
    path === '/audio/editorial' ||
    path === '/audio/editorial2' ||
    path === '/audio/process' ||
    path === '/audio/record-sessions' ||
    path === '/audio/script-compare' ||
    path === '/advance-listen' ||
    path === '/audio/editorial-v2' ||
    path === '/audio/companion' ||
    path === '/audio/send-take' ||
    path === '/audio/files' ||
    path === '/special-preview' ||
    path === '/preorder' ||
    path === '/preorder/stay-close'
  );
}

function AppContentShell({ path }: { path: string }) {
  const { status, errorMessage } = useContentStatus();
  const page = <Root path={path} />;

  // Must not wait on CMS content: Google OAuth is a full-page return, and
  // AuthCallbackPage is built without Navbar/Footer (those call useContent).
  if (path === '/auth/callback' || hasAuthCallbackCode(window.location.search)) {
    return <AuthCallbackPage />;
  }

  if (isAdvanceListenPath(path)) {
    return (
      <>
        <RequireAdvanceListenEmail>{page}</RequireAdvanceListenEmail>
        <DevMenu path={path} />
      </>
    );
  }

  if (isPreorderPath(path)) {
    return (
      <>
        {page}
        <DevMenu path={path} />
      </>
    );
  }

  if (isInternalAuthPath(path)) {
    return (
      <>
        <RequireInternalAuth
          gate="internal"
          allowBypass={path !== '/brand/signups'}
        >
          {page}
        </RequireInternalAuth>
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
      {isDesignLabPath(path) ? <DesignLabPicker /> : null}
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
