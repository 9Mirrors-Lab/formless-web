import { useDeferredValue, useEffect, useState } from 'react';
import { Search } from 'lucide-react';

import { ContinuityDeskNav } from '@/components/continuity/ContinuityDeskNav';
import { ContinuityTopicView } from '@/components/continuity/ContinuityTopicView';
import { ShaderBackdrop } from '@/components/shader/ShaderBackdrop';
import { useAuth } from '@/context/AuthContext';
import {
  CONTINUITY_HEADLINE,
  CONTINUITY_LEDE,
  CONTINUITY_START_HERE,
  continuityDeskTopicById,
  parseContinuityHash,
  searchContinuityDesk,
  type ContinuityDeskId,
} from '@/data/continuityHome';
import logoWhiteSrc from '../../../design/eyes-closed-logo-variations/Final-logos/09a-white-ec-notagline.svg';

export function ContinuityHome() {
  const { user, signOut } = useAuth();
  const [topicId, setTopicId] = useState<ContinuityDeskId>(() =>
    typeof window === 'undefined' ? 'start-here' : parseContinuityHash(window.location.hash),
  );
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const hits = searchContinuityDesk(deferredQuery);
  const topic = continuityDeskTopicById(topicId);
  const lede =
    topicId === 'start-here' ? CONTINUITY_START_HERE.lede : topic.summary;

  const goTo = (id: ContinuityDeskId) => {
    setTopicId(id);
    const next = `#${id}`;
    if (window.location.hash !== next) {
      window.history.pushState(null, '', next);
    }
  };

  useEffect(() => {
    const sync = () => setTopicId(parseContinuityHash(window.location.hash));
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#start-here');
    }
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#080a09] font-sans text-cream antialiased">
      <ShaderBackdrop theme="forest" position="fixed" overlay={false} />
      <div
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#080a09f2_0%,#080a09d8_38%,#080a09a0_100%)]"
        aria-hidden
      />
      <div className="noise-overlay-dark" aria-hidden />

      <a
        href="#desk-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-cream focus:px-4 focus:py-2 focus:text-sm focus:text-charcoal"
      >
        Skip to desk content
      </a>

      <header className="relative z-20 border-b border-cream/10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-10 lg:px-14">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={logoWhiteSrc}
                alt="Eyes Closed"
                width={1929}
                height={865}
                className="h-8 w-auto"
              />
              <p className="font-sans text-sm text-cream/55">{CONTINUITY_HEADLINE}</p>
            </div>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  void signOut();
                }}
                className="inline-flex min-h-11 cursor-pointer items-center px-3 font-sans text-sm text-cream/70 underline-offset-4 hover:text-cream hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80 md:hidden"
              >
                Sign out
              </button>
            ) : null}
          </div>
          <label className="relative block min-w-0 flex-1 md:max-w-md">
            <span className="sr-only">Search continuity</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-cream/40"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a login, file, person, or service"
              className="min-h-11 w-full border border-cream/20 bg-charcoal/40 py-2 pl-10 pr-3 font-sans text-sm text-cream placeholder:text-cream/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
            />
          </label>
          {user ? (
            <button
              type="button"
              onClick={() => {
                void signOut();
              }}
              className="hidden min-h-11 cursor-pointer items-center px-3 font-sans text-sm text-cream/70 underline-offset-4 hover:text-cream hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80 md:inline-flex"
            >
              Sign out
            </button>
          ) : null}
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-8 md:grid-cols-[16.5rem_minmax(0,1fr)] md:gap-12 md:px-10 md:py-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-14">
        <aside className="md:sticky md:top-6 md:max-h-[calc(100dvh-5.5rem)] md:overflow-y-auto md:pb-10">
          <p className="mb-6 hidden max-w-[28ch] font-sans text-sm leading-relaxed text-cream/50 md:block">
            {CONTINUITY_LEDE} Open one room at a time.
          </p>
          <details className="group md:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between border border-cream/20 px-4 font-sans text-sm text-cream marker:content-none [&::-webkit-details-marker]:hidden">
              <span>Rooms · {topic.label}</span>
              <span className="text-cream/40 transition-transform duration-200 group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <div className="mt-4 pb-2">
              <ContinuityDeskNav
                activeId={topicId}
                onSelect={goTo}
                hits={hits}
                query={deferredQuery}
              />
            </div>
          </details>
          <div className="hidden md:block">
            <ContinuityDeskNav
              activeId={topicId}
              onSelect={goTo}
              hits={hits}
              query={deferredQuery}
            />
          </div>
        </aside>

        <main id="desk-content" className="min-w-0 pb-24" tabIndex={-1}>
          <p className="font-sans text-sm text-cream/50">
            {topic.question}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-light italic leading-[1.1] tracking-[-0.03em] text-cream md:text-5xl">
            {topicId === 'start-here' ? CONTINUITY_START_HERE.title : topic.label}
          </h1>
          <p className="mt-5 max-w-[54ch] font-sans text-base leading-relaxed text-cream/70 md:text-lg">
            {lede}
          </p>
          <div className="mt-10 md:mt-12">
            <ContinuityTopicView
              topicId={topicId}
              fileQuery={topicId === 'files' ? deferredQuery : ''}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
