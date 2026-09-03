/**
 * Placeholder content for the /book-preview redesign.
 * Instagram stills are temporary starters; swap when final posts land.
 */

export type BookInsightKind = 'video' | 'quote' | 'image';

export type BookInsight = {
  id: string;
  kind: BookInsightKind;
  imageSrc: string;
  imageAlt: string;
  caption: string;
  href: string;
  ctaLabel: string;
};

export const BOOK_PREVIEW_FROM_SONI = {
  title: 'From Soni',
  lede: 'Reflections and insights from Instagram.',
  viewAllLabel: 'View all insights',
  viewAllHref: '#more-from-soni',
} as const;

export const BOOK_PREVIEW_INSIGHTS: BookInsight[] = [
  {
    id: 'talking-head',
    kind: 'video',
    imageSrc: '/book/insights/soni-talking-head.png',
    imageAlt: 'Sonika speaking on camera',
    caption: 'The peace you are looking for is the awareness that is looking.',
    href: '#',
    ctaLabel: 'Watch on Instagram',
  },
  {
    id: 'notice-return',
    kind: 'quote',
    imageSrc: '/book/insights/notice-return.png',
    imageAlt: 'Instagram post: Notice. Return.',
    caption: 'The practice is simple: Notice. Return. Notice again. Return again.',
    href: '#',
    ctaLabel: 'View on Instagram',
  },
  {
    id: 'wholeness-tree',
    kind: 'image',
    imageSrc: '/book/insights/wholeness-tree.png',
    imageAlt: 'Misty tree with a Formless quote about wholeness',
    caption:
      'Wholeness is not something to create. It is what remains when you stop trying to fix what was never broken.',
    href: '#',
    ctaLabel: 'View on Instagram',
  },
];

export const BOOK_PREVIEW_QUOTE = {
  text: 'You are not your thoughts. You are the one aware of them.',
  attribution: 'Sonika Cottman',
} as const;

export const BOOK_PREVIEW_CHAPTER = {
  label: 'Chapter 4',
  title: 'Resistance and Surrender',
  body: 'Resistance tightens around what is already here. Surrender is not giving up; it is opening to the awareness that can meet life without fighting it.',
  reflectionTitle: 'Reflection',
  reflection:
    'Notice where in your life you are resisting what is. Can you meet it with acceptance instead?',
  featured: {
    imageSrc: '/book/insights/soni-talking-head.png',
    imageAlt: 'Sonika speaking on camera',
    caption: 'Surrender is the way out of your personal prison.',
    href: '#',
    ctaLabel: 'Watch on Instagram',
  },
} as const;

export const BOOK_PREVIEW_MORE = {
  title: 'More from Soni',
  exploreLabel: 'Explore all insights',
  exploreHref: '#from-soni',
  items: [
    {
      id: 'more-resistance',
      kind: 'quote' as const,
      background: 'sand' as const,
      text: 'Resistance says the moment should be different. Surrender lets the moment teach.',
    },
    {
      id: 'more-control',
      kind: 'image' as const,
      imageSrc: '/backgrounds/misty-river.jpg',
      imageAlt: 'Mist over a quiet river',
      text: 'Control is the mind trying to feel safe. Awareness already is.',
    },
    {
      id: 'more-fight',
      kind: 'quote' as const,
      background: 'sand' as const,
      text: 'Fighting reality only strengthens the voice that feels trapped inside it.',
    },
  ],
} as const;
