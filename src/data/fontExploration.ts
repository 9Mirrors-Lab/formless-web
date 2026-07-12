export type FontRole = "serif-display" | "serif-editorial" | "serif-organic" | "sans-ui";

export type FontCandidate = {
  id: string;
  name: string;
  /** Exact family name only — no fallbacks. */
  family: string;
  /** Override section role when this face is sans vs serif. */
  role?: FontRole;
  /** Shown on card when the family is on a free CDN. */
  free?: boolean;
};

export type FontCategory = {
  id: string;
  title: string;
  replaces: string;
  role: FontRole;
  intent: string;
  current: FontCandidate;
  alternatives: FontCandidate[];
};

export type FontFeelsSection = {
  id: string;
  title: string;
  feels: readonly string[];
  intent: string;
  role: FontRole;
  fonts: FontCandidate[];
};

const clinicalAlternatives: FontCandidate[] = [
  { id: "canela", name: "Canela", family: "Canela" },
  { id: "austin", name: "Austin", family: "Austin" },
  { id: "sangbleu", name: "SangBleu", family: "SangBleu" },
  { id: "ivar", name: "Ivar", family: "Ivar" },
  { id: "lyon", name: "Lyon", family: "Lyon" },
];

const editorialAlternatives: FontCandidate[] = [
  { id: "financier", name: "Financier", family: "Financier" },
  { id: "tiempos", name: "Tiempos", family: "Tiempos" },
  { id: "domaine", name: "Domaine", family: "Domaine" },
  { id: "roslindale", name: "Roslindale", family: "Roslindale" },
  { id: "noe-display", name: "Noe Display", family: "Noe Display" },
];

const organicAlternatives: FontCandidate[] = [
  { id: "freight-display", name: "Freight Display", family: "Freight Display" },
  { id: "recoleta", name: "Recoleta", family: "Recoleta" },
  { id: "cooper-bt", name: "Cooper BT", family: "Cooper BT" },
  { id: "soft-serif", name: "Soft Serif", family: "Soft Serif" },
  { id: "plantin", name: "Plantin", family: "Plantin" },
];

const futuristicAlternatives: FontCandidate[] = [
  { id: "sohne", name: "Söhne", family: "Söhne" },
  { id: "suisse", name: "Suisse Int'l", family: "Suisse Int'l" },
  { id: "abc-diatype", name: "ABC Diatype", family: "ABC Diatype" },
  { id: "fk-grotesk", name: "FK Grotesk", family: "FK Grotesk" },
  { id: "neue-montreal", name: "Neue Montreal", family: "Neue Montreal" },
];

export const FONT_FEELS_SECTION: FontFeelsSection = {
  id: "feels",
  title: "Feels",
  feels: ["handcrafted", "calm", "creative", "organic"],
  role: "serif-organic",
  intent:
    "Warmer, more human type with subtle imperfection. Headlines and teaching copy share the same voice; UI stays in Plus Jakarta Sans.",
  fonts: [
    { id: "feels-fraunces", name: "Fraunces", family: "Fraunces", free: true },
    { id: "feels-recoleta", name: "Recoleta", family: "Recoleta" },
    { id: "feels-cooper", name: "Cooper", family: "Cooper" },
    { id: "feels-soft-serif", name: "Soft Serif", family: "Soft Serif" },
    {
      id: "feels-zen-kaku",
      name: "Zen Kaku Gothic New",
      family: "Zen Kaku Gothic New",
      role: "sans-ui",
      free: true,
    },
    {
      id: "feels-zen-old-mincho",
      name: "Zen Old Mincho",
      family: "Zen Old Mincho",
      free: true,
    },
    {
      id: "feels-noto-serif-jp",
      name: "Noto Serif JP",
      family: "Noto Serif JP",
      free: true,
    },
  ],
};

export const FONT_CATEGORIES: FontCategory[] = [
  {
    id: "clinical-luxury",
    title: "Clinical luxury",
    replaces: "Cormorant Garamond",
    role: "serif-display",
    intent:
      "More modern while keeping sophistication. Tighter curves, cleaner contrast, less antique warmth.",
    current: {
      id: "cormorant",
      name: "Cormorant Garamond",
      family: "Cormorant Garamond",
    },
    alternatives: clinicalAlternatives,
  },
  {
    id: "modern-editorial",
    title: "Modern editorial",
    replaces: "Playfair Display",
    role: "serif-editorial",
    intent:
      "More personality in display moments. Sharper editorial voice without losing luxury restraint.",
    current: {
      id: "playfair",
      name: "Playfair Display",
      family: "Playfair Display",
    },
    alternatives: editorialAlternatives,
  },
  {
    id: "organic-luxury",
    title: "Organic luxury",
    replaces: "EB Garamond",
    role: "serif-organic",
    intent: "Warmer and more human. Softer rhythm for long reading and teaching copy.",
    current: {
      id: "eb-garamond",
      name: "EB Garamond",
      family: "EB Garamond",
    },
    alternatives: organicAlternatives,
  },
  {
    id: "futuristic-luxury",
    title: "Futuristic luxury",
    replaces: "Inter",
    role: "sans-ui",
    intent:
      "Cleaner geometry with more character in UI, nav, and body. Replaces neutral grotesks.",
    current: {
      id: "inter",
      name: "Inter",
      family: "Inter",
    },
    alternatives: futuristicAlternatives,
  },
];

/** Live production pairing today (DESIGN.md) */
export const PRODUCTION_BASELINE = {
  serif: {
    id: "production-serif",
    name: "Cormorant Garamond",
    family: "Cormorant Garamond",
  },
  sans: {
    id: "production-sans",
    name: "Plus Jakarta Sans",
    family: "Plus Jakarta Sans",
  },
} as const;

export const SAMPLE_COPY = {
  eyebrow: "Eyes Closed",
  headlinePrimary: "Remembering who",
  headlineSecondary: "you are beyond the mind",
  lede:
    "A contemplative space for inquiry into identity, relationship, and the patterns that keep us from resting in what is already here.",
  body:
    "Every reaction in a relationship is a mirror of something unresolved within you. Freedom begins not through blame or resistance, but through awareness.",
  nav: ["The Practice", "Formless", "Spirituality & Science", "About"],
  button: "Begin reflection",
  sectionTitle: "The Practice",
} as const;
