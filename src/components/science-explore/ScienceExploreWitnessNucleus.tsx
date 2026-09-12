import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import { ParticleButton } from '@/components/ParticleButton';
import {
  OrbitRingsConsciousness,
  OrbitRingsNeuro,
  OrbitRingsObservation,
  OrbitRingsPerception,
} from '@/components/cosmic/cosmicShared';
import {
  pillarIconId,
  useScienceExploreContent,
} from './scienceExploreShared';
import { ScienceExploreAtmosphere } from './ScienceExploreAtmosphere';

gsap.registerPlugin(ScrollTrigger);

const WITNESS_ICONS = ['quantum', 'space', 'pause', 'clarity'];

const ORBITS = [
  OrbitRingsPerception,
  OrbitRingsNeuro,
  OrbitRingsObservation,
  OrbitRingsConsciousness,
];

/**
 * D — Witness nucleus
 * Fixed orbit stage; pillar readouts step through on scroll.
 */
export function ScienceExploreWitnessNucleus() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const {
    pillars,
    eyebrow,
    title,
    lede,
    closingEyebrow,
    closingLine1,
    closingLine2,
    ctaWork,
    ctaBook,
  } = useScienceExploreContent();

  const Orbit = ORBITS[step % ORBITS.length];
  const pillar = pillars[step] ?? pillars[0];
  const iconId = pillar ? pillarIconId(pillar.label, WITNESS_ICONS, step) : 'formless';

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.sci-witness-sentinel').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setStep(i),
          onEnterBack: () => setStep(i),
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, [pillars.length]);

  return (
    <ScienceExploreAtmosphere>
      <div ref={pageRef} className="relative">
        <section className="site-page-header px-6 pb-8 pt-4 md:px-16 lg:px-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.24em] text-[#ECE9DD]/70">
              {eyebrow}
            </span>
            <h1 className="font-serif text-[clamp(36px,5vw,58px)] font-normal leading-[1.08] text-[#ECE9DD]">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl font-serif text-[18px] leading-[1.55] text-[#ECE9DD]/65">
              {lede}
            </p>
          </div>
        </section>

        <div className="sticky top-0 z-10 h-[min(72vh,640px)] w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-90">
            <div className="h-full w-full max-w-5xl">
              <Orbit />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#080a09]/20 via-transparent to-[#080a09]/88" />

          <div className="relative flex h-full flex-col justify-end px-6 pb-10 md:px-16 lg:px-24">
            <div className="mx-auto w-full max-w-2xl rounded-sm border border-[#ECE9DD]/12 bg-[#07090a]/78 p-6 backdrop-blur-sm md:p-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <TeachingIconMark id={iconId} theme="dark" size={36} animate />
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#CC5833]">
                      0{step + 1} · Readout
                    </span>
                    <h2 className="font-serif text-lg italic text-[#ECE9DD]">{pillar?.label}</h2>
                  </div>
                </div>
                <div className="flex gap-1.5" aria-hidden>
                  {pillars.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full ${
                        i === step ? 'bg-[#CC5833]' : 'bg-[#ECE9DD]/25'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="whitespace-pre-line font-serif text-[clamp(18px,2vw,22px)] italic leading-[1.4] text-[#CC5833]">
                {pillar?.hook}
              </p>
              <p className="mt-4 line-clamp-4 font-sans text-[14px] leading-[1.68] text-[#ECE9DD]/68">
                {pillar?.body}
              </p>
            </div>
          </div>
        </div>

        {pillars.map((p, i) => (
          <div
            key={p.label}
            className={`sci-witness-sentinel h-[55vh] ${i === pillars.length - 1 ? 'h-[40vh]' : ''}`}
            aria-hidden
          />
        ))}

        <section className="relative z-20 border-t border-[#ECE9DD]/10 px-6 py-24 text-center md:px-16 lg:px-24">
          <span className="mb-6 block font-mono text-[11px] uppercase tracking-[0.24em] text-[#ECE9DD]/55">
            {closingEyebrow}
          </span>
          <p className="mx-auto max-w-3xl whitespace-pre-line font-serif text-[clamp(28px,4vw,48px)] leading-[1.14] text-[#ECE9DD]">
            {closingLine1}
            <br />
            <em className="text-[#CC5833] not-italic">{closingLine2}</em>
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ParticleButton
              href={ctaWork.href || '/work'}
              trackLocation="science_explore_witness"
              trackLabel={ctaWork.text || 'Work with me'}
            >
              {ctaWork.text || 'Work with me'}
            </ParticleButton>
            <ParticleButton
              href={ctaBook.href || '/book'}
              variant="secondary"
              trackLocation="science_explore_witness"
              trackLabel={ctaBook.text || 'Get the book'}
            >
              {ctaBook.text || 'Get the book'}
            </ParticleButton>
          </div>
        </section>
      </div>
    </ScienceExploreAtmosphere>
  );
}
