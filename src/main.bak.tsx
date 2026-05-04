import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import DesignSystem from './DesignSystem.tsx'
import DesignFrameworkPage from './pages/DesignFrameworkPage.tsx'
import ShaderPage from './pages/ShaderPage.tsx'
import BriefPage from './pages/BriefPage.tsx'
import MoodboardPage from './pages/MoodboardPage.tsx'

const rawPath = window.location.pathname.replace(/\/+$/, "") || "/"
const isBrief = rawPath === "/brief"
const isMoodboard = rawPath === "/moodboard"
const isDesignSystem = rawPath === "/design-system"
const isShader = rawPath === "/shader"
const isDesignFramework = rawPath === "/design-framework"

export function Root() {
  if (isBrief) return <BriefPage />
  if (isMoodboard) return <MoodboardPage />
  if (isDesignSystem) return <DesignSystem />
  if (isShader) return <ShaderPage />
  if (isDesignFramework) return <DesignFrameworkPage />
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
