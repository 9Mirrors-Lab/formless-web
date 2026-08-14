import { describe, expect, it } from 'vitest';

import {
  AUDIO_BOOK,
  audiobookRemainingSeconds,
  formatAudioRuntime,
} from '@/data/audioBook';

describe('formatAudioRuntime', () => {
  it('formats the locked Formless master total', () => {
    expect(formatAudioRuntime(AUDIO_BOOK.runtimeSeconds)).toBe('6h 51m 39s');
  });

  it('omits hours when the duration is under an hour', () => {
    expect(formatAudioRuntime(7 * 60 + 10)).toBe('7m 10s');
  });
});

describe('audiobookRemainingSeconds', () => {
  const chapters = [
    { id: 13, length: 43 },
    { id: 0, length: 100 },
    { id: 1, length: 50 },
  ];

  it('adds leftover in the current chapter to every chapter after it', () => {
    expect(audiobookRemainingSeconds(chapters, 13, 10)).toBe(183);
    expect(audiobookRemainingSeconds(chapters, 0, 25)).toBe(125);
    expect(audiobookRemainingSeconds(chapters, 1, 50)).toBe(0);
  });

  it('falls back to the locked master total when the catalog is empty', () => {
    expect(audiobookRemainingSeconds([], 13, 10)).toBe(
      AUDIO_BOOK.runtimeSeconds - 10,
    );
  });
});
