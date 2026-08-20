import { describe, expect, it } from 'vitest';

import {
  MANUSCRIPT_FINDINGS,
  formatFindingClock,
  manuscriptDiffFindings,
  ryanNeedsManuscriptFindings,
  trackCueWindow,
} from '@/data/audioManuscriptFindings';

describe('audioManuscriptFindings', () => {
  it('keeps the Chapter 9 productivity finding tied to its record session', () => {
    const finding = MANUSCRIPT_FINDINGS.find(
      (row) => row.id === 'ch9-productivity-rush',
    );
    expect(finding?.sessionId).toBe('chapter-9-productivity');
    expect(finding?.kind).toBe('delivery');
  });

  it('lists alignment diffs with structured book places and seek clocks', () => {
    const diffs = manuscriptDiffFindings();
    expect(diffs.every((row) => row.kind !== 'delivery')).toBe(true);
    expect(diffs.length).toBeGreaterThanOrEqual(5);
    for (const row of diffs) {
      expect(row.finalPlace.chapter.length).toBeGreaterThan(3);
      expect(row.finalPlace.landmark.length).toBeGreaterThan(8);
      expect(row.trackFile.length).toBeGreaterThan(3);
      expect(row.trackEndSeconds).toBeGreaterThan(row.trackStartSeconds);
      expect(formatFindingClock(row)).toMatch(/\d+:\d{2}–\d+:\d{2}/);
      expect(row.finalScriptWhere).toMatch(/Final script/);
      expect(row.audioTrack).toMatch(/Audio track/);
    }
  });

  it('builds a read-along cue window around Chapter 2’s jump', () => {
    const finding = MANUSCRIPT_FINDINGS.find((row) => row.id === 'ch2-story-embedded');
    expect(finding).toBeTruthy();
    const cues = trackCueWindow(finding!);
    expect(cues.manuscript.length).toBeGreaterThan(0);
    expect(cues.before.some((cue) => /bundle of thoughts/i.test(cue.text))).toBe(true);
    expect(cues.after.some((cue) => /more I believed/i.test(cue.text))).toBe(true);
  });

  it('limits Ryan Needs to findings that already have a re-record session', () => {
    const ryan = ryanNeedsManuscriptFindings();
    expect(ryan).toHaveLength(1);
    expect(ryan[0]?.id).toBe('ch9-productivity-rush');
  });
});
