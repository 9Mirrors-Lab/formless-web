export type LaunchLandingSection = {
  id: string;
  heading: string;
  body: string;
  cta?: string;
};

export type LaunchAdVariant = {
  id: string;
  angle: string;
  audience: string;
  shortHeadline: string;
  longHeadline: string;
  body: string;
  cta: string;
};

export type LaunchVideoScript = {
  id: string;
  title: string;
  duration: string;
  format: string;
  purpose: string;
  beats: Array<{
    clock: string;
    visual: string;
    onScreen: string;
    voice: string;
  }>;
};

export type LaunchCalendarRow = {
  id: string;
  when: string;
  runway: 'before' | 'launch' | 'after';
  channel: string;
  piece: string;
  dependsOn: string;
};

export const LAUNCH_LANDING: readonly LaunchLandingSection[] = [
  {
    id: 'hero',
    heading: 'The book, Formless is a doorway into the recognition of who you truly are.',
    body: 'You are not your thoughts or emotions. Formless takes you within to discover what exists beyond them.',
    cta: 'Read on Kindle · Listen on Audible',
  },
  {
    id: 'problem',
    heading: 'The outer picture kept changing. The feeling did not.',
    body: 'A new house. A new job. A new routine. The same unease, the same scanning, the same sense of not having arrived. Most of us are sent to the next outer fix. The exhaustion is the signal that the search is pointed in the wrong direction.',
  },
  {
    id: 'solution',
    heading: 'Pause. Observe. Recognize the one who is already here.',
    body: 'There is a voice in the head, and you are the one listening to it. Formless is not a method for becoming someone else. It is a walk back to the awareness that has been present through every version of the story.',
  },
  {
    id: 'how',
    heading: 'Read it or listen to it. The practice is noticing, not performing.',
    body: "Kindle for the page. Audible for Soni's own narration, 6 hours 51 minutes. The site stays a sanctuary: The Practice for the pattern in relationships, work, body, and family; Spirituality & Science for the mind that needs a rational foothold.",
  },
  {
    id: 'themes',
    heading: 'Four recognitions the book keeps returning to.',
    body: 'Awareness: you are not the mind. Presence: you are awareness. Peace: freedom begins when resistance ends. Freedom: life changes from within, in the rooms you already live in.',
  },
  {
    id: 'proof',
    heading: 'People who met the work said it plainly.',
    body: "William A. Lambos, PhD, neuroscientist: Soni commands the languages of science, spirituality, and consciousness, which use different words but say much the same. Gurprem Singh: she doesn't just share ideas; she lives them. Sean Cottman: it feels as if she wrote it for you.",
  },
  {
    id: 'cta',
    heading: 'Meet the book.',
    body: 'Formless by Sonika Cottman. Eyes Closed. Tuesday, September 1, 2026.',
    cta: 'Get Formless on Kindle · Listen on Audible · Stay close at eyesclosed.love',
  },
];

export const LAUNCH_ADS: readonly LaunchAdVariant[] = [
  {
    id: 'ad-recognition',
    angle: 'Central insight',
    audience: 'People already searching for presence, awareness, or the voice in the head',
    shortHeadline: 'You are not the voice in your head',
    longHeadline: 'You are not the voice in your head. You are the one who hears it.',
    body: 'Formless by Sonika Cottman is a doorway into that recognition. Kindle and Audible. Not a method. A way of seeing what is already here.',
    cta: 'Read Formless',
  },
  {
    id: 'ad-enough',
    angle: 'Exhaustion with outer fixes',
    audience: 'People tired of self-help that sends them to the next version of themselves',
    shortHeadline: 'If you have had enough',
    longHeadline: 'If you have had enough of trying to fix your life from the outside.',
    body: 'Peace does not have to wait for the next house, job, or personality. Formless is for the person who is tired of that search. Sonika Cottman. Kindle and Audible.',
    cta: 'Meet the book',
  },
  {
    id: 'ad-lived',
    angle: 'Lived story',
    audience: 'Professionals, parents, and immigrants who need a human, not a guru',
    shortHeadline: 'The life looked complete',
    longHeadline: 'The life looked complete. The unease stayed.',
    body: 'A mother. An HR leader in tech. An immigrant household. Formless is the record of what remained when the outer picture stopped working. By Sonika Cottman.',
    cta: 'Read or listen',
  },
  {
    id: 'ad-science',
    angle: 'Two languages',
    audience: 'Readers who bounce off pure mysticism and want a rational foothold',
    shortHeadline: 'Two languages. One seeing.',
    longHeadline: 'Neuroscience and the old teachings, naming the same recognition.',
    body: 'Thoughts come and go. Something remains aware of them. Formless sits in that overlap without becoming a protocol. Sonika Cottman. Kindle and Audible.',
    cta: 'Open the book',
  },
];

