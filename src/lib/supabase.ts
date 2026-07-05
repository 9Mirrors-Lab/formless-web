import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type BrowserSupabaseClient = SupabaseClient;

let browserClient: BrowserSupabaseClient | null = null;

function readSupabaseEnv(): { url: string; anonKey: string } {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  }
  return { url, anonKey };
}

export function getBrowserSupabaseClient(): BrowserSupabaseClient {
  if (!browserClient) {
    const { url, anonKey } = readSupabaseEnv();
    browserClient = createClient(url, anonKey, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserClient;
}

/** @deprecated Prefer getBrowserSupabaseClient for a shared auth-aware client. */
export function createBrowserSupabaseClient(): BrowserSupabaseClient {
  return getBrowserSupabaseClient();
}

export function hasSupabaseEnv(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}
