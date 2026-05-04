import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface KineticMarqueeProps {
  /** Array of text items to display, separated by dots */
  items?: string[];
  /** Scroll speed in pixels per second (base, without scroll boost) */
  baseSpeed?: number;
  /** Visual variant */
  variant?: 'light' | 'dark';
}

/**
 * Infinite scrolling text strip that reacts to scroll velocity.
 * Scrolls faster when the user scrolls faster, creating a kinetic feel.
 */
export function KineticMarquee({
  items = [
    'stop',
    'pause',
    'go within',
    'notice the voice',
    'the one listening',
    'allow',
    'no judgment',
    'peace is not circumstantial',
  ],
  baseSpeed = 60,
  variant = 'dark',
}: KineticMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    let x = 0;
    let scrollVelocity = 0;
    let animFrame = 0;

    // Track scroll velocity
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollVelocity = Math.abs(self.getVelocity());
      },
    });

    // Get the width of one content set for seamless looping
    const contentWidth = track.children[0]
      ? (track.children[0] as HTMLElement).offsetWidth
      : track.scrollWidth / 2;

    function animate() {
      const speedBoost = Math.min(scrollVelocity * 0.08, 300);
      const speed = (baseSpeed + speedBoost) / 60;
      x -= speed;

      // Reset seamlessly when one full set has passed
      if (Math.abs(x) >= contentWidth) {
        x += contentWidth;
      }

      track!.style.transform = `translateX(${x}px)`;
      scrollVelocity *= 0.95; // Decay
      animFrame = requestAnimationFrame(animate);
    }

    animFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrame);
      st.kill();
    };
  }, [baseSpeed]);

  const isDark = variant === 'dark';
  const separator = (
    <span className={`inline-block mx-6 w-1.5 h-1.5 rounded-full ${isDark ? 'bg-cream/20' : 'bg-charcoal/20'}`} />
  );

  const contentSet = (
    <div className="flex items-center shrink-0">
      {items.map((item, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span
            className={`font-serif italic text-2xl md:text-4xl lg:text-5xl whitespace-nowrap ${
              isDark ? 'text-cream/40' : 'text-charcoal/30'
            }`}
          >
            {item}
          </span>
          {separator}
        </span>
      ))}
    </div>
  );

  return (
    <section
      ref={containerRef}
      className={`w-full py-12 md:py-16 overflow-hidden ${isDark ? 'bg-charcoal' : 'bg-cream'}`}
    >
      <div ref={trackRef} className="flex items-center will-change-transform">
        {/* Duplicate content for seamless loop */}
        {contentSet}
        {contentSet}
        {contentSet}
      </div>
    </section>
  );
}
