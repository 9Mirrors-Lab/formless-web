/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_PUBLIC_SITE_RESTRICTED?: string;
  readonly VITE_PUBLIC_MEMBER_AUTH_NAV?: string;
  readonly VITE_PUBLIC_POSTHOG_KEY?: string;
  readonly VITE_PUBLIC_POSTHOG_HOST?: string;
  readonly VITE_PUBLIC_POSTHOG_DISABLED?: string;
  /** `classic` (default) or `layout-test` for home hero lockup. Overridden by `?hero=`. */
  readonly VITE_HERO_LAYOUT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
