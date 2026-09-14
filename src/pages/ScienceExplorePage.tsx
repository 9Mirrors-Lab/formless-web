/**
 * THESIS: Five science page compositions inside the established Formless dark world,
 * swapping icons, lockups, and scroll mechanics while keeping production copy.
 * OWN-WORLD: brief-dark, moss/clay/cream, Cormorant + mono, TeachingIconMark, orbits.
 * STORY: Visitor compares A–E; each proves Spirituality & Science can wear different
 * brand marks without leaving the sanctuary tone.
 * FIRST VIEWPORT: Bottom variant switcher; active concept fills the stage.
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
import { DesignReviewSwitcher } from '@/components/design-lab/DesignReviewSwitcher';
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

  return (
    <PageLayout briefSpectrum hideNav>
      <div>
        {variant === 'a' ? <SciencePage embedded /> : null}
        {variant === 'b' ? <ScienceExploreIconAtlas /> : null}
        {variant === 'c' ? <ScienceExploreSpecimenIndex /> : null}
        {variant === 'd' ? <ScienceExploreWitnessNucleus /> : null}
        {variant === 'e' ? <ScienceExploreBridgeLedger /> : null}
      </div>

      <footer className="border-t border-cream/10 px-6 py-10 pb-28 text-center md:px-16">
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

      <DesignReviewSwitcher
        ariaLabel="Science page layout"
        activeId={variant}
        onSelect={(id) => select(id as ScienceExploreVariantId)}
        items={SCIENCE_EXPLORE_VARIANTS.map((v, i) => ({
          id: v.id,
          index: String(i + 1).padStart(2, '0'),
          label: v.title,
        }))}
      />
    </PageLayout>
  );
}
