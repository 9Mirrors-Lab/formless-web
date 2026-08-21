/** Timed read-along cues from whisper medium.en (parallel to audioManuscripts.ts). */

import type { AudioSentence } from '@/data/audioBook';
import { CHAPTER_0_CUES } from '@/data/manuscripts/cues-medium-0';
import { CHAPTER_1_CUES } from '@/data/manuscripts/cues-medium-1';
import { CHAPTER_2_CUES } from '@/data/manuscripts/cues-medium-2';
import { CHAPTER_3_CUES } from '@/data/manuscripts/cues-medium-3';
import { CHAPTER_4_CUES } from '@/data/manuscripts/cues-medium-4';
import { CHAPTER_5_CUES } from '@/data/manuscripts/cues-medium-5';
import { CHAPTER_6_CUES } from '@/data/manuscripts/cues-medium-6';
import { CHAPTER_7_CUES } from '@/data/manuscripts/cues-medium-7';
import { CHAPTER_8_CUES } from '@/data/manuscripts/cues-medium-8';
import { CHAPTER_9_CUES } from '@/data/manuscripts/cues-medium-9';
import { CHAPTER_12_CUES } from '@/data/manuscripts/cues-medium-12';
import { CHAPTER_13_CUES } from '@/data/manuscripts/cues-medium-13';

function sentences(
  chapterId: number,
  lines: Array<{ text: string; start: number; end: number }>,
): AudioSentence[] {
  return lines.map((line, index) => ({
    id: `c${chapterId}-m-s${index + 1}`,
    text: line.text,
    start: line.start,
    end: line.end,
  }));
}

const MANUSCRIPTS: Record<number, AudioSentence[]> = {
  13: sentences(13, CHAPTER_13_CUES),
  0: sentences(0, CHAPTER_0_CUES),
  1: sentences(1, CHAPTER_1_CUES),
  2: sentences(2, CHAPTER_2_CUES),
  3: sentences(3, CHAPTER_3_CUES),
  4: sentences(4, CHAPTER_4_CUES),
  5: sentences(5, CHAPTER_5_CUES),
  6: sentences(6, CHAPTER_6_CUES),
  7: sentences(7, CHAPTER_7_CUES),
  8: sentences(8, CHAPTER_8_CUES),
  9: sentences(9, CHAPTER_9_CUES),
  12: sentences(12, CHAPTER_12_CUES),
};

/** Whisper medium.en timed script for a listen-order track. */
export function manuscriptForChapterMedium(chapterId: number): AudioSentence[] {
  return MANUSCRIPTS[chapterId] ?? [];
}
