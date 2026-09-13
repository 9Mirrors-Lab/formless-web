import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { ServiceMark } from '@/components/continuity-v2/ServiceMark';
import { EASE } from '@/components/continuity-v2/motion';
import { ActionLink, TechnicalDetails } from '@/components/continuity-v2/primitives';
import { SIGNAL_STAGES, type SignalStage } from '@/data/continuityAtlas';

const DESKTOP = {
  width: 1200,
  height: 380,
  points: [
    [96, 272],
    [300, 118],
    [504, 272],
    [708, 118],
    [912, 272],
    [1104, 150],
  ] as const,
  path:
    'M 96 272 C 198 272 198 118 300 118 C 402 118 402 272 504 272 C 606 272 606 118 708 118 C 810 118 810 272 912 272 C 1000 272 1020 172 1104 150',
};

const MOBILE = {
  width: 320,
  height: 820,
  points: [
    [72, 56],
    [248, 208],
    [72, 360],
    [248, 512],
    [72, 664],
    [248, 790],
  ] as const,
  path:
    'M 72 56 C 72 132 248 132 248 208 C 248 284 72 284 72 360 C 72 436 248 436 248 512 C 248 588 72 588 72 664 C 72 730 248 724 248 790',
};

export function SignalJourney() {
  const [activeId, setActiveId] = useState<string>(SIGNAL_STAGES[0].id);
  const active = SIGNAL_STAGES.find((stage) => stage.id === activeId) ?? SIGNAL_STAGES[0];
  const activeIndex = SIGNAL_STAGES.findIndex((stage) => stage.id === activeId);

  return (
    <div>
      <JourneyCanvas
        layout={DESKTOP}
        className="hidden md:block"
        activeIndex={activeIndex}
        activeId={activeId}
        onSelect={setActiveId}
      />
      <JourneyCanvas
        layout={MOBILE}
        className="md:hidden"
        activeIndex={activeIndex}
        activeId={activeId}
        onSelect={setActiveId}
        stacked
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-10 border-t border-cream/12 pt-8 md:mt-4"
        >
          <StageReading stage={active} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function JourneyCanvas({
  layout,
  className,
  activeId,
  activeIndex,
  onSelect,
  stacked = false,
}: {
  layout: typeof DESKTOP | typeof MOBILE;
  className: string;
  activeId: string;
  activeIndex: number;
  onSelect: (id: string) => void;
  stacked?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={`relative ${className}`}>
      <div
        className="relative w-full"
        style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
      >
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <defs>
            <linearGradient
              id={`journey-grad-${stacked ? 'v' : 'h'}`}
              x1="0"
              y1="0"
              x2={stacked ? '0' : '1'}
              y2={stacked ? '1' : '0'}
            >
              <stop offset="0%" stopColor="#f2f0e9" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#9fb5aa" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#cc5833" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          <path d={layout.path} fill="none" stroke="rgba(242,240,233,0.12)" strokeWidth={1.2} />
          <motion.path
            d={layout.path}
            fill="none"
            stroke={`url(#journey-grad-${stacked ? 'v' : 'h'})`}
            strokeWidth={1.8}
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 2.2, ease: EASE }}
          />
          {!reduce ? (
            <circle r={3.4} fill="#f2f0e9" opacity={0.75}>
              <animateMotion dur="7s" repeatCount="indefinite" path={layout.path} />
            </circle>
          ) : null}
        </svg>

        {SIGNAL_STAGES.map((stage, index) => {
          const [x, y] = layout.points[index];
          const isActive = stage.id === activeId;
          const isPassed = index <= activeIndex;
          // Crest markers carry their label above so it never lands on the curve.
          const crest = !stacked && y < layout.height / 2;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelect(stage.id)}
              aria-pressed={isActive}
              className="group absolute flex size-[52px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center focus-visible:outline-none"
              style={{
                left: `${(x / layout.width) * 100}%`,
                top: `${(y / layout.height) * 100}%`,
              }}
            >
              <span
                className={`flex size-[52px] items-center justify-center rounded-full border transition-all duration-400 ${
                  isActive
                    ? 'border-cream bg-cream text-charcoal'
                    : isPassed
                      ? 'border-cream/35 bg-[#080a09] text-cream/75'
                      : 'border-cream/15 bg-[#080a09] text-cream/40'
                } group-hover:border-cream/60 group-focus-visible:ring-2 group-focus-visible:ring-cream/60 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#080a09]`}
              >
                <ServiceMark id={stage.mark} className="size-[21px]" />
              </span>
              <span
                className={
                  stacked
                    ? `absolute top-1/2 flex w-[8.5rem] -translate-y-1/2 flex-col gap-1 ${
                        x < layout.width / 2 ? 'left-full ml-3 items-start text-left' : 'right-full mr-3 items-end text-right'
                      }`
                    : `absolute left-1/2 flex w-[11.5rem] -translate-x-1/2 flex-col items-center gap-1 ${
                        crest ? 'bottom-full mb-3' : 'top-full mt-3'
                      }`
                }
              >
                <span className="font-mono text-[10px] tracking-[0.24em] text-cream/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={`font-sans text-[12.5px] leading-snug transition-colors duration-300 ${
                    stacked ? '' : 'text-center'
                  } ${isActive ? 'text-cream' : 'text-cream/55 group-hover:text-cream/85'}`}
                >
                  {stage.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StageReading({ stage }: { stage: SignalStage }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <div>
        <div className="flex items-center gap-3">
          <ServiceMark id={stage.mark} className="size-5 text-cream/60" />
          <h3 className="font-sans text-[1.35rem] font-light tracking-[-0.02em] text-cream">
            {stage.label}
          </h3>
        </div>
        <p className="mt-5 max-w-[52ch] font-sans text-[15.5px] leading-[1.75] text-cream/70">
          {stage.whatThisIs}
        </p>
      </div>
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/35">
          Why it matters
        </p>
        <p className="mt-3 max-w-[48ch] font-sans text-[15px] leading-[1.7] text-cream/65">
          {stage.whyItMatters}
        </p>
        {stage.manage ? (
          <div className="mt-6">
            <ActionLink href={stage.manage.href}>{stage.manage.label}</ActionLink>
          </div>
        ) : null}
        <TechnicalDetails rows={stage.technical} />
      </div>
    </div>
  );
}
