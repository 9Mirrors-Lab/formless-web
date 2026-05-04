import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const triggers = [
  'an email',
  'a boss',
  'a child',
  'a partner',
  'money',
  'your body',
  'family',
  'career',
];

export function Recognition() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.from('.recog-headline', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.recog-headline',
          start: 'top 80%',
        }
      });

      // Batch-stagger the trigger tags
      ScrollTrigger.batch('.trigger-tag', {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 24,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
          });
        },
        start: 'top 85%',
      });

      // Resolving line: delayed reveal
      gsap.from('.recog-resolve', {
        y: 20,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.recog-resolve',
          start: 'top 80%',
        }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={container}
      id="recognition"
      className="w-full py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-cream relative z-20"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <span className="font-mono text-xs tracking-[0.25em] text-moss/70 uppercase mb-6 block">
          Recognition
        </span>

        {/* Main headline */}
        <h2 className="recog-headline text-4xl md:text-6xl lg:text-7xl font-serif italic text-charcoal leading-[1.1] mb-20 max-w-3xl">
          One email can shift the whole day.
        </h2>

        {/* Supporting line */}
        <p className="text-charcoal/60 font-sans text-lg md:text-xl max-w-2xl mb-16 leading-relaxed">
          Something happens outside of you, and in an instant, the entire inner world rearranges.
        </p>

        {/* Trigger tags */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-24">
          {triggers.map((trigger, i) => (
            <span
              key={i}
              className="trigger-tag px-5 py-3 md:px-7 md:py-4 border border-charcoal/10 rounded-full font-sans text-sm md:text-base text-charcoal/70 bg-white/60 hover:border-moss/30 hover:bg-moss/5 transition-all duration-500 cursor-default select-none"
            >
              {trigger}
            </span>
          ))}
        </div>

        {/* Resolving line */}
        <div className="recog-resolve border-t border-charcoal/10 pt-12 max-w-2xl">
          <p className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-charcoal/80 leading-[1.3]">
            The situation changes.<br />
            <span className="text-charcoal">The pattern is the same.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
