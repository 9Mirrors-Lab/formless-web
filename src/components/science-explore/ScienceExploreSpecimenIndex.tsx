import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import { ParticleButton } from '@/components/ParticleButton';
import {
  pillarIconId,
  useScienceExploreContent,
} from './scienceExploreShared';
import { ScienceExploreAtmosphere } from './ScienceExploreAtmosphere';

gsap.registerPlugin(ScrollTrigger);

const SPECIMEN_ICONS = ['cells', 'dna', 'anchor', 'north'];

/**
 * C — Specimen index
 * Sticky catalog rail with icon stamps; prose scrolls like a field journal.
 */
export function ScienceExploreSpecimenIndex() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const {
    pillars,
    eyebrow,
    title,
    intro,
    closingEyebrow,
    closingLine1,
    closingLine2,
    ctaWork,
    ctaBook,
  } = useScienceExploreContent();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      pillars.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: `.sci-specimen-panel-${i}`,
          start: 'top 42%',
          end: 'bottom 42%',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, [pillars.length]);

  return (
    <ScienceExploreAtmosphere>
      <div ref={pageRef}>
        <header className="border-b border-[#ECE9DD]/10 px-6 py-14 md:px-16 lg:px-24">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.2fr] md:items-end">
            <div>
              <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.24em] text-[#ECE9DD]/70">
                {eyebrow}
              </span>
              <h1 className="font-serif text-[clamp(36px,5vw,60px)] font-normal leading-[1.06] text-[#ECE9DD]">
                {title}
              </h1>
            </div>
            <p className="font-serif text-[19px] leading-[1.55] text-[#ECE9DD]/70">{intro}</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl lg:grid-cols-[220px_1fr]">
          <aside className="sticky top-24 z-20 hidden self-start border-r border-[#ECE9DD]/10 px-6 py-10 lg:block lg:px-8">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ECE9DD]/45">
              Specimen index
            </p>
            <nav aria-label="Science pillars" className="space-y-1">
              {pillars.map((pillar, i) => {
                const on = active === i;
                const iconId = pillarIconId(pillar.label, SPECIMEN_ICONS, i);
                return (
                  <a
                    key={pillar.label}
                    href={`#specimen-${i}`}
                    className={`flex items-center gap-3 rounded-sm px-2 py-2.5 transition-colors ${
                      on ? 'bg-[#ECE9DD]/8' : 'hover:bg-[#ECE9DD]/4'
                    }`}
                  >
                    <TeachingIconMark id={iconId} theme="dark" size={28} animate={on} />
                    <div className="min-w-0">
                      <span
                        className={`block font-mono text-[10px] uppercase tracking-[0.16em] ${
                          on ? 'text-[#CC5833]' : 'text-[#ECE9DD]/45'
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className={`block truncate font-serif text-[13px] italic ${
                          on ? 'text-[#ECE9DD]' : 'text-[#ECE9DD]/60'
                        }`}
                      >
                        {pillar.label}
                      </span>
                    </div>
                  </a>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0">
            {pillars.map((pillar, i) => {
              const iconId = pillarIconId(pillar.label, SPECIMEN_ICONS, i);
              return (
                <article
                  key={pillar.label}
                  id={`specimen-${i}`}
                  className={`sci-specimen-panel-${i} border-b border-[#ECE9DD]/10 px-6 py-16 md:px-12 md:py-20 lg:px-16`}
                >
                  <div className="mb-8 flex items-start justify-between gap-6 lg:hidden">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#CC5833]">
                        0{i + 1}
                      </span>
                      <h2 className="mt-1 font-serif text-2xl italic text-[#ECE9DD]">{pillar.label}</h2>
                    </div>
                    <TeachingIconMark id={iconId} theme="dark" size={40} animate />
                  </div>

                  <div className="rounded-sm border border-[#ECE9DD]/12 bg-[#07090a]/40 p-6 md:p-8">
                    <div className="mb-6 hidden items-center gap-4 border-b border-[#ECE9DD]/10 pb-5 lg:flex">
                      <TeachingIconMark id={iconId} theme="dark" size={44} animate />
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#CC5833]">
                          Catalog 0{i + 1}
                        </span>
                        <h2 className="font-serif text-xl italic text-[#ECE9DD]">{pillar.label}</h2>
                      </div>
                    </div>
                    <p className="whitespace-pre-line font-serif text-[clamp(19px,2vw,23px)] italic leading-[1.4] text-[#CC5833]">
                      {pillar.hook}
                    </p>
                    {pillar.keywords?.length ? (
                      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#ECE9DD]/50">
                        {pillar.keywords.join(' · ')}
                      </p>
                    ) : null}
                    <p className="mt-6 whitespace-pre-line font-sans text-[15px] leading-[1.72] text-[#ECE9DD]/68">
                      {pillar.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <section className="px-6 py-24 text-center md:px-16 lg:px-24">
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
              trackLocation="science_explore_specimen"
              trackLabel={ctaWork.text || 'Work with me'}
            >
              {ctaWork.text || 'Work with me'}
            </ParticleButton>
            <ParticleButton
              href={ctaBook.href || '/book'}
              variant="secondary"
              trackLocation="science_explore_specimen"
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
