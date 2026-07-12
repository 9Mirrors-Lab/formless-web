export type HeroLayoutVariant = 'classic' | 'layout-test';

const HERO_LAYOUT_QUERY_KEY = 'hero';

function parseHeroLayoutVariant(value: string | null | undefined): HeroLayoutVariant | null {
  if (value === 'classic' || value === 'layout-test') return value;
  return null;
}

/** Resolve hero layout: `?hero=layout-test|classic` overrides `VITE_HERO_LAYOUT`. Default: classic. */
export function resolveHeroLayoutVariant(search?: string): HeroLayoutVariant {
  if (typeof window !== 'undefined' || search !== undefined) {
    const params = new URLSearchParams(search ?? window.location.search);
    const fromQuery = parseHeroLayoutVariant(params.get(HERO_LAYOUT_QUERY_KEY));
    if (fromQuery) return fromQuery;
  }

  const fromEnv = parseHeroLayoutVariant(import.meta.env.VITE_HERO_LAYOUT);
  if (fromEnv) return fromEnv;

  return 'classic';
}

export function heroLayoutQueryHref(variant: HeroLayoutVariant): string {
  const url = new URL(window.location.href);
  url.searchParams.set(HERO_LAYOUT_QUERY_KEY, variant);
  return `${url.pathname}${url.search}${url.hash}`;
}
