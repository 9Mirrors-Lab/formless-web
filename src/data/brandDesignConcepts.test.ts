import { describe, expect, it } from 'vitest';

import {
  BRAND_DESIGN_CONCEPTS,
  brandDesignConceptPreviews,
} from './brandDesignConcepts';

describe('brandDesignConcepts', () => {
  it('keeps design system lockups and the page-marks lab in Concepts', () => {
    expect(BRAND_DESIGN_CONCEPTS.map((concept) => concept.id)).toEqual([
      'energy-evolution',
      'energy-evolution-flow',
      'beyond-boundaries',
      'page-marks-explore',
    ]);
    expect(brandDesignConceptPreviews()).toHaveLength(3);
    expect(brandDesignConceptPreviews()[2]?.previewSrc).toBe(
      '/design/previews/formless-design-system-beyond-boundaries-lockup.jpg',
    );
    expect(BRAND_DESIGN_CONCEPTS.find((c) => c.id === 'page-marks-explore')?.href).toBe(
      '/page-marks-explore',
    );
  });
});
