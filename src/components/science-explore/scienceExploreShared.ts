/**
 * Shared science explore lab: pillar content, icon mapping, atmosphere.
 * Lab only (/science-explore); production /science unchanged until promoted.
 */

import { useContent, type ContentApi } from '@/context/ContentContext';

export type SciencePillar = {
  label: string;
  hook: string;
  body: string;
  keywords?: string[];
};

const PILLAR_DISPLAY_ORDER = ['Perception', 'Neuroplasticity', 'The Body', 'Consciousness'];

const FALLBACK_PILLARS: SciencePillar[] = [
  {
    label: 'Perception',
    hook:
      "You don't experience life exactly as it is.\nYou experience life through the lens of memory, conditioning, beliefs, and past experiences.",
    body:
      'Your brain constantly filters and interprets information, creating a version of reality based on what it has learned.\n\nAwareness allows you to notice the lens.\n\nWhen you see the lens, you are no longer identified with it.',
  },
  {
    label: 'Neuroplasticity',
    hook: 'Your brain is not fixed.',
    body:
      "Every thought you repeatedly believe strengthens neural pathways. Likewise, every moment of awareness weakens them and begins creating new ones.\n\nThe patterns you've lived with for years are not permanent.\n\nChange begins the moment you stop identifying with them.",
  },
  {
    label: 'The Body',
    hook:
      "Your experiences don't live only in memory.\nYour nervous system and body learn emotional patterns through repetition and memorize them.",
    keywords: ['Stress', 'Fear', 'Worry', 'Safety', 'Joy', 'Love', 'Presence'],
    body:
      'Your body is always listening.\n\nAwareness allows those unconscious patterns to become conscious.',
  },
  {
    label: 'Consciousness',
    hook:
      "Science continues asking one of humanity's oldest questions:\nWhat is consciousness?",
    body:
      'Some theories suggest consciousness emerges from the brain.\nOthers explore whether consciousness is more fundamental than matter itself.\n\nRegardless of where science eventually lands, your own experience offers something immediate.\n\nThoughts come and go.\nEmotions come and go.\nSensations come and go.\n\nYet something remains aware of all of them.\n\nThat is the place this practice begins.',
  },
];

/** Teaching mark paired to each science pillar for icon-led variants. */
export const PILLAR_ICON_IDS: Record<string, string> = {
  Perception: 'observer',
  Neuroplasticity: 'neural',
  'The Body': 'ekg',
  Consciousness: 'formless',
};

export const SCIENCE_GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='ng'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23ng)'/%3E%3C/svg%3E")`;

export type ScienceExploreVariantId = 'a' | 'b' | 'c' | 'd' | 'e';

export const SCIENCE_EXPLORE_VARIANTS: {
  id: ScienceExploreVariantId;
  label: string;
  title: string;
  blurb: string;
  iconIds: string[];
}[] = [
  {
    id: 'a',
    label: 'A',
    title: 'Observatory',
    blurb: 'Production baseline · annotated orbits',
    iconIds: [],
  },
  {
    id: 'b',
    label: 'B',
    title: 'Icon atlas',
    blurb: 'Teaching marks as pillar anchors',
    iconIds: ['observer', 'neural', 'ekg', 'formless'],
  },
  {
    id: 'c',
    label: 'C',
    title: 'Specimen index',
    blurb: 'Catalog rail + field journal scroll',
    iconIds: ['cells', 'dna', 'anchor', 'north'],
  },
  {
    id: 'd',
    label: 'D',
    title: 'Witness nucleus',
    blurb: 'Full-bleed orbit · stepped readout',
    iconIds: ['quantum', 'space', 'pause', 'clarity'],
  },
  {
    id: 'e',
    label: 'E',
    title: 'Bridge ledger',
    blurb: 'Two languages · parallel scripture',
    iconIds: ['formless', 'quantum'],
  },
];

function sortPillars(items: SciencePillar[]): SciencePillar[] {
  return [...items].sort((a, b) => {
    const ai = PILLAR_DISPLAY_ORDER.indexOf(a.label);
    const bi = PILLAR_DISPLAY_ORDER.indexOf(b.label);
    const aOrder = ai === -1 ? PILLAR_DISPLAY_ORDER.length : ai;
    const bOrder = bi === -1 ? PILLAR_DISPLAY_ORDER.length : bi;
    return aOrder - bOrder;
  });
}

function pillarsFromContent(api: ContentApi): SciencePillar[] {
  const items = api.listItems('science', 'pillars').flatMap((entry) => {
    const v = entry.value;
    const label = typeof v.label === 'string' ? v.label : '';
    const hook = typeof v.hook === 'string' ? v.hook : '';
    const body = typeof v.body === 'string' ? v.body : '';
    const keywords = Array.isArray(v.keywords)
      ? v.keywords.filter((word): word is string => typeof word === 'string')
      : undefined;
    if (!label) return [];
    return [{ label, hook, body, keywords }];
  });
  return sortPillars(items.length ? items : FALLBACK_PILLARS);
}

export function useScienceExploreContent() {
  const content = useContent();
  const pillars = pillarsFromContent(content);
  return {
    pillars,
    eyebrow: content.getText('science', 'header', 'eyebrow') || 'Two Languages One Truth',
    title:
      content.getText('science', 'header', 'title') ||
      'A bridge for the part of you that needs to understand.',
    intro:
      content.getText('science', 'header', 'intro') ||
      'The deepest truths about who you are do not require belief.',
    lede:
      content.getText('science', 'header', 'lede') ||
      'The teaching does not depend on science. But for the mind that needs a rational foothold before it can let go. Here is one.',
    closingEyebrow:
      content.getText('science', 'closing', 'eyebrow') ||
      'Science points to what the ancient teachings have known.',
    closingLine1:
      content.getText('science', 'closing', 'title_line1') ||
      "You are not the mind's\ninterpretation of reality.",
    closingLine2:
      content.getText('science', 'closing', 'title_line2') || 'You are the awareness that sees it.',
    ctaWork: content.getLink('science', 'closing', 'cta_work'),
    ctaBook: content.getLink('science', 'closing', 'cta_book'),
  };
}

export function pillarIconId(label: string, variantIcons?: string[], index = 0): string {
  if (variantIcons?.[index]) return variantIcons[index];
  return PILLAR_ICON_IDS[label] ?? 'formless';
}
