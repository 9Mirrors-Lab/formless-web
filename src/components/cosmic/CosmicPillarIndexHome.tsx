import { useLayoutEffect, useRef, type ComponentType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleButton } from '@/components/ParticleButton';
import {
  CosmicHeroCopyBlock,
  CosmicIconStage,
  IconNode,
  OrbitRingsConsciousness,
  OrbitRingsNeuro,
  OrbitRingsObservation,
  OrbitRingsPerception,
} from './cosmicShared';

gsap.registerPlugin(ScrollTrigger);

type Pillar = {
  num: string;
  label: string;
  iconId: string;
  hook: string;
  body: string;
  Orbit: ComponentType<{ className?: string }>;
  keywords?: string[];
};

const PILLARS: Pillar[] = [
  {
    num: '01',
    label: 'Pause',
    iconId: 'observer',
    hook: 'You are not the voice in the head.\nYou are the one who hears it.',
    body: 'Awareness lets you notice the lens of memory, conditioning, and belief. When you see the lens, you are no longer identical to it.',
    Orbit: OrbitRingsPerception,
  },
  {
    num: '02',
    label: 'Pattern',
    iconId: 'neural',
    hook: 'Outer circumstances change.\nThe pattern remains.',
    body: 'Every thought you repeatedly believe strengthens a pathway. Every moment of awareness weakens it and begins another.',
    Orbit: OrbitRingsNeuro,
  },
  {
    num: '03',
    label: 'Body',
    iconId: 'ekg',
    hook: 'The body memorizes what the mind repeatedly lives in.',
    body: 'Stress, fear, worry, safety, joy, love, presence. Your nervous system learns through repetition until awareness makes the pattern conscious.',
    Orbit: OrbitRingsObservation,
    keywords: ['Stress', 'Fear', 'Worry', 'Safety', 'Joy', 'Love', 'Presence'],
  },
  {
    num: '04',
    label: 'Open',
    iconId: 'quantum',
    hook: 'Thoughts come and go.\nSomething remains aware of all of them.',
    body: 'That remaining awareness is where the practice begins. The teaching does not depend on science, but science can steady the mind that needs a foothold.',
    Orbit: OrbitRingsConsciousness,
  },
];

/**
 * C — Pillar index home
 * Science page architecture transplanted to the home journey.
 */
export function CosmicPillarIndexHome() {
  const pageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.cosmic-pillar-text').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el.closest('.cosmic-pillar') as Element,
              start: 'top 75%',
              once: true,
            },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>('.cosmic-pillar-num').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 0.18,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el.closest('.cosmic-pillar') as Element,
              start: 'top 80%',
              once: true,
            },
          },
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <section className="relative w-full overflow-hidden px-6 pb-14 pt-28 md:px-16 md:pb-16 md:pt-32 lg:px-24">
        <div className="mx-auto grid max-w-6xl items-end gap-12 md:grid-cols-[1.35fr_1fr] md:gap-16">
          <CosmicHeroCopyBlock />
          <div>
            <p className="mb-5 font-serif text-[19px] leading-[1.55] text-cream md:text-[21px]">
              The deepest truths about who you are do not require belief.
            </p>
            <p className="mb-8 font-serif text-[17px] leading-[1.55] text-cream/70 md:text-[19px]">
              Four doorways from the teaching marks. Same cosmic language as Spirituality &amp;
              Science.
            </p>
            <div className="flex flex-nowrap items-baseline justify-between gap-2 border-t border-cream/10 pt-6 md:gap-4">
              {PILLARS.map((p) => (
                <div key={p.num} className="flex shrink-0 items-baseline gap-1.5 whitespace-nowrap md:gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
                    {p.num}
                  </span>
                  <span className="font-serif text-[12px] italic text-cream/70 md:text-[14px]">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full border-t border-cream/10" />

      {PILLARS.map((pillar, i) => {
        const artRight = i % 2 === 0;
        const Orbit = pillar.Orbit;
        return (
          <section key={pillar.num} className="cosmic-pillar relative w-full overflow-hidden py-20 md:py-28">
            <div
              className={`pointer-events-none absolute opacity-40 md:opacity-55 ${
                artRight ? 'inset-y-0 right-[-12%] w-[78%] md:right-[-16%]' : 'inset-y-0 left-[-12%] w-[78%] md:left-[-16%]'
              }`}
              aria-hidden
            >
              <Orbit />
            </div>

            <CosmicIconStage
              className={`pointer-events-none absolute top-1/2 z-[1] -translate-y-1/2 opacity-80 ${
                artRight ? 'right-[8%] md:right-[14%]' : 'left-[8%] md:left-[14%]'
              }`}
            >
              <IconNode id={pillar.iconId} size={72} />
            </CosmicIconStage>

            <div className="relative z-10 w-full px-6 md:px-16 lg:px-24">
              <div className="mx-auto max-w-6xl">
                <div className={`cosmic-pillar-text max-w-[560px] ${artRight ? '' : 'ml-auto'}`}>
                  <div
                    className="cosmic-pillar-num mb-2 select-none font-mono font-medium leading-[0.9] text-cream"
                    style={{ fontSize: 110, letterSpacing: '-0.04em', opacity: 0 }}
                  >
                    {pillar.num}
                  </div>
                  <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/62">
                    {pillar.label}
                  </div>
                  <p className="mb-6 whitespace-pre-line font-serif text-[clamp(20px,2.2vw,24px)] italic leading-[1.38] text-clay">
                    {pillar.hook}
                  </p>
                  {pillar.keywords ? (
                    <p className="mb-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/55">
                      {pillar.keywords.map((word) => (
                        <span key={word}>{word}</span>
                      ))}
                    </p>
                  ) : null}
                  <p className="whitespace-pre-line font-sans text-[15px] leading-[1.72] text-cream/70">
                    {pillar.body}
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <div className="w-full border-t border-cream/10" />

      <section className="relative px-6 py-24 text-center md:px-16 md:py-28 lg:px-24">
        <span className="mb-7 block font-mono text-[11px] uppercase tracking-[0.24em] text-cream/55">
          Science points to what the ancient teachings have known.
        </span>
        <p className="mx-auto mb-12 max-w-[880px] font-serif text-[clamp(32px,5vw,56px)] leading-[1.12] text-cream">
          You are not the mind&apos;s interpretation of reality.
          <br />
          <em className="not-italic text-clay">You are the awareness that sees it.</em>
        </p>
        <div className="flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <ParticleButton href="/work" trackLocation="cosmic_concepts_c" trackLabel="The Practice">
            The Practice
          </ParticleButton>
          <ParticleButton
            href="/book"
            variant="secondary"
            trackLocation="cosmic_concepts_c"
            trackLabel="Formless"
            className="!border-cream/25 !text-cream hover:!bg-cream hover:!text-charcoal"
          >
            Formless
          </ParticleButton>
        </div>
      </section>
    </div>
  );
}
