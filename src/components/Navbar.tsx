import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useContent } from '@/context/ContentContext';
import { useAuth } from '@/context/AuthContext';
import { isMemberAuthNavEnabled } from '@/config/memberAuth';
import { useSiteAccess } from '@/context/SiteAccessContext';
import { BackgroundPicker } from '@/components/shader/BackgroundPicker';
import { useBackgroundSelection } from '@/components/shader/BackgroundSelectionContext';
import logoWhiteSrc from '../../design/eyes-closed-logo-variations/Final-logos/09a-white-ec-notagline.svg';

const linkFocus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80';

type NavLinkPosition = 'first' | 'middle' | 'last';

function navLinkRadius(_position: NavLinkPosition): string {
  return 'rounded-full';
}

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

function isHomePath(currentPath: string): boolean {
  return currentPath === '/' || currentPath === '/revised';
}

function NavTextLink({
  href,
  text,
  isActive,
  onNavigate,
  position = 'middle',
  className = '',
}: {
  href: string;
  text: string;
  isActive: boolean;
  onNavigate?: () => void;
  position?: NavLinkPosition;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
      className={`inline-flex items-center px-4 py-2 text-[10px] font-medium uppercase tracking-wider opacity-100 transition-all duration-300 lg:px-5 lg:text-[11px] ${navLinkRadius(position)} ${linkFocus} ${
        isActive
          ? 'bg-white/10 text-white'
          : 'text-white/55 hover:bg-white/5 hover:text-white/85'
      } ${className}`}
    >
      {text}
    </a>
  );
}

function AccountNavLink({
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
      className={`inline-flex min-h-11 shrink-0 items-center rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[10px] font-medium uppercase tracking-wider backdrop-blur-md transition-all duration-300 lg:px-5 lg:text-[11px] ${linkFocus} ${
        isActive
          ? 'border-white/35 bg-white/10 text-white'
          : 'text-white/70 hover:border-white/30 hover:bg-white/5 hover:text-white'
      } ${className}`}
    >
      {text}
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

function BrandLogo({ name, className = '' }: { name: string; className?: string }) {
  return (
    <img
      src={logoWhiteSrc}
      alt={name}
      width={1929}
      height={865}
      className={`h-[6.9rem] w-auto translate-y-1 pb-[30px] md:h-[6.324rem] md:pb-0 ${className}`}
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
  onClose: () => void;
};

function MobileNavPanel({
  brandName,
  navLinks,
  aboutCta,
  aboutIsActive,
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
          <BrandLogo name={brandName} className="!h-[5.76rem]" />
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
          <li>
            <MobileNavLink
              href={aboutCta.href}
              text={aboutCta.text}
              isActive={aboutIsActive}
              onNavigate={onClose}
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
  const { status: authStatus, user } = useAuth();
  const { getText, getLink, ordered } = useContent();
  const [mobileOpen, setMobileOpen] = useState(false);

  const homeHref = resolveHomeHref(currentPath);
  const alignWithPageContent = !isHomePath(currentPath);
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
  const accountHref = user ? '/account' : '/login';
  const accountLabel = user ? 'Account' : 'Sign in';
  const accountIsActive = currentPath === accountHref;
  const showAccountLink = isMemberAuthNavEnabled() && authStatus !== 'misconfigured';

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

  const backgroundSelection = useBackgroundSelection();
  const backgroundPicker = backgroundSelection ? (
    <BackgroundPicker
      placement="nav"
      value={backgroundSelection.value}
      onChange={backgroundSelection.onChange}
    />
  ) : null;

  return (
    <>
      <header className="site-nav fixed inset-x-0 top-0 z-40">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-charcoal/75 via-charcoal/35 to-transparent"
          aria-hidden
        />
        <nav
          aria-label="Main"
          className={
            alignWithPageContent
              ? 'site-nav__shell relative px-6 py-4 md:px-16 md:py-6 lg:px-24'
              : 'site-nav__shell relative px-5 py-4 md:px-16 md:py-6 lg:px-24'
          }
        >
          <div
            className={`site-nav__bar relative flex items-center justify-between gap-4 ${
              alignWithPageContent ? 'site-nav__bar--align-content mx-auto max-w-6xl' : 'mx-auto max-w-7xl'
            }`}
          >
          {restricted ? (
            <span
              className={`inline-flex min-h-11 items-center${alignWithPageContent ? ' site-nav__brand' : ''}`}
            >
              <BrandLogo name={brandName} />
            </span>
          ) : (
            <BrandLink
              href={homeHref}
              name={brandName}
              className={alignWithPageContent ? 'site-nav__brand' : ''}
            />
          )}

          {!restricted ? (
            <div className="hidden items-center gap-3 md:flex">
              <div
                className="flex items-stretch gap-1 rounded-full border border-white/15 bg-black/25 p-1 shadow-inner backdrop-blur-md lg:gap-1.5 lg:p-1.5"
                role="group"
                aria-label="Main navigation"
              >
                {navLinks.map((link, index) => (
                  <NavTextLink
                    key={link.key}
                    href={link.href}
                    text={link.text}
                    isActive={link.isActive}
                    position={index === 0 ? 'first' : 'middle'}
                  />
                ))}
                <NavTextLink
                  href={aboutCta.href}
                  text={aboutCta.text}
                  isActive={aboutIsActive}
                  position="last"
                />
              </div>
              {backgroundPicker}
              {showAccountLink ? (
                <AccountNavLink
                  href={accountHref}
                  text={accountLabel}
                  isActive={accountIsActive}
                />
              ) : null}
            </div>
          ) : null}

          {!restricted ? (
            <div className="flex items-center gap-2 md:hidden">
              {backgroundPicker}
              {showAccountLink ? (
                <AccountNavLink
                  href={accountHref}
                  text={accountLabel}
                  isActive={accountIsActive}
                />
              ) : null}
              <button
                type="button"
                className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream transition-colors hover:bg-cream/10 ${linkFocus}`}
                onClick={() => setMobileOpen(true)}
                aria-expanded={mobileOpen}
                aria-controls="site-nav-mobile-panel"
                aria-label="Open main menu"
              >
                <Menu className="h-5 w-5" aria-hidden />
              </button>
            </div>
          ) : null}
          </div>
        </nav>
      </header>

      {!restricted && mobileOpen ? (
        <MobileNavPanel
          brandName={brandName}
          navLinks={navLinks}
          aboutCta={aboutCta}
          aboutIsActive={aboutIsActive}
          onClose={closeMobile}
        />
      ) : null}
    </>
  );
}
