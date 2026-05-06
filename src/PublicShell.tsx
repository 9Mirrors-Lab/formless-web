import { ContentProvider, useContentStatus } from './context/ContentContext.tsx'
import App from './App.tsx'
import DesignSystem from './DesignSystem.tsx'
import DesignFrameworkPage from './pages/DesignFrameworkPage.tsx'
import ShaderPage from './pages/ShaderPage.tsx'
import BriefPage from './pages/BriefPage.tsx'
import BriefPage2 from './pages/BriefPage2.tsx'
import MoodboardPage from './pages/MoodboardPage.tsx'
import IconsPage from './pages/IconsPage.tsx'
import WorkPage from './pages/WorkPage.tsx'
import BookPage from './pages/BookPage.tsx'
import SciencePage from './pages/SciencePage.tsx'
import AboutPage from './pages/AboutPage.tsx'
import ColorsPage from './pages/ColorsPage.tsx'
import { DevMenu } from './components/DevMenu.tsx'

export function Root({ path }: { path: string }) {
  const isWork = path === '/work'
  const isBook = path === '/book'
  const isScience = path === '/science'
  const isAbout = path === '/about'
  const isColors = path === '/colors'

  const isBrief = path === '/brief'
  const isBrief2 = path === '/brief2'
  const isMoodboard = path === '/moodboard'
  const isDesignSystem = path === '/design-system'
  const isShader = path === '/shader'
  const isDesignFramework = path === '/design-framework'
  const isIcons = path === '/icons'

  if (isWork) return <WorkPage />
  if (isBook) return <BookPage />
  if (isScience) return <SciencePage />
  if (isAbout) return <AboutPage />
  if (isColors) return <ColorsPage />

  if (isBrief) return <BriefPage />
  if (isBrief2) return <BriefPage2 />
  if (isMoodboard) return <MoodboardPage />
  if (isDesignSystem) return <DesignSystem />
  if (isShader) return <ShaderPage />
  if (isDesignFramework) return <DesignFrameworkPage />
  if (isIcons) return <IconsPage />
  return <App />
}

function AppContentShell({ path }: { path: string }) {
  const { status, errorMessage } = useContentStatus()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream font-sans text-sm tracking-wide text-charcoal">
        Loading…
      </div>
    )
  }

  if (status === 'misconfigured' || status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 text-center font-sans text-charcoal">
        <p className="font-serif text-xl italic">Content unavailable</p>
        <p className="max-w-md text-sm text-charcoal/70">{errorMessage}</p>
      </div>
    )
  }

  return (
    <>
      <Root path={path} />
      <DevMenu />
    </>
  )
}

export function PublicShell({ path }: { path: string }) {
  return (
    <ContentProvider>
      <AppContentShell path={path} />
    </ContentProvider>
  )
}
