/**
 * Studio file catalog for editorial2.
 *
 * Live published files are Drive bytes plus `audiobook_tracks` pointers
 * (original m4a in Published-Originals, optimized MP3 in ACX-Masters).
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
 *
 * ACX masters live in `masters/`. Restoration keepers (restored AIFF/WAV, NR
 * passes) live in `masters/restoration/`. Scratch (source copies, loudnorm,
 * restored_full) stays in `.cache/audiobook-takes/`.
 */
export const STUDIO_LOCAL_ROOTS = {
  aup3: '',
  wavExport: 'need-to-master',
  acxMaster: 'masters',
  restoration: 'masters/restoration',
  retailSample: 'masters/02_Introduction_retail_acx_master.mp3',
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
    wavExportPath: `${STUDIO_LOCAL_ROOTS.wavExport}/04_Chapter 2.wav`,
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/04_Chapter_2_acx_master.mp3`,
  },
  3: {
    wavExportPath: `${STUDIO_LOCAL_ROOTS.wavExport}/05_Chapter 3.wav`,
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/05_Chapter_3_acx_master.mp3`,
  },
  4: {
    wavExportPath: `${STUDIO_LOCAL_ROOTS.wavExport}/06_Chapter 4.wav`,
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/06_Chapter_4_acx_master.mp3`,
  },
  5: {
    wavExportPath: `${STUDIO_LOCAL_ROOTS.wavExport}/07_Chapter 5.wav`,
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/07_Chapter_5_acx_master.mp3`,
  },
  6: {
    wavExportPath: `${STUDIO_LOCAL_ROOTS.wavExport}/08_Chapter 6.wav`,
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/08_Chapter_6_acx_master.mp3`,
  },
  7: {
    wavExportPath: `${STUDIO_LOCAL_ROOTS.wavExport}/09_Chapter 7.wav`,
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/09_Chapter_7_acx_master.mp3`,
  },
  8: {
    wavExportPath: `${STUDIO_LOCAL_ROOTS.wavExport}/10_Chapter 8.wav`,
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/10_Chapter_8_acx_master.mp3`,
  },
  9: {
    wavExportPath: `${STUDIO_LOCAL_ROOTS.wavExport}/11_Chapter 9.wav`,
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/11_Chapter_9_acx_master.mp3`,
  },
  12: {
    acxMasterPath: `${STUDIO_LOCAL_ROOTS.acxMaster}/12_Acknowledgments_acx_master.mp3`,
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
