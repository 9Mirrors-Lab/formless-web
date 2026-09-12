import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import { ParticleButton } from '@/components/ParticleButton';
import { useIconAnimations } from '@/hooks/useIconAnimations';
import {
  pillarIconId,
  useScienceExploreContent,
} from './scienceExploreShared';
import { ScienceExploreAtmosphere } from './ScienceExploreAtmosphere';

gsap.registerPlugin(ScrollTrigger);

/**
 * B — Icon atlas
 * Each pillar opens on a large teaching mark; copy orbits the icon like a field guide plate.
 */
export function ScienceExploreIconAtlas() {
  const pageRef = useRef<HTMLDivElement>(null);
  const iconScope = useRef<HTMLDivElement>(null);
  const {
    pillars,
    eyebrow,
    title,
    intro,
    lede,
    closingEyebrow,
    closingLine1,
    closingLine2,
    ctaWork,
    ctaBook,
  } = useScienceExploreContent();

  useIconAnimations(iconScope);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.sci-atlas-hero', {
        y: 44,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.15,
      });

      gsap.utils.toArray<HTMLElement>('.sci-atlas-pillar').forEach((el) => {
        gsap.fromTo(
          el.querySelector('.sci-atlas-icon'),
          { scale: 0.88, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 72%', once: true },
          },
        );
        gsap.fromTo(
          el.querySelector('.sci-atlas-copy'),
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 68%', once: true },
          },
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, [pillars.length]);

  return (
    <ScienceExploreAtmosphere>
      <div ref={pageRef}>
        <section className="site-page-header px-6 pb-16 pt-4 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl text-center">
            <span className="sci-atlas-hero mb-6 block font-mono text-[11px] uppercase tracking-[0.24em] text-[#ECE9DD]/70">
              {eyebrow}
            </span>
            <h1 className="sci-atlas-hero mx-auto max-w-[14ch] font-serif text-[clamp(40px,5.8vw,68px)] font-normal leading-[1.06] tracking-[-0.012em] text-[#ECE9DD]">
              {title}
            </h1>
            <p className="sci-atlas-hero mx-auto mt-6 max-w-xl font-serif text-[19px] leading-[1.55] text-[#ECE9DD]/75">
              {intro}
            </p>
            <p className="sci-atlas-hero mx-auto mt-4 max-w-lg font-serif text-[17px] leading-[1.55] text-[#ECE9DD]/55">
              {lede}
            </p>
            <div className="sci-atlas-hero mx-auto mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-[#ECE9DD]/10 pt-8">
              {pillars.map((p, i) => (
                <div key={p.label} className="flex flex-col items-center gap-2">
                  <TeachingIconMark
                    id={pillarIconId(p.label, undefined, i)}
                    theme="dark"
                    size={36}
                    animate
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#CC5833]">
                    0{i + 1}
                  </span>
                  <span className="font-serif text-[12px] italic text-[#ECE9DD]/65">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="border-t border-[#ECE9DD]/10" />

        <div ref={iconScope}>
          {pillars.map((pillar, i) => {
            const iconId = pillarIconId(pillar.label, undefined, i);
            const iconLeft = i % 2 === 0;
            return (
              <section
                key={pillar.label}
                className="sci-atlas-pillar border-b border-[#ECE9DD]/10 px-6 py-20 md:px-16 md:py-28 lg:px-24"
              >
                <div
                  className={`mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16 ${
                    iconLeft ? '' : 'md:[&>*:first-child]:order-2'
                  }`}
                >
                  <div className="sci-atlas-icon flex flex-col items-center justify-center">
                    <div className="relative flex h-[min(52vw,320px)] w-[min(52vw,320px)] items-center justify-center">
                      <div
                        className="pointer-events-none absolute inset-0 rounded-full border border-[#9FB5AA]/25"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-[12%] rounded-full border border-[#9FB5AA]/18"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-[24%] rounded-full border border-dashed border-[#CC5833]/20"
                        aria-hidden
                      />
                      <TeachingIconMark id={iconId} theme="dark" size={148} animate />
                    </div>
                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ECE9DD]/45">
                      Teaching mark · {iconId}
                    </p>
                  </div>

                  <div className="sci-atlas-copy">
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ECE9DD]/62">
                      0{i + 1} · {pillar.label}
                    </div>
                    <p className="mt-5 whitespace-pre-line font-serif text-[clamp(20px,2.2vw,26px)] italic leading-[1.38] text-[#CC5833]">
                      {pillar.hook}
                    </p>
                    {pillar.keywords?.length ? (
                      <p className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#ECE9DD]/55">
                        {pillar.keywords.map((word) => (
                          <span key={word}>{word}</span>
                        ))}
                      </p>
                    ) : null}
                    <p className="mt-6 whitespace-pre-line font-sans text-[15px] leading-[1.72] text-[#ECE9DD]/70">
                      {pillar.body}
                    </p>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <section className="relative px-6 py-24 text-center md:px-16 md:py-28 lg:px-24">
          <span className="mb-7 block font-mono text-[11px] uppercase tracking-[0.24em] text-[#ECE9DD]/55">
            {closingEyebrow}
          </span>
          <p className="mx-auto max-w-[880px] whitespace-pre-line font-serif text-[clamp(32px,4.8vw,56px)] font-normal leading-[1.12] text-[#ECE9DD]">
            {closingLine1}
            <br />
            <em className="text-[#CC5833] not-italic">{closingLine2}</em>
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <ParticleButton
              href={ctaWork.href || '/work'}
              trackLocation="science_explore_atlas"
              trackLabel={ctaWork.text || 'Work with me'}
            >
              {ctaWork.text || 'Work with me'}
            </ParticleButton>
            <ParticleButton
              href={ctaBook.href || '/book'}
              variant="secondary"
              trackLocation="science_explore_atlas"
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
