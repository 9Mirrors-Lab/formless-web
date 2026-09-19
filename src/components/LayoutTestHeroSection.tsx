import { useContent } from '@/context/ContentContext';
import { useSiteAccess } from '@/context/SiteAccessContext';
import { resolveHeroBookAsideEnabled } from '@/config/featureFlags';
import { FormatLogoDoors } from '@/components/FormatLogoDoors';
import { stripAnchorsFromCopy } from '@/lib/stripCopyLinks';

const HERO_PRODUCT_SRC = '/design/3d-mockups/formless-book-phone.png';

function heroLedeLines(lede: string): string[] {
  return lede
    .replace(/\sfor fulfillment\./gi, '\u00a0for fulfillment.')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

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
    <span className="mb-3 block font-mono text-[clamp(0.65rem,0.2vw+0.6rem,0.875rem)] uppercase tracking-[0.3em] text-cream/60 md:mb-3">
      {children}
    </span>
  );
}

/** Product lockup: book + phone beside Kindle, Audible, and Amazon Books doors. */
function HeroBookAside() {
  const trackLocation = 'home_hero_book_aside';

  return (
    <aside
      className="pt-8 lg:pt-0"
      aria-label="Get Formless on Kindle, Audible, or Amazon Books"
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-5 lg:gap-6">
        <img
          src={HERO_PRODUCT_SRC}
          alt="Formless hardcover beside the audiobook playing on a phone"
          width={1024}
          height={935}
          decoding="async"
          className="-ml-1 h-auto w-[19.5rem] shrink-0 object-contain sm:w-[21.5rem] lg:-ml-2 lg:w-[24rem] xl:w-[27rem]"
        />

        <div className="min-w-[15.5rem] shrink-0">
          <p className="font-sans text-[0.8rem] font-medium uppercase tracking-[0.28em] text-cream md:text-[0.9rem]">
            Out now
          </p>
          <p className="mt-4 font-serif text-[1.85rem] italic leading-[1.15] text-cream md:text-[2.15rem]">
            Read it. Listen. Or hold it.
          </p>
          <p className="mt-4 max-w-[22ch] font-sans text-[1.05rem] leading-snug text-cream/80 md:text-[1.125rem]">
            Now available on Kindle, Audible, and Amazon Books.
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

type LayoutTestHeroSectionProps = {
  /** When set, overrides `?heroBookAside` / env for this instance (e.g. layout playground). */
  showBookAside?: boolean;
};

/** Home hero lockup with Formless jacket + Kindle CTA column (default on). */
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
          ? 'font-serif text-[clamp(2rem,3.05vw,3.65rem)] italic leading-[1.08] tracking-normal text-cream'
          : 'font-serif text-[clamp(2.75rem,5.8vw,6.5rem)] italic leading-[1.05] tracking-normal text-cream'
      }
    >
      <span className="block max-w-none whitespace-nowrap">
        {cx('headline_primary')}
      </span>
      <span className="block max-w-none whitespace-nowrap">
        {cx('headline_secondary')}
      </span>
    </h1>
  );

  const copyStack = (
    <>
      <SectionLabel>{cx('eyebrow')}</SectionLabel>
      {headline}
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/66 md:mt-7 md:text-xl">
        {heroLedeLines(cx('lede')).map((line, index) => (
          <span
            key={line}
            className={index === 0 ? 'block lg:whitespace-nowrap' : 'block'}
          >
            {line}
          </span>
        ))}
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

      <div className="relative z-10 mx-auto max-w-7xl pt-10 md:pt-20">
        {bookAsideEnabled ? (
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(34rem,44rem)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(36rem,46rem)] xl:gap-14">
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
