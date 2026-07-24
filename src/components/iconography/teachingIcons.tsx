/**
 * Canonical teaching icon marks (approved).
 * Shared by /icons gallery and /design-system foundations.
 */

import type React from 'react';

export type IconTheme = 'light' | 'dark';

export type TeachingIconCategory = 'Protocol' | 'Philosophy' | 'Realization';

export interface TeachingIconSpec {
  id: string;
  title: string;
  desc: string;
  category: TeachingIconCategory;
  render: (props: { theme: IconTheme }) => React.ReactNode;
}

export const TEACHING_ICONS: TeachingIconSpec[] = [
    // --- Phase 1: Existing Protocol Icons ---
    {
      id: "dna", title: "Inherited pattern", desc: "Traits and habits that repeat across generations in the book", category: "Protocol",
      render: ({ theme }: { theme: IconTheme }) => {
        const isDark = theme === 'dark';
        const mossText = isDark ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`dna-gear w-24 h-24 ${mossText} will-change-transform opacity-90`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="40" strokeDasharray="3 6" />
            <circle cx="50" cy="50" r="30" stroke="rgba(204,88,51,0.3)" />
            <path d="M50 10 C 60 40, 40 60, 50 90 M30 50 C 40 40, 60 60, 70 50" />
            <circle cx="50" cy="10" r="4" fill="currentColor" />
            <circle cx="50" cy="90" r="4" fill="currentColor" />
            <circle cx="30" cy="50" r="4" fill="currentColor" />
            <circle cx="70" cy="50" r="4" fill="currentColor" />
          </svg>
        );
      }
    },
    {
      id: "cells", title: "Cellular read", desc: "Health and the body treated as small units under review", category: "Protocol",
      render: ({ theme }: { theme: IconTheme }) => {
        const isDark = theme === 'dark';
        const borderColor = isDark ? 'border-[#9fb5aa]/30' : 'border-moss/30';
        const bgColor = isDark ? 'bg-[#1a2332]' : 'bg-charcoal/5';
        const cellBg = isDark ? 'bg-cream/10' : 'bg-charcoal/10';
        return (
          <div className={`relative w-24 h-24 border ${borderColor} rounded-xl overflow-hidden ${bgColor} shadow-inner`}>
            <div className="grid grid-cols-4 grid-rows-4 w-full h-full p-1 gap-1">
              {Array.from({length: 16}).map((_, idx) => (
                <div key={idx} className={`w-full h-full rounded-full border ${borderColor} ${cellBg}`} />
              ))}
            </div>
            <div className="laser-line absolute top-0 left-0 w-full h-[2px] bg-clay shadow-[0_0_12px_3px_rgba(204,88,51,0.6)] z-10 will-change-[top]" />
          </div>
        );
      }
    },
    {
      id: "ekg", title: "Vital trace", desc: "Stress and arousal in the body before the explanation catches up", category: "Protocol",
      render: ({ theme }: { theme: IconTheme }) => {
        const gridColor = theme === 'dark' ? 'rgba(242,240,233,0.1)' : 'rgba(26,26,26,0.1)';
        return (
          <svg className="w-full max-w-[120px] text-clay drop-shadow-[0_0_8px_rgba(204,88,51,0.6)]" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M0 10 H200 M0 20 H200 M0 30 H200 M0 40 H200 M0 50 H200" stroke={gridColor} strokeWidth="1" />
            <path className="ekg-path" d="M0 30 H30 L40 10 L50 50 L65 5 L80 30 H200" strokeDasharray="250" strokeDashoffset="250" />
          </svg>
        );
      }
    },
    {
      id: "neural", title: "Linked thoughts", desc: "One memory or belief firing the next in a chain", category: "Protocol",
      render: ({ theme }: { theme: IconTheme }) => {
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`w-24 h-24 ${mossText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <line className="neural-link" x1="20" y1="20" x2="50" y2="50" />
            <line className="neural-link" x1="80" y1="20" x2="50" y2="50" />
            <line className="neural-link" x1="20" y1="80" x2="50" y2="50" />
            <line className="neural-link" x1="80" y1="80" x2="50" y2="50" />
            <line className="neural-link" x1="50" y1="15" x2="50" y2="50" />
            <line className="neural-link" x1="15" y1="50" x2="50" y2="50" />
            <circle className="neural-node" cx="50" cy="50" r="8" fill="rgba(204,88,51,0.2)" stroke="currentColor" />
            <circle className="neural-node" cx="20" cy="20" r="5" fill="currentColor" />
            <circle className="neural-node" cx="80" cy="20" r="5" fill="currentColor" />
            <circle className="neural-node" cx="20" cy="80" r="5" fill="currentColor" />
            <circle className="neural-node" cx="80" cy="80" r="5" fill="currentColor" />
            <circle className="neural-node" cx="50" cy="15" r="4" fill="currentColor" />
            <circle className="neural-node" cx="15" cy="50" r="4" fill="currentColor" />
          </svg>
        );
      }
    },
    {
      id: "molecule", title: "Bonds", desc: "What holds a habit or identity in place, and what lets it release", category: "Protocol",
      render: () => (
        <svg className="w-24 h-24 text-clay" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <g className="molecule-group">
            <polygon points="50,20 76,35 76,65 50,80 24,65 24,35" strokeDasharray="4 4" />
            <line x1="50" y1="20" x2="50" y2="50" />
            <line x1="24" y1="65" x2="50" y2="50" />
            <line x1="76" y1="65" x2="50" y2="50" />
            <circle className="molecule-atom" cx="50" cy="20" r="6" fill="currentColor" />
            <circle className="molecule-atom" cx="76" cy="35" r="4" fill="currentColor" />
            <circle className="molecule-atom" cx="76" cy="65" r="6" fill="currentColor" />
            <circle className="molecule-atom" cx="50" cy="80" r="4" fill="currentColor" />
            <circle className="molecule-atom" cx="24" cy="65" r="6" fill="currentColor" />
            <circle className="molecule-atom" cx="24" cy="35" r="4" fill="currentColor" />
            <circle className="molecule-atom" cx="50" cy="50" r="8" fill="rgba(204,88,51,0.3)" />
          </g>
        </svg>
      )
    },
    {
      id: "quantum", title: "Open outcome", desc: "Several futures still in play before you lock one in", category: "Protocol",
      render: ({ theme }: { theme: IconTheme }) => {
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`w-24 h-24 ${mossText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle className="quantum-ring-1" cx="50" cy="50" r="40" strokeDasharray="10 15 30 10" stroke="rgba(204,88,51,0.8)" />
            <circle className="quantum-ring-2" cx="50" cy="50" r="30" strokeDasharray="20 10 5 15" />
            <circle className="quantum-ring-3" cx="50" cy="50" r="20" strokeDasharray="5 5" />
            <circle className="quantum-core-dot" cx="50" cy="50" r="6" fill="currentColor" />
            <path d="M 50 20 L 50 30 M 50 70 L 50 80 M 20 50 L 30 50 M 70 50 L 80 50" strokeWidth="2" />
          </svg>
        );
      }
    },
    
    // --- Phase 2: Philosophical Icons ---
    {
      id: "observer", title: "The observer", desc: "The witness who can notice experience without being identical to it", category: "Philosophy",
      render: ({ theme }: { theme: IconTheme }) => {
        const isDark = theme === 'dark';
        const primaryText = isDark ? 'text-cream' : 'text-charcoal';
        const mossText = isDark ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`w-24 h-24 ${primaryText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle className={`observer-wave ${mossText} opacity-40`} cx="50" cy="50" r="10" />
            <circle className={`observer-wave ${mossText} opacity-60`} cx="50" cy="50" r="10" />
            <circle className={`observer-wave ${mossText} opacity-80`} cx="50" cy="50" r="10" />
            <circle cx="50" cy="50" r="6" fill="currentColor" />
          </svg>
        );
      }
    },
    {
      id: "space", title: "Creating space", desc: "Room between you and the first rush to react or fix", category: "Philosophy",
      render: ({ theme }: { theme: IconTheme }) => {
        const circleClass = theme === 'dark' ? 'text-cream/30' : 'text-charcoal/50';
        return (
          <svg className="w-24 h-24 text-clay" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <defs>
              <clipPath id={`space-clip-${theme}`}>
                <circle className="space-circle-left" cx="40" cy="50" r="20" />
              </clipPath>
            </defs>
            <circle className="space-circle-right text-clay" cx="60" cy="50" r="20" fill="currentColor" stroke="none" clipPath={`url(#space-clip-${theme})`} />
            <circle className={`space-circle-left ${circleClass}`} cx="40" cy="50" r="20" />
            <circle className={`space-circle-right ${circleClass}`} cx="60" cy="50" r="20" />
          </svg>
        );
      }
    },
    {
      id: "awakening", title: "The awakening", desc: "A situation you treated as closed now reads as workable", category: "Philosophy",
      render: ({ theme }: { theme: IconTheme }) => {
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`w-24 h-24 ${mossText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <defs>
              <clipPath id={`horizon-clip-${theme}`}>
                <rect x="0" y="0" width="100" height="70" />
              </clipPath>
            </defs>
            <line x1="20" y1="70" x2="80" y2="70" />
            <g clipPath={`url(#horizon-clip-${theme})`}>
              <path className="wake-sun" d="M 35 70 A 15 15 0 0 1 65 70" />
            </g>
            <line className="wake-beam" x1="50" y1="45" x2="50" y2="35" />
            <line className="wake-beam" x1="35" y1="50" x2="28" y2="43" />
            <line className="wake-beam" x1="65" y1="50" x2="72" y2="43" />
          </svg>
        );
      }
    },
    {
      id: "grounded", title: "Deep roots", desc: "Staying steady while conditions around you move", category: "Philosophy",
      render: ({ theme }: { theme: IconTheme }) => {
        const isDark = theme === 'dark';
        const primaryText = isDark ? 'text-cream' : 'text-charcoal';
        const windColor = isDark ? 'text-clay/50' : 'text-clay/30';
        const mossText = isDark ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`w-24 h-24 ${primaryText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <g className={`ground-wind ${windColor}`}>
              <path d="M 20 40 Q 50 10 80 40" strokeDasharray="5 15" />
              <path d="M 15 50 Q 50 80 85 50" strokeDasharray="10 20" />
            </g>
            <line className={`ground-root ${mossText}`} x1="50" y1="50" x2="50" y2="80" />
            <line className={`ground-root ${mossText}`} x1="50" y1="65" x2="35" y2="80" />
            <line className={`ground-root ${mossText}`} x1="50" y1="65" x2="65" y2="80" />
            <circle cx="50" cy="50" r="6" fill="currentColor" />
          </svg>
        );
      }
    },
    {
      id: "clarity", title: "Fog to clarity", desc: "Dense worry thinning until you can name what is actually there", category: "Philosophy",
      render: ({ theme }: { theme: IconTheme }) => {
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`w-24 h-24 ${mossText}`} viewBox="0 0 100 100" fill="currentColor">
            {Array.from({length: 12}).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const x = 50 + Math.cos(angle) * 20;
              const y = 50 + Math.sin(angle) * 20;
              const scatterX = (Math.random() - 0.5) * 60;
              const scatterY = (Math.random() - 0.5) * 60;
              return (
                <circle key={i} className="fog-dot" cx={x} cy={y} r="3" style={{ transform: `translate(${scatterX}px, ${scatterY}px)`, opacity: 0.2 }} />
              );
            })}
          </svg>
        );
      }
    },
    {
      id: "illusion", title: "Illusion of problems", desc: "A problem framed as a solid object when it is partly narrative", category: "Philosophy",
      render: ({ theme }: { theme: IconTheme }) => {
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className="w-24 h-24 text-clay" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect className="illusion-box" x="35" y="35" width="30" height="30" />
            <circle className={`illusion-ring ${mossText}`} cx="50" cy="50" r="25" strokeDasharray="4 8" />
          </svg>
        );
      }
    },
    {
      id: "undertow", title: "The undertow", desc: "The pull back into worry or chase right after a pause", category: "Philosophy",
      render: ({ theme }: { theme: IconTheme }) => {
        const primaryText = theme === 'dark' ? 'text-cream' : 'text-charcoal';
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`w-24 h-24 ${primaryText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <g className="undertow-group">
              <path d="M 30 50 A 20 20 0 0 1 70 50" />
              <polygon points="70,50 65,45 75,45" fill="currentColor" />
              <path d="M 70 50 A 20 20 0 0 1 30 50" />
              <polygon points="30,50 25,55 35,55" fill="currentColor" />
            </g>
            <circle cx="50" cy="50" r="4" fill="currentColor" className={mossText} />
          </svg>
        );
      }
    },
    {
      id: "flow", title: "Allowing / the flow", desc: "Letting events move without controlling each beat", category: "Philosophy",
      render: ({ theme }: { theme: IconTheme }) => {
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <div className="w-24 h-24 overflow-hidden relative flex items-center">
            <svg className={`absolute w-[200px] h-full ${mossText}`} viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path className="flow-wave" d="M 0 50 Q 25 25, 50 50 T 100 50 T 150 50 T 200 50" />
            </svg>
          </div>
        );
      }
    },
    {
      id: "releasing", title: "Releasing judgment", desc: "Dropping the verdict on yourself or someone else", category: "Philosophy",
      render: ({ theme }: { theme: IconTheme }) => {
        const primaryText = theme === 'dark' ? 'text-cream' : 'text-charcoal';
        return (
          <svg className={`w-24 h-24 ${primaryText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <circle className="release-knot" cx="50" cy="60" r="10" />
            <path className="release-knot" d="M 40 60 L 60 60 M 50 50 L 50 70" />
            <path className="release-line text-clay" d="M 50 50 Q 60 30, 50 20" strokeLinecap="round" />
            <path className="release-line text-clay" d="M 40 55 Q 30 40, 35 25" strokeLinecap="round" />
            <path className="release-line text-clay" d="M 60 55 Q 70 40, 65 25" strokeLinecap="round" />
          </svg>
        );
      }
    },
    {
      id: "north", title: "True north", desc: "Direction that does not depend on comparison or approval", category: "Philosophy",
      render: ({ theme }: { theme: IconTheme }) => {
        const primaryText = theme === 'dark' ? 'text-cream' : 'text-charcoal';
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`w-24 h-24 ${mossText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="30" strokeDasharray="1 6" />
            <g className="north-needle">
              <path d="M 50 20 L 55 50 L 50 80 L 45 50 Z" fill="currentColor" className="text-clay/20" />
              <path d="M 50 20 L 55 50 L 45 50 Z" fill="currentColor" className="text-clay" />
            </g>
            <circle cx="50" cy="50" r="4" fill="currentColor" className={primaryText} />
          </svg>
        );
      }
    },
    // --- Phase 3: The Realization (Narrative) ---
    {
      id: "voice", title: "The voice", desc: "The running commentary the book separates from who you are", category: "Realization",
      render: ({ theme }: { theme: IconTheme }) => {
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`w-24 h-24 ${mossText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle className="voice-ring" cx="50" cy="50" r="30" strokeDasharray="4 8 12 8" />
            <circle className="voice-ring" cx="50" cy="50" r="20" strokeDasharray="10 5" strokeOpacity="0.6" />
            <circle cx="50" cy="50" r="8" fill="currentColor" stroke="none" />
          </svg>
        );
      }
    },
    {
      id: "pause", title: "The pause", desc: "A full stop before the next reaction or fix", category: "Realization",
      render: ({ theme }: { theme: IconTheme }) => {
        const primaryText = theme === 'dark' ? 'text-cream' : 'text-charcoal';
        return (
          <svg className={`w-24 h-24 ${primaryText}`} viewBox="0 0 100 100" fill="currentColor">
            <rect className="pause-bar-left" x="35" y="30" width="8" height="40" rx="4" />
            <rect className="pause-bar-right" x="57" y="30" width="8" height="40" rx="4" />
          </svg>
        );
      }
    },
    {
      id: "reflection", title: "The reflection", desc: "Seeing your part in a situation, not only the other person or event", category: "Realization",
      render: ({ theme }: { theme: IconTheme }) => {
        const primaryText = theme === 'dark' ? 'text-cream' : 'text-charcoal';
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`w-24 h-24 ${primaryText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <line className="reflect-line" x1="50" y1="20" x2="50" y2="80" strokeDasharray="4 4" />
            <circle className={`reflect-circle-left ${mossText}`} cx="30" cy="50" r="10" fill="currentColor" stroke="none" opacity="0.8" />
            <circle className={`reflect-circle-right ${mossText}`} cx="70" cy="50" r="10" fill="none" />
          </svg>
        );
      }
    },
    {
      id: "relief", title: "The relief", desc: "Ease when a tight frame finally lets go", category: "Realization",
      render: ({ theme }: { theme: IconTheme }) => {
        const primaryText = theme === 'dark' ? 'text-cream' : 'text-charcoal';
        return (
          <svg className={`w-24 h-24 ${primaryText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
            <rect className="relief-box" x="25" y="25" width="50" height="50" rx="4" ry="4" />
          </svg>
        );
      }
    },
    {
      id: "trigger", title: "The trigger", desc: "The exact contact point where a reaction starts", category: "Realization",
      render: ({ theme }: { theme: IconTheme }) => {
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        const clayText = 'text-clay';
        return (
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon className={`trigger-arrow ${clayText}`} points="25,40 45,50 25,60" fill="currentColor" stroke="none" />
            <path className={`trigger-shield ${mossText}`} d="M 65 30 Q 55 50, 65 70" strokeLinecap="round" />
          </svg>
        );
      }
    },
    {
      id: "shift", title: "Internal shift", desc: "Same facts, different weight after the teaching lands", category: "Realization",
      render: ({ theme }: { theme: IconTheme }) => {
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`w-24 h-24 ${mossText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect className="shift-diamond" x="30" y="30" width="40" height="40" transform="rotate(45 50 50)" />
            <circle className="shift-core text-clay" cx="50" cy="50" r="4" fill="currentColor" stroke="none" />
          </svg>
        );
      }
    },
    {
      id: "tangle", title: "Untangling", desc: "Busy thinking simplifying until one clear line remains", category: "Realization",
      render: ({ theme }: { theme: IconTheme }) => {
        const primaryText = theme === 'dark' ? 'text-cream' : 'text-charcoal';
        return (
          <svg className={`w-24 h-24 ${primaryText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path className="tangle-chaos text-clay" d="M 20 50 C 40 20, 30 80, 50 50 C 70 20, 60 80, 80 50" strokeLinecap="round" />
            <line className="tangle-straight" x1="20" y1="50" x2="80" y2="50" strokeLinecap="round" />
          </svg>
        );
      }
    },
    {
      id: "anchor", title: "The anchor", desc: "A steady place to return to when attention scatters", category: "Realization",
      render: ({ theme }: { theme: IconTheme }) => {
        const mossText = theme === 'dark' ? 'text-[#9fb5aa]' : 'text-moss';
        return (
          <svg className={`w-24 h-24 ${mossText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <g className="anchor-pendulum will-change-transform">
              <line x1="50" y1="20" x2="50" y2="67" strokeLinecap="round" />
              <circle cx="50" cy="75" r="8" fill="currentColor" stroke="none" />
            </g>
            <circle cx="50" cy="20" r="3" fill="currentColor" stroke="none" />
          </svg>
        );
      }
    },
    {
      id: "formless", title: "The formless", desc: "The teaching that a problem is often a label, not a fixed object", category: "Realization",
      render: ({ theme }: { theme: IconTheme }) => {
        const primaryText = theme === 'dark' ? 'text-cream' : 'text-charcoal';
        return (
          <svg className={`w-24 h-24 ${primaryText}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <circle className="formless-ring" cx="50" cy="50" r="10" />
            <circle className="formless-ring" cx="50" cy="50" r="10" />
            <circle className="formless-ring" cx="50" cy="50" r="10" />
          </svg>
        );
      }
    }
  ];

export const TEACHING_ICON_CATEGORIES: TeachingIconCategory[] = [
  'Protocol',
  'Philosophy',
  'Realization',
];

export const TEACHING_ICON_CATEGORY_LABELS: Record<TeachingIconCategory, string> = {
  Protocol: 'Measurement-style',
  Philosophy: 'Theme',
  Realization: 'Narrative order',
};
