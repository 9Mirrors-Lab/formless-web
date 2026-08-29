import { useEffect, useMemo, useState } from 'react';

import {
  amazonBestMovement,
  amazonImprovedCategoryCount,
  amazonRankDeltasFromHistory,
  amazonRankDisplayRows,
  formatAmazonRank,
  formatAmazonRankDelta,
  kindleListingHref,
  type AmazonKindleRankSnapshot,
  type AmazonRankPoint,
} from '@/data/amazonRankings';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { PulseLoad } from '@/lib/brandPulse';
import { fetchKindleRanks } from '@/lib/kindleRanks';

const UP = '#7dba8a';
const CLAY = '#c4a574';

type RankRowProps = {
  row: AmazonRankPoint;
  delta: number;
  featured?: boolean;
};

function RankDelta({ delta, featured = false }: { delta: number; featured?: boolean }) {
  if (delta === 0) {
    return <span className="font-sans text-[11px] tabular-nums text-cream/35">—</span>;
  }

  const up = delta > 0;
  return (
    <span
      className={`shrink-0 font-sans tabular-nums ${
        featured ? 'text-[12px]' : 'text-[11px]'
      }`}
      style={{ color: up ? UP : '#c9897a' }}
    >
      {formatAmazonRankDelta(delta)}
      {featured && up ? ' today' : ''}
    </span>
  );
}

function RankRow({ row, delta, featured = false }: RankRowProps) {
  if (featured) {
    return (
      <div className="flex items-end justify-between gap-4 py-3">
        <div className="min-w-0">
          <p
            className="font-sans text-[1.75rem] font-medium leading-none tracking-[-0.02em] sm:text-[2rem]"
            style={{ color: CLAY }}
          >
            {formatAmazonRank(row.rank)}
          </p>
          <p className="mt-2 font-sans text-[13px] leading-snug text-cream/85">
            {row.label}
          </p>
        </div>
        <RankDelta delta={delta} featured />
      </div>
    );
  }

  return (
    <div className="flex items-baseline justify-between gap-3 py-2.5">
      <div className="flex min-w-0 items-baseline gap-3">
        <span className="w-[4.25rem] shrink-0 font-sans text-[1.15rem] font-medium leading-none tabular-nums text-cream/90">
          {formatAmazonRank(row.rank)}
        </span>
        <span className="min-w-0 font-sans text-[12px] leading-snug text-cream/72">
          {row.label}
        </span>
      </div>
      <RankDelta delta={delta} />
    </div>
  );
}

