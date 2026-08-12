import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { PostHogProvider } from './components/PostHogProvider';
import { PublicShell } from './PublicShell.tsx';
import { normalizePathname } from './lib/analyticsPaths';

const path = normalizePathname(window.location.pathname);
const canonicalUrl = `${path}${window.location.search}${window.location.hash}`;
const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
if (currentUrl !== canonicalUrl) {
  window.history.replaceState(null, '', canonicalUrl);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider>
      <PublicShell path={path} />
    </PostHogProvider>
  </StrictMode>,
);
