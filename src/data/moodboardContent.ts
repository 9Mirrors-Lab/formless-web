export type ImageReference = {
  title: string;
  visual: "torus-body" | "particle-field" | "fog-clarity" | "manuscript" | "cosmic-cell";
  caption: string;
  usage: string;
};

export type ColorSwatch = {
  name: string;
  hex: string;
  role: string;
};

export type TypographyDirection = {
  role: "Display" | "Body" | "Technical";
  family: string;
  sample: string;
  usage: string;
};

export type MoodboardNote = {
  title: string;
  body: string;
};

export type SpatialDirection = {
  title: string;
  principle: string;
};

export type InteractionCue = {
  title: string;
  trigger: string;
  response: string;
};

export const MOODBOARD_SECTIONS = [
  "Mood Vocabulary",
  "Image Direction",
  "Color System",
  "Typography",
  "Texture & Material",
  "Spatial Composition",
  "Motion Language",
  "Interface Notes",
  "Avoid",
];

export const MOOD_KEYWORDS = [
  "pause",
  "witness",
  "allow",
  "dissolve",
  "field",
  "clarity",
  "stillness",
  "within",
];

export const IMAGE_REFERENCES: ImageReference[] = [
  {
    title: "Human form dissolving into particles",
    visual: "torus-body",
    caption:
      "A body becoming less fixed, dissolving into a coherent toroidal field.",
    usage:
      "Primary hero and science bridge reference. Use when the site needs to show form becoming awareness.",
  },
  {
    title: "Toroidal current",
    visual: "particle-field",
    caption:
      "Energy folding back through itself, with the human as a localized node in a larger field.",
    usage:
      "Section transitions, science support visuals, and subtle background motion.",
  },
  {
    title: "Fog to clarity",
    visual: "fog-clarity",
    caption:
      "Visual metaphor for the visitor moving from noise and inner resistance into space.",
    usage:
      "Reflection moments and guided prompts.",
  },
  {
    title: "Living manuscript",
    visual: "manuscript",
    caption:
      "Warm paper, sparse notes, and quiet editorial pacing for the book layer.",
    usage:
      "Book, fragments, and writing update areas.",
  },
  {
    title: "Matter as pattern",
    visual: "cosmic-cell",
    caption:
      "A scale-ambiguous image language: cell, planet, proton, galaxy, and thought field at once.",
    usage:
      "Science page, supporting diagrams, and atmospheric detail.",
  },
];

export const COLOR_SWATCHES: ColorSwatch[] = [
  {
    name: "Void Black",
    hex: "#050806",
    role: "Primary background. Deep, quiet, spacious.",
  },
  {
    name: "Field Charcoal",
    hex: "#111612",
    role: "Panels, section bands, and dark surfaces.",
  },
  {
    name: "Particle Cream",
    hex: "#F2F0E9",
    role: "Primary text, particle light, and manuscript warmth.",
  },
  {
    name: "Soft Sage",
    hex: "#9FB5AA",
    role: "Scientific calm, secondary labels, and field lines.",
  },
  {
    name: "Moss Depth",
    hex: "#2E4036",
    role: "Grounding accent and quiet navigation states.",
  },
  {
    name: "Ember Clay",
    hex: "#CC5833",
    role: "Human warmth, focus moments, and small signal accents.",
  },
  {
    name: "Ash Vellum",
    hex: "#CFC7AE",
    role: "Muted editorial surfaces and supporting copy warmth.",
  },
];

export const TYPOGRAPHY_DIRECTIONS: TypographyDirection[] = [
  {
    role: "Display",
    family: "Cormorant Garamond",
    sample: "The one listening",
    usage:
      "Large, quiet, human, and reflective. Best for hero lines, section titles, and pull quotes.",
  },
  {
    role: "Body",
    family: "Plus Jakarta Sans",
    sample: "Stop. Pause. Notice the voice in the head.",
    usage:
      "Clear strategic copy, brief content, navigation, and calm explanatory paragraphs.",
  },
  {
    role: "Technical",
    family: "ui-monospace",
    sample: "FIELD / AWARENESS / FORM",
    usage:
      "Small labels for science, structure, section markers, and moodboard annotations.",
  },
];

