/** Formless reader endorsements. Source copy for cover, Amazon, site, and press. */

export const ENDORSEMENT_VOICES = [
  'clinical',
  'professional',
  'lived',
  'peer',
] as const;

export type EndorsementVoice = (typeof ENDORSEMENT_VOICES)[number];

export const ENDORSEMENT_THEMES = [
  'peace-within',
  'presence',
  'authenticity',
  'science',
  'recovery',
  'world-change',
  'self-worth',
] as const;

export type EndorsementTheme = (typeof ENDORSEMENT_THEMES)[number];

export const ENDORSEMENT_CUTS = ['full', 'trimmed', 'pull'] as const;

export type EndorsementCutKind = (typeof ENDORSEMENT_CUTS)[number];

export const ENDORSEMENT_PLACEMENTS = [
  'cover',
  'amazon',
  'website',
  'social',
  'press',
  'speaker',
] as const;

export type EndorsementPlacement = (typeof ENDORSEMENT_PLACEMENTS)[number];

export const ENDORSEMENT_STATUSES = [
  'ready',
  'needs-trim',
  'needs-pick',
] as const;

export type EndorsementStatus = (typeof ENDORSEMENT_STATUSES)[number];

export type EndorsementCut = {
  id: string;
  kind: EndorsementCutKind;
  /** Competing trims share kind and split as a / b. */
  variant?: 'a' | 'b';
  text: string;
};

export type Endorsement = {
  id: string;
  name: string;
  role: string;
  /** Extra titles shown in the open record, not the byline. */
  credentials?: string[];
  voices: EndorsementVoice[];
  themes: EndorsementTheme[];
  placements: EndorsementPlacement[];
  status: EndorsementStatus;
  /** Arrival order. Later letters keep a higher number. */
  received: number;
  note?: string;
  cuts: EndorsementCut[];
};

export const ENDORSEMENT_DESK_PATH = '/brand/endorsements';

export type EndorsementOverlay = {
  name?: string;
  role?: string;
  credentials?: string[];
  voices: EndorsementVoice[];
  themes: EndorsementTheme[];
  placements: EndorsementPlacement[];
  note?: string;
};

