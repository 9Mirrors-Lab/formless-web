import { describe, expect, it } from 'vitest';

import { studioChapterRecord } from '@/data/audiobookStudioCatalog';
import type { AudiobookTrack } from '@/lib/audiobookTracks';

function track(
  chapterNumber: number,
  source: 'original' | 'optimized',
): AudiobookTrack {
  return {
    id: `${chapterNumber}-${source}`,
    bookSlug: 'formless',
    chapterNumber,
    chapterTitle: 'Opening Credits',
    source,
    storageBucket: 'audiobook',
    storagePath: `${chapterNumber}/${source}.mp3`,
    mimeType: 'audio/mpeg',
    durationSeconds: 43,
    fileSizeBytes: 1000,
    originalFilename: `${source}.mp3`,
    publicUrl: `https://example.test/${source}.mp3`,
  };
}

describe('audiobookStudioCatalog', () => {
  it('treats a published optimized file as Published, not a vague mastered badge', () => {
    const record = studioChapterRecord(
      13,
      [track(13, 'original'), track(13, 'optimized')],
      new Set(),
    );
    expect(record.current).toBe('published');
    expect(record.states['session-saved']).toBe('skipped');
    expect(record.states.mastered).toBe('complete');
  });

  it('uses local ACX evidence as Mastered when nothing is published yet', () => {
    const record = studioChapterRecord(1, [], new Set());
    expect(record.current).toBe('mastered');
    expect(record.local.acxMasterPath).toContain('03_Chapter_1_acx_master.mp3');
  });

  it('lights Approved only after sign-off', () => {
    const record = studioChapterRecord(
      13,
      [track(13, 'optimized')],
      new Set([13]),
    );
    expect(record.current).toBe('approved');
  });
});
