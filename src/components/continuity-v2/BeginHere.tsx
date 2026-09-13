import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

import { ServiceMark } from '@/components/continuity-v2/ServiceMark';
import { EASE } from '@/components/continuity-v2/motion';
import { Reveal } from '@/components/continuity-v2/primitives';
import {
  BEGIN_HERE_CLOSE,
  BEGIN_HERE_INTRO,
  BEGIN_HERE_STEPS,
  polarPoint,
  type BeginStep,
} from '@/data/continuityAtlas';

type BeginHereProps = {
  onJump: (section: string) => void;
};

export function BeginHere({ onJump }: BeginHereProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 70%', 'end 60%'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.4 });

  return (
    <div>
      <Reveal className="max-w-[58ch]">
        <p className="font-sans text-[1.05rem] leading-[1.8] text-cream/65 md:text-[1.16rem]">
          {BEGIN_HERE_INTRO}
        </p>
      </Reveal>

      <div ref={trackRef} className="relative mt-16 md:mt-24">
        {/* The prepared path */}
        <div className="pointer-events-none absolute left-[13px] top-2 hidden h-[calc(100%-4rem)] w-px md:block lg:left-[19px]">
          <div className="absolute inset-0 bg-cream/10" />
          <motion.div
            className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-cream/70 via-cream/40 to-cream/10"
            style={{ scaleY: reduce ? 1 : progress, height: '100%' }}
          />
        </div>

        <ol className="flex flex-col gap-24 md:gap-32">
          {BEGIN_HERE_STEPS.map((step, index) => (
            <li key={step.index} className="relative md:pl-16 lg:pl-24">
              <span
                className="absolute left-0 top-1 hidden size-[27px] items-center justify-center rounded-full border border-cream/25 bg-[#080a09] md:flex lg:size-[39px]"
                aria-hidden
              >
                <span className="size-1.5 rounded-full bg-cream/70" />
              </span>
              <StepBlock step={step} index={index} onJump={onJump} />
            </li>
          ))}
        </ol>
      </div>

      <Reveal className="mt-20 border-t border-cream/10 pt-8">
        <p className="font-sans text-[1rem] leading-relaxed text-cream/55">{BEGIN_HERE_CLOSE}</p>
      </Reveal>
    </div>
  );
}