export const ENDORSEMENTS: Endorsement[] = [
  {
    id: 'sean-cottman',
    name: 'Sean Cottman',
    role: 'Air Traffic Controller, Artist',
    voices: ['professional', 'lived'],
    themes: ['world-change', 'authenticity'],
    placements: ['website', 'amazon', 'social'],
    status: 'ready',
    received: 1,
    cuts: [
      {
        id: 'sean-full',
        kind: 'full',
        text: "I've tried reading and listening to many audiobooks and podcasts and mental health influencers to try to better understand myself and why I react poorly to what I felt was happening to me. Some of these sources have helped a little but nothing like what you'll get from Formless. It is truly a real page turner. Easy to read, and as you go through the different chapters it's as if Soni wrote it for you, it feels very refreshing. This book is a true blessing and gift to the world and reading it will change something in you for the better, it makes too much sense for it not to. This book could change the world, I truly believe that.",
      },
      {
        id: 'sean-trimmed',
        kind: 'trimmed',
        text: 'This book is a true blessing and gift to the world and reading it will change something in you for the better, it makes too much sense for it not to. This book could change the world; I truly believe that.',
      },
      {
        id: 'sean-pull',
        kind: 'pull',
        text: 'This book could change the world; I truly believe that.',
      },
    ],
  },
  {
    id: 'william-lambos',
    name: 'William A. Lambos, PhD',
    role: 'Licensed Psychologist, BCN Neuroscientist',
    credentials: [
      'Author of Brain-Inspired Artificial Intelligence',
      'Data Scientist',
      'CEO, ABF Behavioral Health and CNS Computational Neuroscience',
    ],
    voices: ['clinical'],
    themes: ['science', 'authenticity', 'self-worth'],
    placements: ['cover', 'press', 'amazon', 'website'],
    status: 'ready',
    received: 2,
    cuts: [
      {
        id: 'lambos-full',
        kind: 'full',
        text: "Sonika Cottman has written a formidable book on understanding the Self, and how we benefit from gaining awareness of it. To learn of it again, as we did as infants, is to recognize the illusions that we choose to believe and which are the sources of our self-disturbance. The book is organized so as to show both the nature and the consequences of irrational beliefs about ourselves, with ample information about the reader's own journey.\n\nAs a neuroscientist and licensed neuropsychologist, I was surprisingly pleased with Soni's command of the different languages of science, spirituality, and consciousness, which use different words but say much the same. This book will appeal to many different people, and perhaps for different reasons, but nearly all should find value in it and enjoyment of it. Especially if, like myself, you've experienced self-disturbance and were ready to overcome it.",
      },
      {
        id: 'lambos-trimmed',
        kind: 'trimmed',
        text: 'Sonika Cottman has written a formidable book on understanding the Self, and how we benefit from gaining awareness of it. This book will appeal to many different people, and perhaps for different reasons, but nearly all should find value in it.',
      },
    ],
  },
  {
    id: 'gurprem-singh',
    name: 'Gurprem Singh',
    role: 'Software Engineer',
    voices: ['professional'],
    themes: ['authenticity'],
    placements: ['amazon', 'website'],
    status: 'ready',
    received: 3,
    cuts: [
      {
        id: 'gurprem-full',
        kind: 'full',
        text: "Sonika doesn't just share ideas; she lives them. In her book Formless, her authenticity shines through, offering a thoughtful path to self-awareness and conscious living. By weaving together insights from her complex immigrant upbringing with anecdotes about work and relationship stress, she leaves readers with deeply relatable wisdom for their own lives. Her journey is a true inspiration and a grounded guide to everyday spirituality.",
      },
      {
        id: 'gurprem-trimmed',
        kind: 'trimmed',
        text: "Sonika doesn't just share ideas; she lives them. In her book Formless, her authenticity shines through, offering a thoughtful path to self-awareness and conscious living.",
      },
    ],
  },
  {
    id: 'simrat-saini',
    name: 'Simrat Saini',
    role: 'Mother of three, Retired',
    voices: ['lived'],
    themes: ['peace-within'],
    placements: ['amazon', 'website'],
    status: 'ready',
    received: 4,
    cuts: [
      {
        id: 'simrat-full',
        kind: 'full',
        text: "After reading Formless, I truly believe Sonika has written a book that will help so many people who are searching for peace and happiness in the outside world. Especially in today's fast-paced world, where everyone is always in a hurry and rarely takes time to slow down and look within, Formless can be an eye-opening reminder that the peace and happiness we are searching for may already be within us.",
      },
      {
        id: 'simrat-trimmed',
        kind: 'trimmed',
        text: 'Formless can be an eye-opening reminder that the peace and happiness we are searching for may already be within us.',
      },
    ],
  },
  {
    id: 'rebecca-lanstein',
    name: 'Rebecca Lanstein',
    role: 'Sr. Benefits Analyst, Reputation',
    voices: ['professional'],
    themes: ['presence', 'peace-within'],
    placements: ['amazon', 'website'],
    status: 'ready',
    received: 5,
    cuts: [
      {
        id: 'rebecca-full',
        kind: 'full',
        text: "Formless is about discovering your inner peace amidst the constant noise of your mind. This beautifully written book gently reminded me that we are not our thoughts or our past, offering a clear path to letting go of things I can't control, reconnecting with my inner self, and staying in the present moment. It offers a wonderful perspective on how our thoughts really make a difference in how we see ourselves and the world around us. Remaining present and living in the now is a good reminder that we can't change the past or predict the future but enjoy the present time.",
      },
      {
        id: 'rebecca-trimmed',
        kind: 'trimmed',
        text: "This beautifully written book gently reminded me that we are not our thoughts or our past, offering a clear path to letting go of things I can't control, reconnecting with my inner self, and staying in the present moment.",
      },
    ],
  },
  {
    id: 'jackie-krawczak',
    name: 'Jackie Krawczak LLC',
    role: 'Leadership and Culture Development Consultant',
    voices: ['professional'],
    themes: ['world-change', 'authenticity'],
    placements: ['cover', 'press', 'speaker', 'social'],
    status: 'ready',
    received: 6,
    cuts: [
      {
        id: 'jackie-full',
        kind: 'full',
        text: 'Formless is the book our society needs right now. For those willing to approach it with an open mind and the courage to be honest and vulnerable, it offers a powerful path toward a happier, more fulfilling life. Refreshing, thought-provoking, and inspiring, Formless is a book readers will return to for insight and meaning long after they have finished it.',
      },
      {
        id: 'jackie-trimmed',
        kind: 'trimmed',
        text: "Refreshing, thought-provoking, and inspiring, Formless is a book readers will return to for insight and meaning long after they've finished it.",
      },
      {
        id: 'jackie-pull',
        kind: 'pull',
        text: 'Formless is the book our society needs right now.',
      },
    ],
  },
  {
    id: 'rittika-saini',
    name: 'Rittika Saini',
    role: 'RNBN',
    voices: ['clinical'],
    themes: ['self-worth'],
    placements: ['social', 'amazon'],
    status: 'ready',
    received: 7,
    cuts: [
      {
        id: 'rittika-full',
        kind: 'full',
        text: 'A powerful path to shifting your mindset. An absolute must-read.',
      },
      {
        id: 'rittika-pull',
        kind: 'pull',
        text: 'A powerful path to shifting your mindset. An absolute must-read.',
      },
    ],
  },
  {
    id: 'jamie-girouard',
    name: 'Jamie Girouard',
    role: 'Chief People Officer',
    voices: ['professional'],
    themes: ['self-worth', 'authenticity'],
    placements: ['cover', 'speaker', 'social'],
    status: 'ready',
    received: 8,
    cuts: [
      {
        id: 'jamie-full',
        kind: 'full',
        text: 'Gorgeous. Powerful. An evolutionary journey anyone can relate to and build strength from.',
      },
      {
        id: 'jamie-pull',
        kind: 'pull',
        text: 'Gorgeous. Powerful. An evolutionary journey anyone can relate to and build strength from.',
      },
    ],
  },
  {
    id: 'mckinna-sandoval',
    name: 'McKinna Sandoval',
    role: 'Friend, Reader, Supporter',
    voices: ['peer'],
    themes: ['peace-within'],
    placements: ['website', 'amazon'],
    status: 'ready',
    received: 9,
    cuts: [
      {
        id: 'mckinna-full',
        kind: 'full',
        text: "In a world that constantly tells us we need to be more, have more, and achieve more to find happiness, Formless offers a beautiful reminder to pause and look inward. Formless encourages us to step away from the noise and recognize that the peace, clarity, and happiness we're searching for may not be found in the world around us, but within ourselves. This is such a beautiful and thought-provoking book, and I know it will resonate with so many people who are simply looking for a little more peace in their lives.",
      },
      {
        id: 'mckinna-trimmed',
        kind: 'trimmed',
        text: "Formless encourages us to step away from the noise and recognize that the peace, clarity, and happiness we're searching for may not be found in the world around us, but within ourselves.",
      },
    ],
  },
  {
    id: 'courtney-gallacher',
    name: 'Courtney Gallacher',
    role: 'Mom, Artist, and Addiction Recovery Facilitator',
    voices: ['lived'],
    themes: ['recovery', 'presence'],
    placements: ['amazon', 'press', 'website'],
    status: 'needs-pick',
    received: 10,
    note: 'Two short versions are still in play. Pick one before Amazon or press use.',
    cuts: [
      {
        id: 'courtney-full',
        kind: 'full',
        text: "Formless is a literal breath of fresh air! The palpable relatability has reinforced my awakening journey. I have been able to apply Sonika's teachings to common issues in my daily life. Her book has also had a profound effect on helping me to recognize and combat addictive habits and compulsive behaviors. Being able to recognize my thoughts as they are happening and not judge them or myself has been truly life-changing! I would recommend Formless to anyone. It is a must read for sure!",
      },
      {
        id: 'courtney-trimmed-a',
        kind: 'trimmed',
        variant: 'a',
        text: 'Formless has had a profound effect on helping me recognize my thoughts without judgment and combat addictive habits and compulsive behaviors. I would recommend Formless to anyone.',
      },
      {
        id: 'courtney-trimmed-b',
        kind: 'trimmed',
        variant: 'b',
        text: 'Formless has had a profound effect on helping me recognize my thoughts without judgment and combat addictive habits and compulsive behaviors. Formless is a literal breath of fresh air! It is a must read for sure!',
      },
    ],
  },
  {
    id: 'stephanie-bass',
    name: 'Stephanie Bass',
    role: 'Mother, Partner, Nurse',
    voices: ['clinical', 'lived'],
    themes: ['presence'],
    placements: ['amazon', 'website'],
    status: 'ready',
    received: 11,
    note: 'She points to the line on page 4: “You are deeper than your thoughts.”',
    cuts: [
      {
        id: 'stephanie-full',
        kind: 'full',
        text: 'Raw, insightful and honest! Stop living in lack and allow yourself to live fully outside your expectations and roles. Sonika gives each reader a true invitation on how to be present and surrender while finding clarity on their way to becoming FORMLESS, because “You are deeper than your thoughts.” Honestly, Formless has been great and did resonate, as a nurse being present is a necessity but in my personal world I underestimated how removed I can be at times, when reflecting on Sonika\'s story that discusses giving attention without an agenda it really made me think about all the things I feel like we all “need to do” in the family instead of being there in that moment and taking in the peace and joy.',
      },
      {
        id: 'stephanie-trimmed',
        kind: 'trimmed',
        text: "Raw, insightful and honest! As a nurse being present is a necessity but also in personal life. Sonika's story made me think about being there in the moment with my family and taking in the peace and joy.",
      },
    ],
  },
  {
    id: 'angie-bains',
    name: 'Angie Bains, MC',
    role: 'Registered Provisional Psychologist',
    voices: ['clinical'],
    themes: ['self-worth', 'science'],
    placements: ['cover', 'press', 'amazon'],
    status: 'ready',
    received: 12,
    cuts: [
      {
        id: 'angie-full',
        kind: 'full',
        text: 'This book offers great insight into the mind and the mind-body connection. It is insightful and beautifully written. Soni does an amazing job weaving psychological concepts into a personal narrative to help bring awareness to unconscious patterns while also offering suggestions for breaking unhelpful thought patterns. Soni has done the work to become her most authentic self, and it shows through her words in this book. It is a must-read for anyone struggling with self-worth, self-esteem, and self-love.',
      },
      {
        id: 'angie-trimmed',
        kind: 'trimmed',
        text: 'Beautifully written and insightful, Formless helps bring awareness to unconscious patterns while also offering suggestions for breaking unhelpful thought patterns. A must-read for anyone struggling with self-worth, self-esteem, or self-love.',
      },
    ],
  },
  {
    id: 'esther-mcdonald',
    name: 'Esther McDonald',
    role: 'HRIS Analyst',
    voices: ['professional'],
    themes: ['authenticity'],
    placements: ['amazon', 'website'],
    status: 'needs-trim',
    received: 13,
    note: 'Arrived later. Still needs a short version.',
    cuts: [
      {
        id: 'esther-full',
        kind: 'full',
        text: 'From the very first pages, Formless is gripping. Soni writes with a transparency and authenticity that readers connect with instantly. Her deep, inward reflection shines through on every page.',
      },
    ],
  },
];

