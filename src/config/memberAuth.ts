/**
 * When true, show Sign in / Account in the main navigation.
 * Auth routes (/login, /account) still work when this is off; /signup stays closed.
 * Set `VITE_PUBLIC_MEMBER_AUTH_NAV=true` to expose the nav link.
 */
export function isMemberAuthNavEnabled(): boolean {
  return import.meta.env.VITE_PUBLIC_MEMBER_AUTH_NAV === 'true';
}