function StepBlock({
  step,
  index,
  onJump,
}: {
  step: BeginStep;
  index: number;
  onJump: (section: string) => void;
}) {
  const flip = index % 2 === 1;
  return (
    <Reveal>
      <div
        className={`grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 ${
          flip ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <div className="min-w-0">
          <p className="font-mono text-[12px] tracking-[0.3em] text-cream/35">{step.index}</p>
          <h3 className="mt-4 font-sans text-[1.7rem] font-light leading-[1.14] tracking-[-0.03em] text-cream sm:text-[2.1rem]">
            {step.title}
          </h3>
          <p className="mt-5 max-w-[46ch] font-sans text-[15.5px] leading-[1.75] text-cream/60">
            {step.body}
          </p>

          {step.anchors ? (
            <ul className="mt-7 flex flex-col gap-3">
              {step.anchors.map((anchor) => (
                <li key={anchor.label} className="flex items-start gap-3">
                  <ServiceMark id={anchor.mark} className="mt-0.5 size-[18px] shrink-0 text-cream/55" />
                  <span className="font-sans text-[14px] text-cream/80">
                    <strong className="font-medium text-cream">{anchor.label}</strong>
                    <span className="text-cream/50"> — {anchor.blurb}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          <button
            type="button"
            onClick={() => onJump(step.action.section)}
            className="group mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2.5 font-sans text-[14px] text-cream transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/70"
          >
            <span className="border-b border-cream/35 pb-1 transition-colors group-hover:border-cream">
              {step.action.label}
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>
              →
            </span>
          </button>
        </div>

        <div className="min-w-0">
          <StepVisual step={step} />
        </div>
      </div>
    </Reveal>
  );
}

function StepVisual({ step }: { step: BeginStep }) {
  switch (step.visual) {
    case 'map':
      return <MiniAtlas />;
    case 'pillars':
      return <Pillars step={step} />;
    case 'chain':
      return <AccessChain chips={step.chips ?? []} />;
    case 'shelf':
      return <CollectionShelf chips={step.chips ?? []} />;
    case 'quadrant':
      return <ResponsibilityField chips={step.chips ?? []} />;
    default: {
      const exhaustive: never = step.visual;
      return exhaustive;
    }
  }
}

function MiniAtlas() {
  const reduce = useReducedMotion();
  const dots = Array.from({ length: 15 }, (_, index) => {
    const angle = (index * 360) / 15 + 12;
    const radius = index % 3 === 0 ? 96 : index % 3 === 1 ? 128 : 150;
    const point = polarPoint(angle, radius);
    return { x: point.x - 600 + 180, y: point.y - 430 + 170, index };
  });

  return (
    <svg viewBox="0 0 360 340" className="w-full" role="img" aria-label="A small constellation of the connected services around Eyes Closed.">
      <defs>
        <radialGradient id="begin-map-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f2f0e9" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#080a09" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={180} cy={170} r={160} fill="url(#begin-map-glow)" />
      {dots.map((dot) => (
        <motion.line
          key={`line-${dot.index}`}
          x1={180}
          y1={170}
          x2={dot.x}
          y2={dot.y}
          stroke="rgba(242,240,233,0.16)"
          strokeWidth={0.6}
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: dot.index * 0.05, ease: EASE }}
        />
      ))}
      {dots.map((dot) => (
        <motion.circle
          key={`dot-${dot.index}`}
          cx={dot.x}
          cy={dot.y}
          r={dot.index % 3 === 0 ? 4.4 : 2.8}
          fill="#f2f0e9"
          fillOpacity={dot.index % 3 === 0 ? 0.8 : 0.4}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 + dot.index * 0.05, ease: EASE }}
        />
      ))}
      <circle cx={180} cy={170} r={30} fill="#080a09" stroke="rgba(242,240,233,0.35)" />
      <circle cx={180} cy={170} r={5} fill="#f2f0e9" fillOpacity={0.85} />
    </svg>
  );
}

function Pillars({ step }: { step: BeginStep }) {
  const reduce = useReducedMotion();
  const anchors = step.anchors ?? [];
  const heights = [176, 208, 150];

  return (
    <div className="relative">
      <svg viewBox="0 0 360 260" className="w-full" role="img" aria-label="Three pillars: domain, website, and database, standing on one baseline.">
        {anchors.map((anchor, index) => {
          const x = 54 + index * 108;
          const height = heights[index] ?? 170;
          return (
            <g key={anchor.label}>
              <motion.rect
                x={x - 26}
                y={214 - height}
                width={52}
                height={height}
                fill="none"
                stroke="rgba(242,240,233,0.2)"
                strokeWidth={0.8}
                initial={reduce ? false : { scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: index * 0.14, ease: EASE }}
                style={{ transformOrigin: `${x}px 214px` }}
              />
              <motion.rect
                x={x - 26}
                y={214 - height}
                width={52}
                height={height}
                fill="#f2f0e9"
                fillOpacity={0.05}
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.14 }}
              />
              <text
                x={x}
                y={230}
                textAnchor="middle"
                className="font-sans"
                fill="#f2f0e9"
                fillOpacity={0.7}
                fontSize={11.5}
                letterSpacing={1.4}
              >
                {anchor.label}
              </text>
            </g>
          );
        })}
        <line x1={16} y1={214} x2={344} y2={214} stroke="rgba(242,240,233,0.3)" strokeWidth={0.8} />
        <text x={16} y={250} className="font-sans" fill="#f2f0e9" fillOpacity={0.3} fontSize={10} letterSpacing={2.6}>
          ESSENTIAL TO STAYING ONLINE
        </text>
      </svg>
      <div className="pointer-events-none absolute inset-0">
        {anchors.map((anchor, index) => (
          <span
            key={anchor.label}
            className="absolute flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-cream/25 bg-[#080a09] text-cream/70"
            style={{
              left: `${((54 + index * 108) / 360) * 100}%`,
              top: `${((214 - (heights[index] ?? 170) - 22) / 260) * 100}%`,
            }}
          >
            <ServiceMark id={anchor.mark} className="size-[17px]" />
          </span>
        ))}
      </div>
    </div>
  );
}

function AccessChain({ chips }: { chips: readonly string[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative">
      <svg viewBox="0 0 360 210" className="w-full" role="img" aria-label="A path from service to account to vault to two-factor to recovery to owner.">
        <motion.path
          id="begin-access-path"
          d="M 28 172 C 96 172 84 60 150 60 C 216 60 208 168 278 168 C 312 168 328 140 336 112"
          fill="none"
          stroke="rgba(242,240,233,0.24)"
          strokeWidth={1}
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE }}
        />
        {!reduce ? (
          <circle r={3} fill="#f2f0e9" opacity={0.85}>
            <animateMotion
              dur="4.2s"
              repeatCount="indefinite"
              path="M 28 172 C 96 172 84 60 150 60 C 216 60 208 168 278 168 C 312 168 328 140 336 112"
            />
          </circle>
        ) : null}
        <g>
          {[
            [28, 172],
            [88, 112],
            [150, 60],
            [212, 112],
            [278, 168],
            [336, 112],
          ].map(([cx, cy], index) => (
            <motion.circle
              key={chips[index] ?? index}
              cx={cx}
              cy={cy}
              r={index === 2 ? 7 : 4.6}
              fill="#080a09"
              stroke="rgba(242,240,233,0.55)"
              strokeWidth={1}
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 + index * 0.14, ease: EASE }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
          ))}
        </g>
      </svg>
      <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-2">
        {chips.map((chip, index) => (
          <li key={chip} className="flex items-center gap-2">
            <span className="font-sans text-[11.5px] uppercase tracking-[0.2em] text-cream/45">
              {chip}
            </span>
            {index < chips.length - 1 ? (
              <span className="text-cream/20" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CollectionShelf({ chips }: { chips: readonly string[] }) {
  const spans = [
    'col-span-3 row-span-2',
    'col-span-3 row-span-1',
    'col-span-2 row-span-1',
    'col-span-2 row-span-1',
    'col-span-2 row-span-1',
    'col-span-6 row-span-1',
  ];
  return (
    <div className="grid grid-cols-6 gap-2.5" role="img" aria-label={`Six asset collections: ${chips.join(', ')}.`}>
      {chips.map((chip, index) => (
        <Reveal
          key={chip}
          delay={index * 0.07}
          className={`${spans[index] ?? 'col-span-2'} min-h-[68px]`}
        >
          <div className="flex h-full flex-col justify-end border border-cream/12 bg-cream/[0.035] p-3.5 transition-colors duration-300 hover:border-cream/30 hover:bg-cream/[0.06]">
            <span className="font-mono text-[10px] tracking-[0.2em] text-cream/25">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="mt-1 font-sans text-[13.5px] text-cream/85">{chip}</span>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function ResponsibilityField({ chips }: { chips: readonly string[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative" role="img" aria-label={`Four areas of responsibility: ${chips.join(', ')}.`}>
      <svg viewBox="0 0 360 260" className="w-full">
        <motion.line
          x1={180}
          y1={16}
          x2={180}
          y2={244}
          stroke="rgba(242,240,233,0.16)"
          strokeWidth={0.8}
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
        />
        <motion.line
          x1={20}
          y1={130}
          x2={340}
          y2={130}
          stroke="rgba(242,240,233,0.16)"
          strokeWidth={0.8}
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
        />
        <circle cx={180} cy={130} r={26} fill="none" stroke="rgba(242,240,233,0.22)" />
        <circle cx={180} cy={130} r={4} fill="#f2f0e9" fillOpacity={0.7} />
        {[
          [96, 74],
          [264, 74],
          [96, 188],
          [264, 188],
        ].map(([cx, cy], index) => (
          <g key={chips[index] ?? index}>
            <motion.circle
              cx={cx}
              cy={cy}
              r={38}
              fill="#f2f0e9"
              fillOpacity={0.04}
              stroke="rgba(242,240,233,0.2)"
              strokeWidth={0.8}
              initial={reduce ? false : { scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: EASE }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              className="font-sans"
              fill="#f2f0e9"
              fillOpacity={0.78}
              fontSize={12}
              letterSpacing={1.2}
            >
              {chips[index]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
