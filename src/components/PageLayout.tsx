import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

gsap.registerPlugin(ScrollTrigger);

interface PageLayoutProps {
  children: ReactNode;
  /** Hide floating nav (e.g. restricted public home). */
  hideNav?: boolean;
  /** Optional dark mode for pages like The Work that use dark backgrounds */
  dark?: boolean;
  /** White logo + cream links (e.g. home hero, dark pages). Defaults from dark/briefSpectrum. */
  navOnDark?: boolean;
  /**
   * Brief page palette: deep #080a09 field, radial clay/moss wash, cream type,
   * and `brief-dark` token overrides on main (charcoal → cream, glass cards).
   * Scoped to `<main>` so the floating navbar keeps its own contrast.
   */
  briefSpectrum?: boolean;
}

export function PageLayout({
  children,
  hideNav = false,
  dark = false,
  navOnDark,
  briefSpectrum = false,
}: PageLayoutProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount (page change)
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, []);

  // Page fade-in on mount
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(pageRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const outerSurface = briefSpectrum
    ? 'relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#080a09] font-sans antialiased'
    : dark
      ? 'relative w-full min-h-screen overflow-x-hidden bg-charcoal text-cream'
      : 'relative w-full min-h-screen overflow-x-hidden bg-cream text-charcoal font-sans selection:bg-moss selection:text-cream';

  const noiseClass = briefSpectrum ? 'noise-overlay-dark' : 'noise-overlay';

  const mainClass = briefSpectrum
    ? 'brief-dark relative z-10 flex flex-1 flex-col text-cream selection:bg-clay/35 selection:text-cream'
    : 'relative z-10 flex flex-col';

  const resolvedNavOnDark = navOnDark ?? (dark || briefSpectrum);

  return (
    <div ref={pageRef} className={outerSurface}>
      <div className={noiseClass} aria-hidden />
      {!hideNav ? <Navbar onDark={resolvedNavOnDark} /> : null}
      <main className={mainClass}>{children}</main>
      <Footer />
    </div>
  );
}
