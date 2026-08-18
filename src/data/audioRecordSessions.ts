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
  closing: ScriptBeat & { note: string };
  stopCue: string;
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

export const RECORD_SESSION_LIST: RecordSession[] = [ACKNOWLEDGMENTS_RERECORD];
