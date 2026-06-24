import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '@/context/ContentContext';
import { useSiteAccess } from '@/context/SiteAccessContext';
import { stripAnchorsFromCopy } from '@/lib/stripCopyLinks';

gsap.registerPlugin(ScrollTrigger);

export function CurtainReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const { restricted } = useSiteAccess();
  const { getText } = useContent();

  const t = (page: string, section: string, key: string) => {
    const raw = getText(page, section, key);
    return restricted ? stripAnchorsFromCopy(raw) : raw;
  };

  useLayoutEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    const container = containerRef.current;
    if (!left || !right || !container) return;

    const ctx = gsap.context(() => {
      gsap.set([left, right], { xPercent: 0, x: 0 });

      const buildTimeline = (
        start: string | (() => string),
        end: string | (() => string),
      ) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start,
            end,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          left,
          { xPercent: 0 },
          { xPercent: -100, ease: 'none', force3D: true },
          0,
        ).fromTo(
          right,
          { xPercent: 0 },
          { xPercent: 100, ease: 'none', force3D: true },
          0,
        );
      };

      const mm = gsap.matchMedia();

      // Begin when the curtain enters the viewport; finish at page end.
      mm.add('(max-width: 767px)', () => {
        buildTimeline(
          () => {
            const ratio = container.offsetTop / window.innerHeight;
            const pct = Math.round(Math.min(0.95, Math.max(0.5, ratio)) * 100);
            return `top ${pct}%`;
          },
          'max',
        );
      });

      mm.add('(min-width: 768px)', () => {
        buildTimeline('top 80%', 'bottom 20%');
      });
    }, container);

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="curtain-reveal relative w-full overflow-hidden bg-charcoal"
    >
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 bg-charcoal">
        <h2 className="font-serif italic text-3xl leading-[1.1] text-cream mb-4 max-w-4xl md:mb-8 md:text-6xl lg:text-[5rem]">
          {t('home', 'curtain', 'headline_line1')}
          {t('home', 'curtain', 'headline_line2') ? (
            <>
              <br />
              {t('home', 'curtain', 'headline_line2')}
            </>
          ) : null}
        </h2>
        <p className="max-w-2xl whitespace-pre-line font-sans text-sm leading-relaxed text-cream/70 md:text-lg lg:text-xl">
          {t('home', 'curtain', 'subtitle')}
        </p>
      </div>

      <div
        ref={leftRef}
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-cream z-20 flex items-center justify-end pr-[2vw] border-r border-charcoal/10"
      >
        <div className="font-serif text-[clamp(40px,10vw,120px)] tracking-[0.05em] text-charcoal/80">
          {t('home', 'curtain', 'panel_left')}
        </div>
      </div>

      <div
        ref={rightRef}
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-cream z-20 flex items-center justify-start pl-[2vw] border-l border-charcoal/10"
      >
        <div className="font-serif text-[clamp(40px,10vw,120px)] tracking-[0.05em] text-charcoal/80">
          {t('home', 'curtain', 'panel_right')}
        </div>
      </div>
    </section>
  );
}
