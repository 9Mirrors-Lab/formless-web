import { isValidEmail, normalizeEmail, validateSignupNames } from '@/lib/auth';
import { getBrowserSupabaseClient } from '@/lib/supabase';

export const ADVANCE_LISTEN_EMAIL_STORAGE_KEY = 'eyesclosed.advance-listen.email';

export type AdvanceListenSignupInput = {
  email: string;
  firstName: string;
  lastName: string;
};

export function readStoredAdvanceListenEmail(): string | null {
  if (typeof window === 'undefined') return null;

  const stored = window.localStorage.getItem(ADVANCE_LISTEN_EMAIL_STORAGE_KEY);
  if (!stored || !isValidEmail(stored)) return null;
  return normalizeEmail(stored);
}

export function storeAdvanceListenEmail(email: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    ADVANCE_LISTEN_EMAIL_STORAGE_KEY,
    normalizeEmail(email),
  );
}

export function hasStoredAdvanceListenEmail(): boolean {
  return readStoredAdvanceListenEmail() !== null;
}

export async function captureAdvanceListenEmail({
  email,
  firstName,
  lastName,
}: AdvanceListenSignupInput): Promise<{ ok: true } | { ok: false; errorMessage: string }> {
  const normalized = normalizeEmail(email);
  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();

  const nameError = validateSignupNames(trimmedFirstName, trimmedLastName);
  if (nameError) {
    return { ok: false, errorMessage: nameError };
  }

  if (!isValidEmail(normalized)) {
    return { ok: false, errorMessage: 'Enter a valid email address.' };
  }

  try {
    const supabase = getBrowserSupabaseClient();
    const { error } = await supabase.from('advance_listen_signups').insert({
      email: normalized,
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      source: 'advance_listen',
    });

    if (error && error.code !== '23505') {
      return {
        ok: false,
        errorMessage: 'Could not save your email. Try again in a moment.',
      };
    }

    storeAdvanceListenEmail(normalized);
    return { ok: true };
  } catch {
    return {
      ok: false,
      errorMessage: 'Could not save your email. Try again in a moment.',
    };
  }
}
