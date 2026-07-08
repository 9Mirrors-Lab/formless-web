import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { PostHogProvider } from './components/PostHogProvider';
import { PublicShell } from './PublicShell.tsx';

const path = window.location.pathname.replace(/\/+$/, '') || '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider>
      <PublicShell path={path} />
    </PostHogProvider>
  </StrictMode>,
);
