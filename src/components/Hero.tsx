import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '@/context/ContentContext';
import { useSiteAccess } from '@/context/SiteAccessContext';
import { stripAnchorsFromCopy } from '@/lib/stripCopyLinks';

gsap.registerPlugin(ScrollTrigger);

export function Hero({ showCta = true }: { showCta?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
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
    <section
      ref={container}
      className="relative w-full h-[100dvh] flex items-end pb-24 md:pb-32 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: bg ? `url("${bg}")` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#2E4036]/60 to-[#1A1A1A]/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
      </div>

      <div className="hero-content relative z-10 w-full md:w-3/4 max-w-5xl flex flex-col gap-2">
        <span className="hero-elem text-cream/60 font-mono text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block">
          {cx('eyebrow')}
        </span>
        <h1 className="text-cream font-serif italic font-light text-5xl md:text-7xl lg:text-[6.5rem] leading-[1.08] tracking-tight">
          <span className="hero-elem block">{cx('headline_primary')}</span>
          <span className="hero-elem block ml-4 md:ml-12">{cx('headline_secondary')}</span>
        </h1>
        <p className="hero-elem whitespace-pre-line text-cream/60 font-sans text-base md:text-lg max-w-lg mt-8 font-light leading-relaxed">
          {lede}
        </p>
        {ctaEnabled && cta ? (
          <a
            href={cta.href}
            className="hero-elem mt-6 inline-flex items-center gap-3 text-cream/70 font-mono text-xs uppercase tracking-[0.2em] hover:text-cream transition-colors duration-500 group w-fit"
          >
            {cta.text}
            <svg
              className="w-4 h-4 transform group-hover:translate-y-1 transition-transform duration-500"
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
    </section>
  );
}
