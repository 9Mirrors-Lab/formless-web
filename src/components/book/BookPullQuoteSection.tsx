import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import { BOOK_PREVIEW_QUOTE } from '@/data/bookInsightsPreview';

type BookPullQuoteSectionProps = {
  text?: string;
  attribution?: string;
  className?: string;
};

/** Droppable centered pull-quote band. */
export function BookPullQuoteSection({
  text = BOOK_PREVIEW_QUOTE.text,
  attribution = BOOK_PREVIEW_QUOTE.attribution,
  className = '',
}: BookPullQuoteSectionProps) {
  return (
    <section
      className={`w-full bg-[#ddd5c8] px-6 py-20 text-charcoal md:px-16 md:py-28 lg:px-24 ${className}`.trim()}
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="font-serif text-5xl leading-none text-charcoal/25" aria-hidden>
          “
        </span>
        <blockquote className="mt-2 font-serif text-2xl italic leading-snug text-charcoal md:text-4xl">
          {text}
        </blockquote>
        <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-charcoal/55">
          — {attribution}
        </p>
        <div className="mt-8 flex justify-center opacity-60" aria-hidden>
          <TeachingIconMark id="space" theme="light" size={40} />
        </div>
      </div>
    </section>
  );
}
