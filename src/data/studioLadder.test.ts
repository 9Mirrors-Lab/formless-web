import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveEditorialBookCoverEnabled } from '@/config/featureFlags';
import {
  emptyStudioEvidence,
  resolveStudioRung,
  STUDIO_RUNGS,
  studioRungNeedsCompanion,
  studioRungStates,
} from '@/data/studioLadder';

describe('studioLadder', () => {
  it('starts at not recorded when nothing exists', () => {
    expect(resolveStudioRung(emptyStudioEvidence())).toBe('not-recorded');
  });

  it('climbs the file ladder toward Audible', () => {
    expect(
      resolveStudioRung({ ...emptyStudioEvidence(), hasAup3: true }),
    ).toBe('session-saved');
    expect(
      resolveStudioRung({ ...emptyStudioEvidence(), hasOriginalWav: true }),
    ).toBe('original-wav');
    expect(
      resolveStudioRung({ ...emptyStudioEvidence(), hasAcxMaster: true }),
    ).toBe('mastered');
    expect(
      resolveStudioRung({
        ...emptyStudioEvidence(),
        hasPublishedOptimized: true,
      }),
    ).toBe('published');
    expect(
      resolveStudioRung({ ...emptyStudioEvidence(), isApproved: true }),
    ).toBe('approved');
  });

  it('marks session saved as skipped when a later rung exists without an aup3', () => {
    const evidence = {
      ...emptyStudioEvidence(),
      hasOriginalWav: true,
    };
    const states = studioRungStates(resolveStudioRung(evidence), evidence);
    expect(states['session-saved']).toBe('skipped');
    expect(states['original-wav']).toBe('current');
    expect(states['not-recorded']).toBe('complete');
  });

  it('keeps companion for early rungs only', () => {
    expect(studioRungNeedsCompanion('not-recorded')).toBe(true);
    expect(studioRungNeedsCompanion('session-saved')).toBe(true);
    expect(studioRungNeedsCompanion('published')).toBe(false);
  });

  it('gives each rung a unique short HUD label', () => {
    const shorts = STUDIO_RUNGS.map((rung) => rung.short);
    expect(new Set(shorts).size).toBe(STUDIO_RUNGS.length);
  });
});

describe('resolveEditorialBookCoverEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is off by default', () => {
    expect(resolveEditorialBookCoverEnabled('')).toBe(false);
  });

  it('turns on from the query string', () => {
    expect(resolveEditorialBookCoverEnabled('?editorialBookCover=1')).toBe(true);
    expect(resolveEditorialBookCoverEnabled('?editorialBookCover=0')).toBe(false);
  });
});
