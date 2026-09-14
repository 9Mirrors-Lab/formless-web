/**
 * THESIS: Four cosmic home directions that import /science orbit grammar and
 * /icons teaching marks instead of inventing new chrome.
 * OWN-WORLD: brief-dark (#080a09), moss/clay/cream, Cormorant + mono,
 * Perception/Consciousness orbits, TeachingIconMark, ParticleButton, AnnoBadges.
 * STORY: Visitor compares A–D; each proves Eyes Closed can speak cosmically
 * with the design system already shipping.
 * FIRST VIEWPORT: Bottom variant switcher; active concept fills the stage.
 * FORM: Lab surface (not production home). Concepts from cosmic-design-system board.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the
 * finish review, the verdict, and DESIGN.md — lab page only; DESIGN.md unchanged
 * until a concept is promoted.
 */

import { useCallback, useEffect, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { CosmicAnnotatedObservatory } from '@/components/cosmic/CosmicAnnotatedObservatory';
import { CosmicIconConstellation } from '@/components/cosmic/CosmicIconConstellation';
import { CosmicNucleusWitness } from '@/components/cosmic/CosmicNucleusWitness';
import { CosmicPillarIndexHome } from '@/components/cosmic/CosmicPillarIndexHome';
import { DesignReviewSwitcher } from '@/components/design-lab/DesignReviewSwitcher';
import {
  CosmicAtmosphere,
  COSMIC_VARIANTS,
  type CosmicVariantId,
} from '@/components/cosmic/cosmicShared';

function readVariant(): CosmicVariantId {
  const hash = window.location.hash.replace(/^#/, '').toLowerCase();
  if (hash === 'a' || hash === 'b' || hash === 'c' || hash === 'd') return hash;
  const q = new URLSearchParams(window.location.search).get('v');
  if (q === 'a' || q === 'b' || q === 'c' || q === 'd') return q;
  return 'a';
}

export default function CosmicConceptsPage() {
  const [variant, setVariant] = useState<CosmicVariantId>(() =>
    typeof window !== 'undefined' ? readVariant() : 'a',
  );

  useEffect(() => {
    const sync = () => setVariant(readVariant());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const select = useCallback((id: CosmicVariantId) => {
    setVariant(id);
    const url = new URL(window.location.href);
    url.hash = id;
    url.searchParams.delete('v');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout briefSpectrum hideNav>
      <CosmicAtmosphere>
        <div>
          {variant === 'a' ? <CosmicAnnotatedObservatory /> : null}
          {variant === 'b' ? <CosmicIconConstellation /> : null}
          {variant === 'c' ? <CosmicPillarIndexHome /> : null}
          {variant === 'd' ? <CosmicNucleusWitness /> : null}
        </div>

        <footer className="border-t border-cream/10 px-6 py-10 pb-28 text-center md:px-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
            Cosmic lab · design system + /science · not live home
          </p>
          <p className="mt-3 font-serif text-sm italic text-cream/55">
            Promote one direction into HomeHero when the choice lands.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
            <a href="/science" className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4">
              /science
            </a>
            <a href="/icons" className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4">
              /icons
            </a>
            <a href="/design-system" className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4">
              /design-system
            </a>
          </div>
        </footer>
      </CosmicAtmosphere>

      <DesignReviewSwitcher
        ariaLabel="Cosmic home layout"
        activeId={variant}
        onSelect={(id) => select(id as CosmicVariantId)}
        items={COSMIC_VARIANTS.map((v, i) => ({
          id: v.id,
          index: String(i + 1).padStart(2, '0'),
          label: v.title,
        }))}
      />
    </PageLayout>
  );
}
