import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '@/context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

export function CurtainReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const { getText } = useContent();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });

      tl.to(leftRef.current, { xPercent: -100, ease: 'none' }, 0).to(
        rightRef.current,
        { xPercent: 100, ease: 'none' },
        0,
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-charcoal"
    >
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 bg-charcoal">
        <h2 className="font-serif italic text-4xl md:text-6xl lg:text-[5rem] text-cream leading-[1.1] mb-8 max-w-4xl">
          {getText('home', 'curtain', 'headline_line1')}
          <br />
          {getText('home', 'curtain', 'headline_line2')}
        </h2>
        <p className="font-sans text-lg md:text-xl text-cream/70 max-w-2xl leading-relaxed">
          {getText('home', 'curtain', 'subtitle')}
        </p>
      </div>

      <div
        ref={leftRef}
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-cream z-20 flex items-center justify-end pr-[2vw] border-r border-charcoal/10"
      >
        <div className="font-serif text-[clamp(40px,10vw,120px)] tracking-[0.05em] text-charcoal/80">
          {getText('home', 'curtain', 'panel_left')}
        </div>
      </div>

      <div
        ref={rightRef}
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-cream z-20 flex items-center justify-start pl-[2vw] border-l border-charcoal/10"
      >
        <div className="font-serif text-[clamp(40px,10vw,120px)] tracking-[0.05em] text-charcoal/80">
          {getText('home', 'curtain', 'panel_right')}
        </div>
      </div>
    </section>
  );
}
