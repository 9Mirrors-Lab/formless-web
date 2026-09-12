import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BOOK_PREVIEW_CHAPTER, BOOK_PREVIEW_QUOTE } from '@/data/bookInsightsPreview';

gsap.registerPlugin(ScrollTrigger);

/**
 * Cinematic Curtain Reveal adapted for Formless.
 * RESISTANCE / SURRENDER panels part to reveal the chapter reflection + quote.
 * No edge vignette; panels are solid cream fields.
 */
export function LockupCurtainReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!section || !left || !right) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      left.style.transform = 'translateX(-100%)';
      right.style.transform = 'translateX(100%)';
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(left, {
        xPercent: -100,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '60% top',
          scrub: 0.5,
        },
      });
      gsap.to(right, {
        xPercent: 100,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '60% top',
          scrub: 0.5,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="lockup-curtain"
      className="relative h-[280vh] w-full bg-cream text-charcoal"
    >
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center bg-[#e8e2d6] px-6 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-moss">
            {BOOK_PREVIEW_CHAPTER.label}
          </p>
          <h2 className="mt-4 max-w-[16ch] font-serif text-3xl italic leading-tight md:text-5xl">
            {BOOK_PREVIEW_CHAPTER.title}
          </h2>
          <p className="mt-6 max-w-prose font-sans text-base leading-relaxed text-charcoal/70 md:text-lg">
            {BOOK_PREVIEW_CHAPTER.reflection}
          </p>
          <blockquote className="mt-10 max-w-[28ch] font-serif text-xl italic leading-snug text-charcoal/85 md:text-2xl">
            {BOOK_PREVIEW_QUOTE.text}
          </blockquote>
        </div>

        <div
          ref={leftRef}
          className="absolute inset-y-0 left-0 z-[2] flex w-1/2 items-center justify-end border-r border-charcoal/10 bg-cream pr-4 md:pr-10"
        >
          <h3 className="max-w-[4ch] text-right font-serif text-[clamp(2rem,6vw,4.5rem)] italic leading-[0.95] tracking-[-0.02em] text-charcoal">
            Resistance
          </h3>
        </div>
        <div
          ref={rightRef}
          className="absolute inset-y-0 right-0 z-[2] flex w-1/2 items-center justify-start border-l border-charcoal/10 bg-cream pl-4 md:pl-10"
        >
          <h3 className="max-w-[4ch] font-serif text-[clamp(2rem,6vw,4.5rem)] italic leading-[0.95] tracking-[-0.02em] text-charcoal">
            Surrender
          </h3>
        </div>
      </div>

      <p className="pointer-events-none absolute bottom-8 left-0 right-0 z-[3] text-center font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-charcoal/40 md:bottom-auto md:top-6">
        Lockup B · Curtain reveal · scroll to open
      </p>
    </section>
  );
}
