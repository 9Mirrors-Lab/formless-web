export type BriefSection = {
  number: number;
  id: string;
  title: string;
  lead: string;
  body?: string[];
  items?: Array<{
    label: string;
    text: string;
  }>;
  callout?: string;
};

export type MessagingPillar = {
  name: string;
  coreIdea: string;
  supportingLanguage: string;
  exampleCopy: string;
};

export type JourneyStep = {
  label: string;
  intent: string;
  visitorThought: string;
};

export type SiteStructureItem = {
  name: string;
  purpose: string;
  suggestedContent: string;
  cta: string;
};

export type HomepageSection = {
  sectionName: string;
  purpose: string;
  suggestedHeadline: string;
  keyContent: string;
  designNotes: string;
  cta?: string;
};

export type CreativeDirectionItem = {
  label: string;
  direction: string;
};

export type ContentOpportunity = {
  type: string;
  ideas: string[];
};

export type CtaRecommendation = {
  label: string;
  where: string;
  why: string;
  buttonText: string;
};

export type QuestionGroup = {
  group: string;
  questions: string[];
};

export const WEBSITE_BRIEF = {
  title: "Website Strategy & Creative Brief",
  eyebrow: "Formless / Client Meeting Synthesis",
  summary:
    "A practical creative brief for shaping the Formless website around pause, inner observation, relief, and the beginning of a larger teaching.",
};

export const POSITIONING_STATEMENT =
  "For anyone who has had enough with suffering, stress, pain, anger, and the undertow of not enough, this website offers a quiet invitation to stop, pause, go within, and meet the work behind Formless so they can begin to live with more space, peace, and groundedness regardless of outer circumstances.";