export function overlayFromEndorsement(row: Endorsement): EndorsementOverlay {
  return {
    name: row.name,
    role: row.role,
    credentials: row.credentials,
    voices: row.voices,
    themes: row.themes,
    placements: row.placements,
    note: row.note,
  };
}

export const ENDORSEMENT_OVERLAYS: Record<string, EndorsementOverlay> =
  Object.fromEntries(
    ENDORSEMENTS.map((row) => [row.id, overlayFromEndorsement(row)]),
  );

export function statusFromCuts(
  cuts: readonly EndorsementCut[],
): EndorsementStatus {
  const trimmed = cuts.filter((cut) => cut.kind === 'trimmed');
  if (trimmed.length > 1) return 'needs-pick';
  const hasShort = cuts.some(
    (cut) => cut.kind === 'trimmed' || cut.kind === 'pull',
  );
  if (!hasShort) return 'needs-trim';
  return 'ready';
}

export const VOICE_LABEL: Record<EndorsementVoice, string> = {
  clinical: 'Clinical',
  professional: 'Professional',
  lived: 'Lived life',
  peer: 'Peer',
};

export const VOICE_HELP: Record<EndorsementVoice, string> = {
  clinical:
    'Psychologist, neuroscientist, nurse, or other clinical role. Strongest for cover and press.',
  professional:
    'Work title in the byline: engineer, consultant, analyst, officer. Useful for Amazon and speaker sheets.',
  lived: 'Mother, artist, recovery facilitator, retired. The everyday reader voice.',
  peer: 'Friend, reader, supporter. Warm, not credentialed.',
};

