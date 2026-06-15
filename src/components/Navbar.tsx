import { useContent } from '@/context/ContentContext';
import logoLockupSrc from '../../design/eyes-closed-logo-variations/07b-black-transparent-ec-logo.svg';

export function Navbar() {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const homeHref = currentPath === '/revised' || currentPath.startsWith('/revised/')
    ? '/revised'
    : '/';
  const { getLink, ordered } = useContent();

  const linkEntries = ordered('nav', 'links').filter((e) => e.type === 'link');
  const aboutCta = getLink('nav', 'cta', 'about');

  return (
    <div className="fixed top-6 left-1/2 z-50 w-[95%] max-w-6xl -translate-x-1/2">
      <nav
        aria-label="Main"
        className="relative flex min-h-11 items-center justify-end gap-6 rounded-full border border-charcoal/10 bg-white py-2 pl-[13.75rem] pr-5 shadow-sm transition-all duration-700 md:min-h-12 md:gap-8 md:pl-[14.75rem] md:pr-8"
      >
        <a
          href={homeHref}
          aria-label="Eyes Closed home"
          className="group absolute left-5 top-1/2 z-10 block h-[8.25rem] w-[13rem] -translate-y-1/2 transform-gpu transition-transform duration-500 ease-out hover:scale-[1.03] focus-visible:scale-[1.03] focus-visible:outline-none md:left-9 md:h-[8.25rem] md:w-[13rem]"
          style={{
            filter:
              'drop-shadow(0 8px 18px rgba(26,26,26,0.12)) drop-shadow(0 2px 4px rgba(26,26,26,0.08))',
          }}
        >
          <svg
            viewBox="0 0 120 152"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden
            preserveAspectRatio="none"
          >
            <rect
              x="1"
              y="1"
              width="118"
              height="150"
              rx="8"
              fill="#ffffff"
              stroke="#1a1a1a"
              strokeOpacity="0.22"
              strokeWidth="1"
            />
            <rect
              x="5"
              y="5"
              width="110"
              height="142"
              rx="6"
              stroke="#1a1a1a"
              strokeOpacity="0.06"
              strokeWidth="0.6"
              fill="none"
            />
          </svg>

          <div className="absolute inset-x-0 bottom-1 top-[12%] flex items-center justify-center px-3 text-center">
            <img
              src={logoLockupSrc}
              alt="Eyes Closed"
              className="h-full w-full scale-[1.02] object-contain object-center"
            />
          </div>
        </a>

        <div className="hidden items-center gap-8 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal md:flex lg:gap-9 lg:text-[11px]">
          {linkEntries.map((entry) => {
            const text = typeof entry.value.text === 'string' ? entry.value.text : '';
            const href = typeof entry.value.href === 'string' ? entry.value.href : '#';
            const isActive = currentPath === href;
            return (
              <a
                key={entry.key}
                href={href}
                className={`relative transition-colors ${
                  isActive ? 'text-moss' : 'text-charcoal/80 hover:text-charcoal'
                }`}
              >
                {text}
                <span
                  className={`pointer-events-none absolute -bottom-2 left-0 right-0 h-px rounded-full ${
                    isActive ? 'bg-moss opacity-90' : 'bg-transparent opacity-0'
                  }`}
                  aria-hidden
                />
              </a>
            );
          })}
          <a
            href={aboutCta.href}
            className={`rounded-full px-5 py-2 font-semibold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${
              currentPath === '/about'
                ? 'bg-moss text-white ring-2 ring-moss/30'
                : 'bg-moss text-white hover:bg-moss/90 hover:shadow-md'
            }`}
          >
            {aboutCta.text}
          </a>
        </div>
      </nav>
    </div>
  );
}
