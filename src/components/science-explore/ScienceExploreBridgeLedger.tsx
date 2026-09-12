import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import { ParticleButton } from '@/components/ParticleButton';
import { useScienceExploreContent } from './scienceExploreShared';
import { ScienceExploreAtmosphere } from './ScienceExploreAtmosphere';

gsap.registerPlugin(ScrollTrigger);

/**
 * E — Bridge ledger
 * Two-language parallel columns: rational foothold left, inner recognition right.
 */
export function ScienceExploreBridgeLedger() {
  const pageRef = useRef<HTMLDivElement>(null);
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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.sci-bridge-hero', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.1,
      });
      gsap.utils.toArray<HTMLElement>('.sci-bridge-row').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 78%', once: true },
          },
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, [pillars.length]);

  return (
    <ScienceExploreAtmosphere>
      <div ref={pageRef}>
        <header className="border-b border-[#ECE9DD]/10 px-6 py-16 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <div className="sci-bridge-hero mb-10 flex flex-wrap items-center justify-center gap-8 md:gap-14">
              <TeachingIconMark id="formless" theme="dark" size={56} animate />
              <div className="text-center">
                <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.24em] text-[#ECE9DD]/70">
                  {eyebrow}
                </span>
                <h1 className="max-w-[16ch] font-serif text-[clamp(34px,4.8vw,56px)] font-normal leading-[1.08] text-[#ECE9DD]">
                  {title}
                </h1>
              </div>
              <TeachingIconMark id="quantum" theme="dark" size={56} animate />
            </div>
            <p className="sci-bridge-hero mx-auto max-w-2xl text-center font-serif text-[19px] leading-[1.55] text-[#ECE9DD]/75">
              {intro}
            </p>
            <p className="sci-bridge-hero mx-auto mt-4 max-w-xl text-center font-serif text-[17px] leading-[1.55] text-[#ECE9DD]/55">
              {lede}
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 md:px-16 lg:px-24">
          <div className="sticky top-20 z-10 hidden grid-cols-2 gap-8 border-b border-[#ECE9DD]/10 bg-[#080a09]/92 py-4 backdrop-blur-md md:grid">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9FB5AA]">
              Science language
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#CC5833]">
              Inner recognition
            </span>
          </div>

          {pillars.map((pillar, i) => (
            <article
              key={pillar.label}
              className="sci-bridge-row grid gap-8 border-b border-[#ECE9DD]/10 py-12 md:grid-cols-2 md:py-16"
            >
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9FB5AA]">
                  0{i + 1} · {pillar.label}
                </span>
                <p className="mt-4 whitespace-pre-line font-sans text-[15px] leading-[1.72] text-[#ECE9DD]/72">
                  {pillar.body}
                </p>
                {pillar.keywords?.length ? (
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ECE9DD]/45">
                    {pillar.keywords.join(' · ')}
                  </p>
                ) : null}
              </div>
              <div className="border-l border-[#ECE9DD]/10 pl-0 md:pl-8">
                <p className="whitespace-pre-line font-serif text-[clamp(19px,2vw,24px)] italic leading-[1.38] text-[#CC5833]">
                  {pillar.hook}
                </p>
                <p className="mt-5 font-serif text-[15px] leading-[1.6] text-[#ECE9DD]/65">
                  The same truth, spoken where the mind can rest before it lets go.
                </p>
              </div>
            </article>
          ))}
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
              trackLocation="science_explore_bridge"
              trackLabel={ctaWork.text || 'Work with me'}
            >
              {ctaWork.text || 'Work with me'}
            </ParticleButton>
            <ParticleButton
              href={ctaBook.href || '/book'}
              variant="secondary"
              trackLocation="science_explore_bridge"
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
