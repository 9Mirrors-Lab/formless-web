import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { ServiceMark } from '@/components/continuity-v2/ServiceMark';
import { EASE } from '@/components/continuity-v2/motion';
import { ActionLink, Reveal } from '@/components/continuity-v2/primitives';
import { FORMLESS_BRANCHES, type FormlessBranchId } from '@/data/continuityAtlas';
import { CONTINUITY_FORMLESS } from '@/data/continuityHome';

const W = 1100;
const H = 720;
const CENTER = { x: 550, y: 348 };

function point(angle: number, radius: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: CENTER.x + Math.cos(radians) * radius * 1.32,
    y: CENTER.y + Math.sin(radians) * radius,
  };
}

function branchPath(angle: number) {
  const start = point(angle, 128);
  const end = point(angle, 268);
  const mid = point(angle - 14, 200);
  return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${mid.x.toFixed(1)} ${mid.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
}

export function FormlessEcosystem() {
  const [openId, setOpenId] = useState<FormlessBranchId | null>(null);
  const [hovered, setHovered] = useState<FormlessBranchId | null>(null);
  const reduce = useReducedMotion();

  const active = hovered ?? openId;
  const open = FORMLESS_BRANCHES.find((branch) => branch.id === openId) ?? null;

  return (
    <div>
      <Reveal className="max-w-[56ch]">
        <p className="font-sans text-[1.02rem] leading-[1.8] text-cream/65 md:text-[1.12rem]">
          Everything below is the same work in a different form. The words, the voice, the cover, the
          listings, and the money all lead back to one book.
        </p>
      </Reveal>

      {/* The work at the centre */}
      <div
        className="relative mt-12 hidden w-full md:block"
        style={{ aspectRatio: `${W} / ${H}` }}
        onPointerLeave={() => setHovered(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <radialGradient id="formless-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#cc5833" stopOpacity="0.16" />
              <stop offset="70%" stopColor="#9fb5aa" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#080a09" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx={CENTER.x} cy={CENTER.y} rx={430} ry={330} fill="url(#formless-glow)" />

          {FORMLESS_BRANCHES.map((branch, index) => {
            const lit = active === branch.id;
            const dimmed = active !== null && !lit;
            return (
              <g key={branch.id}>
                <motion.path
                  d={branchPath(branch.angle)}
                  fill="none"
                  stroke="#f2f0e9"
                  strokeWidth={lit ? 1.6 : 0.9}
                  strokeOpacity={lit ? 0.8 : dimmed ? 0.08 : 0.25}
                  initial={reduce ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: '-12%' }}
                  transition={{ duration: 1.2, delay: 0.25 + index * 0.14, ease: EASE }}
                  style={{ transition: 'stroke-opacity 350ms ease, stroke-width 350ms ease' }}
                />
                {branch.items.map((_, itemIndex) => {
                  const p = point(branch.angle + (itemIndex - 1) * 7, 300 + itemIndex * 22);
                  return (
                    <motion.circle
                      key={`${branch.id}-${itemIndex}`}
                      cx={p.x}
                      cy={p.y}
                      r={2.2}
                      fill="#f2f0e9"
                      fillOpacity={lit ? 0.7 : dimmed ? 0.05 : 0.2}
                      initial={reduce ? false : { scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.8 + itemIndex * 0.08 }}
                      style={{ transformOrigin: `${p.x}px ${p.y}px`, transition: 'fill-opacity 350ms ease' }}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* The book itself */}
        <motion.div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: '50%', top: `${(CENTER.y / H) * 100}%` }}
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <img
            src="/book-covers/formless-ebook.jpg"
            alt={`${CONTINUITY_FORMLESS.title} — ${CONTINUITY_FORMLESS.subtitle}`}
            className="h-[268px] w-auto border border-cream/20 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]"
            loading="lazy"
          />
        </motion.div>

        {/* Branches */}
        {FORMLESS_BRANCHES.map((branch, index) => {
          const end = point(branch.angle, 292);
          const isActive = active === branch.id;
          const dimmed = active !== null && !isActive;
          const anchorLeft = end.x < CENTER.x;
          return (
            <motion.button
              key={branch.id}
              type="button"
              className="group absolute w-[13rem] cursor-pointer text-left focus-visible:outline-none"
              style={{
                left: `${(end.x / W) * 100}%`,
                top: `${(end.y / H) * 100}%`,
                transform: `translate(${anchorLeft ? '-92%' : '-8%'}, -50%)`,
              }}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ opacity: dimmed ? 0.35 : 1 }}
              transition={{ duration: 0.55, delay: 0.5 + index * 0.1, ease: EASE }}
              onPointerEnter={() => setHovered(branch.id)}
              onFocus={() => setHovered(branch.id)}
              onBlur={() => setHovered(null)}
              onClick={() => setOpenId((current) => (current === branch.id ? null : branch.id))}
              aria-expanded={openId === branch.id}
            >
              <span
                className={`block border-cream/25 pb-2 font-sans text-[1.05rem] transition-colors duration-300 ${
                  anchorLeft ? 'border-r pr-3 text-right' : 'border-l pl-3'
                } ${isActive ? 'text-cream' : 'text-cream/70 group-hover:text-cream'}`}
              >
                {branch.label}
              </span>
              <span
                className={`mt-2 block font-sans text-[12px] leading-snug text-cream/40 ${
                  anchorLeft ? 'pr-3 text-right' : 'pl-3'
                }`}
              >
                {branch.blurb}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile: the same ecosystem, unfolded */}
      <div className="mt-10 md:hidden">
        <img
          src="/book-covers/formless-ebook.jpg"
          alt={`${CONTINUITY_FORMLESS.title} — ${CONTINUITY_FORMLESS.subtitle}`}
          className="mx-auto h-[240px] w-auto border border-cream/20"
          loading="lazy"
        />
        <ul className="mt-9 flex flex-col">
          {FORMLESS_BRANCHES.map((branch) => (
            <li key={branch.id} className="border-t border-cream/10 last:border-b">
              <button
                type="button"
                onClick={() => setOpenId((current) => (current === branch.id ? null : branch.id))}
                aria-expanded={openId === branch.id}
                className="flex min-h-[4rem] w-full cursor-pointer items-center justify-between gap-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70"
              >
                <span>
                  <span className="block font-sans text-[15px] text-cream">{branch.label}</span>
                  <span className="mt-1 block font-sans text-[13px] text-cream/45">
                    {branch.blurb}
                  </span>
                </span>
                <span
                  className={`shrink-0 text-cream/35 transition-transform duration-300 ${openId === branch.id ? 'rotate-45' : ''}`}
                  aria-hidden
                >
                  +
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key={open.id}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="mt-10 border-t border-cream/12 pt-9"
          >
            <h3 className="font-sans text-[1.5rem] font-light tracking-[-0.03em] text-cream">
              {open.label}
            </h3>
            <ul className="mt-7 grid gap-x-12 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
              {open.items.map((item) => (
                <li key={item.label} className="flex gap-3.5">
                  {item.mark ? (
                    <ServiceMark id={item.mark} className="mt-0.5 size-[18px] shrink-0 text-cream/45" />
                  ) : null}
                  <div className="min-w-0">
                    <p className="font-sans text-[14.5px] text-cream">{item.label}</p>
                    <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-cream/55">
                      {item.detail}
                    </p>
                    {item.href ? (
                      <div className="mt-2">
                        <ActionLink href={item.href}>Open</ActionLink>
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
