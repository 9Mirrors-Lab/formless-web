import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BOOK_PREVIEW_CHAPTER,
  BOOK_PREVIEW_INSIGHTS,
  BOOK_PREVIEW_QUOTE,
} from '@/data/bookInsightsPreview';

gsap.registerPlugin(ScrollTrigger);

const LEFT = [
  {
    title: BOOK_PREVIEW_CHAPTER.label,
    body: BOOK_PREVIEW_CHAPTER.title,
  },
  {
    title: 'The teaching',
    body: BOOK_PREVIEW_CHAPTER.body,
  },
  {
    title: BOOK_PREVIEW_CHAPTER.reflectionTitle,
    body: BOOK_PREVIEW_CHAPTER.reflection,
  },
  {
    title: 'The quote',
    body: BOOK_PREVIEW_QUOTE.text,
  },
] as const;

const RIGHT = [
  {
    image: BOOK_PREVIEW_INSIGHTS[0].imageSrc,
    caption: BOOK_PREVIEW_INSIGHTS[0].caption,
  },
  {
    image: BOOK_PREVIEW_INSIGHTS[1].imageSrc,
    caption: BOOK_PREVIEW_INSIGHTS[1].caption,
  },
  {
    image: BOOK_PREVIEW_INSIGHTS[2].imageSrc,
    caption: BOOK_PREVIEW_INSIGHTS[2].caption,
  },
  {
    image: BOOK_PREVIEW_CHAPTER.featured.imageSrc,
    caption: BOOK_PREVIEW_CHAPTER.featured.caption,
  },
] as const;

/**
 * Cinematic Split Scroll adapted for Formless.
 * Chapter language scrolls one way; Instagram stills scroll the other.
 */
export function LockupSplitScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!section || !left || !right) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const count = LEFT.length;
    const itemH = window.innerHeight;

    const ctx = gsap.context(() => {
      gsap.to(left, {
        y: -(count - 1) * itemH,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });
      gsap.fromTo(
        right,
        { y: -(count - 1) * itemH },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="lockup-split-scroll"
      className="relative h-[400vh] w-full bg-charcoal text-cream"
    >
      <p className="pointer-events-none absolute left-0 right-0 top-6 z-20 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-cream/45">
        Lockup D · Split scroll · words ↔ stills
      </p>

      <div className="sticky top-0 flex h-[100dvh] overflow-hidden">
        <div className="relative flex-1 overflow-hidden border-r border-cream/10">
          <div ref={leftRef} className="absolute inset-x-0 top-0 will-change-transform">
            {LEFT.map((item) => (
              <div
                key={item.title}
                className="flex h-[100dvh] items-center justify-center px-8 md:px-14"
              >
                <div className="max-w-md">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
                    {item.title}
                  </p>
                  <p className="mt-5 font-serif text-2xl italic leading-snug text-cream md:text-4xl">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden flex-1 overflow-hidden md:block">
          <div ref={rightRef} className="absolute inset-x-0 top-0 will-change-transform">
            {RIGHT.map((item) => (
              <div key={item.caption} className="relative h-[100dvh] w-full">
                <img
                  src={item.image}
                  alt=""
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-charcoal/70 p-8">
                  <p className="max-w-md font-serif text-xl italic leading-snug text-cream">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
