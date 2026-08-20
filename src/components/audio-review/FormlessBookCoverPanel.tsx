import { audioChapterStatusIcon } from '@/components/audio-review/audioStatusIcons';
import {
  AUDIO_BOOK,
  chapterProgressSummary,
  type AudioChapter,
  type AudioChapterStatus,
} from '@/data/audioBook';

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

/** Approved ACX square cover. Used on editorial / listen sidebars. */
export const FORMLESS_COVER = {
  id: 'audible',
  label: 'Audible',
  note: 'Approved square cover',
  src: '/book-covers/formless-audible.png',
} as const;

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

/** Compact sidebar identity: cover thumbnail + chapter progress. */
export function FormlessBookCoverPanel({ chapters }: FormlessBookCoverPanelProps) {
  const cover = FORMLESS_COVER;
  const summary = chapterProgressSummary(chapters);
  const counts = {
    recorded: summary.recorded,
    optimized: summary.optimized,
    approved: summary.approved,
  } as const;

  return (
    <div className="shrink-0 border-b border-cream/10 px-5 pb-4 pt-5">
      <div className="flex items-start gap-3.5">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-md border border-cream/12 bg-[#0c0f0d] shadow-[0_12px_28px_rgba(0,0,0,0.4)]">
          <img
            src={cover.src}
            alt={`${AUDIO_BOOK.title} cover`}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9fb5aa]/80">
            {AUDIO_BOOK.imprint}
          </p>
          <h1 className="mt-1 font-serif text-[1.65rem] italic leading-none text-cream">
            {AUDIO_BOOK.title}
          </h1>
          <p className="mt-1.5 truncate text-xs text-cream/45">{AUDIO_BOOK.author}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div
          className="flex w-[3.25rem] shrink-0 flex-col items-start leading-none"
          aria-label={`Approved ${summary.percent}% (${summary.approved} of ${summary.total})`}
        >
          <p className="font-sans text-lg font-medium tabular-nums text-cream">
            {summary.percent}%
          </p>
          <p className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-cream/35">
            approved
          </p>
        </div>

        <div
          className="flex min-w-0 flex-1 flex-col gap-1.5"
          role="group"
          aria-label="Chapter progress"
        >
          {PROGRESS_ROWS.map((row) => {
            const filled = counts[row.key];
            const safeTotal = Math.max(summary.total, 1);
            return (
              <div
                key={row.key}
                className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)_2rem] items-center gap-x-2"
              >
                <div className="flex min-w-0 items-center gap-1">
                  <span className="inline-flex h-3 w-3 shrink-0 items-center justify-center">
                    {audioChapterStatusIcon(PROGRESS_ROW_STATUS[row.tone], 'sm')}
                  </span>
                  <p className="truncate font-mono text-[8px] uppercase tracking-[0.1em] text-cream/40">
                    {row.label}
                  </p>
                </div>
                <div
                  className="flex min-w-0 items-center gap-[2px] overflow-hidden"
                  role="img"
                  aria-label={`${row.label}: ${filled} of ${summary.total}`}
                >
                  {Array.from({ length: safeTotal }, (_, index) => {
                    const on = index < filled;
                    return (
                      <span
                        key={`${row.key}-${index}`}
                        className={`h-1.5 min-w-0 flex-1 -skew-x-[18deg] border ${
                          on
                            ? PROGRESS_ROW_FILL[row.tone]
                            : 'border-cream/15 bg-transparent'
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-right font-mono text-[9px] tabular-nums text-cream/45">
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
