import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
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

const rawPath = window.location.pathname.replace(/\/+$/, "") || "/"

// Main site pages
const isWork = rawPath === "/work"
const isBook = rawPath === "/book"
const isScience = rawPath === "/science"
const isAbout = rawPath === "/about"
const isColors = rawPath === "/colors"

// Dev/reference pages
const isBrief = rawPath === "/brief"
const isBrief2 = rawPath === "/brief2"
const isMoodboard = rawPath === "/moodboard"
const isDesignSystem = rawPath === "/design-system"
const isShader = rawPath === "/shader"
const isDesignFramework = rawPath === "/design-framework"
const isIcons = rawPath === "/icons"

export function Root() {
  // Main site pages
  if (isWork) return <WorkPage />
  if (isBook) return <BookPage />
  if (isScience) return <SciencePage />
  if (isAbout) return <AboutPage />
  if (isColors) return <ColorsPage />

  // Dev/reference pages
  if (isBrief) return <BriefPage />
  if (isBrief2) return <BriefPage2 />
  if (isMoodboard) return <MoodboardPage />
  if (isDesignSystem) return <DesignSystem />
  if (isShader) return <ShaderPage />
  if (isDesignFramework) return <DesignFrameworkPage />
  if (isIcons) return <IconsPage />
  return <App />
}

function AppShell() {
  const { status, errorMessage } = useContentStatus()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-charcoal font-sans text-sm tracking-wide">
        Loading…
      </div>
    )
  }

  if (status === 'misconfigured' || status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-cream text-charcoal font-sans px-6 text-center">
        <p className="font-serif italic text-xl">Content unavailable</p>
        <p className="text-sm text-charcoal/70 max-w-md">{errorMessage}</p>
      </div>
    )
  }

  return (
    <>
      <Root />
      <DevMenu />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContentProvider>
      <AppShell />
    </ContentProvider>
  </StrictMode>,
)
