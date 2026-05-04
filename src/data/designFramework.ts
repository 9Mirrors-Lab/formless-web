export type Substep = {
  id: string;
  hash: string;
  label: string;
  guide: string;
  prompt: string;
  output: string;
};

export type Phase = {
  id: string;
  number: 1 | 2 | 3 | 4;
  emoji: string;
  title: string;
  subtitle: string;
  purpose: string;
  substeps: Substep[];
};

export const DESIGN_FRAMEWORK_PHASES: Phase[] = [
  {
    id: "phase-1",
    number: 1,
    emoji: "🌑",
    title: "The Seed",
    subtitle: "The Singularity",
    purpose:
      'To collapse the client\'s infinite "ideas" into a single, unshakeable point of intent. This is the "Higher Time Frame" bias for the entire build.',
    substeps: [
      {
        id: "substep-seed-monad",
        hash: "seed-monad",
        label: "The Monad (Core Idea)",
        guide:
          'This is the site\'s "Central Truth." If the user only remembers one sentence, what is it?',
        prompt:
          "If we had to delete every page except the homepage, what is the one message that must remain to justify this site's existence?",
        output: "Hero_H1_Text",
      },
      {
        id: "substep-seed-mirror",
        hash: "seed-mirror",
        label: "The Mirror (The Entity)",
        guide:
          'Identifying the user\'s current frequency. We don\'t care about their age; we care about their "State of Being" when they arrive.',
        prompt:
          "What is the specific anxiety or desire that led them to type this URL today?",
        output: "User_Persona_Primary_Motivation",
      },
      {
        id: "substep-seed-delta",
        hash: "seed-delta",
        label: "The Delta (The Transmutation)",
        guide:
          "The emotional shift. A website is a machine that moves a human from State A to State B.",
        prompt:
          "Define the 'From/To' shift. Example: From Confused & Overwhelmed to Confident & Empowered.",
        output: "Color_Palette_Selection & Visual_Tone_Directives",
      },
    ],
  },
  {
    id: "phase-2",
    number: 2,
    emoji: "🔊",
    title: "The Vibration",
    subtitle: "The Resonance",
    purpose:
      'To define the "sound" (the messaging) before we define the "sight" (the design).',
    substeps: [
      {
        id: "substep-vibration-resonance",
        hash: "vibration-resonance",
        label: "The Resonance (Main Message)",
        guide:
          "The core promise that attracts the right entities and repels the noise.",
        prompt:
          "What is the 'Support Truth' that proves your Core Idea is real? Give me three pillars of evidence.",
        output: "Feature_Section_Copy",
      },
      {
        id: "substep-vibration-shadow",
        hash: "vibration-shadow",
        label: "Shadow Work (The Friction)",
        guide:
          'Identifying the blockages in the field. What stops the "Conversion" from happening?',
        prompt:
          "Why would someone not buy/contact you? What is their #1 skepticism?",
        output: "FAQ_Content & Social_Proof_Strategy",
      },
      {
        id: "substep-vibration-vector",
        hash: "vibration-vector",
        label: "The Vector (The Action)",
        guide: "The kinetic point. Where is all this energy being directed?",
        prompt: "What is the single most important button on this website?",
        output: "Primary_CTA_Button_Label & Success_Page_Redirect_URL",
      },
    ],
  },
  {
    id: "phase-3",
    number: 3,
    emoji: "📐",
    title: "The Geometry",
    subtitle: "The Sacred Grid",
    purpose:
      "To create the container for the vibration. This is the structural architecture.",
    substeps: [
      {
        id: "substep-geometry-grid",
        hash: "geometry-grid",
        label: "The Sacred Grid (Sitemap)",
        guide:
          "The minimal viable path. If a page doesn't serve the Vector, it is a fractal break.",
        prompt:
          "What are the fewest number of pages required to facilitate the 'Delta' (The Shift)?",
        output: "Navigation_Menu_Config & URL_Structure",
      },
      {
        id: "substep-geometry-chambers",
        hash: "geometry-chambers",
        label: "The Chambers (Page Blueprints)",
        guide:
          'Every page is a sacred space with a job. No "filler" sections allowed.',
        prompt:
          "For the Homepage: How do we sequence the Hook, the Proof, and the Action to ensure the user doesn't lose the signal?",
        output: "React_Component_Stack (Hero → Value → Social Proof → CTA)",
      },
    ],
  },
  {
    id: "phase-4",
    number: 4,
    emoji: "💎",
    title: "The Manifestation",
    subtitle: "The Density",
    purpose: "Bringing the project into the physical plane. The final assembly.",
    substeps: [
      {
        id: "substep-manifestation-aura",
        hash: "manifestation-aura",
        label: "The Aura (Design Direction)",
        guide:
          'The visual frequency. Should it be "Surgical & Minimal" or "Warm & Organic"?',
        prompt:
          "Describe the 'Visual Density': is it high-contrast and data-driven, or soft and immersive?",
        output: "CSS_Variable_Theme (Spacing, Radius, Contrast Ratio)",
      },
      {
        id: "substep-manifestation-pulse",
        hash: "manifestation-pulse",
        label: "The Pulse (Interaction)",
        guide:
          'The site\'s "Heartbeat." Motion is used to draw attention to the Vector, not for decoration.',
        prompt:
          "Where should the user's eye move first? How do the elements 'arrive' as the user scrolls?",
        output: "Framer_Motion_Config (Staggered Children, Scroll Reveals)",
      },
      {
        id: "substep-manifestation-ledger",
        hash: "manifestation-ledger",
        label: "The Material Ledger (Assets)",
        guide: "Gathering the physical atoms needed to build the world.",
        prompt:
          "Checklist: High-res Logos? Brand Photos? Service Pricing? Team Bios? Policies?",
        output: "Asset_Final_Checklist",
      },
    ],
  },
];

export const ALL_SUBSTEPS: Substep[] = DESIGN_FRAMEWORK_PHASES.flatMap((p) =>
  p.substeps.map((s) => s)
);

/** Stable list for scroll observers and hash routing. */
export const ALL_SUBSTEP_HASHES = ALL_SUBSTEPS.map((s) => s.hash);
