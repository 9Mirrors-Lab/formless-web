import { describe, expect, it } from 'vitest';

import {
  BRAND_DESIGN_CONCEPTS,
  brandDesignConceptPreviews,
} from './brandDesignConcepts';

describe('brandDesignConcepts', () => {
  it('keeps the three design system lockups in Concepts only', () => {
    expect(BRAND_DESIGN_CONCEPTS.map((concept) => concept.id)).toEqual([
      'energy-evolution',
      'energy-evolution-flow',
      'beyond-boundaries',
    ]);
    expect(brandDesignConceptPreviews()).toHaveLength(3);
    expect(brandDesignConceptPreviews()[2]?.previewSrc).toBe(
      '/design/previews/formless-design-system-beyond-boundaries-lockup.jpg',
    );
  });
});
