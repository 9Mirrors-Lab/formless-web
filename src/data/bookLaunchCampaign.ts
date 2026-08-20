/** Book launch sequences. Warm emails, professional emails, and LinkedIn posts. */

export type LaunchChannelId = 'warm' | 'professional' | 'linkedin';

export type LaunchPieceKind = 'email' | 'post';

export type LaunchPhaseId =
  | '3-weeks'
  | '2-5-weeks'
  | '2-weeks'
  | '1-week'
  | '3-5-days'
  | 'eve'
  | 'launch-day'
  | 'mid-launch'
  | 'late-launch'
  | 'final-day'
  | 'post-launch';

export type LaunchView = 'all' | LaunchChannelId | 'intake';

export type LaunchPiece = {
  id: string;
  channel: LaunchChannelId;
  kind: LaunchPieceKind;
  number: number;
  title: string;
  send: string;
  phase: LaunchPhaseId;
  subjects: string[];
  body: string;
};

export type LaunchChannel = {
  id: LaunchChannelId;
  title: string;
  shortTitle: string;
  audience: string;
  tone: string;
  cadence: string[];
  rule: string;
  pieceKind: LaunchPieceKind;
};

export type LaunchPhase = {
  id: LaunchPhaseId;
  label: string;
};

export type LaunchIntakeSection = {
  id: string;
  channel: 'both' | 'warm' | 'professional';
  title: string;
  questions: string[];
  placeholders?: string[];
  note?: string;
};

export type LaunchDeskFilters = {
  campaign: LaunchView;
  piece: string | null;
};

export const LAUNCH_DESK_PATH = '/brand/book-launch-campaign';

export const LAUNCH_CHANNEL_IDS = [
  'warm',
  'professional',
  'linkedin',
] as const satisfies readonly LaunchChannelId[];

export const LAUNCH_VIEWS = [
  'all',
  'warm',
  'professional',
  'linkedin',
  'intake',
] as const satisfies readonly LaunchView[];

export const LAUNCH_PHASES: readonly LaunchPhase[] = [
  { id: '3-weeks', label: '3 weeks before' },
  { id: '2-5-weeks', label: '2.5 weeks before' },
  { id: '2-weeks', label: '2 weeks before' },
  { id: '1-week', label: '1 week before' },
  { id: '3-5-days', label: '3–5 days before' },
  { id: 'eve', label: 'Day before launch' },
  { id: 'launch-day', label: 'Launch day' },
  { id: 'mid-launch', label: 'Mid-launch week' },
  { id: 'late-launch', label: 'Late launch week' },
  { id: 'final-day', label: 'Final day of launch week' },
  { id: 'post-launch', label: 'After launch week' },
];

export const LAUNCH_CHANNELS: Record<LaunchChannelId, LaunchChannel> = {
  warm: {
    id: 'warm',
    title: 'Warm network',
    shortTitle: 'Warm',
    audience:
      'Friends, family, close colleagues, clients, partners, former team members, people who know the author personally.',
    tone: 'Personal, sincere, mission-driven, direct.',
    cadence: [
      '2–3 weeks before launch: 2 emails per week',
      'Launch week: 3–5 emails',
      'Post-launch: 1–2 emails',
    ],
    rule: 'More personal why, gratitude, journey, and a direct ask. “Help me get this to the people who need it.”',
    pieceKind: 'email',
  },
  professional: {
    id: 'professional',
    title: 'Professional list',
    shortTitle: 'Professional',
    audience:
      'Broader email list, old contacts, professional network, past connections, general subscribers, acquaintances, or people who may know of the author but are not personally close.',
    tone: 'Mission-driven, value-led, softer ask, less frequent.',
    cadence: [
      '1 optional opt-in / invitation email',
      '1 ARC / early access email',
      '1 launch day email',
      '1 mid-launch reminder',
      '1 final launch week reminder',
      '1 post-launch thank-you / update',
    ],
    rule: 'More relevance, reader value, and optional opt-in. “If this resonates, here’s how to support it.”',
    pieceKind: 'email',
  },
  linkedin: {
    id: 'linkedin',
    title: 'LinkedIn',
    shortTitle: 'LinkedIn',
    audience:
      'Personal LinkedIn profile. For business and leadership books, keep posts thoughtful, reflective, and story-driven.',
    tone: 'Reflective and story-driven, not overly promotional.',
    cadence: ['Use across the same launch timeline as the email campaigns.'],
    rule: 'One story at a time. Same launch windows as the emails, posted from the personal profile.',
    pieceKind: 'post',
  },
};

