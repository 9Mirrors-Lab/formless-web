import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BOOK_PREVIEW_CHAPTER,
  BOOK_PREVIEW_INSIGHTS,
} from '@/data/bookInsightsPreview';

gsap.registerPlugin(ScrollTrigger);

const BEATS = [
  {
    id: '1',
    label: 'Chapter',
    title: BOOK_PREVIEW_CHAPTER.title,
    body: BOOK_PREVIEW_CHAPTER.body,
    image: BOOK_PREVIEW_INSIGHTS[0].imageSrc,
    imageAlt: BOOK_PREVIEW_INSIGHTS[0].imageAlt,
  },
  {
    id: '2',
    label: 'Practice',
    title: 'Notice. Return.',
    body: BOOK_PREVIEW_INSIGHTS[1].caption,
    image: BOOK_PREVIEW_INSIGHTS[1].imageSrc,
    imageAlt: BOOK_PREVIEW_INSIGHTS[1].imageAlt,
  },
  {
    id: '3',
    label: 'Reflection',
    title: BOOK_PREVIEW_CHAPTER.reflectionTitle,
    body: BOOK_PREVIEW_CHAPTER.reflection,
    image: BOOK_PREVIEW_INSIGHTS[2].imageSrc,
    imageAlt: BOOK_PREVIEW_INSIGHTS[2].imageAlt,
  },
] as const;

/**
 * Cinematic Sticky Stack adapted for Formless.
 * Pinned insight media on the left; teaching beats scroll on the right and swap the visual.
 */
export function LockupStickyStack() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState('1');

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const cards = root.querySelectorAll<HTMLElement>('[data-beat]');
      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 58%',
          end: 'bottom 42%',
          onEnter: () => setActive(card.dataset.beat ?? '1'),
          onEnterBack: () => setActive(card.dataset.beat ?? '1'),
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const current = BEATS.find((b) => b.id === active) ?? BEATS[0];

  return (
    <section
      ref={rootRef}
      id="lockup-sticky-stack"
      className="w-full bg-cream px-6 py-16 text-charcoal md:px-16 md:py-24 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-moss">
          Lockup A · Sticky stack
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl italic leading-tight md:text-4xl">
          Teaching stays pinned. The insight changes with you.
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative hidden lg:block">
            <div className="sticky top-28 overflow-hidden border border-charcoal/10 bg-[#f0ebe3]">
              <div className="relative aspect-[4/5]">
                {BEATS.map((beat) => (
                  <img
                    key={beat.id}
                    src={beat.image}
                    alt={beat.imageAlt}
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                      beat.id === active ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
              </div>
              <p className="border-t border-charcoal/10 px-5 py-4 font-serif text-lg leading-snug text-charcoal/85">
                {current.title}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:gap-8">
            {BEATS.map((beat) => (
              <article
                key={beat.id}
                data-beat={beat.id}
                className={`border border-charcoal/10 bg-white/50 px-6 py-8 transition-colors duration-400 ease-[cubic-bezier(.16,1,.3,1)] md:px-8 md:py-10 ${
                  active === beat.id ? 'border-moss/40 bg-moss/[0.06]' : ''
                }`}
              >
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
                  {beat.label}
                </p>
                <h3 className="mt-3 font-serif text-2xl italic leading-tight md:text-3xl">
                  {beat.title}
                </h3>
                <p className="mt-4 max-w-prose font-sans text-base leading-relaxed text-charcoal/70">
                  {beat.body}
                </p>
                <img
                  src={beat.image}
                  alt=""
                  decoding="async"
                  className="mt-6 aspect-[16/10] w-full object-cover lg:hidden"
                />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
