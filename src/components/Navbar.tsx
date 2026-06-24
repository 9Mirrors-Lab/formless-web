import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useContent } from '@/context/ContentContext';
import { useSiteAccess } from '@/context/SiteAccessContext';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import logoWhiteSrc from '../../design/eyes-closed-logo-variations/Final-logos/09a-white-ec-notagline.svg';

const linkFocus =
  'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80';

type NavLinkItem = {
  key: string;
  text: string;
  href: string;
  isActive: boolean;
};

function resolveHomeHref(currentPath: string): string {
  if (currentPath === '/revised' || currentPath.startsWith('/revised/')) {
    return '/revised';
  }
  return '/';
}

function NavTextLink({
  href,
  text,
  isActive,
  onNavigate,
  className = '',
}: {
  href: string;
  text: string;
  isActive: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
      className={`relative inline-flex min-h-11 min-w-11 items-center justify-center px-2 transition-colors ${linkFocus} ${
        isActive ? 'text-cream' : 'text-cream/75 hover:text-cream/90'
      } ${className}`}
    >
      {text}
      <span
        className={`pointer-events-none absolute bottom-1 left-2 right-2 h-px rounded-full ${
          isActive ? 'bg-cream/90 opacity-100' : 'bg-transparent opacity-0'
        }`}
        aria-hidden
      />
    </a>
  );
}

function MobileNavLink({
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
      onClick={onNavigate}
      className={`flex min-h-11 w-full items-center rounded-lg px-4 text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${linkFocus} ${
        isActive
          ? 'bg-cream/10 text-cream'
          : 'text-cream hover:bg-cream/5 hover:text-cream'
      }`}
    >
      {text}
    </a>
  );
}

function AboutCtaLink({
  href,
  text,
  isActive,
  reducedMotion,
  onNavigate,
  className = '',
  fullWidth = false,
}: {
  href: string;
  text: string;
  isActive: boolean;
  reducedMotion: boolean;
  onNavigate?: () => void;
  className?: string;
  fullWidth?: boolean;
}) {
  const motionClass = reducedMotion
    ? ''
    : 'motion-safe:hover:scale-105 motion-safe:active:scale-95';

  return (
    <a
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 font-semibold tracking-wider transition-colors duration-300 ${linkFocus} ${motionClass} ${
        fullWidth ? 'w-full' : ''
      } ${
        isActive
          ? 'bg-moss text-white ring-2 ring-moss/30'
          : 'bg-moss text-white hover:bg-moss/90 hover:shadow-md'
      } ${className}`}
    >
      {text}
    </a>
  );
}

function BrandLogo({ name, className = '' }: { name: string; className?: string }) {
  return (
    <img
      src={logoWhiteSrc}
      alt={name}
      width={1929}
      height={865}
      className={`h-[5.75rem] w-auto translate-y-1 pb-[30px] md:h-[5.27rem] md:pb-0 ${className}`}
    />
  );
}

function BrandLink({
  href,
  name,
  onNavigate,
  className = '',
}: {
  href: string;
  name: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      aria-label={`${name} home`}
      className={`inline-flex min-h-11 shrink-0 items-center transition-opacity hover:opacity-90 ${linkFocus} ${className}`}
    >
      <BrandLogo name={name} />
    </a>
  );
}

type MobileNavPanelProps = {
  brandName: string;
  navLinks: NavLinkItem[];
  aboutCta: { text: string; href: string };
  aboutIsActive: boolean;
  reducedMotion: boolean;
  onClose: () => void;
};

function MobileNavPanel({
  brandName,
  navLinks,
  aboutCta,
  aboutIsActive,
  reducedMotion,
  onClose,
}: MobileNavPanelProps) {
  return createPortal(
    <div className="site-nav-mobile fixed inset-0 z-[100] md:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/85"
        aria-label="Close main menu"
        onClick={onClose}
      />
      <div
        id="site-nav-mobile-panel"
        className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border border-cream/10 bg-charcoal p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl shadow-black/40"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        <div className="mb-6 flex items-center justify-between">
          <BrandLogo name={brandName} className="!h-[4.8rem]" />
          <button
            type="button"
            className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream ${linkFocus}`}
            onClick={onClose}
            aria-label="Close main menu"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <ul className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <li key={link.key}>
              <MobileNavLink
                href={link.href}
                text={link.text}
                isActive={link.isActive}
                onNavigate={onClose}
              />
            </li>
          ))}
          <li className="mt-4">
            <AboutCtaLink
              href={aboutCta.href}
              text={aboutCta.text}
              isActive={aboutIsActive}
              reducedMotion={reducedMotion}
              onNavigate={onClose}
              fullWidth
            />
          </li>
        </ul>
      </div>
    </div>,
    document.body,
  );
}

export function Navbar() {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const { restricted } = useSiteAccess();
  const { getText, getLink, ordered } = useContent();
  const reducedMotion = usePrefersReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);

  const homeHref = resolveHomeHref(currentPath);
  const brandName = getText('nav', 'brand', 'name');
  const linkEntries = ordered('nav', 'links').filter((e) => e.type === 'link');
  const aboutCta = getLink('nav', 'cta', 'about');

  const navLinks: NavLinkItem[] = linkEntries.map((entry) => {
    const text = typeof entry.value.text === 'string' ? entry.value.text : '';
    const href = typeof entry.value.href === 'string' ? entry.value.href : '#';
    return {
      key: entry.key,
      text,
      href,
      isActive: currentPath === href,
    };
  });

  const aboutIsActive = currentPath === aboutCta.href;

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="site-nav fixed inset-x-0 top-0 z-40">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-charcoal/75 via-charcoal/35 to-transparent"
          aria-hidden
        />
        <nav
          aria-label="Main"
          className="site-nav__bar relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-16 md:py-6 lg:px-24"
        >
          {restricted ? (
            <span className="inline-flex min-h-11 items-center">
              <BrandLogo name={brandName} />
            </span>
          ) : (
            <BrandLink href={homeHref} name={brandName} />
          )}

          {!restricted ? (
            <div className="hidden items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] [text-shadow:0_1px_3px_rgba(26,26,26,0.45)] md:flex lg:gap-3 lg:text-[11px]">
              {navLinks.map((link) => (
                <NavTextLink
                  key={link.key}
                  href={link.href}
                  text={link.text}
                  isActive={link.isActive}
                />
              ))}
              <AboutCtaLink
                href={aboutCta.href}
                text={aboutCta.text}
                isActive={aboutIsActive}
                reducedMotion={reducedMotion}
              />
            </div>
          ) : null}

          {!restricted ? (
            <button
              type="button"
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream transition-colors hover:bg-cream/10 md:hidden ${linkFocus}`}
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="site-nav-mobile-panel"
              aria-label="Open main menu"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          ) : null}
        </nav>
      </header>

      {!restricted && mobileOpen ? (
        <MobileNavPanel
          brandName={brandName}
          navLinks={navLinks}
          aboutCta={aboutCta}
          aboutIsActive={aboutIsActive}
          reducedMotion={reducedMotion}
          onClose={closeMobile}
        />
      ) : null}
    </>
  );
}