export const LAUNCH_SCRIPTS: readonly LaunchVideoScript[] = [
  {
    id: 'script-voice',
    title: 'The voice, and the one who hears it',
    duration: '42 seconds',
    format: 'Vertical. Quiet room. Soni to camera, then still cutaways of an inbox, a kitchen, a walking path.',
    purpose: 'Lead with the recognition. The book is named only after the seeing has landed.',
    beats: [
      {
        clock: '0:00-0:06',
        visual: 'Soni, still, looking just off camera. No logo.',
        onScreen: 'There is a voice in your head.',
        voice: 'There is a voice in your head.',
      },
      {
        clock: '0:06-0:16',
        visual: 'Cut to an email notification. Then a parent in a room, eyes somewhere else.',
        onScreen: 'Most of the day you live as if that voice is you.',
        voice: 'It narrates. It defends. It can turn one email into a whole weather system. Most of the day we live as if that voice is who we are.',
      },
      {
        clock: '0:16-0:28',
        visual: 'Back to Soni. Hands still.',
        onScreen: 'You can hear it.',
        voice: 'You can hear it. That is the overlooked fact. Something is aware of the voice. That something is what you are.',
      },
      {
        clock: '0:28-0:42',
        visual: 'Book cover, then the site wordmark Eyes Closed. No countdown.',
        onScreen: 'Formless. Sonika Cottman.',
        voice: 'I wrote Formless as a doorway back to that. Kindle and Audible. eyesclosed.love/book',
      },
    ],
  },
  {
    id: 'script-outer',
    title: 'The outer picture kept changing',
    duration: '55 seconds',
    format: 'Vertical. Still photographs of house, office, family, then Soni.',
    purpose: 'Lived story for people who have already tried the next version of their life.',
    beats: [
      {
        clock: '0:00-0:08',
        visual: 'Quick stills: a house, a laptop, a kitchen table.',
        onScreen: 'New house. New job. New routine.',
        voice: 'I kept changing the outer picture.',
      },
      {
        clock: '0:08-0:20',
        visual: 'Soni.',
        onScreen: 'The feeling stayed.',
        voice: "On the outside I had a family, a career, a home. On the inside I still felt as if I hadn't arrived.",
      },
      {
        clock: '0:20-0:36',
        visual: 'Quiet walking path. No face for a few seconds.',
        onScreen: 'You are not the thought.',
        voice: 'The unease was not a problem to solve with another version of my life. I am not the voice that never feels finished. I am the one who hears it.',
      },
      {
        clock: '0:36-0:55',
        visual: 'Cover. Kindle and Audible wordmarks. Site URL.',
        onScreen: 'Formless. A journey within.',
        voice: 'If you have had enough of trying to arrange peace from the outside, the book is for you. Formless. September 1.',
      },
    ],
  },
];