function RankingsBody({ snapshot }: { snapshot: AmazonKindleRankSnapshot }) {
  const rows = amazonRankDisplayRows(snapshot);
  const deltas = amazonRankDeltasFromHistory(snapshot);
  const improved = amazonImprovedCategoryCount(snapshot);
  const best = amazonBestMovement(snapshot);
  const [store, ...categories] = rows;
  const historyRows = useMemo(
    () => [...snapshot.history].sort((a, b) => b.asOf.localeCompare(a.asOf)),
    [snapshot.history],
  );

  return (
    <>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="brand-amazon-rank-heading"
            className="font-sans text-[15px] font-medium tracking-[-0.01em] text-cream"
          >
            Kindle Rankings
          </h2>
          <p className="mt-1 flex items-center gap-2 font-sans text-[11px] text-cream/48">
            <span>
              {improved} {improved === 1 ? 'category' : 'categories'} improved today
            </span>
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: CLAY }}
              aria-hidden
            />
          </p>
        </div>
        <a
          href={kindleListingHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-sm opacity-65 transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9fb5aa]"
        >
          <img
            src="/brand/kindle-on-dark.svg"
            alt="Open Kindle listing"
            className="h-3.5 w-auto"
          />
        </a>
      </header>

      <div className="mt-4">
        {store ? <RankRow row={store} delta={deltas.store} featured /> : null}

        <ul className="mt-1" aria-label="Kindle category bestseller ranks">
          {categories.map((row) => (
            <li key={row.key}>
              <RankRow row={row} delta={deltas[row.key]} />
            </li>
          ))}
        </ul>
      </div>

      <Accordion type="single" collapsible className="mt-3 border-t border-cream/10">
        <AccordionItem value="history" className="border-none">
          <AccordionTrigger className="py-3 text-[12px] font-medium text-[#c4a574] hover:no-underline hover:text-[#d4b888] [&>svg]:size-3.5 [&>svg]:text-[#c4a574]">
            Show ranking history
          </AccordionTrigger>
          <AccordionContent className="pb-1">
            {best ? (
              <p className="mb-3 font-sans text-[11px] leading-relaxed text-cream/55">
                Best movement today:{' '}
                <span style={{ color: UP }}>
                  {formatAmazonRankDelta(best.delta)}
                </span>{' '}
                {best.label} positions
              </p>
            ) : null}

            <div className="rounded-md border border-cream/10 bg-black/20">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-cream/10 text-[9px] uppercase tracking-[0.1em] text-cream/40">
                    <th className="px-2 py-2 font-normal">Date</th>
                    <th className="px-1.5 py-2 font-normal">Personal</th>
                    <th className="px-1.5 py-2 font-normal">Dating</th>
                    <th className="px-1.5 py-2 font-normal">Healing</th>
                    <th className="px-2 py-2 font-normal">Store</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRows.map((entry) => {
                    const isLatest = entry.asOf === snapshot.asOf;
                    const tone = isLatest ? 'text-[#c4a574]' : 'text-cream/55';
                    return (
                      <tr
                        key={entry.asOf}
                        className="border-t border-cream/8 first:border-t-0"
                      >
                        <td className={`px-2 py-2 font-sans text-[11px] ${tone}`}>
                          {isLatest ? 'Today' : entry.label}
                        </td>
                        <td
                          className={`px-1.5 py-2 font-sans text-[12px] tabular-nums ${tone}`}
                        >
                          {formatAmazonRank(entry.personalTransformation)}
                        </td>
                        <td
                          className={`px-1.5 py-2 font-sans text-[12px] tabular-nums ${tone}`}
                        >
                          {formatAmazonRank(entry.datingRelationships)}
                        </td>
                        <td
                          className={`px-1.5 py-2 font-sans text-[12px] tabular-nums ${tone}`}
                        >
                          {formatAmazonRank(entry.spiritualHealing)}
                        </td>
                        <td
                          className={`px-2 py-2 font-sans text-[12px] tabular-nums ${tone}`}
                        >
                          {formatAmazonRank(entry.storeRank)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

function RankingsStatus({
  state,
  error,
}: {
  state: PulseLoad;
  error: string | null;
}) {
  const detail =
    state === 'loading'
      ? 'Loading ranks from Amazon history.'
      : error ?? 'Could not load Kindle ranks.';

  return (
    <>
      <header>
        <h2
          id="brand-amazon-rank-heading"
          className="font-sans text-[15px] font-medium tracking-[-0.01em] text-cream"
        >
          Kindle Rankings
        </h2>
        <p className="mt-1 font-sans text-[11px] text-cream/48">{detail}</p>
      </header>
      <div className="mt-4 space-y-3" aria-hidden={state === 'loading'}>
        <div className="h-14 rounded-sm bg-cream/5" />
        <div className="h-8 rounded-sm bg-cream/5" />
        <div className="h-8 rounded-sm bg-cream/5" />
        <div className="h-8 rounded-sm bg-cream/5" />
      </div>
    </>
  );
}

export function BrandAmazonRankings() {
  const [state, setState] = useState<PulseLoad>('loading');
  const [snapshot, setSnapshot] = useState<AmazonKindleRankSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const result = await fetchKindleRanks();
      if (cancelled) return;

      if (result.ok) {
        setSnapshot(result.snapshot);
        setError(null);
        setState('ready');
      } else {
        setSnapshot(null);
        setError(result.error);
        setState('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      aria-labelledby="brand-amazon-rank-heading"
      aria-busy={state === 'loading'}
      className="rounded-lg border border-[#c4a574]/22 bg-[#080a09]/62 px-4 py-4 shadow-[inset_0_1px_0_rgba(242,240,233,0.05)] backdrop-blur-[3px] sm:px-5 sm:py-5"
    >
      {state === 'ready' && snapshot ? (
        <RankingsBody snapshot={snapshot} />
      ) : (
        <RankingsStatus state={state} error={error} />
      )}
    </section>
  );
}
