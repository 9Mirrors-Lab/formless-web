import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Book() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.book-content > *', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container.current,
          start: 'top 70%',
        }
      });

      // Manuscript lines animate in
      gsap.from('.manuscript-line', {
        scaleX: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power2.out',
        transformOrigin: 'left center',
        scrollTrigger: {
          trigger: '.manuscript-study',
          start: 'top 75%',
        }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={container}
      id="book"
      className="w-full py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-charcoal text-cream relative z-20"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: book description */}
        <div className="book-content flex flex-col gap-8">
          <span className="font-mono text-xs tracking-[0.25em] text-moss/60 uppercase">
            The manuscript
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-cream leading-[1.1]">
            The book is a doorway into the recognition.
          </h2>

          <p className="font-sans text-cream/60 text-base md:text-lg leading-relaxed max-w-lg">
            Formless is not a method to memorize or a set of rules to follow. It is a pointing toward the awareness that has always been here, beneath the noise, beneath the search, beneath the trying.
          </p>

          <p className="font-sans text-cream/55 text-base leading-relaxed max-w-lg">
            The book covers the voice in the head, the nature of suffering, the patterns that repeat across every area of life, and the simple recognition that can begin to dissolve them.
          </p>

          <a
            href="#"
            className="mt-4 inline-flex items-center gap-3 px-8 py-4 rounded-full border border-cream/15 text-cream/80 font-sans text-sm uppercase tracking-widest font-medium hover:bg-cream/5 hover:border-cream/30 transition-all duration-500 w-fit group"
          >
            Explore the book
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Right: manuscript visual study */}
        <div className="manuscript-study relative flex flex-col justify-center gap-5 min-h-[400px] lg:min-h-[500px] bg-[#17120e] rounded-[2rem] p-10 md:p-14 overflow-hidden">
          {/* Simulated manuscript lines */}
          <span className="manuscript-line block h-[1px] w-full bg-[#cfc7ae]/20" />
          <span className="manuscript-line block h-[1px] w-[82%] bg-[#cfc7ae]/15" />
          <span className="manuscript-line block h-[1px] w-full bg-[#cfc7ae]/20" />
          <span className="manuscript-line block h-[1px] w-[65%] bg-[#cfc7ae]/15" />
          <span className="manuscript-line block h-[1px] w-full bg-[#cfc7ae]/20" />
          <span className="manuscript-line block h-[1px] w-[78%] bg-[#cfc7ae]/15" />
          
          {/* Pull quote: centered over the lines */}
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <blockquote className="font-serif italic text-2xl md:text-3xl text-[#cfc7ae]/70 text-center leading-relaxed max-w-sm">
              "You do not have to rearrange your entire life to begin."
            </blockquote>
          </div>

          {/* Subtle corner label */}
          <span className="absolute bottom-6 right-8 font-mono text-[9px] tracking-widest text-[#cfc7ae]/30 uppercase">
            Excerpt: Chapter One
          </span>
        </div>
      </div>
    </section>
  );
}
