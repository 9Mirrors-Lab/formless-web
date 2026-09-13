import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { ServiceMark } from '@/components/continuity-v2/ServiceMark';
import { EASE } from '@/components/continuity-v2/motion';
import { Emphasis, Quiet, Reveal } from '@/components/continuity-v2/primitives';
import {
  ACCESS_GROUPS,
  ACCESS_MARKS,
  ACCESS_PRINCIPLE,
  accessEntries,
  type AccessGroupId,
  type ServiceMarkId,
} from '@/data/continuityAtlas';
import type { ContinuityCredential } from '@/data/continuityHome';

const OWNER_BY_GROUP: Record<AccessGroupId, string> = {
  ownership: 'Sonika Cottman, with Ryan Riley as technical steward',
  running: 'Ryan Riley (technical steward)',
  publishing: 'Sonika Cottman (rights holder)',
  audience: 'Sonika Cottman, sending handled with Ryan',
  tools: 'Ryan Riley',
};

const CHAIN_LABELS = ['Service', 'Account', 'Credential location', '2FA', 'Recovery', 'Owner'] as const;

/** Station positions across the 1000 × 132 chain, alternating slightly for rhythm. */
const STATIONS = [
  { x: 42, y: 86 },
  { x: 232, y: 52 },
  { x: 424, y: 86 },
  { x: 614, y: 52 },
  { x: 806, y: 86 },
  { x: 962, y: 52 },
] as const;

const CHAIN_PATH =
  'M 42 86 C 128 86 148 52 232 52 C 316 52 340 86 424 86 C 508 86 530 52 614 52 C 698 52 722 86 806 86 C 878 86 906 52 962 52';

