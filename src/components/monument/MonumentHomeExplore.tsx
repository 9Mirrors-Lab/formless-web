import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '@/context/ContentContext';
import { useSiteAccess } from '@/context/SiteAccessContext';
import { FORMLESS_BOOK_COVER } from '@/data/bookCover';
import {
  AMAZON_PURCHASE_CTA,
  PREORDER_FACTS,
  kindlePreorderHref,
} from '@/data/preorderLanding';
import { captureCtaClick } from '@/lib/analytics';
import { stripAnchorsFromCopy } from '@/lib/stripCopyLinks';
import { MonumentAtmosphere } from './MonumentAtmosphere';
import { MonumentLabChrome, MonumentLabFooter } from './MonumentLabChrome';
import { MONUMENT } from './monumentShared';

gsap.registerPlugin(ScrollTrigger);

function MonumentEyebrow({ children }: { children: string }) {
  return (
    <span
      className="mb-6 block font-mono text-[10px] uppercase tracking-[0.32em]"
      style={{ color: MONUMENT.turquoiseGray }}
    >
      {children}
    </span>
  );
}

function MonumentCta({
  href,
  label,
  trackLocation,
  variant = 'primary',
}: {
  href: string;
  label: string;
  trackLocation: string;
  variant?: 'primary' | 'ghost';
}) {
  const primary = variant === 'primary';
  return (
    <a
      href={href}
      onClick={() => captureCtaClick(label, href, trackLocation)}
      className="inline-flex min-h-11 items-center justify-center px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        backgroundColor: primary ? MONUMENT.dustRed : 'transparent',
        color: primary ? MONUMENT.text : MONUMENT.textMuted,
        border: primary ? 'none' : `1px solid ${MONUMENT.rule}`,
        outlineColor: MONUMENT.turquoiseGray,
      }}
    >
      {label}
    </a>
  );
}

export function MonumentHomeExplore() {
  const heroRef = useRef<HTMLElement>(null);
  const slabRef = useRef<HTMLElement>(null);
  const { restricted } = useSiteAccess();
  const { getText, getLink } = useContent();

  const t = (key: string) => {
    const raw = getText('home', 'hero', key);
    return restricted ? stripAnchorsFromCopy(raw) : raw;
  };

  const curtain = (key: string) => {
    const raw = getText('home', 'curtain', key);
    return restricted ? stripAnchorsFromCopy(raw) : raw;
  };

  const cta = restricted ? null : getLink('home', 'hero', 'cta_reflection');
  const purchaseHref = kindlePreorderHref();
  const factsLine = `Amazon · ${PREORDER_FACTS.price} · ${PREORDER_FACTS.format}`;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;

      gsap.from('.monument-hero-copy > *', {
        y: 28,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.15,
      });

      gsap.from('.monument-hero-slab', {
        x: 48,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.35,
      });

      gsap.fromTo(
        '.monument-teaching-slab',
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: slabRef.current, start: 'top 78%', once: true },
        },
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <MonumentAtmosphere>
      <MonumentLabChrome active="home" />

      <section
        ref={heroRef}
        className="relative flex min-h-[100dvh] flex-col justify-end px-6 pb-16 pt-32 md:px-16 md:pb-24 lg:px-24"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,22rem)] lg:gap-10">
          <div className="monument-hero-copy max-w-2xl lg:pb-8">
            <MonumentEyebrow>{t('eyebrow')}</MonumentEyebrow>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] not-italic">
              <span className="block">{t('headline_primary')}</span>
              <span className="mt-2 block" style={{ color: MONUMENT.textMuted }}>
                {t('headline_secondary')}
              </span>
            </h1>
            <p
              className="mt-8 max-w-lg whitespace-pre-line font-sans text-base leading-relaxed md:text-lg"
              style={{ color: MONUMENT.textMuted }}
            >
              {t('lede')}
            </p>
            {cta ? (
              <div className="mt-10">
                <MonumentCta
                  href={cta.href}
                  label={cta.text}
                  trackLocation="monument_home_hero"
                  variant="ghost"
                />
              </div>
            ) : null}
          </div>

          <aside
            className="monument-hero-slab relative border p-6 md:p-8 lg:justify-self-end"
            style={{
              borderColor: MONUMENT.rule,
              backgroundColor: `${MONUMENT.stone}cc`,
            }}
            aria-label="Formless eBook"
          >
            <div
              className="pointer-events-none absolute -left-px top-8 h-24 w-px"
              style={{ backgroundColor: MONUMENT.dustRed }}
              aria-hidden
            />
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
              <img
                src={FORMLESS_BOOK_COVER.src}
                alt={FORMLESS_BOOK_COVER.alt}
                width={FORMLESS_BOOK_COVER.width}
                height={FORMLESS_BOOK_COVER.height}
                decoding="async"
                className="aspect-[5/8] h-auto w-[9.5rem] shrink-0 object-contain"
              />
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em]">Out now</p>
                <p className="mt-3 font-serif text-[1.35rem] leading-[1.15] not-italic md:text-[1.5rem]">
                  The eBook
                  <br />
                  is out now.
                </p>
                <p
                  className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: MONUMENT.horizon }}
                >
                  {factsLine}
                </p>
                <a
                  href={purchaseHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    captureCtaClick(AMAZON_PURCHASE_CTA, purchaseHref, 'monument_home_book_slab')
                  }
                  className="mt-6 inline-flex min-h-11 items-center justify-center px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300"
                  style={{ backgroundColor: MONUMENT.dustRed, color: MONUMENT.text }}
                >
                  {AMAZON_PURCHASE_CTA}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        ref={slabRef}
        className="relative border-t px-6 py-24 md:px-16 md:py-36 lg:px-24"
        style={{ borderColor: MONUMENT.rule }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:pt-16">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.28em]"
              style={{ color: MONUMENT.dustRed }}
            >
              {curtain('panel_left')} · {curtain('panel_right')}
            </p>
          </div>
          <div
            className="monument-teaching-slab border px-8 py-12 md:px-14 md:py-16"
            style={{
              borderColor: MONUMENT.rule,
              backgroundColor: MONUMENT.stone,
            }}
          >
            <h2 className="max-w-3xl font-serif text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.08] not-italic">
              {curtain('headline_line1')}
              {curtain('headline_line2') ? (
                <>
                  <br />
                  <span style={{ color: MONUMENT.turquoiseGray }}>{curtain('headline_line2')}</span>
                </>
              ) : null}
            </h2>
            <p
              className="mt-8 max-w-xl whitespace-pre-line font-sans text-base leading-relaxed md:text-lg"
              style={{ color: MONUMENT.textMuted }}
            >
              {curtain('subtitle')}
            </p>
          </div>
        </div>
      </section>

      <MonumentLabFooter note="Southwestern monument direction for home. Matte charcoal, angular mass, horizon tension." />
    </MonumentAtmosphere>
  );
}