export const THEME_LABEL: Record<EndorsementTheme, string> = {
  'peace-within': 'Peace within',
  presence: 'Presence',
  authenticity: 'Authenticity',
  science: 'Science',
  recovery: 'Recovery',
  'world-change': 'World change',
  'self-worth': 'Self-worth',
};

export const CUT_LABEL: Record<EndorsementCutKind, string> = {
  full: 'Original',
  trimmed: 'Short version',
  pull: 'One-liner',
};

export const CUT_TOGGLE_LABEL: Record<EndorsementCutKind, string> = {
  full: 'Original',
  trimmed: 'Short',
  pull: 'One-liner',
};

export const CUT_HELP: Record<EndorsementCutKind, string> = {
  full: 'The letter as it arrived. Keep for the record and long Amazon blocks.',
  trimmed: 'The working paragraph for Amazon, the site, and most layouts.',
  pull: 'One or two lines for cover, social, and speaker sheets.',
};

export const PLACEMENT_LABEL: Record<EndorsementPlacement, string> = {
  cover: 'Cover',
  amazon: 'Amazon',
  website: 'Site',
  social: 'Social',
  press: 'Press',
  speaker: 'Speaker sheet',
};

export const STATUS_LABEL: Record<EndorsementStatus, string> = {
  ready: 'Ready',
  'needs-trim': 'Needs trim',
  'needs-pick': 'Needs a pick',
};

