/** Mock chapter + manuscript data for Formless audiobook review mockups. */

/**
 * Workflow after an original exists:
 * recorded → ready (optimized uploaded) → approved.
 * pending = no original master yet (not shown as a client status label).
 */
export type AudioChapterStatus = 'pending' | 'recorded' | 'ready' | 'approved';

export type AudioSentence = {
  id: string;
  text: string;
  start: number;
  end: number;
};

export type AudioChapter = {
  id: number;
  title: string;
  /** Seconds */
  length: number;
  status: AudioChapterStatus;
  /** True when titles are stand-ins until manuscript titles are locked. */
  provisional?: boolean;
  manuscript: AudioSentence[];
};

export const AUDIO_BOOK = {
  title: 'Formless',
  subtitle: 'Who you truly are beyond the mind. A journey within.',
  author: 'Sonika Cottman',
  imprint: 'Eyes Closed',
  format: 'Audible chapter recordings',
} as const;

/** Client-facing status copy. Pending chapters show no status badge. */
export const AUDIO_STATUS_LABEL: Record<
  Exclude<AudioChapterStatus, 'pending'>,
  string
> = {
  recorded: 'Chapter recorded',
  ready: 'Recorded and mastered',
  approved: 'Approved',
};

export function audioStatusLabel(status: AudioChapterStatus): string {
  switch (status) {
    case 'pending':
      return 'Not recorded';
    case 'recorded':
    case 'ready':
    case 'approved':
      return AUDIO_STATUS_LABEL[status];
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function sentences(
  chapterId: number,
  lines: Array<{ text: string; start: number; end: number }>,
): AudioSentence[] {
  return lines.map((line, index) => ({
    id: `c${chapterId}-s${index + 1}`,
    text: line.text,
    start: line.start,
    end: line.end,
  }));
}

/** Chapter 1 read-along cues aligned to the uploaded original master (whisper-timed). */
const CHAPTER_1_MANUSCRIPT = sentences(1, [
  {
    text: 'Chapter 1. The Feeling of Wholeness.',
    start: 0,
    end: 5.66,
  },
  {
    text: 'You’ve made it in life. You have the house, the family, the career, the steady routine that signals success.',
    start: 5.66,
    end: 14.5,
  },
  {
    text: 'The life you once imagined has mostly unfolded.',
    start: 14.5,
    end: 18.0,
  },
  {
    text: 'And yet, a familiar emptiness lingers. A quiet unease. A sense of not feeling whole, not having arrived.',
    start: 18.0,
    end: 28.76,
  },
  {
    text: 'No matter what you achieve, something in you keeps wanting more.',
    start: 28.76,
    end: 34.24,
  },
  {
    text: 'If it’s not this house, maybe a bigger one will finally make you happy. If it’s not this relationship, perhaps the next one will bring you back to life.',
    start: 34.24,
    end: 44.92,
  },
  {
    text: 'Maybe it’s a new job. A different city. A fresh start. Then you think everything will feel right.',
    start: 44.92,
    end: 53.2,
  },
  {
    text: 'Your mind convinces you that fulfillment is just one change away.',
    start: 53.2,
    end: 58.5,
  },
  {
    text: 'That if the outer picture can be changed, the inner emptiness will disappear.',
    start: 58.5,
    end: 66.8,
  },
  {
    text: 'Yet, no matter how many times you rearrange the furniture of your life, the quiet ache returns, reminding you that what you seek cannot be found in the next thing, the next place, or the next person.',
    start: 66.8,
    end: 78.84,
  },
  {
    text: 'You begin to question it. How can you have accomplished so much and still feel like something is missing?',
    start: 78.84,
    end: 88.0,
  },
  {
    text: 'The struggle continues. The finish line keeps moving. You wait for the world to reflect your happiness back to you, expecting it to tell you who you are to make you feel complete.',
    start: 88.0,
    end: 104.48,
  },
  {
    text: 'You believe peace and wholeness live somewhere outside of you, and you just have to find them.',
    start: 104.48,
    end: 111.64,
  },
  {
    text: 'And so the search goes on as you continue wanting something more, something different.',
    start: 111.64,
    end: 119.4,
  },
  {
    text: 'You haven’t yet realized that what you’re searching for has never been missing.',
    start: 119.4,
    end: 127.12,
  },
  {
    text: 'It isn’t out there in the world. It’s here, alive within you, beneath the noise of wanting.',
    start: 127.12,
    end: 136.24,
  },
  {
    text: 'Every moment you’ve been chasing, every desire you’ve tried to fulfill has been leading you back to this, the stillness inside, the wholeness that has never left.',
    start: 136.24,
    end: 150.16,
  },
]);

const CHAPTER_4_MANUSCRIPT = sentences(4, [
  {
    text: 'Resistance is the mind’s attempt to keep the known world intact.',
    start: 0,
    end: 6.4,
  },
  {
    text: 'It tightens around what feels threatening, and calls that tightness protection.',
    start: 6.4,
    end: 13.8,
  },
  {
    text: 'Surrender is not collapse. It is the willingness to see without defending.',
    start: 13.8,
    end: 21.2,
  },
  {
    text: 'When you stop fighting the moment, space opens around the thought.',
    start: 21.2,
    end: 28.0,
  },
  {
    text: 'In that space, you are no longer the resistance. You are the awareness that notices it.',
    start: 28.0,
    end: 37.5,
  },
]);

function placeholderManuscript(chapterId: number, title: string): AudioSentence[] {
  const opening =
    chapterId === 0 || chapterId === 13
      ? `Opening of ${title}.`
      : `Opening of Chapter ${chapterId}: ${title}.`;
  return sentences(chapterId, [
    {
      text: opening,
      start: 0,
      end: 5.5,
    },
    {
      text: 'This chapter recording is prepared for client review against the manuscript.',
      start: 5.5,
      end: 12.0,
    },
    {
      text: 'Toggle Original and Optimized with T to compare the same playhead position.',
      start: 12.0,
      end: 19.5,
    },
    {
      text: 'Open Read along to follow sentence sync beside the waveform.',
      start: 19.5,
      end: 26.0,
    },
  ]);
}

/**
 * Opening Credits + Intro + chapters 1–11.
 * Opening Credits (id 13): original + optimized uploaded (status ready).
 * Intro + chapters 1–4: originals recorded; not optimized yet.
 */
export const AUDIO_CHAPTERS: AudioChapter[] = [
  {
    id: 13,
    title: 'Opening Credits',
    length: 43,
    status: 'ready',
    manuscript: placeholderManuscript(13, 'Opening Credits'),
  },
  {
    id: 0,
    title: 'Introduction',
    length: 795,
    status: 'recorded',
    manuscript: placeholderManuscript(0, 'Introduction'),
  },
  {
    id: 1,
    title: 'The Feeling of Wholeness',
    length: 1664,
    status: 'recorded',
    manuscript: CHAPTER_1_MANUSCRIPT,
  },
  {
    id: 2,
    title: 'Awareness and The Ego',
    length: 1618,
    status: 'recorded',
    manuscript: placeholderManuscript(2, 'Awareness and The Ego'),
  },
  {
    id: 3,
    title: 'Past Pain & Present Moment',
    length: 2026,
    status: 'recorded',
    manuscript: placeholderManuscript(3, 'Past Pain & Present Moment'),
  },
  {
    id: 4,
    title: 'Resistance & Surrender',
    length: 2413,
    status: 'recorded',
    manuscript: CHAPTER_4_MANUSCRIPT,
  },
  {
    id: 5,
    title: 'The Observer and The Observed',
    length: 17 * 60 + 30,
    status: 'pending',
    provisional: true,
    manuscript: placeholderManuscript(5, 'The Observer and The Observed'),
  },
  {
    id: 6,
    title: 'Thought, Story, and Identity',
    length: 20 * 60 + 12,
    status: 'pending',
    provisional: true,
    manuscript: placeholderManuscript(6, 'Thought, Story, and Identity'),
  },
  {
    id: 7,
    title: 'Nature, Animals & Their Wisdom',
    length: 15 * 60 + 40,
    status: 'pending',
    manuscript: placeholderManuscript(7, 'Nature, Animals & Their Wisdom'),
  },
  {
    id: 8,
    title: 'Love Without Possession',
    length: 18 * 60 + 5,
    status: 'pending',
    provisional: true,
    manuscript: placeholderManuscript(8, 'Love Without Possession'),
  },
  {
    id: 9,
    title: 'Work and Daily Life',
    length: 14 * 60 + 22,
    status: 'pending',
    provisional: true,
    manuscript: placeholderManuscript(9, 'Work and Daily Life'),
  },
  {
    id: 10,
    title: 'The End of Seeking',
    length: 16 * 60 + 10,
    status: 'pending',
    provisional: true,
    manuscript: placeholderManuscript(10, 'The End of Seeking'),
  },
  {
    id: 11,
    title: 'Living From Stillness',
    length: 13 * 60 + 48,
    status: 'pending',
    provisional: true,
    manuscript: placeholderManuscript(11, 'Living From Stillness'),
  },
];

/** Sidebar / transport label for chapter index (0 = Introduction, 13 = Opening Credits). */
export function formatChapterIndex(id: number): string {
  if (id === 0) return 'Intro';
  if (id === 13) return 'OC';
  return String(id);
}

export function formatAudioTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60);
  const s = Math.floor(safe % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatAudioPrecise(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60);
  const s = Math.floor(safe % 60);
  const cs = Math.floor((safe % 1) * 100);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
}

export function activeSentenceAt(chapter: AudioChapter, time: number): AudioSentence | null {
  // Use absolute chapter time. Do not loop the cue list; looping made highlights
  // jump ahead of long masters when the excerpt ended.
  const t = Math.max(0, time);
  return (
    chapter.manuscript.find((s) => t >= s.start && t < s.end) ??
    (t >= (chapter.manuscript[chapter.manuscript.length - 1]?.end ?? 0)
      ? chapter.manuscript[chapter.manuscript.length - 1] ?? null
      : chapter.manuscript[0] ?? null)
  );
}

export function chapterProgressSummary(chapters: AudioChapter[]) {
  const total = chapters.length;
  const recorded = chapters.filter((c) => c.status !== 'pending').length;
  const optimized = chapters.filter(
    (c) => c.status === 'ready' || c.status === 'approved',
  ).length;
  const approved = chapters.filter((c) => c.status === 'approved').length;
  const ready = chapters.filter((c) => c.status === 'ready').length;

  return {
    total,
    recorded,
    optimized,
    approved,
    ready,
    pending: chapters.filter((c) => c.status === 'pending').length,
    /** Overall percent tracks approved chapters toward completion. */
    percent: total === 0 ? 0 : Math.round((approved / total) * 100),
  };
}

/** Deterministic waveform samples for mock visualization. */
export function waveformSamples(seed: number, count: number): number[] {
  const out: number[] = [];
  let x = seed || 1;
  for (let i = 0; i < count; i += 1) {
    x = (x * 16807) % 2147483647;
    const n = (x % 1000) / 1000;
    const envelope = 0.35 + 0.65 * Math.sin((i / count) * Math.PI);
    out.push(0.08 + n * 0.92 * envelope);
  }
  return out;
}
