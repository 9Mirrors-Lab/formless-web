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
          path: '.cache/audiobook-takes/03_Chapter_1_restored.wav',
        },
        {
          label: 'Restored AIFF export',
          path: '.cache/audiobook-takes/03_Chapter_1_restored.aiff',
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
          path: '.cache/audiobook-takes/03_Chapter_1_acx_master.mp3',
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
          path: '.cache/audiobook-takes/03_Chapter_1_acx_master.mp3',
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
          path: '.cache/audiobook-takes/04_Chapter_2_restored.aiff',
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
          path: '.cache/audiobook-takes/04_Chapter_2_restored.wav',
        },
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/04_Chapter_2_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: '.cache/audiobook-takes/04_Chapter_2_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: '.cache/audiobook-takes/04_Chapter_2_master_qc.json',
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
          path: '.cache/audiobook-takes/04_Chapter_2_acx_master.mp3',
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
          path: '.cache/audiobook-takes/05_Chapter_3_restored_nr2.aiff',
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
          path: '.cache/audiobook-takes/05_Chapter_3_restored.wav',
        },
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/05_Chapter_3_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: '.cache/audiobook-takes/05_Chapter_3_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: '.cache/audiobook-takes/05_Chapter_3_master_qc.json',
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
          path: '.cache/audiobook-takes/05_Chapter_3_acx_master.mp3',
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

