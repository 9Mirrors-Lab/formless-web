import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageLayout } from '../components/PageLayout';
import { ParticleButton } from '../components/ParticleButton';
import { useContent, type ContentApi } from '@/context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

type ThemeCard = { label: string; title: string; desc: string };

function themesFromContent(api: ContentApi): ThemeCard[] {
  return api.listItems('book', 'themes').flatMap((entry) => {
    const v = entry.value;
    const label = typeof v.label === 'string' ? v.label : '';
    const title = typeof v.title === 'string' ? v.title : '';
    const desc = typeof v.desc === 'string' ? v.desc : '';
    if (!label || !title) return [];
    return [{ label, title, desc }];
  });
}

export default function BookPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const quotesRef = useRef<HTMLDivElement>(null);
  const themesRef = useRef<HTMLDivElement>(null);
  const content = useContent();
  const { getText, getLink, ordered, textFromEntry } = content;
  const themes = themesFromContent(content);
  const quotes = ordered('book', 'quotes').map(textFromEntry);

  const excerpt = getLink('book', 'header', 'cta_excerpt');
  const ctaWork = getLink('book', 'closing', 'cta_work');
  const ctaScience = getLink('book', 'closing', 'cta_science');
  const coverTitle = getText('book', 'cover', 'title');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
        '.book-title',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut', delay: 0.2 },
      );
      gsap.fromTo(
        '.book-cover-visual',
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 },
      );
      gsap.fromTo(
        '.pull-quote',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: quotesRef.current, start: 'top 70%', once: true },
        },
      );
      gsap.fromTo(
        '.theme-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: themesRef.current, start: 'top 75%', once: true },
        },
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <PageLayout briefSpectrum>
      <div ref={pageRef}>
        <section
          ref={headerRef}
          className="relative w-full px-6 md:px-16 lg:px-24 pt-52 pb-16 overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="sci-blob-1 absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-moss/10 blur-[120px] will-change-transform" />
            <div className="sci-blob-2 absolute bottom-[5%] right-[10%] w-[400px] h-[400px] rounded-full bg-clay/6 blur-[100px] will-change-transform" />
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/40 mb-6 block">
              {getText('book', 'header', 'eyebrow')}
            </span>
            <h1 className="book-title font-serif italic text-5xl md:text-7xl text-charcoal leading-[1.08] mb-8">
              {getText('book', 'header', 'title')}
            </h1>
            <p className="text-charcoal/60 font-sans text-lg max-w-md leading-relaxed mb-8">
              {getText('book', 'header', 'lede')}
            </p>
            <ParticleButton href={excerpt.href}>{excerpt.text}</ParticleButton>
            </div>
            <div className="book-cover-visual flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-lg overflow-hidden shadow-2xl shadow-black/40">
              <div className="absolute inset-0 bg-[#17120e] flex flex-col justify-center gap-4 p-10">
                <span className="block h-[1px] w-full bg-[#cfc7ae]/20" />
                <span className="block h-[1px] w-[78%] bg-[#cfc7ae]/20" />
                <span className="block h-[1px] w-[58%] bg-[#cfc7ae]/20" />
                <span className="block h-[1px] w-full bg-[#cfc7ae]/15" />
                <span className="block h-[1px] w-[85%] bg-[#cfc7ae]/15" />
                <span className="block h-[1px] w-[42%] bg-[#cfc7ae]/15" />
                <div className="mt-8">
                  <p className="font-serif italic text-[#cfc7ae]/60 text-sm">{coverTitle}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-moss/5 to-transparent pointer-events-none" />
            </div>
            </div>
          </div>
        </section>

      <section
        ref={quotesRef}
        className="w-full px-6 md:px-16 lg:px-24 py-20 md:py-28 border-t border-charcoal/8"
      >
        <div className="max-w-4xl mx-auto flex flex-col gap-16">
          {quotes.map((quote, i) => (
            <blockquote
              key={i}
              className="pull-quote font-serif italic text-2xl md:text-4xl text-charcoal/70 leading-[1.3] border-l-2 border-clay/30 pl-8"
            >
              {quote}
            </blockquote>
          ))}
        </div>
      </section>

      <section ref={themesRef} className="w-full px-6 md:px-16 lg:px-24 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/40 mb-6 block">
            {getText('book', 'themes_intro', 'eyebrow')}
          </span>
          <h2 className="font-serif italic text-3xl md:text-5xl text-charcoal/90 mb-16 leading-tight">
            {getText('book', 'themes_intro', 'title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {themes.map((theme) => (
              <div
                key={theme.label}
                className="theme-card group p-8 rounded-2xl border border-charcoal/8 bg-white/40 hover:border-moss/30 hover:bg-moss/5 transition-all duration-[400ms] ease-[cubic-bezier(.16,1,.3,1)]"
              >
                <span className="font-mono text-xs tracking-[0.3em] uppercase text-clay font-semibold mb-3 block">
                  {theme.label}
                </span>
                <h3 className="font-sans font-bold text-lg text-charcoal mb-3">{theme.title}</h3>
                <p className="font-sans text-sm text-charcoal/55 leading-relaxed">{theme.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-6 md:px-16 lg:px-24 py-24 bg-charcoal text-center rounded-t-[3rem]">
        <p className="font-serif italic text-2xl md:text-4xl text-cream/70 mb-10 max-w-lg mx-auto leading-snug">
          {getText('book', 'closing', 'lede')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ParticleButton href={ctaWork.href}>{ctaWork.text}</ParticleButton>
          <ParticleButton href={ctaScience.href} variant="secondary">
            {ctaScience.text}
          </ParticleButton>
        </div>
      </section>
      </div>
    </PageLayout>
  );
}
