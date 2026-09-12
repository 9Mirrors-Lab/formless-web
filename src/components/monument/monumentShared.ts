/** Monument lab tokens — Southwestern surreal, matte charcoal, no cyber glow. */

export const MONUMENT = {
  canvas: '#141210',
  canvasDeep: '#0e0c0b',
  stone: '#1c1917',
  stoneLight: '#252220',
  horizon: '#8f4a2e',
  horizonMuted: '#5c3828',
  dustRed: '#9a4a42',
  dustRedMuted: '#6e3835',
  turquoiseGray: '#6a8286',
  turquoiseMuted: '#4a5c5f',
  text: '#d8d2cb',
  textMuted: '#8a837c',
  textFaint: '#5c5752',
  rule: 'rgba(216, 210, 203, 0.08)',
} as const;

export const MONUMENT_GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

export type MonumentLabRoute = 'home' | 'book';

export const MONUMENT_LAB_LINKS: {
  id: MonumentLabRoute;
  label: string;
  href: string;
  blurb: string;
}[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/monument-home',
    blurb: 'Invitation at the edge of the mesa',
  },
  {
    id: 'book',
    label: 'Book',
    href: '/monument-book',
    blurb: 'Purchase slab and teaching index',
  },
];
