import type { BookInsight } from '@/data/bookInsightsPreview';

type BookInsightCardProps = {
  insight: BookInsight;
  featured?: boolean;
};

export function BookInsightCard({ insight, featured = false }: BookInsightCardProps) {
  const isVideo = insight.kind === 'video';

  return (
    <article
      className={`group relative flex flex-col overflow-hidden bg-cream ${
        featured
          ? 'aspect-[3/4] min-h-0'
          : 'min-h-[22rem] md:min-h-[26rem]'
      }`}
    >
      <a
        href={insight.href}
        className="absolute inset-0 z-10"
        aria-label={`${insight.ctaLabel}: ${insight.caption}`}
      >
        <span className="sr-only">{insight.ctaLabel}</span>
      </a>
      <div className="relative flex-1 overflow-hidden">
        <img
          src={insight.imageSrc}
          alt={insight.imageAlt}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/25 to-transparent"
          aria-hidden
        />
        {isVideo ? (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <span
              className={`flex items-center justify-center rounded-full border border-cream/40 bg-charcoal/35 backdrop-blur-[2px] ${
                featured ? 'h-10 w-10' : 'h-14 w-14'
              }`}
            >
              <span
                className={`ml-0.5 border-y-transparent border-l-cream ${
                  featured
                    ? 'border-y-[5px] border-l-[9px]'
                    : 'border-y-[7px] border-l-[12px]'
                }`}
              />
            </span>
          </div>
        ) : null}
        <div
          className={`absolute inset-x-0 bottom-0 z-[1] ${
            featured ? 'p-4' : 'p-5 md:p-6'
          }`}
        >
          <p
            className={`font-serif leading-snug text-cream ${
              featured ? 'text-base md:text-lg' : 'text-lg md:text-xl'
            }`}
          >
            {insight.caption}
          </p>
          <span className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/70 transition-colors group-hover:text-cream md:mt-4">
            {insight.ctaLabel}
            <span aria-hidden>↗</span>
          </span>
        </div>
      </div>
    </article>
  );
}
