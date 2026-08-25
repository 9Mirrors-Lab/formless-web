import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageLayout } from '../components/PageLayout';
import { ParticleButton } from '../components/ParticleButton';
import { BookReleaseNotifyForm } from '../components/BookReleaseNotifyForm';
import { BookAvailabilitySection } from '../components/BookAvailabilitySection';
import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import {
  HelixTeachingLockup,
  beatsFromQuotes,
} from '@/components/HelixTeachingLockup';
import { useContent, type ContentApi } from '@/context/ContentContext';
import { useIconAnimations } from '@/hooks/useIconAnimations';

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

const notifyFormProps = (
  notifySubhead: string,
  notifyCta: string,
  notifyMetaRelease: string,
  notifyMetaUpdates: string,
  notifySuccess: string,
  notifyError: string,
) => ({
  subheadline: notifySubhead,
  ctaLabel: notifyCta,
  metaRelease: notifyMetaRelease,
  metaUpdates: notifyMetaUpdates,
  successTitle: notifySuccess || "You're on the list.",
  errorMessage: notifyError,
});

export default function BookPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const availabilityRef = useRef<HTMLDivElement>(null);
  const quotesRef = useRef<HTMLDivElement>(null);
  const themesRef = useRef<HTMLDivElement>(null);
  const [dockRoot, setDockRoot] = useState<HTMLElement | null>(null);
  const content = useContent();
  const { getText, getLink, ordered, textFromEntry } = content;
  const themes = themesFromContent(content);
  const quotes = ordered('book', 'quotes').map(textFromEntry);
  const helixBeats = beatsFromQuotes(quotes);
  useIconAnimations(pageRef);

  const ctaWork = getLink('book', 'closing', 'cta_work');
  const ctaScience = getLink('book', 'closing', 'cta_science');
  const notifySubhead = getText('book', 'header', 'notify_heading');
  const notifyCta = getText('book', 'header', 'notify_cta');
  const notifyMetaRelease = getText('book', 'header', 'notify_meta_release');
  const notifyMetaUpdates = getText('book', 'header', 'notify_meta_updates');
  const notifySuccess = getText('book', 'header', 'notify_success');
  const notifyError = getText('book', 'header', 'notify_error');
  const headerTitle = getText('book', 'header', 'title');
  const headerTitleMatch = headerTitle.match(/^(The book,\s*Formless)\s*(.*)$/i);
  const headerEyebrow = getText('book', 'header', 'eyebrow');
  const headerLede = getText('book', 'header', 'lede');
  const availabilityEyebrow = getText('book', 'availability', 'eyebrow') || 'Available on';
  const availabilityTitle =
    getText('book', 'availability', 'title') || 'One book. Three ways in.';

  const sharedNotifyProps = notifyFormProps(
    notifySubhead,
    notifyCta,
    notifyMetaRelease,
    notifyMetaUpdates,
    notifySuccess,
    notifyError,
  );

  // Portal the dock to body so PageLayout's GSAP transform cannot trap `fixed`.
  useEffect(() => {
    setDockRoot(document.body);
  }, []);

  useLayoutEffect(() => {
    if (!dockRoot) return;
    const dock = document.querySelector('.book-notify-dock');
    if (!dock) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const tween = gsap.fromTo(
      dock,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power3.out',
        delay: 0.35,
        clearProps: 'transform',
      },
    );
    return () => {
      tween.kill();
    };
  }, [dockRoot]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

      if (!reduceMotion) {
        gsap.fromTo(
          '.book-title',
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut', delay: 0.2 },
        );
        gsap.fromTo(
          '.book-mobile-brand',
          { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
          { clipPath: 'inset(0 0% 0 0)', duration: 1.15, ease: 'power3.inOut', delay: 0.15 },
        );
        gsap.fromTo(
          '.book-hero-vesica',
          { opacity: 0, scale: 0.88, rotate: -8 },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.35,
            clearProps: 'transform',
          },
        );
        gsap.fromTo(
          '.book-notify-panel',
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 },
        );
      }

      gsap.fromTo(
        '.availability-platform',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: availabilityRef.current,
            start: 'top 75%',
            once: true,
          },
        },
      );
      const desktopQuotes = gsap.utils.toArray<HTMLElement>('.pull-quote-desktop');

      if (desktopQuotes.length) {
        gsap.fromTo(
          desktopQuotes,
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
      }
      gsap.fromTo(
        '.theme-card, .theme-row',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: themesRef.current, start: 'top 82%', once: true },
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
          className="site-page-header relative w-full overflow-x-hidden px-6 pb-12 md:px-16 md:pb-16 lg:px-24"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="sci-blob-1 absolute top-[10%] left-[15%] h-[500px] w-[500px] rounded-full bg-moss/10 blur-[120px] will-change-transform" />
            <div className="sci-blob-2 absolute bottom-[5%] right-[10%] h-[400px] w-[400px] rounded-full bg-clay/6 blur-[100px] will-change-transform" />
          </div>

          <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-20">
            {/* Mobile: type owns the first beat · vesica as off-center top mark */}
            <div className="book-mobile-brand relative flex flex-col md:hidden">
              <div
                className="book-hero-vesica pointer-events-none absolute -right-5 top-0 z-0 opacity-[0.8]"
                aria-hidden="true"
              >
                <TeachingIconMark id="space" theme="dark" size={132} />
              </div>

              <div className="relative z-10 mt-28 max-w-[85%]">
                <span className="mb-4 block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-cream/40">
                  {headerEyebrow}
                </span>
                <h1 className="text-cream">
                  <span className="block font-serif text-[clamp(4.25rem,22vw,6rem)] italic leading-[0.9] tracking-[-0.03em]">
                    Formless
                  </span>
                  <span className="mt-4 block max-w-[16ch] font-serif text-[1.55rem] font-normal not-italic leading-[1.22] text-cream/88">
                    {headerTitleMatch?.[2]?.trim()
                      ? `The book ${headerTitleMatch[2].trim()}`
                      : headerTitle}
                  </span>
                </h1>
                <p className="mt-5 max-w-sm font-sans text-base leading-relaxed text-cream/60">
                  {headerLede}
                </p>
              </div>
            </div>

            {/* Desktop: incumbent title block */}
            <div className="hidden max-w-xl md:block">
              <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-cream/30">
                {headerEyebrow}
              </span>
              <h1 className="book-title mb-8 pb-[0.06em] font-serif text-[clamp(1.85rem,3.2vw,2.75rem)] leading-[1.18] tracking-[-0.01em] text-cream">
                {headerTitleMatch ? (
                  <>
                    <span className="whitespace-nowrap">
                      {headerTitleMatch[1].replace(/\s+/g, ' ')}
                    </span>
                    {headerTitleMatch[2] ? ` ${headerTitleMatch[2]}` : null}
                  </>
                ) : (
                  headerTitle
                )}
              </h1>
              <p className="max-w-lg font-sans text-lg leading-relaxed text-cream/55 md:text-xl">
                {headerLede}
              </p>
            </div>

            {/* Desktop waitlist card */}
            <div className="book-notify-panel hidden w-full max-w-md justify-self-end md:block">
              <BookReleaseNotifyForm variant="card" {...sharedNotifyProps} />
            </div>
          </div>
        </section>

        <div ref={availabilityRef}>
          <BookAvailabilitySection
            eyebrow={availabilityEyebrow}
            title={availabilityTitle}
          />
        </div>

        <section
          ref={quotesRef}
          className="w-full border-t border-cream/8 px-6 pt-12 pb-0 md:px-16 md:py-28 lg:px-24"
        >
          {/* Mobile: Trace helix rooted into the themes hairline (clean stroke, not dust) */}
          <div className="md:hidden">
            <HelixTeachingLockup
              motion="trace"
              playback="once"
              beats={helixBeats}
              brandLabel={null}
              rooted
            />
          </div>

          {/* Desktop pull quotes */}
          <div className="mx-auto hidden max-w-4xl flex-col gap-16 md:flex md:pb-0">
            {quotes.map((quote, i) => (
              <blockquote
                key={i}
                className="pull-quote-desktop border-l-2 border-clay/30 pl-8 font-serif text-2xl italic leading-[1.3] text-cream/70 whitespace-pre-line md:text-4xl"
              >
                {quote}
              </blockquote>
            ))}
          </div>
        </section>

        <section
          ref={themesRef}
          className="w-full px-6 pb-10 pt-8 md:border-t md:border-cream/8 md:px-16 md:py-28 lg:px-24"
        >
          <div className="mx-auto max-w-7xl">
            <span className="mb-3 block font-mono text-xs font-semibold uppercase tracking-[0.3em] text-cream/40 md:mb-6 md:font-normal">
              {getText('book', 'themes_intro', 'eyebrow')}
            </span>
            <h2 className="mb-6 font-serif text-3xl italic leading-tight text-cream/90 md:mb-16 md:text-5xl">
              {getText('book', 'themes_intro', 'title')}
            </h2>

            {/* Mobile: quiet hairline list */}
            <ul className="md:hidden">
              {themes.map((theme) => (
                <li
                  key={theme.label}
                  className="theme-row border-t border-charcoal/10 py-5 last:border-b"
                >
                  <span className="mb-2 block font-mono text-xs font-semibold uppercase tracking-[0.3em] text-clay">
                    {theme.label}
                  </span>
                  <h3 className="mb-2 font-sans text-base font-bold leading-tight text-charcoal">
                    {theme.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-charcoal/55">
                    {theme.desc}
                  </p>
                </li>
              ))}
            </ul>

            {/* Desktop: incumbent cards */}
            <div className="hidden grid-cols-2 gap-5 md:grid lg:grid-cols-4">
              {themes.map((theme) => (
                <div
                  key={theme.label}
                  className="theme-card group rounded-2xl border border-charcoal/8 bg-white/40 p-8 transition-all duration-[400ms] ease-[cubic-bezier(.16,1,.3,1)] hover:border-moss/30 hover:bg-moss/5 lg:p-6 xl:p-8"
                >
                  <span className="mb-3 block font-mono text-xs font-semibold uppercase tracking-[0.3em] text-clay">
                    {theme.label}
                  </span>
                  <h3 className="mb-3 font-sans text-base font-bold leading-tight text-charcoal lg:text-[0.875rem] xl:text-base 2xl:text-lg">
                    {theme.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-charcoal/55">
                    {theme.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full rounded-t-[2rem] bg-charcoal px-6 pt-16 pb-[7.75rem] text-center md:rounded-t-[3rem] md:px-16 md:py-24 lg:px-24">
          <p className="mx-auto mb-8 max-w-lg font-serif text-2xl italic leading-snug text-cream/70 md:mb-10 md:text-4xl">
            {getText('book', 'closing', 'lede')}
          </p>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ParticleButton
              href={ctaWork.href}
              trackLocation="book_closing"
              trackLabel={ctaWork.text}
            >
              {ctaWork.text}
            </ParticleButton>
            <ParticleButton
              href={ctaScience.href}
              variant="secondary"
              trackLocation="book_closing"
              trackLabel={ctaScience.text}
            >
              {ctaScience.text}
            </ParticleButton>
          </div>
        </section>

        {dockRoot
          ? createPortal(
              <div
                className="book-notify-dock fixed inset-x-0 bottom-0 z-30 border-t border-cream/12 bg-[#080a09]/94 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
                role="region"
                aria-label="Book waitlist"
              >
                <div className="mx-auto max-w-lg">
                  <BookReleaseNotifyForm variant="dock" {...sharedNotifyProps} />
                </div>
              </div>,
              dockRoot,
            )
          : null}
      </div>
    </PageLayout>
  );
}
