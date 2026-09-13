import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { ServiceMark } from '@/components/continuity-v2/ServiceMark';
import { EASE } from '@/components/continuity-v2/motion';
import { Quiet, Reveal } from '@/components/continuity-v2/primitives';
import { SOCIAL_MARKS, SOCIAL_PURPOSES, type SocialPurpose } from '@/data/continuityAtlas';
import { CONTINUITY_SOCIAL } from '@/data/continuityHome';

const PURPOSES: readonly SocialPurpose[] = ['Publishing', 'Community', 'Promotion', 'Communication'];

const W = 1000;
const H = 440;
const SOURCE = { x: 96, y: 220 };
const ROW = 62;
const GROUP_GAP = 36;
const BRACE_X = 626;

/** Lay the channels out in purpose clusters so the fan has groups, not one flat column. */
function layout(entries: readonly { purpose: SocialPurpose }[]): number[] {
  let y = 46;
  return entries.map((entry, index) => {
    if (index > 0) {
      y += entries[index - 1].purpose === entry.purpose ? ROW : ROW + GROUP_GAP;
    }
    return y;
  });
}

export function SocialEcosystem() {
  const [openName, setOpenName] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const active = hovered ?? openName;
  const channel = CONTINUITY_SOCIAL.find((item) => item.name === openName) ?? null;

  const ordered = PURPOSES.flatMap((purpose) =>
    CONTINUITY_SOCIAL.filter((item) => SOCIAL_PURPOSES[item.name] === purpose).map((item) => ({
      channel: item,
      purpose,
    })),
  );
  const rows = layout(ordered);

  return (
    <div>
      <Reveal className="max-w-[56ch]">
        <p className="font-sans text-[1.02rem] leading-[1.8] text-cream/65 md:text-[1.12rem]">
          Each channel carries the work outward for a different reason. Where a channel has not been
          confirmed, it is marked as unverified rather than invented.
        </p>
      </Reveal>

      {/* The audience fan */}
      <div className="relative mt-14 hidden w-full md:block" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          {PURPOSES.map((purpose) => {
            const indices = ordered
              .map((entry, index) => (entry.purpose === purpose ? index : -1))
              .filter((index) => index >= 0);
            if (!indices.length) return null;
            const top = rows[indices[0]];
            const bottom = rows[indices[indices.length - 1]];
            return (
              <path
                key={purpose}
                d={`M ${BRACE_X + 6} ${top - 14} Q ${BRACE_X} ${top - 14} ${BRACE_X} ${top - 4} L ${BRACE_X} ${bottom + 4} Q ${BRACE_X} ${bottom + 14} ${BRACE_X + 6} ${bottom + 14}`}
                fill="none"
                stroke="rgba(242,240,233,0.14)"
                strokeWidth={0.9}
              />
            );
          })}

          {ordered.map((entry, index) => {
            const y = rows[index];
            const lit = active === entry.channel.name;
            const dimmed = active !== null && !lit;
            const d = `M ${SOURCE.x} ${SOURCE.y} C ${SOURCE.x + 210} ${SOURCE.y} ${430} ${y} ${BRACE_X} ${y}`;
            return (
              <motion.path
                key={entry.channel.name}
                d={d}
                fill="none"
                stroke="#f2f0e9"
                strokeWidth={lit ? 1.5 : 0.8}
                strokeOpacity={lit ? 0.75 : dimmed ? 0.06 : 0.2}
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 1.2, delay: 0.15 + index * 0.09, ease: EASE }}
                style={{ transition: 'stroke-opacity 320ms ease, stroke-width 320ms ease' }}
              />
            );
          })}
          <circle cx={SOURCE.x} cy={SOURCE.y} r={44} fill="#080a09" stroke="rgba(242,240,233,0.25)" />
          <text
            x={SOURCE.x}
            y={SOURCE.y - 3}
            textAnchor="middle"
            className="font-sans"
            fill="#f2f0e9"
            fillOpacity={0.7}
            fontSize={10}
            letterSpacing={2}
          >
            EYES
          </text>
          <text
            x={SOURCE.x}
            y={SOURCE.y + 11}
            textAnchor="middle"
            className="font-sans"
            fill="#f2f0e9"
            fillOpacity={0.7}
            fontSize={10}
            letterSpacing={2}
          >
            CLOSED
          </text>
        </svg>

        {PURPOSES.map((purpose) => {
          const first = ordered.findIndex((entry) => entry.purpose === purpose);
          if (first < 0) return null;
          return (
            <p
              key={purpose}
              className="absolute font-sans text-[10px] uppercase tracking-[0.26em] text-cream/30"
              style={{
                left: `${((BRACE_X + 22) / W) * 100}%`,
                top: `${((rows[first] - 40) / H) * 100}%`,
              }}
            >
              {purpose}
            </p>
          );
        })}

        {ordered.map((entry, index) => {
          const y = rows[index];
          const lit = active === entry.channel.name;
          const dimmed = active !== null && !lit;
          return (
            <motion.button
              key={entry.channel.name}
              type="button"
              className="group absolute flex w-[22rem] -translate-y-1/2 cursor-pointer items-center gap-3.5 text-left focus-visible:outline-none"
              style={{ left: `${((BRACE_X + 22) / W) * 100}%`, top: `${(y / H) * 100}%` }}
              initial={reduce ? false : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              animate={{ opacity: dimmed ? 0.4 : 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.07, ease: EASE }}
              onPointerEnter={() => setHovered(entry.channel.name)}
              onPointerLeave={() => setHovered(null)}
              onFocus={() => setHovered(entry.channel.name)}
              onBlur={() => setHovered(null)}
              onClick={() =>
                setOpenName((current) => (current === entry.channel.name ? null : entry.channel.name))
              }
              aria-expanded={openName === entry.channel.name}
              aria-label={`${entry.channel.name}. ${entry.channel.username}`}
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                  lit ? 'border-cream bg-cream text-charcoal' : 'border-cream/20 text-cream/65'
                }`}
              >
                <ServiceMark id={SOCIAL_MARKS[entry.channel.name] ?? 'social'} className="size-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block font-sans text-[14.5px] text-cream/85">
                  {entry.channel.name}
                </span>
                <span className="block truncate font-sans text-[12px] text-cream/40">
                  {entry.channel.username}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="mt-10 md:hidden">
        {PURPOSES.map((purpose) => {
          const items = CONTINUITY_SOCIAL.filter((item) => SOCIAL_PURPOSES[item.name] === purpose);
          if (!items.length) return null;
          return (
            <div key={purpose} className="mb-8">
              <p className="font-sans text-[10.5px] uppercase tracking-[0.26em] text-cream/35">
                {purpose}
              </p>
              <ul className="mt-3 flex flex-col">
                {items.map((item) => (
                  <li key={item.name} className="border-t border-cream/10 last:border-b">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenName((current) => (current === item.name ? null : item.name))
                      }
                      aria-expanded={openName === item.name}
                      aria-label={`${item.name}. ${item.username}`}
                      className="flex min-h-[3.9rem] w-full cursor-pointer items-center gap-4 py-3.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-cream/20 text-cream/65">
                        <ServiceMark id={SOCIAL_MARKS[item.name] ?? 'social'} className="size-[18px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-sans text-[14.5px] text-cream">{item.name}</span>
                        <span className="block truncate font-sans text-[12.5px] text-cream/45">
                          {item.username}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {channel ? (
          <motion.div
            key={channel.name}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="mt-10 border-t border-cream/12 pt-9"
          >
            <div className="flex flex-wrap items-center gap-4">
              <h3 className="font-sans text-[1.4rem] font-light tracking-[-0.02em] text-cream">
                {channel.name}
              </h3>
              <Quiet>{SOCIAL_PURPOSES[channel.name]}</Quiet>
            </div>
            <p className="mt-5 max-w-[56ch] font-sans text-[15px] leading-[1.75] text-cream/65">
              {channel.purpose}
            </p>
            <dl className="mt-8 grid gap-x-12 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'Username', value: channel.username },
                { label: 'Account owner', value: channel.owner },
                { label: 'Email used', value: channel.emailUsed },
                { label: 'Credential location', value: channel.credentialLocation },
                { label: '2FA', value: channel.twoFactor },
              ].map((row) => (
                <div key={row.label}>
                  <dt className="font-sans text-[10.5px] uppercase tracking-[0.2em] text-cream/35">
                    {row.label}
                  </dt>
                  <dd className="mt-1.5 font-sans text-[13.5px] leading-relaxed text-cream/75">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            {channel.url ? (
              <a
                href={channel.url}
                target="_blank"
                rel="noreferrer"
                className="group mt-7 inline-flex min-h-11 items-center gap-2.5 font-sans text-[14px] text-cream/80 transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/70"
              >
                <span className="border-b border-cream/25 pb-0.5 transition-colors group-hover:border-cream/70">
                  Open channel
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </a>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
