import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { ServiceMark } from '@/components/continuity-v2/ServiceMark';
import { EASE } from '@/components/continuity-v2/motion';
import { Emphasis, Quiet, Reveal, TechnicalDetails } from '@/components/continuity-v2/primitives';
import {
  RUNNING_COST_NOTE,
  RUNNING_DEPENDENCIES,
  runningServiceByName,
} from '@/data/continuityAtlas';
import { CONTINUITY_RUNNING } from '@/data/continuityHome';

const W = 1200;
const H = 560;
/** Everything converges on the point where Eyes Closed stays up. */
const CONVERGE = { x: 600, y: 108 };

const TIERS = [
  { importance: 'critical' as const, y: 268, from: 150, to: 1050 },
  { importance: 'important' as const, y: 392, from: 260, to: 940 },
  { importance: 'supporting' as const, y: 500, from: 600, to: 600 },
];

type Placed = {
  dependency: (typeof RUNNING_DEPENDENCIES)[number];
  x: number;
  y: number;
  importance: 'critical' | 'important' | 'supporting';
};

function placeDependencies(): Placed[] {
  return TIERS.flatMap((tier) => {
    const items = RUNNING_DEPENDENCIES.filter(
      (dependency) =>
        (runningServiceByName(dependency.service)?.importance ?? 'supporting') === tier.importance,
    );
    const span = tier.to - tier.from;
    const step = items.length > 1 ? span / (items.length - 1) : 0;
    return items.map((dependency, index) => ({
      dependency,
      x: items.length > 1 ? tier.from + index * step : (tier.from + tier.to) / 2,
      y: tier.y,
      importance: tier.importance,
    }));
  });
}

function tetherPath(x: number, y: number): string {
  return `M ${x} ${y} C ${x} ${y - 110} ${CONVERGE.x} ${CONVERGE.y + 140} ${CONVERGE.x} ${CONVERGE.y}`;
}