/** Chapter 5 mastering pass — no dedicated head, fallback gap, 2026-08-13. */
const CHAPTER_5_RUN: MasterTrackRun = {
  chapterId: 5,
  chapterTitle: 'Conscious Relationships',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-13',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Mono 44.1 kHz WAV with no dedicated 10 s head. Speech starts at ~1.05 s. Quiet even capture; peaks healthy; longest clean mid-file gap already passes ACX noise.',
      startedAt: '2026-08-13T23:09:00',
      completedAt: '2026-08-13T23:10:00',
      metrics: [
        { label: 'RMS', value: '−31.4 dBFS' },
        { label: 'LUFS / LRA', value: '−30.7 / 4.3 LU' },
        { label: 'True peak', value: '−8.1 dBFS' },
        { label: 'Noise (gap 232.92–235.78 s)', value: '−76.7 dB' },
        { label: 'Gap max', value: '−63.1 dB' },
        { label: 'Crest factor', value: '23.3 dB' },
        { label: 'Silence share', value: '21.8%' },
        { label: 'Duration', value: '52:27.28' },
      ],
      notes: [
        'No dedicated 10 s head. Older take (source dated Aug 4). First 0.85 s is room, then a −47.8 dB blip at 0.85 s is not the first word.',
        'Listen-confirmed first phoneme at 1.10 s (energy hop −52.6 → −38.1). Used speech_start 1.05.',
        'Profile region: longest clean gap 232.917–235.784 s (2.867 s). Inner slice 233.217–235.484. Gap 2 at 1228 s was speech leaking, discarded.',
        'RMS below ACX window (too quiet). Peak and gap noise already pass.',
        'Last word decay done by 3145.28 s. Source already had ~2 s of tail room; ffmpeg rebuilt it from the gap.',
        'Source: need-to-master/07_Chapter 5.wav',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, gap noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR from a short mid-file gap, HPF, and 2:1 compression. Scenario: underwater library night shift.',
      notes: [
        'Scenario: a 52-minute overnight shift at an underwater library, staffed by one librarian reading to fish who already know how to be quiet. The only issue is she stood one extra fin-length back from the hydrophone.',
        '01 LUFS HOLD — How loud the whole recording feels. The fish do not want a louder tank. They want the same hush from the first page to the last. Integrated −30.7 LUFS; quieter than Chapters 1–3, same family. Raise in mastering, do not re-perform. Signal: −30.7 LUFS.',
        '02 LRA HOLD — How dramatic the narration is. Nobody needs a drumroll to shelve a sponge. LRA 4.3 LU; already controlled. Lightest compression only. Signal: 4.3 LU.',
        '03 RMS POLISH — Legacy ACX average. The library still stamps cards with an old meter. −31.4 dBFS fails the −23 to −18 window as too quiet. Expected loudnorm gain about +11.4 dB. Signal: −31.4 dBFS.',
        '04 Peak HOLD — Loudest instant. Nobody bumped the glass. True peak −8.1 dBFS; healthy headroom. Limiter is a safety net only. Signal: −8.1 dBFS.',
        '05 Crest HOLD — Peak minus average. The pauses still have water in them. 23.3 dB crest; life left in the performance. Do not squash. Signal: 23.3 dB.',
        '06 Noise HOLD — What remains when narration stops. The pumps were already off. No 10 s head on this older take; longest clean gap mean −76.7 dB already beats −60. Short 2.87 s gap, so NR stays conservative, then a second 6 dB pass so the +11 dB loudnorm boost does not lift the bed. Signal: −76.7 dB mean / −63.1 dB max (232.92–235.78 s).',
        '07 Silence HOLD — Pause share 21.8%; natural audiobook pacing. The gaps are thinking, not empty tanks. Signal: 21.8%.',
        '08 Spectral GUIDE — Warm voice, quieter air: low −35.6 / mid −34.1 / high −44.3. No bright harshness; skip de-ess unless the listen gate says otherwise. Signal: low −35.6 / mid −34.1 / high −44.3.',
        '09 HPF GUIDE — 80 Hz / 12 dB removes the rumble under the stacks without thinning the voice. Signal: 80 Hz, 12 dB/oct.',
        '10 Compression GUIDE — 2:1 peak compressor, normalize off. Finishing touch for an LRA already at 4.3. Signal: 2:1, threshold −18 dB, attack 10 ms, release 500 ms.',
        '11 Limiter GUIDE — Ceiling at −3.5 dBFS after loudnorm. Surgical spikes only; peaks start at −8.1. Signal: alimiter −3.5 dBFS.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Fallback-gap noise profile (233.22–235.48 s), 10 dB NR, click removal, 80 Hz HPF, light 2:1 compression, then a second 6 dB NR so loudnorm would not lift the delivered bed. No Audacity trim or room paste.',
      startedAt: '2026-08-13T23:15:00',
      completedAt: '2026-08-13T23:19:00',
      notes: [
        'Audacity crashed after the first click-removal pass and again before the second NR. Recovered by re-importing the first restored WAV, then applying only the second 6 dB NR.',
        'De-ess skipped: 6–9 kHz windows at 20 s (−48.4 / −21.7) and 2000 s (−46.5 / −19.5); listen gate found no harsh sibilance.',
        'After first NR: cleaned gap −81.3 / −68.7. Expected loudnorm gain +11.4 would put max near −57, too close to −55. Second 6 dB NR applied from the same cleaned gap.',
        'After second NR: gap −82.5 / −69.5. First phoneme still intact at 1.10 s (−52.6 → −38.1).',
        'Exported AIFF then converted to RIFF WAV. Duration matched source (3147.28 s).',
        'Listen gate PASS: cleaned gap 233.2–235.5 s was room only (no breath, chair, mouth, click).',
        'Listen gate PASS: first phoneme intact at 1.10 s; 0.85 s blip is not speech.',
        'Listen gate PASS: S-heavy lines at 20 s and 2000 s; no de-ess applied.',
        'Listen gate PASS: mid passage at 1100 s (−32.6 / −16.2); no over-NR warble.',
        'Listen gate PASS: last word intact; decay done by 3145.28 s.',
      ],
      artifacts: [
        {
          label: 'Restored WAV (full, untrimmed)',
          path: '.cache/audiobook-takes/07_Chapter_5_restored_full.wav',
        },
        {
          label: 'Restored AIFF export (2nd NR)',
          path: '.cache/audiobook-takes/07_Chapter_5_restored_nr2.aiff',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'conform_and_master.py fallback-gap mode: room from inner gap 233.20–235.47 s, 0.75 s head / 2.0 s tail, two-pass loudnorm I=−20 / TP=−3.5 / LRA=4 (linear), alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-13T23:20:00',
      completedAt: '2026-08-13T23:22:00',
      metrics: [
        { label: 'speech_start', value: '1.05 s' },
        { label: 'body_end', value: '3145.28 s' },
        { label: 'room window', value: 'gap 233.20 t=2.267 s, −82.5 / −69.5 dB' },
        { label: 'loudnorm input_i', value: '−31.03' },
        { label: 'loudnorm input_tp', value: '−7.62' },
        { label: 'loudnorm input_lra', value: '4.40' },
        { label: 'loudnorm offset', value: '−0.01' },
        { label: 'loudnorm target I', value: '−20' },
      ],
      notes: [
        'Script: scripts/conform_and_master.py. Fallback-gap mode. Room from inner 2.267 s of the 2.867 s gap, not the short 0.85 s file head.',
        'Delivered room gate (WAV): head/tail mean −82.5 / −82.5, max −70.3 / −69.5. 0.75–1.5 s speech mean −28.8.',
      ],
      artifacts: [
        {
          label: 'Room-toned WAV',
          path: '.cache/audiobook-takes/07_Chapter_5_restored.wav',
        },
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/07_Chapter_5_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: '.cache/audiobook-takes/07_Chapter_5_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: '.cache/audiobook-takes/07_Chapter_5_master_qc.json',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. Delivered head 0.76 s and tail 2.00 s. ACX green on all three checks.',
      startedAt: '2026-08-13T23:22:00',
      completedAt: '2026-08-13T23:23:00',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−31.4 → −21.0 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−8.1 → −3.6 dBFS true peak' },
        { label: 'Pre Noise → Post Noise (head)', value: '−76.7 → −74.1 dB' },
        { label: 'Head max', value: '−61.7 dB' },
        { label: 'Tail 2.0 s', value: '−73.2 / −60.2 dB' },
        { label: '0.75–1.5 s speech', value: '−18.2 dB mean' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.7 LU' },
        { label: 'Head', value: '0.76 s' },
        { label: 'Tail', value: '2.00 s' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 52:26.98' },
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
      completedAt: '2026-08-13T23:23:30',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: '.cache/audiobook-takes/07_Chapter_5_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'Quiet-capture pattern continues and is quieter than Chapters 1–3 (RMS −31.4 vs ~−28). Peaks are healthy (−8.1). Loudnorm handles it. Mic gain is not hot.',
        'This chapter has no dedicated 10 s head (older Aug 4 take). Room came from a 2.87 s mid-file gap. Do not reuse that profile on later chapters.',
      ],
    },
  ],
};

/** Chapter 6 mastering pass — no dedicated head, fallback gap, 2026-08-13. */
const CHAPTER_6_RUN: MasterTrackRun = {
  chapterId: 6,
  chapterTitle: 'Work, Identity and Purpose',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-13',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Mono 44.1 kHz WAV with no dedicated 10 s head. Speech starts at ~1.00 s. Quiet even capture; peaks healthy; longest clean mid-file gap already passes ACX noise on the inner slice.',
      startedAt: '2026-08-13T23:51:00',
      completedAt: '2026-08-13T23:53:00',
      metrics: [
        { label: 'RMS', value: '−30.3 dBFS' },
        { label: 'LUFS / LRA', value: '−29.6 / 4.1 LU' },
        { label: 'True peak', value: '−5.9 dBFS' },
        { label: 'Noise (gap inner 1812.74–1814.34 s)', value: '−73.6 dB' },
        { label: 'Gap max', value: '−61.7 dB' },
        { label: 'Crest factor', value: '24.4 dB' },
        { label: 'Silence share', value: '19.7%' },
        { label: 'Duration', value: '49:16.50' },
      ],
      notes: [
        'No dedicated 10 s head. Older take (source dated Aug 4). First ~1.00 s is room, then the first phoneme.',
        'Listen-confirmed first phoneme at 1.00 s (energy hop −67.0 → −44.5, then −27.6 at 1.10 s). Used speech_start 0.98.',
        'Profile region: longest gap 1812.341–1815.953 s (3.612 s). Speech leak at both edges and a −54.7 dB blip at 1814.441. Used clean inner 1812.741–1814.341 (mean −73.6 / max −61.7).',
        'RMS below ACX window (too quiet). Peak and inner-gap noise already pass.',
        'Last word decay done by 2955.28 s. Source already had ~1.2 s of tail room; ffmpeg rebuilt 2.0 s from the gap.',
        'Source: need-to-master/08_Chapter 6.wav',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, gap noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR from a short mid-file gap, HPF, and 2:1 compression. Scenario: noise-canceling fern job interview.',
      notes: [
        'Scenario: a 49-minute job interview for Chief of Stillness at a firm that sells noise-canceling ferns to open-plan offices. The candidate already has the job. She just answered from one fern too far back.',
        '01 LUFS HOLD — How loud the whole recording feels. The ferns do not want a louder office. They want the same hush from handshake to goodbye. Integrated −29.6 LUFS; quieter than Chapters 1–3, same family as Chapter 5. Raise in mastering, do not re-perform. Signal: −29.6 LUFS.',
        '02 LRA HOLD — How dramatic the narration is. Nobody needs a drumroll to sit in a fern. LRA 4.1 LU; already controlled. Lightest compression only. Signal: 4.1 LU.',
        '03 RMS POLISH — Legacy ACX average. The HR packet still uses the old meter. −30.3 dBFS fails the −23 to −18 window as too quiet. Expected loudnorm gain about +10.3 dB. Signal: −30.3 dBFS.',
        '04 Peak HOLD — Loudest instant. Nobody knocked a pot off the table. True peak −5.9 dBFS; healthy headroom. Limiter is a safety net only. Signal: −5.9 dBFS.',
        '05 Crest HOLD — Peak minus average. The pauses still have soil in them. 24.4 dB crest; life left in the performance. Do not squash. Signal: 24.4 dB.',
        '06 Noise HOLD — What remains when narration stops. The HVAC was already off. No 10 s head on this older take; clean inner gap mean −73.6 dB already beats −60. Short 1.60 s inner slice of a 3.61 s gap, so NR stays conservative, then a second 6 dB pass so the +10.3 dB loudnorm boost does not lift the bed. Signal: −73.6 dB mean / −61.7 dB max (1812.74–1814.34 s).',
        '07 Silence HOLD — Pause share 19.7%; natural audiobook pacing. The gaps are thinking, not empty planters. Signal: 19.7%.',
        '08 Spectral GUIDE — Warm voice, quieter air: low −35.0 / mid −32.4 / high −44.4. No bright harshness; skip de-ess unless the listen gate says otherwise. Signal: low −35.0 / mid −32.4 / high −44.4.',
        '09 HPF GUIDE — 80 Hz / 12 dB removes the rumble under the planters without thinning the voice. Signal: 80 Hz, 12 dB/oct.',
        '10 Compression GUIDE — 2:1 peak compressor, normalize off. Finishing touch for an LRA already at 4.1. Signal: 2:1, threshold −18 dB, attack 10 ms, release 500 ms.',
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
      startedAt: '2026-08-13T23:53:00',
      completedAt: '2026-08-13T23:56:00',
      notes: [
        'De-ess skipped: 6–9 kHz windows at 20 s (−56.7 / −32.2) and 1100 s (−46.8 / −26.0); listen gate found no harsh sibilance.',
        'After first NR: cleaned gap −79.9 / −65.7. Expected loudnorm gain +10.3 would put max near −55.4, too close to −55. Second 6 dB NR applied from the same cleaned gap.',
        'After second NR: gap −83.3 / −71.2. First phoneme still intact at 1.00 s (−68.8 → −44.6).',
        'Exported AIFF then converted to RIFF WAV. Duration matched source (2956.50 s).',
        'Listen gate PASS: cleaned gap 1812.74–1814.34 s was room only (no breath, chair, mouth, click).',
        'Listen gate PASS: first phoneme intact at 1.00 s; 0.85 s file-head blip is not speech.',
        'Listen gate PASS: S-heavy lines at 20 s and 1100 s; no de-ess applied.',
        'Listen gate PASS: mid passage at 1100 s (−29.7 / −14.9); no over-NR warble.',
        'Listen gate PASS: last word intact; decay done by 2955.28 s.',
      ],
      artifacts: [
        {
          label: 'Restored WAV (full, untrimmed)',
          path: '.cache/audiobook-takes/08_Chapter_6_restored_full.wav',
        },
        {
          label: 'Restored AIFF export (2nd NR)',
          path: '.cache/audiobook-takes/08_Chapter_6_restored_nr2.aiff',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'conform_and_master.py fallback-gap mode: room from inner gap 1812.72–1813.92 s, 0.75 s head / 2.0 s tail, two-pass loudnorm I=−20 / TP=−3.5 / LRA=4 (linear), alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-13T23:57:00',
      completedAt: '2026-08-13T23:58:00',
      metrics: [
        { label: 'speech_start', value: '0.98 s' },
        { label: 'body_end', value: '2955.28 s' },
        { label: 'room window', value: 'gap 1812.72 t=1.20 s, −83.3 / −70.3 dB' },
        { label: 'loudnorm input_i', value: '−29.76' },
        { label: 'loudnorm input_tp', value: '−5.46' },
        { label: 'loudnorm input_lra', value: '4.30' },
        { label: 'loudnorm offset', value: '−0.07' },
        { label: 'loudnorm target I', value: '−20' },
      ],
      notes: [
        'Script: scripts/conform_and_master.py. Fallback-gap mode. Room from inner 1.20 s of the clean 1.80 s gap window, not the short 1.00 s file head, and not the −54.7 dB blip at 1814.441.',
        'Delivered room gate (WAV): head/tail mean −83.3 / −83.3, max −70.3 / −70.3. 0.75–1.5 s speech mean −30.9.',
      ],
      artifacts: [
        {
          label: 'Room-toned WAV',
          path: '.cache/audiobook-takes/08_Chapter_6_restored.wav',
        },
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/08_Chapter_6_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: '.cache/audiobook-takes/08_Chapter_6_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: '.cache/audiobook-takes/08_Chapter_6_master_qc.json',
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
      startedAt: '2026-08-13T23:58:00',
      completedAt: '2026-08-13T23:59:00',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−30.3 → −21.0 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−5.9 → −3.7 dBFS true peak' },
        { label: 'Pre Noise → Post Noise (head)', value: '−73.6 → −72.6 dB' },
        { label: 'Head max', value: '−57.6 dB' },
        { label: 'Tail 2.0 s', value: '−76.3 / −61.1 dB' },
        { label: '0.75–1.5 s speech', value: '−17.8 dB mean' },
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
      completedAt: '2026-08-13T23:59:30',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: '.cache/audiobook-takes/08_Chapter_6_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'Quiet-capture pattern continues (RMS −30.3, near Chapter 5 at −31.4). Peaks are healthy (−5.9). Loudnorm handles it. Mic gain is not hot.',
        'This chapter has no dedicated 10 s head (older Aug 4 take). Room came from a 1.60 s inner slice of a 3.61 s mid-file gap. Do not reuse that profile on later chapters.',
      ],
    },
  ],
};

/** Chapter 7 mastering pass — no dedicated head, fallback gap, 2026-08-14. */
const CHAPTER_7_RUN: MasterTrackRun = {
  chapterId: 7,
  chapterTitle: 'Nature, Animals and Presence',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-14',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Mono 44.1 kHz WAV with no dedicated 10 s head. Speech starts at ~1.15 s. Quiet even capture; peaks healthy; longest clean mid-file gap already passes ACX noise on the inner slice.',
      startedAt: '2026-08-14T00:03:00',
      completedAt: '2026-08-14T00:04:30',
      metrics: [
        { label: 'RMS', value: '−29.7 dBFS' },
        { label: 'LUFS / LRA', value: '−28.9 / 4.4 LU' },
        { label: 'True peak', value: '−7.3 dBFS' },
        { label: 'Noise (gap inner 847.122–848.922 s)', value: '−66.6 dB' },
        { label: 'Gap max', value: '−55.0 dB' },
        { label: 'Crest factor', value: '22.4 dB' },
        { label: 'Silence share', value: '23.7%' },
        { label: 'Duration', value: '41:59.08' },
      ],
      notes: [
        'No dedicated 10 s head. Older take (source dated Aug 4). First ~1.15 s is room, then the first phoneme.',
        'Listen-confirmed first phoneme at 1.15 s (energy hop −64.3 → −36.7). Used speech_start 1.13.',
        'Profile region: longest gap 846.622–849.717 s (3.096 s). Speech leak at both edges. Used clean inner 847.122–848.922 (mean −66.6 / max −55.0).',
        'RMS below ACX window (too quiet). Peak and inner-gap noise already pass.',
        'Last word decay done by 2517.60 s. Source already had ~1.48 s of tail room; ffmpeg rebuilt 2.0 s from the gap.',
        'Source: need-to-master/09_Chapter 7.wav',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, gap noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR from a short mid-file gap, HPF, and 2:1 compression. Scenario: Canada-goose park-docent orientation.',
      notes: [
        'Scenario: a 42-minute volunteer orientation for Canada geese applying to be park docents. The geese already have the hush. The ranger just briefed them from one pond too far back.',
        '01 LUFS HOLD — How loud the whole recording feels. The geese do not want a louder pond. They want the same hush from handshake to goodbye. Integrated −28.9 LUFS; quieter than Chapters 1–3, same family as Chapters 5–6. Raise in mastering, do not re-perform. Signal: −28.9 LUFS.',
        '02 LRA HOLD — How dramatic the narration is. Nobody honks the rules. LRA 4.4 LU; already controlled. Lightest compression only. Signal: 4.4 LU.',
        '03 RMS POLISH — Legacy ACX average. The park packet still uses the old meter. −29.7 dBFS fails the −23 to −18 window as too quiet. Expected loudnorm gain about +9.7 dB. Signal: −29.7 dBFS.',
        '04 Peak HOLD — Loudest instant. Nobody slapped the water. True peak −7.3 dBFS; healthy headroom. Limiter is a safety net only. Signal: −7.3 dBFS.',
        '05 Crest HOLD — Peak minus average. The pauses still have pond in them. 22.4 dB crest; life left in the performance. Do not squash. Signal: 22.4 dB.',
        '06 Noise HOLD — What remains when narration stops. The visitors were already gone. No 10 s head on this older take; clean inner gap mean −66.6 dB already beats −60. Short 1.80 s inner slice of a 3.10 s gap, so NR stays conservative, then a second 6 dB pass so the +9.7 dB loudnorm boost does not lift the bed. Signal: −66.6 dB mean / −55.0 dB max (847.122–848.922 s).',
        '07 Silence HOLD — Pause share 23.7%; natural audiobook pacing. The gaps are thinking, not empty ponds. Signal: 23.7%.',
        '08 Spectral GUIDE — Warm voice, quieter air: low −35.5 / mid −32.2 / high −42.8. No bright harshness; skip de-ess unless the listen gate says otherwise. Signal: low −35.5 / mid −32.2 / high −42.8.',
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
      startedAt: '2026-08-14T00:04:30',
      completedAt: '2026-08-14T00:08:00',
      notes: [
        'De-ess skipped: 6–9 kHz windows at 20 s (−43.2 / −21.4) and 1200 s (−41.5 / −20.3); listen gate found no harsh sibilance.',
        'After first NR: cleaned gap −75.0 / −62.4. Expected loudnorm gain +9.7 would put max near −52.7, above −55. Second 6 dB NR applied from the same cleaned gap.',
        'After second NR: gap −82.5 / −70.3. First phoneme still intact at 1.15 s (−76.2 → −36.7).',
        'Exported AIFF then converted to RIFF WAV. Duration matched source (2519.08 s).',
        'Listen gate PASS: cleaned gap 847.12–848.92 s was room only (no breath, chair, mouth, click).',
        'Listen gate PASS: first phoneme intact at 1.15 s; 0.85 s silence_end is not speech.',
        'Listen gate PASS: S-heavy lines at 20 s and 1200 s; no de-ess applied.',
        'Listen gate PASS: mid passage at 1200 s (−29.5 / −14.8); no over-NR warble.',
        'Listen gate PASS: last word intact; decay done by 2517.60 s.',
      ],
      artifacts: [
        {
          label: 'Restored WAV (full, untrimmed)',
          path: '.cache/audiobook-takes/09_Chapter_7_restored_full.wav',
        },
        {
          label: 'Restored AIFF export (2nd NR)',
          path: '.cache/audiobook-takes/09_Chapter_7_restored_nr2.aiff',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'conform_and_master.py fallback-gap mode: room from inner gap 847.30–848.50 s, 0.75 s head / 2.0 s tail, two-pass loudnorm I=−20 / TP=−3.5 / LRA=4 (linear), alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-14T00:08:00',
      completedAt: '2026-08-14T00:09:20',
      metrics: [
        { label: 'speech_start', value: '1.13 s' },
        { label: 'body_end', value: '2517.60 s' },
        { label: 'room window', value: 'gap 847.30 t=1.200 s, −82.5 / −70.3 dB' },
        { label: 'loudnorm input_i', value: '−29.80' },
        { label: 'loudnorm input_tp', value: '−6.79' },
        { label: 'loudnorm input_lra', value: '4.60' },
        { label: 'loudnorm offset', value: '0.02' },
        { label: 'loudnorm target I', value: '−20' },
      ],
      notes: [
        'Script: scripts/conform_and_master.py. Fallback-gap mode. Room from inner 1.200 s of the 1.800 s gap, not the short 0.85 s file head.',
        'Delivered room gate (WAV): head/tail mean −82.5 / −82.5, max −71.2 / −70.3. 0.75–1.5 s speech mean −27.0.',
      ],
      artifacts: [
        {
          label: 'Room-toned WAV',
          path: '.cache/audiobook-takes/09_Chapter_7_restored.wav',
        },
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/09_Chapter_7_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: '.cache/audiobook-takes/09_Chapter_7_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: '.cache/audiobook-takes/09_Chapter_7_master_qc.json',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. Delivered head 0.76 s and tail 2.00 s. ACX green on all three checks.',
      startedAt: '2026-08-14T00:09:20',
      completedAt: '2026-08-14T00:09:40',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−29.7 → −21.1 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−7.3 → −3.7 dBFS true peak' },
        { label: 'Pre Noise → Post Noise (head)', value: '−66.6 → −74.9 dB' },
        { label: 'Head max', value: '−63.5 dB' },
        { label: 'Tail 2.0 s', value: '−73.1 / −61.1 dB' },
        { label: '0.75–1.5 s speech', value: '−17.7 dB mean' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.6 LU' },
        { label: 'Head', value: '0.76 s' },
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
      completedAt: '2026-08-14T00:10:00',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: '.cache/audiobook-takes/09_Chapter_7_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'Quiet-capture pattern continues (RMS −29.7, near Chapters 5–6). Peaks are healthy (−7.3). Loudnorm handles it. Mic gain is not hot.',
        'This chapter has no dedicated 10 s head (older Aug 4 take). Room came from a 1.80 s inner slice of a 3.10 s mid-file gap. Do not reuse that profile on later chapters.',
      ],
    },
  ],
};

/** Chapter 8 mastering pass — ffmpeg restoration (Audacity NR crash bypass), 2026-08-14. */
const CHAPTER_8_RUN: MasterTrackRun = {
  chapterId: 8,
  chapterTitle: 'Science, Spirituality and Consciousness',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-14',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Mono 44.1 kHz WAV, 60:04. Older Aug 4 take with no dedicated 10 s head. Quiet even capture; peaks healthy; longest clean mid-file gap already passes ACX noise on the inner slice.',
      startedAt: '2026-08-14T00:40:00',
      completedAt: '2026-08-14T00:42:00',
      metrics: [
        { label: 'RMS', value: '−29.4 dBFS' },
        { label: 'LUFS / LRA', value: '−28.7 / 4.4 LU' },
        { label: 'True peak', value: '−6.4 dBFS' },
        { label: 'Noise (gap inner 6.828–9.728 s)', value: '−71.8 dB' },
        { label: 'Gap max', value: '−61.1 dB' },
        { label: 'Crest factor', value: '23.0 dB' },
        { label: 'Silence share', value: '20.9%' },
        { label: 'Duration', value: '60:04.06' },
      ],
      notes: [
        'No dedicated 10 s head. Older take (source dated Aug 4). First ~0.90 s is room, then the first phoneme.',
        'Listen-confirmed first phoneme at 0.90 s (energy hop −72.7 → −56.6 / max −32.1). Used speech_start 0.93 after restoration so the 50 ms quiet onset is not treated as the cut.',
        'Profile region: longest gap 6.228–10.184 s (3.956 s). Speech leak at both edges (full-gap max −48.2). Used clean inner 6.828–9.728 (mean −71.8 / max −61.1).',
        'RMS below ACX window (too quiet). Peak and inner-gap noise already pass.',
        'Last word decay done by 3602.35 s. Source already had ~1.77 s of tail room; ffmpeg rebuilt 2.0 s from the gap.',
        'Source: need-to-master/10_Chapter 8.wav',
        'This file is 60 minutes / 318 MB. Three prior Audacity full-file NR attempts crashed at the end of the reduction pass.',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, gap noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR from a mid-file gap, HPF, and 2:1 compression. Scenario: particle-accelerator silent retreat.',
      notes: [
        'Scenario: a particle-accelerator tunnel that got double-booked as a 60-minute silent retreat. The monks already knew how to whisper. Facilities still showed up with the old RMS clipboard.',
        '01 LUFS HOLD — How loud the whole recording feels. The monks do not want a louder tunnel. They want the same hush from the first footstep to the last. Integrated −28.7 LUFS; same quiet family as Chapters 5–7. Raise in mastering, do not re-perform. Signal: −28.7 LUFS.',
        '02 LRA HOLD — How dramatic the narration is. Nobody fired the beam. LRA 4.4 LU; already controlled. Lightest compression only. Signal: 4.4 LU.',
        '03 RMS POLISH — Legacy ACX average. Facilities still uses the old clipboard. −29.4 dBFS fails the −23 to −18 window as too quiet. Expected loudnorm gain about +9.4 dB. Signal: −29.4 dBFS.',
        '04 Peak HOLD — Loudest instant. Nobody dropped a wrench. True peak −6.4 dBFS; healthy headroom. Limiter is a safety net only. Signal: −6.4 dBFS.',
        '05 Crest HOLD — Peak minus average. The pauses still have tunnel in them. 23.0 dB crest; life left in the performance. Do not squash. Signal: 23.0 dB.',
        '06 Noise HOLD — What remains when narration stops. The beam was already off. No 10 s head on this older take; clean inner gap mean −71.8 dB already beats −60. Short 2.90 s inner slice of a 3.96 s gap. Light 6 dB NR, then a second 6 dB pass so the +9.4 dB loudnorm boost does not lift the bed. Signal: −71.8 dB mean / −61.1 dB max (6.828–9.728 s).',
        '07 Silence HOLD — Pause share 20.9%; natural audiobook pacing. The gaps are thinking, not empty tunnel. Signal: 20.9%.',
        '08 Spectral GUIDE — Warm voice, quieter air: low −32.7 / mid −32.5 / high −45.8. No bright harshness; skip de-ess unless the listen gate says otherwise. Signal: low −32.7 / mid −32.5 / high −45.8.',
        '09 HPF GUIDE — 80 Hz / 12 dB removes the rumble under the beam pipe without thinning the voice. Signal: 80 Hz, 12 dB/oct.',
        '10 Compression GUIDE — 2:1 peak compressor, normalize off. Finishing touch for an LRA already at 4.4. Signal: 2:1, threshold −18 dB, attack 10 ms, release 500 ms.',
        '11 Limiter GUIDE — Ceiling at −3.5 dBFS after loudnorm. Surgical spikes only; peaks start at −6.4. Signal: alimiter −3.5 dBFS.',
      ],
    },
    {
      id: 3,
      name: 'Restoration',
      short: 'Restore',
      status: 'complete',
      summary:
        'Audacity full-file NR crashed three times on this 60-minute take. Restoration ran in ffmpeg instead: same gap profile, 6 dB + 6 dB spectral NR, 80 Hz HPF, light 2:1 compression. No Audacity trim or room paste.',
      startedAt: '2026-08-14T00:42:00',
      completedAt: '2026-08-14T00:48:30',
      notes: [
        'Bypass: ffmpeg afftdn with asendcmd sample_noise on a prepended copy of the inner gap (6.828–9.728 s). Same two-step as Audacity (profile, then reduce). Streamed; never loaded the hour into RAM.',
        'NR1 6 dB: cleaned gap −77.3 / −66.2. Speech 20–23 s unchanged (−29.4 / −14.8). Expected loudnorm gain +9.4 would put max near −56.8, only 1.8 dB of margin under −55. Second 6 dB NR applied from the cleaned gap.',
        'NR2 6 dB then HPF 80 Hz / 2-pole and acompressor 2:1 peak, makeup 1, normalize off. After chain: gap −85.5 / −72.2. First clear phoneme at 0.95 s (max −32.2 then −19.3).',
        'ffmpeg adeclick default flagged 4.19% of samples as clicks (would chew consonants). Skipped. Audacity click removal was the crashed tool; do not substitute a hypersensitive de-clicker.',
        'De-ess skipped: 6–9 kHz windows at 20 s (−48.8 / −26.1) and 1200 s (−47.0 / −23.9); listen gate found no harsh sibilance.',
        'Exported restored full WAV. Duration matched source (3604.06 s). RIFF / mono / 44.1 kHz.',
        'Listen gate PASS: cleaned gap 6.828–9.728 s was room only (mean −85.5 / max −72.2; no breath, chair, mouth, click). Clip: ch8_ffmpeg/listen_gate/01_cleaned_gap.wav',
        'Listen gate PASS: first phoneme intact at 0.95 s after NR; source onset at 0.90 s was a 50 ms quiet attack that NR treated as room. 0.93 s speech_start does not eat the word. Clip: ch8_ffmpeg/listen_gate/02_first_sentence.wav',
        'Listen gate PASS: S-heavy lines at 20 s and 1200 s; no de-ess applied. Clip: ch8_ffmpeg/listen_gate/03_s_lines_20s.wav',
        'Listen gate PASS: mid passage at 1200 s (−28.4 / −15.1); speech level matches source (−29.4 / −14.8 at 20 s). No over-NR warble. Clip: ch8_ffmpeg/listen_gate/04_mid_passage.wav',
        'Listen gate PASS: last word intact; decay done by 3602.35 s. Clip: ch8_ffmpeg/listen_gate/05_last_word.wav',
      ],
      artifacts: [
        {
          label: 'Restored WAV (full, untrimmed)',
          path: '.cache/audiobook-takes/10_Chapter_8_restored_full.wav',
        },
        {
          label: 'NR1 WAV (6 dB afftdn)',
          path: '.cache/audiobook-takes/ch8_ffmpeg/nr1.wav',
        },
        {
          label: 'NR2 WAV (second 6 dB)',
          path: '.cache/audiobook-takes/ch8_ffmpeg/nr2.wav',
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
      startedAt: '2026-08-14T00:48:30',
      completedAt: '2026-08-14T00:50:20',
      metrics: [
        { label: 'speech_start', value: '0.93 s' },
        { label: 'body_end', value: '3602.35 s' },
        { label: 'room window', value: 'gap 7.118 t=2.300 s, −85.5 / −72.2 dB' },
        { label: 'loudnorm input_i', value: '−29.06' },
        { label: 'loudnorm input_tp', value: '−9.03' },
        { label: 'loudnorm input_lra', value: '4.30' },
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
          path: '.cache/audiobook-takes/10_Chapter_8_restored.wav',
        },
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/10_Chapter_8_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: '.cache/audiobook-takes/10_Chapter_8_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: '.cache/audiobook-takes/10_Chapter_8_master_qc.json',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. Delivered head 0.80 s and tail 2.00 s. ACX green on all three checks.',
      startedAt: '2026-08-14T00:50:20',
      completedAt: '2026-08-14T00:50:40',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−29.4 → −20.9 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−6.4 → −3.7 dBFS true peak' },
        { label: 'Pre Noise → Post Noise (head)', value: '−71.8 → −73.9 dB' },
        { label: 'Head max', value: '−62.4 dB' },
        { label: 'Tail 2.0 s', value: '−75.7 / −62.0 dB' },
        { label: '0.75–1.5 s speech', value: '−17.4 dB mean' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.6 LU' },
        { label: 'Head', value: '0.80 s' },
        { label: 'Tail', value: '2.00 s' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 60:04.17' },
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
      completedAt: '2026-08-14T00:51:00',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: '.cache/audiobook-takes/10_Chapter_8_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'Quiet-capture pattern continues (RMS −29.4, near Chapters 5–7). Peaks are healthy (−6.4). Loudnorm handles it. Mic gain is not hot.',
        'This chapter has no dedicated 10 s head (older Aug 4 take). Room came from a 2.30 s inner slice of a 2.90 s mid-file gap. Do not reuse that profile on later chapters.',
        'Audacity is unsafe for 60-minute NR on this machine. Chapter 8 used ffmpeg afftdn with the same gap profile and dB targets. Keep that path for later long chapters.',
      ],
    },
  ],
};

/** Chapter 9 mastering pass — Audacity restoration, 2026-08-14. */
const CHAPTER_9_RUN: MasterTrackRun = {
  chapterId: 9,
  chapterTitle: 'Living in Freedom',
  status: 'ready-for-final-qc',
  updatedAt: '2026-08-14',
  phases: [
    {
      id: 1,
      name: 'Pre-flight',
      short: 'Measure',
      status: 'complete',
      summary:
        'Mono 44.1 kHz WAV, 48:37. Older Aug 4 take with no dedicated 10 s head. Quiet even capture; peaks healthy; longest usable mid-file gap already passes ACX noise on the inner slice.',
      startedAt: '2026-08-14T00:54:00',
      completedAt: '2026-08-14T00:55:30',
      metrics: [
        { label: 'RMS', value: '−29.9 dBFS' },
        { label: 'LUFS / LRA', value: '−29.3 / 4.2 LU' },
        { label: 'True peak', value: '−7.5 dBFS' },
        { label: 'Noise (gap inner 3.85–5.65 s)', value: '−72.6 dB' },
        { label: 'Gap max', value: '−60.8 dB' },
        { label: 'Crest factor', value: '22.4 dB' },
        { label: 'Silence share', value: '23.1%' },
        { label: 'Duration', value: '48:37.19' },
      ],
      notes: [
        'No dedicated 10 s head. Older take (source dated Aug 4). First ~1.00 s is room, then a quiet attack, then the first phoneme.',
        'Listen-confirmed first phoneme at 1.14 s (energy hop −65.7 → −48.6 / max −28.7). The 1.00 s silence_end was a −47.4 dB blip, not the word. Used speech_start 1.12 after restoration.',
        'Profile region: early gap 3.685–5.776 s (2.090 s). Speech leak at both edges (3.685 max −47.4; 5.735 max −37.6). Used clean inner 3.85–5.65 (mean −72.6 / max −60.8). Longer 3.32 s gap at 799.26 had a −51.2 click at 800.76; discarded for profile.',
        'RMS below ACX window (too quiet). Peak and inner-gap noise already pass.',
        'Last word decay done by 2915.85 s. ffmpeg rebuilt 2.0 s tail from the gap.',
        'Source: need-to-master/11_Chapter 9.wav',
        '48 minutes / 245 MB. Audacity full-file NR completed on this length (Chapter 8 at 60 minutes had crashed).',
      ],
    },
    {
      id: 2,
      name: 'Editorial',
      short: 'Assess',
      status: 'complete',
      summary:
        'Hold the even delivery, gap noise, and healthy peaks. Polish RMS up with loudnorm. Guide light NR from a mid-file gap, HPF, and 2:1 compression. Scenario: foghorn parole hearing.',
      notes: [
        'Scenario: a 48-minute parole hearing for a foghorn that has been practicing indoor voice. The board already likes the delivery. They still have a clipboard that says RMS.',
        '01 LUFS HOLD — How loud the whole recording feels. The foghorn does not want a louder room. It wants the same hush from the first word to the last. Integrated −29.3 LUFS; same quiet family as Chapters 5–8. Raise in mastering, do not re-perform. Signal: −29.3 LUFS.',
        '02 LRA HOLD — How dramatic the narration is. Nobody leaned on the horn. LRA 4.2 LU; already controlled. Lightest compression only. Signal: 4.2 LU.',
        '03 RMS POLISH — Legacy ACX average. The clipboard still uses the old scale. −29.9 dBFS fails the −23 to −18 window as too quiet. Expected loudnorm gain about +9.9 dB. Signal: −29.9 dBFS.',
        '04 Peak HOLD — Loudest instant. The horn stayed in the building. True peak −7.5 dBFS; healthy headroom. Limiter is a safety net only. Signal: −7.5 dBFS.',
        '05 Crest HOLD — Peak minus average. The pauses still have air in them. 22.4 dB crest; life left in the performance. Do not squash. Signal: 22.4 dB.',
        '06 Noise HOLD — What remains when narration stops. The foghorn already learned indoor voice. No 10 s head on this older take; clean inner gap mean −72.6 dB already beats −60. Short 1.80 s inner slice of a 2.09 s early gap. Light 6 dB NR, then a second 6 dB pass so the +9.9 dB loudnorm boost does not lift the bed. Signal: −72.6 dB mean / −60.8 dB max (3.85–5.65 s).',
        '07 Silence HOLD — Pause share 23.1%; natural audiobook pacing. The gaps are thinking, not empty hallway. Signal: 23.1%.',
        '08 Spectral GUIDE — Warm voice, quieter air: low −33.8 / mid −32.5 / high −44.8. No bright harshness; skip de-ess unless the listen gate says otherwise. Signal: low −33.8 / mid −32.5 / high −44.8.',
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
        'Audacity restoration on the 48-minute take: gap profile 3.85–5.65 s, 6 dB + 6 dB NR, click removal, 80 Hz HPF, 2:1 compression. Full restored AIFF exported with original length. No Audacity trim or room paste.',
      startedAt: '2026-08-14T00:56:00',
      completedAt: '2026-08-14T00:59:00',
      notes: [
        'Audacity import: mono, 2917.19 s. Profile from clean inner gap 3.85–5.65 s (not the 1.00 s file head, not the leaky 799 s gap).',
        'NR1 6 dB: cleaned gap −77.5 / −65.2. Speech 1.20–4.00 s unchanged (−28.8 / −12.1). Expected loudnorm gain +9.9 would put max at −55.3, only 0.3 dB of margin under −55. Second 6 dB NR applied from the cleaned gap.',
        'NR2 6 dB then click removal (threshold 200, spike_width 20), HPF 80 Hz / 12 dB, compressor 2:1 peak, normalize off. After chain: gap −83.3 / −71.2. First clear phoneme at 1.14 s (max −29.3 then −13.3).',
        'De-ess skipped: 6–9 kHz windows at 20 s (−50.3 / −27.9), 1200 s (−48.8 / −22.5), and 1800 s (−46.7 / −24.3); listen gate found no harsh sibilance.',
        'Exported restored AIFF then converted. Duration matched source (2917.19 s). RIFF / mono / 44.1 kHz.',
        'Listen gate PASS: cleaned gap 3.85–5.65 s was room only (mean −83.3 / max −71.2; no breath, chair, mouth, click). Clip: ch9_ffmpeg/listen_gate/01_cleaned_gap.wav',
        'Listen gate PASS: first phoneme intact at 1.14 s after NR; source onset at 1.00 s was a −47.4 dB blip, not the word. 1.12 s speech_start does not eat the word. Clip: ch9_ffmpeg/listen_gate/02_first_sentence.wav',
        'Listen gate PASS: S-heavy lines at 20 s; no de-ess applied. Clip: ch9_ffmpeg/listen_gate/03_s_lines_20s.wav',
        'Listen gate PASS: mid passage at 1200 s (−31.6 / −15.1); speech level matches source. No over-NR warble. Clip: ch9_ffmpeg/listen_gate/04_mid_passage.wav',
        'Listen gate PASS: last word intact; decay done by 2915.85 s. Clip: ch9_ffmpeg/listen_gate/05_last_word.wav',
      ],
      artifacts: [
        {
          label: 'Restored AIFF (full, untrimmed)',
          path: '.cache/audiobook-takes/11_Chapter_9_restored.aiff',
        },
        {
          label: 'Restored WAV (full, untrimmed)',
          path: '.cache/audiobook-takes/11_Chapter_9_restored_full.wav',
        },
        {
          label: 'NR1 AIFF (6 dB)',
          path: '.cache/audiobook-takes/11_Chapter_9_nr1.aiff',
        },
      ],
    },
    {
      id: 4,
      name: 'Mastering',
      short: 'Encode',
      status: 'complete',
      summary:
        'conform_and_master.py fallback-gap mode: room from inner gap 4.03–5.23 s, 0.75 s head / 2.0 s tail, two-pass loudnorm I=−20 / TP=−3.5 / LRA=4 (linear), alimiter −3.5 dBFS, MP3 192k CBR mono 44.1 kHz.',
      startedAt: '2026-08-14T01:00:00',
      completedAt: '2026-08-14T01:02:00',
      metrics: [
        { label: 'speech_start', value: '1.12 s' },
        { label: 'body_end', value: '2915.85 s' },
        { label: 'room window', value: 'gap 4.03 t=1.200 s, −83.3 / −71.2 dB' },
        { label: 'loudnorm input_i', value: '−29.78' },
        { label: 'loudnorm input_tp', value: '−7.93' },
        { label: 'loudnorm input_lra', value: '4.30' },
        { label: 'loudnorm offset', value: '−0.20' },
        { label: 'loudnorm target I', value: '−20' },
      ],
      notes: [
        'Script: scripts/conform_and_master.py. Fallback-gap mode. Room from inner 1.200 s of the 1.80 s gap, not the short 1.00 s file head.',
        'Delivered room gate (WAV): head/tail mean −83.3 / −83.3, max −71.2 / −71.2. 0.75–1.5 s speech mean −28.4.',
      ],
      artifacts: [
        {
          label: 'Room-toned WAV',
          path: '.cache/audiobook-takes/11_Chapter_9_restored.wav',
        },
        {
          label: 'Loudnorm WAV',
          path: '.cache/audiobook-takes/11_Chapter_9_loudnorm.wav',
        },
        {
          label: 'ACX master',
          path: '.cache/audiobook-takes/11_Chapter_9_acx_master.mp3',
        },
        {
          label: 'QC sidecar',
          path: '.cache/audiobook-takes/11_Chapter_9_master_qc.json',
        },
      ],
    },
    {
      id: 5,
      name: 'Post-flight',
      short: 'Verify',
      status: 'complete',
      summary:
        'Master passes RMS, true peak, and head noise. Delivered head 0.76 s and tail 2.00 s. ACX green on all three checks.',
      startedAt: '2026-08-14T01:02:00',
      completedAt: '2026-08-14T01:03:00',
      metrics: [
        { label: 'Pre RMS → Post RMS', value: '−29.9 → −21.0 dBFS' },
        { label: 'Pre Peak → Post Peak', value: '−7.5 → −3.7 dBFS true peak' },
        { label: 'Pre Noise → Post Noise (head)', value: '−72.6 → −75.8 dB' },
        { label: 'Head max', value: '−63.1 dB' },
        { label: 'Tail 2.0 s', value: '−75.0 / −62.4 dB' },
        { label: '0.75–1.5 s speech', value: '−18.3 dB mean' },
        { label: 'LUFS / LRA', value: '−20.2 / 3.6 LU' },
        { label: 'Head', value: '0.76 s' },
        { label: 'Tail', value: '2.00 s' },
        { label: 'Format', value: 'MP3 192k CBR mono 44.1 kHz, 48:37.48' },
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
      completedAt: '2026-08-14T01:03:30',
      artifacts: [
        {
          label: 'ACX master (local)',
          path: '.cache/audiobook-takes/11_Chapter_9_acx_master.mp3',
        },
      ],
      notes: [
        'Not published to Supabase in this run.',
        'Quiet-capture pattern continues (RMS −29.9, near Chapters 5–8). Peaks are healthy (−7.5). Loudnorm handles it. Mic gain is not hot.',
        'This chapter has no dedicated 10 s head (older Aug 4 take). Room came from a 1.20 s inner slice of a 1.80 s early mid-file gap. Do not reuse that profile on later chapters.',
        'Audacity full-file NR succeeded at 48 minutes. Chapter 8 at 60 minutes had crashed; keep the ffmpeg afftdn bypass ready for anything longer.',
      ],
    },
  ],
};

const RUNS_BY_CHAPTER = new Map<number, MasterTrackRun>([
  [OPENING_CREDITS_RUN.chapterId, OPENING_CREDITS_RUN],
  [CHAPTER_1_RUN.chapterId, CHAPTER_1_RUN],
  [CHAPTER_2_RUN.chapterId, CHAPTER_2_RUN],
  [CHAPTER_3_RUN.chapterId, CHAPTER_3_RUN],
  [CHAPTER_5_RUN.chapterId, CHAPTER_5_RUN],
  [CHAPTER_6_RUN.chapterId, CHAPTER_6_RUN],
  [CHAPTER_7_RUN.chapterId, CHAPTER_7_RUN],
  [CHAPTER_8_RUN.chapterId, CHAPTER_8_RUN],
  [CHAPTER_9_RUN.chapterId, CHAPTER_9_RUN],
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
