/* eslint-disable react-hooks/purity */
import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Reflection() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Main timeline: pinned fog-to-clarity
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          pinSpacing: true,
          scrub: 1,
        }
      });

      // Phase 1: Fog particles drift and scatter
      tl.to('.fog-particle', {
        x: 0,
        y: 0,
        opacity: 0.06,
        duration: 2,
        stagger: { each: 0.04, from: 'random' },
        ease: 'power2.inOut',
      }, 0);

      // Phase 2: Background blur clears
      tl.fromTo('.fog-veil',
        { backdropFilter: 'blur(12px)', opacity: 1 },
        { backdropFilter: 'blur(0px)', opacity: 0, duration: 2 },
        0.5
      );

      // Phase 3: Question emerges
      tl.fromTo('.reflect-question',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5 },
        1
      );

      // Phase 4: Guidance line
      tl.fromTo('.reflect-guide',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5 },
        2
      );

      // Hold
      tl.to('.reflect-question', { opacity: 1, duration: 2 });

    }, container);
    return () => ctx.revert();
  }, []);

  // Generate scattered fog particles
  const particles = React.useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 100 + Math.random() * 200;
    return {
      id: i,
      startX: Math.cos(angle) * radius * (0.5 + Math.random()),
      startY: Math.sin(angle) * radius * (0.5 + Math.random()),
      size: 60 + Math.random() * 120,
    };
  }), []);

  return (
    <section
      ref={container}
      id="reflection"
      className="relative w-full h-[400vh] bg-charcoal overflow-hidden scroll-mt-16"
    >
      <div className="sticky top-0 h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Ambient background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-[#1a2a22] to-charcoal" />

        {/* Fog particles: scattered blobs that coalesce */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="fog-particle absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle, rgba(159,181,170,0.15) 0%, transparent 70%)`,
                transform: `translate(${p.startX}px, ${p.startY}px)`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>

        {/* Fog veil: initial blur overlay */}
        <div className="fog-veil absolute inset-0 bg-charcoal/40" />

        {/* Section label */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2">
          <span className="font-mono text-xs tracking-[0.25em] text-moss/40 uppercase">
            A moment to reflect
          </span>
        </div>

        {/* Content: revealed through fog */}
        <div className="relative z-10 text-center px-6 max-w-3xl flex flex-col items-center gap-10">
          <h2 className="reflect-question text-3xl md:text-5xl lg:text-6xl font-serif italic text-cream leading-[1.15] opacity-0">
            What would happen if you allowed this moment to be here?
          </h2>

          <p className="reflect-guide text-cream/50 font-sans text-base md:text-lg leading-relaxed max-w-xl opacity-0">
            Notice the thought. The feeling. The resistance. The judgment.
            <br />
            <span className="text-cream/70 mt-2 block">Let it be seen. Let it be allowed. Let judgment soften.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
