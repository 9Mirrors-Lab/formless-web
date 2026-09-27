/**
 * Design system concept boards for /brand/designs → Concepts.
 * Exploration only. Not Review, not shipped materials.
 */

export type BrandDesignConcept = {
  id: string;
  title: string;
  label: string;
  notes: string;
  previewSrc: string;
  filename: string;
};

export const BRAND_DESIGN_CONCEPTS: readonly BrandDesignConcept[] = [
  {
    id: 'energy-evolution',
    title: 'The Energy Evolution',
    label: 'Design system · type + portrait',
    notes:
      'Sun icon, THE plus horizontal rule, copper serif ENERGY over wide sans EVOLUTION, diamond divider, and warm particle portrait. Tests stacked type scale and accent color on black.',
    previewSrc: '/design/previews/formless-design-system-energy-evolution-lockup.jpg',
    filename: 'formless-design-system-energy-evolution-lockup.jpg',
  },
  {
    id: 'energy-evolution-flow',
    title: 'The Energy Evolution · flow',
    label: 'Design system · type + atmosphere',
    notes:
      'Same type lockup as the portrait board, with abstract golden particle flow on the right instead of a figure. Tests how the left rule column holds when the art is atmosphere, not subject.',
    previewSrc: '/design/previews/formless-design-system-energy-evolution-flow-lockup.jpg',
    filename: 'formless-design-system-energy-evolution-flow-lockup.jpg',
  },
  {
    id: 'beyond-boundaries',
    title: 'Beyond Boundaries',
    label: 'Design system · event lockup',
    notes:
      'LEADING eyebrow, copper serif headline, rule plus subtitle stack, calendar icon with vertical rule, and footer pipe tags. Event lockup pattern for conferences and launches.',
    previewSrc: '/design/previews/formless-design-system-beyond-boundaries-lockup.jpg',
    filename: 'formless-design-system-beyond-boundaries-lockup.jpg',
  },
] as const;

export function brandDesignConceptPreviews(): Array<{
  title: string;
  label: string;
  notes?: string;
  previewSrc: string;
}> {
  return BRAND_DESIGN_CONCEPTS.map((concept) => ({
    title: concept.title,
    label: concept.label,
    notes: concept.notes,
    previewSrc: concept.previewSrc,
  }));
}
