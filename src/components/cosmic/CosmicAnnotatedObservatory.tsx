import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  CosmicAnnoBadge,
  CosmicHeroCopyBlock,
  CosmicIconStage,
  IconNode,
  OrbitRingsPerception,
} from './cosmicShared';

/**
 * A — Annotated observatory
 * Science split + teaching icons on clay annotation nodes.
 */
export function CosmicAnnotatedObservatory() {
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const nucleus = el.querySelector('.cosmic-nucleus');
    if (!nucleus) return;
    const ctx = gsap.context(() => {
      gsap.to(nucleus, {
        scale: 1.03,
        duration: 5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        transformOrigin: '50% 50%',
      });
    }, stageRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden px-6 pb-20 pt-28 md:px-16 md:pt-32 lg:px-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.15fr_1fr] md:gap-10 lg:gap-16">
        <CosmicHeroCopyBlock className="relative z-10 max-w-[560px]" />

        <CosmicIconStage className="relative z-10 mx-auto w-full max-w-[520px] md:max-w-none">
          <div ref={stageRef} className="relative aspect-[800/700] w-full">
            <div className="absolute inset-0 opacity-90">
              <OrbitRingsPerception />
            </div>

            {/* Nucleus — observer */}
            <div className="cosmic-nucleus absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <IconNode id="observer" size={56} />
            </div>

            {/* Outer prediction node — voice (right) */}
            <div className="absolute right-[2%] top-1/2 z-10 -translate-y-1/2 md:right-[4%]">
              <IconNode id="voice" size={36} />
              <CosmicAnnoBadge
                keyChar="A"
                label="The voice"
                align="left"
                className="right-full top-1/2 mr-2 hidden -translate-y-1/2 sm:flex"
              />
            </div>

            {/* Bias node — neural (top) */}
            <div className="absolute left-1/2 top-[6%] z-10 -translate-x-1/2">
              <IconNode id="neural" size={32} />
              <CosmicAnnoBadge
                keyChar="B"
                label="Linked thoughts"
                className="left-full top-1/2 ml-2 hidden -translate-y-1/2 sm:flex"
              />
            </div>

            {/* Secondary — pause */}
            <div className="absolute left-[68%] top-[22%] z-10 hidden opacity-70 md:block">
              <IconNode id="pause" size={24} />
            </div>
          </div>
        </CosmicIconStage>
      </div>

      {/* Mobile: orbit under copy at reduced opacity */}
      <p className="mx-auto mt-10 max-w-6xl font-mono text-[10px] uppercase tracking-[0.2em] text-cream/35 md:hidden">
        Teaching marks · observer · voice · neural
      </p>
    </section>
  );
}
