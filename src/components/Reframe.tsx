import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Reframe() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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

      // Phase 1: First line fades in
      tl.fromTo('.reframe-line-1', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }
      );
      
      // Hold it briefly
      tl.to('.reframe-line-1', { opacity: 1, duration: 0.5 });

      // Phase 2: Second line fades in while first dims slightly
      tl.to('.reframe-line-1', { opacity: 0.3, y: -20, duration: 1 }, '+=0.2');
      tl.fromTo('.reframe-line-2', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }, 
        '<0.2'
      );

      // Hold
      tl.to('.reframe-line-2', { opacity: 1, duration: 0.5 });

      // Phase 3: the big reveal ("who is listening?")
      tl.to('.reframe-line-2', { opacity: 0.3, y: -20, duration: 0.8 }, '+=0.2');
      tl.fromTo('.reframe-question',
        { y: 60, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2 },
        '<0.2'
      );

      // Hold the question
      tl.to('.reframe-question', { opacity: 1, duration: 1.5 });

      // Observer ripple animation (ambient, not scroll-tied)
      gsap.to('.observer-ripple', {
        scale: 3,
        opacity: 0,
        duration: 3,
        repeat: -1,
        stagger: 0.8,
        ease: 'power1.out',
        transformOrigin: '50% 50%',
      });

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={container}
      id="reframe"
      className="relative w-full h-[300vh] bg-charcoal text-cream overflow-hidden"
    >
      <div className="sticky top-0 h-[100dvh] flex items-center justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
        {/* Ambient observer ripples: very faint background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] text-moss/10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle className="observer-ripple" cx="50" cy="50" r="8" />
            <circle className="observer-ripple" cx="50" cy="50" r="8" />
            <circle className="observer-ripple" cx="50" cy="50" r="8" />
          </svg>
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal pointer-events-none" />

        {/* Text content: layered for sequential reveal */}
        <div className="relative z-10 w-full max-w-5xl text-center flex flex-col items-center gap-6">
          <p className="reframe-line-1 text-2xl md:text-4xl font-serif italic text-cream/60 leading-relaxed opacity-0">
            There is a voice in the head.
          </p>

          <p className="reframe-line-2 text-2xl md:text-4xl font-serif italic text-cream/60 leading-relaxed opacity-0">
            If you can hear the voice,
          </p>

          <h2 className="reframe-question text-5xl md:text-8xl lg:text-[9rem] font-sans font-bold leading-[0.95] tracking-tight opacity-0">
            who is<br />listening?
          </h2>
        </div>
      </div>
    </section>
  );
}
