import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const patterns = [
  {
    id: "01",
    title: "Relationships",
    desc: "A partner says something. Rage takes over. But what is really being activated? The words are new. The wound is old.",
    question: "What if the reaction has nothing to do with what was said?",
  },
  {
    id: "02",
    title: "Career & Money",
    desc: "The next raise, the next title, the next thing. The search for enough never arrives at enough. The chase itself is the suffering.",
    question: "What if the lack you feel is not about what you have?",
  },
  {
    id: "03",
    title: "Body & Health",
    desc: "The body becomes another project to fix. Another outside thing to arrange before peace is allowed. Another condition placed on being okay.",
    question: "What if peace does not require the body to be perfect?",
  }
];

export function PatternCards() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.pattern-card') as HTMLElement[];
      
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

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} id="pattern" className="relative w-full bg-charcoal text-cream pb-[30vh]">
      {/* Section header */}
      <div className="w-full h-[60vh] flex flex-col items-center justify-center relative z-20 px-6 text-center">
        <span className="font-mono text-xs tracking-[0.25em] text-moss/60 uppercase mb-6 block">
          The Pattern
        </span>
        <h2 className="text-4xl md:text-6xl font-serif italic text-cream/50">
          The subject changes.
        </h2>
      </div>

      <div className="relative w-full">
        {patterns.map((pattern) => (
          <div key={pattern.id} className="pattern-card w-full h-[100dvh] flex items-center justify-center sticky top-0 px-6 overflow-hidden z-[10]">
            <div className="card-inner relative w-full max-w-5xl h-[80vh] rounded-[3rem] bg-cream text-charcoal flex flex-col items-start justify-between p-10 md:p-16 lg:p-20 shadow-2xl overflow-hidden will-change-transform">
              
              {/* Top section */}
              <div className="flex flex-col gap-4 w-full">
                <span className="font-mono text-xs tracking-widest text-moss/60 uppercase">
                  {pattern.id}: {pattern.title}
                </span>
                <h3 className="text-4xl md:text-6xl lg:text-7xl font-serif italic leading-[1.1] text-charcoal max-w-2xl">
                  {pattern.title}
                </h3>
              </div>

              {/* Middle: description */}
              <p className="font-sans text-lg md:text-xl text-charcoal/70 max-w-xl leading-relaxed">
                {pattern.desc}
              </p>

              {/* Bottom: the question */}
              <div className="border-t border-charcoal/10 pt-8 w-full">
                <p className="font-serif italic text-xl md:text-2xl text-moss leading-relaxed max-w-lg">
                  {pattern.question}
                </p>
              </div>

              {/* Decorative element: the number, large and faded */}
              <span className="absolute -right-4 md:right-8 bottom-8 font-sans font-bold text-[12rem] md:text-[18rem] leading-none text-charcoal/[0.03] select-none pointer-events-none">
                {pattern.id}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Resolving message after all cards */}
      <div className="w-full h-[50vh] flex items-center justify-center relative z-20 px-6">
        <p className="text-3xl md:text-5xl font-serif italic text-cream/70 text-center leading-[1.2]">
          The pattern remains.
        </p>
      </div>
    </section>
  );
}
