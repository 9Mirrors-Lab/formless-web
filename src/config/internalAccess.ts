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

  if (path === '/audio' || path.startsWith('/audio/')) return true;

  return false;
}
