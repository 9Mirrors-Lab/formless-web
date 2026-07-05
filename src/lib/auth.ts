import type { AuthError } from '@supabase/supabase-js';

import { getBrowserSupabaseClient } from '@/lib/supabase';

export type AuthCredentials = {
  email: string;
  password: string;
};

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
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
    default:
      return error.message;
  }
}

export function getAuthCallbackUrl(): string {
  return `${window.location.origin}/auth/callback`;
}

export async function signInWithPassword({ email, password }: AuthCredentials) {
  const supabase = getBrowserSupabaseClient();
  return supabase.auth.signInWithPassword({
    email: normalizeEmail(email),
    password,
  });
}

export async function signUpWithPassword({ email, password }: AuthCredentials) {
  const supabase = getBrowserSupabaseClient();

  return supabase.auth.signUp({
    email: normalizeEmail(email),
    password,
    options: { emailRedirectTo: getAuthCallbackUrl() },
  });
}

export async function signInWithGoogle() {
  const supabase = getBrowserSupabaseClient();

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
    return supabase.auth.exchangeCodeForSession(code);
  }

  return supabase.auth.getSession();
}
