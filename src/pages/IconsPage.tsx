import { useRef } from 'react';

import { FrequencyOfMindVisual } from '@/components/FrequencyOfMindVisual';
import { TeachingIconGrid } from '@/components/iconography/TeachingIconGrid';
import { QuantumDustVisual } from '@/components/QuantumDustVisual';
import { useIconAnimations } from '@/hooks/useIconAnimations';

export default function IconsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Reference gallery: always play loops so icons can be reviewed even when OS Reduce Motion is on.
  useIconAnimations(containerRef, { ignoreReducedMotion: true });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080a09] text-cream py-20 px-5 sm:px-10 lg:px-12 selection:bg-clay/30 selection:text-cream">
      <div className="mx-auto w-full max-w-screen-2xl">
        <header className="mb-16 text-center md:text-left">
          <span className="font-mono text-xs tracking-widest text-clay uppercase">Site reference</span>
          <h1 className="text-4xl md:text-5xl font-serif italic mt-4 text-cream">Iconography</h1>
          <p className="mt-4 text-cream/72 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            Approved teaching marks for this site. Each one was drawn to stand for an idea from the Formless book and brief, not as generic decoration. Groups: measurement-style (how life gets scored), teaching themes, then the same teaching beats in narrative order. Each mark appears on light and dark so you can check contrast. Same set lives in foundations at{' '}
            <a href="/design-system" className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4 hover:text-cream">
              /design-system
            </a>
            .
          </p>
        </header>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-serif italic mb-3 border-b border-cream/10 pb-4 text-cream">Measurement-style icons</h2>
            <p className="text-sm text-cream/65 leading-relaxed max-w-2xl mb-8">
              Stands for how the book and site contrast human experience with charts, vitals, wiring, and odds: the way a life gets reduced to numbers and parts.
            </p>
            <TeachingIconGrid mode="dual" categories={['Protocol']} showCategoryLabels={false} />
          </section>

          <section>
            <h2 className="text-2xl font-serif italic mb-3 border-b border-cream/10 pb-4 text-cream">Theme icons</h2>
            <p className="text-sm text-cream/65 leading-relaxed max-w-2xl mb-8">
              One mark per teaching theme the book returns to: witness, space, ground, clarity, problems-as-label, pull of old habit, allowing, dropping judgment, and inner direction.
            </p>
            <TeachingIconGrid mode="dual" categories={['Philosophy']} showCategoryLabels={false} />
          </section>

          <section>
            <h2 className="text-2xl font-serif italic mb-3 border-b border-cream/10 pb-4 text-cream">Narrative order icons</h2>
            <p className="text-sm text-cream/65 leading-relaxed max-w-2xl mb-8">
              Same teaching beats as the client brief and book walkthrough: voice, pause, reflection, relief, trigger, shift, tangle, anchor, formless.
            </p>
            <TeachingIconGrid mode="dual" categories={['Realization']} showCategoryLabels={false} />
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-serif italic mb-3 border-b border-cream/10 pb-4 text-cream">Large studies</h2>
            <p className="text-sm text-cream/65 leading-relaxed max-w-2xl mb-8">
              Taller studies that match beats from the brief: rift, horizon, frequency of mind, tangle, and the same quantum dust field used on Brief 2.0.
            </p>
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
              {/* 1. The Rift */}
              <div className="flex flex-col gap-6 group">
                <div className="w-full aspect-[4/5] bg-[#1a2332] rounded-[2rem] overflow-hidden relative flex items-center justify-center p-8 shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.02]">
                  <svg className="w-full h-full" viewBox="0 0 400 500" fill="none" preserveAspectRatio="xMidYMid slice">
                    <rect width="400" height="500" fill="#0f141d" />
                    <circle className="rift-core" cx="200" cy="250" r="40" fill="#f4ebd9" opacity="0" style={{ filter: 'blur(25px)' }} />
                    <g className="rift-lines">
                      {Array.from({length: 50}).map((_, i) => (
                        <line key={i} x1={75 + i*5} y1={-50} x2={75 + i*5} y2={550} stroke="#1a2332" strokeWidth="2" />
                      ))}
                    </g>
                  </svg>
                </div>
                <div className="px-2">
                  <h3 className="font-sans font-bold text-xl mb-2 text-cream">The rift</h3>
                  <p className="text-cream/70 leading-relaxed">A dense, single-way reading of life that starts to split so a simpler read can register.</p>
                </div>
              </div>

              {/* 2. The Infinite Horizon */}
              <div className="flex flex-col gap-6 group">
                <div className="w-full aspect-[4/5] bg-charcoal rounded-[2rem] overflow-hidden relative flex items-center justify-center p-8 shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.02]">
                  <svg className="w-full h-full" viewBox="0 0 400 500" fill="none">
                    <rect width="400" height="500" fill="#1a1a1a" />
                    <circle cx="200" cy="250" r="5" fill="#cc5833" opacity="0.9" />
                    {Array.from({length: 12}).map((_, i) => (
                      <circle
                        key={i}
                        className="horizon-ring"
                        cx="200"
                        cy="250"
                        r={10}
                        fill="none"
                        stroke="#cc5833"
                        strokeWidth="1.5"
                        opacity="0"
                      />
                    ))}
                  </svg>
                </div>
                <div className="px-2">
                  <h3 className="font-sans font-bold text-xl mb-2 text-cream">The infinite horizon</h3>
                  <p className="text-cream/70 leading-relaxed">
                    The chase for the next fix or milestone while the present never feels like enough.
                  </p>
                </div>
              </div>

              {/* 3. Frequency of Mind */}
              <div className="flex flex-col gap-6 group">
                <div className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden relative flex items-center justify-center p-8 shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.02] border border-cream/10">
                  <FrequencyOfMindVisual className="h-full w-full min-h-0 rounded-xl bg-[#050806]" />
                </div>
                <div className="px-2">
                  <h3 className="font-sans font-bold text-xl mb-2 text-cream">Frequency of mind</h3>
                  <p className="text-cream/70 leading-relaxed">Same piece as the brief hero: noticing the density and tempo of thought, and the gap between one thought and the next. Shown here without the brief caption.</p>
                </div>
              </div>

              {/* 4. The Tangle */}
              <div className="flex flex-col gap-6 group">
                <div className="w-full aspect-[4/5] bg-[#f8f7f5] rounded-[2rem] overflow-hidden relative flex items-center justify-center p-8 border border-charcoal/5 shadow-xl transform transition-transform duration-700 group-hover:scale-[1.02]">
                  <svg className="w-full h-full" viewBox="0 0 400 500" fill="none">
                    <rect width="400" height="500" fill="#f2f0e9" />
                    <g className="tangle-group" transform="translate(200, 250)">
                      {Array.from({length: 40}).map((_, i) => {
                        const angle = (i / 40) * 360;
                        return (
                          <path key={i} className="tangle-arm" d="M 0 0 Q 75 50 150 0" transform={`rotate(${angle})`} fill="none" stroke="#cc5833" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
                        );
                      })}
                      <circle cx="0" cy="0" r="6" fill="#1a1a1a" />
                    </g>
                  </svg>
                </div>
                <div className="px-2">
                  <h3 className="font-sans font-bold text-xl mb-2 text-cream">The tangle</h3>
                  <p className="text-cream/70 leading-relaxed">Many threads of worry or to-do competing at once before attention picks one line.</p>
                </div>
              </div>

              {/* 5. Quantum dust (same canvas as Brief 2.0) */}
              <div className="flex flex-col gap-6 group">
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[2rem] border border-cream/10 p-8 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                  <QuantumDustVisual variant="embed" className="h-full w-full min-h-0 rounded-xl" />
                </div>
                <div className="px-2">
                  <h3 className="font-sans font-bold text-xl mb-2 text-cream">Quantum dust</h3>
                  <p className="text-cream/70 leading-relaxed">
                    Same canvas particle field as the Brief 2.0 hero: soft upward drift, moss-tinted specks, and light dandelion-style strokes. Shown here in a tall tile without the in-frame headline.
                  </p>
                </div>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