export type EndorsementVoiceFilter = EndorsementVoice | 'all';
export type EndorsementThemeFilter = EndorsementTheme | 'all';
export type EndorsementStatusFilter = EndorsementStatus | 'all';
export type EndorsementCutView = EndorsementCutKind;

export type EndorsementFilters = {
  voice: EndorsementVoiceFilter;
  theme: EndorsementThemeFilter;
  status: EndorsementStatusFilter;
  cut: EndorsementCutView;
  query: string;
};

export type EndorsementSummary = {
  total: number;
  byVoice: Record<EndorsementVoice, number>;
  byTheme: Record<EndorsementTheme, number>;
  byStatus: Record<EndorsementStatus, number>;
  withPull: number;
  withTrim: number;
};

export function emptyEndorsementSummary(): EndorsementSummary {
  return {
    total: 0,
    byVoice: { clinical: 0, professional: 0, lived: 0, peer: 0 },
    byTheme: {
      'peace-within': 0,
      presence: 0,
      authenticity: 0,
      science: 0,
      recovery: 0,
      'world-change': 0,
      'self-worth': 0,
    },
    byStatus: { ready: 0, 'needs-trim': 0, 'needs-pick': 0 },
    withPull: 0,
    withTrim: 0,
  };
}

export function summarizeEndorsements(
  rows: readonly Endorsement[],
): EndorsementSummary {
  const summary = emptyEndorsementSummary();
  summary.total = rows.length;

  for (const row of rows) {
    for (const voice of row.voices) summary.byVoice[voice] += 1;
    for (const theme of row.themes) summary.byTheme[theme] += 1;
    summary.byStatus[row.status] += 1;
    if (row.cuts.some((cut) => cut.kind === 'pull')) summary.withPull += 1;
    if (row.cuts.some((cut) => cut.kind === 'trimmed')) summary.withTrim += 1;
  }

  return summary;
}

export function isEndorsementVoice(value: string): value is EndorsementVoice {
  return (ENDORSEMENT_VOICES as readonly string[]).includes(value);
}

export function isEndorsementTheme(value: string): value is EndorsementTheme {
  return (ENDORSEMENT_THEMES as readonly string[]).includes(value);
}

export function isEndorsementStatus(value: string): value is EndorsementStatus {
  return (ENDORSEMENT_STATUSES as readonly string[]).includes(value);
}

export function isEndorsementCutKind(
  value: string,
): value is EndorsementCutKind {
  return (ENDORSEMENT_CUTS as readonly string[]).includes(value);
}