export const LAUNCH_PIECES: readonly LaunchPiece[] = [
  {
    id: 'warm-1',
    channel: 'warm',
    kind: 'email',
    number: 1,
    title: 'Personal launch team invitation + ARC',
    send: '3 weeks before launch',
    phase: '3-weeks',
    subjects: [
      'I’d love your help with something meaningful',
      'A personal ask from me',
      'I’m launching my book — and I’d be grateful for your support',
      'Your early copy is ready',
    ],
    body: `Hi [First Name],

I’m getting ready to officially launch my book, *[Book Title]*, on **[Launch Date]**, and I’d be honored to have you be part of the launch team.

This book is deeply personal to me because [INSERT WHY THE AUTHOR WROTE THE BOOK].

My hope is that it reaches [TARGET READERS] who are [DESCRIBE CHALLENGE / DESIRE / TRANSFORMATION].

That’s where your support can make a real difference.

Launch week is **[Launch Week Dates]**, and when more people purchase, review, and share the book during that window, it can help increase visibility on Amazon and make the book easier for new readers to discover.

I’d love to give you early access now so you have time to read or skim it before launch week.

**Download the Advance Reader Copy here:**
[ARC Download Link]

If you’d like to support the launch, here are a few simple ways to help:

1. Read or skim the ARC
2. Purchase the book during launch week
3. Leave an honest review if the book resonates with you
4. Share it with someone who needs this message

[FOR ALREADY-PUBLISHED BOOKS: If you’ve already purchased the ebook or paperback and have read it, you can leave a review now.]

Thank you for being part of this with me.

[Author Name]`,
  },
  {
    id: 'warm-2',
    channel: 'warm',
    kind: 'email',
    number: 2,
    title: 'Why this book matters',
    send: '2.5 weeks before launch',
    phase: '2-5-weeks',
    subjects: [
      'Why I wrote this book',
      'The heart behind the book',
      'Who I hope this book reaches',
      'A little more about why this matters',
    ],
    body: `Hi [First Name],

I wanted to share a little more about why I wrote *[Book Title]*.

[INSERT SHORT PERSONAL STORY OR WHY BEHIND THE BOOK.]

I wrote this for [TARGET READER] who [DESCRIBE WHAT THEY ARE GOING THROUGH].

My hope is that the book helps them [DESCRIBE OUTCOME / TRANSFORMATION].

That’s why launch week matters.

When a book gets more purchases and reviews in a concentrated window, especially during launch day and launch week, it can help create more visibility on Amazon. That visibility gives the book a better chance of reaching readers who may not know me personally but need the message.

If you have time, I’d be grateful if you’d read or skim the ARC before launch week.

**Download the ARC here:**
[ARC Download Link]

Thank you again for helping me get this message into the hands of the people who need it most.

[Author Name]`,
  },
  {
    id: 'warm-3',
    channel: 'warm',
    kind: 'email',
    number: 3,
    title: 'Review prep',
    send: '2 weeks before launch',
    phase: '2-weeks',
    subjects: [
      'A simple review guide',
      'If you plan to review the book, this helps',
      'A few prompts as you read',
      'This will make launch week easier',
    ],
    body: `Hi [First Name],

As launch week gets closer, I wanted to make it easy for anyone who may want to leave an Amazon review.

Reviews are completely optional, and I only ask that they be honest.

If the book resonates with you, even a short review can help another reader decide whether the book is right for them.

A few prompts:

- What stood out to you?
- Who do you think this book is for?
- What part felt most useful, honest, or meaningful?
- What did the book help you think about differently?
- Why might someone else benefit from reading it?

Two or three sentences are plenty.

[FOR ALREADY-PUBLISHED BOOKS: If you’ve already purchased the ebook or paperback and have read it, you can leave your review now:
[Amazon Review Link]]

[FOR NOT-YET-PUBLISHED BOOKS: Amazon reviews can’t be posted until the book is live, but you can draft your review now and post it during launch week.]

Thank you for taking the time to support the book in such a meaningful way.

[Author Name]`,
  },
  {
    id: 'warm-4',
    channel: 'warm',
    kind: 'email',
    number: 4,
    title: 'Shareable assets',
    send: '1 week before launch',
    phase: '1-week',
    subjects: [
      'A few simple ways to share the book',
      'If you feel like sharing next week',
      'Launch tools, all in one place',
      'I made this easy to pass along',
    ],
    body: `Hi [First Name],

Launch week is almost here.

If you’d like to help share *[Book Title]*, I’ve put together a folder with simple copy/paste resources.

**Book Launch Assets Folder:**
[Book Assets Folder Link]

Inside, you’ll find:

- Book cover images
- Short book description
- Social media captions
- Email copy you can forward
- Review guidance
- Purchase link

Here’s one simple message you can copy and paste:

“I thought of you when I saw this book. *[Book Title]* is about [SHORT BOOK POSITIONING]. It’s especially relevant for [TARGET READER]. You can find it here: [Amazon Link].”

The goal is simple: help the book reach the people who need it most.

Thank you for helping me share it.

[Author Name]`,
  },
  {
    id: 'warm-5',
    channel: 'warm',
    kind: 'email',
    number: 5,
    title: 'Launch eve reminder',
    send: 'Day before launch',
    phase: 'eve',
    subjects: [
      'Tomorrow is launch day',
      'We launch tomorrow',
      'One more note before launch day',
      'The book launches tomorrow',
    ],
    body: `Hi [First Name],

Tomorrow is the official launch of *[Book Title]*.

If you haven’t purchased the book yet, tomorrow is the best day to do it.

The goal is to create concentrated activity during launch day and launch week, which can help increase visibility on Amazon and make the book easier for new readers to discover.

**Launch week:** [Launch Week Dates]
**Ebook price during launch week:** [Price]

[FOR ALREADY-PUBLISHED BOOKS: If you’ve already purchased the book and have read it, you can leave your review now:
[Amazon Review Link]]

Thank you for being part of this. Truly.

[Author Name]`,
  },
  {
    id: 'warm-6',
    channel: 'warm',
    kind: 'email',
    number: 6,
    title: 'Launch day',
    send: 'Launch day',
    phase: 'launch-day',
    subjects: [
      'Today is launch day',
      '*[Book Title]* is officially launching today',
      'The launch starts now',
      'Today’s the day',
    ],
    body: `Hi [First Name],

Today is the official launch of *[Book Title]*.

This book was written for [TARGET READER] who [DESCRIBE NEED / CHALLENGE / DESIRE].

My hope is that it helps them [DESCRIBE TRANSFORMATION].

If you’re willing to support the launch today, here are the best ways to help:

1. Purchase the book today
2. Leave an honest review if you’ve read it
3. Share it with someone who needs this message

**Purchase the book here:**
[Amazon Purchase Link]

**Leave an honest review here:**
[Amazon Review Link]

Even one purchase, review, or share can help the book reach more of the right readers.

Thank you for helping this message travel.

[Author Name]`,
  },
  {
    id: 'warm-7',
    channel: 'warm',
    kind: 'email',
    number: 7,
    title: 'Mid-launch review + share reminder',
    send: '2–3 days into launch week',
    phase: 'mid-launch',
    subjects: [
      'If the book resonated, this would help',
      'A quick review request',
      'Could you share this with one person?',
      'One simple way to help this week',
    ],
    body: `Hi [First Name],

Thank you to everyone who has supported the launch so far.

If you’ve read *[Book Title]* and it resonated with you, an honest Amazon review would mean a lot.

**Leave a review here:**
[Amazon Review Link]

A review can be short. Two or three sentences is enough.

And if someone comes to mind who needs this message, I’d be grateful if you shared the book with them.

**Purchase/share link:**
[Amazon Purchase Link]

The goal is not just to sell books. The goal is to help this message reach the people who need it most.

Thank you again,

[Author Name]`,
  },
  {
    id: 'warm-8',
    channel: 'warm',
    kind: 'email',
    number: 8,
    title: 'Final launch week reminder',
    send: 'Final day of launch week',
    phase: 'final-day',
    subjects: [
      'Final day of launch week',
      'Last day to support the launch',
      'One final launch week reminder',
      'Thank you for helping this book reach more readers',
    ],
    body: `Hi [First Name],

Today is the final day of launch week for *[Book Title]*.

If you haven’t purchased the book yet and would still like to support the launch, today is a meaningful day to do it.

**Purchase the book here:**
[Amazon Purchase Link]

If you’ve already read it, an honest review is also deeply appreciated.

**Leave a review here:**
[Amazon Review Link]

Thank you for helping this book reach more readers. Your support means more than you know.

[Author Name]`,
  },
  {
    id: 'warm-9',
    channel: 'warm',
    kind: 'email',
    number: 9,
    title: 'Post-launch thank you',
    send: '2–4 days after launch week',
    phase: 'post-launch',
    subjects: [
      'Thank you for supporting the launch',
      'I’m grateful',
      'A sincere thank-you',
      'Thank you for being part of this',
    ],
    body: `Hi [First Name],

I want to take a moment to say thank you.

Whether you purchased the book, read the ARC, left a review, shared it with someone, or simply cheered it on, I’m grateful.

This book was written to help [TARGET READER] [DESCRIBE OUTCOME], and your support helped give it a stronger chance of reaching those readers.

If you’ve read the book and haven’t had a chance to leave a review yet, there’s still time.

**Leave an honest review here:**
[Amazon Review Link]

Thank you again for being part of this launch and this story.

[Author Name]`,
  },
  {
    id: 'pro-1',
    channel: 'professional',
    kind: 'email',
    number: 1,
    title: 'Soft launch team invitation / optional opt-in',
    send: '3 weeks before launch',
    phase: '3-weeks',
    subjects: [
      'I’m launching something meaningful soon',
      'An invitation, if this resonates',
      'My book launch is coming up',
      'Would you like early access?',
    ],
    body: `Hi [First Name],

I’m getting ready to launch my book, *[Book Title]*, on **[Launch Date]**.

I wrote this book for [TARGET READER] who [DESCRIBE CHALLENGE / NEED / DESIRE].

My hope is that it helps them [DESCRIBE TRANSFORMATION OR OUTCOME].

As launch week approaches, I’m putting together a small group of people who would like early access to the book and may want to help share it with others.

There’s no pressure at all. But if the message resonates with you, I’d be grateful for your support.

Launch week matters because when more people purchase, review, and share the book during a concentrated window, it can help increase visibility on Amazon and make the book easier for new readers to discover.

**Optional opt-in paragraph:**
If you’d like to be part of the Book Launch Team, you’ll receive early access to the book, simple review guidance, and copy/paste tools to make sharing easy.

**CTA Button:**
Join the Book Launch Team
[Opt-In Link]

If you’d rather just follow along, I’ll also share more when the book officially launches.

Thank you,

[Author Name]`,
  },
  {
    id: 'pro-2',
    channel: 'professional',
    kind: 'email',
    number: 2,
    title: 'Early access / ARC delivery',
    send: '2 weeks before launch, or immediately after opt-in',
    phase: '2-weeks',
    subjects: [
      'Your early copy of *[Book Title]*',
      'Early access is here',
      'Thank you for being part of this',
      'Here’s the advance copy',
    ],
    body: `Hi [First Name],

Thank you for your interest in *[Book Title]*.

As promised, here’s the Advance Reader Copy:

**Download the ARC here:**
[ARC Download Link]

The book officially launches on **[Launch Date]**, with launch week running from **[Launch Week Dates]**.

If the book resonates with you, there are three simple ways to support the launch:

1. Purchase the book during launch week
2. Leave an honest review after reading
3. Share it with someone who would benefit from the message

[FOR ALREADY-PUBLISHED BOOKS: If you’ve already purchased the ebook or paperback and have read it, you can leave a review now:
[Amazon Review Link]]

[FOR NOT-YET-PUBLISHED BOOKS: Reviews can’t be posted until the book is live, but you can prepare one in advance.]

Thank you for helping this book reach the people it was written for.

[Author Name]`,
  },
  {
    id: 'pro-3',
    channel: 'professional',
    kind: 'email',
    number: 3,
    title: 'Launch day',
    send: 'Launch day',
    phase: 'launch-day',
    subjects: [
      '*[Book Title]* is officially available',
      'Today is launch day',
      'The book is here',
      'Launch week starts today',
    ],
    body: `Hi [First Name],

Today is the official launch of *[Book Title]*.

I wrote this book to help [TARGET READER] [DESCRIBE OUTCOME / TRANSFORMATION].

If this message resonates with you, I’d be grateful for your support during launch week.

**Purchase the book here:**
[Amazon Purchase Link]

When more people purchase the book during launch day and launch week, it can help increase visibility on Amazon and make the book easier for the right readers to discover.

If you’ve already read the book, an honest review is also deeply appreciated.

**Leave an honest review here:**
[Amazon Review Link]

And if someone comes to mind who would benefit from this message, please feel free to share the book with them.

Thank you,

[Author Name]`,
  },
  {
    id: 'pro-4',
    channel: 'professional',
    kind: 'email',
    number: 4,
    title: 'Mid-launch reminder / value angle',
    send: 'Mid-launch week',
    phase: 'mid-launch',
    subjects: [
      'Who this book was written for',
      'A quick launch week note',
      'If you know someone who needs this',
      'Helping the right readers find this book',
    ],
    body: `Hi [First Name],

As launch week continues, I wanted to share a quick reminder about who *[Book Title]* was written for.

This book is for [TARGET READER] who [DESCRIBE CHALLENGE].

It’s meant to help them [DESCRIBE OUTCOME].

If someone comes to mind as you read that, I’d be grateful if you shared the book with them.

**Purchase/share link:**
[Amazon Purchase Link]

If you’ve read the book and feel moved to leave an honest review, you can do that here:

**Leave a review here:**
[Amazon Review Link]

Even one share or review can help the right reader find the book.

Thank you,

[Author Name]`,
  },
  {
    id: 'pro-5',
    channel: 'professional',
    kind: 'email',
    number: 5,
    title: 'Final launch week reminder',
    send: 'Final day of launch week',
    phase: 'final-day',
    subjects: [
      'Final launch week reminder',
      'Last day to support the launch',
      'One final note about *[Book Title]*',
      'Thank you for helping this reach more readers',
    ],
    body: `Hi [First Name],

Today is the final day of launch week for *[Book Title]*.

If you’ve been meaning to grab a copy, today is a meaningful day to do it.

**Purchase the book here:**
[Amazon Purchase Link]

The goal this week has been to create momentum around the book so it has a better chance of reaching the people it was written to help.

If you’ve already read the book, an honest review is deeply appreciated.

**Leave a review here:**
[Amazon Review Link]

Thank you for your support,

[Author Name]`,
  },
  {
    id: 'pro-6',
    channel: 'professional',
    kind: 'email',
    number: 6,
    title: 'Post-launch thank you / update',
    send: '3–7 days after launch week',
    phase: 'post-launch',
    subjects: [
      'Thank you for the launch support',
      'A quick launch update',
      'I’m grateful',
      'Thank you for helping this book reach more readers',
    ],
    body: `Hi [First Name],

Thank you to everyone who supported the launch of *[Book Title]*.

Whether you purchased the book, shared it with someone, left a review, or simply followed along, I appreciate it.

[INSERT OPTIONAL LAUNCH UPDATE OR RESULT]

This book was written to help [TARGET READER] [DESCRIBE TRANSFORMATION], and your support helped give it a stronger chance of reaching those readers.

If you’ve read the book and haven’t had a chance to leave a review yet, you can still do that here:

**Leave an honest review here:**
[Amazon Review Link]

Thank you again,

[Author Name]`,
  },
  {
    id: 'li-1',
    channel: 'linkedin',
    kind: 'post',
    number: 1,
    title: 'Announcement / why I wrote the book',
    send: '3 weeks before launch',
    phase: '3-weeks',
    subjects: [],
    body: `I wrote *[Book Title]* because [INSERT WHY AUTHOR WROTE THE BOOK].

For me, this book is about [CORE THEME 1], [CORE THEME 2], and [CORE THEME 3].

But more than anything, it’s for [TARGET READER] who [DESCRIBE WHAT THEY ARE NAVIGATING].

My hope is that it helps readers [DESCRIBE OUTCOME / TRANSFORMATION].

The official launch is coming up on [Launch Date], and I’m grateful to finally share more of this story.

More soon.

#BookLaunch #[RelevantHashtag] #[RelevantHashtag]`,
  },
  {
    id: 'li-2',
    channel: 'linkedin',
    kind: 'post',
    number: 2,
    title: 'Behind-the-scenes story',
    send: '2 weeks before launch',
    phase: '2-weeks',
    subjects: [],
    body: `One of the reasons I wrote *[Book Title]* is because the real story behind [TOPIC / COMPANY / EXPERIENCE] is rarely as clean as it looks from the outside.

There are decisions you second-guess.

Partnerships that test you.

Moments that reveal what your values actually are.

And lessons you only understand after you’ve lived them.

This book is not a highlight reel. It’s an honest look at [SHORT DESCRIPTION OF BOOK].

My hope is that it reaches [TARGET READER] who may need that kind of honesty right now.

Launch week begins [Launch Date].`,
  },
  {
    id: 'li-3',
    channel: 'linkedin',
    kind: 'post',
    number: 3,
    title: 'Book launch team invitation',
    send: '2 weeks before launch',
    phase: '2-weeks',
    subjects: [],
    body: `I’m putting together a small launch team for *[Book Title]*.

The goal is simple: help get this book into the hands of the people who need it most.

If you’d like early access and are open to helping share the book during launch week, I’d be grateful to have you involved.

Launch team members will receive:

- Early access to the book
- Simple review guidance
- Copy/paste sharing tools
- Launch week reminders

If you’d like to be part of it, you can join here:

[Opt-In Link]

Thank you for helping this message travel.`,
  },
  {
    id: 'li-4',
    channel: 'linkedin',
    kind: 'post',
    number: 4,
    title: 'Reader / audience-focused post',
    send: '1 week before launch',
    phase: '1-week',
    subjects: [],
    body: `*[Book Title]* was written for [TARGET READER].

For the person who is [DESCRIBE CHALLENGE].

For the leader who is [DESCRIBE INTERNAL TENSION].

For the founder / professional / reader who wants to [DESCRIBE OUTCOME].

If that sounds like you, or someone you know, I hope this book finds its way to them.

Launch week begins [Launch Date].

[Amazon or Waitlist Link]`,
  },
  {
    id: 'li-5',
    channel: 'linkedin',
    kind: 'post',
    number: 5,
    title: 'Lesson from the book',
    send: '3–5 days before launch',
    phase: '3-5-days',
    subjects: [],
    body: `One of the biggest lessons I write about in *[Book Title]* is this:

[INSERT LESSON / QUOTE / IDEA]

I learned this through [SHORT STORY OR CONTEXT].

At the time, it felt like [EMOTION / CHALLENGE].

Looking back, it taught me [INSIGHT].

That’s one of the reasons I wanted to write this book — not just to share the story, but to share the lessons that may help someone else.

Launch week begins [Launch Date].`,
  },
  {
    id: 'li-6',
    channel: 'linkedin',
    kind: 'post',
    number: 6,
    title: 'Launch day',
    send: 'Launch day',
    phase: 'launch-day',
    subjects: [],
    body: `Today is launch day.

*[Book Title]* is officially available.

This book has been [TIMEFRAME / DESCRIPTION OF JOURNEY] in the making, and I’m grateful to finally share it.

I wrote it for [TARGET READER] who [DESCRIBE CHALLENGE / DESIRE].

My hope is that it helps readers [DESCRIBE TRANSFORMATION].

If you’d like to support the launch, here are three simple ways:

1. Purchase the book
2. Leave an honest review if you’ve read it
3. Share it with someone who would benefit from the message

You can find the book here:

[Amazon Link]

Thank you to everyone who has supported this journey.`,
  },
  {
    id: 'li-7',
    channel: 'linkedin',
    kind: 'post',
    number: 7,
    title: 'Mid-launch momentum',
    send: 'Mid-launch week',
    phase: 'mid-launch',
    subjects: [],
    body: `Launch week for *[Book Title]* is underway.

Thank you to everyone who has already purchased, shared, reviewed, or sent a note of encouragement.

It means a lot.

The goal this week is to help the book reach more of the right readers — people who are [DESCRIBE TARGET READER / NEED].

When more people engage with the book during launch week, it can help increase visibility and make it easier for new readers to discover.

If the message resonates with you, I’d be grateful if you shared it with someone who may benefit.

[Amazon Link]`,
  },
  {
    id: 'li-8',
    channel: 'linkedin',
    kind: 'post',
    number: 8,
    title: 'Review request',
    send: 'Mid-to-late launch week',
    phase: 'late-launch',
    subjects: [],
    body: `If you’ve read *[Book Title]* and it resonated with you, I’d be grateful if you’d consider leaving an honest review.

Reviews help readers decide whether a book is right for them.

They also help the book become easier to discover.

A review doesn’t need to be long. A few sentences about what stood out, who the book is for, or why it may help someone else is enough.

Thank you to everyone who has supported the launch so far.

[Review Link]`,
  },
  {
    id: 'li-9',
    channel: 'linkedin',
    kind: 'post',
    number: 9,
    title: 'Final launch week reminder',
    send: 'Final day of launch week',
    phase: 'final-day',
    subjects: [],
    body: `Today is the final day of launch week for *[Book Title]*.

If you’ve been meaning to grab a copy or share it with someone, today is a meaningful day to do it.

The goal has always been bigger than a launch.

It’s about helping the book reach [TARGET READER] who [DESCRIBE NEED / OUTCOME].

Thank you to everyone who has helped make that possible.

[Amazon Link]`,
  },
  {
    id: 'li-10',
    channel: 'linkedin',
    kind: 'post',
    number: 10,
    title: 'Post-launch thank you',
    send: '3–7 days after launch week',
    phase: 'post-launch',
    subjects: [],
    body: `Thank you.

To everyone who purchased *[Book Title]*, shared it, reviewed it, posted about it, or sent a note of encouragement — I’m grateful.

Writing this book was a chance to reflect on [CORE THEME / JOURNEY / LESSON].

Launching it has been a reminder that books travel because people help them travel.

If the book reaches even one person at the right moment, that matters.

Thank you for helping this message reach more readers.

[Amazon Link]`,
  },
];

