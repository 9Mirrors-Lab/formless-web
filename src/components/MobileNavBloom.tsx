import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X } from 'lucide-react';
import type { MobileNavPanelProps, NavLinkItem } from './Navbar';
import { captureCtaClick } from '@/lib/analytics';

const linkFocus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80';

// Hamburger button center: right padding (px-5=1.25rem) + half min-w-11 (1.375rem) from right edge;
// top padding (py-4=1rem) + half min-h-11 (1.375rem) from top
const BLOOM_ORIGIN = 'calc(100% - 2.625rem) 2.5rem';

function BloomNavLink({
  href,
  text,
  isActive,
  onNavigate,
}: {
  href: string;
  text: string;
  isActive: boolean;
  onNavigate: () => void;
}) {
  return (
    <a
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={() => {
        captureCtaClick(text, href, 'navbar_mobile_bloom');
        onNavigate();
      }}
      className={`bloom-link inline-flex min-h-11 w-full items-center justify-center rounded-full px-8 py-3 text-xl font-semibold uppercase tracking-[0.12em] transition-colors ${linkFocus} ${
        isActive ? 'bg-cream/10 text-cream' : 'text-cream/70 hover:text-cream'
      }`}
    >
      {text}
    </a>
  );
}

export function MobileNavBloom({
  navLinks,
  aboutCta,
  aboutIsActive,
  onClose,
}: MobileNavPanelProps) {
  const scrimRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartY = useRef<number>(0);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleClose = useCallback(() => {
    if (prefersReducedMotion) {
      onClose();
      return;
    }
    const tl = gsap.timeline({ onComplete: onClose });
    const linkEls = linksRef.current?.querySelectorAll('.bloom-link') ?? [];
    if (linkEls.length) {
      tl.to(linkEls, { opacity: 0, y: 20, duration: 0.2, ease: 'power2.in', stagger: 0.04 }, 0);
    }
    tl.to(closeButtonRef.current, { opacity: 0, duration: 0.15 }, 0);
    tl.to(
      scrimRef.current,
      { clipPath: `circle(0px at ${BLOOM_ORIGIN})`, opacity: 0, duration: 0.4, ease: 'power3.in' },
      0.1,
    );
  }, [onClose, prefersReducedMotion]);

  // Open animation on mount
  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const linkEls = linksRef.current?.querySelectorAll('.bloom-link') ?? [];
      // Scrim clipPath hides content initially — no flash risk for links
      if (linkEls.length) gsap.set(linkEls, { opacity: 0, y: 32 });

      const tl = gsap.timeline();
      tl.to(
        scrimRef.current,
        {
          clipPath: `circle(200vmax at ${BLOOM_ORIGIN})`,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
        },
        0,
      );
      if (linkEls.length) {
        tl.to(
          linkEls,
          { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)', stagger: 0.08 },
          0.2,
        );
      }
      tl.to(closeButtonRef.current, { opacity: 1, duration: 0.2 }, 0.35);
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (delta > 60) handleClose();
  };

  const allLinks: NavLinkItem[] = [
    ...navLinks,
    { key: 'about', text: aboutCta.text, href: aboutCta.href, isActive: aboutIsActive },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] md:hidden"
      role="presentation"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Bloom scrim — circle expands from hamburger button position */}
      <div
        ref={scrimRef}
        id="site-nav-mobile-panel"
        style={{ clipPath: `circle(0px at ${BLOOM_ORIGIN})`, opacity: 0 }}
        className="absolute inset-0 bg-charcoal/80 backdrop-blur-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          style={{ opacity: 0 }}
          className={`absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream ${linkFocus}`}
          onClick={handleClose}
          aria-label="Close main menu"
          autoFocus
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        {/* Centered nav links */}
        <div className="flex h-full flex-col items-center justify-center px-8">
          <ul
            ref={linksRef}
            className="flex w-full max-w-xs flex-col items-center gap-3"
          >
            {allLinks.map((link) => (
              <li key={link.key} className="w-full">
                <BloomNavLink
                  href={link.href}
                  text={link.text}
                  isActive={link.isActive}
                  onNavigate={handleClose}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}
