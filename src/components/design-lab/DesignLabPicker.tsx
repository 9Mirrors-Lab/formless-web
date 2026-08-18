import { Check, FlaskConical } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import {
  DESIGN_LAB_ENTRIES,
  DESIGN_LAB_GROUPS,
  designLabEntryForPath,
  type DesignLabEntry,
} from '@/data/designLabCatalog';

const linkFocus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function openEntry(entry: DesignLabEntry) {
  if (entry.external) {
    window.location.assign(entry.href);
    return;
  }
  window.location.assign(entry.href);
}

/**
 * Floating Design Lab navigator. Same hierarchy as Backgrounds' paint control:
 * quiet trigger, curated list, current direction marked.
 */
export function DesignLabPicker() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const current =
    typeof window !== 'undefined'
      ? designLabEntryForPath(window.location.pathname)
      : undefined;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="design-lab-picker fixed bottom-6 right-6 z-[90] md:bottom-8 md:right-8">
      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Design Lab directions"
          className="mb-3 max-h-[min(70vh,32rem)] w-[min(calc(100vw-3rem),20rem)] overflow-y-auto rounded-2xl border border-cream/15 bg-[#080a09]/95 shadow-2xl shadow-black/50 backdrop-blur-md"
          style={{ transitionTimingFunction: EASE }}
        >
          <div className="sticky top-0 z-10 border-b border-cream/10 bg-[#080a09]/95 px-4 py-3 backdrop-blur-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9fb5aa]/80">
              Design Lab
            </p>
            <p className="mt-1 font-serif text-sm italic text-cream/70">
              Choose what feels true
            </p>
          </div>

          <div className="flex flex-col gap-4 p-3">
            {DESIGN_LAB_GROUPS.map((group) => {
              const entries = DESIGN_LAB_ENTRIES.filter((entry) => entry.group === group);
              if (entries.length === 0) return null;

              return (
                <div key={group}>
                  <p className="mb-1.5 px-2 font-mono text-[9px] uppercase tracking-[0.2em] text-cream/35">
                    {group}
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {entries.map((entry) => {
                      const isSelected = current?.id === entry.id;
                      return (
                        <li key={entry.id} role="presentation">
                          <button
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              openEntry(entry);
                              setOpen(false);
                            }}
                            className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-300 ${linkFocus} ${
                              isSelected
                                ? 'bg-cream/10 text-cream'
                                : 'text-cream/75 hover:bg-cream/5 hover:text-cream'
                            }`}
                            style={{ transitionTimingFunction: EASE }}
                          >
                            <span className="mt-0.5 flex min-w-0 flex-1 flex-col gap-0.5">
                              <span className="flex items-center gap-2">
                                <span className="font-sans text-sm font-medium tracking-tight">
                                  {entry.label}
                                </span>
                                {entry.status === 'Active' ? (
                                  <span className="rounded-full bg-clay/20 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#e07a52]">
                                    Active
                                  </span>
                                ) : null}
                              </span>
                              <span className="font-sans text-[11px] leading-snug text-cream/45">
                                {entry.intent}
                              </span>
                            </span>
                            {isSelected ? (
                              <Check className="mt-1 size-4 shrink-0 text-[#9fb5aa]" aria-hidden />
                            ) : (
                              <span className="mt-1 size-4 shrink-0" aria-hidden />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}

            <div className="border-t border-cream/10 px-2 pt-3">
              <a
                href="/design-lab"
                className={`block rounded-xl px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9fb5aa]/90 transition-colors hover:bg-cream/5 hover:text-cream ${linkFocus}`}
                style={{ transitionTimingFunction: EASE }}
              >
                Lab index
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Open Design Lab"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        onClick={() => setOpen((value) => !value)}
        title="Design Lab"
        className={`inline-flex size-12 items-center justify-center rounded-full border border-cream/20 bg-[#080a09]/90 text-cream shadow-lg shadow-black/40 backdrop-blur-md transition-all duration-500 hover:border-[#9fb5aa]/40 hover:bg-[#0c100e] hover:text-[#9fb5aa] ${linkFocus}`}
        style={{ transitionTimingFunction: EASE }}
      >
        <FlaskConical className="size-5" aria-hidden />
      </button>
    </div>
  );
}
