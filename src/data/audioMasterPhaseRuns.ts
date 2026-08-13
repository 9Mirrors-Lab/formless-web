/**
 * Master-phase execution records for Formless chapter tracks.
 *
 * audiobook-mastering writes the complete six-phase record here after Phase 6,
 * then marks the track `ready-for-final-qc` and stops. Do not run Final QC
 * from this page.
 *
 * Replace the matching `MasterTrackRun` (or fill empty phases) when a run finishes.
 */

import { AUDIO_CHAPTERS, type AudioChapter } from '@/data/audioReviewMock';

export type MasterPhaseId = 1 | 2 | 3 | 4 | 5 | 6;

export type MasterPhaseStatus = 'pending' | 'running' | 'complete' | 'blocked';

export type MasterTrackRunStatus = 'idle' | 'in-progress' | 'ready-for-final-qc';

export type MasterPhaseMetric = {
  label: string;
  value: string;
};

export type MasterPhaseArtifact = {
  label: string;
  path: string;
};

export type MasterPhaseRecord = {
  id: MasterPhaseId;
  name: string;
  short: string;
  status: MasterPhaseStatus;
  summary: string;
  startedAt?: string;
  completedAt?: string;
  metrics?: MasterPhaseMetric[];
  notes?: string[];
  artifacts?: MasterPhaseArtifact[];
};

export type MasterTrackRun = {
  chapterId: number;
  chapterTitle: string;
  status: MasterTrackRunStatus;
  updatedAt?: string;
  phases: MasterPhaseRecord[];
};

export const MASTER_PHASE_CATALOG: ReadonlyArray<{
  id: MasterPhaseId;
  name: string;
  short: string;
}> = [
  { id: 1, name: 'Pre-flight', short: 'Measure' },
  { id: 2, name: 'Editorial', short: 'Assess' },
  { id: 3, name: 'Restoration', short: 'Restore' },
  { id: 4, name: 'Mastering', short: 'Encode' },
  { id: 5, name: 'Post-flight', short: 'Verify' },
  { id: 6, name: 'Record', short: 'Deliver' },
];

export function emptyPhaseRecord(
  phase: (typeof MASTER_PHASE_CATALOG)[number],
): MasterPhaseRecord {
  return {
    id: phase.id,
    name: phase.name,
    short: phase.short,
    status: 'pending',
    summary: '',
  };
}

export function emptyTrackRun(chapter: AudioChapter): MasterTrackRun {
  return {
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    status: 'idle',
    phases: MASTER_PHASE_CATALOG.map(emptyPhaseRecord),
  };
}

/** Opening Credits sample from the 2026-08-01 mastering pass. Replace when re-run. */
const OPENING_CREDITS_RUN: MasterTrackRun = {
  chapterId: 13,
  chapterTitle: 'Opening Credits',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-01',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Source WAV measured before restoration. Peaks hot; room floor already close to studio target once a quiet gap is used.',
      metrics: [
        { label: 'RMS', value: 'in ACX window' },
        { label: 'True peak', value: 'at ceiling' },
        { label: 'Noise (gap)', value: 'near −60 dB' },
      ],
      notes: ['No dedicated 10 s head on this older take. Profile from a mid-file quiet gap.'],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary: 'Hold the performance. Polish peaks and conform head length. Guide a light high-pass.',
      notes: ['Client editorial lives on the Analysis page. This phase records the processing call.'],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary: 'Own-gap noise profile, click removal, 80 Hz high-pass, light 2:1 compression. Head/tail room inserted from cleaned quiet.',
      artifacts: [{ label: 'Restored WAV', path: '.cache/audiobook-takes/01_Opening_Credits_restored.wav' }],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary: 'Two-pass loudnorm I=−20 / TP=−3.5, alimiter, MP3 192k CBR mono 44.1 kHz.',
      artifacts: [{ label: 'ACX master', path: '.cache/audiobook-takes/01_Opening_Credits_acx_master.mp3' }],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary: 'Master passes RMS, true peak, and noise. Head room was long on this pass (1.77 s vs 0.5–1 s).',
      metrics: [
        { label: 'RMS', value: '−21.7 dBFS' },
        { label: 'True peak', value: '−3.7 dBFS' },
        { label: 'LUFS / LRA', value: '−20.3 / 4.2 LU' },
        { label: 'Noise floor', value: '−67.9 dB' },
        { label: 'Head', value: '1.77 s' },
        { label: 'Tail', value: '2.6 s' },
      ],
      notes: ['Trim head to ~0.75 s on the next pass. Audio quality is studio-grade.'],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary: 'Phase record written. Track marked Ready for Final QC. Final QC skill was not run.',
    },
  ],
};

const RUNS_BY_CHAPTER = new Map<number, MasterTrackRun>([
  [OPENING_CREDITS_RUN.chapterId, OPENING_CREDITS_RUN],
]);

export function masterTrackRunFor(chapter: AudioChapter): MasterTrackRun {
  return RUNS_BY_CHAPTER.get(chapter.id) ?? emptyTrackRun(chapter);
}

export const MASTER_TRACK_RUNS: MasterTrackRun[] = AUDIO_CHAPTERS.map(masterTrackRunFor);

export function findMasterTrackRun(chapterId: number): MasterTrackRun | null {
  const chapter = AUDIO_CHAPTERS.find((item) => item.id === chapterId);
  if (!chapter) return null;
  return masterTrackRunFor(chapter);
}

export function completedPhaseCount(run: MasterTrackRun): number {
  return run.phases.filter((phase) => phase.status === 'complete').length;
}

export function masterTrackStatusLabel(status: MasterTrackRunStatus): string {
  switch (status) {
    case 'idle':
      return 'Not started';
    case 'in-progress':
      return 'In progress';
    case 'ready-for-final-qc':
      return 'Ready for Final QC';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function masterPhaseStatusLabel(status: MasterPhaseStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'running':
      return 'Running';
    case 'complete':
      return 'Complete';
    case 'blocked':
      return 'Blocked';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
