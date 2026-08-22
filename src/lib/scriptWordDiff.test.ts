import { describe, expect, it } from 'vitest';

import {
  aggregateDiffStats,
  cueStartForChunk,
  diffManuscriptTexts,
  diffWordTokens,
  normalizeWordKey,
  scriptTextFromCues,
  scriptTokensFromCues,
  tokenizeWords,
} from '@/lib/scriptWordDiff';

describe('scriptWordDiff', () => {
  it('normalizes case and punctuation for keys', () => {
    expect(normalizeWordKey("Don't")).toBe("don't");
    expect(normalizeWordKey('S.J.')).toBe('sj');
    expect(normalizeWordKey('“Peace,”')).toBe('peace');
  });

  it('tokenizes words and keeps display forms', () => {
    const tokens = tokenizeWords('Hello, world — don’t stop.');
    expect(tokens.map((t) => t.display)).toEqual([
      'Hello',
      'world',
      'don’t',
      'stop',
    ]);
    expect(tokens.map((t) => t.key)).toEqual([
      'hello',
      'world',
      "don't",
      'stop',
    ]);
  });

  it('preserves paragraph and line breaks from the source', () => {
    const tokens = tokenizeWords(
      'INTRODUCTION\n\nThe Beginning\nNext line still one para.\n\nBody starts here.',
    );
    expect(tokens.map((t) => t.display)).toEqual([
      'INTRODUCTION',
      'The',
      'Beginning',
      'Next',
      'line',
      'still',
      'one',
      'para',
      'Body',
      'starts',
      'here',
    ]);
    expect(tokens.find((t) => t.display === 'INTRODUCTION')?.breakAfter).toBe(
      'paragraph',
    );
    expect(tokens.find((t) => t.display === 'Beginning')?.breakAfter).toBe(
      'line',
    );
    expect(tokens.find((t) => t.display === 'para')?.breakAfter).toBe(
      'paragraph',
    );
  });

  it('copies ARC paragraph breaks onto aligned audio words', () => {
    const result = diffManuscriptTexts(
      'Title\n\nHello world',
      'Title Hello world',
    );
    const equal = result.chunks.find((c) => c.kind === 'equal');
    expect(equal?.left[0]?.breakAfter).toBe('paragraph');
    expect(equal?.right[0]?.breakAfter).toBe('paragraph');
  });

  it('marks equal runs and missing ARC words', () => {
    const result = diffManuscriptTexts(
      'The story had embedded itself so deeply',
      'The story so deeply',
    );
    expect(result.stats.missingFromScript).toBe(3);
    expect(result.stats.onlyInScript).toBe(0);
    expect(result.chunks.some((c) => c.kind === 'delete')).toBe(true);
    const deleted = result.chunks.find((c) => c.kind === 'delete');
    expect(deleted?.left.map((t) => t.key)).toEqual([
      'had',
      'embedded',
      'itself',
    ]);
  });

  it('marks script-only inserts', () => {
    const result = diffManuscriptTexts(
      'Published by Eyes Closed',
      'Written and narrated Published by Eyes Closed',
    );
    expect(result.stats.onlyInScript).toBe(3);
    const inserted = result.chunks.find((c) => c.kind === 'insert');
    expect(inserted?.right.map((t) => t.key)).toEqual([
      'written',
      'and',
      'narrated',
    ]);
  });

  it('marks replacements when both sides change', () => {
    const result = diffManuscriptTexts(
      'The mind no longer interferes',
      'My mind no longer interferes',
    );
    const replaced = result.chunks.find((c) => c.kind === 'replace');
    expect(replaced?.left.map((t) => t.key)).toEqual(['the']);
    expect(replaced?.right.map((t) => t.key)).toEqual(['my']);
    expect(result.stats.replacements).toBe(1);
  });

  it('joins cue texts for the script side', () => {
    expect(
      scriptTextFromCues([
        { text: ' Hello. ' },
        { text: 'World' },
        { text: '' },
      ]),
    ).toBe('Hello. World');
  });

  it('stamps track time on the first word of each cue', () => {
    const tokens = scriptTokensFromCues([
      { text: 'Hello world.', start: 12.4 },
      { text: 'Next line.', start: 18 },
    ]);
    expect(tokens.map((token) => token.display)).toEqual([
      'Hello',
      'world',
      'Next',
      'line',
    ]);
    expect(tokens[0]?.cueStart).toBe(12.4);
    expect(tokens[1]?.cueStart).toBeUndefined();
    expect(tokens[2]?.cueStart).toBe(18);
  });

  it('keeps cue times through the word diff', () => {
    const result = diffWordTokens(
      tokenizeWords('Hello world next line'),
      scriptTokensFromCues([
        { text: 'Hello world.', start: 12.4 },
        { text: 'Next line.', start: 18 },
      ]),
    );
    const spoken = result.chunks.flatMap((chunk) => chunk.right);
    expect(spoken.find((token) => token.display === 'Hello')?.cueStart).toBe(
      12.4,
    );
    expect(spoken.find((token) => token.display === 'Next')?.cueStart).toBe(18);
    expect(cueStartForChunk(result.chunks, result.chunks[0]!.id)).toBe(12.4);
  });

  it('uses the cue still in progress when a diff starts mid-line', () => {
    const result = diffWordTokens(
      tokenizeWords('Hello world extra next line'),
      scriptTokensFromCues([
        { text: 'Hello world.', start: 12.4 },
        { text: 'Next line.', start: 18 },
      ]),
    );
    const deleted = result.chunks.find((chunk) => chunk.kind === 'delete');
    expect(deleted).toBeTruthy();
    expect(cueStartForChunk(result.chunks, deleted!.id)).toBe(12.4);
  });

  it('looks ahead to the next cue when a leading book-only word has no audio yet', () => {
    const result = diffWordTokens(
      tokenizeWords('CHAPTER Hello world'),
      scriptTokensFromCues([{ text: 'Hello world.', start: 2.1 }]),
    );
    const deleted = result.chunks.find((chunk) => chunk.kind === 'delete');
    expect(deleted).toBeTruthy();
    expect(cueStartForChunk(result.chunks, deleted!.id)).toBe(2.1);
  });

  it('aggregates chapter stats into a book total', () => {
    const a = diffManuscriptTexts('one two three', 'one two three').stats;
    const b = diffManuscriptTexts('alpha beta', 'alpha gamma').stats;
    const book = aggregateDiffStats([a, b]);
    expect(book.leftWords).toBe(a.leftWords + b.leftWords);
    expect(book.rightWords).toBe(a.rightWords + b.rightWords);
    expect(book.matchedWords).toBe(a.matchedWords + b.matchedWords);
    expect(book.missingFromScript).toBe(
      a.missingFromScript + b.missingFromScript,
    );
    expect(book.onlyInScript).toBe(a.onlyInScript + b.onlyInScript);
    expect(book.replacements).toBe(a.replacements + b.replacements);
    const denom = Math.max(book.leftWords, book.rightWords, 1);
    expect(book.similarityPct).toBe(
      Math.round((book.matchedWords / denom) * 1000) / 10,
    );
  });

  it('flags the known Chapter 2 missing passage on the ARC side', async () => {
    const { arcManuscriptForChapter } = await import(
      '@/data/arcManuscriptChapters'
    );
    const { manuscriptForChapter } = await import('@/data/audioManuscripts');
    const result = diffManuscriptTexts(
      arcManuscriptForChapter(2),
      scriptTextFromCues(manuscriptForChapter(2)),
    );
    const deleted = result.chunks
      .filter((c) => c.kind === 'delete' || c.kind === 'replace')
      .flatMap((c) => c.left.map((t) => t.key))
      .join(' ');
    expect(deleted).toContain('embedded');
    expect(result.stats.missingFromScript).toBeGreaterThan(0);
  });
});
