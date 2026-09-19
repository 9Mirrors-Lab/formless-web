import {
  amazonBooksHref,
  audibleHref,
  kindlePreorderHref,
} from '@/data/preorderLanding';
import { captureCtaClick } from '@/lib/analytics';

const PRODUCT_SRC = '/design/3d-mockups/out-now-read-listen-product.png';

type FormatDoor = {
  id: 'kindle' | 'audible' | 'amazon-books';
  name: string;
  action: string;
  markSrc: string;
  markClassName: string;
  href: () => string;
};

const DOORS: readonly FormatDoor[] = [
  {
    id: 'kindle',
    name: 'Kindle',
    action: 'Read the book',
    markSrc: '/brand/amazon-a-mark.svg',
    markClassName: 'h-8 w-8 shrink-0 object-contain',
    href: kindlePreorderHref,
  },
  {
    id: 'audible',
    name: 'Audible',
    action: 'Listen to the audiobook',
    markSrc: '/brand/audible-mark.svg',
    markClassName: 'h-7 w-7 shrink-0 object-contain',
    href: audibleHref,
  },
  {
    id: 'amazon-books',
    name: 'Amazon Books',
    action: 'Get the print book',
    markSrc: '/brand/amazon-a-mark.svg',
    markClassName: 'h-8 w-8 shrink-0 object-contain',
    href: amazonBooksHref,
  },
];

/**
 * Home hero lockup from out-now-read-listen-mockup.png:
 * book + phone product, then OUT NOW / READ IT. LISTEN. OR HOLD IT. + cream logo doors.
 * No mockup backdrop — hero landscape stays the atmosphere.
 */
export function OutNowReadListenLockup({
  trackLocation = 'home_hero_book_aside',
  formatsHref = '/book#book-availability',
}: {
  trackLocation?: string;
  formatsHref?: string;
}) {
  return (
    <aside
      className="book-purchase-panel flex w-full max-w-[34rem] flex-col items-center"
      aria-label="Get Formless on Kindle, Audible, or Amazon Books"
    >
      <img
        src={PRODUCT_SRC}
        alt="Formless book beside the Audible player on a phone"
        width={794}
        height={512}
        decoding="async"
        className="h-auto w-full max-w-[28rem] object-contain"
      />

      <div className="mt-8 flex w-full flex-col items-center text-center">
        <p className="font-sans text-[1.35rem] font-bold uppercase tracking-[0.22em] text-cream md:text-[1.55rem]">
          Out now
        </p>
        <p className="mt-2 font-sans text-[0.8rem] font-medium uppercase tracking-[0.28em] text-cream/75 md:text-[0.9rem]">
          Read it. Listen. Or hold it.
        </p>

        <ul className="mt-7 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          {DOORS.map((door) => {
            const href = door.href();
            const trackLabel = `${door.name}: ${door.action}`;
            return (
              <li key={door.id}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => captureCtaClick(trackLabel, href, trackLocation)}
                  className="flex min-h-[4.25rem] items-center gap-3 rounded-xl bg-[#ebe4d8] px-4 py-3.5 text-left text-[#1a1714] transition-transform duration-200 hover:scale-[1.015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/50"
                >
                  <img
                    src={door.markSrc}
                    alt=""
                    aria-hidden
                    className={door.markClassName}
                  />
                  <span className="min-w-0">
                    <span className="block font-sans text-[1.05rem] font-semibold leading-tight">
                      {door.name}
                    </span>
                    <span className="mt-0.5 block font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-[#1a1714]/70">
                      {door.action}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href={formatsHref}
          className="mt-5 inline-flex min-h-10 items-center font-mono text-[10px] uppercase tracking-[0.2em] text-cream/55 transition-colors duration-200 hover:text-cream/85"
        >
          See all formats
          <span className="sr-only"> (Kindle, Audible, Amazon Books)</span>
        </a>
      </div>
    </aside>
  );
}
