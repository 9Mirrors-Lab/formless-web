import { FORMLESS_BOOK_COVER } from '@/data/bookCover';
import {
  AMAZON_PURCHASE_CTA,
  PREORDER_FACTS,
  kindlePreorderHref,
} from '@/data/preorderLanding';
import { captureCtaClick } from '@/lib/analytics';

type BookHeroPurchasePanelProps = {
  trackLocation?: string;
  formatsHref?: string;
  eyebrow?: string;
  title?: string;
  ctaLabel?: string;
};

const DEFAULT_EYEBROW = 'Out now';
const DEFAULT_TITLE = 'Start reading today.';

export function BookHeroPurchasePanel({
  trackLocation = 'book_hero_purchase',
  formatsHref = '#book-availability',
  eyebrow,
  title,
  ctaLabel,
}: BookHeroPurchasePanelProps) {
  const href = kindlePreorderHref();
  const factsLine = `Amazon · ${PREORDER_FACTS.price} · ${PREORDER_FACTS.format}`;
  const resolvedEyebrow = eyebrow?.trim() || DEFAULT_EYEBROW;
  const resolvedTitle = title?.trim() || DEFAULT_TITLE;
  const resolvedCta = ctaLabel?.trim() || AMAZON_PURCHASE_CTA;

  return (
    <aside
      className="book-purchase-panel rounded-2xl border border-cream/15 bg-cream/[0.06] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8 md:p-10"
      aria-label="Buy Formless on Amazon"
    >
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <img
          src={FORMLESS_BOOK_COVER.src}
          alt={FORMLESS_BOOK_COVER.alt}
          width={FORMLESS_BOOK_COVER.width}
          height={FORMLESS_BOOK_COVER.height}
          decoding="async"
          className="aspect-[5/8] h-auto w-[7.5rem] shrink-0 object-contain shadow-[0_18px_40px_rgba(0,0,0,0.42)] sm:w-[8.5rem] md:w-[9.5rem]"
        />

        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-cream/90">
            {resolvedEyebrow}
          </p>
          <p className="mt-3 font-serif text-[1.45rem] italic leading-[1.2] text-cream md:text-[1.65rem]">
            {resolvedTitle}
          </p>
          <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-clay">
            {factsLine}
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => captureCtaClick(resolvedCta, href, trackLocation)}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-clay px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-cream transition-transform duration-200 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/50"
          >
            {resolvedCta}
          </a>
          <a
            href={formatsHref}
            className="mt-4 inline-flex min-h-11 items-center font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50 transition-colors duration-200 hover:text-cream/80"
          >
            See all formats
            <span className="sr-only"> (Amazon Books, Kindle, Audible)</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
