/**
 * Client re-record review: chapters 4–9 with listen-in tags on the master.
 * Audio loads from published optimized tracks (Google Drive via Supabase catalog).
 */

import {
  AUDIO_CHAPTER_TITLE_BY_ID,
  type AudioChapterId,
} from '@/data/audioBook';

export type ReRecordCue = {
  id: string;
  /** Seek point on the mastered track (seconds). */
  atSeconds: number;
  /** Short label shown on the waveform tag. */
  tag: string;
  /** What changed at this punch. */
  note: string;
};

export type ReRecordTrack = {
  chapterId: Extract<AudioChapterId, 4 | 5 | 6 | 7 | 8 | 9>;
  title: string;
  cues: ReRecordCue[];
};

/** mm:ss or h:mm:ss → seconds. */
export function parseAudioClock(clock: string): number {
  const parts = clock.trim().split(':').map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part))) return 0;
  if (parts.length === 2) {
    const [minutes, seconds] = parts as [number, number];
    return minutes * 60 + seconds;
  }
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts as [number, number, number];
    return hours * 3600 + minutes * 60 + seconds;
  }
  return 0;
}

function cue(
  chapterId: number,
  clock: string,
  tag: string,
  note: string,
): ReRecordCue {
  return {
    id: `ch${chapterId}-${clock.replace(':', '')}`,
    atSeconds: parseAudioClock(clock),
    tag,
    note,
  };
}

export const RE_RECORD_TRACKS: readonly ReRecordTrack[] = [
  {
    chapterId: 4,
    title: AUDIO_CHAPTER_TITLE_BY_ID[4],
    cues: [
      cue(4, '2:04', 'smaller', 'Replace "similar" with "smaller".'),
      cue(4, '3:42', 'from', 'Add in "from".'),
      cue(4, '34:40', 'your', 'Replace "the" with "your".'),
      cue(
        4,
        '39:36',
        'stop running',
        'Add "When you no longer need life to complete you... you stop running...."',
      ),
    ],
  },
  {
    chapterId: 5,
    title: AUDIO_CHAPTER_TITLE_BY_ID[5],
    cues: [
      cue(5, '2:44', 'are', 'Replace "were" with "are".'),
      cue(5, '10:00', 'some', 'Replace "the same" with "some".'),
      cue(5, '25:35', 'yet allowed', 'Add "yet allowed".'),
      cue(5, '33:41', 'different', 'Replace "difficult" with "different".'),
    ],
  },
  {
    chapterId: 6,
    title: AUDIO_CHAPTER_TITLE_BY_ID[6],
    cues: [
      cue(6, '3:31', 'inner', 'Add "inner" (inner world of perceptions).'),
      cue(6, '24:24', 'remove over', 'Remove "over" from "a year or longer".'),
      cue(6, '27:54', 'or', 'Add "or" before validation.'),
      cue(
        6,
        '41:02',
        'inner purpose',
        'Re-record: "When inner purpose is primary, outer purpose..."',
      ),
    ],
  },
  {
    chapterId: 7,
    title: AUDIO_CHAPTER_TITLE_BY_ID[7],
    cues: [cue(7, '29:11', 'remove one', 'Remove "one" from "life".')],
  },
  {
    chapterId: 8,
    title: AUDIO_CHAPTER_TITLE_BY_ID[8],
    cues: [
      cue(8, '17:51', 'internal', 'Replace "eternal" with "internal".'),
      cue(8, '39:51', 'ready to begin', 'Add "I was ready to begin".'),
    ],
  },
  {
    chapterId: 9,
    title: AUDIO_CHAPTER_TITLE_BY_ID[9],
    cues: [
      cue(9, '19:54', 'oneness', 'Replace the second "openness" with "oneness".'),
      cue(9, '28:26', 'someone', 'Replace "something" with "someone".'),
      cue(
        9,
        '43:00',
        'or to',
        'Redo sentence: "There is less of a need to be seen a certain way OR to..."',
      ),
    ],
  },
] as const;

export const RE_RECORD_CHAPTER_IDS = RE_RECORD_TRACKS.map(
  (track) => track.chapterId,
);

export function reRecordTrackByChapterId(
  chapterId: number,
): ReRecordTrack | undefined {
  return RE_RECORD_TRACKS.find((track) => track.chapterId === chapterId);
}

export function reRecordCueNear(
  track: ReRecordTrack,
  time: number,
  windowSeconds = 4,
): ReRecordCue | null {
  const t = Math.max(0, time);
  let best: ReRecordCue | null = null;
  let bestDelta = Number.POSITIVE_INFINITY;
  for (const item of track.cues) {
    const delta = Math.abs(item.atSeconds - t);
    if (delta <= windowSeconds && delta < bestDelta) {
      best = item;
      bestDelta = delta;
    }
  }
  return best;
}
