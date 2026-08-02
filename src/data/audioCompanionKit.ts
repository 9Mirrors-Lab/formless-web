/** Author companion kit: short first-test ritual. Sound Check only. */

export const COMPANION_KIT = {
  eyebrow: 'Companion',
  title: 'Companion',
  lede: 'Setup, silence, then read.',
  book: 'Formless',
  imprint: 'Eyes Closed',
} as const;

/** Provided filenames — author uses these exact names, not their own. */
export const SESSION_FILES = {
  projectName: 'Formless-First-Test.aup3',
  exportName: 'Formless-First-Test.wav',
  templateFileName: 'Formless-Recording-Template.aup3',
} as const;

/** First-time: get the recording template into Audacity before any take. */
export const TEMPLATE_SETUP = {
  index: '01',
  name: 'Setup',
  headline: 'Setup',
  lede: 'Get the template open, then record.',
  templateHref: `/downloads/audiobook/${SESSION_FILES.templateFileName}`,
  templateFileName: SESSION_FILES.templateFileName,
  projectName: SESSION_FILES.projectName,
  steps: [
    {
      id: 'download',
      action: 'Download',
      detail: SESSION_FILES.templateFileName,
      kind: 'download' as const,
    },
    {
      id: 'open',
      action: 'File → Open…',
      detail: SESSION_FILES.templateFileName,
      kind: 'action' as const,
    },
    {
      id: 'save-as',
      action: 'File → Save Project As…',
      detail: SESSION_FILES.projectName,
      kind: 'save' as const,
    },
    {
      id: 'settings',
      action: 'Set before Record',
      detail: '44100 Hz · Mono · playhead at 0 · no effects',
      kind: 'settings' as const,
    },
  ],
} as const;

export const ROOM_TONE = {
  index: '02',
  name: 'Room',
  durationSeconds: 30,
  headline: 'Record now',
  lede: 'Stay silent for 30 seconds.',
  rules: ['Do not move', 'Do not speak', 'Hold still the full 30 seconds'],
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
  index: '03',
  name: 'Read',
  headline: 'Keep recording. Read this.',
  lede: 'Stop when the last line ends.',
  preferredTitle: 'Read from the book',
  preferredLede:
    'For Formless, begin every recording session with the opening of Chapter One.',
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
    'Use only if the book passage is not yet locked.',
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

/** Kept for later chapter sessions after Sound Check approval. */
export const AFTER_APPROVAL = {
  index: '04',
  name: 'After approval',
  headline: 'Your voice benchmark.',
  lede: 'Once Chapter One is approved, use the approved take as the reference.',
  steps: [
    {
      id: 'play',
      title: 'Play the approved excerpt',
      detail: 'Listen for 15–20 seconds.',
    },
    {
      id: 'read',
      title: 'Read the same passage',
      detail: 'Match pacing and distance.',
    },
    {
      id: 'compare',
      title: 'Compare',
      detail: 'Notice drift before the new chapter.',
    },
    {
      id: 'begin',
      title: 'Begin the chapter',
      detail: 'Continue while the voice still matches.',
    },
  ],
} as const;

/** File requirements for the initial companion test (room tone + narrative). */
export const UPLOAD_SPEC = {
  index: '04',
  name: 'Send',
  headline: 'Send your take',
  lede: 'Export from Audacity, then send it securely to the recording room.',
  format: 'WAV, M4A, MP3, or Audacity project (.aup3)',
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
    'Mono · 44.1 kHz · 16-bit',
  ],
  maxSizeLabel: '600 MB max',
  /**
   * Empty accept: do not filter the native picker.
   * Extension/MIME accept lists grey out valid recordings on macOS Finder and iOS Files.
   * Validation in audiobookSessionTakes allows audio recordings and .aup3 projects.
   */
  acceptAttr: '',
} as const;

/** Two pages: prepare (setup + room) then read + send. */
export type CompanionSectionId = 'prepare' | 'read';

export const COMPANION_SECTIONS: Array<{
  id: CompanionSectionId;
  label: string;
  href: string;
}> = [
  { id: 'prepare', label: 'Prepare', href: '#prepare' },
  { id: 'read', label: 'Read', href: '#read' },
];
