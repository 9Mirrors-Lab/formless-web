/**
 * When true (opt-in), only the home experience is shown: deep URLs normalize to `/`,
 * and footer brand/links are non-navigable. Set `VITE_PUBLIC_SITE_RESTRICTED=true`
 * for a teaser-only public build. Default is the full site.
 */
export function isPublicSiteRestricted(): boolean {
  return import.meta.env.VITE_PUBLIC_SITE_RESTRICTED === 'true';
}
