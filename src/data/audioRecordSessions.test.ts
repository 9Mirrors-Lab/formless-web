import { describe, expect, it } from 'vitest';

import {
  ACKNOWLEDGMENTS_RERECORD,
  CHAPTER_9_PRODUCTIVITY_PUNCH,
  RECORD_SESSION_LIST,
} from '@/data/audioRecordSessions';

describe('audioRecordSessions', () => {
  it('ends Acknowledgments with ACX closing credits', () => {
    expect(ACKNOWLEDGMENTS_RERECORD.closing?.lines).toEqual([
      'You have been listening to Formless, written by Sonika Cottman, narrated by Sonika Cottman.',
      'Copyright 2026 Sonika Cottman.',
      'The End.',
    ]);
    expect(ACKNOWLEDGMENTS_RERECORD.closing?.cue).toBe('Closing credits · new');
    expect(ACKNOWLEDGMENTS_RERECORD.saveAs).toBe('12_Acknowledgments.wav');
  });

  it('gives Chapter 9 a two-line productivity punch and stops before the next sentence', () => {
    expect(RECORD_SESSION_LIST[0]).toBe(CHAPTER_9_PRODUCTIVITY_PUNCH);
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
