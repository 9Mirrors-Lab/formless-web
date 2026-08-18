import { useMemo, useState } from 'react';
import { Layers, X } from 'lucide-react';

import {
  CLIENT_DESIGN_REVIEW_INDEX,
  CLIENT_REVIEW_SECTION_ORDER,
  CLIENT_REVIEW_SECTIONS,
  CLIENT_REVIEW_STATUS_LABELS,
  type ClientReviewStatus,
} from '@/data/clientDesignReviewIndex';

function statusDotClass(status: ClientReviewStatus): string {
  switch (status) {
    case 'live':
      return 'bg-moss';
    case 'promoted':
      return 'bg-clay';
    case 'experiment':
      return 'bg-cream/50';
    case 'reference':
      return 'bg-cream/25';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function isActiveHref(current: string, href: string): boolean {
  if (current === href) return true;
  if (!href.includes('?') && current.startsWith(`${href}?`)) return true;
  if (href === '/' && (current === '/' || current.startsWith('/?'))) return true;
  return false;
}

/** Prefer the leaf file name; keep parent folder when useful. */
function shortSource(source?: string): string | null {
  if (!source) return null;
  const first = source.split(',')[0]?.trim() ?? source;
  const parts = first.split('/');
  if (parts.length <= 2) return first;
  return parts.slice(-2).join('/');
}

type DevMenuProps = {
  path: string;
};

/** Dev-only floating dock: same design links as `/client/review`, always one click away. */
export const DevMenu = ({ path }: DevMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const current = `${path}${search}`;

  const bySection = useMemo(
    () =>
      CLIENT_REVIEW_SECTION_ORDER.map((section) => ({
        section,
        label: CLIENT_REVIEW_SECTIONS[section].label,
        entries: CLIENT_DESIGN_REVIEW_INDEX.filter((entry) => entry.section === section),
      })),
    [],
  );

  if (!import.meta.env.DEV) return null;

  // Stay out of recording pages so the dock does not cover the script or notes tray.
  if (typeof window !== 'undefined') {
    const here = window.location.pathname;
    if (here.startsWith('/audio/companion') || here.startsWith('/audio/record-sessions')) {
      return null;
    }
  }

  return (
    <div className="fixed right-3 top-3 z-[99999] flex flex-col items-end font-sans md:right-4 md:top-4">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-cream/15 bg-charcoal/95 px-2.5 text-[11px] font-medium tracking-wide text-cream/70 shadow-md transition-colors hover:border-moss/40 hover:bg-moss hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close design navigation' : 'Open design navigation'}
      >
        <Layers size={13} aria-hidden />
        Design
      </button>

      {isOpen ? (
        <div className="mt-2 max-h-[min(70vh,36rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-cream/15 bg-charcoal/95 text-cream shadow-2xl backdrop-blur-md">
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-cream/10 bg-charcoal/95 px-3.5 py-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-cream">Design routes</p>
              <p className="mt-0.5 font-mono text-[10px] text-cream/40">
                here: {current || '/'}
              </p>
              <a
                href="/client/review"
                className="mt-1 block text-[11px] text-moss transition-colors hover:text-cream"
              >
                /client/review
              </a>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
              aria-label="Close design navigation"
            >
              <X size={14} aria-hidden />
            </button>
          </div>

          <nav className="px-2 py-2" aria-label="Design review routes">
            {bySection.map(({ section, label, entries }) => (
              <div key={section} className="mb-2">
                <p className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/35">
                  {label}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {entries.map((entry) => {
                    const active = isActiveHref(current, entry.href);
                    const file = shortSource(entry.source);
                    return (
                      <li key={entry.id}>
                        <a
                          href={entry.href}
                          className={`block rounded-lg px-2 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80 ${
                            active
                              ? 'bg-moss/15 text-moss'
                              : 'text-cream/90 hover:bg-cream/5 hover:text-cream'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDotClass(entry.status)}`}
                              aria-hidden
                            />
                            <span className="min-w-0 flex-1 truncate text-sm font-medium">
                              {entry.title}
                            </span>
                            <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-cream/35">
                              {CLIENT_REVIEW_STATUS_LABELS[entry.status]}
                            </span>
                          </span>
                          <span className="mt-1 block pl-3.5 font-mono text-[11px] leading-snug text-cream/45">
                            {entry.href}
                          </span>
                          {file ? (
                            <span className="mt-0.5 block pl-3.5 font-mono text-[10px] leading-snug text-cream/30">
                              {file}
                            </span>
                          ) : null}
                          {entry.description ? (
                            <span className="mt-1 block pl-3.5 text-[11px] leading-snug text-cream/40 line-clamp-2">
                              {entry.description}
                            </span>
                          ) : null}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
};
