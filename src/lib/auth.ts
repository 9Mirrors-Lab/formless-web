import type { AuthError } from '@supabase/supabase-js';

import { getBrowserSupabaseClient } from '@/lib/supabase';

export type AuthCredentials = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

const AUTH_NEXT_STORAGE_KEY = 'eyesclosed.auth.next';

/** Where Brand Studio login lands when no `next` path is stashed. */
export const DEFAULT_POST_LOGIN_PATH = '/brand';

/** Public account creation is closed; operators use existing allowlisted accounts. */
export const SIGNUP_CLOSED_MESSAGE =
  'Account creation is closed. Sign in with an approved Eyes Closed account.';

/** Shown when a non-allowlisted account signs in successfully, then is signed out. */
export const ACCESS_LIMITED_MESSAGE =
  'This account is signed in, but it is not approved for Eyes Closed member access.';

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateSignupNames(firstName: string, lastName: string): string | null {
  if (!firstName.trim()) return 'Enter your first name.';
  if (!lastName.trim()) return 'Enter your last name.';
  return null;
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function getAuthErrorMessage(error: AuthError | null | undefined): string {
  if (!error) return 'Something went wrong. Please try again.';

  switch (error.message) {
    case 'Invalid login credentials':
      return 'Email or password is incorrect.';
    case 'User already registered':
      return 'An account with this email already exists. Try signing in instead.';
    case 'Email not confirmed':
      return 'Confirm your email before signing in. Check your inbox for the link.';
    case 'Password should be at least 6 characters':
      return 'Use a password with at least 6 characters.';
    case 'Signups not allowed for this instance':
    case 'Signup is disabled':
      return SIGNUP_CLOSED_MESSAGE;
    default:
      if (/sign.?up.*(disabled|not allowed)/i.test(error.message)) {
        return SIGNUP_CLOSED_MESSAGE;
      }
      return error.message;
  }
}

export function getAuthCallbackUrl(): string {
  return `${window.location.origin}/auth/callback`;
}

/** PKCE `?code=` can land on Site URL (origin root) if redirectTo is rejected. */
export function hasAuthCallbackCode(search: string): boolean {
  return new URLSearchParams(search).has('code');
}

/** Same-origin relative path only; blocks open redirects. */
export function safeAuthNextPath(
  raw: string | null | undefined,
  fallback = DEFAULT_POST_LOGIN_PATH,
): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) {
    return fallback;
  }
  return raw;
}

export function stashAuthNextPath(path: string | null | undefined): void {
  const next = safeAuthNextPath(path, '');
  if (!next) {
    sessionStorage.removeItem(AUTH_NEXT_STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(AUTH_NEXT_STORAGE_KEY, next);
}

export function takeAuthNextPath(fallback = DEFAULT_POST_LOGIN_PATH): string {
  const stored = sessionStorage.getItem(AUTH_NEXT_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_NEXT_STORAGE_KEY);
  return safeAuthNextPath(stored, fallback);
}

export function loginHrefForCurrentLocation(): string {
  const next = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  return `/login?next=${encodeURIComponent(safeAuthNextPath(next, DEFAULT_POST_LOGIN_PATH))}`;
}

export async function signInWithPassword({ email, password }: AuthCredentials) {
  const supabase = getBrowserSupabaseClient();
  return supabase.auth.signInWithPassword({
    email: normalizeEmail(email),
    password,
  });
}

export async function signUpWithPassword(_credentials: AuthCredentials) {
  return {
    data: { user: null, session: null },
    error: {
      name: 'AuthApiError',
      message: SIGNUP_CLOSED_MESSAGE,
      status: 403,
    } as AuthError,
  };
}

/**
 * Google OAuth can create new Auth users. Kept for recovery only; login UI hides it
 * while public signup is closed.
 */
export async function signInWithGoogle(nextPath?: string | null) {
  const supabase = getBrowserSupabaseClient();
  const fromQuery = new URLSearchParams(window.location.search).get('next');
  stashAuthNextPath(nextPath ?? fromQuery);

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getAuthCallbackUrl(),
    },
  });
}

export async function signOut() {
  const supabase = getBrowserSupabaseClient();
  return supabase.auth.signOut();
}

export async function completeAuthCallback() {
  const supabase = getBrowserSupabaseClient();
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    const exchanged = await supabase.auth.exchangeCodeForSession(code);
    if (!exchanged.error) {
      return exchanged;
    }

    // detectSessionInUrl may already have consumed the PKCE code.
    const existing = await supabase.auth.getSession();
    if (existing.data.session) {
      return { data: existing.data, error: null };
    }

    return exchanged;
  }

  return supabase.auth.getSession();
}
