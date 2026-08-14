import {
  BadgeCheck,
  Cloud,
  Disc3,
  FileAudio,
  Folder,
  Minus,
} from 'lucide-react';
import type { ReactNode } from 'react';

import type { StudioChapterRecord } from '@/data/audiobookStudioCatalog';
import {
  STUDIO_RUNGS,
  type StudioRungId,
  type StudioRungState,
} from '@/data/studioLadder';

const ICON_STROKE = 2;

export function rungIcon(id: StudioRungId, className: string): ReactNode {
  switch (id) {
    case 'not-recorded':
      return <Minus size={12} strokeWidth={ICON_STROKE} className={className} />;
    case 'session-saved':
      return <Folder size={12} strokeWidth={ICON_STROKE} className={className} />;
    case 'original-wav':
      return <FileAudio size={12} strokeWidth={ICON_STROKE} className={className} />;
    case 'mastered':
      return <Disc3 size={12} strokeWidth={ICON_STROKE} className={className} />;
    case 'published':
      return <Cloud size={12} strokeWidth={ICON_STROKE} className={className} />;
    case 'approved':
      return <BadgeCheck size={12} strokeWidth={ICON_STROKE} className={className} />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export function tickClass(state: StudioRungState): string {
  switch (state) {
    case 'complete':
      return 'border-[#9fb5aa] bg-[#9fb5aa] text-[#0c0f0d]';
    case 'current':
      return 'studio-tick-current border-cream bg-cream text-[#0c0f0d]';
    case 'skipped':
      return 'studio-tick-skipped border-cream/50 bg-transparent text-cream/70';
    case 'upcoming':
      return 'border-cream/20 bg-transparent text-cream/30';
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

function stateSpoken(state: StudioRungState): string {
  switch (state) {
    case 'complete':
      return 'done';
    case 'current':
      return 'here';
    case 'skipped':
      return 'skipped';
    case 'upcoming':
      return 'not yet';
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

export function studioRungExplain(id: StudioRungId, state: StudioRungState): string {
  const rung = STUDIO_RUNGS.find((item) => item.id === id);
  const skippedNote =
    id === 'session-saved' && state === 'skipped'
      ? 'No Audacity project on file. Later rungs still count.'
      : null;
  const parts = [
    `${rung?.label ?? id}: ${stateSpoken(state)}.`,
    skippedNote ?? rung?.truth,
  ];
  return parts.filter(Boolean).join(' ');
}

type StudioRungTickProps = {
  id: StudioRungId;
  state: StudioRungState;
};

export function StudioRungTick({ id, state }: StudioRungTickProps) {
  return (
    <span
      className={`relative inline-flex h-2.5 w-2.5 rounded-full border ${tickClass(state)}`}
      aria-hidden
    />
  );
}

type StudioRungEvidenceProps = {
  record: StudioChapterRecord;
};

export function StudioRungEvidence({ record }: StudioRungEvidenceProps) {
  return (
    <div className="min-w-0 max-w-xl">
      <p className="text-[15px] font-medium tracking-tight text-cream">
        {record.currentRung.label}
      </p>
      <p className="mt-1 text-[13px] leading-snug text-cream/50">
        {record.currentRung.truth}
      </p>
    </div>
  );
}
