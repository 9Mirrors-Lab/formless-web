import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import { BookInsightCard } from '@/components/book/BookInsightCard';
import {
  BOOK_PREVIEW_CHAPTER,
  type BookInsight,
} from '@/data/bookInsightsPreview';

export type BookChapterSampleContent = {
  label: string;
  title: string;
  body: string;
  reflectionTitle: string;
  reflection: string;
  featured: {
    imageSrc: string;
    imageAlt: string;
    caption: string;
    href: string;
    ctaLabel: string;
  };
};

type BookChapterSampleSectionProps = {
  content?: BookChapterSampleContent;
  id?: string;
  className?: string;
};

/**
 * Droppable chapter sample: label, title, body, reflection, featured insight.
 * Cream editorial band; safe to place under dark sections like Amazon availability.
 */
export function BookChapterSampleSection({
  content = BOOK_PREVIEW_CHAPTER,
  id = 'book-chapter-sample',
  className = '',
}: BookChapterSampleSectionProps) {
  const featuredInsight: BookInsight = {
    id: 'chapter-featured',
    kind: 'video',
    imageSrc: content.featured.imageSrc,
    imageAlt: content.featured.imageAlt,
    caption: content.featured.caption,
    href: content.featured.href,
    ctaLabel: content.featured.ctaLabel,
  };

  return (
    <section
      id={id}
      className={`w-full bg-cream px-6 py-20 text-charcoal md:px-16 md:py-28 lg:px-24 ${className}`.trim()}
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-16">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-moss">
            {content.label}
          </p>
          <h2 className="mt-4 font-serif text-4xl italic leading-tight text-charcoal md:text-5xl">
            {content.title}
          </h2>
          <p className="mt-6 max-w-prose font-sans text-base leading-relaxed text-charcoal/70 md:text-lg">
            {content.body}
          </p>

          <aside className="mt-10 border border-charcoal/10 bg-[#f0ebe3] px-6 py-7 md:px-8 md:py-8">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
              {content.reflectionTitle}
            </p>
            <p className="mt-4 font-serif text-xl leading-snug text-charcoal md:text-2xl">
              {content.reflection}
            </p>
            <div className="mt-6 opacity-60" aria-hidden>
              <TeachingIconMark id="space" theme="light" size={32} />
            </div>
          </aside>
        </div>

        <BookInsightCard insight={featuredInsight} featured />
      </div>
    </section>
  );
}
