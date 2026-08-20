/** Record Sessions: scripts the author reads at the mic. */

export const RECORD_SESSIONS = {
  title: 'Record Sessions',
  companionHref: '/audio/companion',
  companionLabel: 'Companion',
  uploadFolderHref:
    'https://drive.google.com/drive/folders/1rJIHMxtvbK9qd9mxHdmNYADxbWEsihjB?usp=sharing',
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
  /** Punch lines. Omit when the session is only a closing. */
  beats?: ScriptBeat[];
  /** Full-file closings only. Omit on a punch so the author does not keep reading. */
  closing?: ScriptBeat & { note: string };
  stopCue: string;
};

export const CHAPTER_9_PRODUCTIVITY_PUNCH: RecordSession = {
  id: 'chapter-9-productivity',
  sectionTitle: 'Re-record',
  track: 'Chapter 9 · productivity',
  saveAs: '11_Chapter_9_punch_productivity.wav',
  why: 'At 2:32 the word “productivity” sounds rushed, like it jumped ahead, then the line returns to normal. Re-record this short run so we can splice it into the existing Chapter 9 take. One second of quiet at the head is enough. Start with the first line. Stop after “presence.”',
  beats: [
    {
      id: 'run-in',
      cue: 'Start here',
      lines: ['I no longer feel pressure to always be doing something.'],
    },
    {
      id: 'punch',
      cue: 'Re-record',
      lines: [
        'I see that there is a different kind of productivity that comes from stillness and presence.',
      ],
    },
  ],
  stopCue:
    'Stay quiet for a couple of seconds. Then stop. Do not continue into “When I am still.”',
};

export const ACKNOWLEDGMENTS_RERECORD: RecordSession = {
  id: 'acknowledgments-2026-08',
  sectionTitle: 'Re-record',
  track: 'Acknowledgments',
  saveAs: '12_Acknowledgments.wav',
  why: 'The Acknowledgments take is already recorded. This session is only the ACX closing credits: title line, copyright, and The End.',
  closing: {
    id: 'closing',
    cue: 'Closing credits · new',
    note: 'Read these three lines exactly.',
    lines: [
      'You have been listening to Formless, written by Sonika Cottman, narrated by Sonika Cottman.',
      'Copyright 2026 Sonika Cottman.',
      'The End.',
    ],
  },
  stopCue: 'Stay quiet for a couple of seconds. Then stop recording.',
};

export const RECORD_SESSION_LIST: RecordSession[] = [
  CHAPTER_9_PRODUCTIVITY_PUNCH,
  ACKNOWLEDGMENTS_RERECORD,
];