export const BRIEF_SECTIONS: BriefSection[] = [
  {
    number: 1,
    id: "project-summary",
    title: "Project Summary",
    lead:
      "Formless is a quiet website for a book and teaching that invites people to stop trying to solve life only from the outside and begin observing what is happening within.",
    body: [
      "The project is not meant to feel like a conventional sales page. It should feel like an invitation into a different way of seeing life, suffering, thought, resistance, and peace.",
      "The client described the work as the beginning of something larger: a book, future science writing, talks, retreats, community, and deeper teachings that all stem from this foundation.",
    ],
  },
  {
    number: 2,
    id: "core-website-goal",
    title: "Core Website Goal",
    lead:
      "The website's main job is to help visitors recognize that the quality of their inner life is being dictated by outer circumstances, then offer a simple doorway into another way of living.",
    body: [
      "The site should help the visitor feel seen without being overwhelmed, then create enough space for the central insight to land: there is a voice in the head, and you are the one listening to it.",
      "The experience should produce relief. Not the relief of a quick fix, but the relief of realizing the change being offered is internal, simple, and available now.",
    ],
  },
  {
    number: 3,
    id: "primary-audience",
    title: "Primary Audience",
    lead:
      "The client named the primary audience as anyone who has had enough.",
    items: [
      {
        label: "Who they are",
        text: "People who are tired of living from suffering, stress, pain, anger, lack, discontentment, and constant chasing.",
      },
      {
        label: "What they are experiencing",
        text: "They feel controlled by outside events: an email shifts their whole day, a relationship triggers rage, money creates fear, work becomes identity, or family dynamics keep pulling them back into old reactions.",
      },
      {
        label: "What they need",
        text: "They need a pause, a reframe, and a direct way to notice the mind without judging what arises.",
      },
      {
        label: "How they arrive",
        text: "They may arrive heavy, skeptical, exhausted, overwhelmed, searching for steps, or quietly open because something in life is no longer working.",
      },
    ],
  },
  {
    number: 4,
    id: "audience-pain-points",
    title: "Audience Pain Points",
    lead:
      "The strongest messaging opportunities are everyday moments where outer life appears to control inner peace.",
    items: [
      {
        label: "Outer events determine inner state",
        text: "Example: reading one email and letting it shift the rest of the day. Messaging opportunity: name how quickly people give their power away to what happens outside them.",
      },
      {
        label: "Reactive anger and resistance",
        text: "Example: a boss, partner, child, parent, or colleague says something and rage takes over. Messaging opportunity: invite visitors to ask what is really being activated.",
      },
      {
        label: "The undertow of not enough",
        text: "The client named the recurring sense that something is missing, they are not there yet, or fulfillment is somewhere else. Messaging opportunity: expose the search itself as part of the suffering.",
      },
      {
        label: "The need for steps",
        text: "Visitors may want a step one, step two, step three path. Messaging opportunity: offer gentle structure, but make observation and understanding come before rigid instructions.",
      },
      {
        label: "Spiritual skepticism",
        text: "Some visitors may trust science before spirituality. Messaging opportunity: include a science section as support, not as the lead message.",
      },
    ],
  },
  {
    number: 5,
    id: "core-transformation",
    title: "Core Transformation",
    lead:
      "The visitor should move from being absorbed in the problem to recognizing the awareness behind the problem.",
    items: [
      {
        label: "Before visiting the site",
        text: "The visitor feels caught in stress, anger, pain, lack, or life circumstances. They believe the problem is the email, the job, the money, the child, the partner, the body, the boss, or the situation.",
      },
      {
        label: "After engaging with the site",
        text: "The visitor begins to see that the mind is creating and sustaining the narrative. They feel a little more space, less judgment, and a possible way to live rooted, grounded, and at peace regardless of outer circumstances.",
      },
    ],
  },
  {
    number: 6,
    id: "positioning-statement",
    title: "Positioning Statement",
    lead: POSITIONING_STATEMENT,
  },
  {
    number: 7,
    id: "messaging-pillars",
    title: "Messaging Pillars",
    lead:
      "The website should be built around a small set of repeatable truths, each grounded in the client's meeting language.",
  },
  {
    number: 8,
    id: "visitor-journey",
    title: "Visitor Journey",
    lead:
      "The journey should feel like a gradual clearing: first the visitor feels seen, then they are invited into a new way of perceiving the same life.",
  },
  {
    number: 9,
    id: "recommended-site-structure",
    title: "Recommended Site Structure",
    lead:
      "Ship a focused first release with a clear core journey and room to expand into supporting pages once the manuscript, science content, and community direction are clearer.",
  },
  {
    number: 10,
    id: "homepage-flow",
    title: "Homepage Flow",
    lead:
      "The homepage should begin with recognition and relief, then move into insight, reflection, support, and invitation.",
  },
  {
    number: 11,
    id: "creative-direction",
    title: "Creative Direction",
    lead:
      "The visual language should translate the client's words into a calm, simple, spacious, softly cinematic experience.",
  },
  {
    number: 12,
    id: "content-opportunities",
    title: "Content Opportunities",
    lead:
      "The meeting surfaced several content types that can help the site grow without making the first version feel crowded.",
  },
  {
    number: 13,
    id: "voice-and-tone",
    title: "Voice and Tone",
    lead:
      "The voice should be direct, grounded, quiet, and spacious. It should sound like an invitation, not a lesson plan or a sales pitch.",
    items: [
      {
        label: "Tone keywords",
        text: "Calm, direct, spacious, compassionate, clear, reflective, nonjudgmental, grounded.",
      },
      {
        label: "Writing style",
        text: "Short sentences. Simple questions. Few claims. Lots of room. Use plain words for profound ideas.",
      },
      {
        label: "Words and phrases to use",
        text: "Stop. Pause. Go within. Allow. No judgment. The voice in the head. The one listening. Outer circumstances. Inner environment. Rooted. Grounded. At peace. A moment to reflect.",
      },
      {
        label: "Words and phrases to avoid",
        text: "Optimization language, hype, urgency, funnels, hacks, guaranteed outcomes, spiritual jargon that has not been grounded in plain language.",
      },
    ],
    callout:
      "Sample tone: You do not have to rearrange your entire life to begin. For one moment, stop. Notice the voice in the head. Notice the story it is telling. If you can hear it, who is listening?",
  },
  {
    number: 14,
    id: "calls-to-action",
    title: "Calls to Action",
    lead:
      "Calls to action should feel like doorways, not pressure points. They should guide the visitor deeper while preserving calm.",
  },
  {
    number: 15,
    id: "open-questions",
    title: "Open Questions for the Client",
    lead:
      "These questions should be answered before final design and development decisions are locked.",
  },
  {
    number: 16,
    id: "final-recommendation",
    title: "Final Strategic Recommendation",
    lead:
      "Build the first version as a quiet experience that makes the visitor feel seen, creates the pause, explains the central insight, and invites reflection before asking for any action.",
    body: [
      "The strongest direction is not to make Formless feel like a brand selling a method. It should feel like a space where the visitor briefly stops living from the problem and begins noticing the mind that is narrating it.",
      "Lead with the human pain state, not the concept. Support the teaching with science when you introduce that material. Keep the language simple and the visual field spacious. Let the book be positioned as the guide, but let the site itself give the visitor an immediate experience of relief, clarity, and possibility.",
    ],
  },
];

