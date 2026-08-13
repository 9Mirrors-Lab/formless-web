import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import {
  AnalysisWorkspaceTabs,
  type AnalysisWorkspaceTab,
} from '@/components/audio-review/AnalysisWorkspaceTabs';
import { AnalysisMetricGlyph } from '@/components/audio-review/AnalysisMetricVisuals';
import {
  AUDIO_ANALYSIS_ACTIONS,
  AUDIO_ANALYSIS_METRICS,
  AUDIO_ANALYSIS_VERDICT,
  type AnalysisMetric,
  type AnalysisMetricId,
  type AnalysisVerdict,
  type MicroAction,
} from '@/data/audioAnalysisReport';

function verdictLabel(verdict: AnalysisVerdict): string {
  switch (verdict) {
    case 'pass':
      return 'Hold';
    case 'action':
      return 'Polish';
    case 'guide':
      return 'Guide';
    default: {
      const _exhaustive: never = verdict;
      return _exhaustive;
    }
  }
}

function verdictTone(verdict: AnalysisVerdict): string {
  switch (verdict) {
    case 'pass':
      return 'text-[#9fb5aa] border-[#9fb5aa]/35 bg-[#9fb5aa]/10';
    case 'action':
      return 'text-[#e07852] border-[#e07852]/40 bg-[#e07852]/10';
    case 'guide':
      return 'text-cream/70 border-cream/20 bg-cream/[0.04]';
    default: {
      const _exhaustive: never = verdict;
      return _exhaustive;
    }
  }
}

function MicroActionChip({ action }: { action: MicroAction }) {
  return (
    <li className="min-w-[14rem] flex-1 border-l border-cream/15 pl-4">
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
          action.tone === 'action'
            ? 'text-[#e07852]/90'
            : action.tone === 'pass'
              ? 'text-[#9fb5aa]/90'
              : 'text-cream/45'
        }`}
      >
        {verdictLabel(action.tone)}
      </p>
      <p className="mt-2 font-serif text-xl italic leading-snug text-cream">{action.title}</p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-cream/50">{action.detail}</p>
    </li>
  );
}

function MetricEssay({ metric }: { metric: AnalysisMetric }) {
  return (
    <article className="max-w-[42rem]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[11px] tabular-nums tracking-[0.22em] text-cream/35">
          {metric.index}
        </span>
        <AnalysisMetricGlyph id={metric.id} className="h-5 w-5 text-cream/55" />
        <h3 className="font-serif text-3xl italic text-cream md:text-4xl">
          {metric.name}{' '}
          <span className="font-sans text-base not-italic tracking-normal text-cream/40">
            {metric.shortName}
          </span>
        </h3>
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${verdictTone(metric.verdict)}`}
        >
          {verdictLabel(metric.verdict)}
        </span>
      </div>

      <p className="mt-5 font-serif text-2xl italic leading-snug text-cream/85 md:text-[1.65rem]">
        {metric.headline}
      </p>

      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-cream/55 md:text-base">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/35">
            {metric.question}
          </p>
          <p>{metric.answer}</p>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#9fb5aa]/70">
            Why this matters
          </p>
          <p className="text-cream/70">{metric.why}</p>
        </div>
        {metric.notes?.length ? (
          <ul className="space-y-2 border-l border-cream/15 pl-4">
            {metric.notes.map((note) => (
              <li key={note} className="text-cream/50">
                {note}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

type AudioAnalysisDashboardProps = {
  onSelectWorkspaceTab: (tab: AnalysisWorkspaceTab) => void;
};

export function AudioAnalysisDashboard({
  onSelectWorkspaceTab,
}: AudioAnalysisDashboardProps) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<AnalysisMetricId>('lufs');
  const essayRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Partial<Record<AnalysisMetricId, HTMLElement | null>>>({});

  useEffect(() => {
    const root = essayRef.current;
    const nodes = AUDIO_ANALYSIS_METRICS.map((metric) => sectionRefs.current[metric.id]).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    if (!root || !nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.getAttribute('data-metric-id') as AnalysisMetricId | null;
        if (id) setActiveId(id);
      },
      { root, rootMargin: '-12% 0px -55% 0px', threshold: [0.15, 0.35, 0.6] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (id: AnalysisMetricId) => {
    setActiveId(id);
    const node = sectionRefs.current[id];
    const root = essayRef.current;
    if (!node || !root) return;
    const top = root.scrollTop + (node.getBoundingClientRect().top - root.getBoundingClientRect().top) - 12;
    root.scrollTo({
      top,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="shrink-0 border-b border-cream/10 px-6 py-8 md:px-10">
        <AnalysisWorkspaceTabs
          value="analysis"
          onValueChange={onSelectWorkspaceTab}
        />
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/40">
          {AUDIO_ANALYSIS_VERDICT.eyebrow}
        </p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl italic leading-[1.12] text-cream md:text-5xl lg:text-[3.35rem]">
          {AUDIO_ANALYSIS_VERDICT.title}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/60">
          {AUDIO_ANALYSIS_VERDICT.lede}
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#9fb5aa]/80">
          {AUDIO_ANALYSIS_VERDICT.note}
        </p>

        <ul className="mt-8 flex gap-3 overflow-x-auto pb-1">
          {AUDIO_ANALYSIS_ACTIONS.map((action) => (
            <MicroActionChip key={action.id} action={action} />
          ))}
        </ul>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <nav
          aria-label="Analysis metrics"
          className="shrink-0 border-b border-cream/10 lg:w-[13.5rem] lg:border-b-0 lg:border-r lg:border-cream/10"
        >
          <div className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-y-auto lg:px-3 lg:py-5">
            {AUDIO_ANALYSIS_METRICS.map((metric) => {
              const active = metric.id === activeId;
              return (
                <button
                  key={metric.id}
                  type="button"
                  onClick={() => jumpTo(metric.id)}
                  className={`flex min-h-11 min-w-[7.5rem] items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:min-w-0 ${
                    active
                      ? 'bg-cream/[0.07] text-cream'
                      : 'text-cream/40 hover:bg-cream/[0.03] hover:text-cream/70'
                  }`}
                  aria-current={active ? 'true' : undefined}
                >
                  <span className="font-mono text-[10px] tabular-nums tracking-wider text-cream/30">
                    {metric.index}
                  </span>
                  <AnalysisMetricGlyph
                    id={metric.id}
                    className={`h-4 w-4 shrink-0 ${active ? 'text-[#9fb5aa]' : 'text-cream/35'}`}
                  />
                  <span className="truncate font-serif text-[15px] italic">{metric.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div
          ref={essayRef}
          className="min-h-0 flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-16 md:gap-24">
            {AUDIO_ANALYSIS_METRICS.map((metric, index) => (
              <section
                key={metric.id}
                id={`metric-${metric.id}`}
                data-metric-id={metric.id}
                ref={(node) => {
                  sectionRefs.current[metric.id] = node;
                }}
                className="scroll-mt-6"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={metric.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.45,
                      delay: reduceMotion ? 0 : Math.min(index * 0.02, 0.12),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <MetricEssay metric={metric} />
                  </motion.div>
                </AnimatePresence>
                {index < AUDIO_ANALYSIS_METRICS.length - 1 ? (
                  <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-cream/15 to-transparent md:mt-24" />
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
