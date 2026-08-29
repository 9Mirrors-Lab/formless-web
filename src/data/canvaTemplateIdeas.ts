/**
 * Canva template library ideas and branded 3D mockups for social and launch posts.
 * Not shipped site designs. Studio page tab: /brand/designs → Template ideas
 */

export type CanvaTemplateChannel =
  | 'instagram'
  | 'linkedin'
  | 'facebook'
  | 'cross-platform';

export type CanvaTemplateIdea = {
  id: string;
  title: string;
  useFor: string;
  href: string;
  channels: readonly CanvaTemplateChannel[];
  format: string;
};

export type Formless3dMockup = {
  id: string;
  title: string;
  label: string;
  previewSrc: string;
  filename: string;
};

/** Branded 3D product mockups. Shown above Canva links on Template ideas. */
export const FORMLESS_3D_MOCKUPS: readonly Formless3dMockup[] = [
  {
    id: 'composite',
    title: 'Composite',
    label: 'Book + tablet + phone',
    previewSrc: '/design/3d-mockups/composite-3d-mockup.png',
    filename: 'composite-3d-mockup.png',
  },
  {
    id: 'hardcover',
    title: 'Hardcover',
    label: 'Hardback 3D mockup',
    previewSrc: '/design/3d-mockups/hardcover-3d-mockup.png',
    filename: 'hardcover-3d-mockup.png',
  },
  {
    id: 'paperback',
    title: 'Paperback',
    label: 'Paperback 3D mockup',
    previewSrc: '/design/3d-mockups/paperback-3d-mockup.png',
    filename: 'paperback-3d-mockup.png',
  },
  {
    id: 'kindle',
    title: 'Kindle',
    label: 'Kindle device mockup',
    previewSrc: '/design/3d-mockups/kindle-3d-mockup.png',
    filename: 'kindle-3d-mockup.png',
  },
  {
    id: 'ereader',
    title: 'eReader',
    label: 'eReader device mockup',
    previewSrc: '/design/3d-mockups/ereader-3d-mockup.png',
    filename: 'ereader-3d-mockup.png',
  },
] as const;

export const CANVA_TEMPLATE_IDEAS: readonly CanvaTemplateIdea[] = [
  {
    id: 'carousel-ig-linkedin',
    title: 'Carousel post',
    useFor: 'Good for a carousel post on Instagram or LinkedIn.',
    href: 'https://canva.link/ob8veu13up9a88o',
    channels: ['instagram', 'linkedin'],
    format: 'Carousel',
  },
  {
    id: 'preorder',
    title: 'Pre-order',
    useFor: 'Built for pre-order announcements and countdown posts.',
    href: 'https://canva.link/6dgeeivc5bs2nhy',
    channels: ['cross-platform'],
    format: 'Campaign',
  },
  {
    id: 'reel-or-carousel',
    title: 'Reel or carousel',
    useFor: 'Turn into a Reel or carousel post on Instagram.',
    href: 'https://canva.link/it1a06ws152ahqx',
    channels: ['instagram'],
    format: 'Reel / carousel',
  },
  {
    id: 'post-launch-week',
    title: 'After launch week',
    useFor: 'Regular posts once launch week is over.',
    href: 'https://canva.link/oyl3yea7efl2ct9',
    channels: ['cross-platform'],
    format: 'Feed post',
  },
  {
    id: 'banner-linkedin-facebook',
    title: 'LinkedIn / Facebook banner',
    useFor: 'Banner ideas for LinkedIn or Facebook.',
    href: 'https://canva.link/s46vgj0cug9qfw7',
    channels: ['linkedin', 'facebook'],
    format: 'Banner',
  },
  {
    id: 'neutral-background',
    title: 'Neutral background',
    useFor: 'Cool, neutral background for overlays and quiet posts.',
    href: 'https://canva.link/x54ytotdywjyefx',
    channels: ['cross-platform'],
    format: 'Background',
  },
] as const;

export function canvaChannelLabel(channel: CanvaTemplateChannel): string {
  switch (channel) {
    case 'instagram':
      return 'Instagram';
    case 'linkedin':
      return 'LinkedIn';
    case 'facebook':
      return 'Facebook';
    case 'cross-platform':
      return 'Multi-channel';
    default: {
      const _never: never = channel;
      return _never;
    }
  }
}

export function formless3dMockupPreviews(): Array<{
  title: string;
  label: string;
  previewSrc: string;
}> {
  return FORMLESS_3D_MOCKUPS.map((mockup) => ({
    title: mockup.title,
    label: mockup.label,
    previewSrc: mockup.previewSrc,
  }));
}