export const MESSAGING_PILLARS: MessagingPillar[] = [
  {
    name: "Anyone Who Has Had Enough",
    coreIdea:
      "The site should speak to the moment when a person is done living the same way.",
    supportingLanguage:
      "Suffering, stress, pain, anger, lack, discontentment, and the feeling that something is missing.",
    exampleCopy:
      "For the part of you that is tired of being pulled around by life.",
  },
  {
    name: "You Are Not the Voice",
    coreIdea:
      "The central reframe is that the voice in the head is being observed by something deeper.",
    supportingLanguage:
      "If you can hear the voice, you are not the voice. You are the one listening.",
    exampleCopy:
      "There is a voice in the head. And then there is the one who hears it.",
  },
  {
    name: "Peace Is Not Circumstantial",
    coreIdea:
      "The visitor can begin to live rooted and grounded without depending on life to arrange itself perfectly.",
    supportingLanguage:
      "Life is not here to make you happy. Its purpose is to wake you up.",
    exampleCopy:
      "A way to live at peace, regardless of what is happening around you.",
  },
  {
    name: "Allow Without Judgment",
    coreIdea:
      "The site should normalize seeing thoughts, resistance, and reactions without self-attack.",
    supportingLanguage:
      "Allow what comes up. Do not judge the thought, the feeling, or yourself for seeing it.",
    exampleCopy:
      "Let it be seen. Let it be allowed. Let judgment soften.",
  },
  {
    name: "Every Problem Points to the Same Pattern",
    coreIdea:
      "Career, money, body, family, parenting, and relationships can all become mirrors of the same inner mechanism.",
    supportingLanguage:
      "Eventually the site should help visitors grasp that the problem category changes, but the source pattern is the same.",
    exampleCopy:
      "The situation may change. The pattern is the same.",
  },
];

export const VISITOR_JOURNEY: JourneyStep[] = [
  {
    label: "Recognition",
    intent: "The visitor feels seen in their exhaustion, anger, stress, or searching.",
    visitorThought: "This is what my life feels like.",
  },
  {
    label: "Pause",
    intent: "The moment interrupts the doing, fixing, solving reflex.",
    visitorThought: "Maybe I can stop for a moment.",
  },
  {
    label: "Reframe",
    intent: "The visitor is introduced to the voice in the head and the listener behind it.",
    visitorThought: "If I can hear the voice, maybe I am not the voice.",
  },
  {
    label: "Trust",
    intent: "The visitor understands the book and author as a guide into this recognition, with science as optional support.",
    visitorThought: "This is not asking me to believe blindly.",
  },
  {
    label: "Invitation",
    intent: "Reflection prompts make the teaching feel immediate and personal.",
    visitorThought: "I can try this with the problem I am carrying right now.",
  },
  {
    label: "Action",
    intent: "The visitor chooses a calm next step: reflect, read, join updates, or contact.",
    visitorThought: "There is a way deeper in.",
  },
];

export const SITE_STRUCTURE: SiteStructureItem[] = [
  {
    name: "Home",
    purpose: "Create recognition, relief, and the core reframe.",
    suggestedContent:
      "Hero, pain mirror, voice-in-the-head insight, problem categories, reflection moment, science bridge, book invitation, author preview, soft CTA.",
    cta: "Begin with a reflection",
  },
  {
    name: "The Book",
    purpose: "Position the book as the guide into the teaching.",
    suggestedContent:
      "Short description, what the book points to, approved passages or chapter themes, and the role of reflection.",
    cta: "Explore the book",
  },
  {
    name: "Science",
    purpose: "Support visitors who need a rational bridge into the spiritual material.",
    suggestedContent:
      "Selected ideas from the science chapter or approved notes, kept simple and connected to the same core transformation.",
    cta: "Read the science",
  },
  {
    name: "About",
    purpose: "Introduce the human behind the work without over-branding.",
    suggestedContent:
      "A simple author note, natural photography, why this work exists, and how it is evolving.",
    cta: "Meet the author",
  },
  {
    name: "Updates or Community",
    purpose: "Give interested visitors a soft path to stay close to the work.",
    suggestedContent:
      "Email updates, future talks, retreats, reflections, or community notes once the direction is confirmed.",
    cta: "Stay close to the work",
  },
];