export const TEXTURE_NOTES: MoodboardNote[] = [
  {
    title: "Fine grain",
    body: "Use a very subtle film or paper grain so dark areas feel physical, not digital-flat.",
  },
  {
    title: "Soft edge light",
    body: "Let forms emerge from darkness with low-contrast halos instead of bright glows.",
  },
  {
    title: "Vellum warmth",
    body: "Use warm off-white surfaces for manuscript moments, never pure white.",
  },
  {
    title: "Scale ambiguity",
    body: "Visuals should feel like they could be subatomic, cellular, human, planetary, or cosmic.",
  },
];

export const MOTION_NOTES: MoodboardNote[] = [
  {
    title: "Slow orbit",
    body: "Toroidal paths should move almost imperceptibly, as if the field is breathing.",
  },
  {
    title: "Dissolve, not explode",
    body: "Particles should drift away softly. No chaotic burst effects.",
  },
  {
    title: "Fog clears",
    body: "Reflection sections can transition from low-contrast haze to sharper text and particles.",
  },
  {
    title: "Respect stillness",
    body: "Motion supports attention, but the experience should still feel quiet when nothing is being touched.",
  },
];

export const SPATIAL_DIRECTIONS: SpatialDirection[] = [
  {
    title: "One dominant field",
    principle:
      "Each viewport should have a single focal event: a phrase, a field image, a reflection, or a proof point.",
  },
  {
    title: "Asymmetrical calm",
    principle:
      "Let the composition lean to one side with generous empty space, as if the layout is making room for the visitor to notice.",
  },
  {
    title: "Editorial pauses",
    principle:
      "Use large type, short text, and spacious breaks so the moodboard feels like a sequence of breath, not a grid of assets.",
  },
  {
    title: "Scale shift",
    principle:
      "Move fluidly between human body, particle, cell, planet, manuscript, and field so the visual system feels interconnected.",
  },
];

export const INTERACTION_CUES: InteractionCue[] = [
  {
    title: "Clarity reveal",
    trigger: "Hover, focus, or entering a reflection moment.",
    response:
      "Haze softens, copy sharpens, and a small field line resolves into view.",
  },
  {
    title: "Slow orbit",
    trigger: "Idle state in hero or science areas.",
    response:
      "Toroidal lines rotate at an almost imperceptible pace to imply a living field.",
  },
  {
    title: "Particle drift",
    trigger: "Entering image or science sections.",
    response:
      "Small points separate from form and drift outward without explosion or spectacle.",
  },
  {
    title: "Quiet underline",
    trigger: "Hover or keyboard focus on navigation and CTAs.",
    response:
      "A thin line draws in slowly, signaling invitation instead of urgency.",
  },
];

export const INTERFACE_NOTES: MoodboardNote[] = [
  {
    title: "Navigation",
    body: "Minimal navigation with small labels and enough space to avoid a product-dashboard feeling.",
  },
  {
    title: "Cards",
    body: "Use thin borders, low-contrast panels, and 8px radius. Avoid nested card stacks.",
  },
  {
    title: "Buttons",
    body: "CTAs should feel like invitations: Begin with a reflection, Explore the book, Read the science.",
  },
  {
    title: "Section rhythm",
    body: "Alternate dense strategic notes with open visual pauses so the visitor can process.",
  },
];

export const AVOID_NOTES = [
  "Generic wellness imagery",
  "Bright purple spiritual gradients",
  "Clinical dashboard visuals",
  "Overly literal galaxy backgrounds",
  "Hard sales CTAs",
  "Dense blocks of explanation without pause",
  "Rigid step-by-step transformation language",
];
