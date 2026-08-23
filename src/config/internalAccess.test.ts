import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  isAdvanceListenPath,
  isInternalAccessEmail,
  isInternalAuthBypassEnabled,
  isInternalAuthPath,
} from '@/config/internalAccess';

describe('internalAccess', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('allows only the approved emails', () => {
    expect(isInternalAccessEmail('sonikacottman@gmail.com')).toBe(true);
    expect(isInternalAccessEmail('Riles4@Gmail.com')).toBe(true);
    expect(isInternalAccessEmail('  riles4@gmail.com ')).toBe(true);
    expect(isInternalAccessEmail('other@gmail.com')).toBe(false);
    expect(isInternalAccessEmail(null)).toBe(false);
  });

  it('flags hub and brand studio paths', () => {
    expect(isInternalAuthPath('/hub')).toBe(true);
    expect(isInternalAuthPath('/brand')).toBe(true);
    expect(isInternalAuthPath('/Brand')).toBe(true);
    expect(isInternalAuthPath('/BRAND/')).toBe(true);
    expect(isInternalAuthPath('/brand/signups')).toBe(true);
    expect(isInternalAuthPath('/brand/endorsements')).toBe(true);
    expect(isInternalAuthPath('/brand/book-launch-campaign')).toBe(true);
    expect(isInternalAuthPath('/brand/schedule')).toBe(true);
    expect(isInternalAuthPath('/speaker-sheet')).toBe(true);
    expect(isInternalAuthPath('/brand-kit-export')).toBe(true);
    expect(isInternalAuthPath('/zoom-backgrounds')).toBe(true);
    expect(isInternalAuthPath('/audio/companion')).toBe(true);
    expect(isInternalAuthPath('/audio/editorial')).toBe(true);
    expect(isInternalAuthPath('/audio/process')).toBe(true);
    expect(isInternalAuthPath('/audio/record-sessions')).toBe(true);
    expect(isInternalAuthPath('/audio/script-compare')).toBe(true);
    expect(isInternalAuthPath('/advance-listen')).toBe(false);
    expect(isInternalAuthPath('/special-preview')).toBe(false);
    expect(isInternalAuthPath('/preorder')).toBe(false);
    expect(isInternalAuthPath('/preorder/stay-close')).toBe(false);
    expect(isInternalAuthPath('/audio/files')).toBe(true);
    expect(isInternalAuthPath('/eyes-closed-logo-options')).toBe(true);
    expect(isInternalAuthPath('/')).toBe(false);
    expect(isInternalAuthPath('/book')).toBe(false);
    expect(isInternalAuthPath('/login')).toBe(false);
  });

  it('treats advance listen as an email-gated room, not Brand Studio auth', () => {
    expect(isAdvanceListenPath('/advance-listen')).toBe(true);
    expect(isAdvanceListenPath('/Advance-Listen/')).toBe(true);
    expect(isAdvanceListenPath('/audio')).toBe(false);
    expect(isAdvanceListenPath('/brand')).toBe(false);
  });

  it('keeps auth bypass off by default', () => {
    vi.stubEnv('VITE_BYPASS_INTERNAL_AUTH', undefined);
    expect(isInternalAuthBypassEnabled('')).toBe(false);
  });

  it('enables auth bypass from env only while Vite DEV is on', () => {
    vi.stubEnv('VITE_BYPASS_INTERNAL_AUTH', 'true');
    // Vitest runs under Vite DEV; production builds hard-gate this in source.
    expect(isInternalAuthBypassEnabled('')).toBe(import.meta.env.DEV);
  });

  it('enables auth bypass from query in DEV', () => {
    vi.stubEnv('VITE_BYPASS_INTERNAL_AUTH', undefined);
    expect(isInternalAuthBypassEnabled('?bypassInternalAuth=1')).toBe(
      import.meta.env.DEV,
    );
    expect(isInternalAuthBypassEnabled('?bypassInternalAuth=0')).toBe(false);
  });
});
