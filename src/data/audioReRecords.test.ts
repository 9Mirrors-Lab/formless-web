import { describe, expect, it } from 'vitest';

import {
  parseAudioClock,
  RE_RECORD_CHAPTER_IDS,
  RE_RECORD_TRACKS,
  reRecordCueNear,
  reRecordTrackByChapterId,
} from '@/data/audioReRecords';

describe('audioReRecords', () => {
  it('covers chapters 4-9 with punch tags', () => {
    expect(RE_RECORD_CHAPTER_IDS).toEqual([4, 5, 6, 7, 8, 9]);
    for (const track of RE_RECORD_TRACKS) {
      expect(track.cues.length).toBeGreaterThan(0);
      expect(track.title.length).toBeGreaterThan(0);
    }
  });

  it('parses listen clocks used on the tags', () => {
    expect(parseAudioClock('2:04')).toBe(124);
    expect(parseAudioClock('34:40')).toBe(2080);
    expect(parseAudioClock('1:02:03')).toBe(3723);
  });

  it('finds the nearest cue for a playhead', () => {
    const chapter4 = reRecordTrackByChapterId(4)!;
    expect(reRecordCueNear(chapter4, 124)?.tag).toBe('smaller');
    expect(reRecordCueNear(chapter4, 200)).toBeNull();
  });
});
