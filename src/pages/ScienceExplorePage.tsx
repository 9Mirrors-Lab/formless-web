/**
 * THESIS: Five science page compositions inside the established Formless dark world,
 * swapping icons, lockups, and scroll mechanics while keeping production copy.
 * OWN-WORLD: brief-dark, moss/clay/cream, Cormorant + mono, TeachingIconMark, orbits.
 * STORY: Visitor compares A–E; each proves Spirituality & Science can wear different
 * brand marks without leaving the sanctuary tone.
 * FIRST VIEWPORT: Sticky variant switcher; active concept fills the stage.
 * FORM: Lab surface at /science-explore. A = production baseline; B–E = new structures.
 * FINISH: unreviewed and undocumented is unfinished; lab only until one direction promotes.
 */

import { useCallback, useEffect, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import SciencePage from '@/pages/SciencePage';
import { ScienceExploreBridgeLedger } from '@/components/science-explore/ScienceExploreBridgeLedger';
import { ScienceExploreIconAtlas } from '@/components/science-explore/ScienceExploreIconAtlas';
import { ScienceExploreSpecimenIndex } from '@/components/science-explore/ScienceExploreSpecimenIndex';
import { ScienceExploreWitnessNucleus } from '@/components/science-explore/ScienceExploreWitnessNucleus';
import {
  SCIENCE_EXPLORE_VARIANTS,
  type ScienceExploreVariantId,
} from '@/components/science-explore/scienceExploreShared';

function readVariant(): ScienceExploreVariantId {
  const hash = window.location.hash.replace(/^#/, '').toLowerCase();
  if (hash === 'a' || hash === 'b' || hash === 'c' || hash === 'd' || hash === 'e') return hash;
  const q = new URLSearchParams(window.location.search).get('v');
  if (q === 'a' || q === 'b' || q === 'c' || q === 'd' || q === 'e') return q;
  return 'a';
}

export default function ScienceExplorePage() {
  const [variant, setVariant] = useState<ScienceExploreVariantId>(() =>
    typeof window !== 'undefined' ? readVariant() : 'a',
  );

  useEffect(() => {
    const sync = () => setVariant(readVariant());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const select = useCallback((id: ScienceExploreVariantId) => {
    setVariant(id);
    const url = new URL(window.location.href);
    url.hash = id;
    url.searchParams.delete('v');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    window.scrollTo(0, 0);
  }, []);

  const active = SCIENCE_EXPLORE_VARIANTS.find((v) => v.id === variant) ?? SCIENCE_EXPLORE_VARIANTS[0];

  return (
    <PageLayout briefSpectrum hideNav>
      <header className="fixed left-1/2 top-4 z-50 flex w-[min(98%,1040px)] -translate-x-1/2 flex-col gap-2 rounded-full border border-cream/12 bg-[#070806]/92 px-3 py-2 shadow-2xl shadow-black/30 backdrop-blur-md md:flex-row md:items-center md:gap-2 md:px-4">
        <a
          href="/client/review"
          className="hidden shrink-0 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45 transition-colors hover:text-cream md:inline"
        >
          Review
        </a>
        <nav
          aria-label="Science page concept variants"
          className="flex flex-1 items-center justify-center gap-0.5 overflow-x-auto"
        >
          {SCIENCE_EXPLORE_VARIANTS.map((v) => {
            const on = v.id === variant;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => select(v.id)}
                aria-pressed={on}
                className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay sm:px-3 sm:text-[10px] ${
                  on
                    ? 'bg-cream text-charcoal'
                    : 'text-cream/60 hover:bg-cream/8 hover:text-cream'
                }`}
              >
                <span className={on ? 'text-clay' : 'text-clay/80'}>{v.label}</span>
                <span className="hidden lg:inline">{v.title}</span>
              </button>
            );
          })}
        </nav>
        <p className="hidden max-w-[160px] truncate text-right font-serif text-[11px] italic text-cream/40 xl:block">
          {active.blurb}
        </p>
      </header>

      <div className="pt-2">
        {variant === 'a' ? <SciencePage embedded /> : null}
        {variant === 'b' ? <ScienceExploreIconAtlas /> : null}
        {variant === 'c' ? <ScienceExploreSpecimenIndex /> : null}
        {variant === 'd' ? <ScienceExploreWitnessNucleus /> : null}
        {variant === 'e' ? <ScienceExploreBridgeLedger /> : null}
      </div>

      <footer className="border-t border-cream/10 px-6 py-10 text-center md:px-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
          Science lab · icons + lockups · not live /science
        </p>
        <p className="mt-3 font-serif text-sm italic text-cream/55">
          Also see Vault / Atelier / Observatory Press in the HTML directions board.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
          <a href="/science" className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4">
            /science
          </a>
          <a
            href="/design/science-page-v2-directions.html"
            className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4"
          >
            HTML directions
          </a>
          <a href="/icons" className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4">
            /icons
          </a>
        </div>
      </footer>
    </PageLayout>
  );
}
