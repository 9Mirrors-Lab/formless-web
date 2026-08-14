/** Formless audiobook book metadata, locked titles, and listen helpers. */

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
  manuscript: AudioSentence[];
};

export const AUDIO_BOOK = {
  title: 'Formless',
  subtitle: 'Who you truly are beyond the mind. A journey within.',
  author: 'Sonika Cottman',
  imprint: 'Eyes Closed',
  format: 'Audible chapter recordings',
  /** Mastered ACX total from Final QC, 14 Aug 2026. */
  runtimeSeconds: 6 * 3600 + 51 * 60 + 39,
} as const;

/** Listen order: Opening Credits, Introduction, chapters 1–9, Acknowledgments. */
export const AUDIO_LISTEN_ORDER = [13, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12] as const;

export type AudioChapterId = (typeof AUDIO_LISTEN_ORDER)[number];

/** Locked listen-order titles. Use these names on every audio rack. */
export const AUDIO_CHAPTER_TITLE_BY_ID: Record<AudioChapterId, string> = {
  13: 'Opening Credits',
  0: 'Introduction',
  1: 'The Feeling of Wholeness',
  2: 'Awareness and the Ego',
  3: 'Past Pain, Time and the Present Moment',
  4: 'Resistance and Surrender',
  5: 'Conscious Relationships',
  6: 'Work, Identity and Purpose',
  7: 'Nature, Animals and Presence',
  8: 'Science, Spirituality and Consciousness',
  9: 'Living in Freedom',
  12: 'Acknowledgments',
};

export const AUDIO_STATUS_LABEL: Record<
  Exclude<AudioChapterStatus, 'pending'>,
  string
> = {
  recorded: 'Chapter recorded',
  ready: 'Recorded and mastered',
  approved: 'Approved',
};

export function isAudioChapterId(id: number): id is AudioChapterId {
  return (AUDIO_LISTEN_ORDER as readonly number[]).includes(id);
}

export function audiobookListenOrderRank(chapterNumber: number): number {
  const index = (AUDIO_LISTEN_ORDER as readonly number[]).indexOf(chapterNumber);
  return index === -1 ? 1000 + chapterNumber : index;
}

export function canonicalChapterTitle(
  chapterNumber: number,
  fallback?: string,
): string {
  if (isAudioChapterId(chapterNumber)) {
    return AUDIO_CHAPTER_TITLE_BY_ID[chapterNumber];
  }
  return fallback ?? `Chapter ${chapterNumber}`;
}

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

/** Sidebar / transport label for chapter index (0 = Int, 12 = Ack, 13 = OC). */
export function formatChapterIndex(id: number): string {
  if (id === 0) return 'Int';
  if (id === 12) return 'Ack';
  if (id === 13) return 'OC';
  return String(id);
}

export function formatAudioTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60);
  const s = Math.floor(safe % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Book-length runtime for edition chrome (e.g. 6h 51m 39s). */
export function formatAudioRuntime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  if (hours === 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function formatAudioPrecise(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60);
  const s = Math.floor(safe % 60);
  const cs = Math.floor((safe % 1) * 100);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
}

export function activeSentenceAt(chapter: AudioChapter, time: number): AudioSentence | null {
  if (chapter.manuscript.length === 0) return null;
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
    percent: total === 0 ? 0 : Math.round((approved / total) * 100),
  };
}

export function chapterStatusFromSources(
  hasOriginal: boolean,
  hasOptimized: boolean,
): AudioChapterStatus {
  if (hasOptimized) return 'ready';
  if (hasOriginal) return 'recorded';
  return 'pending';
}
