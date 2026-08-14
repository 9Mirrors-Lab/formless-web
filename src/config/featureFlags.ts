const HERO_BOOK_ASIDE_QUERY_KEY = 'heroBookAside';

function parseBooleanFlag(value: string | null | undefined): boolean | null {
  if (value === '1' || value === 'true') return true;
  if (value === '0' || value === 'false') return false;
  return null;
}

/** Optional Formless book aside on home hero. `?heroBookAside=1` or `VITE_HERO_BOOK_ASIDE=true`. Default: off. */
export function resolveHeroBookAsideEnabled(search?: string): boolean {
  if (typeof window !== 'undefined' || search !== undefined) {
    const params = new URLSearchParams(search ?? window.location.search);
    const fromQuery = parseBooleanFlag(params.get(HERO_BOOK_ASIDE_QUERY_KEY));
    if (fromQuery !== null) return fromQuery;
  }

  const fromEnv = import.meta.env.VITE_HERO_BOOK_ASIDE;
  if (fromEnv === 'true' || fromEnv === '1') return true;
  if (fromEnv === 'false' || fromEnv === '0') return false;

  return false;
}

export function heroBookAsideQueryHref(enabled: boolean): string {
  const url = new URL(window.location.href);
  url.searchParams.set(HERO_BOOK_ASIDE_QUERY_KEY, enabled ? '1' : '0');
  return `${url.pathname}${url.search}${url.hash}`;
}

const MOBILE_NAV_VARIANT_QUERY_KEY = 'mobileNav';

export type MobileNavVariant = 'default' | 'shroud' | 'bloom';

/** Which mobile nav variant to render. `?mobileNav=shroud|bloom` or `VITE_MOBILE_NAV_VARIANT=shroud|bloom`. Default: 'default'. */
export function getMobileNavVariant(search?: string): MobileNavVariant {
  if (typeof window !== 'undefined' || search !== undefined) {
    const params = new URLSearchParams(search ?? window.location.search);
    const fromQuery = params.get(MOBILE_NAV_VARIANT_QUERY_KEY);
    if (fromQuery === 'shroud' || fromQuery === 'bloom') return fromQuery;
  }
  const fromEnv = import.meta.env.VITE_MOBILE_NAV_VARIANT;
  if (fromEnv === 'shroud' || fromEnv === 'bloom') return fromEnv;
  return 'default';
}

const EDITORIAL_BOOK_COVER_QUERY_KEY = 'editorialBookCover';

/**
 * Book cover block on editorial2. Off until cover artwork is approved.
 * `?editorialBookCover=1` or `VITE_EDITORIAL_BOOK_COVER=true`. Default: off.
 */
export function resolveEditorialBookCoverEnabled(search?: string): boolean {
  if (typeof window !== 'undefined' || search !== undefined) {
    const params = new URLSearchParams(search ?? window.location.search);
    const fromQuery = parseBooleanFlag(params.get(EDITORIAL_BOOK_COVER_QUERY_KEY));
    if (fromQuery !== null) return fromQuery;
  }

  const fromEnv = import.meta.env.VITE_EDITORIAL_BOOK_COVER;
  if (fromEnv === 'true' || fromEnv === '1') return true;
  if (fromEnv === 'false' || fromEnv === '0') return false;

  return false;
}
