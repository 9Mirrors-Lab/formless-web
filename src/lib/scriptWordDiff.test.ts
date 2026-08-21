import { describe, expect, it } from 'vitest';

import {
  diffManuscriptTexts,
  normalizeWordKey,
  scriptTextFromCues,
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
