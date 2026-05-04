import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const hooks = [
  {
    label: "Perception",
    statement: "Your brain is not showing you reality. It is building a prediction of what reality should be.",
    note: "Neuroscience reveals that perception is constructed, not received. What you see is filtered through memory, expectation, and conditioning.",
  },
  {
    label: "Observation",
    statement: "Conscious observation changes what is being observed.",
    note: "The observer effect in quantum mechanics mirrors a deeper truth: awareness itself alters the pattern.",
  },
  {
    label: "Neuroplasticity",
    statement: "The neural pathways of suffering can be interrupted: not by force, but by awareness.",
    note: "Repeated patterns of thought create physical grooves in the brain. New attention creates new pathways.",
  },
];

export function Science() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger reveal for science hooks
      ScrollTrigger.batch('.science-hook', {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
          });
        },
        start: 'top 85%',
      });

      // Headline reveal
      gsap.from('.science-headline', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.science-headline',
          start: 'top 80%',
        }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={container}
      id="science"
      className="w-full py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-cream relative z-20"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <span className="font-mono text-xs tracking-[0.25em] text-moss/70 uppercase mb-6 block">
          A quiet bridge
        </span>

        {/* Headline */}
        <h2 className="science-headline text-3xl md:text-5xl lg:text-6xl font-serif italic text-charcoal leading-[1.15] mb-8 max-w-3xl">
          A bridge for the part of you that needs to understand.
        </h2>

        <p className="text-charcoal/55 font-sans text-base md:text-lg max-w-2xl mb-20 leading-relaxed">
          The teaching does not depend on science. But for the mind that needs a rational foothold before it can let go. Here is one.
        </p>

        {/* Science hooks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {hooks.map((hook, i) => (
            <article
              key={i}
              className="science-hook flex flex-col gap-6 border-t border-charcoal/10 pt-8"
            >
              {/* Label */}
              <span className="font-mono text-[10px] tracking-widest text-clay uppercase font-semibold">
                {hook.label}
              </span>

              {/* Statement */}
              <p className="font-serif italic text-xl md:text-2xl text-charcoal leading-[1.3]">
                {hook.statement}
              </p>

              {/* Note */}
              <p className="font-sans text-sm text-charcoal/55 leading-relaxed">
                {hook.note}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
