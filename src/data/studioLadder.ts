/** Studio file ladder: one chapter’s path from silence to Audible sign-off. */

export const STUDIO_RUNG_IDS = [
  'not-recorded',
  'session-saved',
  'original-wav',
  'mastered',
  'published',
  'approved',
] as const;

export type StudioRungId = (typeof STUDIO_RUNG_IDS)[number];

export type StudioRungState = 'complete' | 'current' | 'upcoming' | 'skipped';

export type StudioRung = {
  id: StudioRungId;
  label: string;
  short: string;
  truth: string;
  proof: string;
};

export const STUDIO_RUNGS: readonly StudioRung[] = [
  {
    id: 'not-recorded',
    label: 'Not recorded',
    short: 'Rec',
    truth: 'No take yet',
    proof: 'Nothing on disk or in the catalog',
  },
  {
    id: 'session-saved',
    label: 'Session saved',
    short: 'Sess',
    truth: '.aup3 exists',
    proof: 'Audacity project registered for this chapter',
  },
  {
    id: 'original-wav',
    label: 'Original WAV',
    short: 'WAV',
    truth: 'Exported WAV is the working source',
    proof: 'Published original in audiobook_tracks',
  },
  {
    id: 'mastered',
    label: 'Mastered',
    short: 'Mast',
    truth: 'Local ACX MP3 exists',
    proof: 'Ready for Final QC',
  },
  {
    id: 'published',
    label: 'Published',
    short: 'Pub',
    truth: 'Optimized MP3 is in Supabase',
    proof: 'audiobook_tracks source = optimized',
  },
  {
    id: 'approved',
    label: 'Approved',
    short: 'OK',
    truth: 'You signed off',
    proof: 'Chapter cleared for Audible upload',
  },
] as const;

export type StudioLadderEvidence = {
  hasAup3: boolean;
  hasOriginalWav: boolean;
  hasAcxMaster: boolean;
  hasPublishedOptimized: boolean;
  isApproved: boolean;
};

export function emptyStudioEvidence(): StudioLadderEvidence {
  return {
    hasAup3: false,
    hasOriginalWav: false,
    hasAcxMaster: false,
    hasPublishedOptimized: false,
    isApproved: false,
  };
}

export function resolveStudioRung(evidence: StudioLadderEvidence): StudioRungId {
  if (evidence.isApproved) return 'approved';
  if (evidence.hasPublishedOptimized) return 'published';
  if (evidence.hasAcxMaster) return 'mastered';
  if (evidence.hasOriginalWav) return 'original-wav';
  if (evidence.hasAup3) return 'session-saved';
  return 'not-recorded';
}

export function studioRungIndex(id: StudioRungId): number {
  return STUDIO_RUNG_IDS.indexOf(id);
}

export function studioRungById(id: StudioRungId): StudioRung {
  const rung = STUDIO_RUNGS.find((item) => item.id === id);
  if (!rung) {
    throw new Error(`Unknown studio rung: ${id}`);
  }
  return rung;
}

export function studioRungStates(
  current: StudioRungId,
  evidence: StudioLadderEvidence,
): Record<StudioRungId, StudioRungState> {
  const currentIndex = studioRungIndex(current);
  const states = {} as Record<StudioRungId, StudioRungState>;

  for (const id of STUDIO_RUNG_IDS) {
    const index = studioRungIndex(id);
    if (
      id === 'session-saved' &&
      !evidence.hasAup3 &&
      currentIndex > studioRungIndex('session-saved')
    ) {
      states[id] = 'skipped';
      continue;
    }
    if (index < currentIndex) {
      states[id] = 'complete';
      continue;
    }
    if (index === currentIndex) {
      states[id] = 'current';
      continue;
    }
    states[id] = 'upcoming';
  }

  return states;
}

export function studioRungNeedsCompanion(current: StudioRungId): boolean {
  return current === 'not-recorded' || current === 'session-saved';
}
