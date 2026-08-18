import { ArrowUpRight } from 'lucide-react';

import {
  DESIGN_LAB_ENTRIES,
  DESIGN_LAB_GROUPS,
  type DesignLabEntry,
} from '@/data/designLabCatalog';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function DirectionPlate({ entry }: { entry: DesignLabEntry }) {
  return (
    <a
      href={entry.href}
      className="group relative block overflow-hidden rounded-[1.75rem] border border-cream/10 bg-cream/[0.03] p-6 transition-all duration-700 hover:border-[#9fb5aa]/25 hover:bg-cream/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70 sm:p-8"
      style={{ transitionTimingFunction: EASE }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(155,183,168,0.1)_0%,transparent_55%)] opacity-80 transition-opacity duration-700 group-hover:opacity-100"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {entry.status ? (
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${
                  entry.status === 'Active'
                    ? 'bg-clay/15 text-[#e07a52]'
                    : entry.status === 'Foundation'
                      ? 'bg-[#9fb5aa]/12 text-[#9fb5aa]'
                      : 'bg-cream/5 text-cream/50'
                }`}
              >
                {entry.status}
              </span>
            ) : null}
            {entry.external ? (
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/30">
                Specimen
              </span>
            ) : null}
          </div>

          <h2 className="font-serif text-2xl font-light italic leading-tight text-cream sm:text-[1.75rem]">
            {entry.label}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/55">{entry.intent}</p>
        </div>

        <span
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-cream/10 text-cream/40 transition-all duration-500 group-hover:border-[#9fb5aa]/35 group-hover:text-[#9fb5aa]"
          style={{ transitionTimingFunction: EASE }}
          aria-hidden
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </a>
  );
}

/**
 * Boutique client-review index for curated design directions.
 * No comment fields. Tight choices. Tender, precise, field-aware.
 */
export default function DesignLabPage() {
  return (
    <div className="brief-dark relative min-h-screen overflow-x-hidden text-cream selection:bg-clay/30 selection:text-cream">
      <div className="noise-overlay-dark" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(155,183,168,0.1)_0%,transparent_65%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-clay/[0.06] blur-3xl"
        aria-hidden
      />

      <main className="relative mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-24 lg:px-16">
        <header className="mb-16 max-w-2xl sm:mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-clay">
            Eyes Closed · Design Lab
          </p>
          <h1 className="mt-5 font-serif text-4xl font-light italic leading-[1.08] text-cream sm:text-5xl md:text-6xl">
            Directions worth sitting with
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/60 sm:text-lg">
            A small set of explorations for client review. Open what feels in tune.
            Leave what does not. No forms. No noise. Only the work that can carry the
            teaching forward.
          </p>
        </header>

        <div className="flex flex-col gap-14 sm:gap-16">
          {DESIGN_LAB_GROUPS.map((group) => {
            const entries = DESIGN_LAB_ENTRIES.filter((entry) => entry.group === group);
            if (entries.length === 0) return null;

            return (
              <section key={group} aria-labelledby={`lab-group-${group}`}>
                <div className="mb-5 flex items-baseline gap-3 border-b border-cream/10 pb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9fb5aa]/75">
                    Lab
                  </span>
                  <span className="text-cream/20" aria-hidden>
                    /
                  </span>
                  <h2
                    id={`lab-group-${group}`}
                    className="font-sans text-sm font-semibold tracking-tight text-cream"
                  >
                    {group}
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {entries.map((entry) => (
                    <DirectionPlate key={entry.id} entry={entry} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <footer className="mt-20 border-t border-cream/10 pt-8 sm:mt-24">
          <p className="max-w-lg font-serif text-lg italic leading-relaxed text-cream/45">
            Motion language and icon loops live in Foundations. Start there if you need
            the grammar before judging a direction.
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/30">
            Flask control · bottom right · every lab page
          </p>
        </footer>
      </main>
    </div>
  );
}
