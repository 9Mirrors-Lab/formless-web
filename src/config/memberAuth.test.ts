import { afterEach, describe, expect, it, vi } from 'vitest';

describe('isMemberAuthNavEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('is off by default', async () => {
    vi.stubEnv('VITE_PUBLIC_MEMBER_AUTH_NAV', undefined);
    const { isMemberAuthNavEnabled } = await import('@/config/memberAuth');
    expect(isMemberAuthNavEnabled()).toBe(false);
  });

  it('is on only when set to true', async () => {
    vi.stubEnv('VITE_PUBLIC_MEMBER_AUTH_NAV', 'true');
    const { isMemberAuthNavEnabled } = await import('@/config/memberAuth');
    expect(isMemberAuthNavEnabled()).toBe(true);
  });
});
