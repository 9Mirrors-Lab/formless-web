import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ReflectionPromptProps {
  question?: string;
}

/**
 * Full-viewport section with a single centered reflection question.
 * Features an animated mesh gradient background (soft blobs) and
 * generous negative space, no scroll tricks, just atmosphere.
 */
export function ReflectionPrompt({
  question = 'What would happen if you allowed this moment to be here?',
}: ReflectionPromptProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in the question text
      gsap.from('.reflection-text', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          once: true,
        },
      });

      // Slowly drift the mesh gradient blobs
      gsap.to('.mesh-blob-1', {
        x: 60,
        y: -40,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.mesh-blob-2', {
        x: -50,
        y: 30,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.mesh-blob-3', {
        x: 30,
        y: 50,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center justify-center px-6 overflow-hidden bg-cream"
    >
      {/* Mesh gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="mesh-blob-1 absolute top-[15%] left-[20%] w-[400px] h-[400px] rounded-full bg-moss/8 blur-[100px] will-change-transform" />
        <div className="mesh-blob-2 absolute bottom-[10%] right-[15%] w-[350px] h-[350px] rounded-full bg-clay/6 blur-[120px] will-change-transform" />
        <div className="mesh-blob-3 absolute top-[50%] left-[60%] w-[300px] h-[300px] rounded-full bg-moss/5 blur-[90px] will-change-transform" />
      </div>

      {/* Question */}
      <div className="reflection-text relative z-10 text-center max-w-3xl">
        <span className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/30 mb-8 block">
          A moment to reflect
        </span>
        <p className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-charcoal/80 leading-[1.15] text-balance">
          {question}
        </p>
      </div>
    </section>
  );
}
