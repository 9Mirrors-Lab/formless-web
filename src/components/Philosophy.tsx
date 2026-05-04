import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Philosophy() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax image
      gsap.to('.parallax-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Split text reveal
      gsap.from('.reveal-word', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.text-container',
          start: 'top 75%',
        }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  const renderWords = (text: string) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="reveal-word inline-block mr-3 md:mr-5">
        {word}
      </span>
    ));
  };

  return (
    <section ref={container} id="philosophy" className="relative w-full min-h-[100dvh] bg-charcoal text-cream overflow-hidden flex items-center justify-center py-32 px-6">
      <div 
        className="parallax-bg absolute top-[-20%] left-0 w-full h-[140%] bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09")' }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal pointer-events-none" />

      <div className="text-container relative z-10 w-full max-w-6xl flex flex-col gap-12 md:gap-24">
        <h2 className="text-3xl md:text-5xl lg:text-[4rem] font-serif italic text-cream/40 leading-[1.2]">
          {renderWords("Modern medicine asks: What is wrong?")}
        </h2>
        <h2 className="text-4xl md:text-7xl lg:text-[6.5rem] font-sans font-bold leading-[1.1] tracking-tight">
          {renderWords("We ask: What is optimal?")}
        </h2>
      </div>
    </section>
  );
}
