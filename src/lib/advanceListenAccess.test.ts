import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const insert = vi.hoisted(() => vi.fn());

vi.mock('@/lib/supabase', () => ({
  getBrowserSupabaseClient: () => ({
    from: (table: string) => {
      expect(table).toBe('advance_listen_signups');
      return { insert };
    },
  }),
}));

import {
  ADVANCE_LISTEN_EMAIL_STORAGE_KEY,
  captureAdvanceListenEmail,
  hasStoredAdvanceListenEmail,
  readStoredAdvanceListenEmail,
  storeAdvanceListenEmail,
} from '@/lib/advanceListenAccess';

function stubLocalStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      clear: () => {
        store.clear();
      },
    },
  });
}

describe('advanceListenAccess', () => {
  beforeEach(() => {
    stubLocalStorage();
    insert.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('stores and reads a normalized email', () => {
    storeAdvanceListenEmail('  Editor@House.com ');
    expect(readStoredAdvanceListenEmail()).toBe('editor@house.com');
    expect(hasStoredAdvanceListenEmail()).toBe(true);
    expect(window.localStorage.getItem(ADVANCE_LISTEN_EMAIL_STORAGE_KEY)).toBe(
      'editor@house.com',
    );
  });

  it('rejects invalid stored values', () => {
    window.localStorage.setItem(ADVANCE_LISTEN_EMAIL_STORAGE_KEY, 'not-an-email');
    expect(readStoredAdvanceListenEmail()).toBeNull();
    expect(hasStoredAdvanceListenEmail()).toBe(false);
  });

  it('rejects missing names before calling supabase', async () => {
    const result = await captureAdvanceListenEmail({
      email: 'publisher@house.com',
      firstName: '',
      lastName: 'Lee',
    });
    expect(result).toEqual({
      ok: false,
      errorMessage: 'Enter your first name.',
    });
    expect(insert).not.toHaveBeenCalled();
    expect(hasStoredAdvanceListenEmail()).toBe(false);
  });

  it('rejects an invalid email before calling supabase', async () => {
    const result = await captureAdvanceListenEmail({
      email: 'not-an-email',
      firstName: 'Ada',
      lastName: 'Lovelace',
    });
    expect(result).toEqual({
      ok: false,
      errorMessage: 'Enter a valid email address.',
    });
    expect(insert).not.toHaveBeenCalled();
    expect(hasStoredAdvanceListenEmail()).toBe(false);
  });

  it('saves a new email and remembers it locally', async () => {
    insert.mockResolvedValue({ error: null });

    const result = await captureAdvanceListenEmail({
      email: '  Publisher@House.com ',
      firstName: ' Ada ',
      lastName: ' House ',
    });

    expect(result).toEqual({ ok: true });
    expect(insert).toHaveBeenCalledWith({
      email: 'publisher@house.com',
      first_name: 'Ada',
      last_name: 'House',
      source: 'advance_listen',
    });
    expect(readStoredAdvanceListenEmail()).toBe('publisher@house.com');
  });

  it('treats a duplicate email as success', async () => {
    insert.mockResolvedValue({ error: { code: '23505' } });

    const result = await captureAdvanceListenEmail({
      email: 'publisher@house.com',
      firstName: 'Ada',
      lastName: 'House',
    });

    expect(result).toEqual({ ok: true });
    expect(readStoredAdvanceListenEmail()).toBe('publisher@house.com');
  });
});
