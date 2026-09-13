import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { ServiceMark } from '@/components/continuity-v2/ServiceMark';
import { EASE, usePointerParallax } from '@/components/continuity-v2/motion';
import { ActionLink, DetailList, Reveal, TechnicalDetails } from '@/components/continuity-v2/primitives';
import { atlasNodeById, type AtlasNodeId } from '@/data/continuityAtlas';
import { CONTINUITY_SUPABASE, CONTINUITY_WEBSITE } from '@/data/continuityHome';
import logoWhiteSrc from '../../../design/eyes-closed-logo-variations/Final-logos/09a-white-ec-notagline.svg';

const PARTS: readonly AtlasNodeId[] = ['domain', 'github', 'vercel', 'supabase', 'website'];

const PLAIN_LANGUAGE =
  'The website itself is stored in GitHub. Vercel publishes it. The domain points visitors toward it. Supabase supports the parts of the site that need stored information.';

/** Positions inside the 1200 × 520 composition. */
const SPOTS: Record<AtlasNodeId, { x: number; y: number } | undefined> = {
  domain: { x: 150, y: 270 },
  github: { x: 386, y: 118 },
  vercel: { x: 576, y: 236 },
  supabase: { x: 420, y: 424 },
  website: { x: 900, y: 262 },
  formless: undefined,
  social: undefined,
  email: undefined,
  assets: undefined,
  accounts: undefined,
  publishing: undefined,
  payments: undefined,
  help: undefined,
  ownership: undefined,
  contacts: undefined,
};

const FLOWS: readonly { id: string; from: AtlasNodeId; to: AtlasNodeId; d: string; label: string }[] = [
  {
    id: 'domain-website',
    from: 'domain',
    to: 'website',
    d: 'M 196 282 C 360 348 560 358 742 306',
    label: 'points visitors toward',
  },
  {
    id: 'github-vercel',
    from: 'github',
    to: 'vercel',
    d: 'M 424 138 C 494 166 520 190 548 216',
    label: 'hands the source to',
  },
  {
    id: 'vercel-website',
    from: 'vercel',
    to: 'website',
    d: 'M 620 240 C 672 244 700 250 742 256',
    label: 'publishes',
  },
  {
    id: 'supabase-website',
    from: 'supabase',
    to: 'website',
    d: 'M 462 418 C 596 404 676 356 748 318',
    label: 'supplies stored information to',
  },
];

