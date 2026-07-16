import { ArrowLeft } from 'lucide-react';

type ClientReviewBannerProps = {
  title: string;
  status: 'reference' | 'experiment' | 'live';
  note: string;
  backHref?: string;
};

const STATUS_STYLES = {
  reference: 'border-cream/20 bg-charcoal/80 text-cream/70',
  experiment: 'border-clay/35 bg-clay/10 text-clay',
  live: 'border-moss/35 bg-moss/10 text-moss',
} as const;

const STATUS_LABELS = {
  reference: 'Archived reference',
  experiment: 'In review',
  live: 'Live',
} as const;

export function ClientReviewBanner({
  title,
  status,
  note,
  backHref = '/client/review',
}: ClientReviewBannerProps) {
  return (
    <div
      className="relative z-30 border-b border-cream/10 bg-[#070806]/95 px-6 py-4 backdrop-blur md:px-16 lg:px-24"
      role="note"
      aria-label="Design review context"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={backHref}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50 transition-colors hover:text-cream"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Design review
            </a>
            <span
              className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] ${STATUS_STYLES[status]}`}
            >
              {STATUS_LABELS[status]}
            </span>
          </div>
          <p className="mt-2 font-sans text-sm font-medium text-cream">{title}</p>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-cream/55">{note}</p>
        </div>
        <a
          href="/"
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-cream/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/70 transition-colors hover:border-cream/30 hover:text-cream"
        >
          Live home
        </a>
      </div>
    </div>
  );
}
