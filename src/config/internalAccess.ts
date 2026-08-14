import { normalizeEmail } from '@/lib/auth';

/**
 * Emails allowed into hub + Brand Studio internal materials.
 * Accounts must already exist in Supabase Auth.
 */
export const INTERNAL_ACCESS_EMAILS = [
  'sonikacottman@gmail.com',
  'riles4@gmail.com',
] as const;

const INTERNAL_EMAIL_SET = new Set(
  INTERNAL_ACCESS_EMAILS.map((email) => normalizeEmail(email)),
);

export function isInternalAccessEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return INTERNAL_EMAIL_SET.has(normalizeEmail(email));
}

/**
 * Local/dev-only skip for Brand Studio auth.
 * Hard-gated on Vite DEV so production builds never bypass, even if the env var
 * is mistakenly set on a host. Opt in with `VITE_BYPASS_INTERNAL_AUTH=true` or
 * `?bypassInternalAuth=1` (dev server only).
 */
export function isInternalAuthBypassEnabled(search?: string): boolean {
  if (!import.meta.env.DEV) return false;

  const fromEnv = import.meta.env.VITE_BYPASS_INTERNAL_AUTH;
  if (fromEnv === 'true' || fromEnv === '1') return true;

  if (typeof window !== 'undefined' || search !== undefined) {
    const params = new URLSearchParams(search ?? window.location.search);
    const fromQuery = params.get('bypassInternalAuth');
    if (fromQuery === '1' || fromQuery === 'true') return true;
  }

  return false;
}

/**
 * Hub and Brand Studio destinations (sidebar materials + overview).
 */
export function isInternalAuthPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '').toLowerCase() || '/';

  if (path === '/hub') return true;
  if (path === '/brand') return true;
  if (path === '/speaker-sheet') return true;
  if (path === '/zoom-backgrounds') return true;
  if (path === '/brand-kit-export') return true;
  if (path === '/eyes-closed-logo-options') return true;
  if (path === '/design/eyes-closed-logo-variations/04-options.html') return true;

  if (isAdvanceListenPath(path)) return true;
  if (path === '/audio' || path.startsWith('/audio/')) return true;

  return false;
}

/** Public early-listen room. Any signed-in account can enter; not allowlisted. */
export function isAdvanceListenPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '').toLowerCase() || '/';
  return path === '/advance-listen';
}
