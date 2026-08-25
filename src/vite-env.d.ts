/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_PUBLIC_SITE_RESTRICTED?: string;
  readonly VITE_PUBLIC_MEMBER_AUTH_NAV?: string;
  readonly VITE_PUBLIC_POSTHOG_KEY?: string;
  readonly VITE_PUBLIC_POSTHOG_HOST?: string;
  readonly VITE_PUBLIC_POSTHOG_DISABLED?: string;
  /** Formless jacket preorder column on home hero. Default on; `false`/`0` hides it. Overridden by `?heroBookAside=`. */
  readonly VITE_HERO_BOOK_ASIDE?: string;
  /**
   * When `true` or `1`, show the book cover block on `/audio/editorial2`.
   * Default is off until cover artwork is approved. Overridden by `?editorialBookCover=`.
   */
  readonly VITE_EDITORIAL_BOOK_COVER?: string;
  /**
   * Local/dev only. When `true` or `1`, skip Brand Studio internal auth.
   * No effect in production builds (`import.meta.env.DEV` must be true).
   */
  readonly VITE_BYPASS_INTERNAL_AUTH?: string;
  /** Amazon Kindle product URL for the Formless pre-order landing. */
  readonly VITE_KINDLE_PREORDER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
