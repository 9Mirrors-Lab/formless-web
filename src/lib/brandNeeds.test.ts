import { describe, expect, it } from 'vitest';

import { ACKNOWLEDGMENTS_RERECORD } from '@/data/audioRecordSessions';
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
  it('leads with author re-records from Record Sessions', () => {
    const needs = collectBrandNeeds([ACKNOWLEDGMENTS_RERECORD], []);
    expect(needs[0]).toMatchObject({
      sentence: 'Author needs to re-record Acknowledgments.',
      href: '/audio/record-sessions#re-record',
      door: 'Record Sessions',
    });
  });

  it('does not also ask for a take when that track already has a re-record script', () => {
    const needs = collectBrandNeeds(
      [ACKNOWLEDGMENTS_RERECORD],
      [record(12, 'not-recorded')],
    );
    expect(needs).toHaveLength(1);
    expect(needs[0].sentence).toMatch(/Acknowledgments/);
  });

  it('names a single unpublished master and sign-off work', () => {
    const needs = collectBrandNeeds(
      [],
      [record(1, 'mastered'), record(2, 'published'), record(3, 'published')],
    );
    expect(needs.map((need) => need.sentence)).toEqual([
      'The Feeling of Wholeness has a local master that is not published yet.',
      '2 published chapters still need sign-off.',
    ]);
  });

  it('returns nothing when the book is signed off and no scripts are open', () => {
    expect(collectBrandNeeds([], [record(1, 'approved')])).toEqual([]);
  });
});
