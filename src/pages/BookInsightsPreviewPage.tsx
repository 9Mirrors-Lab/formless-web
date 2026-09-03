import { PageLayout } from '../components/PageLayout';
import { BookHeroPurchasePanel } from '../components/BookHeroPurchasePanel';
import { BookAvailabilitySection } from '../components/BookAvailabilitySection';
import { BookFromSoniSection } from '@/components/book/BookFromSoniSection';
import { BookPullQuoteSection } from '@/components/book/BookPullQuoteSection';
import { BookChapterSampleSection } from '@/components/book/BookChapterSampleSection';
import { BookMoreFromSoniSection } from '@/components/book/BookMoreFromSoniSection';

/**
 * THESIS: Modular book editorial blocks (From Soni, quote, chapter, more) for drop-in use; no atmospheric hero.
 * OWN-WORLD: Formless moss/clay/cream/charcoal; cream editorial bands; insight tiles as social doors.
 * STORY: Meet From Soni → land a quote → sample a chapter reflection → see more → buy when ready.
 * FIRST VIEWPORT: Preview banner, then From Soni grid.
 * FORM: Droppable section components; Chapter 4 also lives on /book under Amazon availability.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
 */
export default function BookInsightsPreviewPage() {
  return (
    <PageLayout>
      <div className="bg-cream text-charcoal">
        <div className="border-b border-charcoal/10 bg-moss px-6 py-3 text-center md:px-16">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-cream/80">
            Design preview · modular sections · Instagram stills are placeholders
          </p>
        </div>

        <BookFromSoniSection trackLocation="book_preview_from_soni" />
        <BookPullQuoteSection />
        <BookChapterSampleSection />
        <BookMoreFromSoniSection trackLocation="book_preview_more" />

        <section className="w-full bg-charcoal text-cream">
          <div className="px-6 py-16 md:px-16 md:py-24 lg:px-24">
            <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-16">
              <div>
                <h2 className="font-serif text-3xl italic leading-tight md:text-4xl">
                  Formless is the doorway.
                </h2>
                <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-cream/60">
                  Start with the book when you are ready. The teaching on Instagram and the practice
                  on the site stay open either way.
                </p>
              </div>
              <BookHeroPurchasePanel trackLocation="book_preview_purchase" />
            </div>
          </div>
          <BookAvailabilitySection eyebrow="Available on" title="One book. Three ways in." />
        </section>
      </div>
    </PageLayout>
  );
}
