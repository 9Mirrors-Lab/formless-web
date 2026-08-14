import { useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  MASTER_PHASE_CATALOG,
  masterPhaseStatusLabel,
  masterTrackRunFor,
  masterTrackStatusLabel,
  phaseRecordFor,
  type MasterPhaseId,
  type MasterPhaseStatus,
  type MasterTrackRunStatus,
} from '@/data/audioMasterPhaseRuns';

function phaseTickClass(status: MasterPhaseStatus): string {
  switch (status) {
    case 'complete':
      return 'border-[#9fb5aa] bg-[#9fb5aa]';
    case 'running':
      return 'border-amber-200/80 bg-amber-200/80';
    case 'blocked':
      return 'border-[#e07852] bg-[#e07852]';
    case 'pending':
      return 'border-cream/25 bg-transparent';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function phaseTone(status: MasterPhaseStatus): string {
  switch (status) {
    case 'complete':
      return 'border-[#9fb5aa]/45 bg-[#9fb5aa]/10 text-[#9fb5aa]';
    case 'running':
      return 'border-amber-200/35 bg-amber-200/10 text-amber-100/90';
    case 'blocked':
      return 'border-[#e07852]/40 bg-[#e07852]/10 text-[#e07852]';
    case 'pending':
      return 'border-cream/12 bg-transparent text-cream/40';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function runTone(status: MasterTrackRunStatus): string {
  switch (status) {
    case 'ready-for-final-qc':
      return 'text-[#9fb5aa]';
    case 'in-progress':
      return 'text-amber-100/85';
    case 'idle':
      return 'text-cream/40';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

type StudioPhaseResultsProps = {
  chapterId: number;
  density?: 'default' | 'hud';
};

export function StudioPhaseResults({
  chapterId,
  density = 'default',
}: StudioPhaseResultsProps) {
  const run = masterTrackRunFor(chapterId);
  const hud = density === 'hud';
  const [openId, setOpenId] = useState<MasterPhaseId | null>(() => {
    if (density === 'hud') return null;
    const firstDone = run.phases.find((phase) => phase.status === 'complete');
    return firstDone?.id ?? null;
  });
  const openPhase = openId == null ? null : phaseRecordFor(run, openId);

  const phaseTicks = MASTER_PHASE_CATALOG.map((phase) => {
    const record = phaseRecordFor(run, phase.id);
    const selected = openId === phase.id;
    const label = `${phase.name}: ${masterPhaseStatusLabel(record.status)}`;
    return (
      <Tooltip key={phase.id}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() =>
              setOpenId((current) => (current === phase.id ? null : phase.id))
            }
            aria-pressed={selected}
            aria-label={label}
            className={
              hud
                ? `inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors ${
                    selected ? 'bg-cream/[0.08]' : 'hover:bg-cream/[0.04]'
                  }`
                : `min-h-11 rounded-md border px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? 'border-cream/35 bg-cream/[0.06]'
                      : 'border-cream/10 hover:border-cream/20 hover:bg-cream/[0.03]'
                  }`
            }
          >
            {hud ? (
              <span
                className={`inline-flex h-2.5 w-2.5 rounded-full border ${phaseTickClass(record.status)}`}
                aria-hidden
              />
            ) : (
              <>
                <span className="block text-[13px] font-medium text-cream">
                  {phase.name}
                </span>
                <span
                  className={`mt-2 inline-flex rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${phaseTone(record.status)}`}
                >
                  {masterPhaseStatusLabel(record.status)}
                </span>
              </>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="max-w-[14rem] border border-cream/10 bg-[#1a1f1c] px-3 py-2 text-left text-[12px] leading-snug text-cream"
        >
          <p className="font-medium">{phase.name}</p>
          <p className="mt-0.5 text-cream/60">{phase.short}</p>
          <p className="mt-1 text-cream/50">{masterPhaseStatusLabel(record.status)}</p>
        </TooltipContent>
      </Tooltip>
    );
  });

  return (
    <section aria-label="Master phase results">
      {hud ? (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="text-[13px] text-cream/55">
            Mastering
            <span className="text-cream/25"> · </span>
            <span className={runTone(run.status)}>{masterTrackStatusLabel(run.status)}</span>
          </p>
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center">{phaseTicks}</div>
          </TooltipProvider>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-medium text-cream">
            Master phases{' '}
            <span className={`text-sm font-normal ${runTone(run.status)}`}>
              {masterTrackStatusLabel(run.status)}
            </span>
          </h3>
          <TooltipProvider delayDuration={200}>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {phaseTicks}
            </div>
          </TooltipProvider>
        </>
      )}

      {openPhase ? (
        <div className={hud ? 'mt-3 border-t border-cream/10 pt-3' : 'mt-4 border-t border-cream/10 pt-4'}>
          {openPhase.summary ? (
            <p
              className={
                hud
                  ? 'max-w-3xl text-[13px] leading-relaxed text-cream/55'
                  : 'max-w-3xl text-sm leading-relaxed text-cream/60'
              }
            >
              {openPhase.summary}
            </p>
          ) : (
            <p className={hud ? 'text-[13px] text-cream/40' : 'text-sm text-cream/40'}>
              Waiting for this phase to be written.
            </p>
          )}
          {openPhase.metrics?.length ? (
            <dl
              className={
                hud
                  ? 'mt-3 grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-4'
                  : 'mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3'
              }
            >
              {openPhase.metrics.map((metric) => (
                <div key={`${openPhase.id}-${metric.label}`}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">
                    {metric.label}
                  </dt>
                  <dd
                    className={
                      hud
                        ? 'mt-0.5 text-[12px] tabular-nums text-cream'
                        : 'mt-1 text-sm tabular-nums text-cream'
                    }
                  >
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          {!hud && openPhase.artifacts?.length ? (
            <ul className="mt-4 space-y-1">
              {openPhase.artifacts.map((artifact) => (
                <li
                  key={artifact.path}
                  className="truncate font-mono text-[11px] text-cream/40"
                >
                  <span className="text-[#9fb5aa]/80">{artifact.label}</span>
                  <span className="text-cream/25"> · </span>
                  {artifact.path}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