export const LAUNCH_INTAKE: readonly LaunchIntakeSection[] = [
  {
    id: 'both-why',
    channel: 'both',
    title: 'Why they wrote the book',
    questions: [
      'Why did you write this book?',
      'Why does this book matter to you personally?',
      'What life, business, leadership, professional, personal, or spiritual experience led you to write it?',
      'What message do you most want readers to take away?',
    ],
    placeholders: [
      '[INSERT WHY THE AUTHOR WROTE THE BOOK]',
      '[INSERT SHORT PERSONAL STORY OR WHY BEHIND THE BOOK]',
    ],
  },
  {
    id: 'both-who',
    channel: 'both',
    title: 'Who they want to help',
    questions: [
      'Who is this book really for?',
      'Who do you most want the book to reach?',
      'What kind of reader needs this message right now?',
      'What are they struggling with, navigating, or hoping to change?',
    ],
    placeholders: [
      '[TARGET READER]',
      '[DESCRIBE CHALLENGE / NEED / DESIRE]',
      '[DESCRIBE WHAT THEY ARE GOING THROUGH]',
    ],
  },
  {
    id: 'both-transformation',
    channel: 'both',
    title: 'Reader transformation',
    questions: [
      'What do you hope readers understand, feel, or do after reading the book?',
      'What shift do you want the book to create for them?',
      'How might the book help them think differently, act differently, or feel less alone?',
    ],
    placeholders: [
      '[DESCRIBE OUTCOME / TRANSFORMATION]',
      '[DESCRIBE WHAT THE BOOK HELPS THEM DO]',
      '[DESCRIBE WHY SOMEONE WOULD BENEFIT]',
    ],
  },
  {
    id: 'both-audiences',
    channel: 'both',
    title: 'Specific audiences to share with',
    questions: [
      'Who should launch team members share this book with?',
      'Are there specific industries, professions, communities, or groups the book is especially relevant for?',
      'Are there any audiences we should mention by name?',
    ],
    placeholders: [
      '[SPECIFIC AUDIENCES]',
      '[WHO SHOULD THEY SHARE THIS WITH]',
      '[WHO WOULD BENEFIT FROM THIS BOOK]',
    ],
  },
  {
    id: 'both-personal',
    channel: 'both',
    title: 'Personal message to their network',
    questions: [
      'Is there anything you want to say directly to the people supporting your launch?',
      'How would you explain why their support matters to you?',
      'Is there a personal thank-you or short note you want included?',
    ],
    note: 'Use this especially in the warm network campaign.',
  },
  {
    id: 'both-purchase',
    channel: 'both',
    title: 'Launch week purchase strategy',
    questions: [
      'Are we asking people to purchase on launch day?',
      'Are we asking them to wait until launch week if they have not already purchased?',
      'Will the ebook be discounted?',
      'What is the ebook launch-week price?',
      'Should paperback/hardcover also be mentioned?',
    ],
  },
  {
    id: 'both-review',
    channel: 'both',
    title: 'Review strategy',
    questions: [
      'Are we asking those who already purchased and read the book to review now?',
      'Are we asking ARC readers to prepare a review in advance?',
      'Do we have a direct review link?',
      'Should review reminders be light, moderate, or more direct?',
    ],
    note: 'Keep this language: “Reviews are optional and should be honest.”',
  },
  {
    id: 'both-perks',
    channel: 'both',
    title: 'Incentives / thank-you perks',
    questions: [
      'Would you like to offer a thank-you perk to your launch team?',
      'If yes, what would feel natural and valuable for your audience?',
    ],
    placeholders: [
      '[INSERT INCENTIVE / THANK-YOU PERK DETAILS]',
      '[Bonus or Registration Link]',
    ],
    note: 'Frame incentives as a thank-you for supporting the launch, not as compensation for leaving a review.',
  },
  {
    id: 'warm-who',
    channel: 'warm',
    title: 'Who is in the warm network',
    questions: [
      'Who is included: friends, family, close colleagues, clients, former clients, business partners, former team members, mentors, advisors, longtime supporters?',
      'Are these mostly personal contacts, professional contacts, or both?',
      'Have they been part of your journey in some way?',
      'Would it feel natural to say, “You’ve been part of my journey”?',
    ],
  },
  {
    id: 'warm-tone',
    channel: 'warm',
    title: 'Tone and personal story',
    questions: [
      'What kind of personal tone feels right: warm and heartfelt, professional but personal, reflective, inspirational, direct and simple, or gratitude-focused?',
      'What is one honest sentence about what this book means to you?',
      'What did writing this book bring up for you?',
      'Why does it matter that the people closest to you support it?',
    ],
  },
  {
    id: 'warm-ask',
    channel: 'warm',
    title: 'How direct the ask can be',
    questions: [
      'Are you comfortable directly asking this group to purchase on launch day?',
      'Are you comfortable asking them to leave a review if they read it?',
      'Are you comfortable asking them to share with one person?',
    ],
    note: 'Use this campaign when the author can authentically say: “You’ve been part of my journey, and I’d be grateful for your help getting this book into the hands of the people who need it.”',
  },
  {
    id: 'pro-who',
    channel: 'professional',
    title: 'Who is on the broader list',
    questions: [
      'Who is on this list: general subscribers, past colleagues, professional acquaintances, LinkedIn contacts, past clients, event attendees, people who have not heard from the author in a while?',
      'Do they know you personally?',
      'Do they know your work but not you personally?',
      'Have they heard from you recently?',
      'Is this a cold, warm, or mixed list?',
    ],
  },
  {
    id: 'pro-optin',
    channel: 'professional',
    title: 'Opt-in process',
    questions: [
      'Would you like people to self-select into the Book Launch Team?',
      'Do you want to send the full launch sequence only to those who opt in?',
      'Do you already have an opt-in form or landing page?',
      'Who will create the opt-in page if needed?',
    ],
    placeholders: ['[Opt-In Link]', '[Join the Book Launch Team CTA]'],
  },
  {
    id: 'pro-angle',
    channel: 'professional',
    title: 'Value-led angle and softness',
    questions: [
      'What problem does the book help solve?',
      'What conversation does the book contribute to?',
      'Why is this book timely or relevant for this audience?',
      'What professional insight, leadership lesson, or personal transformation does the book offer?',
    ],
    note: 'Use this campaign when the author needs to say: “If this message resonates with you, I’d be grateful for your support in helping it reach the right readers.”',
  },
];

