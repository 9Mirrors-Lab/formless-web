/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_PUBLIC_SITE_RESTRICTED?: string;
  readonly VITE_PUBLIC_MEMBER_AUTH_NAV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
