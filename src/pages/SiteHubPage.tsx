import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';

import {
  SITE_PAGE_CATEGORIES,
  SITE_PAGE_INDEX,
  type SitePageCategory,
  type SitePageEntry,
  isSpaRoute,
  staticRepoHref,
} from '@/data/sitePageIndex';

const CATEGORY_ORDER: SitePageCategory[] = [
  'public',
  'legal',
  'auth',
  'design',
  'client',
  'redirect',
  'static',
  'build',
];

function PageLink({ entry }: { entry: SitePageEntry }) {
  const staticHref = !isSpaRoute(entry.path) ? staticRepoHref(entry.path) : undefined;
  const href = entry.href ?? (isSpaRoute(entry.path) ? entry.path : staticHref);
  const pathLabel = entry.path;

  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-cream/10 bg-cream/[0.03] p-5 transition-colors hover:border-cream/20 hover:bg-cream/[0.05]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-sans text-sm font-semibold text-cream">{entry.title}</h3>
          <p className="mt-1 font-mono text-[11px] text-cream/45 break-all">{pathLabel}</p>
        </div>
        {href ? (
          <a
            href={href}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cream/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-cream/70 transition-colors hover:border-clay/40 hover:text-cream"
          >
            Open
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        ) : (
          <span className="shrink-0 rounded-full border border-cream/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-cream/35">
            {import.meta.env.DEV ? 'No link' : 'Repo file'}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-cream/65">{entry.description}</p>
      <p className="mt-auto font-mono text-[10px] leading-relaxed text-cream/35">{entry.source}</p>
      {entry.href && entry.href !== entry.path ? (
        <p className="font-mono text-[10px] text-clay/80">→ {entry.href}</p>
      ) : null}
    </article>
  );
}

export default function SiteHubPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SitePageCategory | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SITE_PAGE_INDEX.filter((entry) => {
      if (entry.alias) return false;
      if (activeCategory !== 'all' && entry.category !== activeCategory) return false;
      if (!q) return true;
      const haystack = [
        entry.title,
        entry.path,
        entry.description,
        entry.source,
        entry.href ?? '',
        SITE_PAGE_CATEGORIES[entry.category].label,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, activeCategory]);

  const counts = useMemo(() => {
    const map = new Map<SitePageCategory, number>();
    for (const entry of SITE_PAGE_INDEX) {
      if (entry.alias) continue;
      map.set(entry.category, (map.get(entry.category) ?? 0) + 1);
    }
    return map;
  }, []);

  const spaCount = SITE_PAGE_INDEX.filter((e) => !e.alias && isSpaRoute(e.path)).length;
  const totalCount = SITE_PAGE_INDEX.filter((e) => !e.alias).length;

  return (
    <div className="min-h-screen bg-[#080a09] px-5 py-16 text-cream selection:bg-clay/30 selection:text-cream sm:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-screen-2xl">
        <header className="mb-12 max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-clay">Internal</span>
          <h1 className="mt-4 font-serif text-4xl font-light italic md:text-5xl">Site hub</h1>
          <p className="mt-4 leading-relaxed text-cream/70">
            Every route and page artifact in <span className="font-mono text-cream/55">formless-web</span>
            : {spaCount} SPA routes, {totalCount} total entries including static HTML and separate builds.
          </p>
        </header>

        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <label className="block max-w-md flex-1">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-cream/40">
              Search
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Route, title, source file…"
              className="w-full rounded-xl border border-cream/10 bg-cream/[0.04] px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-clay/40"
            />
          </label>
          <p className="font-mono text-xs text-cream/45">
            Showing {filtered.length} of {totalCount}
          </p>
        </div>

        <div className="mb-12 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
              activeCategory === 'all'
                ? 'bg-moss text-cream'
                : 'border border-cream/10 text-cream/55 hover:text-cream'
            }`}
          >
            All ({totalCount})
          </button>
          {CATEGORY_ORDER.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                activeCategory === category
                  ? 'bg-moss text-cream'
                  : 'border border-cream/10 text-cream/55 hover:text-cream'
              }`}
            >
              {SITE_PAGE_CATEGORIES[category].label} ({counts.get(category) ?? 0})
            </button>
          ))}
        </div>

        {activeCategory === 'all' ? (
          <div className="space-y-14">
            {CATEGORY_ORDER.map((category) => {
              const items = filtered.filter((entry) => entry.category === category);
              if (items.length === 0) return null;
              const meta = SITE_PAGE_CATEGORIES[category];
              return (
                <section key={category}>
                  <div className="mb-6 border-b border-cream/10 pb-4">
                    <h2 className="font-serif text-2xl italic text-cream">{meta.label}</h2>
                    <p className="mt-2 max-w-2xl text-sm text-cream/60">{meta.description}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((entry) => (
                      <PageLink key={entry.id} entry={entry} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <section>
            <div className="mb-6 border-b border-cream/10 pb-4">
              <h2 className="font-serif text-2xl italic text-cream">
                {SITE_PAGE_CATEGORIES[activeCategory].label}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-cream/60">
                {SITE_PAGE_CATEGORIES[activeCategory].description}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((entry) => (
                <PageLink key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-cream/50">No pages match your search.</p>
        ) : null}

        <footer className="mt-16 border-t border-cream/10 pt-8 font-mono text-[11px] text-cream/40">
          Routes are defined in src/PublicShell.tsx. Static HTML files live under docs/ and design/;
          open them from the repo or serve that folder locally. Moodboard separate build: npm run
          build:moodboard.
        </footer>
      </div>
    </div>
  );
}
