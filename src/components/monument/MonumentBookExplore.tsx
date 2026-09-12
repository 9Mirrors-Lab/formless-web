import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent, type ContentApi } from '@/context/ContentContext';
import { FORMLESS_BOOK_COVER } from '@/data/bookCover';
import {
  AMAZON_PURCHASE_CTA,
  PREORDER_FACTS,
  kindlePreorderHref,
} from '@/data/preorderLanding';
import { captureCtaClick } from '@/lib/analytics';
import { MonumentAtmosphere } from './MonumentAtmosphere';
import { MonumentLabChrome, MonumentLabFooter } from './MonumentLabChrome';
import { MONUMENT } from './monumentShared';

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

const PLATFORMS = [
  { id: 'amazon-books', label: 'Amazon Books', verb: 'Hold it.' },
  { id: 'kindle', label: 'Kindle', verb: 'Read it.' },
  { id: 'audible', label: 'Audible', verb: 'Listen.' },
] as const;

function MonumentEyebrow({ children }: { children: string }) {
  return (
    <span
      className="mb-4 block font-mono text-[10px] uppercase tracking-[0.32em] md:mb-6"
      style={{ color: MONUMENT.turquoiseGray }}
    >
      {children}
    </span>
  );
}

export function MonumentBookExplore() {
  const pageRef = useRef<HTMLDivElement>(null);
  const content = useContent();
  const { getText, getLink, ordered, textFromEntry } = content;
  const themes = themesFromContent(content);
  const quotes = ordered('book', 'quotes').map(textFromEntry);

  const headerTitle = getText('book', 'header', 'title');
  const headerTitleMatch = headerTitle.match(/^(The book,\s*Formless)\s*(.*)$/i);
  const purchaseHref = kindlePreorderHref();
  const factsLine = `Amazon · ${PREORDER_FACTS.price} · ${PREORDER_FACTS.format}`;
  const ctaWork = getLink('book', 'closing', 'cta_work');
  const ctaScience = getLink('book', 'closing', 'cta_science');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;

      gsap.from('.monument-book-hero > *', {
        y: 32,
        opacity: 0,
        duration: 0.95,
        stagger: 0.1,
        ease: 'power3.out',
      });

      gsap.fromTo(
        '.monument-quote-slab',
        { x: -24, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.monument-quotes', start: 'top 75%', once: true },
        },
      );

      gsap.fromTo(
        '.monument-theme-row',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.monument-themes', start: 'top 80%', once: true },
        },
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <MonumentAtmosphere horizon="strong">
      <MonumentLabChrome active="book" />

      <div ref={pageRef}>
        <section className="relative px-6 pb-20 pt-32 md:px-16 md:pb-28 lg:px-24">
          <div className="monument-book-hero mx-auto grid max-w-7xl grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:gap-20">
            <div
              className="relative border p-6 md:p-8"
              style={{ borderColor: MONUMENT.rule, backgroundColor: `${MONUMENT.stone}aa` }}
            >
              <div
                className="pointer-events-none absolute inset-x-6 top-0 h-px md:inset-x-8"
                style={{ backgroundColor: MONUMENT.horizon, opacity: 0.45 }}
                aria-hidden
              />
              <img
                src={FORMLESS_BOOK_COVER.src}
                alt={FORMLESS_BOOK_COVER.alt}
                width={FORMLESS_BOOK_COVER.width}
                height={FORMLESS_BOOK_COVER.height}
                decoding="async"
                className="mx-auto aspect-[5/8] h-auto w-full max-w-[14rem] object-contain"
              />
              <p
                className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: MONUMENT.textFaint }}
              >
                {factsLine}
              </p>
              <a
                href={purchaseHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  captureCtaClick(AMAZON_PURCHASE_CTA, purchaseHref, 'monument_book_hero')
                }
                className="mt-6 flex min-h-11 w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ backgroundColor: MONUMENT.dustRed, color: MONUMENT.text }}
              >
                {AMAZON_PURCHASE_CTA}
              </a>
            </div>

            <div className="lg:pt-6">
              <MonumentEyebrow>{getText('book', 'header', 'eyebrow')}</MonumentEyebrow>
              <h1 className="max-w-2xl font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] not-italic tracking-[-0.01em]">
                {headerTitleMatch ? (
                  <>
                    <span className="block">{headerTitleMatch[1].replace(/\s+/g, ' ')}</span>
                    {headerTitleMatch[2] ? (
                      <span className="mt-3 block text-[0.72em]" style={{ color: MONUMENT.textMuted }}>
                        {headerTitleMatch[2].trim()}
                      </span>
                    ) : null}
                  </>
                ) : (
                  headerTitle
                )}
              </h1>
              <p
                className="mt-8 max-w-xl font-sans text-base leading-relaxed md:text-lg"
                style={{ color: MONUMENT.textMuted }}
              >
                {getText('book', 'header', 'lede')}
              </p>
              <div className="mt-10 max-w-md border-t pt-8" style={{ borderColor: MONUMENT.rule }}>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em]">
                  {getText('book', 'header', 'purchase_eyebrow') || 'Out now'}
                </p>
                <p className="mt-3 font-serif text-xl not-italic md:text-2xl">
                  {getText('book', 'header', 'purchase_title') || 'Start reading today.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="book-availability"
          className="border-t px-6 py-16 md:px-16 md:py-24 lg:px-24"
          style={{ borderColor: MONUMENT.rule }}
        >
          <div className="mx-auto max-w-7xl">
            <MonumentEyebrow>
              {getText('book', 'availability', 'eyebrow') || 'Available on'}
            </MonumentEyebrow>
            <h2 className="mb-12 max-w-2xl font-serif text-[clamp(1.75rem,3.5vw,3rem)] leading-tight not-italic md:mb-16">
              {getText('book', 'availability', 'title') || 'One book. Three ways in.'}
            </h2>
            <ul className="grid grid-cols-1 gap-px md:grid-cols-3" style={{ backgroundColor: MONUMENT.rule }}>
              {PLATFORMS.map((platform, index) => (
                <li
                  key={platform.id}
                  className="flex flex-col gap-4 px-6 py-8 md:px-8 md:py-10"
                  style={{ backgroundColor: MONUMENT.stone }}
                >
                  <span
                    className="font-mono text-[10px] tabular-nums tracking-[0.2em]"
                    style={{ color: MONUMENT.textFaint }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em]">{platform.label}</span>
                  <p className="font-serif text-2xl not-italic md:text-3xl">{platform.verb}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="monument-quotes border-t px-6 py-16 md:px-16 md:py-28 lg:px-24"
          style={{ borderColor: MONUMENT.rule }}
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-10 md:gap-14">
            {quotes.map((quote, i) => (
              <blockquote
                key={i}
                className="monument-quote-slab border-l-2 py-2 pl-8 font-serif text-xl leading-[1.35] not-italic whitespace-pre-line md:text-3xl"
                style={{
                  borderColor: i % 2 === 0 ? MONUMENT.dustRed : MONUMENT.turquoiseGray,
                  marginLeft: i % 2 === 1 ? 'auto' : undefined,
                  maxWidth: i % 2 === 1 ? '90%' : '100%',
                  color: MONUMENT.textMuted,
                }}
              >
                {quote}
              </blockquote>
            ))}
          </div>
        </section>

        <section
          className="monument-themes border-t px-6 py-16 md:px-16 md:py-28 lg:px-24"
          style={{ borderColor: MONUMENT.rule }}
        >
          <div className="mx-auto max-w-5xl">
            <MonumentEyebrow>{getText('book', 'themes_intro', 'eyebrow')}</MonumentEyebrow>
            <h2 className="mb-10 font-serif text-[clamp(1.75rem,3vw,2.75rem)] not-italic md:mb-16">
              {getText('book', 'themes_intro', 'title')}
            </h2>
            <ul>
              {themes.map((theme) => (
                <li
                  key={theme.label}
                  className="monument-theme-row grid gap-3 border-t py-8 md:grid-cols-[6rem_minmax(0,1fr)] md:gap-8"
                  style={{ borderColor: MONUMENT.rule }}
                >
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.28em]"
                    style={{ color: MONUMENT.dustRed }}
                  >
                    {theme.label}
                  </span>
                  <div>
                    <h3 className="font-sans text-base font-semibold leading-tight md:text-lg">{theme.title}</h3>
                    <p
                      className="mt-2 font-sans text-sm leading-relaxed md:text-base"
                      style={{ color: MONUMENT.textMuted }}
                    >
                      {theme.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="border-t px-6 py-20 text-center md:px-16 md:py-28 lg:px-24"
          style={{ borderColor: MONUMENT.rule, backgroundColor: `${MONUMENT.horizonMuted}44` }}
        >
          <p className="mx-auto mb-10 max-w-2xl font-serif text-2xl leading-snug not-italic md:text-4xl">
            {getText('book', 'closing', 'lede')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={ctaWork.href}
              onClick={() => captureCtaClick(ctaWork.text, ctaWork.href, 'monument_book_closing')}
              className="inline-flex min-h-11 items-center justify-center px-8 py-3 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ backgroundColor: MONUMENT.dustRed, color: MONUMENT.text }}
            >
              {ctaWork.text}
            </a>
            <a
              href={ctaScience.href}
              onClick={() => captureCtaClick(ctaScience.text, ctaScience.href, 'monument_book_closing')}
              className="inline-flex min-h-11 items-center justify-center border px-8 py-3 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ borderColor: MONUMENT.rule, color: MONUMENT.textMuted }}
            >
              {ctaScience.text}
            </a>
          </div>
        </section>
      </div>

      <MonumentLabFooter note="Monument book direction. Same copy, architectural slabs instead of production cards." />
    </MonumentAtmosphere>
  );
}
