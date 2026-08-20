import { describe, expect, it } from 'vitest';

import { CHAPTER_9_PRODUCTIVITY_PUNCH } from '@/data/audioRecordSessions';
import {
  emptyStudioEvidence,
  studioRungById,
  studioRungStates,
  type StudioRungId,
} from '@/data/studioLadder';
import type { StudioChapterRecord } from '@/data/audiobookStudioCatalog';
import { collectBrandNeeds } from '@/lib/brandNeeds';

function record(chapterId: number, current: StudioRungId): StudioChapterRecord {
  const evidence = emptyStudioEvidence();
  return {
    chapterId,
    current,
    currentRung: studioRungById(current),
    evidence,
    states: studioRungStates(current, evidence),
    local: {},
    originalFilename: null,
    optimizedFilename: null,
  };
}

describe('collectBrandNeeds', () => {
  it('leads with manuscript comparison results for open re-records', () => {
    const needs = collectBrandNeeds([CHAPTER_9_PRODUCTIVITY_PUNCH], []);
    expect(needs[0]).toMatchObject({
      sentence:
        'Chapter 9 manuscript: “productivity” is rushed at 2:32 in the source take.',
      href: '/audio/record-sessions#chapter-9-productivity',
      door: 'Record Sessions',
    });
    expect(needs.map((need) => need.sentence)).not.toContain(
      'Author needs to re-record Chapter 9 · productivity.',
    );
  });

  it('still lists a re-record when there is no manuscript finding for it', () => {
    const credits: typeof CHAPTER_9_PRODUCTIVITY_PUNCH = {
      ...CHAPTER_9_PRODUCTIVITY_PUNCH,
      id: 'closing-credits',
      track: 'Closing Credits',
    };
    const needs = collectBrandNeeds([credits], [], []);
    expect(needs[0]).toMatchObject({
      sentence: 'Author needs to re-record Closing Credits.',
      href: '/audio/record-sessions#closing-credits',
      door: 'Record Sessions',
    });
  });

  it('does not also ask for a take when that track already has a re-record script', () => {
    const livingFreedom: typeof CHAPTER_9_PRODUCTIVITY_PUNCH = {
      ...CHAPTER_9_PRODUCTIVITY_PUNCH,
      track: 'Living in Freedom',
    };
    const needs = collectBrandNeeds(
      [livingFreedom],
      [record(9, 'not-recorded')],
    );
    expect(needs).toHaveLength(1);
    expect(needs[0].sentence).toMatch(/productivity/);
  });

  it('names a single unpublished master and sign-off work', () => {
    const needs = collectBrandNeeds(
      [],
      [record(1, 'mastered'), record(2, 'published'), record(3, 'published')],
      [],
    );
    expect(needs.map((need) => need.sentence)).toEqual([
      'The Feeling of Wholeness has a local master that is not published yet.',
      '2 published chapters still need sign-off.',
    ]);
  });

  it('returns nothing when the book is signed off and no scripts are open', () => {
    expect(collectBrandNeeds([], [record(1, 'approved')], [])).toEqual([]);
  });
});
