import { useContent } from '@/context/ContentContext';
import { useSiteAccess } from '@/context/SiteAccessContext';
import { resolveHeroBookAsideEnabled } from '@/config/featureFlags';
import { FORMLESS_BOOK_COVER } from '@/data/bookCover';
import { PREORDER_FACTS, kindlePreorderHref } from '@/data/preorderLanding';
import { captureCtaClick } from '@/lib/analytics';
import { stripAnchorsFromCopy } from '@/lib/stripCopyLinks';

function HeroReflectionCta() {
  const { restricted } = useSiteAccess();
  const { getLink } = useContent();
  const cta = restricted ? null : getLink('home', 'hero', 'cta_reflection');

  if (!cta) return null;

  return (
    <a
      href={cta.href}
      className="group mt-6 inline-flex w-fit items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-cream/70 transition-colors duration-500 hover:text-cream"
    >
      {cta.text}
      <svg
        className="h-4 w-4 transform transition-transform duration-500 group-hover:translate-y-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </a>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="mb-5 block font-mono text-[clamp(0.65rem,0.2vw+0.6rem,0.875rem)] uppercase tracking-[0.3em] text-cream/60 md:mb-4">
      {children}
    </span>
  );
}

/** Jacket lockup: cover beside Amazon preorder stack (matches cream lockup example). */
function HeroBookAside() {
  const href = kindlePreorderHref();
  const trackLocation = 'home_hero_book_aside';
  const factsLine = `Amazon · ${PREORDER_FACTS.price} · ${PREORDER_FACTS.delivers}`;

  return (
    <aside className="border-t border-cream/12 pt-8 lg:self-center lg:border-l lg:border-t-0 lg:pl-10 xl:pl-12">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-7">
        <img
          src={FORMLESS_BOOK_COVER.src}
          alt={FORMLESS_BOOK_COVER.alt}
          width={FORMLESS_BOOK_COVER.width}
          height={FORMLESS_BOOK_COVER.height}
          decoding="async"
          className="aspect-[5/8] h-auto w-[12.5rem] shrink-0 object-contain shadow-[0_22px_48px_rgba(0,0,0,0.45)] sm:w-[13.5rem] xl:w-[14.5rem]"
        />

        <div className="min-w-0 max-w-[18.5rem]">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-cream/90">
            Now on Amazon
          </p>
          <p className="mt-3 font-serif text-[1.45rem] italic leading-[1.2] text-cream md:text-[1.65rem]">
            eBook is available to
            <br />
            pre-order now!
          </p>
          <p className="mt-4 whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-clay">
            {factsLine}
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => captureCtaClick('Pre-order on Amazon', href, trackLocation)}
            className="mt-6 inline-flex rounded-full bg-clay px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-cream transition-transform hover:scale-105"
          >
            Pre-order on Amazon
          </a>
        </div>
      </div>
    </aside>
  );
}

type LayoutTestHeroSectionProps = {
  /** When set, overrides `?heroBookAside` / env for this instance (e.g. layout playground). */
  showBookAside?: boolean;
};

/** Home hero lockup with Formless jacket preorder column (default on). */
export function LayoutTestHeroSection({ showBookAside }: LayoutTestHeroSectionProps) {
  const { restricted } = useSiteAccess();
  const { getImage, getText } = useContent();
  const bg = getImage('home', 'hero', 'background_image').src;
  const bookAsideEnabled = showBookAside ?? resolveHeroBookAsideEnabled();

  const cx = (key: string) => {
    const raw = getText('home', 'hero', key);
    return restricted ? stripAnchorsFromCopy(raw) : raw;
  };

  const headline = (
    <h1
      className={
        bookAsideEnabled
          ? 'font-serif text-[clamp(2.35rem,4.2vw,4.25rem)] italic leading-[1.08] tracking-normal text-cream'
          : 'font-serif text-[clamp(2.75rem,5.8vw,6.5rem)] italic leading-[1.05] tracking-normal text-cream'
      }
    >
      <span className={bookAsideEnabled ? 'block' : 'block sm:whitespace-nowrap'}>
        {cx('headline_primary')}
      </span>
      <span className={bookAsideEnabled ? 'block' : 'block sm:whitespace-nowrap'}>
        {cx('headline_secondary')}
      </span>
    </h1>
  );

  const copyStack = (
    <>
      <SectionLabel>{cx('eyebrow')}</SectionLabel>
      {headline}
      <p className="mt-8 max-w-xl whitespace-pre-line text-lg leading-relaxed text-cream/66 md:mt-10 md:text-xl">
        {cx('lede')}
      </p>
      <HeroReflectionCta />
    </>
  );

  return (
    <section className="home-hero relative min-h-[100dvh] overflow-hidden px-6 pb-20 pt-36 md:px-16 lg:px-24">
      <div className="absolute inset-0 z-0" aria-hidden>
        {bg ? (
          <img
            src={bg}
            alt=""
            className="home-hero__image h-full w-full"
            decoding="async"
            fetchPriority="high"
          />
        ) : null}
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden>
        <div className="home-hero__overlay-multiply" />
        <div className="home-hero__overlay-vignette" />
        <div className="home-hero__overlay-readability" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl pt-12 md:pt-24">
        {bookAsideEnabled ? (
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(26rem,32rem)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(28rem,34rem)] xl:gap-14">
            <div className="min-w-0">{copyStack}</div>
            <HeroBookAside />
          </div>
        ) : (
          <div>
            {copyStack}
          </div>
        )}
      </div>
    </section>
  );
}
