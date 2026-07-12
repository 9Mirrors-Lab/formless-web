import { useContent } from '@/context/ContentContext';
import { useSiteAccess } from '@/context/SiteAccessContext';

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

/** Shared hero lockup from /layout-tests — same markup on main when `hero=layout-test`. */
export function LayoutTestHeroSection() {
  const { getImage } = useContent();
  const bg = getImage('home', 'hero', 'background_image').src;

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
        <SectionLabel>An Invitation to go within</SectionLabel>
        <h1 className="font-serif text-[clamp(2.75rem,5.8vw,6.5rem)] italic leading-[1.05] tracking-normal text-cream">
          <span className="block sm:whitespace-nowrap">Remembering Who You Are</span>
          <span className="block sm:whitespace-nowrap">Beyond The Mind</span>
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(26rem,1.15fr)] lg:items-start">
          <div className="max-w-2xl">
            <p className="whitespace-pre-line text-lg leading-relaxed text-cream/66 md:text-xl">
              The world teaches you to look outward for fulfillment.{'\n'}
              Eyes Closed points you inward.
            </p>
            <HeroReflectionCta />
          </div>

          <aside className="min-w-0 border-t border-cream/12 pt-7 lg:self-center lg:border-l lg:border-t-0 lg:pl-7">
            <p className="font-serif text-3xl uppercase tracking-[0.12em] text-cream md:text-4xl">
              Formless
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/45">
              Coming September 1, 2026
            </p>
            <p className="mt-2 text-sm leading-relaxed text-cream/50 lg:text-[0.9375rem] lg:whitespace-nowrap">
              An invitation to discover who you are beyond thought
            </p>

            <div className="mt-6 border-y border-cream/10 py-6">
              <blockquote
                cite="/book"
                className="border-l-2 border-clay/35 pl-5 font-serif text-lg italic leading-relaxed text-cream/72 md:text-xl"
              >
                <p>
                  Everything in me stopped. For the first time, I sensed that the voice in my head
                  was not me.
                </p>
              </blockquote>
              <p className="mt-5 pl-5 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                — Page 12
              </p>
            </div>

            <div className="mt-6">
              <a
                href="/book"
                className="inline-flex rounded-full bg-clay px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-cream transition-transform hover:scale-105"
              >
                Join the Waitlist
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
