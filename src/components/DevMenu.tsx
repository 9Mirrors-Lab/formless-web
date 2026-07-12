import { useState } from 'react';
import { Layers, X, ChevronRight } from 'lucide-react';
import { heroBookAsideQueryHref, resolveHeroBookAsideEnabled } from '@/config/featureFlags';

export const DevMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const bookAsideEnabled = resolveHeroBookAsideEnabled();

  if (!import.meta.env.DEV) return null;

  const devPages = [
    { name: '── Site Pages ──', path: '' },
    { name: 'Main Page', path: '/' },
    { name: '── Hero ──', path: '' },
    {
      name: bookAsideEnabled ? 'Book aside: on (active)' : 'Book aside: on',
      path: heroBookAsideQueryHref(true),
    },
    {
      name: !bookAsideEnabled ? 'Book aside: off (active)' : 'Book aside: off',
      path: heroBookAsideQueryHref(false),
    },
    { name: '── Dev Pages ──', path: '' },
    { name: 'Layout tests', path: '/layout-tests' },
    { name: 'About (Magazine Layout)', path: '/about-magazine' },
    { name: 'Brand Export Kit', path: '/brand-kit-export' },
    { name: 'Eyes Closed logo options', path: '/eyes-closed-logo-options' },
    { name: 'Icons', path: '/icons' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end">
      {isOpen ? (
        <div className="mb-4 w-64 origin-bottom-right transform rounded-xl border border-cream/10 bg-charcoal p-5 text-cream shadow-2xl transition-all">
          <div className="mb-4 flex items-center justify-between border-b border-cream/10 pb-3">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cream/70">
              <Layers size={14} aria-hidden />
              Dev Navigation
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream/50 transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
              aria-label="Close development navigation"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {devPages.map((page, idx) => (
              <li key={page.path || `sep-${idx}`}>
                {page.path ? (
                  <a
                    href={page.path}
                    className="group flex items-center justify-between rounded-md px-3 py-2 text-sm text-cream/90 transition-all hover:bg-cream/5 hover:text-moss focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
                  >
                    {page.name}
                    <ChevronRight
                      size={14}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </a>
                ) : (
                  <span className="mt-2 block px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-cream/40">
                    {page.name.replace(/─/g, '').trim()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex min-h-11 min-w-11 items-center justify-center rounded-full border border-cream/10 bg-charcoal p-3 text-cream shadow-lg transition-all hover:bg-moss hover:text-charcoal motion-safe:hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
          aria-label="Open development navigation"
        >
          <Layers size={20} className="transition-transform group-hover:rotate-12 motion-reduce:group-hover:rotate-0" aria-hidden />
        </button>
      ) : null}
    </div>
  );
};
