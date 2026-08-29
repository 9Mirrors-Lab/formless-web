import { describe, expect, it } from 'vitest';

import {
  CANVA_TEMPLATE_IDEAS,
  FORMLESS_3D_MOCKUPS,
  canvaChannelLabel,
  formless3dMockupPreviews,
} from '@/data/canvaTemplateIdeas';

describe('canvaTemplateIdeas', () => {
  it('lists branded 3D mockups before Canva ideas', () => {
    expect(FORMLESS_3D_MOCKUPS).toHaveLength(5);
    expect(FORMLESS_3D_MOCKUPS.map((mockup) => mockup.id)).toEqual([
      'composite',
      'hardcover',
      'paperback',
      'kindle',
      'ereader',
    ]);
    expect(formless3dMockupPreviews()[0]?.previewSrc).toBe(
      '/design/3d-mockups/composite-3d-mockup.png',
    );
  });

  it('lists six Canva library ideas', () => {
    expect(CANVA_TEMPLATE_IDEAS).toHaveLength(6);
    expect(CANVA_TEMPLATE_IDEAS.map((idea) => idea.id)).toEqual([
      'carousel-ig-linkedin',
      'preorder',
      'reel-or-carousel',
      'post-launch-week',
      'banner-linkedin-facebook',
      'neutral-background',
    ]);
  });

  it('keeps canva.link share URLs', () => {
    for (const idea of CANVA_TEMPLATE_IDEAS) {
      expect(idea.href.startsWith('https://canva.link/')).toBe(true);
    }
  });

  it('labels channels for display', () => {
    expect(canvaChannelLabel('instagram')).toBe('Instagram');
    expect(canvaChannelLabel('cross-platform')).toBe('Multi-channel');
  });
});
