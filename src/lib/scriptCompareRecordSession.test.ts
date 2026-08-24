import { describe, expect, it } from 'vitest';

import { arcManuscriptForChapter } from '@/data/arcManuscriptChapters';
import { manuscriptForChapterMedium } from '@/data/audioManuscriptsMedium';
import {
  recordSessionFindingForChunk,
  recordSessionFindingForDiff,
} from '@/lib/scriptCompareRecordSession';
import {
  cueStartForChunk,
  diffWordTokens,
  scriptTokensFromCues,
  tokenizeWords,
  type DiffChunk,
  type WordDiffResult,
} from '@/lib/scriptWordDiff';

function diffFor(chapterId: number): WordDiffResult {
  return diffWordTokens(
    tokenizeWords(arcManuscriptForChapter(chapterId)),
    scriptTokensFromCues(manuscriptForChapterMedium(chapterId)),
  );
}

function chunkWithKey(
  result: WordDiffResult,
  side: 'left' | 'right',
  key: string,
): DiffChunk | undefined {
  return result.chunks.find(
    (chunk) =>
      chunk.kind !== 'equal' &&
      chunk[side].some((token) => token.key === key),
  );
}

describe('recordSessionFindingForDiff', () => {
  it('does not link equal text or a difference with no Record Sessions beat', () => {
    expect(
      recordSessionFindingForDiff(
        9,
        {
          id: 1,
          kind: 'equal',
          left: [{ display: 'Hello', key: 'hello' }],
          right: [{ display: 'Hello', key: 'hello' }],
        },
        10,
      ),
    ).toBeNull();
    expect(
      recordSessionFindingForDiff(
        9,
        {
          id: 2,
          kind: 'replace',
          left: [{ display: 'xyzzy', key: 'xyzzy' }],
          right: [{ display: 'plugh', key: 'plugh' }],
        },
        12,
      ),
    ).toBeNull();
  });

  it('links Chapter 8’s missing “I was ready to begin” to its player beat', () => {
    const result = diffFor(8);
    const chunk = chunkWithKey(result, 'left', 'ready');
    expect(chunk).toBeTruthy();
    expect(recordSessionFindingForChunk(8, result.chunks, chunk!).id).toBe(
      'ch8-ready-to-begin',
    );
  });

  it('links Chapter 4’s complete-you gap to its player beat', () => {
    const result = diffFor(4);
    const chunk = chunkWithKey(result, 'left', 'complete');
    expect(chunk).toBeTruthy();
    expect(recordSessionFindingForChunk(4, result.chunks, chunk!).id).toBe(
      'ch4-complete-you',
    );
  });

  it('links Chapter 9 oneness/openness wording to its player beat', () => {
    const result = diffFor(9);
    const chunk = chunkWithKey(result, 'left', 'oneness');
    expect(chunk).toBeTruthy();
    const trackTime = cueStartForChunk(result.chunks, chunk!.id);
    expect(trackTime).toBeGreaterThan(1180);
    expect(recordSessionFindingForChunk(9, result.chunks, chunk!).id).toBe(
      'ch9-openness',
    );
  });

  it('links Chapter 9 “the mind” / “my mind” wording to its player beat', () => {
    const result = diffFor(9);
    const my = chunkWithKey(result, 'right', 'my');
    expect(my).toBeTruthy();
    expect(recordSessionFindingForChunk(9, result.chunks, my!).id).toBe(
      'ch9-the-mind',
    );
  });
});
