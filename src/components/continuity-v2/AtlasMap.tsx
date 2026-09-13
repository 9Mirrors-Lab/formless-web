import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { ServiceMark } from '@/components/continuity-v2/ServiceMark';
import { EASE, usePointerParallax } from '@/components/continuity-v2/motion';
import {
  ATLAS_EDGES,
  ATLAS_NODES,
  ATLAS_TERRITORIES,
  arcPath,
  atlasNodeById,
  atlasRelatedIds,
  bundledPath,
  polarPoint,
  type AtlasNode,
  type AtlasNodeId,
  type AtlasTerritoryId,
} from '@/data/continuityAtlas';
import logoWhiteSrc from '../../../design/eyes-closed-logo-variations/Final-logos/09a-white-ec-notagline.svg';

const VIEW_W = 1200;
const VIEW_H = 860;

type AtlasMapProps = {
  onJump: (section: string) => void;
};

function pct(value: number, total: number): string {
  return `${((value / total) * 100).toFixed(3)}%`;
}

export function AtlasMap({ onJump }: AtlasMapProps) {
  return (
    <>
      <AtlasDesktop onJump={onJump} />
      <AtlasGuided onJump={onJump} />
      <AtlasSemantics />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop atlas                                                       */
/* ------------------------------------------------------------------ */

function AtlasDesktop({ onJump }: AtlasMapProps) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<AtlasNodeId | null>(null);
  const [hovered, setHovered] = useState<AtlasNodeId | null>(null);
  const { ref, offset } = usePointerParallax<HTMLDivElement>();

  const active = hovered ?? selected;
  const related = useMemo(() => (active ? atlasRelatedIds(active) : null), [active]);
  const detail = selected ? atlasNodeById(selected) : null;

  const points = useMemo(
    () =>
      new Map(
        ATLAS_NODES.map((node) => [node.id, polarPoint(node.angle, node.radius)] as const),
      ),
    [],
  );

  return (
    <div className="relative hidden lg:block">
      <div
        ref={ref}
        className="relative mx-auto w-full max-w-[1160px]"
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
        onPointerLeave={() => setHovered(null)}
      >
        {/* Atmosphere and relationships */}
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <defs>
            <radialGradient id="atlas-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f2f0e9" stopOpacity="0.16" />
              <stop offset="55%" stopColor="#9fb5aa" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#080a09" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="atlas-lit" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f2f0e9" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#9fb5aa" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          <motion.g
            animate={{ x: offset.x * -14, y: offset.y * -10 }}
            transition={{ type: 'spring', stiffness: 40, damping: 18 }}
          >
            <circle cx={600} cy={430} r={300} fill="url(#atlas-core-glow)" />
            {[188, 262, 336, 392].map((r, index) => (
              <motion.circle
                key={r}
                cx={600}
                cy={430}
                r={r}
                fill="none"
                stroke="rgba(242,240,233,0.07)"
                strokeWidth={index === 3 ? 0.8 : 0.5}
                strokeDasharray={index === 3 ? '2 9' : undefined}
                initial={reduce ? false : { scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.1 + index * 0.09, ease: EASE }}
                style={{ transformOrigin: '600px 430px' }}
              />
            ))}
            {!reduce ? (
              <g style={{ transformOrigin: '600px 430px' }}>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 600 430"
                  to="360 600 430"
                  dur="210s"
                  repeatCount="indefinite"
                />
                {Array.from({ length: 64 }, (_, index) => {
                  const p = polarPoint((index * 360) / 64, 392);
                  return (
                    <circle
                      key={index}
                      cx={p.x}
                      cy={p.y}
                      r={index % 8 === 0 ? 1.6 : 0.8}
                      fill="rgba(242,240,233,0.3)"
                    />
                  );
                })}
              </g>
            ) : null}
          </motion.g>

          {/* Territory bands */}
          <motion.g
            animate={{ x: offset.x * -8, y: offset.y * -6 }}
            transition={{ type: 'spring', stiffness: 40, damping: 18 }}
          >
            {ATLAS_TERRITORIES.map((territory, index) => {
              const isMuted =
                active !== null && atlasNodeById(active).territory !== territory.id;
              return (
                <g key={territory.id}>
                  <motion.path
                    id={`atlas-arc-${territory.id}`}
                    d={arcPath(territory.startAngle, territory.endAngle, 412)}
                    fill="none"
                    stroke={territory.tint}
                    strokeWidth={1}
                    strokeLinecap="round"
                    initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: isMuted ? 0.12 : 0.34 }}
                    transition={{ duration: 1.2, delay: 0.5 + index * 0.12, ease: EASE }}
                  />
                  <text
                    className="font-sans"
                    fill={territory.tint}
                    fillOpacity={isMuted ? 0.24 : 0.72}
                    fontSize={13}
                    letterSpacing={6.2}
                    style={{ transition: 'fill-opacity 400ms ease' }}
                  >
                    <textPath href={`#atlas-arc-${territory.id}`} startOffset="50%" textAnchor="middle">
                      {territory.label.toUpperCase()}
                    </textPath>
                  </text>
                </g>
              );
            })}
          </motion.g>

          {/* Relationships */}
          <motion.g
            animate={{ x: offset.x * -4, y: offset.y * -3 }}
            transition={{ type: 'spring', stiffness: 40, damping: 18 }}
          >
            {ATLAS_EDGES.map((edge, index) => {
              const from = points.get(edge.from);
              const to = points.get(edge.to);
              if (!from || !to) return null;
              const d = bundledPath(from, to);
              const lit = active !== null && (edge.from === active || edge.to === active);
              const opacity = lit ? 0.85 : active !== null ? 0.04 : edge.spine ? 0.2 : 0.07;
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={lit ? 'url(#atlas-lit)' : 'rgba(242,240,233,0.75)'}
                    strokeWidth={lit ? 1.35 : 0.6}
                    initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity }}
                    transition={{
                      pathLength: { duration: 1.5, delay: 0.7 + index * 0.035, ease: EASE },
                      opacity: { duration: 0.45, ease: 'easeOut' },
                      strokeWidth: { duration: 0.3 },
                    }}
                  />
                  {lit && !reduce ? (
                    <circle r={2.6} fill="#f2f0e9" opacity={0.9}>
                      <animateMotion dur="2.6s" repeatCount="indefinite" path={d} />
                    </circle>
                  ) : null}
                </g>
              );
            })}
          </motion.g>
        </svg>

        {/* Center */}
        <motion.div
          className="pointer-events-none absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: '50%', top: pct(430, VIEW_H) }}
          animate={{ x: offset.x * -6, y: offset.y * -5 }}
          transition={{ type: 'spring', stiffness: 40, damping: 18 }}
        >
          <motion.div
            className="flex size-[152px] flex-col items-center justify-center rounded-full border border-cream/20 bg-[#080a09]/75 backdrop-blur-[2px]"
            initial={reduce ? false : { opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <img src={logoWhiteSrc} alt="" width={1929} height={865} className="h-7 w-auto" />
            <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.28em] [word-spacing:0.45em] text-cream/40">
              The center
            </p>
          </motion.div>
        </motion.div>

        {/* Nodes */}
        <motion.div
          className="absolute inset-0 z-10"
          animate={{ x: offset.x * -4, y: offset.y * -3 }}
          transition={{ type: 'spring', stiffness: 40, damping: 18 }}
        >
          {ATLAS_NODES.map((node, index) => {
            const point = points.get(node.id);
            if (!point) return null;
            const isRelated = related ? related.has(node.id) : true;
            const isActive = active === node.id;
            return (
              <motion.button
                key={node.id}
                type="button"
                className="group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-2 focus-visible:outline-none"
                style={{ left: pct(point.x, VIEW_W), top: pct(point.y, VIEW_H) }}
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isRelated ? 1 : 0.18,
                  scale: 1,
                  filter: isRelated ? 'blur(0px)' : 'blur(1.2px)',
                }}
                transition={{
                  opacity: { duration: 0.45, delay: reduce ? 0 : 0.75 + index * 0.045 },
                  scale: { duration: 0.6, delay: reduce ? 0 : 0.75 + index * 0.045, ease: EASE },
                }}
                onPointerEnter={() => setHovered(node.id)}
                onFocus={() => setHovered(node.id)}
                onBlur={() => setHovered(null)}
                onClick={() => setSelected((current) => (current === node.id ? null : node.id))}
                aria-pressed={selected === node.id}
                aria-label={`${node.label}. ${node.recognition}`}
              >
                <span
                  className={`flex size-[58px] items-center justify-center rounded-full border transition-all duration-300 ${
                    isActive
                      ? 'border-cream/70 bg-cream text-charcoal'
                      : 'border-cream/20 bg-[#080a09]/85 text-cream/75 group-hover:border-cream/45 group-focus-visible:border-cream group-focus-visible:ring-2 group-focus-visible:ring-cream/60 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#080a09]'
                  }`}
                >
                  <ServiceMark id={node.mark} className="size-[22px]" />
                </span>
                <span
                  className={`whitespace-nowrap font-sans text-[12.5px] tracking-[0.02em] transition-colors duration-300 ${
                    isActive ? 'text-cream' : 'text-cream/60 group-hover:text-cream/90'
                  }`}
                >
                  {node.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

      </div>

      {/* Contextual reading, beneath the composition it belongs to */}
      <div className="mx-auto min-h-[13rem] w-full max-w-[1160px]">
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            {detail ? (
              <motion.div
                key={detail.id}
                className="w-full max-w-[720px] border-t border-cream/15 px-1 py-7"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <AtlasReading node={detail} onJump={onJump} onClose={() => setSelected(null)} />
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                className="pb-2 font-sans text-[12.5px] tracking-[0.1em] text-cream/35"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Hover to trace a relationship. Select to read it.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AtlasReading({
  node,
  onJump,
  onClose,
}: {
  node: AtlasNode;
  onJump: (section: string) => void;
  onClose: () => void;
}) {
  const readings = ATLAS_EDGES.filter((edge) => edge.from === node.id || edge.to === node.id).slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <ServiceMark id={node.mark} className="size-5 text-cream/70" />
          <h3 className="font-sans text-[1.28rem] font-light tracking-[-0.02em] text-cream">
            {node.label}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 cursor-pointer px-2 font-sans text-[12px] tracking-[0.14em] text-cream/40 transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70"
        >
          CLOSE
        </button>
      </div>
      <p className="max-w-[58ch] font-sans text-[14.5px] leading-relaxed text-cream/75">
        {node.recognition}
      </p>
      {readings.length ? (
        <ul className="flex flex-col gap-1.5">
          {readings.map((edge) => (
            <li key={`${edge.from}-${edge.to}`} className="font-sans text-[12.5px] text-cream/45">
              <span className="mr-2 text-cream/25" aria-hidden>
                ·
              </span>
              {edge.reading}
            </li>
          ))}
        </ul>
      ) : null}
      {node.jumpTo ? (
        <button
          type="button"
          onClick={() => onJump(node.jumpTo as string)}
          className="group inline-flex min-h-11 w-fit cursor-pointer items-center gap-2.5 font-sans text-[13.5px] text-cream/80 transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/70"
        >
          <span className="border-b border-cream/25 pb-0.5 transition-colors group-hover:border-cream/70">
            Go deeper
          </span>
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </button>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tablet and mobile: the same map as a guided walk                    */
/* ------------------------------------------------------------------ */

function AtlasGuided({ onJump }: AtlasMapProps) {
  const reduce = useReducedMotion();
  const [territoryId, setTerritoryId] = useState<AtlasTerritoryId>('experience');
  const [openNode, setOpenNode] = useState<AtlasNodeId | null>(null);

  const territory = ATLAS_TERRITORIES.find((item) => item.id === territoryId) ?? ATLAS_TERRITORIES[0];
  const nodes = ATLAS_NODES.filter((node) => node.territory === territoryId);

  return (
    <div className="lg:hidden">
      <div className="relative mx-auto w-full max-w-[520px]">
        <svg viewBox="0 0 400 260" className="w-full" aria-hidden>
          <defs>
            <radialGradient id="atlas-mini-glow" cx="50%" cy="70%" r="60%">
              <stop offset="0%" stopColor="#f2f0e9" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#080a09" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={200} cy={230} r={180} fill="url(#atlas-mini-glow)" />
          {[96, 138, 176].map((r) => (
            <circle
              key={r}
              cx={200}
              cy={230}
              r={r}
              fill="none"
              stroke="rgba(242,240,233,0.08)"
              strokeWidth={0.6}
            />
          ))}
          {ATLAS_TERRITORIES.map((item, base) => {
            const isActive = item.id === territoryId;
            const count = ATLAS_NODES.filter((node) => node.territory === item.id).length;
            /** Each territory owns a wedge of the half-dome above Eyes Closed. */
            const wedgeStart = 166 - base * 38;
            const rays = Array.from({ length: count }, (_, index) => {
              const angle = wedgeStart - (count > 1 ? (index * 30) / (count - 1) : 15);
              const radians = (angle * Math.PI) / 180;
              const reach = 128 + (index % 3) * 20;
              return {
                inner: { x: 200 + Math.cos(radians) * 40, y: 230 - Math.sin(radians) * 40 },
                outer: { x: 200 + Math.cos(radians) * reach, y: 230 - Math.sin(radians) * reach },
              };
            });
            return (
              <g key={item.id}>
                {rays.map((ray, index) => (
                  <g key={index}>
                    <line
                      x1={ray.inner.x}
                      y1={ray.inner.y}
                      x2={ray.outer.x}
                      y2={ray.outer.y}
                      stroke={item.tint}
                      strokeOpacity={isActive ? 0.4 : 0.1}
                      strokeWidth={isActive ? 1.1 : 0.6}
                      style={{ transition: 'stroke-opacity 400ms ease' }}
                    />
                    <circle
                      cx={ray.outer.x}
                      cy={ray.outer.y}
                      r={isActive ? 3 : 1.6}
                      fill={item.tint}
                      fillOpacity={isActive ? 0.9 : 0.22}
                      style={{ transition: 'fill-opacity 400ms ease, r 400ms ease' }}
                    />
                  </g>
                ))}
              </g>
            );
          })}
          <circle cx={200} cy={230} r={34} fill="#080a09" stroke="rgba(242,240,233,0.3)" />
          <text
            x={200}
            y={228}
            textAnchor="middle"
            className="font-sans"
            fill="#f2f0e9"
            fillOpacity={0.75}
            fontSize={9.5}
            letterSpacing={2.2}
          >
            EYES
          </text>
          <text
            x={200}
            y={240}
            textAnchor="middle"
            className="font-sans"
            fill="#f2f0e9"
            fillOpacity={0.75}
            fontSize={9.5}
            letterSpacing={2.2}
          >
            CLOSED
          </text>
        </svg>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {ATLAS_TERRITORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTerritoryId(item.id);
              setOpenNode(null);
            }}
            className={`min-h-11 shrink-0 cursor-pointer border px-4 font-sans text-[12.5px] tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70 ${
              item.id === territoryId
                ? 'border-cream/60 bg-cream text-charcoal'
                : 'border-cream/18 text-cream/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <motion.div
        key={territoryId}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="mt-6"
      >
        <p className="font-sans text-[13.5px] text-cream/50">{territory.blurb}</p>
        <ul className="mt-5 flex flex-col">
          {nodes.map((node) => {
            const isOpen = openNode === node.id;
            const edges = ATLAS_EDGES.filter(
              (edge) => edge.from === node.id || edge.to === node.id,
            ).slice(0, 3);
            return (
              <li key={node.id} className="border-t border-cream/10 last:border-b">
                <button
                  type="button"
                  onClick={() => setOpenNode(isOpen ? null : node.id)}
                  className="flex min-h-[4.2rem] w-full cursor-pointer items-center gap-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70"
                  aria-expanded={isOpen}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-cream/20 text-cream/70">
                    <ServiceMark id={node.mark} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-sans text-[15px] text-cream">{node.label}</span>
                    <span className="mt-1 block font-sans text-[13px] leading-snug text-cream/50">
                      {node.recognition}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 text-cream/35 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 pl-15">
                        <ul className="flex flex-col gap-1.5">
                          {edges.map((edge) => (
                            <li
                              key={`${edge.from}-${edge.to}`}
                              className="font-sans text-[12.5px] text-cream/45"
                            >
                              {edge.reading}
                            </li>
                          ))}
                        </ul>
                        {node.jumpTo ? (
                          <button
                            type="button"
                            onClick={() => onJump(node.jumpTo as string)}
                            className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 border-b border-cream/25 font-sans text-[13px] text-cream/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/70"
                          >
                            Go deeper <span aria-hidden>→</span>
                          </button>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Equivalent structure for assistive technology                       */
/* ------------------------------------------------------------------ */

function AtlasSemantics() {
  return (
    <div className="sr-only">
      <h3>Continuity map of Eyes Closed</h3>
      <p>
        Eyes Closed sits at the center. Everything connected to it is grouped into four
        territories.
      </p>
      {ATLAS_TERRITORIES.map((territory) => (
        <section key={territory.id}>
          <h4>{territory.label}</h4>
          <p>{territory.blurb}</p>
          <ul>
            {ATLAS_NODES.filter((node) => node.territory === territory.id).map((node) => (
              <li key={node.id}>
                <strong>{node.label}.</strong> {node.recognition} {node.matters}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <h4>How these connect</h4>
      <ul>
        {ATLAS_EDGES.map((edge) => (
          <li key={`${edge.from}-${edge.to}`}>{edge.reading}</li>
        ))}
      </ul>
    </div>
  );
}