export const LAUNCH_QUICK_QUESTIONS: readonly string[] = [
  'Why did you write this book?',
  'Who do you most want this book to help?',
  'What do you hope readers take away from it?',
  'What kind of person should your launch team share the book with?',
  'What personal message would you like included in the launch emails?',
  'Who will receive the launch emails?',
  'Is this list mostly warm contacts, broader professional contacts, or both?',
  'Would you like broader contacts to opt in before receiving launch team emails?',
  'Are you offering any thank-you perk or incentive to launch supporters?',
  'Are you comfortable asking people to purchase during launch week to help increase Amazon visibility?',
  'Are you comfortable asking people who have read the book to leave an honest review?',
  'Who is technically setting up and sending the emails?',
];

export const LAUNCH_CHANNEL_LABEL: Record<LaunchChannelId, string> = {
  warm: 'Warm network',
  professional: 'Professional list',
  linkedin: 'LinkedIn',
};

export const LAUNCH_VIEW_LABEL: Record<LaunchView, string> = {
  all: 'All campaigns',
  warm: 'Warm network',
  professional: 'Professional list',
  linkedin: 'LinkedIn',
  intake: 'Author intake',
};

function isLaunchView(value: string | null): value is LaunchView {
  return LAUNCH_VIEWS.some((view) => view === value);
}

