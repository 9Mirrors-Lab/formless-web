import { motion, useReducedMotion } from 'framer-motion';

import {
  CONTINUITY_MAP_EDGES,
  CONTINUITY_MAP_GROUPS,
  CONTINUITY_MAP_NODES,
  type ContinuityMapGroupId,
  type ContinuityMapNode,
} from '@/data/continuityHome';

const GROUP_ORDER: ContinuityMapGroupId[] = [
  'presence',
  'work',
  'keep',
  'access',
  'stewards',
];

function nodePoint(node: ContinuityMapNode): { x: number; y: number } {
  return { x: node.x, y: node.y };
}

export function ContinuitySystemMap() {
  const reduce = useReducedMotion();
  const byId = new Map(CONTINUITY_MAP_NODES.map((node) => [node.id, node]));

  return (
    <div className="w-full">
      <p className="sr-only">
        System map of Eyes Closed. Each name jumps to that section of this page.
      </p>

      <div className="md:hidden">
        <ol className="flex flex-col gap-8">
          {GROUP_ORDER.map((groupId) => {
            const group = CONTINUITY_MAP_GROUPS[groupId];
            const nodes = CONTINUITY_MAP_NODES.filter((node) => node.group === groupId);
            return (
              <li key={groupId}>
                <p className="font-sans text-sm text-cream/50">{group.label}</p>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {nodes.map((node) => (
                    <li key={node.id}>
                      <a
                        href={node.href}
                        className="flex min-h-11 items-center border border-cream/15 bg-charcoal/40 px-4 py-3 font-sans text-sm text-cream transition-colors hover:border-cream/35 hover:bg-charcoal/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
                      >
                        {node.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="relative hidden min-h-[18rem] md:block lg:min-h-[22rem]">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {CONTINUITY_MAP_EDGES.map((edge) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to) return null;
            const a = nodePoint(from);
            const b = nodePoint(to);
            const delay =
              (CONTINUITY_MAP_GROUPS[from.group].order +
                CONTINUITY_MAP_GROUPS[to.group].order) *
              0.08;
            const d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
            return (
              <motion.path
                key={`${edge.from}-${edge.to}`}
                d={d}
                fill="none"
                stroke="rgba(247, 241, 230, 0.22)"
                strokeWidth="0.18"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: reduce ? 0 : 0.35 + delay, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}
        </svg>

        {CONTINUITY_MAP_NODES.map((node) => {
          const groupDelay = CONTINUITY_MAP_GROUPS[node.group].order * 0.12;
          const isHub = node.id === 'what-to-do';
          return (
            <motion.a
              key={node.id}
              href={node.href}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`absolute z-10 flex min-h-11 min-w-[7.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center border px-3 py-2 text-center font-sans text-[13px] leading-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80 ${
                isHub
                  ? 'border-cream/45 bg-cream text-charcoal hover:bg-white'
                  : 'border-cream/20 bg-[#080a09]/80 text-cream hover:border-cream/45 hover:bg-[#080a09]'
              }`}
              aria-label={`${node.label}. ${node.summary}`}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: reduce ? 0 : groupDelay,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {node.label}
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
