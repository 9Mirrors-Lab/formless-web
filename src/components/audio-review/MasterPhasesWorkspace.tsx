import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, FileAudio } from 'lucide-react';

import {
  AnalysisWorkspaceTabs,
  type AnalysisWorkspaceTab,
} from '@/components/audio-review/AnalysisWorkspaceTabs';
import {
  ExplainedMetricList,
  PhaseMeaning,
} from '@/components/audio-review/MasterPhaseMeaning';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatChapterIndex } from '@/data/audioBook';
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
const ICON_STROKE = 1.75;
const STAGE_EASE = [0.16, 1, 0.3, 1] as const;

type MasterPhasesVariant = 'editorial' | 'studio';
type NoteKind = 'hold' | 'polish' | 'guide' | 'scenario' | 'plain';

type ParsedNote = {
  kind: NoteKind;
  code?: string;
  body: string;
};

const CALL_NOTE =
  /^(\d{2})\s+(.+?)\s+(HOLD|POLISH|GUIDE)\s*[-\u2013\u2014]\s*(.*)$/;

function cleanCopy(text: string): string {
  return text.replace(/[\u2013\u2014]/g, ' - ');
}

function phaseTickClass(status: MasterPhaseStatus): string {
  switch (status) {
    case 'complete':
      return 'border-[#9fb5aa] bg-[#9fb5aa]';
    case 'running':
      return 'studio-tick-current border-cream bg-cream';
    case 'blocked':
      return 'studio-tick-skipped border-[#e07852] bg-transparent text-[#e07852]';
    case 'pending':
      return 'border-cream/20 bg-transparent';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function trackTone(status: MasterTrackRunStatus): string {
  switch (status) {
    case 'ready-for-final-qc':
      return 'text-[#9fb5aa]';
    case 'in-progress':
      return 'text-amber-200/85';
    case 'idle':
      return 'text-cream/40';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function statusWordTone(status: MasterPhaseStatus): string {
  switch (status) {
    case 'complete':
      return 'text-[#9fb5aa]';
    case 'running':
      return 'text-amber-200/85';
    case 'blocked':
      return 'text-[#e07852]';
    case 'pending':
      return 'text-cream/40';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function noteKindLabel(kind: NoteKind): string {
  switch (kind) {
    case 'hold':
      return 'Hold';
    case 'polish':
      return 'Polish';
    case 'guide':
      return 'Guide';
    case 'scenario':
      return 'Scenario';
    case 'plain':
      return 'Notes';
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function noteKindTone(kind: NoteKind): string {
  switch (kind) {
    case 'hold':
      return 'border-[#9fb5aa]/25 bg-[#9fb5aa]/[0.07]';
    case 'polish':
      return 'border-[#e07852]/25 bg-[#e07852]/[0.07]';
    case 'guide':
      return 'border-cream/12 bg-cream/[0.03]';
    case 'scenario':
      return 'border-amber-200/20 bg-amber-200/[0.06]';
    case 'plain':
      return 'border-cream/10 bg-transparent';
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function parseNote(note: string): ParsedNote {
  const cleaned = cleanCopy(note);
  const call = CALL_NOTE.exec(note) ?? CALL_NOTE.exec(cleaned);
  if (call) {
    const verb = call[3];
    const kind: NoteKind =
      verb === 'HOLD' ? 'hold' : verb === 'POLISH' ? 'polish' : 'guide';
    return { kind, code: call[2], body: cleanCopy(call[4] ?? '') };
  }
  if (/^scenario:/i.test(cleaned)) {
    return { kind: 'scenario', body: cleaned.replace(/^scenario:\s*/i, '') };
  }
  return { kind: 'plain', body: cleaned };
}

function fileNameFromPath(path: string): string {
  return path.split('/').pop() ?? path;
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

function PhaseMark({ status }: { status: MasterPhaseStatus }) {
  return (
    <span
      className={`relative inline-flex h-2.5 w-2.5 rounded-full border ${phaseTickClass(status)}`}
      aria-hidden
    />
  );
}

function noteWhy(kind: NoteKind): string | null {
  switch (kind) {
    case 'hold':
      return 'Already helping the ACX pass. Leave it.';
    case 'polish':
      return 'Without this fix, ACX or sound quality would fail.';
    case 'guide':
      return 'How we process so the file passes ACX without flattening the read.';
    case 'scenario':
    case 'plain':
      return null;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function NoteCard({ note }: { note: ParsedNote }) {
  const why = noteWhy(note.kind);
  return (
    <article className={`rounded-md border px-3 py-2.5 ${noteKindTone(note.kind)}`}>
      {note.code ? (
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream/45">
          {note.code}
        </p>
      ) : null}
      <p className="mt-1 text-[12px] leading-relaxed text-cream/70">{note.body}</p>
      {why ? (
        <p className="mt-2 text-[11px] leading-relaxed text-cream/45">{why}</p>
      ) : null}
    </article>
  );
}

function PhaseBoard({ phase }: { phase: MasterPhaseRecord }) {
  const empty = phase.status === 'pending' && !phase.summary;
  const parsed = (phase.notes ?? []).map(parseNote);
  const grouped: Record<NoteKind, ParsedNote[]> = {
    hold: [],
    polish: [],
    guide: [],
    scenario: [],
    plain: [],
  };
  for (const note of parsed) {
    grouped[note.kind].push(note);
  }
  const actionKinds: NoteKind[] = ['hold', 'polish', 'guide'];
  const hasActions = actionKinds.some((kind) => grouped[kind].length > 0);

  if (empty) {
    return (
      <div className="flex items-center gap-3 py-6 text-cream/40">
        <PhaseMark status={phase.status} />
        <p className="text-[13px]">Waiting for this phase to be written.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PhaseMeaning phaseId={phase.id} />

      {phase.summary ? (
        <section>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
            This track
          </p>
          <p className="mt-1 max-w-[65ch] text-[13px] leading-relaxed text-cream/65">
            {cleanCopy(phase.summary)}
          </p>
        </section>
      ) : null}

      {phase.metrics?.length ? (
        <section className="space-y-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
            Results for ACX
          </p>
          <ExplainedMetricList metrics={phase.metrics} phaseId={phase.id} />
        </section>
      ) : null}

      {grouped.scenario.length ? (
        <section className="space-y-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
            Scenario
          </p>
          {grouped.scenario.map((note) => (
            <NoteCard key={note.body} note={note} />
          ))}
        </section>
      ) : null}

      {hasActions ? (
        <div
          className={`grid gap-3 ${
            actionKinds.filter((kind) => grouped[kind].length).length > 1
              ? 'md:grid-cols-2 lg:grid-cols-3'
              : ''
          }`}
        >
          {actionKinds
            .filter((kind) => grouped[kind].length)
            .map((kind) => (
              <section key={kind} className="min-w-0 space-y-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
                  {noteKindLabel(kind)}
                </p>
                {grouped[kind].map((note) => (
                  <NoteCard key={`${note.code}-${note.body}`} note={note} />
                ))}
              </section>
            ))}
        </div>
      ) : null}

      {grouped.plain.length ? (
        <section className="space-y-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
            What we did
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {grouped.plain.map((note) => (
              <li key={note.body}>
                <NoteCard note={note} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase.artifacts?.length ? (
        <ul className="flex flex-wrap gap-2">
          {phase.artifacts.map((artifact) => (
            <li
              key={artifact.path}
              className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-md border border-cream/10 bg-[#101412] px-3 py-2"
            >
              <FileAudio size={14} strokeWidth={ICON_STROKE} className="shrink-0 text-[#9fb5aa]" />
              <span className="min-w-0">
                <span className="block truncate text-[12px] text-cream">{artifact.label}</span>
                <span className="block truncate font-mono text-[10px] text-cream/35">
                  {fileNameFromPath(artifact.path)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function PhaseStage({
  phaseId,
  direction,
  children,
}: {
  phaseId: MasterPhaseId;
  direction: 1 | -1;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const innerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fromHeight = useRef<number | null>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  useLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) return;
    const next = node.offsetHeight;
    if (fromHeight.current == null || reduceMotion) {
      setHeight(next);
      fromHeight.current = next;
      return;
    }
    const current = stageRef.current?.offsetHeight ?? fromHeight.current;
    setHeight(current);
    const frame = requestAnimationFrame(() => {
      setHeight(next);
      fromHeight.current = next;
    });
    return () => cancelAnimationFrame(frame);
  }, [phaseId, reduceMotion]);

  if (reduceMotion) {
    return <div ref={innerRef}>{children}</div>;
  }

  return (
    <motion.div
      ref={stageRef}
      animate={{ height }}
      transition={{ duration: 0.42, ease: STAGE_EASE }}
      className="relative overflow-hidden"
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={phaseId}
          custom={direction}
          initial={{ x: 22 * direction, opacity: 0, filter: 'blur(5px)' }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ x: -18 * direction, opacity: 0, filter: 'blur(5px)' }}
          transition={{ duration: 0.38, ease: STAGE_EASE }}
        >
          <div ref={innerRef}>{children}</div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export type { MasterPhasesVariant };

type MasterPhasesWorkspaceProps = {
  focusTrackId: number | null;
  onSelectWorkspaceTab?: (tab: AnalysisWorkspaceTab) => void;
  variant?: MasterPhasesVariant;
  onListen?: () => void;
};

export function MasterPhasesWorkspace({
  focusTrackId,
  onSelectWorkspaceTab,
  variant = 'editorial',
  onListen,
}: MasterPhasesWorkspaceProps) {
  const reduceMotion = useReducedMotion();
  const [expandedTrackId, setExpandedTrackId] = useState<number | null>(focusTrackId);
  const [openPhaseId, setOpenPhaseId] = useState<MasterPhaseId>(1);
  const [phaseDir, setPhaseDir] = useState<1 | -1>(1);

  useEffect(() => {
    if (focusTrackId == null) return;
    setExpandedTrackId(focusTrackId);
  }, [focusTrackId]);

  const selectPhase = (phaseId: MasterPhaseId) => {
    if (phaseId === openPhaseId) return;
    setPhaseDir(phaseId > openPhaseId ? 1 : -1);
    setOpenPhaseId(phaseId);
  };

  const toggleTrack = (chapterId: number) => {
    setExpandedTrackId((current) => {
      if (current === chapterId) return null;
      setOpenPhaseId(1);
      setPhaseDir(1);
      return chapterId;
    });
  };

  const openTrackPhase = (chapterId: number, phaseId: MasterPhaseId) => {
    if (expandedTrackId === chapterId) {
      selectPhase(phaseId);
      return;
    }
    setExpandedTrackId(chapterId);
    setOpenPhaseId(phaseId);
    setPhaseDir(1);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#0d100e]">
      <header className="shrink-0 border-b border-cream/10 px-5 py-3 md:px-8">
        {onSelectWorkspaceTab ? (
          <AnalysisWorkspaceTabs
            value="master-phases"
            onValueChange={onSelectWorkspaceTab}
          />
        ) : null}
        {onListen ? (
          <button
            type="button"
            onClick={onListen}
            className="mt-2 min-h-11 text-[13px] text-cream/50 transition-colors hover:text-cream"
          >
            Back to listen
          </button>
        ) : null}
        <h2
          className={
            variant === 'studio'
              ? `${onSelectWorkspaceTab || onListen ? 'mt-2' : ''} text-[15px] font-medium tracking-tight text-cream`
              : 'mt-2 font-serif text-3xl italic leading-[1.12] text-cream md:text-4xl'
          }
        >
          Same six phases. Every track.
        </h2>
        <p className="mt-1 max-w-[65ch] text-[12px] leading-relaxed text-cream/45">
          Each phase exists so the chapter can pass ACX: legal loudness, legal
          peaks, clean quiet, correct file. Open a track to see what the
          numbers mean and why they matter.
        </p>
      </header>

      <div className="px-4 py-4 md:px-8">
        <div className="overflow-hidden rounded-lg border border-cream/10 bg-[#101412]">
          <Table>
            <TableHeader>
              <TableRow className="border-cream/10 hover:bg-transparent">
                <TableHead className="min-w-[16rem] pl-3 text-[11px] font-normal text-cream/40">
                  Track
                </TableHead>
                {MASTER_PHASE_CATALOG.map((phase) => (
                  <TableHead
                    key={phase.id}
                    className="px-1 text-center text-[11px] font-normal leading-tight text-cream/55"
                  >
                    {phase.name}
                  </TableHead>
                ))}
                <TableHead className="pr-3 text-right text-[11px] font-normal text-cream/40">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MASTER_TRACK_RUNS.map((run) => {
                const expanded = expandedTrackId === run.chapterId;
                const openPhase = phaseForRun(run, openPhaseId);
                return (
                  <Fragment key={run.chapterId}>
                    <TableRow
                      data-state={expanded ? 'selected' : undefined}
                      className="border-cream/10 text-cream hover:bg-cream/[0.03] data-[state=selected]:bg-cream/[0.04]"
                    >
                      <TableCell className="whitespace-normal py-2 pl-3">
                        <button
                          type="button"
                          aria-expanded={expanded}
                          onClick={() => toggleTrack(run.chapterId)}
                          className="grid w-full min-h-11 min-w-0 grid-cols-[1rem_2.5rem_minmax(0,1fr)] items-center gap-x-5 text-left"
                        >
                          <ChevronDown
                            className={`size-3.5 shrink-0 text-cream/35 transition-transform ${
                              expanded ? 'rotate-0' : '-rotate-90'
                            }`}
                            aria-hidden
                          />
                          <span className="truncate font-mono text-[10px] tabular-nums text-cream/40">
                            {formatChapterIndex(run.chapterId)}
                          </span>
                          <span className="min-w-0 truncate text-[13px] font-medium leading-snug text-cream">
                            {run.chapterTitle}
                          </span>
                        </button>
                      </TableCell>
                      {MASTER_PHASE_CATALOG.map((phase) => {
                        const record = phaseForRun(run, phase.id);
                        const selected = expanded && openPhaseId === phase.id;
                        return (
                          <TableCell key={phase.id} className="px-1 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => openTrackPhase(run.chapterId, phase.id)}
                              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full ${
                                selected ? 'bg-cream/[0.08]' : 'hover:bg-cream/[0.04]'
                              }`}
                              aria-label={`${run.chapterTitle}, ${phase.name}: ${masterPhaseStatusLabel(record.status)}`}
                              aria-pressed={selected}
                            >
                              <PhaseMark status={record.status} />
                            </button>
                          </TableCell>
                        );
                      })}
                      <TableCell className="py-2 pr-4 text-right">
                        <span
                          className={`text-[11px] ${trackTone(run.status)}`}
                        >
                          {masterTrackStatusLabel(run.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                    {expanded ? (
                      <TableRow className="border-cream/10 hover:bg-transparent">
                        <TableCell
                          colSpan={PHASE_COL_SPAN}
                          className="whitespace-normal p-0"
                        >
                          <div className="border-t border-cream/[0.06] bg-[#0c0f0d] px-4 py-4 md:px-5">
                            <div
                              className="relative mb-4 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6"
                              role="tablist"
                              aria-label={`${run.chapterTitle} phases`}
                            >
                              {MASTER_PHASE_CATALOG.map((phase) => {
                                const record = phaseForRun(run, phase.id);
                                const selected = openPhaseId === phase.id;
                                return (
                                  <button
                                    key={phase.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    onClick={() => selectPhase(phase.id)}
                                    className="relative flex min-h-11 items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-cream/[0.03]"
                                  >
                                    {selected ? (
                                      <motion.span
                                        layoutId={`phase-tab-${run.chapterId}`}
                                        className="absolute inset-0 rounded-md border border-cream/25 bg-cream/[0.06]"
                                        transition={
                                          reduceMotion
                                            ? { duration: 0 }
                                            : { type: 'spring', stiffness: 420, damping: 36 }
                                        }
                                      />
                                    ) : null}
                                    <span className="relative">
                                      <PhaseMark status={record.status} />
                                    </span>
                                    <span className="relative min-w-0">
                                      <span className="block truncate text-[12px] font-medium text-cream">
                                        {phase.name}
                                      </span>
                                      <span
                                        className={`block text-[10px] ${statusWordTone(record.status)}`}
                                      >
                                        {masterPhaseStatusLabel(record.status)}
                                      </span>
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                            <PhaseStage phaseId={openPhaseId} direction={phaseDir}>
                              <PhaseBoard phase={openPhase} />
                            </PhaseStage>
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
