/**
 * THESIS: Four cosmic home directions that import /science orbit grammar and
 * /icons teaching marks instead of inventing new chrome.
 * OWN-WORLD: brief-dark (#080a09), moss/clay/cream, Cormorant + mono,
 * Perception/Consciousness orbits, TeachingIconMark, ParticleButton, AnnoBadges.
 * STORY: Visitor compares A–D; each proves Eyes Closed can speak cosmically
 * with the design system already shipping.
 * FIRST VIEWPORT: Sticky variant switcher; active concept fills the stage.
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

  const active = COSMIC_VARIANTS.find((v) => v.id === variant) ?? COSMIC_VARIANTS[0];

  return (
    <PageLayout briefSpectrum hideNav>
      <CosmicAtmosphere>
        <header className="fixed left-1/2 top-4 z-50 flex w-[min(96%,920px)] -translate-x-1/2 flex-col gap-2 rounded-full border border-cream/12 bg-[#070806]/92 px-3 py-2 shadow-2xl shadow-black/30 backdrop-blur-md md:flex-row md:items-center md:gap-3 md:px-4">
          <a
            href="/client/review"
            className="hidden shrink-0 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45 transition-colors hover:text-cream md:inline"
          >
            Review
          </a>
          <nav
            aria-label="Cosmic concept variants"
            className="flex flex-1 items-center justify-center gap-1 overflow-x-auto"
          >
            {COSMIC_VARIANTS.map((v) => {
              const on = v.id === variant;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => select(v.id)}
                  aria-pressed={on}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay ${
                    on
                      ? 'bg-cream text-charcoal'
                      : 'text-cream/60 hover:bg-cream/8 hover:text-cream'
                  }`}
                >
                  <span className={on ? 'text-clay' : 'text-clay/80'}>{v.label}</span>
                  <span className="hidden sm:inline">{v.title}</span>
                </button>
              );
            })}
          </nav>
          <p className="hidden max-w-[140px] truncate text-right font-serif text-[11px] italic text-cream/40 lg:block">
            {active.blurb}
          </p>
        </header>

        <div className="pt-2">
          {variant === 'a' ? <CosmicAnnotatedObservatory /> : null}
          {variant === 'b' ? <CosmicIconConstellation /> : null}
          {variant === 'c' ? <CosmicPillarIndexHome /> : null}
          {variant === 'd' ? <CosmicNucleusWitness /> : null}
        </div>

        <footer className="border-t border-cream/10 px-6 py-10 text-center md:px-16">
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
    </PageLayout>
  );
}
