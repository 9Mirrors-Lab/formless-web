import { FORMLESS_BOOK_COVER } from '@/data/bookCover';
import { FormatLogoDoors } from '@/components/FormatLogoDoors';

type BookHeroPurchasePanelProps = {
  trackLocation?: string;
  eyebrow?: string;
  lede?: string;
  /** panel = book-page card · inline = home slab without card chrome */
  variant?: 'panel' | 'inline';
  coverClassName?: string;
  className?: string;
};

const DEFAULT_EYEBROW = 'Out now';
const DEFAULT_LEDE = 'Now available on Kindle, Audible, and Amazon Books.';

function resolvePurchaseLede(lede?: string): string {
  const trimmed = lede?.trim();
  if (!trimmed) return DEFAULT_LEDE;
  return trimmed.replace(/^Formless is now available/i, 'Now available');
}

export function BookHeroPurchasePanel({
  trackLocation = 'book_hero_purchase',
  eyebrow,
  lede,
  variant = 'panel',
  coverClassName,
  className,
}: BookHeroPurchasePanelProps) {
  const resolvedEyebrow = eyebrow?.trim() || DEFAULT_EYEBROW;
  const resolvedLede = resolvePurchaseLede(lede);

  return (
    <aside
      className={['book-purchase-panel w-full', className].filter(Boolean).join(' ')}
      aria-label="Get Formless on Kindle, Audible, or Amazon Books"
    >
      <div
        className={[
          'flex flex-col items-center text-center',
          variant === 'inline' ? '' : 'md:flex-row md:items-start md:gap-6 md:text-left lg:gap-8',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <img
          src={FORMLESS_BOOK_COVER.src}
          alt={FORMLESS_BOOK_COVER.alt}
          width={FORMLESS_BOOK_COVER.width}
          height={FORMLESS_BOOK_COVER.height}
          decoding="async"
          className={
            coverClassName ||
            'aspect-[5/8] h-auto w-[10.5rem] shrink-0 object-contain shadow-[0_18px_40px_rgba(0,0,0,0.42)] sm:w-[11.5rem] md:w-[11rem] lg:w-[12rem]'
          }
        />

        <div className="mt-6 flex w-full flex-col items-center md:mt-0 md:items-start md:pt-1">
          <p className="font-sans text-[0.8rem] font-medium uppercase tracking-[0.28em] text-cream md:text-[0.9rem]">
            {resolvedEyebrow}
          </p>
          <p className="mt-3 max-w-[28ch] font-sans text-sm leading-snug text-cream/80 md:max-w-[22ch] md:text-[0.95rem]">
            {resolvedLede}
          </p>

          <FormatLogoDoors
            trackLocation={trackLocation}
            className="mt-7 grid w-full max-w-[21rem] grid-cols-3 gap-2.5"
          />
        </div>
      </div>
    </aside>
  );
}
