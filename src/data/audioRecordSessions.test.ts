import { describe, expect, it } from 'vitest';

import { ACKNOWLEDGMENTS_RERECORD } from '@/data/audioRecordSessions';

describe('audioRecordSessions', () => {
  it('ends Acknowledgments with ACX closing credits', () => {
    expect(ACKNOWLEDGMENTS_RERECORD.closing.lines).toEqual([
      'You have been listening to Formless, written by Sonika Cottman, narrated by Sonika Cottman.',
      'Copyright 2026 Sonika Cottman.',
      'The End.',
    ]);
    expect(ACKNOWLEDGMENTS_RERECORD.roomSeconds).toBe(10);
    expect(ACKNOWLEDGMENTS_RERECORD.beats[0]?.lines[0]).toBe('Acknowledgments.');
  });
});
