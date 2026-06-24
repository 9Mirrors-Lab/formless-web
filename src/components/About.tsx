import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-content > *', {
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
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={container}
      id="about"
      className="w-full py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-cream relative z-20 scroll-mt-16"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
        {/* Left column: photo placeholder */}
        <div className="lg:col-span-2">
          <div 
            className="w-full aspect-[3/4] rounded-[2rem] bg-cover bg-center bg-no-repeat overflow-hidden"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80")' }}
          >
            {/* Nature/landscape placeholder until author photo is available */}
            <div className="w-full h-full bg-gradient-to-t from-charcoal/20 to-transparent" />
          </div>
          <p className="font-mono text-[10px] tracking-widest text-charcoal/30 uppercase mt-4 text-center">
            Author photograph (coming soon)
          </p>
        </div>

        {/* Right column: about copy */}
        <div className="about-content lg:col-span-3 flex flex-col gap-8">
          <span className="font-mono text-xs tracking-[0.25em] text-moss/70 uppercase">
            The author
          </span>

          <h2 className="text-4xl md:text-5xl font-serif italic text-charcoal leading-[1.1]">
            A living teaching, still unfolding.
          </h2>

          <p className="font-sans text-charcoal/65 text-base md:text-lg leading-relaxed">
            This work did not begin as a theory. It began as a breaking point: the moment when the old way of living stopped working entirely, and something quieter took its place.
          </p>

          <p className="font-sans text-charcoal/65 text-base md:text-lg leading-relaxed">
            Formless is the beginning of something larger: a book, future talks, retreats, community, and deeper teachings that all stem from one foundation. That foundation is the recognition that you are not the voice in the head, and that peace does not depend on outer circumstances arranging themselves.
          </p>

          <p className="font-sans text-charcoal/65 text-base md:text-lg leading-relaxed">
            The writing continues. The teaching unfolds. This is a studio for a work in progress, not a storefront.
          </p>

          <a
            href="mailto:hello@eyesclosed.love"
            className="mt-4 inline-flex items-center gap-3 text-moss font-sans text-sm uppercase tracking-widest font-medium hover:text-clay transition-colors duration-500 group w-fit"
          >
            Get in touch
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
