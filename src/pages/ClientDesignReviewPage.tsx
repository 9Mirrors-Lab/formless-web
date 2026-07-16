import { useMemo, useState } from 'react';
import { ExternalLink, Layers } from 'lucide-react';

import { PageLayout } from '@/components/PageLayout';
import {
  CLIENT_DESIGN_REVIEW_INDEX,
  CLIENT_REVIEW_SECTION_ORDER,
  CLIENT_REVIEW_SECTIONS,
  CLIENT_REVIEW_STATUS_LABELS,
  type ClientReviewEntry,
  type ClientReviewSectionId,
  type ClientReviewStatus,
} from '@/data/clientDesignReviewIndex';

function statusClassName(status: ClientReviewStatus): string {
  switch (status) {
    case 'live':
      return 'border-moss/30 bg-moss/10 text-moss';
    case 'promoted':
      return 'border-clay/35 bg-clay/10 text-clay';
    case 'experiment':
      return 'border-charcoal/15 bg-charcoal/5 text-charcoal/60';
    case 'reference':
      return 'border-charcoal/10 bg-charcoal/[0.03] text-charcoal/45';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function ReviewCard({ entry }: { entry: ClientReviewEntry }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-charcoal/10 bg-white/60 p-6 shadow-sm transition-colors hover:border-charcoal/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-sans text-base font-semibold text-charcoal">{entry.title}</h3>
          <p className="mt-1 break-all font-mono text-[11px] text-charcoal/45">{entry.href}</p>
        </div>
        <a
          href={entry.href}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-charcoal/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-charcoal/70 transition-colors hover:border-moss/40 hover:text-moss"
        >
          Open
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      </div>
      <span
        className={`w-fit rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${statusClassName(entry.status)}`}
      >
        {CLIENT_REVIEW_STATUS_LABELS[entry.status]}
      </span>
      <p className="text-sm leading-relaxed text-charcoal/72">{entry.description}</p>
      {entry.source ? (
        <p className="mt-auto font-mono text-[10px] leading-relaxed text-charcoal/35">{entry.source}</p>
      ) : null}
    </article>
  );
}

export default function ClientDesignReviewPage() {
  const [query, setQuery] = useState('');
  const [activeSection, setActiveSection] = useState<ClientReviewSectionId | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLIENT_DESIGN_REVIEW_INDEX.filter((entry) => {
      if (activeSection !== 'all' && entry.section !== activeSection) return false;
      if (!q) return true;
      const haystack = [
        entry.title,
        entry.href,
        entry.description,
        entry.source ?? '',
        CLIENT_REVIEW_SECTIONS[entry.section].label,
        CLIENT_REVIEW_STATUS_LABELS[entry.status],
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, activeSection]);

  const counts = useMemo(() => {
    const map = new Map<ClientReviewSectionId, number>();
    for (const entry of CLIENT_DESIGN_REVIEW_INDEX) {
      map.set(entry.section, (map.get(entry.section) ?? 0) + 1);
    }
    return map;
  }, []);

  return (
    <PageLayout>
      <section className="site-page-header relative w-full overflow-hidden px-6 pb-10 pt-8 md:px-16 md:pb-12 lg:px-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[5%] right-[8%] h-72 w-72 rounded-full bg-moss/8 blur-[100px]" />
          <div className="absolute bottom-[10%] left-[5%] h-64 w-64 rounded-full bg-clay/8 blur-[90px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.28em] text-charcoal/40">
            Client preview
          </span>
          <h1 className="font-serif text-5xl italic leading-[1.05] text-charcoal md:text-6xl lg:text-7xl">
            Design review
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-charcoal/70 md:text-xl">
            One place to open every design direction we have explored: original hero, layout tests,
            shader backgrounds, brand studies, and strategy briefs.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal/55">
            Nothing here ships to the live site until you approve it. Use{' '}
            <a href="/client/site-updates" className="font-medium text-moss underline-offset-4 hover:underline">
              site updates
            </a>{' '}
            for what is already live, and{' '}
            <a href="/hub" className="font-medium text-moss underline-offset-4 hover:underline">
              site hub
            </a>{' '}
            for the full internal route list.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white/50 px-4 py-2 text-sm text-charcoal/55">
            <Layers className="h-4 w-4 text-clay" aria-hidden />
            {CLIENT_DESIGN_REVIEW_INDEX.length} review links
          </div>
        </div>
      </section>

      <section className="w-full px-6 pb-20 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <label className="block max-w-md flex-1">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
                Search
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Hero, shader, layout…"
                className="w-full rounded-xl border border-charcoal/10 bg-white/70 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 outline-none focus:border-moss/40"
              />
            </label>
            <p className="font-mono text-xs text-charcoal/45">
              Showing {filtered.length} of {CLIENT_DESIGN_REVIEW_INDEX.length}
            </p>
          </div>

          <div className="mb-12 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveSection('all')}
              className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                activeSection === 'all'
                  ? 'bg-charcoal text-cream'
                  : 'border border-charcoal/10 text-charcoal/55 hover:text-charcoal'
              }`}
            >
              All ({CLIENT_DESIGN_REVIEW_INDEX.length})
            </button>
            {CLIENT_REVIEW_SECTION_ORDER.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  activeSection === section
                    ? 'bg-charcoal text-cream'
                    : 'border border-charcoal/10 text-charcoal/55 hover:text-charcoal'
                }`}
              >
                {CLIENT_REVIEW_SECTIONS[section].label} ({counts.get(section) ?? 0})
              </button>
            ))}
          </div>

          {activeSection === 'all' ? (
            <div className="space-y-14">
              {CLIENT_REVIEW_SECTION_ORDER.map((section) => {
                const items = filtered.filter((entry) => entry.section === section);
                if (items.length === 0) return null;
                const meta = CLIENT_REVIEW_SECTIONS[section];
                return (
                  <section key={section}>
                    <div className="mb-6 border-b border-charcoal/10 pb-4">
                      <h2 className="font-serif text-3xl italic text-charcoal">{meta.label}</h2>
                      <p className="mt-2 max-w-2xl text-sm text-charcoal/60">{meta.description}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {items.map((entry) => (
                        <ReviewCard key={entry.id} entry={entry} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <section>
              <div className="mb-6 border-b border-charcoal/10 pb-4">
                <h2 className="font-serif text-3xl italic text-charcoal">
                  {CLIENT_REVIEW_SECTIONS[activeSection].label}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-charcoal/60">
                  {CLIENT_REVIEW_SECTIONS[activeSection].description}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filtered.map((entry) => (
                  <ReviewCard key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          )}

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-charcoal/50">No review links match your search.</p>
          ) : null}
        </div>
      </section>
    </PageLayout>
  );
}
