import type { AuthError } from '@supabase/supabase-js';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAuthErrorMessage, isValidEmail, normalizeEmail } from '@/lib/auth';

describe('auth helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('validates email addresses', () => {
    expect(isValidEmail('reader@formless.com')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
  });

  it('normalizes email casing and whitespace', () => {
    expect(normalizeEmail('  Reader@Formless.COM ')).toBe('reader@formless.com');
  });

  it('maps common auth errors to friendly copy', () => {
    expect(
      getAuthErrorMessage({
        message: 'Invalid login credentials',
      } as AuthError),
    ).toBe('Email or password is incorrect.');

    expect(getAuthErrorMessage(null)).toBe('Something went wrong. Please try again.');
  });

  it('builds the auth callback URL from the current origin', async () => {
    vi.stubGlobal('window', { location: { origin: 'http://localhost:5173' } });
    vi.resetModules();
    const { getAuthCallbackUrl } = await import('@/lib/auth');
    expect(getAuthCallbackUrl()).toBe('http://localhost:5173/auth/callback');
    vi.unstubAllGlobals();
  });

  it('detects a PKCE code on any path', async () => {
    vi.resetModules();
    const { hasAuthCallbackCode } = await import('@/lib/auth');
    expect(hasAuthCallbackCode('?code=abc')).toBe(true);
    expect(hasAuthCallbackCode('?next=/brand')).toBe(false);
  });

  it('accepts only same-origin relative next paths', async () => {
    vi.resetModules();
    const { safeAuthNextPath } = await import('@/lib/auth');
    expect(safeAuthNextPath('/brand')).toBe('/brand');
    expect(safeAuthNextPath('/hub?tab=design')).toBe('/hub?tab=design');
    expect(safeAuthNextPath('https://evil.example/x')).toBe('/account');
    expect(safeAuthNextPath('//evil.example')).toBe('/account');
    expect(safeAuthNextPath(null, '/brand')).toBe('/brand');
  });
});
