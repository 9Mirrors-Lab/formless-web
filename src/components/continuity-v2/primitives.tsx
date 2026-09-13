import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { EASE } from '@/components/continuity-v2/motion';

import type { AtlasDetailRow } from '@/data/continuityAtlas';

/** Fades a block up as it enters, and does nothing when motion is reduced. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  y = 18,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  id,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  id?: string;
}) {
  return (
    <Reveal className="max-w-[62ch]">
      <p className="font-sans text-[11px] uppercase tracking-[0.42em] text-cream/40">{eyebrow}</p>
      <h2
        id={id}
        className="mt-5 font-sans text-[2.1rem] font-light leading-[1.06] tracking-[-0.035em] text-cream sm:text-[2.75rem] lg:text-[3.4rem]"
      >
        {title}
      </h2>
      {lede ? (
        <p className="mt-6 font-sans text-[1.02rem] leading-[1.75] text-cream/60 md:text-[1.12rem]">
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}

/** Level 3. Never open by default, never part of the composition at rest. */
export function TechnicalDetails({
  rows,
  label = 'Technical details',
  children,
}: {
  rows?: readonly AtlasDetailRow[];
  label?: string;
  children?: ReactNode;
}) {
  if (!rows?.length && !children) return null;
  return (
    <details className="group mt-6 border-t border-cream/10 pt-4">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-sans text-[13px] tracking-[0.06em] text-cream/45 transition-colors marker:content-none hover:text-cream/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70 [&::-webkit-details-marker]:hidden">
        <span
          className="inline-block transition-transform duration-300 group-open:rotate-90"
          aria-hidden
        >
          →
        </span>
        {label}
      </summary>
      <div className="pb-2">
        {rows?.length ? (
          <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {rows.map((row) => (
              <div key={`${row.label}-${row.value}`} className="min-w-0">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/35">
                  {row.label}
                </dt>
                <dd className="mt-1 font-sans text-[13.5px] leading-relaxed break-words text-cream/70">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        {children}
      </div>
    </details>
  );
}

export function DetailList({ rows }: { rows: readonly AtlasDetailRow[] }) {
  return (
    <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={`${row.label}-${row.value}`} className="min-w-0">
          <dt className="font-sans text-[11px] uppercase tracking-[0.2em] text-cream/35">
            {row.label}
          </dt>
          <dd className="mt-1.5 font-sans text-[15px] leading-relaxed break-words text-cream/85">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ActionLink({
  href,
  children,
  external = true,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="group inline-flex min-h-11 items-center gap-2.5 font-sans text-[14px] text-cream/80 transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/70"
    >
      <span className="border-b border-cream/25 pb-0.5 transition-colors group-hover:border-cream/70">
        {children}
      </span>
      <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
        →
      </span>
    </a>
  );
}

/** Restrained semantic emphasis. No decorative status dots. */
export function Emphasis({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-clay/45 px-2.5 py-1 font-sans text-[10.5px] uppercase tracking-[0.24em] text-clay">
      {children}
    </span>
  );
}

export function Quiet({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-cream/18 px-2.5 py-1 font-sans text-[10.5px] uppercase tracking-[0.24em] text-cream/45">
      {children}
    </span>
  );
}
