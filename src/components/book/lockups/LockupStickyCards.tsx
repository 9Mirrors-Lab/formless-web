import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BOOK_PREVIEW_CHAPTER,
  BOOK_PREVIEW_INSIGHTS,
  BOOK_PREVIEW_QUOTE,
} from '@/data/bookInsightsPreview';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    id: 'chapter',
    kicker: BOOK_PREVIEW_CHAPTER.label,
    title: BOOK_PREVIEW_CHAPTER.title,
    body: BOOK_PREVIEW_CHAPTER.body,
    tone: 'bg-cream text-charcoal border border-charcoal/10',
  },
  {
    id: 'quote',
    kicker: 'Insight',
    title: BOOK_PREVIEW_QUOTE.text,
    body: `— ${BOOK_PREVIEW_QUOTE.attribution}`,
    tone: 'bg-[#ddd5c8] text-charcoal',
  },
  {
    id: 'reflection',
    kicker: BOOK_PREVIEW_CHAPTER.reflectionTitle,
    title: BOOK_PREVIEW_CHAPTER.reflection,
    body: 'A moment to practice inside the chapter.',
    tone: 'bg-moss text-cream',
  },
  {
    id: 'reel',
    kicker: 'From Instagram',
    title: BOOK_PREVIEW_CHAPTER.featured.caption,
    body: BOOK_PREVIEW_CHAPTER.featured.ctaLabel,
    tone: 'bg-charcoal text-cream',
    image: BOOK_PREVIEW_INSIGHTS[0].imageSrc,
  },
] as const;

/**
 * Cinematic Sticky Cards adapted for Formless.
 * Each teaching beat pins and the next slides over — page-turning, not a card grid.
 */
export function LockupStickyCards() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const cards = root.querySelectorAll<HTMLElement>('[data-stack-card]');
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        if (i >= cards.length - 1) return;
        gsap.to(card, {
          scale: 0.96,
          opacity: 0.72,
          ease: 'none',
          scrollTrigger: {
            trigger: cards[i + 1],
            start: 'top 80%',
            end: 'top 40%',
            scrub: true,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="lockup-sticky-cards"
      className="w-full bg-[#f0ebe3] px-6 py-16 text-charcoal md:px-16 md:py-24 lg:px-24"
    >
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-moss">
          Lockup C · Sticky cards
        </p>
        <h2 className="mt-3 font-serif text-3xl italic leading-tight md:text-4xl">
          One idea at a time, like turning pages.
        </h2>

        <div className="mt-12 space-y-6 pb-[30vh]">
          {CARDS.map((card, index) => (
            <article
              key={card.id}
              data-stack-card
              className={`sticky min-h-[240px] overflow-hidden p-8 shadow-[0_18px_40px_rgba(26,26,26,0.08)] md:min-h-[280px] md:p-10 ${card.tone}`}
              style={{ top: `${5.5 + index * 1.25}rem`, zIndex: index + 1 }}
            >
              {'image' in card && card.image ? (
                <div className="absolute inset-0">
                  <img
                    src={card.image}
                    alt=""
                    decoding="async"
                    className="h-full w-full object-cover opacity-45"
                  />
                  <div className="absolute inset-0 bg-charcoal/55" aria-hidden />
                </div>
              ) : null}
              <div className="relative z-[1]">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] opacity-70">
                  {card.kicker}
                </p>
                <h3 className="mt-4 max-w-[22ch] font-serif text-2xl italic leading-snug md:text-3xl">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-prose font-sans text-sm leading-relaxed opacity-75 md:text-base">
                  {card.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
