/** Record Sessions: scripts the author reads, plus abbreviated companion reminders. */

export const RECORD_SESSIONS = {
  title: 'Record Sessions',
  lede: 'Open this page while you record. Read only the large lines. Small labels are cues, not speech.',
  companionHref: '/audio/companion',
  companionLabel: 'Companion',
} as const;

export type ScriptBeat = {
  id: string;
  /** Small cue. Do not read this label. */
  cue: string;
  lines: string[];
};

export type RecordSession = {
  id: string;
  sectionTitle: 'Re-record';
  track: string;
  saveAs: string;
  why: string;
  reminders: Array<{ text: string; href?: string; hrefLabel?: string }>;
  roomSeconds: number;
  roomCue: string;
  beats: ScriptBeat[];
  closing: ScriptBeat & { note: string };
  stopCue: string;
};

export const ACKNOWLEDGMENTS_RERECORD: RecordSession = {
  id: 'acknowledgments-2026-08',
  sectionTitle: 'Re-record',
  track: 'Acknowledgments',
  saveAs: '12_Acknowledgments.wav',
  why: 'Acknowledgments currently end at gratitude with no closing credits. The official ACX closing must signal finality, and best practice includes a spoken title line plus “The End.” We also add a short copyright line so the last file matches the listing.',
  reminders: [
    {
      text: 'Same setup as Companion: template open, 44100 Hz, mono, playhead at 0, no effects.',
      href: '/audio/companion',
      hrefLabel: 'Companion steps',
    },
    {
      text: 'Do not forget 10 seconds of room noise at the head. Stay still. Do not speak.',
    },
    {
      text: 'Keep the same mic distance as the approved chapters.',
    },
    {
      text: 'After “The End,” stay quiet a couple of seconds, then stop.',
    },
    {
      text: 'Export as WAV, 44.1 kHz, mono. Save as 12_Acknowledgments.wav.',
    },
  ],
  roomSeconds: 10,
  roomCue: 'Press Record. Stay silent for 10 seconds. Then start the script.',
  beats: [
    {
      id: 'header',
      cue: 'Title',
      lines: ['Acknowledgments.'],
    },
    {
      id: 'opening',
      cue: 'Opening',
      lines: [
        "Something I've learned on this journey is that nothing happens in isolation.",
        'Formless is the result of countless experiences, lessons, and people who shaped me and guided me toward transformation.',
        'I want to acknowledge those who deeply impacted this journey.',
      ],
    },
    {
      id: 'teachers',
      cue: 'Teachers',
      lines: [
        'I would like to begin by expressing my gratitude to Eckhart Tolle and Dr. Joe Dispenza.',
        'Their teachings helped me illuminate a path that ultimately led me back to myself.',
        'Through their books, talks, and wisdom, my awakening journey began.',
        'They provided language for experiences I started to discover firsthand and inspired a deeper exploration of awareness, presence, and the nature of who we are.',
        'Their work helped bridge the worlds of science and spirituality in a way that deeply resonated with me.',
        'While this book reflects my own journey and understanding, their teachings played a meaningful role in the transformation that made it possible.',
      ],
    },
    {
      id: 'simon',
      cue: 'Simon and Kate',
      lines: [
        'I knew years ago that one day I would write this book, but Formless would not exist today without Simon Golden and his incredible team of coaches, editors, and writers.',
        'This journey has been deeply fulfilling and a large part of that has been working alongside Simon, his team, and the other talented authors I have met along the way.',
        'I want to particularly acknowledge my writing coach and editor, Kate Williams.',
        'You guided me through this entire writing process with honesty, patience, and care.',
        'I came to you with an open mind and you challenged me to think bigger and pushed me past my own limitations.',
        'You helped bring clarity, credibility, and depth to this book while allowing it to remain true to my voice.',
        'You are truly a master of your craft, and I will always be grateful for the role you played in helping Formless become what it is.',
      ],
    },
    {
      id: 'dad',
      cue: 'Dad',
      lines: [
        "To my dad, Ashok, our journey together taught me some of life's most important lessons about healing, forgiveness, acceptance, and compassion.",
        'Through both the challenges and the love, I gained wisdom that became an essential part of my own evolution.',
        'I am grateful for those lessons and for the relationship we continue to build today.',
      ],
    },
    {
      id: 'siblings',
      cue: 'Siblings',
      lines: [
        'To my siblings, Shalini and Manesh, thank you for helping raise me and for being part of this transformation within our family.',
        'Thank you for keeping your hearts open and allowing our relationship to grow and deepen in new ways.',
        'You have both been an important part of my awakening.',
      ],
    },
    {
      id: 'kritika',
      cue: 'Kritika',
      lines: [
        'To my cousin, Kritika, one of the first people to embrace this journey alongside me, your openness to living differently and applying these teachings has been inspiring.',
        'Thank you for encouraging me to share these insights more openly and for seeing the possibility of what Eyes Closed could become.',
      ],
    },
    {
      id: 'mom',
      cue: 'Mom',
      lines: [
        'To my mom, Simmy, a true gem in my life, you have stood beside me from the very beginning and courageously embraced your own path of growth, self-discovery, and healing.',
        'I have witnessed such a beautiful shift within you.',
        'One of the most meaningful moments of this journey has been watching our relationship deepen in ways I never imagined possible.',
        'Your love and openness have touched my heart more than words can express.',
      ],
    },
    {
      id: 'sean',
      cue: 'Sean',
      lines: [
        'To my former husband, Sean, who remains someone deeply important in my life, our relationship has evolved in remarkable ways over the past 25 years.',
        'Thank you for trusting me, supporting me, and believing in the path I needed to take.',
        'Thank you for the way we continue to raise our children together with love, respect, and trust.',
        'Most of all, thank you for your own growth and willingness to live life differently.',
        'I am deeply grateful for you and your wonderful wife, Chelsea.',
      ],
    },
    {
      id: 'dogs',
      cue: 'Bernie and Opal',
      lines: [
        'To my two dogs, Bernie and Opal, who transformed my relationship with animals.',
        'Thank you for showing me what it means to live fully in the present moment.',
        'Through your unconditional love and presence, you helped me reconnect with the intelligence woven throughout all of life.',
        'You were a deep inspiration for the nature, animals, and presence chapter, and I am grateful for all that you continue to teach me.',
      ],
    },
    {
      id: 'children',
      cue: 'Naya and S.J.',
      lines: [
        'To my beautiful children, Naya and S.J., full of love, curiosity, compassion, and light.',
        'One of the greatest gifts of these past few years has been watching both of you grow through my own transformation.',
        'As I changed, I watched the impact ripple into your lives as well.',
        'I could not be more proud of the human beings you are becoming.',
        'Thank you for your patience throughout the process of writing Formless and building Eyes Closed.',
        'You both are my greatest teachers.',
        'Through both of you, I see the innocence, wisdom, and light that lives within all children.',
      ],
    },
    {
      id: 'ryan',
      cue: 'Ryan',
      lines: [
        'To my partner, Ryan.',
        'This transformation would not have unfolded the way it did if our paths had not crossed.',
        'You believed in me and saw my true essence before I had fully awakened to it.',
        'People enter our lives for a reason.',
        'Looking back, I can see the meaning and synchronicity in the way our paths came together.',
        'Formless and Eyes Closed would not exist without you.',
        'I will always carry deep gratitude in my heart.',
        'Thank you for helping me share this message with the world.',
      ],
    },
  ],
  closing: {
    id: 'closing',
    cue: 'Closing credits · new',
    note: 'Pause one beat after the last thank-you. Then read these three lines exactly.',
    lines: [
      'You have been listening to Formless, written by Sonika Cottman, narrated by Sonika Cottman.',
      'Copyright 2026 Sonika Cottman.',
      'The End.',
    ],
  },
  stopCue: 'Stay quiet for a couple of seconds. Then stop recording.',
};

export const RECORD_SESSION_LIST: RecordSession[] = [ACKNOWLEDGMENTS_RERECORD];
