import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X } from 'lucide-react';
import type { MobileNavPanelProps, NavLinkItem } from './Navbar';
import { captureCtaClick } from '@/lib/analytics';
import logoWhiteSrc from '../../design/eyes-closed-logo-variations/Final-logos/09a-white-ec-notagline.svg';

const linkFocus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80';

function ShroudNavLink({
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
        captureCtaClick(text, href, 'navbar_mobile_shroud');
        onNavigate();
      }}
      className={`shroud-link flex min-h-11 w-full items-center px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${linkFocus} ${
        isActive ? 'text-cream' : 'text-cream/60 hover:text-cream'
      }`}
    >
      {text}
    </a>
  );
}

export function MobileNavShroud({
  brandName,
  navLinks,
  aboutCta,
  aboutIsActive,
  onClose,
}: MobileNavPanelProps) {
  const backdropRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleClose = useCallback(() => {
    if (prefersReducedMotion) {
      onClose();
      return;
    }
    const tl = gsap.timeline({ onComplete: onClose });
    const linkEls = linksRef.current?.querySelectorAll('.shroud-link') ?? [];
    if (linkEls.length) tl.to(linkEls, { opacity: 0, duration: 0.1 }, 0);
    tl.to(panelRef.current, { clipPath: 'inset(0 100% 0 0)', duration: 0.35, ease: 'power3.in' }, 0);
    tl.to(backdropRef.current, { opacity: 0, duration: 0.3 }, 0);
  }, [onClose, prefersReducedMotion]);

  // Open animation on mount
  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const linkEls = linksRef.current?.querySelectorAll('.shroud-link') ?? [];
      // Panel clipPath hides links during initial set — no flash risk
      gsap.set(accentLineRef.current, { scaleY: 0, transformOrigin: 'top center' });
      if (linkEls.length) gsap.set(linkEls, { opacity: 0, x: 16 });

      const tl = gsap.timeline();
      tl.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0);
      tl.to(panelRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'power3.out' }, 0);
      tl.to(accentLineRef.current, { scaleY: 1, duration: 0.4, ease: 'power2.inOut' }, 0.1);
      if (linkEls.length) {
        tl.to(linkEls, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out', stagger: 0.06 }, 0.25);
      }
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

  const allLinks: NavLinkItem[] = [
    ...navLinks,
    { key: 'about', text: aboutCta.text, href: aboutCta.href, isActive: aboutIsActive },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[100] md:hidden" role="presentation">
      {/* Darkened backdrop — tapping closes the menu */}
      <button
        ref={backdropRef}
        type="button"
        style={{ opacity: 0 }}
        className="absolute inset-0 bg-charcoal/40"
        aria-label="Close main menu"
        onClick={handleClose}
      />

      {/* Panel — clips in from right, 72% width */}
      <div
        ref={panelRef}
        id="site-nav-mobile-panel"
        style={{ clipPath: 'inset(0 100% 0 0)' }}
        className="absolute bottom-0 right-0 top-0 w-[72%] bg-charcoal/90 backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        {/* Accent line — draws down the left edge as the panel opens */}
        <div
          ref={accentLineRef}
          className="absolute bottom-0 left-0 top-0 w-px bg-cream/20"
          aria-hidden
        />

        {/* Header row: close button */}
        <div className="flex items-center justify-end p-4">
          <button
            type="button"
            className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream ${linkFocus}`}
            onClick={handleClose}
            aria-label="Close main menu"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Logo */}
        <div className="px-6 pb-6">
          <img
            src={logoWhiteSrc}
            alt={brandName}
            width={1929}
            height={865}
            className="h-[5rem] w-auto"
          />
        </div>

        {/* Nav links */}
        <ul ref={linksRef} className="flex flex-col">
          {allLinks.map((link) => (
            <li key={link.key}>
              <ShroudNavLink
                href={link.href}
                text={link.text}
                isActive={link.isActive}
                onNavigate={handleClose}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
