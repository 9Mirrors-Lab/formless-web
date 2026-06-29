/**
 * When true, show Sign in / Account in the main navigation.
 * Auth routes (/login, /signup, /account) still work when this is off.
 * Set `VITE_PUBLIC_MEMBER_AUTH_NAV=true` to expose the nav link.
 */
export function isMemberAuthNavEnabled(): boolean {
  return import.meta.env.VITE_PUBLIC_MEMBER_AUTH_NAV === 'true';
}
