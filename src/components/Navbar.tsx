import { useEffect, useState } from 'react';
import { useContent } from '@/context/ContentContext';
import logoWhiteSrc from '../../design/eyes-closed-logo-variations/07a-white-transparent-ec-logo.svg';
import logoBlackSrc from '../../design/eyes-closed-logo-variations/07b-black-transparent-ec-logo.svg';

interface NavbarProps {
  /** White logo + cream links over imagery/dark fields. Black logo on cream when false. */
  onDark?: boolean;
}

export function Navbar({ onDark = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const homeHref = currentPath === '/revised' || currentPath.startsWith('/revised/')
    ? '/revised'
    : '/';
  const { getLink, ordered } = useContent();

  const linkEntries = ordered('nav', 'links').filter((e) => e.type === 'link');
  const aboutCta = getLink('nav', 'cta', 'about');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkBase = onDark
    ? 'text-cream/72 hover:text-cream'
    : 'text-charcoal/70 hover:text-charcoal';
  const linkActive = onDark ? 'text-cream' : 'text-moss';
  const underlineActive = onDark ? 'bg-cream/80' : 'bg-moss';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? onDark
            ? 'border-b border-cream/10 bg-charcoal/30 backdrop-blur-md'
            : 'border-b border-charcoal/8 bg-cream/75 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-5 md:px-16 md:py-6 lg:px-24"
      >
        <a href={homeHref} className="flex shrink-0 items-center">
          <img
            src={onDark ? logoWhiteSrc : logoBlackSrc}
            alt="Eyes Closed"
            className="h-16 w-auto sm:h-20 md:h-24 lg:h-28"
          />
        </a>

        <div className="hidden items-center gap-7 md:flex lg:gap-9">
          {linkEntries.map((entry) => {
            const text = typeof entry.value.text === 'string' ? entry.value.text : '';
            const href = typeof entry.value.href === 'string' ? entry.value.href : '#';
            const isActive = currentPath === href;
            return (
              <a
                key={entry.key}
                href={href}
                className={`relative font-sans text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 lg:text-[11px] ${
                  isActive ? linkActive : linkBase
                }`}
              >
                {text}
                <span
                  className={`pointer-events-none absolute -bottom-2 left-0 right-0 h-px transition-opacity ${
                    isActive ? `${underlineActive} opacity-100` : 'opacity-0'
                  }`}
                  aria-hidden
                />
              </a>
            );
          })}
          <a
            href={aboutCta.href}
            className={`rounded-full border px-4 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 lg:text-[11px] ${
              onDark
                ? currentPath === '/about'
                  ? 'border-cream/50 bg-cream/12 text-cream'
                  : 'border-cream/25 text-cream/85 hover:border-cream/45 hover:bg-cream/8'
                : currentPath === '/about'
                  ? 'border-moss bg-moss text-cream'
                  : 'border-charcoal/20 text-charcoal hover:border-moss hover:text-moss'
            }`}
          >
            {aboutCta.text}
          </a>
        </div>
      </nav>
    </header>
  );
}
