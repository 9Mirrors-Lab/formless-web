import {
  explainMetric,
  explainPhase,
  verdictLabel,
  type AcxVerdict,
  type MetricExplain,
} from '@/data/audioMasterPhaseExplain';
import type {
  MasterPhaseId,
  MasterPhaseMetric,
} from '@/data/audioMasterPhaseRuns';

function verdictTone(verdict: AcxVerdict): string {
  switch (verdict) {
    case 'pass':
      return 'border-[#9fb5aa]/40 bg-[#9fb5aa]/10 text-[#9fb5aa]';
    case 'fail':
      return 'border-[#e07852]/40 bg-[#e07852]/10 text-[#e07852]';
    case 'needs-mastering':
      return 'border-amber-200/35 bg-amber-200/10 text-amber-100/90';
    case 'watch':
    case 'info':
      return 'border-cream/15 bg-cream/[0.03] text-cream/55';
    default: {
      const _exhaustive: never = verdict;
      return _exhaustive;
    }
  }
}

function cleanCopy(text: string): string {
  return text.replace(/[\u2013\u2014]/g, '-');
}

export function PhaseMeaning({ phaseId }: { phaseId: MasterPhaseId }) {
  const copy = explainPhase(phaseId);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section>
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
          What this means
        </p>
        <p className="mt-1 max-w-[42ch] text-[13px] leading-relaxed text-cream/75">
          {copy.means}
        </p>
      </section>
      <section>
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
          Why you care
        </p>
        <p className="mt-1 max-w-[46ch] text-[13px] leading-relaxed text-cream/75">
          {copy.whyCare}
        </p>
      </section>
    </div>
  );
}

function ExplainedMetricCard({
  explained,
  value,
  compact,
}: {
  explained: MetricExplain;
  value: string;
  compact?: boolean;
}) {
  return (
    <article className="min-w-0 rounded-md border border-cream/[0.08] bg-[#101412] px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-snug text-cream">
            {explained.title}
          </p>
          <p className="mt-1 text-[13px] tabular-nums text-cream/85">
            {cleanCopy(value)}
          </p>
          {explained.window ? (
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-cream/30">
              {explained.window}
            </p>
          ) : null}
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${verdictTone(explained.verdict)}`}
        >
          {verdictLabel(explained.verdict)}
        </span>
      </div>
      {compact ? (
        <p className="mt-2 text-[12px] leading-relaxed text-cream/60">
          {explained.result}
        </p>
      ) : (
        <dl className="mt-3 space-y-2.5">
          <div>
            <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
              What this means
            </dt>
            <dd className="mt-0.5 text-[12px] leading-relaxed text-cream/70">
              {explained.means}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
              Why you care
            </dt>
            <dd className="mt-0.5 text-[12px] leading-relaxed text-cream/70">
              {explained.whyCare}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
              This result
            </dt>
            <dd className="mt-0.5 text-[12px] leading-relaxed text-cream/80">
              {explained.result}
            </dd>
          </div>
        </dl>
      )}
    </article>
  );
}

export function ExplainedMetricList({
  metrics,
  phaseId,
  compact = false,
}: {
  metrics: readonly MasterPhaseMetric[];
  phaseId: MasterPhaseId;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? 'grid grid-cols-1 gap-2 sm:grid-cols-2'
          : 'grid grid-cols-1 gap-3 lg:grid-cols-2'
      }
    >
      {metrics.map((metric) => (
        <ExplainedMetricCard
          key={`${phaseId}-${metric.label}`}
          explained={explainMetric(metric.label, metric.value, phaseId)}
          value={metric.value}
          compact={compact}
        />
      ))}
    </div>
  );
}
