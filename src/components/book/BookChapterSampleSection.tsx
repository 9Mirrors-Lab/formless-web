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
 * Dark editorial band that sits with the book page shell.
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
      className={`w-full border-t border-cream/8 px-6 py-12 text-cream md:px-16 md:py-16 lg:px-24 ${className}`.trim()}
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-start lg:gap-12">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-moss">
            {content.label}
          </p>
          <h2 className="mt-3 font-serif text-3xl italic leading-tight text-cream md:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 max-w-prose font-sans text-base leading-relaxed text-cream/60 md:text-lg">
            {content.body}
          </p>

          <aside className="mt-8 border border-cream/10 bg-cream/[0.04] px-5 py-5 md:px-6 md:py-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
              {content.reflectionTitle}
            </p>
            <p className="mt-3 font-serif text-lg leading-snug text-cream/90 md:text-xl">
              {content.reflection}
            </p>
            <div className="mt-5 opacity-60" aria-hidden>
              <TeachingIconMark id="space" theme="dark" size={28} />
            </div>
          </aside>
        </div>

        <div className="mx-auto w-full max-w-[14.5rem] lg:mx-0 lg:justify-self-end lg:max-w-[15rem]">
          <BookInsightCard insight={featuredInsight} featured />
        </div>
      </div>
    </section>
  );
}