export function endorsementFiltersFromSearch(search: string): EndorsementFilters {
  const params = new URLSearchParams(search);
  const voiceRaw = params.get('voice') ?? 'all';
  const themeRaw = params.get('theme') ?? 'all';
  const statusRaw = params.get('status') ?? 'all';
  const cutRaw = params.get('cut') ?? 'trimmed';

  return {
    voice: isEndorsementVoice(voiceRaw) ? voiceRaw : 'all',
    theme: isEndorsementTheme(themeRaw) ? themeRaw : 'all',
    status: isEndorsementStatus(statusRaw) ? statusRaw : 'all',
    cut: isEndorsementCutKind(cutRaw) ? cutRaw : 'trimmed',
    query: params.get('q') ?? '',
  };
}

export function endorsementDeskHref(filters?: Partial<EndorsementFilters>): string {
  const params = new URLSearchParams();
  if (filters?.voice && filters.voice !== 'all') params.set('voice', filters.voice);
  if (filters?.theme && filters.theme !== 'all') params.set('theme', filters.theme);
  if (filters?.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }
  if (filters?.cut && filters.cut !== 'trimmed') params.set('cut', filters.cut);
  const query = filters?.query?.trim();
  if (query) params.set('q', query);
  const encoded = params.toString();
  return encoded ? `${ENDORSEMENT_DESK_PATH}?${encoded}` : ENDORSEMENT_DESK_PATH;
}

export function filterEndorsements(
  rows: readonly Endorsement[],
  filters: Pick<EndorsementFilters, 'voice' | 'theme' | 'status' | 'query'>,
): Endorsement[] {
  const needle = filters.query.trim().toLowerCase();

  return rows.filter((row) => {
    if (filters.voice !== 'all' && !row.voices.includes(filters.voice)) {
      return false;
    }
    if (filters.theme !== 'all' && !row.themes.includes(filters.theme)) {
      return false;
    }
    if (filters.status !== 'all' && row.status !== filters.status) {
      return false;
    }
    if (!needle) return true;

    const haystack = [
      row.name,
      row.role,
      row.note ?? '',
      ...(row.credentials ?? []),
      ...row.cuts.map((cut) => cut.text),
      ...row.voices.map((voice) => VOICE_LABEL[voice]),
      ...row.themes.map((theme) => THEME_LABEL[theme]),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(needle);
  });
}

export function cutsOfKind(
  endorsement: Endorsement,
  kind: EndorsementCutKind,
): EndorsementCut[] {
  return endorsement.cuts.filter((cut) => cut.kind === kind);
}

export function preferredCut(
  endorsement: Endorsement,
  view: EndorsementCutView,
): EndorsementCut {
  const exact = cutsOfKind(endorsement, view);
  if (exact.length > 0) return exact[0]!;

  switch (view) {
    case 'pull': {
      const trimmed = cutsOfKind(endorsement, 'trimmed');
      if (trimmed.length > 0) return trimmed[0]!;
      return endorsement.cuts[0]!;
    }
    case 'trimmed': {
      const pull = cutsOfKind(endorsement, 'pull');
      if (pull.length > 0) return pull[0]!;
      return endorsement.cuts[0]!;
    }
    case 'full':
      return endorsement.cuts[0]!;
    default: {
      const _never: never = view;
      return _never;
    }
  }
}

export function attributionLine(endorsement: Endorsement): string {
  return `${endorsement.name}, ${endorsement.role}`;
}

export function formatEndorsementCopy(
  endorsement: Endorsement,
  cut: EndorsementCut,
): string {
  return `“${cut.text}”\n${attributionLine(endorsement)}`;
}

export function formatEndorsementRecord(endorsement: Endorsement): string {
  const blocks = [
    endorsement.name,
    endorsement.role,
    endorsement.voices.map((voice) => VOICE_LABEL[voice]).join(', '),
  ];

  if (endorsement.note) blocks.push(endorsement.note);

  for (const cut of endorsement.cuts) {
    const variant = cut.variant ? ` ${cut.variant.toUpperCase()}` : '';
    blocks.push(`\n${CUT_LABEL[cut.kind]}${variant}\n${cut.text}`);
  }

  return blocks.join('\n');
}

export function endorsementsToText(
  rows: readonly Endorsement[],
  view: EndorsementCutView,
): string {
  return rows
    .map((row) => formatEndorsementCopy(row, preferredCut(row, view)))
    .join('\n\n');
}
