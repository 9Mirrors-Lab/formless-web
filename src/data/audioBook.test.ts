import { describe, expect, it } from 'vitest';

import { AUDIO_BOOK, formatAudioRuntime } from '@/data/audioBook';

describe('formatAudioRuntime', () => {
  it('formats the locked Formless master total', () => {
    expect(formatAudioRuntime(AUDIO_BOOK.runtimeSeconds)).toBe('6h 51m 39s');
  });

  it('omits hours when the duration is under an hour', () => {
    expect(formatAudioRuntime(7 * 60 + 10)).toBe('7m 10s');
  });
});
