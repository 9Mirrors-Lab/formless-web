import { describe, expect, it } from 'vitest';

import { AUDIO_LISTEN_ORDER, canonicalChapterTitle } from '@/data/audioBook';
import { manuscriptForChapter } from '@/data/audioManuscripts';

describe('manuscriptForChapter', () => {
  it('has a timed script for every listen-order track', () => {
    for (const id of AUDIO_LISTEN_ORDER) {
      const cues = manuscriptForChapter(id);
      expect(cues.length, canonicalChapterTitle(id)).toBeGreaterThan(0);
      expect(cues[0]?.start).toBeGreaterThanOrEqual(0);
      const last = cues[cues.length - 1];
      expect(last?.end ?? 0).toBeGreaterThan(cues[0]?.start ?? 0);
    }
  });
});