export function WebsiteSystem() {
  const [openId, setOpenId] = useState<AtlasNodeId | null>(null);
  const [hovered, setHovered] = useState<AtlasNodeId | null>(null);
  const reduce = useReducedMotion();
  const { ref, offset } = usePointerParallax<HTMLDivElement>();

  const active = hovered ?? openId;

  return (
    <div>
      <Reveal className="max-w-[64ch]">
        <p className="font-sans text-[1.05rem] leading-[1.8] text-cream/70 md:text-[1.15rem]">
          {PLAIN_LANGUAGE}
        </p>
      </Reveal>

      {/* The system as one object */}
      <div
        ref={ref}
        className="relative mt-14 hidden w-full md:block"
        style={{ aspectRatio: '1200 / 520' }}
        onPointerLeave={() => setHovered(null)}
      >
        <svg viewBox="0 0 1200 520" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="site-flow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9fb5aa" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f2f0e9" stopOpacity="0.75" />
            </linearGradient>
            <radialGradient id="site-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9fb5aa" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#080a09" stopOpacity="0" />
            </radialGradient>
          </defs>

          <motion.ellipse
            cx={900}
            cy={262}
            rx={280}
            ry={200}
            fill="url(#site-glow)"
            animate={{ x: offset.x * -10, y: offset.y * -8 }}
            transition={{ type: 'spring', stiffness: 40, damping: 18 }}
          />

          {FLOWS.map((flow, index) => {
            const lit = active === flow.from || active === flow.to;
            return (
              <g key={flow.id}>
                <motion.path
                  d={flow.d}
                  fill="none"
                  stroke={lit ? 'url(#site-flow)' : 'rgba(242,240,233,0.18)'}
                  strokeWidth={lit ? 1.6 : 0.9}
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-12%' }}
                  transition={{ duration: 1.3, delay: 0.2 + index * 0.18, ease: EASE }}
                />
                {!reduce ? (
                  <circle r={2.4} fill="#f2f0e9" opacity={lit ? 0.9 : 0.35}>
                    <animateMotion dur={`${3 + index * 0.4}s`} repeatCount="indefinite" path={flow.d} />
                  </circle>
                ) : null}
              </g>
            );
          })}

          {/* The website, as a visual object */}
          <motion.g
            animate={{ x: offset.x * -6, y: offset.y * -5 }}
            transition={{ type: 'spring', stiffness: 40, damping: 18 }}
          >
            <rect
              x={748}
              y={150}
              width={310}
              height={224}
              rx={3}
              fill="#0b0e0c"
              stroke="rgba(242,240,233,0.28)"
              strokeWidth={1}
            />
            <line x1={748} y1={180} x2={1058} y2={180} stroke="rgba(242,240,233,0.18)" />
            <circle cx={762} cy={165} r={3} fill="rgba(242,240,233,0.28)" />
            <circle cx={774} cy={165} r={3} fill="rgba(242,240,233,0.18)" />
            <text
              x={800}
              y={169}
              className="font-sans"
              fill="#f2f0e9"
              fillOpacity={0.45}
              fontSize={10}
              letterSpacing={1.4}
            >
              eyesclosed.love
            </text>
            <image href={logoWhiteSrc} x={838} y={216} width={130} height={58} opacity={0.9} />
            <line x1={806} y1={300} x2={1000} y2={300} stroke="rgba(242,240,233,0.16)" />
            <line x1={846} y1={318} x2={960} y2={318} stroke="rgba(242,240,233,0.1)" />
            <line x1={866} y1={336} x2={940} y2={336} stroke="rgba(242,240,233,0.08)" />
          </motion.g>
        </svg>

        <motion.div
          className="absolute inset-0"
          animate={{ x: offset.x * -4, y: offset.y * -3 }}
          transition={{ type: 'spring', stiffness: 40, damping: 18 }}
        >
          {PARTS.filter((id) => id !== 'website').map((id, index) => {
            const spot = SPOTS[id];
            if (!spot) return null;
            const node = atlasNodeById(id);
            const isActive = active === id;
            return (
              <motion.button
                key={id}
                type="button"
                className="group absolute flex w-[10.5rem] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-2 focus-visible:outline-none"
                style={{ left: `${(spot.x / 1200) * 100}%`, top: `${(spot.y / 520) * 100}%` }}
                initial={reduce ? false : { opacity: 0, scale: 0.86 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 + index * 0.1, ease: EASE }}
                onPointerEnter={() => setHovered(id)}
                onFocus={() => setHovered(id)}
                onBlur={() => setHovered(null)}
                onClick={() => setOpenId((current) => (current === id ? null : id))}
                aria-expanded={openId === id}
                aria-label={`${node.label}. ${node.recognition}`}
              >
                <span
                  className={`flex size-[54px] items-center justify-center rounded-full border transition-all duration-300 ${
                    isActive
                      ? 'border-cream bg-cream text-charcoal'
                      : 'border-cream/22 bg-[#080a09] text-cream/70 group-hover:border-cream/50'
                  } group-focus-visible:ring-2 group-focus-visible:ring-cream/60 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#080a09]`}
                >
                  <ServiceMark id={node.mark} className="size-[21px]" />
                </span>
                <span className="font-sans text-[12.5px] text-cream/70 transition-colors group-hover:text-cream">
                  {node.label}
                </span>
              </motion.button>
            );
          })}

          <div
            className="absolute -translate-x-1/2 text-center"
            style={{ left: `${(903 / 1200) * 100}%`, top: `${(400 / 520) * 100}%` }}
          >
            <p className="font-sans text-[12.5px] tracking-[0.16em] text-cream/45">THE LIVE WEBSITE</p>
          </div>
        </motion.div>

        <AnimatePresence>
          {active ? (
            <motion.p
              key={active}
              className="absolute bottom-0 left-0 max-w-[30ch] font-sans text-[13px] leading-relaxed text-cream/55"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {atlasNodeById(active).recognition}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Mobile: the same system, read top to bottom */}
      <ol className="mt-12 flex flex-col md:hidden">
        {PARTS.map((id, index) => {
          const node = atlasNodeById(id);
          return (
            <li key={id} className="relative flex gap-4 pb-8 last:pb-0">
              {index < PARTS.length - 1 ? (
                <span className="absolute left-[21px] top-12 h-[calc(100%-3rem)] w-px bg-cream/12" aria-hidden />
              ) : null}
              <span className="relative z-10 flex size-[42px] shrink-0 items-center justify-center rounded-full border border-cream/22 bg-[#080a09] text-cream/70">
                <ServiceMark id={node.mark} className="size-[19px]" />
              </span>
              <div className="min-w-0 pt-1.5">
                <p className="font-sans text-[15px] text-cream">{node.label}</p>
                <p className="mt-1.5 font-sans text-[13.5px] leading-relaxed text-cream/55">
                  {node.recognition}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Actions */}
      <Reveal className="mt-12 flex flex-wrap gap-x-10 gap-y-3 border-t border-cream/10 pt-8">
        <ActionLink href={CONTINUITY_WEBSITE.productionUrl}>Open live website</ActionLink>
        <ActionLink href={CONTINUITY_WEBSITE.github.url}>Open website files</ActionLink>
        <ActionLink href="https://vercel.com/ryan-s-projects-311c1e92/formless-web">Open hosting</ActionLink>
        <ActionLink href={CONTINUITY_SUPABASE.dashboardUrl}>Open backend</ActionLink>
      </Reveal>

      {/* Level 2 and 3, one system at a time */}
      <div className="mt-14 flex flex-col">
        {PARTS.map((id) => {
          const node = atlasNodeById(id);
          const isOpen = openId === id;
          return (
            <div key={id} className="border-t border-cream/10 last:border-b">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : id)}
                aria-expanded={isOpen}
                className="flex min-h-[4.5rem] w-full cursor-pointer items-center gap-5 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70"
              >
                <ServiceMark id={node.mark} className="size-5 shrink-0 text-cream/55" />
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-[1.05rem] text-cream">{node.label}</span>
                  <span className="mt-1 block font-sans text-[13.5px] text-cream/50">
                    {node.recognition}
                  </span>
                </span>
                <span
                  className={`shrink-0 font-sans text-[13px] text-cream/35 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
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
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="pb-9 md:pl-10">
                      <p className="max-w-[56ch] font-sans text-[14.5px] leading-relaxed text-cream/65">
                        {node.matters}
                      </p>
                      <div className="mt-7">
                        <DetailList rows={node.practical} />
                      </div>
                      {node.manage ? (
                        <div className="mt-7">
                          <ActionLink href={node.manage.href}>{node.manage.label}</ActionLink>
                        </div>
                      ) : null}
                      <TechnicalDetails rows={node.technical} />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <Reveal className="mt-10 max-w-[60ch] border-l border-cream/20 pl-6">
        <p className="font-sans text-[14.5px] leading-[1.75] text-cream/60">
          {CONTINUITY_WEBSITE.github.ifSomeoneNeedsToUpdate}
        </p>
      </Reveal>
    </div>
  );
}
