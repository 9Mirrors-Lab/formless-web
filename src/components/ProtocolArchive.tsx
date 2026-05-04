import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const protocols = [
  {
    id: "01",
    title: "Genomic Mapping",
    desc: "A rotating double-helix gear analyzing base pairs and identifying optimal metabolic pathways.",
    artifact: "dna"
  },
  {
    id: "02",
    title: "Cellular Audit",
    desc: "Multi-layered scanning laser-grid tracking medical cells to ascertain biological age vs chronological age.",
    artifact: "cells"
  },
  {
    id: "03",
    title: "Vitals Telemetry",
    desc: "Continuous pulsing EKG waveform path optimization for heart rate variability scoring and adjustment.",
    artifact: "ekg"
  }
];

export function ProtocolArchive() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card') as HTMLElement[];
      
      cards.forEach((card, i) => {
        // Sticky pinning
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          endTrigger: container.current!,
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
        });

        // Effect when next card rolls over this one
        if (i < cards.length - 1) {
          gsap.to(card.querySelector('.card-inner'), {
            scale: 0.9,
            opacity: 0.5,
            filter: 'blur(20px)',
            ease: 'none',
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            }
          });
        }
      });
      
      // Artifact Animations
      // 1. DNA Gear
      gsap.to('.dna-gear', { rotation: 360, repeat: -1, ease: 'none', duration: 12 });
      // 2. Laser Grid
      gsap.to('.laser-line', { top: '100%', repeat: -1, yoyo: true, ease: 'sine.inOut', duration: 2.5 });
      // 3. EKG Pulse
      gsap.to('.ekg-path', { strokeDashoffset: 0, repeat: -1, ease: 'none', duration: 1.5 });

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} id="protocol" className="relative w-full bg-charcoal text-cream pb-[30vh]">
      {/* Spacer to give context before stacking */}
      <div className="w-full h-[60vh] flex items-center justify-center relative z-20">
        <h2 className="text-4xl md:text-6xl font-serif italic text-cream/60">The Protocol Archive</h2>
      </div>

      <div className="relative w-full">
        {protocols.map((protocol) => (
          <div key={protocol.id} className="protocol-card w-full h-[100dvh] flex items-center justify-center sticky top-0 px-6 overflow-hidden z-[10]">
            <div className="card-inner relative w-full max-w-6xl h-[80vh] rounded-[3rem] bg-cream text-charcoal flex flex-col md:flex-row items-center justify-between p-10 md:p-20 shadow-2xl overflow-hidden will-change-transform">
              
              <div className="w-full md:w-1/2 flex flex-col gap-6 z-10">
                <span className="font-mono text-xs tracking-widest text-moss uppercase">Phase {protocol.id}</span>
                <h3 className="text-5xl md:text-7xl font-sans font-bold leading-tight">{protocol.title}</h3>
                <p className="font-sans text-lg text-charcoal/70 max-w-md">{protocol.desc}</p>
              </div>

              <div className="w-full md:w-1/2 h-full flex items-center justify-center relative mt-12 md:mt-0">
                {protocol.artifact === 'dna' && (
                  <svg className="dna-gear w-48 h-48 md:w-64 md:h-64 text-moss will-change-transform opacity-90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="50" cy="50" r="40" strokeDasharray="3 6" />
                    <circle cx="50" cy="50" r="30" stroke="rgba(204,88,51,0.2)" />
                    <path d="M50 10 C 60 40, 40 60, 50 90 M30 50 C 40 40, 60 60, 70 50" />
                    <circle cx="50" cy="10" r="4" fill="currentColor" />
                    <circle cx="50" cy="90" r="4" fill="currentColor" />
                    <circle cx="30" cy="50" r="4" fill="currentColor" />
                    <circle cx="70" cy="50" r="4" fill="currentColor" />
                  </svg>
                )}
                
                {protocol.artifact === 'cells' && (
                  <div className="relative w-48 h-48 md:w-64 md:h-64 border border-moss/20 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-inner">
                    <div className="grid grid-cols-4 grid-rows-4 w-full h-full p-2 gap-2">
                      {Array.from({length: 16}).map((_, idx) => (
                        <div key={idx} className="w-full h-full rounded-full border border-moss/20 bg-charcoal/5" />
                      ))}
                    </div>
                    {/* Laser scanning line */}
                    <div className="laser-line absolute top-0 left-0 w-full h-[2px] bg-clay shadow-[0_0_20px_4px_rgba(204,88,51,0.6)] z-10 will-change-[top]" />
                  </div>
                )}
                
                {protocol.artifact === 'ekg' && (
                  <svg className="w-full max-w-[280px] text-clay drop-shadow-[0_0_12px_rgba(204,88,51,0.6)]" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Background grid */}
                    <path d="M0 10 H200 M0 20 H200 M0 30 H200 M0 40 H200 M0 50 H200" stroke="rgba(26,26,26,0.05)" strokeWidth="1" />
                    <path className="ekg-path" d="M0 30 H30 L40 10 L50 50 L65 5 L80 30 H200" strokeDasharray="250" strokeDashoffset="250" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
