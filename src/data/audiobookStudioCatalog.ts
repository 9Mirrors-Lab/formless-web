/**
 * Studio file catalog for editorial2.
 *
 * Live published files come from `audiobook_tracks` (original WAV + optimized MP3).
 * Local versions (Audacity .aup3, ACX master) live here until those folders are wired.
 * Paste roots on STUDIO_LOCAL_ROOTS when you have the disk locations.
 */

import { AUDIO_LISTEN_ORDER, type AudioChapterId } from '@/data/audioBook';
import {
  acxMasterPathFromRun,
  masterTrackRunFor,
} from '@/data/audioMasterPhaseRuns';
import {
  emptyStudioEvidence,
  resolveStudioRung,
  studioRungById,
  studioRungStates,
  type StudioLadderEvidence,
  type StudioRung,
  type StudioRungId,
  type StudioRungState,
} from '@/data/studioLadder';
import type { AudiobookTrack } from '@/lib/audiobookTracks';

/**
 * Local working folders. Leave a root empty until the folder is known.
 * Paths are project-relative from formless-web unless they start with `/`.
 */
export const STUDIO_LOCAL_ROOTS = {
  aup3: '',
  wavExport: 'need-to-master',
  acxMaster: '.cache/audiobook-takes',
  retailSample: '.cache/audiobook-takes/02_Introduction_retail_acx_master.mp3',
} as const;

export type StudioLocalArtifact = {
  aup3Path?: string;
  wavExportPath?: string;
  acxMasterPath?: string;
};

const LOCAL_ARTIFACTS: Partial<Record<AudioChapterId, StudioLocalArtifact>> = {
  13: {
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/01_Opening_Credits_2_acx_master.mp3`,
  },
  0: {
    wavExportPath: `${STUDIO_LOCAL_ROOTS.wavExport}/02_Introduction.wav`,
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/02_Introduction_acx_master.mp3`,
  },
  1: {
    wavExportPath: `${STUDIO_LOCAL_ROOTS.wavExport}/03_Chapter 1.wav`,
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/03_Chapter_1_acx_master.mp3`,
  },
  2: {
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/04_Chapter_2_acx_master.mp3`,
  },
};

export type StudioChapterRecord = {
  chapterId: number;
  current: StudioRungId;
  currentRung: StudioRung;
  evidence: StudioLadderEvidence;
  states: Record<StudioRungId, StudioRungState>;
  local: StudioLocalArtifact;
  originalFilename: string | null;
  optimizedFilename: string | null;
};

function localFor(chapterId: number): StudioLocalArtifact {
  if (chapterId in LOCAL_ARTIFACTS) {
    return LOCAL_ARTIFACTS[chapterId as AudioChapterId] ?? {};
  }
  return {};
}

export function studioEvidenceForChapter(
  chapterId: number,
  tracks: AudiobookTrack[],
  approvedIds: ReadonlySet<number>,
): StudioLadderEvidence {
  const chapterTracks = tracks.filter((track) => track.chapterNumber === chapterId);
  const original = chapterTracks.find((track) => track.source === 'original');
  const optimized = chapterTracks.find((track) => track.source === 'optimized');
  const local = localFor(chapterId);
  const run = masterTrackRunFor(chapterId);
  const acxFromRun = acxMasterPathFromRun(run);

  return {
    hasAup3: Boolean(local.aup3Path),
    hasOriginalWav: Boolean(original) || Boolean(local.wavExportPath),
    hasAcxMaster:
      Boolean(local.acxMasterPath) ||
      Boolean(acxFromRun) ||
      run.status === 'ready-for-final-qc',
    hasPublishedOptimized: Boolean(optimized),
    isApproved: approvedIds.has(chapterId),
  };
}

export function studioChapterRecord(
  chapterId: number,
  tracks: AudiobookTrack[],
  approvedIds: ReadonlySet<number>,
): StudioChapterRecord {
  const evidence = studioEvidenceForChapter(chapterId, tracks, approvedIds);
  const current = resolveStudioRung(evidence);
  const chapterTracks = tracks.filter((track) => track.chapterNumber === chapterId);
  const original = chapterTracks.find((track) => track.source === 'original');
  const optimized = chapterTracks.find((track) => track.source === 'optimized');

  return {
    chapterId,
    current,
    currentRung: studioRungById(current),
    evidence,
    states: studioRungStates(current, evidence),
    local: localFor(chapterId),
    originalFilename: original?.originalFilename ?? null,
    optimizedFilename: optimized?.originalFilename ?? null,
  };
}

export function studioCatalogForTracks(
  tracks: AudiobookTrack[],
  approvedIds: ReadonlySet<number>,
): StudioChapterRecord[] {
  return AUDIO_LISTEN_ORDER.map((id) =>
    studioChapterRecord(id, tracks, approvedIds),
  );
}

export function studioBookProgress(records: StudioChapterRecord[]) {
  const total = records.length;
  const counts = {
    'not-recorded': 0,
    'session-saved': 0,
    'original-wav': 0,
    mastered: 0,
    published: 0,
    approved: 0,
  } satisfies Record<StudioRungId, number>;

  for (const record of records) {
    counts[record.current] += 1;
  }

  const towardAudible = records.filter((record) => {
    return (
      record.current === 'published' ||
      record.current === 'approved' ||
      record.current === 'mastered'
    );
  }).length;

  return {
    total,
    counts,
    towardAudible,
    percent: total === 0 ? 0 : Math.round((counts.approved / total) * 100),
  };
}

export { emptyStudioEvidence };
