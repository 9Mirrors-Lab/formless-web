import { ParticleButton } from '@/components/ParticleButton';
import { BookInsightCard } from '@/components/book/BookInsightCard';
import {
  BOOK_PREVIEW_FROM_SONI,
  BOOK_PREVIEW_INSIGHTS,
  type BookInsight,
} from '@/data/bookInsightsPreview';

type BookFromSoniSectionProps = {
  title?: string;
  lede?: string;
  insights?: BookInsight[];
  viewAllLabel?: string;
  viewAllHref?: string;
  trackLocation?: string;
  id?: string;
  className?: string;
};

/** Droppable From Soni Instagram insights grid. */
export function BookFromSoniSection({
  title = BOOK_PREVIEW_FROM_SONI.title,
  lede = BOOK_PREVIEW_FROM_SONI.lede,
  insights = BOOK_PREVIEW_INSIGHTS,
  viewAllLabel = BOOK_PREVIEW_FROM_SONI.viewAllLabel,
  viewAllHref = BOOK_PREVIEW_FROM_SONI.viewAllHref,
  trackLocation = 'book_from_soni',
  id = 'from-soni',
  className = '',
}: BookFromSoniSectionProps) {
  const [videoInsight, quoteInsight, imageInsight] = insights;

  return (
    <section
      id={id}
      className={`w-full bg-cream px-6 py-20 text-charcoal md:px-16 md:py-28 lg:px-24 ${className}`.trim()}
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.32em] text-moss">
            {title}
          </h2>
          <p className="mt-4 font-serif text-3xl italic leading-tight text-charcoal md:text-4xl">
            {lede}
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {videoInsight ? (
            <div className="md:translate-y-6">
              <BookInsightCard insight={videoInsight} />
            </div>
          ) : null}
          {quoteInsight ? (
            <div className="relative overflow-hidden">
              <img
                src={quoteInsight.imageSrc}
                alt={quoteInsight.imageAlt}
                decoding="async"
                className="min-h-[22rem] w-full object-cover object-center md:min-h-[26rem]"
              />
              <a
                href={quoteInsight.href}
                className="absolute inset-0"
                aria-label={quoteInsight.ctaLabel}
              />
            </div>
          ) : null}
          {imageInsight ? (
            <div className="md:-translate-y-4">
              <BookInsightCard insight={imageInsight} />
            </div>
          ) : null}
        </div>

        <div className="mt-12 flex justify-center">
          <ParticleButton
            href={viewAllHref}
            variant="secondary"
            trackLocation={trackLocation}
            trackLabel={viewAllLabel}
            className="rounded-none border-charcoal/25 px-10"
          >
            {viewAllLabel}
          </ParticleButton>
        </div>
      </div>
    </section>
  );
}