export function AccessLandscape() {
  const [groupId, setGroupId] = useState<AccessGroupId>('ownership');
  const [openService, setOpenService] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const group = ACCESS_GROUPS.find((item) => item.id === groupId) ?? ACCESS_GROUPS[0];
  const entries = accessEntries(group);

  return (
    <div>
      <Reveal className="max-w-[56ch]">
        <p className="font-sans text-[1.15rem] leading-[1.7] text-cream/85 md:text-[1.3rem]">
          {ACCESS_PRINCIPLE}
        </p>
        <p className="mt-5 font-sans text-[14.5px] leading-relaxed text-cream/50">
          No password, API key, token, recovery code, or secret value is stored in this page. Each
          chain below tells you which account controls a service and where its key is kept.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-16">
        {/* Territories of access */}
        <div className="lg:border-r lg:border-cream/10 lg:pr-8">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
            {ACCESS_GROUPS.map((item) => {
              const isActive = item.id === groupId;
              return (
                <li key={item.id} className="shrink-0 lg:border-b lg:border-cream/8 lg:last:border-0">
                  <button
                    type="button"
                    onClick={() => {
                      setGroupId(item.id);
                      setOpenService(null);
                    }}
                    aria-pressed={isActive}
                    aria-label={`${item.label}. ${item.blurb}`}
                    className={`min-h-11 w-full cursor-pointer border px-4 py-3 text-left font-sans transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70 lg:border-0 lg:px-0 lg:py-5 ${
                      isActive
                        ? 'border-cream/50 text-cream lg:border-0'
                        : 'border-cream/15 text-cream/50 hover:text-cream/80'
                    }`}
                  >
                    <span className="block whitespace-nowrap text-[14.5px] lg:whitespace-normal">
                      {item.label}
                    </span>
                    <span className="mt-1 hidden text-[12.5px] leading-snug text-cream/40 lg:block">
                      {item.blurb}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Chains */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={groupId}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <h3 className="font-sans text-[1.6rem] font-light tracking-[-0.03em] text-cream sm:text-[2rem]">
                {group.label}
              </h3>
              <p className="mt-3 font-sans text-[14.5px] text-cream/50">{group.blurb}</p>

              <ul className="mt-10 flex flex-col gap-12">
                {entries.map((entry, index) => (
                  <li key={`${group.id}-${entry.service}`}>
                    <AccessChain
                      entry={entry}
                      owner={OWNER_BY_GROUP[group.id]}
                      mark={ACCESS_MARKS[entry.service] ?? 'accounts'}
                      delay={index * 0.12}
                      isOpen={openService === entry.service}
                      onToggle={() =>
                        setOpenService((current) =>
                          current === entry.service ? null : entry.service,
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AccessChain({
  entry,
  owner,
  mark,
  delay,
  isOpen,
  onToggle,
}: {
  entry: ContinuityCredential;
  owner: string;
  mark: ServiceMarkId;
  delay: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  const values = [
    entry.service,
    entry.accountEmail,
    entry.credentialLocation,
    entry.twoFactor,
    entry.recoveryMethod,
    owner,
  ];

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={`${entry.service}. Key kept in ${entry.credentialLocation.replace(/\.$/, '')}. ${
          entry.importance === 'critical'
            ? 'Critical'
            : entry.importance === 'important'
              ? 'Important'
              : 'Supporting'
        }`}
        className="group flex w-full cursor-pointer items-center gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/70"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors group-hover:border-cream/45">
          <ServiceMark id={mark} className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-sans text-[1.05rem] text-cream">{entry.service}</span>
          <span className="mt-1 block truncate font-sans text-[13px] text-cream/45">
            Key kept in {entry.credentialLocation}
          </span>
        </span>
        <span className="hidden shrink-0 sm:block">
          {entry.importance === 'critical' ? (
            <Emphasis>Critical</Emphasis>
          ) : (
            <Quiet>{entry.importance === 'important' ? 'Important' : 'Supporting'}</Quiet>
          )}
        </span>
      </button>

      {/* The chain itself */}
      <div className="mt-12 hidden sm:block">
        <div className="relative w-full" style={{ aspectRatio: '1000 / 132' }}>
          <svg viewBox="0 0 1000 132" className="absolute inset-0 h-full w-full" aria-hidden>
            <motion.path
              d={CHAIN_PATH}
              fill="none"
              stroke="rgba(242,240,233,0.2)"
              strokeWidth={1}
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay, ease: EASE }}
            />
            {STATIONS.map((station, index) => (
              <motion.circle
                key={station.x}
                cx={station.x}
                cy={station.y}
                r={index === 2 ? 6.5 : 4.5}
                fill={index === 2 ? '#f2f0e9' : '#080a09'}
                stroke="rgba(242,240,233,0.6)"
                strokeWidth={1}
                initial={reduce ? false : { scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: delay + 0.25 + index * 0.1, ease: EASE }}
                style={{ transformOrigin: `${station.x}px ${station.y}px` }}
              />
            ))}
          </svg>

          {STATIONS.map((station, index) => {
            const below = station.y > 70;
            return (
              <div
                key={CHAIN_LABELS[index]}
                className="absolute w-[15%] min-w-[6.5rem]"
                style={{
                  left: `${(station.x / 1000) * 100}%`,
                  top: below ? `${(station.y / 132) * 100 + 10}%` : undefined,
                  bottom: below ? undefined : `${((132 - station.y) / 132) * 100 + 12}%`,
                  transform:
                    index === 0
                      ? 'translateX(-8%)'
                      : index === STATIONS.length - 1
                        ? 'translateX(-82%)'
                        : 'translateX(-45%)',
                }}
              >
                <p className="font-sans text-[9.5px] uppercase tracking-[0.2em] text-cream/30">
                  {CHAIN_LABELS[index]}
                </p>
                <p className="mt-1 font-sans text-[11.5px] leading-tight text-cream/65">
                  {shorten(values[index])}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <dl className="mt-6 grid gap-x-10 gap-y-4 border-t border-cream/10 pt-6 sm:grid-cols-2">
              {CHAIN_LABELS.map((label, index) => (
                <div key={label}>
                  <dt className="font-sans text-[10.5px] uppercase tracking-[0.2em] text-cream/35">
                    {label}
                  </dt>
                  <dd className="mt-1.5 font-sans text-[14px] leading-relaxed text-cream/75">
                    {values[index]}
                  </dd>
                </div>
              ))}
              {entry.notes ? (
                <div className="sm:col-span-2">
                  <dt className="font-sans text-[10.5px] uppercase tracking-[0.2em] text-cream/35">
                    Note
                  </dt>
                  <dd className="mt-1.5 font-sans text-[14px] leading-relaxed text-cream/75">
                    {entry.notes}
                  </dd>
                </div>
              ) : null}
            </dl>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function shorten(value: string): string {
  if (value.length <= 34) return value;
  return `${value.slice(0, 32).trimEnd()}…`;
}
