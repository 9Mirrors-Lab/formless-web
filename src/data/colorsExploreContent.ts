/** Representative copy for Work / About / Science previews on the colors exploration page. */

export const COLORS_EXPLORE_WORK = {
  eyebrow: "The Work",
  title: "Every problem points back within.",
  lead:
    "The situation may change. The subject may change. But the pattern beneath stays the same until it is seen.",
  accordion: [
    {
      id: "relationships",
      title: "Relationships",
      image:
        "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=1000&fit=crop&q=80",
      insight: "The trigger is never the other person.",
    },
    {
      id: "career",
      title: "Career & Money",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1000&fit=crop&q=80",
      insight: "When work becomes identity, losing it feels like dying.",
    },
    {
      id: "body",
      title: "Body & Health",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1000&fit=crop&q=80",
      insight: "The body keeps the score of every unresolved thought.",
    },
  ] as const,
  darkEyebrow: "The central insight",
  darkTitle: "There is a voice in the head.",
  darkAccent: "Who is listening?",
  darkBody:
    "If you can hear the voice, you are not the voice. You are the awareness behind it.",
} as const;

export const COLORS_EXPLORE_ABOUT = {
  eyebrow: "The Author",
  title: "A living teaching, still unfolding.",
  paragraphs: [
    "This work did not begin as a theory. It began as a breaking point: the moment when the old way of living stopped working entirely, and something quieter took its place.",
    "Formless is the beginning of something larger: a book, future talks, retreats, community, and deeper teachings that all stem from one foundation.",
  ],
  image:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1000&fit=crop&q=80",
  futureEyebrow: "What is unfolding",
  futureTitle: "The beginning of something larger.",
  futureItems: [
    {
      title: "Talks & Gatherings",
      desc: "Intimate spaces where the teaching is shared in person.",
    },
    {
      title: "Retreats",
      desc: "Structured days of silence, observation, and gentle guidance.",
    },
  ] as const,
} as const;

export const COLORS_EXPLORE_SCIENCE = {
  eyebrow: "A Quiet Bridge",
  title: "A bridge for the part of you that needs to understand.",
  lead: "The teaching does not depend on science. But for the mind that needs a rational foothold before it can let go. Here is one.",
  pillars: [
    {
      label: "Perception",
      hook: "Your brain is not showing you reality. It is building a prediction.",
      body: "What you see is filtered through memory, expectation, and conditioning.",
    },
    {
      label: "Observation",
      hook: "Conscious observation changes what is being observed.",
      body: "The observer effect mirrors a deeper truth: awareness itself alters the pattern.",
    },
    {
      label: "Neuroplasticity",
      hook: "The neural pathways of suffering can be interrupted: not by force, but by awareness.",
      body: "Repeated patterns of thought create physical grooves in the brain.",
    },
  ] as const,
  bandEyebrow: "The science points to what the teaching already knows",
  bandQuote:
    "You are not the constructed perception. You are the awareness that sees it.",
} as const;
