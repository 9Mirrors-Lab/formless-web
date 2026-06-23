import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '@/context/ContentContext';
import { useSiteAccess } from '@/context/SiteAccessContext';
import { stripAnchorsFromCopy } from '@/lib/stripCopyLinks';

gsap.registerPlugin(ScrollTrigger);

export function Hero({ showCta = true }: { showCta?: boolean }) {
  const container = useRef<HTMLElement>(null);
  const { restricted } = useSiteAccess();
  const { getText, getLink, getImage } = useContent();

  const bg = getImage('home', 'hero', 'background_image').src;
  const ctaEnabled = showCta && !restricted;
  const cta = ctaEnabled ? getLink('home', 'hero', 'cta_reflection') : null;

  const cx = (key: string) => {
    const raw = getText('home', 'hero', key);
    return restricted ? stripAnchorsFromCopy(raw) : raw;
  };
  const lede = cx('lede');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-elem', {
        y: 40,
        opacity: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      });

      gsap.to('.hero-content', {
        opacity: 0,
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: '10% top',
          end: '40% top',
          scrub: true,
        },
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="home-hero home-hero--elevated-copy relative w-full overflow-hidden">
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

      <div className="home-hero__stage relative z-10">
        <div className="hero-content home-hero__container">
          <div className="home-hero__copy flex flex-col gap-2">
            <span className="hero-elem mb-4 block font-mono text-[clamp(0.65rem,0.2vw+0.6rem,0.875rem)] uppercase tracking-[0.3em] text-cream/60">
              {cx('eyebrow')}
            </span>
            <h1 className="home-hero__headline font-serif font-light italic leading-[1.08] tracking-tight text-cream">
              <span className="hero-elem block">{cx('headline_primary')}</span>
              <span className="hero-elem home-hero__headline-secondary block">
                {cx('headline_secondary')}
              </span>
            </h1>
            <p className="hero-elem home-hero__lede mt-8 whitespace-pre-line font-sans font-light leading-relaxed text-cream/60">
              {lede}
            </p>
            {ctaEnabled && cta ? (
              <a
                href={cta.href}
                className="hero-elem group mt-6 inline-flex w-fit items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-cream/70 transition-colors duration-500 hover:text-cream"
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
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