export function findLaunchPiece(
  id: string | null | undefined,
  pieces: readonly LaunchPiece[] = LAUNCH_PIECES,
): LaunchPiece | null {
  if (!id) return null;
  return pieces.find((piece) => piece.id === id) ?? null;
}

export function piecesForChannel(
  channel: LaunchChannelId,
  pieces: readonly LaunchPiece[] = LAUNCH_PIECES,
): LaunchPiece[] {
  return pieces.filter((piece) => piece.channel === channel);
}

export function piecesForPhase(
  phase: LaunchPhaseId,
  pieces: readonly LaunchPiece[] = LAUNCH_PIECES,
): LaunchPiece[] {
  return pieces.filter((piece) => piece.phase === phase);
}

export function piecesForView(
  view: LaunchView,
  pieces: readonly LaunchPiece[] = LAUNCH_PIECES,
): LaunchPiece[] {
  if (view === 'all' || view === 'intake') return [...pieces];
  return piecesForChannel(view, pieces);
}

export function phasesUsedBy(
  pieces: readonly LaunchPiece[],
): LaunchPhase[] {
  const used = new Set(pieces.map((piece) => piece.phase));
  return LAUNCH_PHASES.filter((phase) => used.has(phase.id));
}

export function summarizeLaunchCampaign(
  pieces: readonly LaunchPiece[] = LAUNCH_PIECES,
): {
  total: number;
  emails: number;
  posts: number;
  byChannel: Record<LaunchChannelId, number>;
} {
  const byChannel: Record<LaunchChannelId, number> = {
    warm: 0,
    professional: 0,
    linkedin: 0,
  };
  let emails = 0;
  let posts = 0;

  for (const piece of pieces) {
    byChannel[piece.channel] += 1;
    if (piece.kind === 'email') emails += 1;
    else posts += 1;
  }

  return {
    total: pieces.length,
    emails,
    posts,
    byChannel,
  };
}

