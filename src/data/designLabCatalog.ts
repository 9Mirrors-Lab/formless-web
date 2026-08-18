/**
 * Curated Design Lab entries for client direction review.
 * Isolated explorations stay in the repo but are not listed here.
 */

export type DesignLabGroup = 'Foundations' | 'Directions' | 'In progress' | 'Atmosphere';

export type DesignLabEntry = {
  id: string;
  label: string;
  href: string;
  group: DesignLabGroup;
  /** One quiet line for the client. */
  intent: string;
  /** Optional status chip. */
  status?: 'Active' | 'Foundation' | 'Direction';
  /** External HTML artifact (opens full page). */
  external?: boolean;
};

export const DESIGN_LAB_GROUPS: DesignLabGroup[] = [
  'In progress',
  'Directions',
  'Foundations',
  'Atmosphere',
];

export const DESIGN_LAB_ENTRIES: DesignLabEntry[] = [
  {
    id: 'layout-tests',
    label: 'Hero & section templates',
    href: '/layout-tests',
    group: 'In progress',
    intent: 'Rhythm, type scale, and dark-first heroes. The lane we are shaping now.',
    status: 'Active',
  },
  {
    id: 'science-directions',
    label: 'Science · dark directions',
    href: '/design/science-page-v2-directions.html',
    group: 'Directions',
    intent: 'Vault, Atelier, Observatory Press. The first exploration beyond the ordinary page.',
    status: 'Direction',
    external: true,
  },
  {
    id: 'about-layouts',
    label: 'About · layout studies',
    href: '/design/about-page-layouts.html',
    group: 'Directions',
    intent: 'Editorial split, portrait hero, manifesto, magazine. Four quiet compositions.',
    status: 'Direction',
    external: true,
  },
  {
    id: 'colors',
    label: 'Supporting page themes',
    href: '/colors',
    group: 'Directions',
    intent: 'Dark keys for Work, About, and Science. Mood and depth without touching production.',
    status: 'Direction',
  },
  {
    id: 'design-system',
    label: 'Design foundations',
    href: '/design-system',
    group: 'Foundations',
    intent: 'Tokens, motion language, and icon loops. How the system was set up and how it moves.',
    status: 'Foundation',
  },
  {
    id: 'icons',
    label: 'Iconography',
    href: '/icons',
    group: 'Foundations',
    intent: 'Teaching marks in full. The living registry that motion and science lean on.',
    status: 'Foundation',
  },
  {
    id: 'moodboard',
    label: 'Moodboard',
    href: '/moodboard',
    group: 'Foundations',
    intent: 'Field, torus, dissolve. Visual language for the core message.',
    status: 'Foundation',
  },
  {
    id: 'backgrounds',
    label: 'Backgrounds',
    href: '/backgrounds',
    group: 'Atmosphere',
    intent: 'Shader and image heroes. Atmosphere as invitation, not decoration.',
  },
];

export function designLabEntryForPath(pathname: string): DesignLabEntry | undefined {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return DESIGN_LAB_ENTRIES.find((entry) => {
    const href = entry.href.replace(/\/+$/, '') || '/';
    return normalized === href || normalized.startsWith(`${href}/`);
  });
}

export function isDesignLabPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/design-lab') return true;
  if (normalized.startsWith('/design/')) return true;
  return DESIGN_LAB_ENTRIES.some((entry) => {
    if (entry.external) return false;
    const href = entry.href.replace(/\/+$/, '') || '/';
    return normalized === href;
  });
}
