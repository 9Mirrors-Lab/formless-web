import { useContent } from '@/context/ContentContext';

export function Navbar() {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const homeHref = currentPath === '/revised' || currentPath.startsWith('/revised/')
    ? '/revised'
    : '/';
  const { getText, getLink, ordered } = useContent();

  const brand = getText('nav', 'brand', 'name');
  const linkEntries = ordered('nav', 'links').filter((e) => e.type === 'link');
  const aboutCta = getLink('nav', 'cta', 'about');

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl rounded-full transition-all duration-700 flex items-center justify-between px-6 md:px-8 py-4 bg-white/72 backdrop-blur-lg border border-charcoal/10 shadow-sm`}
    >
      <a href={homeHref} className="flex items-center gap-3 text-charcoal">
        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-charcoal/35" />
        <span className="whitespace-nowrap font-sans font-semibold tracking-[0.3em] uppercase text-xs md:text-sm">
          {brand}
        </span>
      </a>
      <div className="hidden md:flex items-center gap-10 font-sans text-xs uppercase tracking-[0.22em] font-semibold text-charcoal">
        {linkEntries.map((entry) => {
          const text = typeof entry.value.text === 'string' ? entry.value.text : '';
          const href = typeof entry.value.href === 'string' ? entry.value.href : '#';
          const isActive = currentPath === href;
          return (
            <a
              key={entry.key}
              href={href}
              className={`relative inline-block pb-2.5 transition-colors ${
                isActive ? 'text-moss' : 'text-charcoal/88 hover:text-moss'
              }`}
            >
              {text}
              <span
                className={`pointer-events-none absolute bottom-0 left-0 right-0 h-px rounded-full ${
                  isActive ? 'bg-moss opacity-90' : 'bg-transparent'
                }`}
                aria-hidden
              />
            </a>
          );
        })}
        <a
          href={aboutCta.href}
          className={`px-6 py-2.5 rounded-full transition-all duration-300 font-semibold tracking-wider hover:scale-105 active:scale-95 bg-moss text-white hover:bg-moss/90 hover:shadow-md ${
            currentPath === '/about' ? 'ring-2 ring-moss/30' : ''
          }`}
        >
          {aboutCta.text}
        </a>
      </div>
    </nav>
  );
}