export const LAUNCH_CALENDAR: readonly LaunchCalendarRow[] = [
  {
    id: 'cal-aug22',
    when: 'Sat Aug 22',
    runway: 'before',
    channel: 'Warm',
    piece: 'Personal note before September 1',
    dependsOn: 'Named list of 15-40 people. Sender decided.',
  },
  {
    id: 'cal-aug25',
    when: 'Tue Aug 25',
    runway: 'before',
    channel: 'Warm + LinkedIn',
    piece: 'Why I wrote Formless. LinkedIn story, no link in the body.',
    dependsOn: 'Warm-1 sent. Soni available to post as herself.',
  },
  {
    id: 'cal-aug26',
    when: 'Wed Aug 26',
    runway: 'before',
    channel: 'X',
    piece: 'The unease. One recognition line.',
    dependsOn: 'None.',
  },
  {
    id: 'cal-aug28-waitlist',
    when: 'Fri Aug 28',
    runway: 'before',
    channel: 'Book waitlist',
    piece: 'The book is nearly here.',
    dependsOn: 'Waitlist can actually receive mail.',
  },
  {
    id: 'cal-aug28-stay',
    when: 'Fri Aug 28',
    runway: 'before',
    channel: 'Stay Close',
    piece: 'Quieter almost-here note.',
    dependsOn: 'Stay Close can actually receive mail.',
  },
  {
    id: 'cal-aug28-li',
    when: 'Fri Aug 28',
    runway: 'before',
    channel: 'LinkedIn',
    piece: 'Who it is for. No purchase link in the body.',
    dependsOn: 'Waitlist letter ready so the public story matches.',
  },
  {
    id: 'cal-aug29',
    when: 'Sat Aug 29',
    runway: 'before',
    channel: 'Warm + X',
    piece: 'Sharing language for people who already offered. X: not another outer fix.',
    dependsOn: 'Kit folder with cover and two captions.',
  },
  {
    id: 'cal-aug31',
    when: 'Mon Aug 31',
    runway: 'before',
    channel: 'Warm',
    piece: 'Tomorrow. Human eve note.',
    dependsOn: 'Kindle and Audible URLs confirmed for morning.',
  },
  {
    id: 'cal-sep1-site',
    when: 'Tue Sep 1, early',
    runway: 'launch',
    channel: 'Website',
    piece: 'Flip /book from waitlist to buy/listen.',
    dependsOn: 'Live Kindle and Audible links. Homepage still a sanctuary.',
  },
  {
    id: 'cal-sep1-warm',
    when: 'Tue Sep 1, morning',
    runway: 'launch',
    channel: 'Warm circle',
    piece: 'Formless is here. Kindle and Audible. No review ask.',
    dependsOn: 'Site already flipped.',
  },
  {
    id: 'cal-sep1-waitlist',
    when: 'Tue Sep 1, morning',
    runway: 'launch',
    channel: 'Book waitlist',
    piece: 'Available letter. Kindle and Audible.',
    dependsOn: 'Site already flipped.',
  },
  {
    id: 'cal-sep1-stay',
    when: 'Tue Sep 1, morning',
    runway: 'launch',
    channel: 'Stay Close',
    piece: 'Available letter, spoken as a relationship.',
    dependsOn: 'Site already flipped.',
  },
  {
    id: 'cal-sep1-advance',
    when: 'Tue Sep 1, morning',
    runway: 'launch',
    channel: 'Advance listen',
    piece: 'The audiobook is public now. Same links. No extra sequence.',
    dependsOn: 'Site already flipped.',
  },
  {
    id: 'cal-sep1-social',
    when: 'Tue Sep 1, late morning',
    runway: 'launch',
    channel: 'LinkedIn + X',
    piece: 'It is available. Links in the first comment on LinkedIn.',
    dependsOn: 'Same links as the letter.',
  },
  {
    id: 'cal-sep3-warm',
    when: 'Thu Sep 3 - Fri Sep 4',
    runway: 'after',
    channel: 'Warm circle',
    piece: 'Thank you. No scoreboard.',
    dependsOn: 'Launch letters sent.',
  },
  {
    id: 'cal-sep3-waitlist',
    when: 'Thu Sep 3 - Fri Sep 4',
    runway: 'after',
    channel: 'Book waitlist',
    piece: 'Thank you. No scoreboard.',
    dependsOn: 'Launch letters sent.',
  },
  {
    id: 'cal-sep3-stay',
    when: 'Thu Sep 3 - Fri Sep 4',
    runway: 'after',
    channel: 'Stay Close',
    piece: 'Thank you. The relationship continues.',
    dependsOn: 'Launch letters sent.',
  },
  {
    id: 'cal-sep3-li',
    when: 'Thu Sep 3 - Fri Sep 4',
    runway: 'after',
    channel: 'LinkedIn',
    piece: 'Thank you. No scoreboard.',
    dependsOn: 'Launch letters sent.',
  },
  {
    id: 'cal-sep6',
    when: 'Sun Sep 6 - Mon Sep 7',
    runway: 'after',
    channel: 'Book waitlist',
    piece: 'If you have met the book: optional honest review.',
    dependsOn: 'Review URL live. Ask only people who read or listened.',
  },
  {
    id: 'cal-sep9-waitlist',
    when: 'Tue Sep 8 - Thu Sep 10',
    runway: 'after',
    channel: 'Book waitlist',
    piece: 'First teaching: the voice and the one who hears it.',
    dependsOn: 'Launch week closed. No more availability posts.',
  },
  {
    id: 'cal-sep9-stay',
    when: 'Tue Sep 8 - Thu Sep 10',
    runway: 'after',
    channel: 'Stay Close',
    piece: 'First teaching: the voice and the one who hears it.',
    dependsOn: 'Launch week closed. No more availability posts.',
  },
  {
    id: 'cal-sep9-advance',
    when: 'Tue Sep 8 - Thu Sep 10',
    runway: 'after',
    channel: 'Advance listen',
    piece: 'Invite into the public teaching.',
    dependsOn: 'Launch week closed. No more availability posts.',
  },
  {
    id: 'cal-sep9-social',
    when: 'Tue Sep 8 - Thu Sep 10',
    runway: 'after',
    channel: 'LinkedIn + X',
    piece: 'First teaching: the voice and the one who hears it. X thread.',
    dependsOn: 'Launch week closed. No more availability posts.',
  },
  {
    id: 'cal-sep22',
    when: 'Tue Sep 22',
    runway: 'after',
    channel: 'LinkedIn + X',
    piece: 'Work and identity. The room you are in.',
    dependsOn: 'None. This is the teaching cadence.',
  },
  {
    id: 'cal-oct',
    when: 'October',
    runway: 'after',
    channel: 'LinkedIn + X + outreach',
    piece: 'Science bridge. Quiet pitches to 4-8 rooms that already speak this language.',
    dependsOn: 'Pitch is the insight, not the launch.',
  },
  {
    id: 'cal-nov',
    when: 'November',
    runway: 'after',
    channel: 'Owned channels',
    piece: 'The book was the doorway. Weekly or biweekly teaching. Offerings stay later.',
    dependsOn: 'A rhythm Soni can keep without a campaign manager.',
  },
];
