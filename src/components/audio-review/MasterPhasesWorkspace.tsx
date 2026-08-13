import { Fragment, useEffect, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

import {
  AnalysisWorkspaceTabs,
  type AnalysisWorkspaceTab,
} from '@/components/audio-review/AnalysisWorkspaceTabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatChapterIndex } from '@/data/audioReviewMock';
import {
  MASTER_PHASE_CATALOG,
  MASTER_TRACK_RUNS,
  masterPhaseStatusLabel,
  masterTrackStatusLabel,
  type MasterPhaseId,
  type MasterPhaseRecord,
  type MasterPhaseStatus,
  type MasterTrackRun,
  type MasterTrackRunStatus,
} from '@/data/audioMasterPhaseRuns';

const PHASE_COL_SPAN = MASTER_PHASE_CATALOG.length + 2;

function trackBadgeClass(status: MasterTrackRunStatus): string {
  switch (status) {
    case 'ready-for-final-qc':
      return 'border-[#9fb5aa]/40 bg-[#9fb5aa]/10 text-[#9fb5aa]';
    case 'in-progress':
      return 'border-amber-200/30 bg-amber-200/10 text-amber-200/85';
    case 'idle':
      return 'border-cream/15 bg-cream/[0.03] text-cream/45';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function phaseBadgeClass(status: MasterPhaseStatus): string {
  switch (status) {
    case 'complete':
      return 'border-[#9fb5aa]/40 bg-[#9fb5aa]/10 text-[#9fb5aa]';
    case 'running':
      return 'border-amber-200/30 bg-amber-200/10 text-amber-200/85';
    case 'blocked':
      return 'border-[#e07852]/40 bg-[#e07852]/10 text-[#e07852]';
    case 'pending':
      return 'border-cream/15 bg-transparent text-cream/40';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function phaseForRun(run: MasterTrackRun, id: MasterPhaseId): MasterPhaseRecord {
  return (
    run.phases.find((phase) => phase.id === id) ?? {
      id,
      name: MASTER_PHASE_CATALOG[id - 1]!.name,
      short: MASTER_PHASE_CATALOG[id - 1]!.short,
      status: 'pending',
      summary: '',
    }
  );
}

function PhaseDetail({ phase }: { phase: MasterPhaseRecord }) {
  const empty = phase.status === 'pending' && !phase.summary;

  if (empty) {
    return (
      <p className="text-sm leading-relaxed text-cream/40">
        Waiting for the mastering run to write this phase.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {phase.summary ? (
        <p className="max-w-3xl text-[15px] leading-relaxed text-cream/65">{phase.summary}</p>
      ) : null}

      {phase.metrics?.length ? (
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
          {phase.metrics.map((metric) => (
            <div key={`${phase.id}-${metric.label}`}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/35">
                {metric.label}
              </dt>
              <dd className="mt-1 font-serif text-lg italic text-cream">{metric.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {phase.notes?.length ? (
        <ul className="space-y-2 border-l border-cream/15 pl-4">
          {phase.notes.map((note) => (
            <li key={note} className="text-sm leading-relaxed text-cream/50">
              {note}
            </li>
          ))}
        </ul>
      ) : null}

      {phase.artifacts?.length ? (
        <ul className="space-y-2">
          {phase.artifacts.map((artifact) => (
            <li key={artifact.path} className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9fb5aa]/70">
                {artifact.label}
              </p>
              <p className="mt-1 truncate font-mono text-[11px] text-cream/40">{artifact.path}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type MasterPhasesWorkspaceProps = {
  focusTrackId: number | null;
  onSelectWorkspaceTab: (tab: AnalysisWorkspaceTab) => void;
};

export function MasterPhasesWorkspace({
  focusTrackId,
  onSelectWorkspaceTab,
}: MasterPhasesWorkspaceProps) {
  const [expandedTrackId, setExpandedTrackId] = useState<number | null>(focusTrackId);
  const [openPhase, setOpenPhase] = useState<string | undefined>(
    focusTrackId == null ? undefined : 'phase-1',
  );

  useEffect(() => {
    if (focusTrackId == null) return;
    setExpandedTrackId(focusTrackId);
    setOpenPhase((current) => current ?? 'phase-1');
  }, [focusTrackId]);

  const toggleTrack = (chapterId: number) => {
    setExpandedTrackId((current) => {
      if (current === chapterId) {
        setOpenPhase(undefined);
        return null;
      }
      setOpenPhase('phase-1');
      return chapterId;
    });
  };

  const openTrackPhase = (chapterId: number, phaseId: MasterPhaseId) => {
    setExpandedTrackId(chapterId);
    setOpenPhase(`phase-${phaseId}`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#0d100e]">
      <header className="shrink-0 border-b border-cream/10 px-6 py-8 md:px-10">
        <AnalysisWorkspaceTabs
          value="master-phases"
          onValueChange={onSelectWorkspaceTab}
        />
        <h2 className="mt-3 max-w-3xl font-serif text-4xl italic leading-[1.12] text-cream md:text-5xl">
          Same six phases. Every track.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/55">
          Scan status in the table. Expand a row, then open a phase for that track’s notes,
          metrics, and files. After phase six the track is Ready for Final QC.
        </p>
      </header>

      <div className="px-6 py-6 md:px-10">
        <div className="overflow-hidden rounded-xl border border-cream/10 bg-[#101412]">
          <Table>
            <TableHeader>
              <TableRow className="border-cream/10 hover:bg-transparent">
                <TableHead className="min-w-[12rem] text-cream/45">Track</TableHead>
                {MASTER_PHASE_CATALOG.map((phase) => (
                  <TableHead
                    key={phase.id}
                    className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40"
                  >
                    <span className="block tabular-nums text-cream/25">
                      {String(phase.id).padStart(2, '0')}
                    </span>
                    {phase.short}
                  </TableHead>
                ))}
                <TableHead className="text-cream/45">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MASTER_TRACK_RUNS.map((run) => {
                const expanded = expandedTrackId === run.chapterId;
                return (
                  <Fragment key={run.chapterId}>
                    <TableRow
                      key={run.chapterId}
                      data-state={expanded ? 'selected' : undefined}
                      className="border-cream/10 text-cream hover:bg-cream/[0.03] data-[state=selected]:bg-cream/[0.04]"
                    >
                      <TableCell className="whitespace-normal">
                        <button
                          type="button"
                          aria-expanded={expanded}
                          onClick={() => toggleTrack(run.chapterId)}
                          className="flex w-full min-w-0 items-center gap-2 text-left"
                        >
                          <ChevronDownIcon
                            className={`size-4 shrink-0 text-cream/35 transition-transform ${
                              expanded ? 'rotate-0' : '-rotate-90'
                            }`}
                            aria-hidden
                          />
                          <span className="min-w-0">
                            <span className="mr-2 font-mono text-[11px] tabular-nums text-cream/35">
                              {formatChapterIndex(run.chapterId)}
                            </span>
                            <span className="font-serif text-base italic text-cream">
                              {run.chapterTitle}
                            </span>
                          </span>
                        </button>
                      </TableCell>
                      {MASTER_PHASE_CATALOG.map((phase) => {
                        const record = phaseForRun(run, phase.id);
                        return (
                          <TableCell key={phase.id} className="text-center">
                            <button
                              type="button"
                              onClick={() => openTrackPhase(run.chapterId, phase.id)}
                              className="inline-flex"
                              aria-label={`${run.chapterTitle}, ${phase.name}: ${masterPhaseStatusLabel(record.status)}`}
                            >
                              <Badge
                                variant="outline"
                                className={phaseBadgeClass(record.status)}
                              >
                                {masterPhaseStatusLabel(record.status)}
                              </Badge>
                            </button>
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <Badge variant="outline" className={trackBadgeClass(run.status)}>
                          {masterTrackStatusLabel(run.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {expanded ? (
                      <TableRow
                        key={`${run.chapterId}-detail`}
                        className="border-cream/10 hover:bg-transparent"
                      >
                        <TableCell colSpan={PHASE_COL_SPAN} className="whitespace-normal p-0">
                          <div className="border-t border-cream/[0.06] bg-[#0c0f0d] px-4 py-2 md:px-6">
                            <Accordion
                              type="single"
                              collapsible
                              value={openPhase}
                              onValueChange={setOpenPhase}
                              className="w-full"
                            >
                              {MASTER_PHASE_CATALOG.map((phase) => {
                                const record = phaseForRun(run, phase.id);
                                return (
                                  <AccordionItem
                                    key={phase.id}
                                    value={`phase-${phase.id}`}
                                    className="border-cream/10"
                                  >
                                    <AccordionTrigger className="py-3 text-cream hover:no-underline">
                                      <span className="flex min-w-0 flex-1 items-center gap-3">
                                        <span className="font-mono text-[11px] tabular-nums tracking-[0.18em] text-cream/35">
                                          {String(phase.id).padStart(2, '0')}
                                        </span>
                                        <span className="font-serif text-xl italic">
                                          {phase.name}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className={phaseBadgeClass(record.status)}
                                        >
                                          {masterPhaseStatusLabel(record.status)}
                                        </Badge>
                                      </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5">
                                      <PhaseDetail phase={record} />
                                    </AccordionContent>
                                  </AccordionItem>
                                );
                              })}
                            </Accordion>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
