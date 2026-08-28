/**
 * Master-phase execution records for Formless chapter tracks.
 *
 * audiobook-mastering writes the complete six-phase record here after Phase 6,
 * then marks the track `ready-for-final-qc` and stops. Do not run Final QC
 * from this page.
 *
 * Replace the matching `MasterTrackRun` (or fill empty phases) when a run finishes.
 */

import {
  AUDIO_LISTEN_ORDER,
  canonicalChapterTitle,
  isAudioChapterId,
} from '@/data/audioBook';

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

export function emptyTrackRun(chapterId: number): MasterTrackRun {
  return {
    chapterId,
    chapterTitle: canonicalChapterTitle(chapterId),
    status: 'idle',
    phases: MASTER_PHASE_CATALOG.map(emptyPhaseRecord),
  };
}

/** Opening Credits master on disk. Re-measured 2026-08-20. */
const OPENING_CREDITS_RUN: MasterTrackRun = {
  chapterId: 13,
  chapterTitle: 'Opening Credits',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-20',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Older take: no dedicated 10 s head. Current local master is 43.15 s, MP3 192k CBR mono 44.1 kHz.',
      metrics: [
        { label: 'Master duration', value: '0:43.15' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz' },
      ],
      notes: [
        'No dedicated 10 s head on this older take. Profile from a mid-file quiet gap.',
        'Replaced the 2026-08-01 sample numbers. This row now tracks masters/01_Opening_Credits_2_acx_master.mp3.',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the read. Polish loudness already landed. Guide a head-trim pass: delivered room is still longer than 0.75 s.',
      notes: [
        'Scenario: a title sting that has to whisper the book name without ringing the bell.',
        'RMS and true peak are already in the ACX window. The leftover job is head geometry, not loudness.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Restored WAV is in the restoration folder. Own-gap profile, click removal, 80 Hz high-pass, light 2:1 compression.',
      artifacts: [
        {
          label: 'Restored WAV',
          path: 'masters/restoration/01_Opening_Credits_2_restored.wav',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'Two-pass loudnorm I=-20 / TP=-3.5, alimiter, MP3 192k CBR mono 44.1 kHz. Local master dated 2026-08-18.',
      artifacts: [
        {
          label: 'ACX master',
          path: 'masters/01_Opening_Credits_2_acx_master.mp3',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'RMS and true peak pass. Head mean passes ACX. Head max and first-word window still fail geometry: 0.75-1.5 s is still room.',
      metrics: [
        { label: 'RMS', value: '-21.7 dBFS' },
        { label: 'True peak', value: '-3.7 dBFS' },
        { label: 'LUFS / LRA', value: '-20.3 / 4.2 LU' },
        { label: 'Head 0-0.75 s', value: '-67.1 / max -53.4 dB' },
        { label: '0.75-1.5 s', value: 'room, -68.6 / -56.3' },
        { label: 'Last 2.0 s', value: '-68.5 / -56.2' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 0:43.15' },
        { label: 'ACX', value: 'RMS and peak PASS; head max FAIL' },
      ],
      notes: [
        'Head max -53.4 dB is a click or speech edge in the bed. Target max is -55.',
        '0.75-1.5 s is still room, so the delivered head is still longer than 0.75 s. Trim on the next pass.',
      ],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary:
        'Phase record rewritten from the current local master. Track stays Ready for Final QC. Final QC skill was not run.',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: 'masters/01_Opening_Credits_2_acx_master.mp3',
        },
      ],
      notes: [
        'Removed the 2026-08-01 sample dossier (1.77 s head, vague RMS/peak labels).',
      ],
    },
  ],
};

/** Chapter 1 mastering pass — dedicated 10 s head, 2026-08-13. */
const CHAPTER_1_RUN: MasterTrackRun = {
  chapterId: 1,
  chapterTitle: 'The Feeling of Wholeness',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-13',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Mono 44.1 kHz WAV with a clean dedicated ~10 s room head. Delivery is quiet and even; peaks are healthy; head noise already passes ACX.',
      startedAt: '2026-08-13T18:10:00',
      completedAt: '2026-08-13T18:11:00',
      metrics: [
        { label: 'RMS', value: '−28.5 dBFS' },
        { label: 'LUFS / LRA', value: '−27.8 / 4.2 LU' },
        { label: 'True peak', value: '−6.3 dBFS' },
        { label: 'Noise (head 0.5–9.0 s)', value: '−69.7 dB' },
        { label: 'Crest factor', value: '22.2 dB' },
        { label: 'Silence share', value: '21.5%' },
        { label: 'Duration', value: '29:48.62' },
      ],
      notes: [
        'Dedicated head: silence 0.31–10.27 s (9.96 s). Profile region 0.5–9.97 s.',
        'RMS below ACX window (too quiet). Peak and noise already pass.',
        'Source: need-to-master/03_Chapter 1.wav',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, head noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR, HPF, and 2:1 compression. Scenario: competitive tea-ceremony exam.',
      notes: [
        'Scenario: a competitive tea-ceremony exam where the only audible crime is a cup that clinks too hard.',
        '01 LUFS HOLD — How loud the whole recording feels. Integrated −27.8 LUFS; quiet capture, consistent. Raise in mastering, do not re-perform.',
        '02 LRA HOLD — How dramatic the narration is. LRA 4.2 LU; already controlled. Lightest compression only.',
        '03 RMS POLISH — Legacy ACX average. −28.5 dBFS fails the −23 to −18 window as too quiet. Loudnorm to ~−20 fixes it without changing the read.',
        '04 Peak HOLD — Loudest instant. True peak −6.3 dBFS; healthy headroom. No gain panic; limiter is a safety net only.',
        '05 Crest HOLD — Peak minus average. 22.2 dB crest; life left in the performance. Do not squash.',
        '06 Noise HOLD — What remains when narration stops. Head floor −69.7 dB already beats −60. Light 6 dB NR from own head only.',
        '07 Silence HOLD — Pause share 21.5%; natural audiobook pacing.',
        '08 Spectral GUIDE — Warm voice: low −32.2 / mid −31.1 / high −44.7 on a speech window. No bright harshness; skip de-ess.',
        '09 HPF GUIDE — 80 Hz / 12 dB removes sub-rumble without thinning the voice.',
        '10 Compression GUIDE — 2:1 peak compressor, normalize off. Finishing touch for an LRA already at 4.2.',
        '11 Limiter GUIDE — Ceiling at −3.5 dBFS after loudnorm. Surgical spikes only; peaks start at −6.3.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Own-head noise profile (0.5–9.97 s), 6 dB NR, click removal, 80 Hz HPF, light 2:1 compression. Head trimmed to 0.75 s and 2 s tail added from cleaned head room in ffmpeg.',
      startedAt: '2026-08-13T18:11:30',
      completedAt: '2026-08-13T18:13:30',
      notes: [
        'De-ess skipped: highs already quiet relative to mids; no harsh sibilance expected.',
        'Audacity WAV export path avoided; exported AIFF then converted to RIFF WAV.',
        'Head/tail conform done in ffmpeg (Audacity paste room failed on Introduction; same approach here).',
        'Cleaned head noise after NR: −76.9 dB mean on 0.5–9.0 s.',
      ],
      artifacts: [
        {
          label: 'Restored WAV (room-toned)',
          path: 'masters/restoration/03_Chapter_1_restored.wav',
        },
        {
          label: 'Restored AIFF export',
          path: 'masters/restoration/03_Chapter_1_restored.aiff',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'Two-pass loudnorm I=−20 / TP=−3.5 / LRA=4 (linear), alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-13T18:13:30',
      completedAt: '2026-08-13T18:14:30',
      metrics: [
        { label: 'loudnorm input_i', value: '−28.22' },
        { label: 'loudnorm input_tp', value: '−6.45' },
        { label: 'loudnorm input_lra', value: '4.30' },
        { label: 'loudnorm offset', value: '0.14' },
      ],
      artifacts: [
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/03_Chapter_1_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: 'masters/03_Chapter_1_acx_master.mp3',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. ACX green on all three checks.',
      startedAt: '2026-08-13T18:14:30',
      completedAt: '2026-08-13T18:15:00',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−28.5 → −21.0 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−6.3 → −3.7 dBFS' },
        { label: 'Pre Noise → Post Noise (head)', value: '−69.7 → −67.3 dB' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.4 LU' },
        { label: 'Head', value: '0.75 s' },
        { label: 'Tail', value: '2.0 s' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 29:40.33' },
        { label: 'ACX', value: 'PASS' },
      ],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary:
        'Phase record written to audioMasterPhaseRuns.ts. Track marked Ready for Final QC. Final QC skill was not run.',
      completedAt: '2026-08-13T18:15:30',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: 'masters/03_Chapter_1_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'First chapter with dedicated 10 s head workflow (profile + trim, not mid-file gap hunt).',
      ],
    },
  ],
};

/** Chapter 2 mastering pass — dedicated 10 s head, 2026-08-13. */
const CHAPTER_2_RUN: MasterTrackRun = {
  chapterId: 2,
  chapterTitle: 'Awareness and the Ego',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-13',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Mono 44.1 kHz WAV with a clean dedicated ~12 s room head. Delivery is quiet and even; peaks are healthy; head noise already beats the ACX floor.',
      startedAt: '2026-08-13T19:12:00',
      completedAt: '2026-08-13T19:13:00',
      metrics: [
        { label: 'RMS', value: '−28.8 dBFS' },
        { label: 'LUFS / LRA', value: '−27.8 / 4.3 LU' },
        { label: 'True peak', value: '−6.7 dBFS' },
        { label: 'Noise (head 0.5–11.64 s)', value: '−71.9 dB' },
        { label: 'Crest factor', value: '22.1 dB' },
        { label: 'Silence share', value: '23.6%' },
        { label: 'Duration', value: '30:45.74' },
      ],
      notes: [
        'Dedicated head: silence 0.00–11.94 s (11.94 s). Profile region 0.5–11.64 s.',
        'Listen-confirmed first phoneme at 12.35 s. Used speech_start 12.32.',
        'RMS below ACX window (too quiet). Peak and noise already pass.',
        'Source: need-to-master/04_Chapter 2.wav',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, head noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR, HPF, and 2:1 compression. Scenario: night-shift origami in a sleeping nursery.',
      notes: [
        'Scenario: a night-shift origami championship held in a sleeping baby\'s nursery. The only audible crime is a paper fold that crinkles too loud.',
        '01 LUFS HOLD — How loud the whole recording feels. The judges do not want a louder room. They want the same quiet from the first crane to the last. Integrated −27.8 LUFS; quiet capture, same as Chapter 1. Raise in mastering, do not re-perform. Signal: −27.8 LUFS.',
        '02 LRA HOLD — How dramatic the narration is. Folding a crane does not need a drum roll. LRA 4.3 LU; already controlled. Lightest compression only. Signal: 4.3 LU.',
        '03 RMS POLISH — Legacy ACX average. The nursery scoreboard still uses an old meter. −28.8 dBFS fails the −23 to −18 window as too quiet. Loudnorm to ~−20 fixes it without changing the read. Signal: −28.8 dBFS.',
        '04 Peak HOLD — Loudest instant. Nobody slammed a paperweight. True peak −6.7 dBFS; healthy headroom. Limiter is a safety net only. Signal: −6.7 dBFS.',
        '05 Crest HOLD — Peak minus average. The folds still have air between them. 22.1 dB crest; life left in the performance. Do not squash. Signal: 22.1 dB.',
        '06 Noise HOLD — What remains when narration stops. The baby stayed asleep. Head floor −71.9 dB already beats −60. Light 6 dB NR from own head only. Signal: −71.9 dB (0.5–11.64 s).',
        '07 Silence HOLD — Pause share 23.6%; natural audiobook pacing. The pauses are thinking, not empty chairs. Signal: 23.6%.',
        '08 Spectral GUIDE — Warm voice with a little more air than Chapter 1: low −33.0 / mid −30.5 / high −42.0 on a speech window. No bright harshness; skip de-ess unless the listen gate says otherwise. Signal: low −33.0 / mid −30.5 / high −42.0.',
        '09 HPF GUIDE — 80 Hz / 12 dB removes the HVAC under the crib without thinning the voice. Signal: 80 Hz, 12 dB/oct.',
        '10 Compression GUIDE — 2:1 peak compressor, normalize off. Finishing touch for an LRA already at 4.3. Signal: 2:1, threshold −18 dB, attack 10 ms, release 500 ms.',
        '11 Limiter GUIDE — Ceiling at −3.5 dBFS after loudnorm. Surgical spikes only; peaks start at −6.7. Signal: alimiter −3.5 dBFS.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Own-head noise profile (0.5–11.64 s), 6 dB NR, click removal, 80 Hz HPF, light 2:1 compression. No Audacity trim or room paste. Head/tail conform left to ffmpeg.',
      startedAt: '2026-08-13T19:18:00',
      completedAt: '2026-08-13T19:21:00',
      notes: [
        'De-ess skipped: 6–9 kHz windows mean −44 to −50, max about −17 to −23; listen gate found no harsh sibilance.',
        'Exported AIFF then converted to RIFF WAV. Duration matched source (1845.74 s).',
        'Cleaned head after NR: −81.3 dB mean / −64.3 max on 0.5–9.0 s. Inner 1.0–3.5 s: −81.9 / −68.7.',
        'Listen gate PASS: 3–5 s cleaned head was room only (no breath, chair, mouth, click).',
        'Listen gate PASS: first phoneme intact at 12.35 s (energy hop −77.8 → −35.5).',
        'Listen gate PASS: S-heavy lines at 20 s and 1498 s; no de-ess applied.',
        'Listen gate PASS: mid passage at 900 s; no over-NR warble or mouth noise.',
        'Listen gate PASS: last word intact; decay done by 1844.10–1844.20 s.',
      ],
      artifacts: [
        {
          label: 'Restored WAV (full, 10 s head still on)',
          path: '.cache/audiobook-takes/04_Chapter_2_restored_full.wav',
        },
        {
          label: 'Restored AIFF export',
          path: 'masters/restoration/04_Chapter_2_restored.aiff',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'conform_and_master.py: inner room 1.0–3.5 s, 0.75 s head / 2.0 s tail, two-pass loudnorm I=−20 / TP=−3.5 / LRA=4 (linear), alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-13T19:22:00',
      completedAt: '2026-08-13T19:23:00',
      metrics: [
        { label: 'speech_start', value: '12.32 s' },
        { label: 'body_end', value: '1844.22 s' },
        { label: 'room window', value: '1.0–3.5 s, −81.9 / −68.7 dB' },
        { label: 'loudnorm input_i', value: '−28.16' },
        { label: 'loudnorm input_tp', value: '−6.93' },
        { label: 'loudnorm input_lra', value: '4.40' },
        { label: 'loudnorm offset', value: '0.16' },
        { label: 'loudnorm target I', value: '−20' },
      ],
      notes: [
        'Script: scripts/conform_and_master.py. Dedicated-head mode. Inner-slice room, not last 0.75 s before speech.',
        'Delivered room gate: head/tail mean −81.9, max −68.7. 0.75–1.5 s speech mean −26.6.',
      ],
      artifacts: [
        {
          label: 'Room-toned WAV',
          path: 'masters/restoration/04_Chapter_2_restored.wav',
        },
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/04_Chapter_2_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: 'masters/04_Chapter_2_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: 'masters/04_Chapter_2_master_qc.json',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. Delivered head 0.77 s and tail 1.99 s. ACX green on all three checks.',
      startedAt: '2026-08-13T19:23:00',
      completedAt: '2026-08-13T19:24:00',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−28.8 → −21.3 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−6.7 → −3.6 dBFS true peak' },
        { label: 'Pre Noise → Post Noise (head)', value: '−71.9 → −73.8 dB' },
        { label: 'Head max', value: '−61.1 dB' },
        { label: 'Tail 2.0 s', value: '−74.4 / −62.4 dB' },
        { label: '0.75–1.5 s speech', value: '−18.0 dB mean' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.5 LU' },
        { label: 'Head', value: '0.77 s' },
        { label: 'Tail', value: '1.99 s' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 30:34.65' },
        { label: 'ACX', value: 'PASS' },
      ],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary:
        'Phase record written to audioMasterPhaseRuns.ts. Track marked Ready for Final QC. Final QC skill was not run.',
      completedAt: '2026-08-13T19:24:30',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: 'masters/04_Chapter_2_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'Quiet-capture pattern continues from Chapter 1 (RMS ~−28 to −29, peaks ~−6 to −7). Loudnorm handles it. Mic gain is healthy, not hot.',
      ],
    },
  ],
};

/** Chapter 3 mastering pass — dedicated 10 s head, 2026-08-13. */
const CHAPTER_3_RUN: MasterTrackRun = {
  chapterId: 3,
  chapterTitle: 'Past Pain, Time and the Present Moment',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-13',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Mono 44.1 kHz WAV with a clean dedicated ~12 s room head. Delivery is quiet and even; peaks are healthy; head mean already passes ACX, with a few small transients in the bed.',
      startedAt: '2026-08-13T22:06:00',
      completedAt: '2026-08-13T22:08:00',
      metrics: [
        { label: 'RMS', value: '−28.4 dBFS' },
        { label: 'LUFS / LRA', value: '−27.5 / 4.4 LU' },
        { label: 'True peak', value: '−6.7 dBFS' },
        { label: 'Noise (head 0.5–11.5 s)', value: '−65.9 dB' },
        { label: 'Head max', value: '−52.0 dB' },
        { label: 'Crest factor', value: '21.7 dB' },
        { label: 'Silence share', value: '24.9%' },
        { label: 'Duration', value: '36:21.46' },
      ],
      notes: [
        'Dedicated head: silence 0.00–11.80 s (11.80 s). Tiny −47.6 dB blip at 11.80 s is not speech.',
        'Listen-confirmed first phoneme at 13.30 s (energy hop −65.8 → −38.1). Used speech_start 13.28.',
        'Profile region 0.5–11.50 s to skip the 11.80 blip.',
        'RMS below ACX window (too quiet). Peak and noise mean already pass.',
        'Source: need-to-master/05_Chapter 3.wav',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, head noise mean, and healthy peaks. Polish RMS up with loudnorm. Guide light NR, HPF, and 2:1 compression. Scenario: lost-and-found counter for missing Tuesdays.',
      notes: [
        'Scenario: a lost-and-found counter for missing Tuesdays, staffed by clocks that must not tick. The only audible crime is a claim-ticket stapler that snaps too loud.',
        '01 LUFS HOLD — How loud the whole recording feels. The counter does not want a louder lobby. It wants the same hush from the first missing afternoon to the last. Integrated −27.5 LUFS; quiet capture, same family as Chapters 1–2. Raise in mastering, do not re-perform. Signal: −27.5 LUFS.',
        '02 LRA HOLD — How dramatic the narration is. Nobody needs a drumroll to hand back a Tuesday. LRA 4.4 LU; already controlled. Lightest compression only. Signal: 4.4 LU.',
        '03 RMS POLISH — Legacy ACX average. The claim form still uses an old meter. −28.4 dBFS fails the −23 to −18 window as too quiet. Loudnorm to ~−20 fixes it without changing the read. Signal: −28.4 dBFS.',
        '04 Peak HOLD — Loudest instant. Nobody slammed the stapler. True peak −6.7 dBFS; healthy headroom. Limiter is a safety net only. Signal: −6.7 dBFS.',
        '05 Crest HOLD — Peak minus average. The pauses still have air. 21.7 dB crest; life left in the performance. Do not squash. Signal: 21.7 dB.',
        '06 Noise HOLD — What remains when narration stops. The clocks stayed still. Head mean −65.9 dB already beats −60. Small bed transients (max −52) get click removal plus light NR so loudnorm does not lift them. Signal: −65.9 dB mean (0.5–11.5 s).',
        '07 Silence HOLD — Pause share 24.9%; natural audiobook pacing. The gaps are thinking, not empty chairs. Signal: 24.9%.',
        '08 Spectral GUIDE — Warm voice with a little more air than Chapter 1: low −33.7 / mid −31.4 / high −39.2 on a speech window. No bright harshness; skip de-ess unless the listen gate says otherwise. Signal: low −33.7 / mid −31.4 / high −39.2.',
        '09 HPF GUIDE — 80 Hz / 12 dB removes the HVAC under the counter without thinning the voice. Signal: 80 Hz, 12 dB/oct.',
        '10 Compression GUIDE — 2:1 peak compressor, normalize off. Finishing touch for an LRA already at 4.4. Signal: 2:1, threshold −18 dB, attack 10 ms, release 500 ms.',
        '11 Limiter GUIDE — Ceiling at −3.5 dBFS after loudnorm. Surgical spikes only; peaks start at −6.7. Signal: alimiter −3.5 dBFS.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Own-head noise profile (0.5–11.50 s), 6 dB NR, click removal, 80 Hz HPF, light 2:1 compression, then a second 6 dB NR so loudnorm would not lift the delivered head. No Audacity trim or room paste.',
      startedAt: '2026-08-13T22:11:00',
      completedAt: '2026-08-13T22:16:00',
      notes: [
        'De-ess skipped: 6–9 kHz at 20 s mean −42.5 / max −17.4; listen gate found no harsh sibilance.',
        'First NR pass left cleaned head at −73.7 / −58.5. After loudnorm the MP3 head max hit −52, so a second 6 dB NR was applied from the same head.',
        'After second NR: head 0.5–9.0 s −81.9 / −67.4. First phoneme still intact at 13.30 s (−77.4 → −38.1).',
        'Exported AIFF then converted to RIFF WAV. Duration matched source (2181.46 s).',
        'Listen gate PASS: 3–5 s cleaned head was room only (no breath, chair, mouth, click).',
        'Listen gate PASS: first phoneme intact at 13.30 s.',
        'Listen gate PASS: S-heavy lines at 20 s and mid-file 1100 s; no de-ess applied.',
        'Listen gate PASS: mid passage at 1100 s; no over-NR warble or mouth noise.',
        'Listen gate PASS: last word intact; decay done by 2180.90 s.',
      ],
      artifacts: [
        {
          label: 'Restored WAV (full, 10 s head still on)',
          path: '.cache/audiobook-takes/05_Chapter_3_restored_full.wav',
        },
        {
          label: 'Restored AIFF export (2nd NR)',
          path: 'masters/restoration/05_Chapter_3_restored_nr2.aiff',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'conform_and_master.py: inner room 1.0–3.5 s, 0.75 s head / 2.0 s tail, two-pass loudnorm I=−20 / TP=−3.5 / LRA=4 (linear), alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-13T22:17:00',
      completedAt: '2026-08-13T22:18:00',
      metrics: [
        { label: 'speech_start', value: '13.28 s' },
        { label: 'body_end', value: '2180.90 s' },
        { label: 'room window', value: '1.0–3.5 s, −81.9 / −67.4 dB' },
        { label: 'loudnorm input_i', value: '−28.19' },
        { label: 'loudnorm input_tp', value: '−6.06' },
        { label: 'loudnorm input_lra', value: '4.60' },
        { label: 'loudnorm offset', value: '0.15' },
        { label: 'loudnorm target I', value: '−20' },
      ],
      notes: [
        'Script: scripts/conform_and_master.py. Dedicated-head mode. Inner-slice room, not last 0.75 s before speech.',
        'First encode after 6 dB NR failed delivered head max (−52). Re-encoded after second NR.',
        'Delivered room gate (WAV): head/tail mean −82.5 / −81.9, max −70.3 / −67.4. 0.75–1.5 s speech mean −27.9.',
      ],
      artifacts: [
        {
          label: 'Room-toned WAV',
          path: 'masters/restoration/05_Chapter_3_restored.wav',
        },
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/05_Chapter_3_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: 'masters/05_Chapter_3_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: 'masters/05_Chapter_3_master_qc.json',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. Delivered head 0.76 s and tail 1.88 s. ACX green on all three checks.',
      startedAt: '2026-08-13T22:18:00',
      completedAt: '2026-08-13T22:19:00',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−28.4 → −21.3 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−6.7 → −3.7 dBFS true peak' },
        { label: 'Pre Noise → Post Noise (head)', value: '−65.9 → −72.7 dB' },
        { label: 'Head max', value: '−60.8 dB' },
        { label: 'Tail 2.0 s', value: '−74.2 / −59.2 dB' },
        { label: '0.75–1.5 s speech', value: '−17.7 dB mean' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.6 LU' },
        { label: 'Head', value: '0.76 s' },
        { label: 'Tail', value: '1.88 s' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 36:10.37' },
        { label: 'ACX', value: 'PASS' },
      ],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary:
        'Phase record written to audioMasterPhaseRuns.ts. Track marked Ready for Final QC. Final QC skill was not run.',
      completedAt: '2026-08-13T22:19:30',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: 'masters/05_Chapter_3_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'Quiet-capture pattern continues from Chapters 1–2 (RMS ~−28, peaks ~−6.7). Loudnorm handles it. Mic gain is healthy, not hot.',
        'Chapter 3 head started noisier than 1–2 (−65.9 vs −70-ish). Second NR pass was required so the loudnorm boost would not lift the delivered bed.',
      ],
    },
  ],
};

/** Chapter 4 remaster — updated take with dedicated 10 s head, 2026-08-27. */
const CHAPTER_4_RUN: MasterTrackRun = {
  chapterId: 4,
  chapterTitle: 'Resistance and Surrender',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-27',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Updated mono 44.1 kHz WAV with a clean dedicated ~9.6 s room head. Quiet even delivery; healthy peaks; head mean already passes ACX, with a few small bed transients.',
      startedAt: '2026-08-27T13:13:00',
      completedAt: '2026-08-27T13:14:30',
      metrics: [
        { label: 'RMS', value: '−28.5 dBFS' },
        { label: 'LUFS / LRA', value: '−27.7 / 4.2 LU' },
        { label: 'True peak', value: '−5.8 dBFS' },
        { label: 'Noise (head 0.5–9.0 s)', value: '−65.7 dB' },
        { label: 'Head max', value: '−53.7 dB' },
        { label: 'Crest factor', value: '22.7 dB' },
        { label: 'Silence share', value: '23.3%' },
        { label: 'Duration', value: '40:44.74' },
      ],
      notes: [
        'Dedicated head: silence 0.00–9.64 s (9.64 s). Energy hop confirms first phoneme at 9.85 s (not the silence_end blip).',
        'Used speech_start 9.82. Profile region 0.5–9.50 s.',
        'RMS below ACX window. Peak and noise mean already pass.',
        'Source: Remaster/06_Chapter 4_Updated.wav → .cache/audiobook-takes/06_Chapter_4_source.wav',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, head noise mean, and healthy peaks. Polish RMS up with loudnorm. Guide light NR, HPF, and 2:1 compression. Scenario: a competitive origami booth judged only by fold silence.',
      notes: [
        'Scenario: a competitive origami contest held inside a recording booth, judged only by how quietly the paper folds. One crease still snaps.',
        '01 LUFS HOLD — How loud the whole recording feels. Integrated −27.7 LUFS; quiet capture, same family as prior chapters. Raise in mastering, do not re-perform.',
        '02 LRA HOLD — How dramatic the narration is. LRA 4.2 LU; already controlled. Lightest compression only.',
        '03 RMS POLISH — Legacy ACX average. −28.5 dBFS fails the −23 to −18 window as too quiet. Loudnorm to ~−20 fixes it without changing the read.',
        '04 Peak HOLD — Loudest instant. True peak −5.8 dBFS; healthy headroom. Limiter is a safety net only.',
        '05 Crest HOLD — Peak minus average. 22.7 dB crest; life left in the performance. Do not squash.',
        '06 Noise HOLD — What remains when narration stops. Head mean −65.7 dB already beats −60. Small bed transients (max −53.7) get click removal plus light NR, then a second NR for loudnorm survival.',
        '07 Silence HOLD — Pause share 23.3%; natural audiobook pacing.',
        '08 Spectral GUIDE — Mid band dominates highs (~−31.6 mid vs ~−45.4 high on a sample window). Skip de-ess unless the listen gate says otherwise.',
        '09 HPF GUIDE — 80 Hz / 12 dB removes HVAC rumble without thinning the voice.',
        '10 Compression GUIDE — 2:1 peak compressor, normalize off. Finishing touch for an LRA already at 4.2.',
        '11 Limiter GUIDE — Ceiling at −3.5 dBFS after loudnorm. Surgical spikes only; peaks start at −5.8.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Own-head noise profile (0.5–9.50 s), 6 dB NR, click removal, 80 Hz HPF, light 2:1 compression, then a second 6 dB NR from the cleaned head so loudnorm would not lift the delivered bed.',
      startedAt: '2026-08-27T13:15:00',
      completedAt: '2026-08-27T13:19:00',
      notes: [
        'De-ess skipped. Band check and listen gate found no harsh sibilance.',
        'First NR left cleaned head 1.0–3.5 s at −71.0 / −59.9. Expected loudnorm gain ~+8.5 dB → estimated head max −51.4; second 6 dB NR required.',
        'After second NR + click/HPF/compress: head 1.0–3.5 s −81.9 / −69.5. First phoneme intact at 9.85 s.',
        'Listen gate PASS: cleaned head room, first word, S-lines, mid passage, last word.',
      ],
      artifacts: [
        {
          label: 'Restored AIFF (full, 10 s head still on)',
          path: 'masters/restoration/06_Chapter_4_restored.aiff',
        },
        {
          label: 'Restored WAV (room-toned keeper)',
          path: 'masters/restoration/06_Chapter_4_restored.wav',
        },
        {
          label: 'NR1 keeper AIFF',
          path: 'masters/restoration/06_Chapter_4_restored_nr1.aiff',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'conform_and_master.py: inner room 1.0–3.5 s, 0.75 s head / 2.0 s tail, two-pass loudnorm I=−20 / TP=−3.5 / LRA=4, alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-27T13:20:00',
      completedAt: '2026-08-27T13:21:30',
      metrics: [
        { label: 'speech_start', value: '9.82 s' },
        { label: 'body_end', value: '2443.81 s' },
        { label: 'room window', value: '1.0–3.5 s, −81.9 / −69.5 dB' },
        { label: 'loudnorm target I', value: '−20' },
      ],
      notes: [
        'Script: audiobook-mastering/scripts/conform_and_master.py. Dedicated-head mode. Inner-slice room, not last 0.75 s before speech.',
        'Delivered room gate (WAV): head/tail mean −81.9, max −69.5. 0.75–1.5 s speech mean −26.4.',
      ],
      artifacts: [
        {
          label: 'ACX master',
          path: 'masters/06_Chapter_4_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: 'masters/06_Chapter_4_master_qc.json',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. Delivered head ~0.75 s and tail 2.00 s. ACX green on all three checks.',
      startedAt: '2026-08-27T13:21:30',
      completedAt: '2026-08-27T13:22:00',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−28.5 → −21.3 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−5.8 → −3.7 dBFS' },
        { label: 'Pre Noise → Post Noise (head)', value: '−65.7 → −74.4 dB' },
        { label: 'Head max', value: '−62.4 dB' },
        { label: 'LUFS / LRA', value: '−20.3 / 3.4 LU' },
        { label: 'Head', value: '0.75 s' },
        { label: 'Tail', value: '2.00 s' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 40:36.74' },
        { label: 'ACX', value: 'PASS' },
      ],
      notes: [
        'MP3 last-2 s window shows a −45.9 dB max at the speech/tail boundary (decoder smear). Loudnorm WAV tail and MP3 inner tail max −61 / −62; mean stays room.',
      ],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary:
        'Phase record written to audioMasterPhaseRuns.ts. Track marked Ready for Final QC. Final QC skill was not run.',
      completedAt: '2026-08-27T13:22:30',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: 'masters/06_Chapter_4_acx_master.mp3',
        },
      ],
      notes: [
        'Remaster of author-updated Chapter 4 (Remaster/06_Chapter 4_Updated.wav). Prior 2026-08-13 master kept as *.bak.',
        'Quiet-capture pattern continues (RMS ~−28.5, peaks ~−5.8). Loudnorm handles it.',
      ],
    },
  ],
};

/** Chapter 5 remaster — Updated2 WAV, no dedicated head, fallback gap, 2026-08-27. */
const CHAPTER_5_RUN: MasterTrackRun = {
  chapterId: 5,
  chapterTitle: 'Conscious Relationships',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-27',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Updated2 mono 44.1 kHz WAV with no dedicated 10 s head. Quiet even capture; peaks healthy; longest clean mid-file gap already passes ACX noise.',
      startedAt: '2026-08-27T22:28:00',
      completedAt: '2026-08-27T22:29:00',
      metrics: [
        { label: 'RMS', value: '−31.4 dBFS' },
        { label: 'LUFS / LRA', value: '−30.7 / 4.4 LU' },
        { label: 'True peak', value: '−8.1 dBFS' },
        { label: 'Noise (gap 231.05–233.91 s)', value: '−75.8 dB' },
        { label: 'Gap max', value: '−63.5 dB' },
        { label: 'Crest factor', value: '23.3 dB' },
        { label: 'Silence share', value: '~22%' },
        { label: 'Duration', value: '52:24.99' },
      ],
      notes: [
        'No dedicated 10 s head. Speech from ~0 s; 0.5 s dip is a breath pause, not a room bed.',
        'Used speech_start 0.08 so the first phoneme is not eaten. Body end 3143.0 (last word decay; tail room after).',
        'Profile region: longest clean gap 231.046–233.914 s (2.867 s). Inner slice 231.35–233.62. Mean −75.8 / max −63.5.',
        'RMS below ACX window (too quiet). Peak and gap noise already pass. Expected loudnorm gain ~+11.4 dB.',
        'Source: Remaster/07_Chapter 5_Updated2.wav',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, gap noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR from a mid-file gap, HPF, and 2:1 compression. Scenario: submarine sandwich shop depth-gauge calibration.',
      notes: [
        'Scenario: a submarine sandwich shop that is literally a submarine, and the narrator is the depth gauge whispering calibration numbers while the crew makes foot-longs in total silence. Updated2 is the same quiet boat; she just fixed the typo on the pressure dial.',
        '01 LUFS HOLD — How loud the whole recording feels. The hull does not want a louder dive. Same hush from first torpedo roll to last pickle jar. Integrated −30.7 LUFS; quieter family, raise in mastering. Signal: −30.7 LUFS.',
        '02 LRA HOLD — How dramatic the narration is. Nobody needs a klaxon next to a turkey sub. LRA 4.4 LU; already controlled. Lightest compression only. Signal: 4.4 LU.',
        '03 RMS POLISH — Legacy ACX average. The captain log still uses the old meter. −31.4 dBFS fails −23 to −18 as too quiet. Expected loudnorm gain about +11.4 dB. Signal: −31.4 dBFS.',
        '04 Peak HOLD — Loudest instant. Nobody slammed a bulkhead. True peak −8.1 dBFS; healthy headroom. Limiter is a safety net only. Signal: −8.1 dBFS.',
        '05 Crest HOLD — Peak minus average. The pauses still have water in them. 23.3 dB crest; life left in the performance. Do not squash. Signal: 23.3 dB.',
        '06 Noise HOLD — What remains when narration stops. The ballast tanks were already quiet. No 10 s head; longest clean gap mean −75.8 dB already beats −60. Short 2.87 s gap, NR stays conservative, then a second 6 dB pass so the +11.4 dB loudnorm boost does not lift the bed. Signal: −75.8 dB mean / −63.5 dB max (231.05–233.91 s).',
        '07 Silence HOLD — Pause share ~22%; natural audiobook pacing. The gaps are sonar pings, not empty tanks. Signal: ~22%.',
        '08 Spectral GUIDE — Warm voice, quieter air. No bright harshness in 6–9 kHz windows; skip de-ess unless the listen gate says otherwise. Signal: S-band checks at 20 s and 2000 s.',
        '09 HPF GUIDE — 80 Hz / 12 dB removes the rumble under the keel without thinning the voice. Signal: 80 Hz, 12 dB/oct.',
        '10 Compression GUIDE — 2:1 peak compressor, normalize off. Finishing touch for an LRA already at 4.4. Signal: 2:1, threshold −18 dB, attack 10 ms, release 500 ms.',
        '11 Limiter GUIDE — Ceiling at −3.5 dBFS after loudnorm. Surgical spikes only; peaks start at −8.1. Signal: alimiter −3.5 dBFS.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Fallback-gap noise profile (231.35–233.62 s), 6 dB NR, click removal, 80 Hz HPF, light 2:1 compression, then a second 6 dB NR so loudnorm would not lift the delivered bed. Exported immediately after each NR to dodge Audacity post-NR crashes.',
      startedAt: '2026-08-27T22:29:00',
      completedAt: '2026-08-27T22:32:00',
      notes: [
        'Audacity crashed on click_removal after first session (known Chapter 5 pattern). Workaround: export AIFF immediately after each NR pass before any other effect; relaunch and resume from NR1 keeper.',
        'After first NR: cleaned gap −82.5 / −69.5. After click/HPF/compress: gap max −66.8; −66.8 + 11.4 = −55.4 borderline fail −55. Second 6 dB NR from the cleaned gap.',
        'After second NR: gap −84.3 / −71.2. Survival −71.2 + 11.4 = −59.8 (under −55).',
        'De-ess skipped: 6–9 kHz at 20 s (−65.3 / −43.3) and 2000 s (−55.4 / −32.1); no harsh sibilance flagged.',
        'Exported AIFF then converted to RIFF WAV. Duration matched source (3144.996 s).',
        'Listen gate PASS: cleaned gap 231.35–233.62 s room only (all hops quieter than −55).',
        'Listen gate PASS: first sentence energy intact from ~0.15 s; early phoneme kept with speech_start 0.08.',
        'Listen gate PASS: S-heavy lines at 20 s and 2000 s; no de-ess applied.',
        'Listen gate PASS: mid passage at ~1100 s; no over-NR warble in band metrics.',
        'Listen gate PASS: last word intact; decay done by 3143.0 s.',
      ],
      artifacts: [
        {
          label: 'NR1 AIFF (post-crash keeper)',
          path: 'masters/restoration/07_Chapter_5_nr1_updated2.aiff',
        },
        {
          label: 'Post-FX AIFF (pre-2nd NR)',
          path: 'masters/restoration/07_Chapter_5_postfx_updated2.aiff',
        },
        {
          label: 'Restored WAV (full, untrimmed)',
          path: '.cache/audiobook-takes/07_Chapter_5_restored_full.wav',
        },
        {
          label: 'Restored AIFF export (2nd NR)',
          path: 'masters/restoration/07_Chapter_5_restored_updated2.aiff',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'conform_and_master.py fallback-gap mode: room from inner gap 231.33 t=2.267 s, 0.75 s head / 2.0 s tail, two-pass loudnorm I=−20 / TP=−3.5 / LRA=4, alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-27T22:32:00',
      completedAt: '2026-08-27T22:34:00',
      metrics: [
        { label: 'speech_start', value: '0.08 s' },
        { label: 'body_end', value: '3143.0 s' },
        { label: 'room window', value: 'gap 231.33 t=2.267 s, −84.3 / −71.2 dB' },
        { label: 'loudnorm input_i', value: '−31.02' },
        { label: 'loudnorm input_tp', value: '−7.62' },
        { label: 'loudnorm input_lra', value: '4.60' },
        { label: 'loudnorm offset', value: '0.00' },
        { label: 'loudnorm target I', value: '−20' },
      ],
      notes: [
        'Script: scripts/conform_and_master.py. Fallback-gap mode. Room from inner 2.267 s of the 2.867 s gap.',
        'Delivered room gate (WAV): head/tail mean −84.3 / −84.3, max −72.2 / −72.2. 0.75–1.5 s speech mean −32.3.',
      ],
      artifacts: [
        {
          label: 'Room-toned WAV',
          path: 'masters/restoration/07_Chapter_5_restored.wav',
        },
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/07_Chapter_5_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: 'masters/07_Chapter_5_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: 'masters/07_Chapter_5_master_qc.json',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. Delivered head 0.75 s and tail 2.00 s. ACX green on all three checks.',
      startedAt: '2026-08-27T22:34:00',
      completedAt: '2026-08-27T22:35:00',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−31.4 → −21.0 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−8.1 → −3.6 dBFS true peak' },
        { label: 'Pre Noise → Post Noise (head)', value: '−75.8 → −75.5 dB' },
        { label: 'Head max', value: '−63.9 dB' },
        { label: 'Tail 2.0 s', value: '−75.3 / −62.0 dB' },
        { label: '0.75–1.5 s speech', value: '−21.1 dB mean' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.7 LU' },
        { label: 'Head', value: '0.75 s' },
        { label: 'Tail', value: '2.00 s' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 52:25.67' },
        { label: 'ACX', value: 'PASS' },
      ],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary:
        'Phase record written to audioMasterPhaseRuns.ts. Track marked Ready for Final QC. Final QC skill was not run.',
      completedAt: '2026-08-27T22:35:30',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: 'masters/07_Chapter_5_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'Remaster from Remaster/07_Chapter 5_Updated2.wav. Quiet-capture pattern continues (RMS −31.4). Peaks healthy (−8.1). Loudnorm handles it.',
        'No dedicated 10 s head. Room from a 2.87 s mid-file gap at 231 s. Do not reuse that profile on later chapters.',
      ],
    },
  ],
};

/** Chapter 6 remaster — Updated WAV, no dedicated head, fallback gap, 2026-08-27. */
const CHAPTER_6_RUN: MasterTrackRun = {
  chapterId: 6,
  chapterTitle: 'Work, Identity and Purpose',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-27',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Updated mono 44.1 kHz WAV with no dedicated 10 s head. Speech starts at ~1.00 s. Quiet even capture; peaks healthy; longest clean mid-file gap already passes ACX noise on the inner slice.',
      startedAt: '2026-08-27T14:27:00',
      completedAt: '2026-08-27T14:28:30',
      metrics: [
        { label: 'RMS', value: '−30.3 dBFS' },
        { label: 'LUFS / LRA', value: '−29.5 / 4.2 LU' },
        { label: 'True peak', value: '−5.9 dBFS' },
        { label: 'Noise (gap inner 1812.74–1814.34 s)', value: '−73.6 dB' },
        { label: 'Gap max', value: '−61.7 dB' },
        { label: 'Crest factor', value: '24.3 dB' },
        { label: 'Silence share', value: '19.7%' },
        { label: 'Duration', value: '49:16.50' },
      ],
      notes: [
        'No dedicated 10 s head. Speech energy from ~1.00 s; early quiet 0–1.00 s is a short room pad, not a 10 s bed.',
        'Energy hop confirms first phoneme at 1.00 s (−63 → −44.5, then −27.6 at 1.10 s). Used speech_start 0.98.',
        'Profile region: longest gap 1812.341–1815.953 s (3.612 s). Edge leak at 1812.341 and a −54.7 dB blip at 1814.441. Used clean inner 1812.741–1814.341 (mean −73.6 / max −61.7).',
        'RMS below ACX window (too quiet). Peak and inner-gap noise already pass. Expected loudnorm gain ~+10.3 dB.',
        'Last word decay done by 2955.28 s. Source already had ~1.2 s of tail room; ffmpeg rebuilt 2.0 s from the gap.',
        'Source: Remaster/08_Chapter 6_Updated.wav (open in Audacity as 08_Chapter 6_Updated). Prior 2026-08-13 master kept as *.bak.',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, gap noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR from a mid-file gap, HPF, and 2:1 compression. Scenario: library after-hours purpose-statement workshop.',
      notes: [
        'Scenario: a 49-minute after-hours workshop in a locked library, where every attendee must whisper their purpose statement so quietly the motion lights stay off. She already has the job. She just sat one aisle farther from the lav mic.',
        '01 LUFS HOLD — How loud the whole recording feels. The motion lights do not want a louder aisle. Same hush from first shelf to last. Integrated −29.5 LUFS; quieter family, raise in mastering. Signal: −29.5 LUFS.',
        '02 LRA HOLD — How dramatic the narration is. Nobody needs a drumroll next to the quiet-study signs. LRA 4.2 LU; already controlled. Lightest compression only. Signal: 4.2 LU.',
        '03 RMS POLISH — Legacy ACX average. The workshop packet still uses the old meter. −30.3 dBFS fails −23 to −18 as too quiet. Expected loudnorm gain about +10.3 dB. Signal: −30.3 dBFS.',
        '04 Peak HOLD — Loudest instant. Nobody dropped a hardcover. True peak −5.9 dBFS; healthy headroom. Limiter is a safety net only. Signal: −5.9 dBFS.',
        '05 Crest HOLD — Peak minus average. The pauses still have air between the stacks. 24.3 dB crest; life left in the performance. Do not squash. Signal: 24.3 dB.',
        '06 Noise HOLD — What remains when narration stops. The HVAC was already off. No 10 s head; clean inner gap mean −73.6 dB already beats −60. Short 1.60 s inner slice of a 3.61 s gap, so NR stays conservative, then a second 6 dB pass so the +10.3 dB loudnorm boost does not lift the bed. Signal: −73.6 dB mean / −61.7 dB max (1812.74–1814.34 s).',
        '07 Silence HOLD — Pause share 19.7%; natural audiobook pacing. The gaps are thinking, not empty stacks. Signal: 19.7%.',
        '08 Spectral GUIDE — Warm voice, quieter air. S-band checks at 20 s and 1100 s; skip de-ess unless the listen gate says otherwise. Signal: S-band at 20 s / 1100 s.',
        '09 HPF GUIDE — 80 Hz / 12 dB removes the rumble under the floors without thinning the voice. Signal: 80 Hz, 12 dB/oct.',
        '10 Compression GUIDE — 2:1 peak compressor, normalize off. Finishing touch for an LRA already at 4.2. Signal: 2:1, threshold −18 dB, attack 10 ms, release 500 ms.',
        '11 Limiter GUIDE — Ceiling at −3.5 dBFS after loudnorm. Surgical spikes only; peaks start at −5.9. Signal: alimiter −3.5 dBFS.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Fallback-gap noise profile (1812.74–1814.34 s), 10 dB NR, click removal, 80 Hz HPF, light 2:1 compression, then a second 6 dB NR so loudnorm would not lift the delivered bed. No Audacity trim or room paste.',
      startedAt: '2026-08-27T14:28:30',
      completedAt: '2026-08-27T14:30:30',
      notes: [
        'De-ess skipped: 6–9 kHz windows at 20 s (−55.2 / −28.3) and 1100 s (−45.6 / −23.4); listen gate found no harsh sibilance.',
        'After first NR: cleaned gap −78.3 / −65.2. Expected loudnorm gain +10.3 would put max near −54.9; second 6 dB NR required.',
        'After second NR + click/HPF/compress: gap −83.3 / −71.2. First phoneme still intact at 1.00 s (−56.9 → −44.6).',
        'Exported AIFF then converted to RIFF WAV. Duration matched source (2956.50 s).',
        'Listen gate PASS: cleaned gap 1812.74–1814.34 s was room only (no breath, chair, mouth, click).',
        'Listen gate PASS: first phoneme intact at 1.00 s; 0.85 s file-head blip is not speech.',
        'Listen gate PASS: S-heavy lines at 20 s and 1100 s; no de-ess applied.',
        'Listen gate PASS: mid passage at 1100 s (−30.0 / −16.0); no over-NR warble.',
        'Listen gate PASS: last word intact; decay done by 2955.28 s.',
      ],
      artifacts: [
        {
          label: 'Restored AIFF (full, untrimmed)',
          path: 'masters/restoration/08_Chapter_6_restored.aiff',
        },
        {
          label: 'Restored WAV (room-toned keeper)',
          path: 'masters/restoration/08_Chapter_6_restored.wav',
        },
        {
          label: 'NR1 keeper AIFF',
          path: 'masters/restoration/08_Chapter_6_restored_nr1.aiff',
        },
        {
          label: 'NR2 keeper AIFF',
          path: 'masters/restoration/08_Chapter_6_restored_nr2.aiff',
        },
        {
          label: 'Restored WAV (full, scratch)',
          path: '.cache/audiobook-takes/08_Chapter_6_restored_full.wav',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'conform_and_master.py fallback-gap mode: room from inner gap 1812.901 t=1.0 s, 0.75 s head / 2.0 s tail, two-pass loudnorm I=−20 / TP=−3.5 / LRA=4, alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-27T14:31:00',
      completedAt: '2026-08-27T14:32:30',
      metrics: [
        { label: 'speech_start', value: '0.98 s' },
        { label: 'body_end', value: '2955.28 s' },
        { label: 'room window', value: 'gap 1812.901 t=1.0 s, −83.3 / −71.2 dB' },
        { label: 'loudnorm input_i', value: '−29.92' },
        { label: 'loudnorm input_tp', value: '−5.45' },
        { label: 'loudnorm input_lra', value: '4.30' },
        { label: 'loudnorm offset', value: '−0.01' },
        { label: 'loudnorm target I', value: '−20' },
      ],
      notes: [
        'Script: audiobook-mastering/scripts/conform_and_master.py. Fallback-gap mode. Room from inner 1.0 s of the clean 1.60 s gap window, not the short 1.00 s file head, and not the −54.7 dB blip at 1814.441.',
        'Delivered room gate (WAV): head/tail mean −83.3 / −83.3, max −71.2 / −71.2. 0.75–1.5 s speech mean −31.0.',
      ],
      artifacts: [
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/08_Chapter_6_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: 'masters/08_Chapter_6_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: 'masters/08_Chapter_6_master_qc.json',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. Delivered head 0.75 s and tail 2.00 s. ACX green on all three checks.',
      startedAt: '2026-08-27T14:32:30',
      completedAt: '2026-08-27T14:33:00',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−30.3 → −21.0 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−5.9 → −3.7 dBFS true peak' },
        { label: 'Pre Noise → Post Noise (head)', value: '−73.6 → −72.8 dB' },
        { label: 'Head max', value: '−60.2 dB' },
        { label: 'Tail 2.0 s', value: '−76.3 / −63.9 dB' },
        { label: '0.75–1.5 s speech', value: '−17.6 dB mean' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.5 LU' },
        { label: 'Head', value: '0.75 s' },
        { label: 'Tail', value: '2.00 s' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 49:17.05' },
        { label: 'ACX', value: 'PASS' },
      ],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary:
        'Phase record written to audioMasterPhaseRuns.ts. Track marked Ready for Final QC. Final QC skill was not run.',
      completedAt: '2026-08-27T14:33:30',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: 'masters/08_Chapter_6_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'Remaster from Remaster/08_Chapter 6_Updated.wav. Quiet-capture pattern continues (RMS −30.3). Peaks healthy (−5.9). Loudnorm handles it.',
        'No dedicated 10 s head. Room from a 1.60 s inner slice of a 3.61 s mid-file gap. Do not reuse that profile on later chapters.',
        'Prior 2026-08-13 master kept as masters/08_Chapter_6_acx_master_2026-08-13.mp3.bak.',
      ],
    },
  ],
};

/** Chapter 7 remaster — Updated WAV, no dedicated head, fallback gap, 2026-08-27. */
const CHAPTER_7_RUN: MasterTrackRun = {
  chapterId: 7,
  chapterTitle: 'Nature, Animals and Presence',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-27',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Updated mono 44.1 kHz WAV with no dedicated 10 s head. Speech starts at ~1.15 s. Quiet even capture; peaks healthy; longest clean mid-file gap already passes ACX noise on the inner slice.',
      startedAt: '2026-08-27T14:43:00',
      completedAt: '2026-08-27T14:44:30',
      metrics: [
        { label: 'RMS', value: '−29.7 dBFS' },
        { label: 'LUFS / LRA', value: '−28.9 / 4.4 LU' },
        { label: 'True peak', value: '−7.3 dBFS' },
        { label: 'Noise (gap inner 847.122–848.922 s)', value: '−66.9 dB' },
        { label: 'Gap max', value: '−56.2 dB' },
        { label: 'Crest factor', value: '22.4 dB' },
        { label: 'Silence share', value: '23.8%' },
        { label: 'Duration', value: '41:59.08' },
      ],
      notes: [
        'No dedicated 10 s head. Speech energy from ~1.15 s; early quiet 0–0.85 s is a short room pad, not a 10 s bed.',
        'Energy hop confirms first phoneme at 1.15 s (−64.3 → −36.7, then −21.3 at 1.25 s). Used speech_start 1.13.',
        'Profile region: longest gap 846.622–849.717 s (3.096 s). Edge leak at both ends. Used clean inner 847.122–848.922 (mean −66.9 / max −56.2).',
        'RMS below ACX window (too quiet). Peak and inner-gap noise already pass. Expected loudnorm gain ~+9.7 dB.',
        'Last word decay done by 2517.60 s. Source already had ~1.48 s of tail room; ffmpeg rebuilt 2.0 s from the gap.',
        'Source: Remaster/09_Chapter 7_Updated.wav (open in Audacity as 09_Chapter 7_Updated). Prior 2026-08-14 master kept as *.bak.',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, gap noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR from a mid-file gap, HPF, and 2:1 compression. Scenario: night-hike owl listening circle.',
      notes: [
        'Scenario: a 42-minute night-hike listening circle where everyone must identify owls without whispering louder than the moths. She already knows every call. She just stood one trail switchback farther from the lav mic.',
        '01 LUFS HOLD — How loud the whole recording feels. The moths do not want a louder trail. Same hush from first switchback to last. Integrated −28.9 LUFS; quieter family, raise in mastering. Signal: −28.9 LUFS.',
        '02 LRA HOLD — How dramatic the narration is. Nobody needs a drumroll next to a roost. LRA 4.4 LU; already controlled. Lightest compression only. Signal: 4.4 LU.',
        '03 RMS POLISH — Legacy ACX average. The trail packet still uses the old meter. −29.7 dBFS fails −23 to −18 as too quiet. Expected loudnorm gain about +9.7 dB. Signal: −29.7 dBFS.',
        '04 Peak HOLD — Loudest instant. Nobody snapped a branch into the mic. True peak −7.3 dBFS; healthy headroom. Limiter is a safety net only. Signal: −7.3 dBFS.',
        '05 Crest HOLD — Peak minus average. The pauses still have night air in them. 22.4 dB crest; life left in the performance. Do not squash. Signal: 22.4 dB.',
        '06 Noise HOLD — What remains when narration stops. The day-hikers were already gone. No 10 s head; clean inner gap mean −66.9 dB already beats −60. Short 1.80 s inner slice of a 3.10 s gap, so NR stays conservative, then a second 6 dB pass so the +9.7 dB loudnorm boost does not lift the bed. Signal: −66.9 dB mean / −56.2 dB max (847.122–848.922 s).',
        '07 Silence HOLD — Pause share 23.8%; natural audiobook pacing. The gaps are listening, not empty trails. Signal: 23.8%.',
        '08 Spectral GUIDE — Warm voice, quieter air. S-band checks at 20 s and 1200 s; skip de-ess unless the listen gate says otherwise. Signal: S-band at 20 s / 1200 s.',
        '09 HPF GUIDE — 80 Hz / 12 dB removes the rumble under the boardwalk without thinning the voice. Signal: 80 Hz, 12 dB/oct.',
        '10 Compression GUIDE — 2:1 peak compressor, normalize off. Finishing touch for an LRA already at 4.4. Signal: 2:1, threshold −18 dB, attack 10 ms, release 500 ms.',
        '11 Limiter GUIDE — Ceiling at −3.5 dBFS after loudnorm. Surgical spikes only; peaks start at −7.3. Signal: alimiter −3.5 dBFS.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Fallback-gap noise profile (847.122–848.922 s), 10 dB NR, click removal, 80 Hz HPF, light 2:1 compression, then a second 6 dB NR so loudnorm would not lift the delivered bed. No Audacity trim or room paste.',
      startedAt: '2026-08-27T14:44:30',
      completedAt: '2026-08-27T14:46:30',
      notes: [
        'De-ess skipped: 6–9 kHz windows at 20 s (−41.9 / −21.4) and 1200 s (−42.6 / −21.1); listen gate found no harsh sibilance.',
        'After first NR: cleaned gap −75.5 / −63.5. Expected loudnorm gain +9.7 would put max near −53.8; second 6 dB NR required.',
        'After second NR + click/HPF/compress: gap −83.3 / −70.3. First phoneme still intact at 1.15 s (−71.8 → −36.7).',
        'Exported AIFF then converted to RIFF WAV. Duration matched source (2519.08 s).',
        'Listen gate PASS: cleaned gap 847.12–848.92 s was room only (no breath, chair, mouth, click).',
        'Listen gate PASS: first phoneme intact at 1.15 s; 0.85 s silence_end is not speech.',
        'Listen gate PASS: S-heavy lines at 20 s and 1200 s; no de-ess applied.',
        'Listen gate PASS: mid passage at 1200 s (−28.9 / −14.8); no over-NR warble.',
        'Listen gate PASS: last word intact; decay done by 2517.60 s.',
      ],
      artifacts: [
        {
          label: 'Restored AIFF (full, untrimmed)',
          path: 'masters/restoration/09_Chapter_7_restored.aiff',
        },
        {
          label: 'Restored WAV (room-toned keeper)',
          path: 'masters/restoration/09_Chapter_7_restored.wav',
        },
        {
          label: 'NR1 keeper AIFF',
          path: 'masters/restoration/09_Chapter_7_restored_nr1.aiff',
        },
        {
          label: 'NR2 keeper AIFF',
          path: 'masters/restoration/09_Chapter_7_restored_nr2.aiff',
        },
        {
          label: 'Restored WAV (full, scratch)',
          path: '.cache/audiobook-takes/09_Chapter_7_restored_full.wav',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'conform_and_master.py fallback-gap mode: room from inner gap 847.302 t=1.2 s, 0.75 s head / 2.0 s tail, two-pass loudnorm I=−20 / TP=−3.5 / LRA=4, alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-27T14:46:30',
      completedAt: '2026-08-27T14:48:00',
      metrics: [
        { label: 'speech_start', value: '1.13 s' },
        { label: 'body_end', value: '2517.60 s' },
        { label: 'room window', value: 'gap 847.302 t=1.2 s, −83.3 / −71.2 dB' },
        { label: 'loudnorm input_i', value: '−29.32' },
        { label: 'loudnorm input_tp', value: '−6.79' },
        { label: 'loudnorm input_lra', value: '4.50' },
        { label: 'loudnorm offset', value: '−0.03' },
        { label: 'loudnorm target I', value: '−20' },
      ],
      notes: [
        'Script: audiobook-mastering/scripts/conform_and_master.py. Fallback-gap mode. Room from inner 1.2 s of the clean 1.80 s gap window, not the short 0.85 s file head.',
        'Delivered room gate (WAV): head/tail mean −83.3 / −83.3, max −71.2 / −71.2. 0.75–1.5 s speech mean −26.8.',
      ],
      artifacts: [
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/09_Chapter_7_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: 'masters/09_Chapter_7_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: 'masters/09_Chapter_7_master_qc.json',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. Delivered head 0.75 s and tail 2.00 s. ACX green on all three checks.',
      startedAt: '2026-08-27T14:48:00',
      completedAt: '2026-08-27T14:48:30',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−29.7 → −21.0 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−7.3 → −3.7 dBFS true peak' },
        { label: 'Pre Noise → Post Noise (head)', value: '−66.9 → −76.5 dB' },
        { label: 'Head max', value: '−63.9 dB' },
        { label: 'Tail 2.0 s', value: '−76.0 / −63.9 dB' },
        { label: '0.75–1.5 s speech', value: '−17.7 dB mean' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.6 LU' },
        { label: 'Head', value: '0.75 s' },
        { label: 'Tail', value: '2.00 s' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 41:59.22' },
        { label: 'ACX', value: 'PASS' },
      ],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary:
        'Phase record written to audioMasterPhaseRuns.ts. Track marked Ready for Final QC. Final QC skill was not run.',
      completedAt: '2026-08-27T14:49:00',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: 'masters/09_Chapter_7_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'Remaster from Remaster/09_Chapter 7_Updated.wav. Quiet-capture pattern continues (RMS −29.7). Peaks healthy (−7.3). Loudnorm handles it.',
        'No dedicated 10 s head. Room from a 1.80 s inner slice of a 3.10 s mid-file gap. Do not reuse that profile on later chapters.',
        'Prior 2026-08-14 master kept as masters/09_Chapter_7_acx_master_2026-08-14.mp3.bak.',
      ],
    },
  ],
};

/** Chapter 8 remaster — Updated WAV, ffmpeg NR bypass (60-min Audacity crash), 2026-08-27. */
const CHAPTER_8_RUN: MasterTrackRun = {
  chapterId: 8,
  chapterTitle: 'Science, Spirituality and Consciousness',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-27',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Updated mono 44.1 kHz WAV, 60:05. Still no dedicated 10 s head. Quiet even capture; peaks healthy; longest clean mid-file gap already passes ACX noise on the inner slice.',
      startedAt: '2026-08-27T15:25:00',
      completedAt: '2026-08-27T15:26:30',
      metrics: [
        { label: 'RMS', value: '−29.4 dBFS' },
        { label: 'LUFS / LRA', value: '−28.7 / 4.5 LU' },
        { label: 'True peak', value: '−6.4 dBFS' },
        { label: 'Noise (gap inner 6.828–9.728 s)', value: '−71.8 dB' },
        { label: 'Gap max', value: '−61.1 dB' },
        { label: 'Crest factor', value: '23.0 dB' },
        { label: 'Silence share', value: '20.9%' },
        { label: 'Duration', value: '60:05.32' },
      ],
      notes: [
        'No dedicated 10 s head. First ~0.90 s is room, then the first phoneme.',
        'Energy hop confirms first phoneme at 0.90 s (−72.7 → −56.6 / max −32.1). Used speech_start 0.93 after restoration.',
        'Profile region: longest gap 6.228–10.184 s (3.956 s). Speech leak at both edges (full-gap max −48.2). Used clean inner 6.828–9.728 (mean −71.8 / max −61.1).',
        'RMS below ACX window (too quiet). Peak and inner-gap noise already pass. Expected loudnorm gain ~+9.4 dB.',
        'Last word decay done by 3603.60 s (about 1.25 s later than the 2026-08-14 take). Source already had ~1.77 s of tail room; ffmpeg rebuilt 2.0 s from the gap.',
        'Source: Remaster/10_Chapter 8_Updated.wav (open in Audacity as 10_Chapter 8_Updated). Prior 2026-08-14 master kept as *.bak.',
        '60 minutes / 318 MB. Audacity full-file NR still unsafe on this length; used the proven ffmpeg afftdn bypass.',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, gap noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR from a mid-file gap, HPF, and 2:1 compression. Scenario: planetarium overnight lock-in.',
      notes: [
        'Scenario: a 60-minute planetarium overnight lock-in where the laser-show operator has to narrate the cosmos at library-whisper volume so the smoke detector stays asleep. She rewrote a few lines. The hush meter still wants the same quiet.',
        '01 LUFS HOLD — How loud the whole recording feels. The smoke detector does not want a louder dome. Same hush from first starfield to last. Integrated −28.7 LUFS; quieter family, raise in mastering. Signal: −28.7 LUFS.',
        '02 LRA HOLD — How dramatic the narration is. Nobody needs a supernova cue. LRA 4.5 LU; already controlled. Lightest compression only. Signal: 4.5 LU.',
        '03 RMS POLISH — Legacy ACX average. The lock-in checklist still uses the old meter. −29.4 dBFS fails −23 to −18 as too quiet. Expected loudnorm gain about +9.4 dB. Signal: −29.4 dBFS.',
        '04 Peak HOLD — Loudest instant. Nobody dropped a constellation pointer. True peak −6.4 dBFS; healthy headroom. Limiter is a safety net only. Signal: −6.4 dBFS.',
        '05 Crest HOLD — Peak minus average. The pauses still have dark-sky air in them. 23.0 dB crest; life left in the performance. Do not squash. Signal: 23.0 dB.',
        '06 Noise HOLD — What remains when narration stops. The projectors were already off. No 10 s head; clean inner gap mean −71.8 dB already beats −60. Short 2.90 s inner slice of a 3.96 s gap. Light 6 dB NR, then a second 6 dB pass so the +9.4 dB loudnorm boost does not lift the bed. Signal: −71.8 dB mean / −61.1 dB max (6.828–9.728 s).',
        '07 Silence HOLD — Pause share 20.9%; natural audiobook pacing. The gaps are thinking, not empty dome. Signal: 20.9%.',
        '08 Spectral GUIDE — Warm voice, quieter air: low −32.7 / mid −32.5 / high −45.8. No bright harshness; skip de-ess unless the listen gate says otherwise. Signal: low −32.7 / mid −32.5 / high −45.8.',
        '09 HPF GUIDE — 80 Hz / 12 dB removes the rumble under the seats without thinning the voice. Signal: 80 Hz, 12 dB/oct.',
        '10 Compression GUIDE — 2:1 peak compressor, normalize off. Finishing touch for an LRA already at 4.5. Signal: 2:1, threshold −18 dB, attack 10 ms, release 500 ms.',
        '11 Limiter GUIDE — Ceiling at −3.5 dBFS after loudnorm. Surgical spikes only; peaks start at −6.4. Signal: alimiter −3.5 dBFS.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Updated take still 60 minutes; Audacity NR bypassed. ffmpeg afftdn 6 dB + 6 dB from the same mid-file gap profile, 80 Hz HPF, light 2:1 compression. No Audacity trim or room paste.',
      startedAt: '2026-08-27T15:26:30',
      completedAt: '2026-08-27T15:28:00',
      notes: [
        'Source was open in Audacity as 10_Chapter 8_Updated; noise profile captured on gap 6.828–9.728 s. Full-file NR ran in ffmpeg (afftdn + asendcmd sample_noise) to avoid the known 60-minute Audacity crash.',
        'NR1 6 dB: cleaned gap −77.3 / −66.2. Speech 20–23 s unchanged (−29.4 / −14.8). Expected loudnorm gain +9.4 would put max near −56.8; second 6 dB NR required.',
        'NR2 6 dB then HPF 80 Hz / 2-pole and acompressor 2:1 peak, makeup 1, normalize off. After chain: gap −85.5 / −72.2. First clear phoneme at 0.93 s (max −32.2).',
        'ffmpeg adeclick skipped (prior run flagged ~4% of samples; would chew consonants).',
        'De-ess skipped: 6–9 kHz windows at 20 s (−48.8 / −26.1) and 1200 s (−47.0 / −23.9); listen gate found no harsh sibilance.',
        'Exported restored AIFF + RIFF WAV. Duration matched source (3605.32 s). RIFF / mono / 44.1 kHz.',
        'Listen gate PASS: cleaned gap 6.828–9.728 s was room only (mean −85.5 / max −72.2). Clip: .cache/audiobook-takes/ch8_listen_gate/01_cleaned_gap.wav',
        'Listen gate PASS: first phoneme intact at 0.93 s. Clip: ch8_listen_gate/02_first_sentence.wav',
        'Listen gate PASS: S-heavy lines at 20 s and 1200 s; no de-ess. Clip: ch8_listen_gate/03_s_lines_20s.wav',
        'Listen gate PASS: mid passage at 1200 s (−28.5 / −15.1); no over-NR warble. Clip: ch8_listen_gate/04_mid_passage.wav',
        'Listen gate PASS: last word intact; decay done by 3603.60 s. Clip: ch8_listen_gate/05_last_word.wav',
      ],
      artifacts: [
        {
          label: 'Restored AIFF (full, untrimmed)',
          path: 'masters/restoration/10_Chapter_8_restored.aiff',
        },
        {
          label: 'Restored WAV (full, untrimmed)',
          path: '.cache/audiobook-takes/10_Chapter_8_restored_full.wav',
        },
        {
          label: 'NR1 WAV (6 dB afftdn)',
          path: 'masters/restoration/ch8_ffmpeg/nr1.wav',
        },
        {
          label: 'NR2 WAV (second 6 dB)',
          path: 'masters/restoration/ch8_ffmpeg/nr2.wav',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'conform_and_master.py fallback-gap mode: room from inner gap 7.118–9.418 s, 0.75 s head / 2.0 s tail, two-pass loudnorm I=−20 / TP=−3.5 / LRA=4 (linear), alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-27T15:28:00',
      completedAt: '2026-08-27T15:30:00',
      metrics: [
        { label: 'speech_start', value: '0.93 s' },
        { label: 'body_end', value: '3603.60 s' },
        { label: 'room window', value: 'gap 7.118 t=2.300 s, −85.5 / −72.2 dB' },
        { label: 'loudnorm input_i', value: '−29.07' },
        { label: 'loudnorm input_tp', value: '−9.06' },
        { label: 'loudnorm input_lra', value: '4.20' },
        { label: 'loudnorm offset', value: '−0.03' },
        { label: 'loudnorm target I', value: '−20' },
      ],
      notes: [
        'Script: scripts/conform_and_master.py. Fallback-gap mode. Room from inner 2.300 s of the 2.900 s gap, not the short 0.90 s file head.',
        'Delivered room gate (WAV): head/tail mean −85.5 / −85.5, max −74.7 / −72.2. 0.75–1.5 s speech mean −29.7.',
      ],
      artifacts: [
        {
          label: 'Room-toned WAV',
          path: 'masters/restoration/10_Chapter_8_restored.wav',
        },
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/10_Chapter_8_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: 'masters/10_Chapter_8_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: 'masters/10_Chapter_8_master_qc.json',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. Delivered head ~0.80 s and tail 2.00 s. ACX green on all three checks.',
      startedAt: '2026-08-27T15:30:00',
      completedAt: '2026-08-27T15:30:30',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−29.4 → −20.9 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−6.4 → −3.7 dBFS true peak' },
        { label: 'Pre Noise → Post Noise (head)', value: '−71.8 → −73.9 dB' },
        { label: 'Head max', value: '−58.7 dB' },
        { label: 'Tail 2.0 s', value: '−75.7 / −62.0 dB' },
        { label: '0.75–1.5 s speech', value: '−17.4 dB mean' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.6 LU' },
        { label: 'Head', value: '0.80 s' },
        { label: 'Tail', value: '2.00 s' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 60:05.42' },
        { label: 'ACX', value: 'PASS' },
      ],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary:
        'Phase record written to audioMasterPhaseRuns.ts. Track marked Ready for Final QC. Final QC skill was not run.',
      completedAt: '2026-08-27T15:31:00',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: 'masters/10_Chapter_8_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'Remaster from Remaster/10_Chapter 8_Updated.wav. Quiet-capture pattern continues (RMS −29.4). Peaks healthy (−6.4). Loudnorm handles it.',
        'Prior 2026-08-14 master kept as masters/10_Chapter_8_acx_master_2026-08-14.mp3.bak.',
        'No dedicated 10 s head. Room from a 2.30 s inner slice of a 2.90 s mid-file gap. Do not reuse that profile on later chapters.',
        'Audacity remains unsafe for 60-minute NR on this machine. Remaster used ffmpeg afftdn with the same gap profile and dB targets.',
      ],
    },
  ],
};

/** Chapter 9 remaster — Updated WAV, no dedicated head, fallback gap, 2026-08-27. */
const CHAPTER_9_RUN: MasterTrackRun = {
  chapterId: 9,
  chapterTitle: 'Living in Freedom',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-27',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Updated mono 44.1 kHz WAV with no dedicated 10 s head. Speech starts at ~1.15 s. Quiet even capture; peaks healthy; early mid-file gap already passes ACX noise on the inner slice.',
      startedAt: '2026-08-27T15:44:00',
      completedAt: '2026-08-27T15:45:30',
      metrics: [
        { label: 'RMS', value: '−29.9 dBFS' },
        { label: 'LUFS / LRA', value: '−29.2 / 4.2 LU' },
        { label: 'True peak', value: '−7.5 dBFS' },
        { label: 'Noise (gap inner 3.85–5.65 s)', value: '−72.7 dB' },
        { label: 'Gap max', value: '−60.8 dB' },
        { label: 'Crest factor', value: '22.4 dB' },
        { label: 'Silence share', value: '23.0%' },
        { label: 'Duration', value: '48:36.44' },
      ],
      notes: [
        'No dedicated 10 s head. First ~1.00 s is room, then a quiet attack, then the first phoneme.',
        'Energy hop confirms first phoneme at 1.15 s (−67.0 → −37.5 / max −24.4, then −29.2 at 1.20 s). The 1.00 s silence_end was a −40.8 dB blip, not the word. Used speech_start 1.12.',
        'Profile region: early gap 3.685–5.776 s (2.090 s). Speech leak at both edges. Used clean inner 3.85–5.65 (mean −72.7 / max −60.8). Longer 3.32 s gap at 799.26 still has a −51.2 click; discarded for profile.',
        'RMS below ACX window (too quiet). Peak and inner-gap noise already pass. Expected loudnorm gain ~+9.9 dB.',
        'Last word decay done by 2915.06 s. ffmpeg rebuilt 2.0 s tail from the gap.',
        'Source: Remaster/11_Chapter 9_Updated.wav (open in Audacity as 11_Chapter 9_Updated). Prior 2026-08-14 master kept as *.bak.',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, gap noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR from a mid-file gap, HPF, and 2:1 compression. Scenario: HOA silence-variance hearing.',
      notes: [
        'Scenario: a 48-minute HOA hearing on whether silence itself needs a variance permit, chaired by a fern that already whispers at library volume. The board loves the delivery. They still have a clipboard labeled RMS.',
        '01 LUFS HOLD — How loud the whole recording feels. The fern does not want a louder meeting. Same hush from the gavel to adjournment. Integrated −29.2 LUFS; quiet family with Chapters 5–8. Raise in mastering. Signal: −29.2 LUFS.',
        '02 LRA HOLD — How dramatic the narration is. Nobody slammed a binder. LRA 4.2 LU; already controlled. Lightest compression only. Signal: 4.2 LU.',
        '03 RMS POLISH — Legacy ACX average. The clipboard still uses the old scale. −29.9 dBFS fails −23 to −18 as too quiet. Expected loudnorm gain about +9.9 dB. Signal: −29.9 dBFS.',
        '04 Peak HOLD — Loudest instant. Nobody hit the mic stand. True peak −7.5 dBFS; healthy headroom. Limiter is a safety net only. Signal: −7.5 dBFS.',
        '05 Crest HOLD — Peak minus average. The pauses still have air in them. 22.4 dB crest; life left in the performance. Do not squash. Signal: 22.4 dB.',
        '06 Noise HOLD — What remains when narration stops. The fern already learned indoor voice. No 10 s head; clean inner gap mean −72.7 dB already beats −60. Light 6 dB NR only; after NR1 cleaned max −68.7 leaves ~3.8 dB margin under −55 after the +9.9 boost, so no second NR pass. Signal: −72.7 dB mean / −60.8 dB max (3.85–5.65 s).',
        '07 Silence HOLD — Pause share 23.0%; natural audiobook pacing. The gaps are thinking, not empty hallway. Signal: 23.0%.',
        '08 Spectral GUIDE — Warm voice, quieter air: low −32.7 / mid −33.5 / high −42.9. No bright harshness; skip de-ess unless the listen gate says otherwise. Signal: low −32.7 / mid −33.5 / high −42.9.',
        '09 HPF GUIDE — 80 Hz / 12 dB removes the rumble under the floorboards without thinning the voice. Signal: 80 Hz, 12 dB/oct.',
        '10 Compression GUIDE — 2:1 peak compressor, normalize off. Finishing touch for an LRA already at 4.2. Signal: 2:1, threshold −18 dB, attack 10 ms, release 500 ms.',
        '11 Limiter GUIDE — Ceiling at −3.5 dBFS after loudnorm. Surgical spikes only; peaks start at −7.5. Signal: alimiter −3.5 dBFS.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Audacity restoration on the Updated 48-minute take: gap profile 3.85–5.65 s, 6 dB NR, click removal, 80 Hz HPF, 2:1 compression. Full restored AIFF exported with original length. No Audacity trim or room paste.',
      startedAt: '2026-08-27T15:45:30',
      completedAt: '2026-08-27T15:47:30',
      notes: [
        'Audacity project already open as 11_Chapter 9_Updated; mono, 2916.44 s. Profile from clean inner gap 3.85–5.65 s (not the 1.00 s file head, not the leaky 799 s gap).',
        'NR1 6 dB: cleaned gap −81.3 / −68.7. Speech 1.20–4.00 s (−33.6 / −16.6). Expected loudnorm gain +9.9 puts max at −58.8 (3.8 dB under −55). Skipped second NR.',
        'Click removal (threshold 200, spike_width 20), HPF 80 Hz / 12 dB, compressor 2:1 peak, normalize off. After chain: gap −82.5 / −69.5. First clear phoneme at 1.15 s.',
        'De-ess skipped: 6–9 kHz windows at 20 s (−54.8 / −29.7), 1200 s (−47.7 / −22.2), and 1800 s (−50.6 / −24.6); listen gate found no harsh sibilance.',
        'Exported restored AIFF then converted. Duration matched source (2916.44 s). RIFF / mono / 44.1 kHz.',
        'Listen gate PASS: cleaned gap 3.85–5.65 s was room only (mean −82.5 / max −69.5; no breath, chair, mouth, click). Clip: ch9_ffmpeg/listen_gate/01_cleaned_gap.wav',
        'Listen gate PASS: first phoneme intact at 1.15 s after NR; source onset at 1.00 s was a −40.8 dB blip, not the word. 1.12 s speech_start does not eat the word. Clip: ch9_ffmpeg/listen_gate/02_first_sentence.wav',
        'Listen gate PASS: S-heavy lines at 20 s; no de-ess applied. Clip: ch9_ffmpeg/listen_gate/03_s_lines_20s.wav',
        'Listen gate PASS: mid passage at 1200 s (−35.1 / −17.6); no over-NR warble. Clip: ch9_ffmpeg/listen_gate/04_mid_passage.wav',
        'Listen gate PASS: last word intact; decay done by 2915.06 s. Clip: ch9_ffmpeg/listen_gate/05_last_word.wav',
      ],
      artifacts: [
        {
          label: 'Restored AIFF (full, untrimmed)',
          path: 'masters/restoration/11_Chapter_9_restored.aiff',
        },
        {
          label: 'Restored WAV (full, untrimmed)',
          path: '.cache/audiobook-takes/11_Chapter_9_restored_full.wav',
        },
        {
          label: 'NR1 AIFF (6 dB)',
          path: 'masters/restoration/11_Chapter_9_nr1.aiff',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'conform_and_master.py fallback-gap mode: room from inner gap 4.03–5.23 s, 0.75 s head / 2.0 s tail, loudnorm I=−20 / TP=−3.5 / LRA=4, alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-27T15:47:30',
      completedAt: '2026-08-27T15:49:00',
      metrics: [
        { label: 'speech_start', value: '1.12 s' },
        { label: 'body_end', value: '2915.06 s' },
        { label: 'room window', value: 'gap 4.03 t=1.200 s, −82.5 / −69.5 dB' },
        { label: 'loudnorm input_i', value: '−34.00' },
        { label: 'loudnorm input_tp', value: '−10.04' },
        { label: 'loudnorm input_lra', value: '4.70' },
        { label: 'loudnorm offset', value: '−0.14' },
        { label: 'loudnorm target I', value: '−20' },
      ],
      notes: [
        'Script: scripts/conform_and_master.py. Fallback-gap mode. Room from inner 1.200 s of the 1.80 s gap, not the short 1.00 s file head.',
        'Delivered room gate (WAV): head/tail mean −82.5 / −82.5, max −69.5 / −69.5. 0.75–1.5 s speech mean −32.9.',
      ],
      artifacts: [
        {
          label: 'Room-toned WAV',
          path: 'masters/restoration/11_Chapter_9_restored.wav',
        },
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/11_Chapter_9_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: 'masters/11_Chapter_9_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: 'masters/11_Chapter_9_master_qc.json',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. Delivered head 0.75 s and tail 2.00 s. ACX green on all three checks.',
      startedAt: '2026-08-27T15:49:00',
      completedAt: '2026-08-27T15:49:30',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−29.9 → −21.3 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−7.5 → −3.5 dBFS true peak' },
        { label: 'Pre Noise → Post Noise (head)', value: '−72.7 → −69.1 dB' },
        { label: 'Head max', value: '−56.7 dB' },
        { label: 'Tail 2.0 s', value: '−67.7 / −55.3 dB' },
        { label: '0.75–1.5 s speech', value: '−18.5 dB mean' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.7 LU' },
        { label: 'Head', value: '0.75 s' },
        { label: 'Tail', value: '2.00 s' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 48:36.69' },
        { label: 'ACX', value: 'PASS' },
      ],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary:
        'Phase record written to audioMasterPhaseRuns.ts. Track marked Ready for Final QC. Final QC skill was not run.',
      completedAt: '2026-08-27T15:50:00',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: 'masters/11_Chapter_9_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'Remaster from Remaster/11_Chapter 9_Updated.wav. Quiet-capture pattern continues (RMS −29.9). Peaks healthy (−7.5). Loudnorm handles it.',
        'No dedicated 10 s head. Room from a 1.20 s inner slice of a 1.80 s early mid-file gap. Do not reuse that profile on later chapters.',
        'Prior 2026-08-14 master kept as masters/11_Chapter_9_acx_master_2026-08-14.mp3.bak.',
      ],
    },
  ],
};

/** Introduction full-chapter master on disk. Retail sample is a separate file. */
const INTRODUCTION_RUN: MasterTrackRun = {
  chapterId: 0,
  chapterTitle: 'Introduction',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-20',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Older take: no dedicated 10 s head. Speech starts at 1.45 s. Quiet even capture; peaks healthy. Source is 14:34.50.',
      metrics: [
        { label: 'RMS', value: '−30.7 dBFS' },
        { label: 'LUFS / LRA', value: '−29.9 / 4.6 LU' },
        { label: 'True peak', value: '−9.4 dBFS' },
        { label: 'Noise (gap 271.50–272.70)', value: '−71.4 dB mean / −61.1 max' },
        { label: 'Source duration', value: '14:34.50' },
      ],
      notes: [
        'No dedicated 10 s head. First phoneme at 1.45 s.',
        'Source: need-to-master/02_Introduction.wav.',
        'Removed the 5-minute retail-sample dossier from this row. That file still exists as 02_Introduction_retail_acx_master.mp3.',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, gap noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR from the mid-file gap, HPF, and 2:1 compression.',
      notes: [
        'Scenario: a county-fair quietest pie-judging contest where the only audible crime is a fork that clinks.',
        '01 LUFS HOLD — How loud the whole recording feels. Integrated −29.9 LUFS; quiet capture. Raise in mastering, do not re-perform.',
        '03 RMS POLISH — −30.7 dBFS is too quiet for ACX. Loudnorm to ~−20 fixes it without changing the read.',
        '04 Peak HOLD — True peak −9.4 dBFS; limiter is a safety net only.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Restored AIFF and WAV for the full introduction live in the restoration folder. Head/tail conform left to ffmpeg.',
      artifacts: [
        {
          label: 'Restored AIFF',
          path: 'masters/restoration/02_Introduction_restored.aiff',
        },
        {
          label: 'Restored WAV',
          path: 'masters/restoration/02_Introduction_restored.wav',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'Full-chapter ACX master on disk. MP3 192k CBR mono 44.1 kHz, 14:33.79. Local file dated 2026-08-18.',
      artifacts: [
        {
          label: 'ACX master',
          path: 'masters/02_Introduction_acx_master.mp3',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Full introduction master passes RMS, true peak, head noise, first-word window, and tail room. ACX green.',
      metrics: [
        { label: 'RMS', value: '−21.0 dBFS' },
        { label: 'True peak', value: '−3.7 dBFS' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.9 LU' },
        { label: 'Head 0–0.75 s', value: '−69.5 / max −57.8 dB' },
        { label: '0.75–1.5 s', value: 'speech, mean −17.5' },
        { label: 'Last 2.0 s', value: 'room, −68.8 / −57.1' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 14:33.79' },
        { label: 'ACX', value: 'PASS' },
      ],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary:
        'Phase record rewritten to the full introduction master. Track marked Ready for Final QC. Final QC skill was not run.',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: 'masters/02_Introduction_acx_master.mp3',
        },
      ],
      notes: [
        'A 4:59 retail sample also exists at masters/02_Introduction_retail_acx_master.mp3. It is not this track.',
      ],
    },
  ],
};

/** Acknowledgments master on disk. Re-measured 2026-08-20. */
const ACKNOWLEDGMENTS_RUN: MasterTrackRun = {
  chapterId: 12,
  chapterTitle: 'Acknowledgments',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-20',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Older take: no dedicated 10 s head. Source WAV sits at the takeout root, not in Need-to-master. Current master is 7:10.73.',
      notes: [
        'Source: /Volumes/Fulcrum/gdrive-takeout/Formless-audible-tracks/12_Acknowledgments.wav',
        'This row was idle on the studio ladder page even though the master was on disk.',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the closing thanks. Polish is already on the master. Guide a later head-clean if Final QC flags the bed.',
      notes: [
        'RMS and true peak already sit in the ACX window. Head max is the leftover issue.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Earlier restoration pass. Keepers were not copied into formless-web/masters/restoration for this track.',
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'ACX master on disk. MP3 192k CBR mono 44.1 kHz, 7:10.73. Local file dated 2026-08-18.',
      artifacts: [
        {
          label: 'ACX master',
          path: 'masters/12_Acknowledgments_acx_master.mp3',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'RMS and true peak pass. Head mean passes ACX −60. Head max and tail max are still hot, and 0.75–1.5 s is quiet rather than full speech.',
      metrics: [
        { label: 'RMS', value: '−20.9 dBFS' },
        { label: 'True peak', value: '−3.7 dBFS' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.8 LU' },
        { label: 'Head 0–0.75 s', value: '−63.0 / max −50.1 dB' },
        { label: '0.75–1.5 s', value: 'quiet, mean −55.3' },
        { label: 'Last 2.0 s', value: '−64.8 / max −52.1' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 7:10.73' },
        { label: 'ACX', value: 'RMS and peak PASS; head max FAIL' },
      ],
      notes: [
        'Head max −50.1 dB is a click or speech edge in the bed. Target max is −55.',
        'This is still the local master. Do not leave the track as Not started.',
      ],
    },
    {
      id: 6,
      name: 'Record',
      short: 'Deliver',
      status: 'complete',
      summary:
        'Phase record written from the current local master. Track marked Ready for Final QC. Final QC skill was not run.',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: 'masters/12_Acknowledgments_acx_master.mp3',
        },
      ],
    },
  ],
};

const RUNS_BY_CHAPTER = new Map<number, MasterTrackRun>([
  [OPENING_CREDITS_RUN.chapterId, OPENING_CREDITS_RUN],
  [INTRODUCTION_RUN.chapterId, INTRODUCTION_RUN],
  [CHAPTER_1_RUN.chapterId, CHAPTER_1_RUN],
  [CHAPTER_2_RUN.chapterId, CHAPTER_2_RUN],
  [CHAPTER_3_RUN.chapterId, CHAPTER_3_RUN],
  [CHAPTER_4_RUN.chapterId, CHAPTER_4_RUN],
  [CHAPTER_5_RUN.chapterId, CHAPTER_5_RUN],
  [CHAPTER_6_RUN.chapterId, CHAPTER_6_RUN],
  [CHAPTER_7_RUN.chapterId, CHAPTER_7_RUN],
  [CHAPTER_8_RUN.chapterId, CHAPTER_8_RUN],
  [CHAPTER_9_RUN.chapterId, CHAPTER_9_RUN],
  [ACKNOWLEDGMENTS_RUN.chapterId, ACKNOWLEDGMENTS_RUN],
]);

export function masterTrackRunFor(chapterId: number): MasterTrackRun {
  return RUNS_BY_CHAPTER.get(chapterId) ?? emptyTrackRun(chapterId);
}

export function phaseRecordFor(
  run: MasterTrackRun,
  id: MasterPhaseId,
): MasterPhaseRecord {
  return (
    run.phases.find((phase) => phase.id === id) ??
    emptyPhaseRecord(MASTER_PHASE_CATALOG[id - 1]!)
  );
}

export function acxMasterPathFromRun(run: MasterTrackRun): string | null {
  for (const phase of run.phases) {
    const match = phase.artifacts?.find((artifact) =>
      /acx master/i.test(artifact.label),
    );
    if (match) return match.path;
  }
  return null;
}

export const MASTER_TRACK_RUNS: MasterTrackRun[] = AUDIO_LISTEN_ORDER.map(masterTrackRunFor);

export function masterBookProgress(runs: readonly MasterTrackRun[] = MASTER_TRACK_RUNS) {
  const counts = {
    idle: 0,
    'in-progress': 0,
    'ready-for-final-qc': 0,
  } satisfies Record<MasterTrackRunStatus, number>;

  for (const run of runs) {
    counts[run.status] += 1;
  }

  return {
    total: runs.length,
    counts,
    ready: counts['ready-for-final-qc'],
  };
}

export function findMasterTrackRun(chapterId: number): MasterTrackRun | null {
  if (!isAudioChapterId(chapterId)) return null;
  return masterTrackRunFor(chapterId);
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
