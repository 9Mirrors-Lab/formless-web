import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { ServiceMark } from '@/components/continuity-v2/ServiceMark';
import { EASE } from '@/components/continuity-v2/motion';
import { Reveal } from '@/components/continuity-v2/primitives';
import {
  CONTINUITY_PRINCIPLES,
  CONTINUITY_PRINCIPLES_CLOSE,
  HELP_SITUATIONS,
  helpPersonFor,
} from '@/data/continuityAtlas';

export function HelpSituations() {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <div>
      <Reveal className="max-w-[54ch]">
        <p className="font-sans text-[1.02rem] leading-[1.8] text-cream/65 md:text-[1.12rem]">
          Start with the kind of thing that happened. The right person is attached to the situation,
          not to a list of names.
        </p>
      </Reveal>

      <ul className="mt-14 flex flex-col">
        {HELP_SITUATIONS.map((situation, index) => {
          const isOpen = openId === situation.id;
          const person = helpPersonFor(situation);
          return (
            <li key={situation.id} className="border-t border-cream/12 last:border-b">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : situation.id)}
                aria-expanded={isOpen}
                className="group grid w-full cursor-pointer grid-cols-1 items-baseline gap-3 py-8 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70 md:grid-cols-[4rem_minmax(0,1fr)_10rem_2rem] md:gap-8"
              >
                <span className="font-mono text-[11.5px] tracking-[0.26em] text-cream/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-sans text-[1.35rem] font-light leading-[1.2] tracking-[-0.025em] text-cream sm:text-[1.75rem]">
                  {situation.situation}
                </span>
                <span className="font-sans text-[12px] uppercase tracking-[0.22em] text-cream/45">
                  {situation.role}
                </span>
                <span
                  className={`hidden text-right text-cream/30 transition-transform duration-300 md:block ${isOpen ? 'rotate-45' : ''}`}
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
                    transition={{ duration: 0.42, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-8 pb-10 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8">
                      <span aria-hidden />
                      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
                        <div>
                          <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/35">
                            Knows
                          </p>
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {situation.knows.map((item) => (
                              <li
                                key={item}
                                className="border border-cream/15 px-3 py-1.5 font-sans text-[12.5px] text-cream/65"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {person ? (
                          <div>
                            <p className="font-sans text-[1.15rem] text-cream">{person.name}</p>
                            <p className="mt-2 max-w-[42ch] font-sans text-[13.5px] leading-relaxed text-cream/55">
                              {person.role}
                            </p>
                            <dl className="mt-6 flex flex-col gap-3">
                              <div className="flex flex-wrap gap-x-3">
                                <dt className="font-sans text-[12.5px] text-cream/30">Email</dt>
                                <dd className="font-sans text-[13.5px] text-cream/75">
                                  {person.email}
                                </dd>
                              </div>
                              <div className="flex flex-wrap gap-x-3">
                                <dt className="font-sans text-[12.5px] text-cream/30">Phone</dt>
                                <dd className="font-sans text-[13.5px] text-cream/75">
                                  {person.phone}
                                </dd>
                              </div>
                              <div className="flex flex-col gap-1">
                                <dt className="font-sans text-[12.5px] text-cream/30">
                                  When to contact
                                </dt>
                                <dd className="max-w-[46ch] font-sans text-[13.5px] leading-relaxed text-cream/75">
                                  {person.whenToContact}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ContinuityPrinciplesSection() {
  return (
    <div>
      <Reveal className="max-w-[54ch]">
        <p className="font-sans text-[1.02rem] leading-[1.8] text-cream/65 md:text-[1.12rem]">
          Six things worth keeping steady. None of them are urgent today; they simply matter more
          than anything else you could change.
        </p>
      </Reveal>

      <ol className="mt-14 grid gap-px border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-3">
        {CONTINUITY_PRINCIPLES.map((principle, index) => (
          <li key={principle.id} className="bg-[#080a09]">
            <Reveal delay={index * 0.06}>
              <div className="flex h-full flex-col gap-4 p-7 transition-colors duration-500 hover:bg-cream/[0.03] lg:p-9">
                <div className="flex items-center justify-between">
                  <ServiceMark id={principle.mark} className="size-[19px] text-cream/50" />
                  <span className="font-mono text-[10.5px] tracking-[0.22em] text-cream/25">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-sans text-[1.12rem] font-light tracking-[-0.02em] text-cream">
                  {principle.title}
                </h3>
                <p className="font-sans text-[13.5px] leading-[1.7] text-cream/55">
                  {principle.body}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="mt-12">
        <p className="max-w-[52ch] font-sans text-[1.05rem] leading-[1.7] text-cream/75 md:text-[1.18rem]">
          {CONTINUITY_PRINCIPLES_CLOSE}
        </p>
      </Reveal>
    </div>
  );
}
