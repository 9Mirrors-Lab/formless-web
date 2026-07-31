import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ParticleButton } from '@/components/ParticleButton';
import {
  CosmicAnnoBadge,
  CosmicIconStage,
  IconNode,
  OrbitRingsConsciousness,
  useCosmicHeroCopy,
} from './cosmicShared';

const PERIPHERAL: { id: string; title: string; x: string; y: string; keyChar: string }[] = [
  { id: 'voice', title: 'The voice', x: '86%', y: '50%', keyChar: 'A' },
  { id: 'neural', title: 'Linked thoughts', x: '50%', y: '10%', keyChar: 'B' },
  { id: 'seed', title: 'Seed of life', x: '14%', y: '28%', keyChar: 'C' },
  { id: 'quantum', title: 'Open outcome', x: '18%', y: '78%', keyChar: 'D' },
  { id: 'ekg', title: 'Vital trace', x: '78%', y: '82%', keyChar: 'E' },
  { id: 'anchor', title: 'The anchor', x: '12%', y: '52%', keyChar: 'F' },
];

/**
 * D — Nucleus witness
 * Edge-to-edge orbit; brand lives in an instrument readout.
 */
export function CosmicNucleusWitness() {
  const stageRef = useRef<HTMLDivElement>(null);
  const copy = useCosmicHeroCopy();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cosmic-readout', {
        y: 24,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.25,
      });
      gsap.to('.cosmic-nucleus-d', {
        scale: 1.04,
        duration: 5.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        transformOrigin: '50% 50%',
      });
    }, stageRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={stageRef}
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden px-6 pb-16 pt-24 md:px-16 md:pt-28 lg:px-24"
    >
      {/* Full-bleed orbit field */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center" aria-hidden>
        <div className="h-[min(92vw,820px)] w-[min(92vw,820px)] opacity-70 md:opacity-80">
          <OrbitRingsConsciousness />
        </div>
      </div>

      <CosmicIconStage className="absolute inset-0 z-[1]">
        <div className="cosmic-nucleus-d absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 md:top-1/2">
          <IconNode id="observer" size={88} />
        </div>

        {PERIPHERAL.map((mark) => (
          <div
            key={mark.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 opacity-55"
            style={{ left: mark.x, top: mark.y }}
          >
            <IconNode id={mark.id} size={32} animate={false} />
            <CosmicAnnoBadge
              keyChar={mark.keyChar}
              label={mark.title}
              className="left-1/2 top-full mt-2 hidden -translate-x-1/2 lg:flex"
            />
          </div>
        ))}
      </CosmicIconStage>

      {/* Instrument readout — brand + headline + CTA */}
      <div className="cosmic-readout relative z-10 mt-auto max-w-xl rounded-sm border border-cream/10 bg-[#07090a]/88 p-5 md:p-6">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.32em] text-cream">
            Eyes Closed
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-clay">
            {copy.eyebrow}
          </span>
        </div>
        <h1 className="font-serif text-[clamp(26px,3.5vw,40px)] font-normal leading-[1.08] tracking-[-0.01em] text-cream">
          {copy.headlinePrimary}
          <span className="mt-1 block text-cream/75">{copy.headlineSecondary}</span>
        </h1>
        <p className="mt-4 max-w-[42ch] font-serif text-[15px] leading-relaxed text-cream/65 md:text-[16px]">
          {copy.lede}
        </p>
        {copy.cta ? (
          <div className="mt-5">
            <ParticleButton
              href={copy.cta.href}
              trackLocation="cosmic_concepts_d"
              trackLabel={copy.cta.text}
              className="!bg-moss !text-cream !px-6 !py-3 !text-xs"
            >
              {copy.cta.text}
            </ParticleButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}
