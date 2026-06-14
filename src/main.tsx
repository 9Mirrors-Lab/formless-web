import { createRoot } from 'react-dom/client';
import './index.css';
import { PublicShell } from './PublicShell.tsx';

const path = window.location.pathname.replace(/\/+$/, '') || '/';

createRoot(document.getElementById('root')!).render(
  <PublicShell path={path} />
);

