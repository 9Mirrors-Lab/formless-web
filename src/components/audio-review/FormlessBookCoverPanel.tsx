import { useState } from 'react';

import { audioChapterStatusIcon } from '@/components/audio-review/audioStatusIcons';
import {
  AUDIO_BOOK,
  chapterProgressSummary,
  type AudioChapter,
  type AudioChapterStatus,
} from '@/data/audioReviewMock';

export type FormlessCoverDirection = {
  id: 'a' | 'b' | 'c' | 'd' | 'e';
  label: string;
  note: string;
  src: string;
};

export const FORMLESS_COVER_DIRECTIONS: FormlessCoverDirection[] = [
  {
    id: 'd',
    label: 'Sunset Dissolve',
    note: 'Dark dusk · form becoming particles',
    src: '/book-covers/formless-cover-d-sunset-dissolve.png',
  },
  {
    id: 'e',
    label: 'Particle Horizon',
    note: 'Abstract dissolve · no silhouette',
    src: '/book-covers/formless-cover-e-particle-horizon.png',
  },
  {
    id: 'a',
    label: 'Observer’s Eye',
    note: 'Moss field · awareness mark',
    src: '/book-covers/formless-cover-a-observers-eye.png',
  },
  {
    id: 'b',
    label: 'Cream Fog',
    note: 'Light cover · literary calm',
    src: '/book-covers/formless-cover-b-cream-fog.png',
  },
  {
    id: 'c',
    label: 'Void Light',
    note: 'Dark open · soft center',
    src: '/book-covers/formless-cover-c-void-light.png',
  },
];

type FormlessBookCoverPanelProps = {
  chapters: AudioChapter[];
};

type ProgressRowTone = 'recorded' | 'optimized' | 'approved';

const PROGRESS_ROW_FILL: Record<ProgressRowTone, string> = {
  recorded: 'bg-cream/55 border-cream/55',
  optimized: 'bg-[#9fb5aa]/70 border-[#9fb5aa]/70',
  approved: 'bg-[#9fb5aa] border-[#9fb5aa]',
};

const PROGRESS_ROW_STATUS: Record<ProgressRowTone, AudioChapterStatus> = {
  recorded: 'recorded',
  optimized: 'ready',
  approved: 'approved',
};

const PROGRESS_ROWS: Array<{
  label: string;
  tone: ProgressRowTone;
  key: 'recorded' | 'optimized' | 'approved';
}> = [
  { label: 'Recorded', tone: 'recorded', key: 'recorded' },
  { label: 'Optimized', tone: 'optimized', key: 'optimized' },
  { label: 'Approved', tone: 'approved', key: 'approved' },
];

/** Sidebar book identity: cover exploration + chapter recording progress. */
export function FormlessBookCoverPanel({ chapters }: FormlessBookCoverPanelProps) {
  const [coverId, setCoverId] = useState<FormlessCoverDirection['id']>('c');
  const cover =
    FORMLESS_COVER_DIRECTIONS.find((c) => c.id === coverId) ?? FORMLESS_COVER_DIRECTIONS[0]!;
  const summary = chapterProgressSummary(chapters);
  const counts = {
    recorded: summary.recorded,
    optimized: summary.optimized,
    approved: summary.approved,
  } as const;

  return (
    <div className="px-5 pb-4 pt-6">
      <div className="overflow-hidden rounded-xl border border-cream/12 bg-[#0c0f0d] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="relative h-[431px] w-full overflow-hidden">
          <img
            key={cover.src}
            src={cover.src}
            alt={`${AUDIO_BOOK.title} cover direction: ${cover.label}`}
            className="h-full w-full object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/35">Cover study</p>
        <div className="flex gap-1" role="tablist" aria-label="Book cover directions">
          {FORMLESS_COVER_DIRECTIONS.map((direction) => {
            const selected = direction.id === coverId;
            return (
              <button
                key={direction.id}
                type="button"
                role="tab"
                aria-selected={selected}
                title={direction.label}
                onClick={() => setCoverId(direction.id)}
                className={`h-6 min-w-6 rounded-full px-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  selected
                    ? 'bg-[#9fb5aa]/25 text-[#9fb5aa]'
                    : 'bg-cream/5 text-cream/35 hover:bg-cream/10 hover:text-cream/60'
                }`}
              >
                {direction.id}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <div
          className="flex h-[64px] w-[52px] shrink-0 flex-col items-center justify-center text-center leading-none"
          aria-label={`Approved ${summary.percent}% (${summary.approved} of ${summary.total})`}
        >
          <p className="font-sans text-xl font-medium text-cream">{summary.percent}%</p>
          <p className="mt-1 font-mono text-[9px] tabular-nums text-[#9fb5aa]">
            {summary.approved}/{summary.total}
          </p>
          <p className="mt-1 font-mono text-[7px] uppercase tracking-wider text-cream/35">
            approved
          </p>
        </div>

        <div
          className="grid min-w-0 flex-1 grid-cols-[5.75rem_minmax(0,1fr)_2.25rem] items-center gap-x-2 gap-y-1.5"
          role="group"
          aria-label="Chapter progress"
        >
          {PROGRESS_ROWS.map((row) => {
            const filled = counts[row.key];
            const safeTotal = Math.max(summary.total, 1);
            return (
              <div key={row.key} className="contents">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                    {audioChapterStatusIcon(PROGRESS_ROW_STATUS[row.tone], 'sm')}
                  </span>
                  <p className="truncate font-mono text-[9px] uppercase tracking-[0.12em] text-cream/40">
                    {row.label}
                  </p>
                </div>
                <div
                  className="flex min-w-0 items-center gap-[3px] overflow-hidden px-0.5"
                  role="img"
                  aria-label={`${row.label}: ${filled} of ${summary.total}`}
                >
                  {Array.from({ length: safeTotal }, (_, index) => {
                    const on = index < filled;
                    return (
                      <span
                        key={`${row.key}-${index}`}
                        className={`h-2.5 min-w-0 flex-1 -skew-x-[18deg] border ${
                          on
                            ? PROGRESS_ROW_FILL[row.tone]
                            : 'border-cream/15 bg-transparent'
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-right font-mono text-[10px] tabular-nums text-cream/45">
                  <span className="text-cream/75">{filled}</span>
                  <span className="text-cream/25">/{summary.total}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
