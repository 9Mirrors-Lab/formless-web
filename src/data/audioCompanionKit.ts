/** Author companion kit: room tone, calibration, and session ritual. */

export const COMPANION_KIT = {
  eyebrow: 'Companion kit',
  title: 'Begin every session the same way',
  lede: 'A quiet ritual before narration. Capture the room, match your voice, then continue into the chapter.',
  book: 'Formless',
  imprint: 'Eyes Closed',
} as const;

export const ROOM_TONE = {
  index: '01',
  name: 'Room tone',
  durationSeconds: 30,
  headline: 'Remain completely silent.',
  rules: [
    'Do not move.',
    'Do not breathe toward the microphone.',
    'Record for 30 seconds.',
  ],
  purpose: 'This captures the natural sound of the room.',
  captures: [
    { id: 'hvac', label: 'HVAC' },
    { id: 'fans', label: 'Computer fans' },
    { id: 'self-noise', label: 'Microphone self-noise' },
    { id: 'ambience', label: 'Room ambience' },
  ],
  without: 'without speech',
} as const;

export const CALIBRATION = {
  index: '02',
  name: 'Calibration',
  headline: 'Always the same passage.',
  preferredTitle: 'Read from the book',
  preferredLede:
    'For Formless, begin every recording session with the opening of Chapter One. You are checking consistency against the actual narration style, not generic English.',
  matches: [
    'Pacing',
    'Emotion',
    'Cadence',
    'Breathing',
    'Articulation',
    'Microphone distance',
  ],
  consistencyNote:
    "If Chapter 7's calibration sounds like Chapter 1's calibration, the audiobook will feel much more consistent.",
  chapterLabel: 'Chapter One · The Feeling of Wholeness',
  /** Chapter One opening, broken for voice reading. */
  bookPassageParagraphs: [
    'Chapter 1. The Feeling of Wholeness.',
    "You've made it in life. You have the house, the family, the career, the steady routine that signals success. The life you once imagined has mostly unfolded.",
    'And yet, a familiar emptiness lingers. A quiet unease. A sense of not feeling whole, not having arrived. No matter what you achieve, something in you keeps wanting more.',
    "If it's not this house, maybe a bigger one will finally make you happy. If it's not this relationship, perhaps the next one will bring you back to life. Maybe it's a new job. A different city. A fresh start. Then you think everything will feel right.",
    'Your mind convinces you that fulfillment is just one change away. That if the outer picture can be changed, the inner emptiness will disappear.',
    'Yet, no matter how many times you rearrange the furniture of your life, the quiet ache returns, reminding you that what you seek cannot be found in the next thing, the next place, or the next person.',
    'You begin to question it. How can you have accomplished so much and still feel like something is missing?',
  ],
  fallbackTitle: 'Fallback paragraph',
  fallbackLede:
    'Use only if the book passage is not yet locked. It exercises quiet speech, louder words, numbers, pacing, questions, short pauses, and transitions.',
  fallbackPassage: `Every story begins with a single moment. Some arrive quietly, while others demand to be heard. Today, I will read with a steady pace, a natural voice, and clear pronunciation. The quick brown fox jumps over the lazy dog. I counted from one to ten before continuing. Now I ask a simple question: are we ready to begin? If so, let's continue with today's chapter.`,
  exercises: [
    'Soft consonants',
    'Hard consonants',
    'Long vowels',
    'Numbers',
    'Commas and periods',
    'Questions',
    'Excitement',
    'Quiet passages',
  ],
} as const;

export const AFTER_APPROVAL = {
  index: '03',
  name: 'After approval',
  headline: 'Your voice benchmark.',
  lede: 'Once Chapter One is approved, stop reading a text prompt cold. Use the approved take as the reference.',
  steps: [
    {
      id: 'play',
      title: 'Play the approved excerpt',
      detail: 'Listen to the Chapter One calibration for 15–20 seconds.',
    },
    {
      id: 'read',
      title: 'Read the same passage',
      detail: 'Match pacing, emotion, and distance as you hear them.',
    },
    {
      id: 'compare',
      title: 'Compare',
      detail: 'Notice drift before it enters the new chapter.',
    },
    {
      id: 'begin',
      title: 'Begin the chapter',
      detail: 'Continue recording while the voice still matches.',
    },
  ],
} as const;

/** Provided filenames — author uses these exact names, not their own. */
export const SESSION_FILES = {
  projectName: 'Formless-First-Test.aup3',
  exportName: 'Formless-First-Test.wav',
} as const;

export const SESSION_FLOW = {
  index: '04',
  name: 'Session flow',
  headline: 'How this first test runs',
  lede: 'Room tone, then the calibration passage only. Do not continue into a full chapter yet.',
  steps: [
    { id: 'template', label: 'Open the Audacity template' },
    {
      id: 'save-as',
      label: 'Save Project → Save Project As…',
      note: SESSION_FILES.projectName,
    },
    { id: 'record', label: 'Press record' },
    { id: 'room', label: '30 seconds of silence', note: 'Room tone' },
    {
      id: 'calibrate',
      label: 'Read the calibration passage',
      note: 'Stop after the passage',
    },
    { id: 'stop', label: 'Stop recording' },
    {
      id: 'export',
      label: 'File → Export → Export as WAV',
      note: `${SESSION_FILES.exportName} · Mono · 44.1 kHz · 16-bit PCM`,
    },
    {
      id: 'upload',
      label: 'Upload the WAV below',
      note: 'Then send',
    },
  ],
} as const;

/** File requirements for the initial companion test (room tone + narrative). */
export const UPLOAD_SPEC = {
  index: '05',
  name: 'Send take',
  headline: 'Send this file.',
  lede: 'One take file. Room tone at the start, then the calibration passage. We use it to check the room and your voice before chapter work.',
  format: 'WAV or M4A',
  bitDepth: '16-bit PCM',
  sampleRate: '44.1 kHz',
  channels: 'Mono',
  fileName: SESSION_FILES.exportName,
  structure: [
    { label: '0–30 seconds', detail: 'Silent room tone' },
    { label: 'After 30 seconds', detail: 'Calibration passage only' },
  ],
  exportSteps: [
    'File → Export → Export as WAV',
    `Save as ${SESSION_FILES.exportName}`,
    'WAV (Microsoft) signed 16-bit PCM',
    'Mono, 44.1 kHz',
    'Do not normalize or add effects before sending',
  ],
  maxSizeLabel: '100 MB max',
  /** Extensions only. MIME tokens in accept gray out files in macOS Finder. */
  acceptAttr: '.wav,.wave,.m4a',
} as const;

export type CompanionSectionId = 'room' | 'calibration' | 'send';

export const COMPANION_SECTIONS: Array<{
  id: CompanionSectionId;
  label: string;
  href: string;
}> = [
  { id: 'room', label: 'Room tone', href: '#room-tone' },
  { id: 'calibration', label: 'Read', href: '#calibration' },
  { id: 'send', label: 'Send', href: '#send' },
];