export const HOMEPAGE_FLOW: HomepageSection[] = [
  {
    sectionName: "Hero: Stop, Pause, Go Within",
    purpose:
      "Create immediate calm and name the invitation before explaining too much.",
    suggestedHeadline: "There is another way to live.",
    keyContent:
      "Short supporting copy about stopping, pausing, and noticing the mind instead of trying to radically change outer circumstances.",
    designNotes:
      "Full first viewport with nature, muted dark tones, generous negative space, and minimal navigation. The brand can be type-only.",
    cta: "Begin with a reflection",
  },
  {
    sectionName: "Recognition: When Life Outside Runs Life Inside",
    purpose:
      "Reflect everyday pain states back to the visitor with specificity.",
    suggestedHeadline: "One email can shift the whole day.",
    keyContent:
      "Use concise examples: email, boss, child, partner, money, body, family, career. End by naming the shared pattern.",
    designNotes:
      "Use a sparse grid or rotating line system. Keep examples brief so this section does not become heavy.",
  },
  {
    sectionName: "Reframe: You Are the One Listening",
    purpose:
      "Introduce the central insight in the simplest possible language.",
    suggestedHeadline: "If you can hear the voice, who is listening?",
    keyContent:
      "Explain that recognizing the voice in the head creates separation, space, and the possibility of freedom.",
    designNotes:
      "Let this section breathe. Use large type, quiet contrast, and very little supporting copy.",
  },
  {
    sectionName: "Pattern: Every Problem Points Back Within",
    purpose:
      "Show that different life categories point to the same inner mechanism.",
    suggestedHeadline: "The subject changes. The pattern remains.",
    keyContent:
      "Health, body, money, career, spouse, child, parents, siblings, boss, colleagues. Invite visitors to fill in their own problem.",
    designNotes:
      "Interactive or editorial treatment: selectable problem labels that resolve into one shared message.",
  },
  {
    sectionName: "Reflection: A Moment to Reflect",
    purpose:
      "Turn strategy into experience by asking the visitor to observe their own resistance.",
    suggestedHeadline: "What would happen if you allowed this moment to be here?",
    keyContent:
      "Ask one direct question. Guide the visitor to notice thought, feeling, resistance, and judgment without forcing an answer.",
    designNotes:
      "Use the client's fog-to-clarity idea: a soft visual clearing as the visitor enters the reflection area.",
    cta: "Sit with the question",
  },
  {
    sectionName: "Science: A Quiet Bridge",
    purpose:
      "Support the spiritual message for visitors who need grounded evidence.",
    suggestedHeadline: "A bridge for the part of you that needs to understand.",
    keyContent:
      "Use a few science hooks that support the main insight. Keep it secondary to the lived experience.",
    designNotes:
      "Avoid clinical dashboard styling. Use simple diagrams, soft particles, or restrained visual metaphors.",
    cta: "Explore the science",
  },
  {
    sectionName: "Book: What the Work Points To",
    purpose:
      "Position the book as the deeper guide without turning this invitation into a hard sell.",
    suggestedHeadline: "The book is a doorway into the recognition.",
    keyContent:
      "Introduce the book as the foundation of the broader teaching. Include approved excerpts or highlighted sentences once finalized.",
    designNotes:
      "Editorial layout, quiet manuscript feel, restrained pull quotes.",
    cta: "Explore the book",
  },
  {
    sectionName: "About: The Human Behind Formless",
    purpose:
      "Humanize the work while preserving mystery and simplicity.",
    suggestedHeadline: "A living teaching, still unfolding.",
    keyContent:
      "Short author context, natural portrait direction, and the sense that this is the beginning of a larger body of work.",
    designNotes:
      "Use author photography in nature when available. Keep the tone warm, not performative.",
    cta: "Meet the author",
  },
  {
    sectionName: "Invitation: Stay Close to the Work",
    purpose:
      "Offer a next step that fits the quiet, non-salesy strategy.",
    suggestedHeadline: "Return when you are ready.",
    keyContent:
      "Invite visitors to receive updates, join a future community, or contact the author depending on the confirmed launch priority.",
    designNotes:
      "No popups or aggressive capture. Let the CTA feel optional and calm.",
    cta: "Stay close",
  },
];

