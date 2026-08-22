import type { LaunchPiece } from './bookLaunchCampaign';

export const LAUNCH_PIECES: readonly LaunchPiece[] = [
  {
    id: 'warm-1',
    channel: 'warm',
    kind: 'email',
    number: 1,
    title: 'A personal note before September 1',
    send: 'Sat Aug 22 or Sun Aug 23',
    phase: 'quiet',
    purpose: 'The closest people hear from Soni first, as a person, not as a campaign.',
    subjects: [
      "Something I've been writing is almost here",
      'A note before September 1',
      'I wanted you to hear this from me',
    ],
    preview: 'The book comes out September 1. I wanted you to hear it from me first.',
    body: `Hi [First Name],

I've been writing a book called *Formless*. It comes out on Tuesday, September 1.

I wanted you to hear that from me, not from a post.

For most of my life I carried an unease I could never name. On the outside I had grown a family, a career, a home. On the inside I felt incomplete, as if I still hadn't arrived. I kept changing the outer picture. The feeling stayed.

*Formless* is the record of what I finally saw: I am not the voice in my head. I am the one who hears it. That recognition is what I hope reaches people who have had enough of trying to fix their lives from the outside.

If you want to read it, I'll send a link on the morning it is available. There is nothing you need to do before then.

If you already have an early copy, there is no rush. The book will still be there on September 1.

Thank you for being part of the years that made this possible.

Soni`,
  },
  {
    id: 'warm-2',
    channel: 'warm',
    kind: 'email',
    number: 2,
    title: 'Why I wrote Formless',
    send: 'Tue Aug 25 or Wed Aug 26',
    phase: 'quiet',
    purpose: 'Give the warm circle one honest why, so they can recognize who the book is for.',
    subjects: [
      'Why I wrote Formless',
      'The unease I could never name',
      'Who I hope this reaches',
    ],
    preview: 'I wrote it for people who have had enough of trying to fix their lives from the outside.',
    body: `Hi [First Name],

I keep thinking about who *Formless* is actually for.

It is for the person whose day can still be ruined by one email. For the parent who loves their children and still disappears into the mind while sitting next to them. For the professional who built a life that looks finished and still feels the old incompleteness.

I grew up in a house full of volatility and fear. I learned to scan, anticipate, control. That inner world followed me into marriage, motherhood, and thirteen years in tech HR. New house, new job, new routine. Same pattern.

The book is not a method for becoming someone else. It is a doorway back to the awareness that was already here.

If someone comes to mind as you read that, they are who I wrote it for.

Soni`,
  },
  {
    id: 'warm-3',
    channel: 'warm',
    kind: 'email',
    number: 3,
    title: 'Words, if you already wanted to share',
    send: 'Sat Aug 29 or Sun Aug 30',
    phase: 'approach',
    purpose: 'Ready words for people who already offered to help. Invite, do not assign.',
    subjects: [
      'If you already wanted to share this',
      "A few words, in case they're useful",
      'No homework. Just language if you need it.',
    ],
    preview: 'Only if you already wanted to share. A few sentences you can use as they are.',
    body: `Hi [First Name],

This is only for you if you already wanted to share the book. There is no list of tasks.

If a few ready words would help, you can use these as they are:

"Soni's book *Formless* is out September 1. It's for people who have had enough of trying to fix their lives from the outside. You are not the voice in your head. You are the one who hears it. Kindle and Audible: [Kindle Link]"

A quieter version:

"If you've been looking for peace in the next change of circumstances, this may be for you. *Formless*, by Sonika Cottman. [Kindle Link]"

Cover image and the same lines live here if you want them:
[Book Assets Folder Link]

If you'd rather say nothing, that is a complete response.

Soni`,
  },
  {
    id: 'warm-4',
    channel: 'warm',
    kind: 'email',
    number: 4,
    title: 'Tomorrow',
    send: 'Mon Aug 31, late afternoon',
    phase: 'eve',
    purpose: 'A human eve note. Date, not countdown. No stacked-week language.',
    subjects: [
      'Tomorrow',
      'Formless is available in the morning',
      'One more note before September 1',
    ],
    preview: "The book is available in the morning. That's all.",
    body: `Hi [First Name],

Tomorrow morning *Formless* will be available to read and to listen to.

I will send the links then. If you want to wait, wait. If you want to meet it in the first days, that is welcome too.

I am grateful you have been close to this.

Soni`,
  },
  {
    id: 'warm-5',
    channel: 'warm',
    kind: 'email',
    number: 5,
    title: 'Formless is here',
    send: 'Tue Sep 1, morning, after the site flip',
    phase: 'launch-day',
    purpose: 'One clear door: Kindle and Audible. No review ask yet.',
    subjects: [
      'Formless is here',
      'The book is available',
      'Kindle and Audible, as promised',
    ],
    preview: 'Kindle and Audible are live. The book is a doorway, not a project for you to run.',
    body: `Hi [First Name],

*Formless* is available this morning.

I wrote it for people who have had enough of trying to arrange peace from the outside. You are not your thoughts or emotions. You are the one observing them.

If you want to meet the book:

Read on Kindle: [Kindle Link]
Listen on Audible: [Audible Link]
The home for both is [eyesclosed.love/book](https://www.eyesclosed.love/book)

If someone comes to mind who needs this more than a recommendation, you can send them the same links. There is nothing else to do.

Thank you for walking with me this far.

Soni`,
  },
  {
    id: 'warm-6',
    channel: 'warm',
    kind: 'email',
    number: 6,
    title: 'Thank you',
    send: 'Thu Sep 3 or Fri Sep 4',
    phase: 'settle',
    purpose: 'Close the launch gesture with gratitude. Optional review only for people who met the work.',
    subjects: [
      'Thank you',
      "I'm grateful",
      'A note after the first days',
    ],
    preview: "Whether you read, listened, shared, or simply stayed close, I'm grateful.",
    body: `Hi [First Name],

Thank you.

Whether you bought the book, started it, sent it to one person, or simply stayed close, I'm grateful. The first days of a book are quiet on the inside even when they are public on the outside.

If you have actually read or listened, and the book was true for you, an honest Amazon note can help a stranger decide. Two or three sentences is enough. Reviews are optional. They should be honest.

[Amazon Review Link]

The work from here is the teaching, not the week. I will keep writing from the same place the book came from.

Soni`,
  },
  {
    id: 'pro-1',
    channel: 'professional',
    kind: 'email',
    number: 1,
    title: 'The book is nearly here',
    send: 'Fri Aug 28',
    phase: 'approach',
    purpose: 'People who asked to be told get one letter before the day. No scarcity.',
    subjects: [
      'Formless is nearly here',
      'A note before September 1',
      'The book you asked to hear about',
    ],
    preview: 'You asked to be told when the book was close. It arrives September 1.',
    body: `Hi [First Name],

You asked to be told when *Formless* was close. It arrives Tuesday, September 1, on Kindle and Audible.

The book is a doorway into a simple recognition: you are not the voice in your head. You are the one who hears it. Peace does not have to wait for the next change of circumstances.

I will write again on the morning it is available, with the links. There is nothing to do before then.

If this no longer belongs in your inbox, you can leave the list. Either way, I'm glad you asked to be told.

Sonika Cottman
Eyes Closed`,
  },
  {
    id: 'pro-2',
    channel: 'professional',
    kind: 'email',
    number: 2,
    title: 'Formless is available',
    send: 'Tue Sep 1, morning',
    phase: 'launch-day',
    purpose: 'One letter. Meet the book. No review ask. No second reminder the same day.',
    subjects: [
      'Formless is available',
      'Kindle and Audible, as promised',
      'The book is here',
    ],
    preview: 'Formless is available to read and to listen to.',
    body: `Hi [First Name],

*Formless* is available.

I wrote it for anyone who has had enough of stress, pain, anger, and the undertow of not enough. The outer picture can keep changing. The pattern often does not, until it is seen.

You are not your thoughts or emotions. You are the awareness that observes them.

Read on Kindle: [Kindle Link]
Listen on Audible: [Audible Link]
The book lives here: [eyesclosed.love/book](https://www.eyesclosed.love/book)

If this is for someone else more than for you, you can send them the same door.

Sonika Cottman
Eyes Closed`,
  },
  {
    id: 'pro-3',
    channel: 'professional',
    kind: 'email',
    number: 3,
    title: 'Thank you for staying close',
    send: 'Fri Sep 4',
    phase: 'settle',
    purpose: 'Close the launch week without a scoreboard or a second purchase ask.',
    subjects: [
      'Thank you for staying close',
      'A note after the first days',
      'Grateful',
    ],
    preview: 'The first days are done. The teaching continues.',
    body: `Hi [First Name],

Thank you for staying close as *Formless* arrived.

I will not turn this week into a report. What matters is whether the recognition lands for the person who needed it.

If you have begun the book, I hope it meets you where you actually live: in the email that shifts a whole day, in the room with people you love, in the old feeling of not enough.

The practice on the site remains open: [eyesclosed.love](https://www.eyesclosed.love)

Sonika Cottman
Eyes Closed`,
  },
  {
    id: 'pro-4',
    channel: 'professional',
    kind: 'email',
    number: 4,
    title: 'If you have met the book',
    send: 'Sun Sep 6 or Mon Sep 7',
    phase: 'settle',
    purpose: 'Ask for an honest review only from people who have actually read or listened.',
    subjects: [
      'If you have met the book',
      "A short note, only if you've read",
      'For readers and listeners',
    ],
    preview: 'Only if you have read or listened. An honest few sentences can help the next person decide.',
    body: `Hi [First Name],

This note is only for you if you have already read or listened to *Formless*.

If the book was true for you, a short honest review can help the next person decide whether it is for them. Two or three sentences is enough. What stood out. Who you would hand it to. What it helped you see.

Reviews are optional. They should be honest.

[Amazon Review Link]

If you haven't met the book yet, you can ignore this. The door stays open.

Sonika Cottman
Eyes Closed`,
  },
  {
    id: 'pro-5',
    channel: 'professional',
    kind: 'email',
    number: 5,
    title: 'The voice, and the one who hears it',
    send: 'Wed Sep 9 or Thu Sep 10',
    phase: 'week-2',
    purpose: 'The campaign becomes the teaching. First excerpt, not a recap of launch week.',
    subjects: [
      'The voice, and the one who hears it',
      'A page from Formless',
      'You are not the thought',
    ],
    preview: 'There is a voice in the head. You are the one listening to it.',
    body: `Hi [First Name],

A page from the work, now that the book is in the world.

There is a voice in the head. It narrates, judges, plans, and rehearses. Most of us live as if that voice is who we are. The practice begins one step back: noticing the voice, and noticing that something is aware of it.

That something does not need the next house, the next job, or the next version of you. It is already here.

*Formless* is a walk through that recognition, into relationships, work, the body, and the places we learned our earliest fear.

If you want the whole walk: [Kindle Link] · [Audible Link]

Sonika Cottman
Eyes Closed`,
  },
  {
    id: 'li-1',
    channel: 'linkedin',
    kind: 'post',
    number: 1,
    title: 'Why the book exists',
    send: 'Tue Aug 25',
    phase: 'quiet',
    purpose: 'Plant recognition before any announcement. Story first.',
    subjects: [],
    body: `On the outside I had a life that looked complete. Family. Career. Home.

On the inside I still felt as if I hadn't arrived.

I grew up scanning for danger. That habit followed me into motherhood and into thirteen years of HR in tech. I kept changing the outer picture. The unease stayed.

I wrote *Formless* because I finally saw the thing I had been circling: I am not the voice that never feels finished. I am the one who hears it.

The book is for people who have had enough of trying to arrange peace from the outside.

It arrives September 1.`,
  },
  {
    id: 'li-2',
    channel: 'linkedin',
    kind: 'post',
    number: 2,
    title: 'Who it is for',
    send: 'Fri Aug 28',
    phase: 'approach',
    purpose: 'Name the reader in their actual life, not as a demographic.',
    subjects: [],
    body: `*Formless* is for the person whose whole day can still turn on one email.

For the leader whose job has quietly become their name.

For the parent who is in the room and also gone, living in the next thought.

For anyone who has had enough of stress, pain, anger, and the feeling of not enough, and is tired of being sent to the next outer fix.

You are not your thoughts or emotions. You are the one observing them.

September 1.

(Link in the first comment.)`,
  },
  {
    id: 'li-3',
    channel: 'linkedin',
    kind: 'post',
    number: 3,
    title: 'The book is available',
    send: 'Tue Sep 1, late morning',
    phase: 'launch-day',
    purpose: 'Public announcement for people who are not on the lists.',
    subjects: [],
    body: `*Formless* is available today. Kindle and Audible.

I wrote it as a doorway, not a program. The central recognition is simple, and it does not require you to become someone else:

You are not the voice in your head. You are the one who hears it.

If that is the sentence you've been walking around, the book is for you.

(Kindle and Audible links in the first comment.)`,
  },
  {
    id: 'li-4',
    channel: 'linkedin',
    kind: 'post',
    number: 4,
    title: 'The first days',
    send: 'Fri Sep 4',
    phase: 'settle',
    purpose: 'Gratitude without metrics. Close the launch gesture.',
    subjects: [],
    body: `Thank you to everyone who has met *Formless* in the first days, and to the people who walked with the writing long before there was a date.

I will not make a scoreboard out of this week.

What I hope is smaller and harder: that the book reaches the person who is still trying to fix an inner life by rearranging the outer one.

If you have read it, and it was true, an honest few sentences on the listing can help the next person decide. Only if you met the work.

(Review link in the first comment.)`,
  },
  {
    id: 'li-5',
    channel: 'linkedin',
    kind: 'post',
    number: 5,
    title: 'The email that ruins the day',
    send: 'Wed Sep 9',
    phase: 'week-2',
    purpose: 'First teaching post after launch. Use a lived scene, not a recap.',
    subjects: [],
    body: `An email arrives. Before you have finished the sentence, the day has a new weather system.

That speed is the mind doing what it was trained to do: interpret, defend, become the story.

The practice is not to become a calmer employee. It is to notice the weather, and to notice the one who sees it.

You can still reply. You can still care. You do not have to live as the reaction.

This is the door *Formless* walks through, including at work.

(Book link in the first comment.)`,
  },
  {
    id: 'li-6',
    channel: 'linkedin',
    kind: 'post',
    number: 6,
    title: 'When the job becomes the name',
    send: 'Tue Sep 22',
    phase: 'month-1',
    purpose: 'Speak to the professional reader in their identity wound.',
    subjects: [],
    body: `When your job becomes part of your name, losing the role can feel like losing yourself.

I watched that pattern in myself and in the rooms I worked in for years. Titles, reviews, the next round of proving.

Worth was never in the title. The fear was in believing it was.

*Formless* has a chapter on work, identity, and purpose because that is where so many of us disappear.

The invitation is not to care less. It is to see what you are not.`,
  },
  {
    id: 'li-7',
    channel: 'linkedin',
    kind: 'post',
    number: 7,
    title: 'Two languages, one recognition',
    send: 'Tue Oct 13',
    phase: 'month-2',
    purpose: 'Science bridge for readers who need a rational foothold.',
    subjects: [],
    body: `Neuroscience and the old teachings often use different words for the same seeing.

The brain predicts. It filters. It repeats what it has practiced. Awareness is the chance to notice the lens instead of living as it.

I am not a scientist. I am someone who needed both languages: the one that named presence, and the one that named pathways.

*Formless* sits in that overlap on purpose. Not as a protocol. As a way to trust what you can already observe:

Thoughts come and go. Something remains aware of them.`,
  },
  {
    id: 'li-8',
    channel: 'linkedin',
    kind: 'post',
    number: 8,
    title: 'The book was the doorway',
    send: 'Tue Nov 10',
    phase: 'month-3',
    purpose: 'Name the lasting rhythm. Offerings stay later. Teaching continues.',
    subjects: [],
    body: `Three months after *Formless* arrived, the work is the same as it was on the first page.

Pause. Observe the thought. Recognize you are not the thought.

The book was a doorway. The site, the practice, and the conversations are how people stay close.

If you are still looking for the next outer fix, you can come back when you are tired of that. The door does not close.

eyesclosed.love`,
  },
  {
    id: 'x-1',
    channel: 'x',
    kind: 'post',
    number: 1,
    title: 'The unease',
    send: 'Wed Aug 26',
    phase: 'quiet',
    purpose: 'One recognition line. No title-first announcement.',
    subjects: [],
    body: `On the outside the life can look finished.

On the inside, the feeling of not having arrived yet.

That gap is where I wrote from.`,
  },
  {
    id: 'x-2',
    channel: 'x',
    kind: 'post',
    number: 2,
    title: 'Not another outer fix',
    send: 'Sat Aug 29',
    phase: 'approach',
    purpose: 'Name the alternative people already use, then the actual door.',
    subjects: [],
    body: `If peace required the next house, the next job, or the next version of you, you would have it by now.

You are not the voice that keeps rearranging the picture.

You are the one who hears it.

Formless. September 1.`,
  },
  {
    id: 'x-3',
    channel: 'x',
    kind: 'post',
    number: 3,
    title: 'Available',
    send: 'Tue Sep 1',
    phase: 'launch-day',
    purpose: 'Short public door. Kindle and Audible. No thread.',
    subjects: [],
    body: `Formless is available. Kindle and Audible.

You are not your thoughts or emotions. You are the one observing them.

eyesclosed.love/book`,
  },
  {
    id: 'x-4',
    channel: 'x',
    kind: 'post',
    number: 4,
    title: 'Cover line',
    send: 'Sat Sep 5',
    phase: 'settle',
    purpose: 'Let the book speak. No recap of the week.',
    subjects: [],
    body: `When you truly recognize that you are not your thoughts and emotions, a different way of living reveals itself.

You can be at peace, regardless of your outer circumstances.`,
  },
  {
    id: 'x-5',
    channel: 'x',
    kind: 'post',
    number: 5,
    title: 'Thread: the one who hears it',
    send: 'Thu Sep 10',
    phase: 'week-2',
    purpose: 'First teaching thread. Each post advances the recognition.',
    subjects: [],
    body: `1/ There is a voice in your head. Most of the day you live as if that voice is you.

2/ The voice plans, defends, rehearses old rooms, and turns one email into a whole weather system.

3/ You can hear it. That is the overlooked fact. Something is aware of the voice.

4/ That awareness does not need you to become more spiritual, more disciplined, or more impressive. It is already here.

5/ The practice is not fighting the mind. It is noticing it, then living from the one who notices.

6/ Formless is a walk through that seeing, into the places the pattern repeats: relationships, work, the body, the family you came from.

eyesclosed.love/book`,
  },
  {
    id: 'x-6',
    channel: 'x',
    kind: 'post',
    number: 6,
    title: 'The room you are in',
    send: 'Thu Sep 24',
    phase: 'month-1',
    purpose: 'Presence in ordinary life. One claim.',
    subjects: [],
    body: `You can be sitting next to someone you love and still be gone, living in the next thought.

Coming back to the room is not a personality trait.

It is a recognition you can practice today.`,
  },
  {
    id: 'x-7',
    channel: 'x',
    kind: 'post',
    number: 7,
    title: 'The lens',
    send: 'Thu Oct 15',
    phase: 'month-2',
    purpose: 'Science-bridge compression. One mechanism.',
    subjects: [],
    body: `You don't experience life exactly as it is.

You experience it through memory, belief, and what the nervous system has practiced.

Awareness is how you notice the lens instead of living as it.`,
  },
  {
    id: 'x-8',
    channel: 'x',
    kind: 'post',
    number: 8,
    title: 'The door stays open',
    send: 'Thu Nov 12',
    phase: 'month-3',
    purpose: 'Evergreen close. No urgency. The teaching continues.',
    subjects: [],
    body: `The book was never the point.

The point is the moment you notice the thought, and notice that you are not it.

The door stays open.`,
  },
];
