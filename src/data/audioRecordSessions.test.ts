import { describe, expect, it } from 'vitest';

import { CHAPTER_9_PRODUCTIVITY_PUNCH, RECORD_SESSION_LIST } from '@/data/audioRecordSessions';

describe('audioRecordSessions', () => {
  it('lists only the Chapter 9 productivity punch', () => {
    expect(RECORD_SESSION_LIST).toEqual([CHAPTER_9_PRODUCTIVITY_PUNCH]);
  });

  it('gives Chapter 9 a two-line productivity punch and stops before the next sentence', () => {
    expect(CHAPTER_9_PRODUCTIVITY_PUNCH.closing).toBeUndefined();
    expect(CHAPTER_9_PRODUCTIVITY_PUNCH.saveAs).toBe(
      '11_Chapter_9_punch_productivity.wav',
    );
    expect(CHAPTER_9_PRODUCTIVITY_PUNCH.beats?.map((beat) => beat.lines)).toEqual([
      ['I no longer feel pressure to always be doing something.'],
      [
        'I see that there is a different kind of productivity that comes from stillness and presence.',
      ],
    ]);
    expect(CHAPTER_9_PRODUCTIVITY_PUNCH.stopCue).toContain('When I am still');
  });
});
