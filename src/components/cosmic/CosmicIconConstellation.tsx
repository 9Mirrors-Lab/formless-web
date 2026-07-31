import { useState } from 'react';
import {
  CosmicAnnoBadge,
  CosmicHeroCopyBlock,
  CosmicIconStage,
  IconNode,
} from './cosmicShared';

type FieldMark = {
  id: string;
  title: string;
  x: string;
  y: string;
  size: number;
  opacity: number;
  hub?: boolean;
};

const FIELD: FieldMark[] = [
  { id: 'dna', title: 'Inherited pattern', x: '8%', y: '18%', size: 36, opacity: 0.38 },
  { id: 'neural', title: 'Linked thoughts', x: '28%', y: '12%', size: 40, opacity: 0.42 },
  { id: 'quantum', title: 'Open outcome', x: '52%', y: '8%', size: 36, opacity: 0.4 },
  { id: 'seed', title: 'Seed of life', x: '78%', y: '16%', size: 40, opacity: 0.36 },
  { id: 'ekg', title: 'Vital trace', x: '88%', y: '42%', size: 44, opacity: 0.45 },
  { id: 'observer', title: 'The observer', x: '48%', y: '48%', size: 64, opacity: 0.92, hub: true },
  { id: 'space', title: 'Creating space', x: '18%', y: '52%', size: 36, opacity: 0.4 },
  { id: 'molecule', title: 'Bonds', x: '72%', y: '58%', size: 40, opacity: 0.38 },
  { id: 'pause', title: 'The pause', x: '32%', y: '78%', size: 36, opacity: 0.42 },
  { id: 'anchor', title: 'The anchor', x: '58%', y: '82%', size: 36, opacity: 0.4 },
  { id: 'voice', title: 'The voice', x: '6%', y: '78%', size: 32, opacity: 0.34 },
  { id: 'clarity', title: 'Fog to clarity', x: '88%', y: '78%', size: 36, opacity: 0.36 },
];

const HUB_LINKS: { x1: string; y1: string; x2: string; y2: string }[] = [
  { x1: '28%', y1: '12%', x2: '48%', y2: '48%' },
  { x1: '52%', y1: '8%', x2: '48%', y2: '48%' },
  { x1: '18%', y1: '52%', x2: '48%', y2: '48%' },
  { x1: '72%', y1: '58%', x2: '48%', y2: '48%' },
  { x1: '88%', y1: '42%', x2: '48%', y2: '48%' },
];

/**
 * B — Icon constellation field
 * TeachingIcon registry as cosmic weather on the right plane.
 */
export function CosmicIconConstellation() {
  const [active, setActive] = useState<string | null>('observer');

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden px-6 pb-20 pt-28 md:px-16 md:pt-32 lg:px-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_1.15fr] lg:gap-14">
        <CosmicHeroCopyBlock className="relative z-10 max-w-[520px]" />

        <CosmicIconStage className="relative z-10 mx-auto aspect-square w-full max-w-[560px] md:max-w-none md:aspect-[5/4]">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            {HUB_LINKS.map((link, i) => (
              <line
                key={i}
                x1={link.x1}
                y1={link.y1}
                x2={link.x2}
                y2={link.y2}
                stroke="#CC5833"
                strokeWidth="0.8"
                strokeDasharray="3 7"
                opacity="0.28"
              />
            ))}
          </svg>

          {FIELD.map((mark) => {
            const isActive = active === mark.id;
            return (
              <button
                key={mark.id}
                type="button"
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay"
                style={{
                  left: mark.x,
                  top: mark.y,
                  opacity: isActive ? 1 : mark.opacity,
                  transform: `translate(-50%, -50%) scale(${isActive ? 1.08 : 1})`,
                }}
                aria-label={mark.title}
                aria-pressed={isActive}
                onMouseEnter={() => setActive(mark.id)}
                onFocus={() => setActive(mark.id)}
                onClick={() => setActive(mark.id)}
              >
                <IconNode id={mark.id} size={isActive ? mark.size + 8 : mark.size} animate={isActive || Boolean(mark.hub)} />
              </button>
            );
          })}

          {active ? (
            <CosmicAnnoBadge
              keyChar="A"
              label={FIELD.find((m) => m.id === active)?.title ?? ''}
              className="bottom-3 left-1/2 z-20 -translate-x-1/2 sm:bottom-6"
            />
          ) : null}
        </CosmicIconStage>
      </div>
    </section>
  );
}
