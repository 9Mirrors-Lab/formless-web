import { describe, expect, it } from 'vitest';

import {
  isInternalAccessEmail,
  isInternalAuthPath,
} from '@/config/internalAccess';

describe('internalAccess', () => {
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
    expect(isInternalAuthPath('/speaker-sheet')).toBe(true);
    expect(isInternalAuthPath('/brand-kit-export')).toBe(true);
    expect(isInternalAuthPath('/zoom-backgrounds')).toBe(true);
    expect(isInternalAuthPath('/audio/companion')).toBe(true);
    expect(isInternalAuthPath('/audio/editorial')).toBe(true);
    expect(isInternalAuthPath('/audio/advance-listen')).toBe(true);
    expect(isInternalAuthPath('/audio/files')).toBe(true);
    expect(isInternalAuthPath('/eyes-closed-logo-options')).toBe(true);
    expect(isInternalAuthPath('/')).toBe(false);
    expect(isInternalAuthPath('/book')).toBe(false);
    expect(isInternalAuthPath('/login')).toBe(false);
  });
});
