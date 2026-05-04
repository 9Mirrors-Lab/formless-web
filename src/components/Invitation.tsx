import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Invitation() {
  const container = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [email, setEmail] = useState('');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.invite-content > *', {
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

      // Magnetic button effect
      const btn = buttonRef.current;
      if (!btn) return;

      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.25;
        const dy = (e.clientY - cy) * 0.25;
        gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
      };

      const onLeave = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
      };

      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);

      return () => {
        btn.removeEventListener('mousemove', onMove);
        btn.removeEventListener('mouseleave', onLeave);
      };
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={container}
      id="invitation"
      className="w-full py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-cream relative z-20"
    >
      <div className="invite-content max-w-2xl mx-auto text-center flex flex-col items-center gap-8">
        <span className="font-mono text-xs tracking-[0.25em] text-moss/70 uppercase">
          Stay close
        </span>

        <h2 className="text-4xl md:text-6xl font-serif italic text-charcoal leading-[1.1]">
          Return when you are ready.
        </h2>

        <p className="font-sans text-charcoal/55 text-base md:text-lg leading-relaxed max-w-lg">
          Receive reflections, notes from the desk, and the occasional silence. No urgency. No pressure. Just a quiet thread when there is something worth sharing.
        </p>

        {/* Email form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-md mt-8 flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="flex-grow px-6 py-4 rounded-full border border-charcoal/10 bg-white/60 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-moss/40 focus:bg-white transition-all duration-300"
          />
          <button
            ref={buttonRef}
            type="submit"
            className="px-8 py-4 rounded-full bg-charcoal text-cream font-sans text-xs uppercase tracking-widest font-semibold hover:bg-moss transition-colors duration-500 will-change-transform whitespace-nowrap"
          >
            Stay close
          </button>
        </form>

        <p className="font-mono text-[10px] tracking-widest text-charcoal/25 uppercase mt-2">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