export function pieceKindLabel(kind: LaunchPieceKind): string {
  switch (kind) {
    case 'email':
      return 'Email';
    case 'post':
      return 'Post';
    default: {
      const _never: never = kind;
      return _never;
    }
  }
}

export function pieceShortLabel(piece: LaunchPiece): string {
  const kind = pieceKindLabel(piece.kind);
  return `${kind} ${piece.number}`;
}

export function formatLaunchSubjects(piece: LaunchPiece): string {
  if (piece.subjects.length === 0) return '';
  return piece.subjects
    .map((subject, index) => `${index + 1}. ${subject}`)
    .join('\n');
}

export function formatLaunchPieceCopy(
  piece: LaunchPiece,
  subjectIndex = 0,
): string {
  if (piece.kind === 'post') return piece.body;

  const subject =
    piece.subjects[subjectIndex] ?? piece.subjects[0] ?? piece.title;
  return `Subject: ${subject}\n\n${piece.body}`;
}

export function launchDeskHref(filters: Partial<LaunchDeskFilters> = {}): string {
  const params = new URLSearchParams();
  if (filters.campaign && filters.campaign !== 'all') {
    params.set('campaign', filters.campaign);
  }
  if (filters.piece) params.set('piece', filters.piece);
  const query = params.toString();
  return query ? `${LAUNCH_DESK_PATH}?${query}` : LAUNCH_DESK_PATH;
}

export function launchFiltersFromSearch(search: string): LaunchDeskFilters {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const campaignRaw = params.get('campaign');
  const campaign = isLaunchView(campaignRaw) ? campaignRaw : 'all';
  const pieceRaw = params.get('piece');
  const piece = findLaunchPiece(pieceRaw);
  return {
    campaign,
    piece: piece?.id ?? null,
  };
}
