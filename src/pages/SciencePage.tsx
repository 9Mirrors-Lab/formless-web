import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageLayout } from '../components/PageLayout';
import { ParticleButton } from '../components/ParticleButton';
import { useContent, type ContentApi } from '@/context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

type Pillar = { label: string; hook: string; body: string };

function pillarsFromContent(api: ContentApi): Pillar[] {
  return api.listItems('science', 'pillars').flatMap((entry) => {
    const v = entry.value;
    const label = typeof v.label === 'string' ? v.label : '';
    const hook = typeof v.hook === 'string' ? v.hook : '';
    const body = typeof v.body === 'string' ? v.body : '';
    if (!label) return [];
    return [{ label, hook, body }];
  });
}

export default function SciencePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const content = useContent();
  const { getText, getLink } = content;
  const pillars = pillarsFromContent(content);
  const ctaWork = getLink('science', 'closing', 'cta_work');
  const ctaBook = getLink('science', 'closing', 'cta_book');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.science-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 },
      );

      gsap.to('.sci-blob-1', {
        x: 50,
        y: -30,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.sci-blob-2', {
        x: -40,
        y: 40,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.fromTo(
        '.pillar-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: pillarsRef.current, start: 'top 75%', once: true },
        },
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <PageLayout briefSpectrum>
      <div ref={pageRef}>
        <section className="relative w-full px-6 md:px-16 lg:px-24 pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="sci-blob-1 absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-moss/10 blur-[120px] will-change-transform" />
            <div className="sci-blob-2 absolute bottom-[5%] right-[10%] w-[400px] h-[400px] rounded-full bg-clay/6 blur-[100px] will-change-transform" />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="science-title relative z-10 max-w-5xl">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/40 mb-6 block">
                {getText('science', 'header', 'eyebrow')}
              </span>
              <h1 className="font-serif italic text-5xl md:text-7xl text-charcoal leading-[1.08] mb-8">
                {getText('science', 'header', 'title')}
              </h1>
              <p className="text-charcoal/60 font-sans text-lg max-w-xl leading-relaxed">
                {getText('science', 'header', 'lede')}
              </p>
            </div>
          </div>
        </section>

        <section ref={pillarsRef} className="w-full px-6 md:px-16 lg:px-24 py-20 md:py-28">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.label}
                className="pillar-card group relative p-10 md:p-14 rounded-2xl border border-charcoal/8 bg-white/40 hover:border-moss/30 hover:bg-moss/5 transition-all duration-[400ms] ease-[cubic-bezier(.16,1,.3,1)]"
              >
                <span className="font-mono text-xs tracking-[0.3em] uppercase text-clay font-semibold mb-6 block">
                  {pillar.label}
                </span>
                <p className="font-serif italic text-2xl md:text-3xl text-charcoal/80 leading-[1.3] mb-8">
                  {pillar.hook}
                </p>
                <p className="font-sans text-base text-charcoal/60 leading-relaxed">{pillar.body}</p>
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-moss/3 to-transparent" />
              </div>
            ))}
          </div>
        </section>

        <section className="w-full px-6 md:px-16 lg:px-24 py-24 md:py-32 bg-charcoal rounded-t-[3rem]">
          <div className="max-w-5xl mx-auto text-center">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-cream/30 mb-8 block">
              {getText('science', 'closing', 'eyebrow')}
            </span>
            <p className="font-serif italic text-3xl md:text-5xl text-cream/80 leading-[1.15] mb-12 max-w-3xl mx-auto">
              {getText('science', 'closing', 'title_line1')}
              <br />
              {getText('science', 'closing', 'title_line2')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ParticleButton href={ctaWork.href}>{ctaWork.text}</ParticleButton>
              <ParticleButton href={ctaBook.href} variant="secondary">
                {ctaBook.text}
              </ParticleButton>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
