import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function ProtocolScheduler() {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
      
      // Initialize
      tl.set('.mock-cursor', { x: 40, y: 180, opacity: 0, scale: 1 });
      
      // Move in
      tl.to('.mock-cursor', { x: 70, y: 150, opacity: 1, duration: 0.6, ease: 'power2.out' });
      
      // Move to Thursday (index 4)
      tl.to('.mock-cursor', { x: 195, y: 50, duration: 1.2, ease: 'power3.inOut' });
      
      // Click simulation
      tl.to('.mock-cursor', { scale: 0.8, duration: 0.1 })
        .to('.day-4', { backgroundColor: '#2E4036', color: '#F2F0E9', borderColor: '#2E4036', duration: 0.2 }, '<')
        .to('.mock-cursor', { scale: 1, duration: 0.15 });
        
      // Move to save button
      tl.to('.mock-cursor', { x: 230, y: 220, duration: 1, ease: 'power2.inOut', delay: 0.3 });
      
      // Click save
      tl.to('.mock-cursor', { scale: 0.8, duration: 0.1 })
        .to('.save-btn', { scale: 0.96, backgroundColor: '#CC5833', duration: 0.1 }, '<')
        .to('.mock-cursor', { scale: 1, duration: 0.15 })
        .to('.save-btn', { scale: 1, backgroundColor: '#1A1A1A', duration: 0.15 }, '<');
        
      // Fade out and reset state for next loop
      tl.to('.mock-cursor', { opacity: 0, duration: 0.4, delay: 0.4 })
        .to('.day-4', { backgroundColor: 'transparent', color: 'inherit', borderColor: 'rgba(26,26,26,0.1)', duration: 0.4 }, '<');

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="relative w-full h-full bg-white border border-charcoal/5 rounded-[2rem] p-8 overflow-hidden flex flex-col justify-between shadow-lg">
      <div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40 mb-6 block">Adaptive Regimen</span>
        <div className="flex justify-between w-full relative z-10">
          {days.map((d, i) => (
            <div key={i} className={`day-${i} w-8 md:w-10 h-8 md:h-10 rounded-full border border-charcoal/10 flex items-center justify-center font-sans text-xs md:text-sm font-medium text-charcoal transition-colors bg-cream/30`}>
              {d}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end mt-12 relative z-10 w-full">
        <button className="save-btn w-full py-4 bg-charcoal text-cream rounded-[1.5rem] font-sans text-[10px] md:text-xs font-semibold uppercase tracking-widest transition-colors transform origin-center">
          Update Protocol
        </button>
      </div>

      {/* Mock SVG Cursor */}
      <svg 
        className="mock-cursor absolute top-0 left-0 w-8 h-8 z-30 pointer-events-none drop-shadow-xl" 
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ transformOrigin: "top left" }}
      >
        <path d="M5.5 3.21V20.8C5.5 21.43 6.22 21.78 6.71 21.39L11.41 17.65C11.66 17.45 11.97 17.35 12.28 17.35H18.5C19.13 17.35 19.48 16.63 19.09 16.14L5.5 3.21Z" fill="#1A1A1A"/>
        <path d="M5.5 3.21V20.8C5.5 21.43 6.22 21.78 6.71 21.39L11.41 17.65C11.66 17.45 11.97 17.35 12.28 17.35H18.5C19.13 17.35 19.48 16.63 19.09 16.14L5.5 3.21Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