export function RunningSystems() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const active = hovered ?? activeService;
  const detail = activeService
    ? RUNNING_DEPENDENCIES.find((item) => item.service === activeService)
    : null;
  const detailBilling = detail ? runningServiceByName(detail.service) : undefined;

  const placed = placeDependencies();

  return (
    <div>
      <Reveal className="max-w-[58ch]">
        <p className="font-sans text-[1.02rem] leading-[1.8] text-cream/65 md:text-[1.12rem]">
          A handful of services hold Eyes Closed up. This shows what each one is carrying, so you can
          see both what is being paid for and what would be affected if it stopped.
        </p>
      </Reveal>

      {/* Living services */}
      <div
        className="relative mt-14 hidden w-full lg:block"
        style={{ aspectRatio: `${W} / ${H}` }}
        onPointerLeave={() => setHovered(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="running-spine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f2f0e9" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#f2f0e9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f2f0e9" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          <motion.line
            x1={150}
            y1={CONVERGE.y - 44}
            x2={W - 150}
            y2={CONVERGE.y - 44}
            stroke="url(#running-spine)"
            strokeWidth={1.6}
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1.6, ease: EASE }}
          />
          <line
            x1={CONVERGE.x}
            y1={CONVERGE.y - 44}
            x2={CONVERGE.x}
            y2={CONVERGE.y}
            stroke="rgba(242,240,233,0.45)"
            strokeWidth={1}
          />
          <circle cx={CONVERGE.x} cy={CONVERGE.y} r={5} fill="#f2f0e9" fillOpacity={0.8} />

          {/* Tier baselines: the further down, the less the site depends on it */}
          {TIERS.map((tier) => (
            <line
              key={tier.importance}
              x1={110}
              y1={tier.y}
              x2={W - 110}
              y2={tier.y}
              stroke="rgba(242,240,233,0.06)"
              strokeWidth={0.6}
              strokeDasharray="2 10"
            />
          ))}

          {placed.map((item, index) => {
            const lit = active === item.dependency.service;
            const dimmed = active !== null && !lit;
            const d = tetherPath(item.x, item.y);
            return (
              <g key={item.dependency.service}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke="#f2f0e9"
                  strokeWidth={item.importance === 'critical' ? 1.4 : 0.8}
                  strokeOpacity={
                    lit ? 0.85 : dimmed ? 0.05 : item.importance === 'critical' ? 0.3 : 0.14
                  }
                  initial={reduce ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1.2, delay: 0.3 + index * 0.08, ease: EASE }}
                  style={{ transition: 'stroke-opacity 320ms ease' }}
                />
                {lit && !reduce ? (
                  <circle r={2.8} fill="#f2f0e9">
                    <animateMotion dur="2.4s" repeatCount="indefinite" path={d} />
                  </circle>
                ) : null}
              </g>
            );
          })}
        </svg>

        <div className="absolute left-0 right-0" style={{ top: `${((CONVERGE.y - 92) / H) * 100}%` }}>
          <p className="text-center font-sans text-[11px] uppercase tracking-[0.4em] text-cream/45">
            Eyes Closed, running
          </p>
        </div>

        {TIERS.map((tier) => (
          <p
            key={tier.importance}
            className="absolute left-0 font-sans text-[10px] uppercase tracking-[0.28em] text-cream/22"
            style={{ top: `${((tier.y - 12) / H) * 100}%` }}
          >
            {tier.importance}
          </p>
        ))}

        {placed.map((item, index) => {
          const dependency = item.dependency;
          const x = item.x;
          const y = item.y;
          const lit = active === dependency.service;
          const dimmed = active !== null && !lit;
          return (
            <motion.button
              key={dependency.service}
              type="button"
              className="group absolute flex w-[10.5rem] -translate-x-1/2 -translate-y-[25px] cursor-pointer flex-col items-center gap-2.5 focus-visible:outline-none"
              style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ opacity: dimmed ? 0.35 : 1 }}
              transition={{ duration: 0.5, delay: 0.35 + index * 0.07, ease: EASE }}
              onPointerEnter={() => setHovered(dependency.service)}
              onFocus={() => setHovered(dependency.service)}
              onBlur={() => setHovered(null)}
              onClick={() =>
                setActiveService((current) =>
                  current === dependency.service ? null : dependency.service,
                )
              }
              aria-pressed={activeService === dependency.service}
              aria-label={`${dependency.service}. ${dependency.sustains}.`}
            >
              <span
                className={`flex size-[50px] items-center justify-center rounded-full border transition-all duration-300 ${
                  lit
                    ? 'border-cream bg-cream text-charcoal'
                    : 'border-cream/20 bg-[#080a09] text-cream/70 group-hover:border-cream/45'
                } group-focus-visible:ring-2 group-focus-visible:ring-cream/60 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#080a09]`}
              >
                <ServiceMark id={dependency.mark} className="size-5" />
              </span>
              <span className="flex flex-col items-center gap-1 text-center">
                <span className="font-sans text-[13px] text-cream/85">{dependency.service}</span>
                <span className="font-sans text-[11.5px] leading-snug text-cream/40">
                  {dependency.sustains}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Tablet and mobile: the same three tiers, read as a list */}
      <ul className="mt-10 flex flex-col lg:hidden">
        {placed.map((item, index) => {
          const dependency = item.dependency;
          const billing = runningServiceByName(dependency.service);
          const isOpen = activeService === dependency.service;
          const startsTier = index === 0 || placed[index - 1].importance !== item.importance;
          return (
            <li key={dependency.service} className="border-t border-cream/10 last:border-b">
              {startsTier ? (
                <p className="pt-7 font-sans text-[10.5px] uppercase tracking-[0.28em] text-cream/30">
                  {item.importance === 'critical'
                    ? 'Critical · Eyes Closed depends on these'
                    : item.importance === 'important'
                      ? 'Important · the work slows without these'
                      : 'Supporting · useful, not load-bearing'}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() =>
                  setActiveService((current) =>
                    current === dependency.service ? null : dependency.service,
                  )
                }
                aria-expanded={isOpen}
                className="flex min-h-[4.4rem] w-full cursor-pointer items-center gap-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-cream/20 text-cream/70">
                  <ServiceMark id={dependency.mark} className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-[15px] text-cream">{dependency.service}</span>
                  <span className="mt-1 block font-sans text-[13px] text-cream/50">
                    {dependency.sustains}
                  </span>
                </span>
                {billing?.importance === 'critical' ? (
                  <span className="hidden shrink-0 sm:block">
                    <Emphasis>Critical</Emphasis>
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence mode="wait">
        {detail ? (
          <motion.div
            key={detail.service}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="mt-12 border-t border-cream/12 pt-9"
          >
            <div className="grid grid-cols-1 gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              <div>
                <div className="flex items-center gap-3">
                  <ServiceMark id={detail.mark} className="size-5 text-cream/60" />
                  <h3 className="font-sans text-[1.4rem] font-light tracking-[-0.02em] text-cream">
                    {detail.service}
                  </h3>
                  {detailBilling?.importance === 'critical' ? <Emphasis>Critical</Emphasis> : null}
                </div>
                <p className="mt-5 max-w-[48ch] font-sans text-[15px] leading-[1.75] text-cream/70">
                  {detail.sustains}.
                </p>
              </div>
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/35">
                  If it stopped
                </p>
                <p className="mt-3 max-w-[46ch] font-sans text-[15px] leading-[1.7] text-cream/65">
                  {detail.ifItStopped}
                </p>
                {detailBilling ? (
                  <div className="mt-7 flex flex-wrap gap-x-10 gap-y-3">
                    <span className="font-sans text-[13px] text-cream/50">
                      <span className="text-cream/30">Billing · </span>
                      {detailBilling.billing}
                    </span>
                    <span className="font-sans text-[13px] text-cream/50">
                      <span className="text-cream/30">Renewal · </span>
                      {detailBilling.renewal}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Reveal className="mt-14 border-t border-cream/10 pt-8">
        <div className="flex flex-wrap items-center gap-4">
          <Quiet>Operating cost</Quiet>
          <p className="max-w-[64ch] font-sans text-[14px] leading-relaxed text-cream/55">
            {RUNNING_COST_NOTE}
          </p>
        </div>

        <TechnicalDetails label="Full recurring-service table">
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">
                Recurring services, their purpose, billing cadence, renewal, and importance.
              </caption>
              <thead>
                <tr className="border-b border-cream/15">
                  {['Service', 'Purpose', 'Billing', 'Renewal', 'Importance'].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="py-3 pr-6 font-sans text-[10.5px] uppercase tracking-[0.2em] font-normal text-cream/35"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CONTINUITY_RUNNING.map((row) => (
                  <tr key={row.service} className="border-b border-cream/8">
                    <td className="py-4 pr-6 font-sans text-[13.5px] text-cream/85">{row.service}</td>
                    <td className="py-4 pr-6 font-sans text-[13px] text-cream/60">{row.purpose}</td>
                    <td className="py-4 pr-6 font-sans text-[13px] text-cream/60">{row.billing}</td>
                    <td className="py-4 pr-6 font-sans text-[13px] text-cream/60">{row.renewal}</td>
                    <td className="py-4 pr-6 font-sans text-[13px] text-cream/60 capitalize">
                      {row.importance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 max-w-[60ch] font-sans text-[13px] leading-relaxed text-cream/45">
            Card and bank details are deliberately absent. Only enough context to understand what is
            being paid for and why.
          </p>
        </TechnicalDetails>
      </Reveal>
    </div>
  );
}