export const CREATIVE_DIRECTION: CreativeDirectionItem[] = [
  {
    label: "Overall feeling",
    direction:
      "Simple, calm, peaceful, spacious, grounded, reflective, and quietly immersive.",
  },
  {
    label: "Color direction",
    direction:
      "Muted dark tones, cream, charcoal, moss, and restrained clay or soft sunset warmth. Avoid vibrant purple and overly bright sunset color.",
  },
  {
    label: "Typography direction",
    direction:
      "Type-first identity. Use large, elegant editorial headings, readable body copy, and restrained small labels.",
  },
  {
    label: "Layout style",
    direction:
      "Clear navigation and abundant spacing. Sections should feel like pauses, not stacked marketing modules.",
  },
  {
    label: "Photography and imagery",
    direction:
      "Nature, quiet landscapes, organic textures, and eventually author photography in nature. Avoid generic spiritual stock imagery.",
  },
  {
    label: "Motion and interaction",
    direction:
      "Slow reveals, soft transitions, gentle motion, and fog-to-clarity moments around reflection.",
  },
  {
    label: "What to avoid",
    direction:
      "Hype, urgency, dense copy, popups, hard conversion language, overexplaining, rigid steps, loud gradients, and heavy branding.",
  },
];

export const CONTENT_OPPORTUNITIES: ContentOpportunity[] = [
  {
    type: "About page themes",
    ideas: [
      "Why the work exists",
      "The beginning of a larger teaching",
      "The author in nature",
      "The relationship between the book, talks, retreats, and community",
    ],
  },
  {
    type: "Reflection prompts",
    ideas: [
      "What thought is keeping this problem alive right now?",
      "What would happen if you allowed this moment without judgment?",
      "If the outside situation did not need to change first, what would peace feel like?",
      "Who is aware of the voice in the head?",
    ],
  },
  {
    type: "Science/supporting evidence",
    ideas: [
      "Simple science hooks that support the spiritual insight",
      "Short sections that connect perception, matter, and inner experience",
      "A page for visitors who resonate with science first",
    ],
  },
  {
    type: "Problem examples",
    ideas: [
      "Email shifting the whole day",
      "Parenting or relationship reactivity",
      "Career, boss, or colleague triggers",
      "Money, health, body, and family dynamics",
    ],
  },
  {
    type: "Future content",
    ideas: [
      "Approved book excerpts",
      "Short writing updates",
      "Talk or retreat announcements",
      "Community invitations",
      "Client-approved phrases or recurring sayings",
    ],
  },
];

export const CTA_RECOMMENDATIONS: CtaRecommendation[] = [
  {
    label: "Primary CTA",
    where: "Hero, reflection section, and final invitation.",
    why: "It matches the core strategy by asking the visitor to pause before taking any transactional action.",
    buttonText: "Begin with a reflection",
  },
  {
    label: "Book CTA",
    where: "After the core insight, alongside the book invitation.",
    why: "The book should feel like a deeper path once the visitor understands what the work points to.",
    buttonText: "Explore the book",
  },
  {
    label: "Science CTA",
    where: "In the science support section and navigation.",
    why: "It gives skeptical or analytical visitors a grounded way into the same teaching.",
    buttonText: "Read the science",
  },
  {
    label: "Community or updates CTA",
    where: "Footer and final section.",
    why: "It supports the future direction without making the first version feel like a funnel.",
    buttonText: "Stay close to the work",
  },
  {
    label: "Contact CTA",
    where: "Footer or About area only.",
    why: "Contact should remain available without becoming the main pressure point.",
    buttonText: "Contact",
  },
];

export const OPEN_QUESTIONS: QuestionGroup[] = [
  {
    group: "Business goals",
    questions: [
      "What is the most important action for launch: read the book, join updates, contact, or simply understand the work?",
      "Is there a launch date or milestone tied to the book?",
      "How public should the future talks, retreats, or community direction be in version one?",
    ],
  },
  {
    group: "Content",
    questions: [
      "Which book excerpts or highlighted sentences are approved for the website?",
      "Which problem examples feel most important: career, money, parenting, relationships, health, family, or something else?",
      "What science ideas should be included first, and which should wait?",
      "Should the phrase 'there is no such thing as a problem' appear in version one, or should the site lead visitors there more gradually?",
    ],
  },
  {
    group: "Brand and visuals",
    questions: [
      "Should the public-facing name be Formless, the author's full name, Sonica, or a combination?",
      "Is there an existing book cover direction that should influence the site?",
      "When can author photography in nature be captured?",
      "How dark should the overall palette feel compared with the softer sunset warmth mentioned in the meeting?",
    ],
  },
  {
    group: "Technical needs",
    questions: [
      "How should About, Book, and Science be organized in the information architecture (shared entry points vs dedicated routes)?",
      "What email, contact, or community platform should the site connect to?",
      "Does the client need content editing capability, or can the first version be static?",
    ],
  },
  {
    group: "Launch priorities",
    questions: [
      "What content must be ready for launch versus later?",
      "Should the website launch before the manuscript is complete?",
      "What is the minimum version that would feel complete, calm, and truthful?",
    ],
  },
];
