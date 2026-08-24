import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, X } from 'lucide-react';

import { BrandShell } from '@/components/app-sidebar';
import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  LAUNCH_ADS,
  LAUNCH_CALENDAR,
  LAUNCH_CHANNELS,
  LAUNCH_CHANNEL_IDS,
  LAUNCH_INTAKE,
  LAUNCH_LANDING,
  LAUNCH_POSITIONING,
  LAUNCH_QUICK_QUESTIONS,
  LAUNCH_RUNWAYS,
  LAUNCH_SCRIPTS,
  findLaunchPiece,
  formatLaunchPieceCopy,
  formatLaunchSubjects,
  launchDeskHref,
  launchFiltersFromSearch,
  phasesUsedBy,
  pieceKindLabel,
  pieceShortLabel,
  piecesForChannel,
  piecesForPhase,
  piecesForView,
  summarizeLaunchCampaign,
  type LaunchChannelId,
  type LaunchDeskFilters,
  type LaunchIntakeSection,
  type LaunchPhase,
  type LaunchPiece,
  type LaunchRunwayId,
  type LaunchView,
} from '@/data/bookLaunchCampaign';

const TAB_CLASS =
  'inline-flex h-11 items-center rounded-full border px-3.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors';

const PIECE_TRAY_PANEL =
  'fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-cream/10 bg-[#121614] shadow-xl';

function setFiltersInUrl(filters: LaunchDeskFilters) {
  window.history.replaceState({}, '', launchDeskHref(filters));
}

function isAssetView(view: LaunchView): boolean {
  switch (view) {
    case 'intake':
    case 'landing':
    case 'calendar':
      return true;
    case 'all':
    case 'warm':
    case 'waitlist':
    case 'stay-close':
    case 'advance':
    case 'linkedin':
    case 'x':
      return false;
    default: {
      const _never: never = view;
      return _never;
    }
  }
}

function pieceStaysInView(pieceId: string | null, view: LaunchView): boolean {
  if (isAssetView(view)) return false;
  const piece = findLaunchPiece(pieceId);
  if (!piece) return false;
  if (view === 'all') return true;
  return piece.channel === view;
}

function selectedPiece(filters: LaunchDeskFilters): LaunchPiece | null {
  if (!pieceStaysInView(filters.piece, filters.campaign)) return null;
  return findLaunchPiece(filters.piece);
}

export default function BrandBookLaunchCampaignPage() {
  const reduceMotion = usePrefersReducedMotion();
  const [filters, setFilters] = useState<LaunchDeskFilters>(() =>
    launchFiltersFromSearch(window.location.search),
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [subjectIndex, setSubjectIndex] = useState(0);

  const summary = useMemo(() => summarizeLaunchCampaign(), []);
  const selected = selectedPiece(filters);
  const timelinePieces = piecesForView(
    isAssetView(filters.campaign) ? 'all' : filters.campaign,
  );
  const phases = phasesUsedBy(timelinePieces);
  const showTimeline = !isAssetView(filters.campaign);
  const showMatrix = filters.campaign === 'all';

  function update(next: Partial<LaunchDeskFilters>) {
    setFilters((current) => {
      const merged: LaunchDeskFilters = { ...current, ...next };
      if (next.campaign && next.campaign !== current.campaign && next.piece === undefined) {
        if (!pieceStaysInView(merged.piece, next.campaign)) {
          merged.piece = null;
        }
      }
      setFiltersInUrl(merged);
      return merged;
    });
    setSubjectIndex(0);
  }

  function closePiece() {
    update({ piece: null });
  }

  function selectPiece(piece: LaunchPiece, campaign: LaunchView) {
    if (filters.piece === piece.id) {
      closePiece();
      return;
    }
    update({ piece: piece.id, campaign });
  }

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1400);
    } catch {
      setCopiedKey(null);
    }
  }

  return (
    <BrandShell activeId="book-launch" crumb="Book launch campaign">
      <BrandPageBody>
        <div className="flex flex-col gap-6 md:gap-8">
          <BrandPageHeader
            tone="desk"
            title="Formless launch campaign"
            description="Eleven days into September 1, then ninety days of teaching. Warm circle, waitlist, Stay Close, advance listen, LinkedIn, and X; each list is its own lane."
          />

          <PositioningStrip />

          <CampaignTabs
            campaign={filters.campaign}
            summary={summary}
            onSelect={(campaign) => update({ campaign })}
          />

          {showTimeline ? (
            <p className="border-b border-cream/12 pb-3 font-sans text-sm text-cream/55">
              {summaryLine(filters.campaign, summary)}
            </p>
          ) : null}

          {showTimeline && showMatrix ? (
            <TimelineMatrix
              phases={phases}
              selectedId={selected?.id ?? null}
              onSelect={(piece) => selectPiece(piece, 'all')}
            />
          ) : null}

          {showTimeline && !showMatrix ? (
            <CampaignSequence
              channel={filters.campaign as LaunchChannelId}
              selectedId={selected?.id ?? null}
              onSelect={(piece) => selectPiece(piece, filters.campaign)}
            />
          ) : null}

          {filters.campaign === 'landing' ? (
            <LandingDesk copiedKey={copiedKey} onCopy={copyText} />
          ) : null}
          {filters.campaign === 'calendar' ? <CalendarDesk /> : null}
          {filters.campaign === 'intake' ? <IntakeDesk /> : null}
        </div>
      </BrandPageBody>
      <AnimatePresence>
        {selected && showTimeline ? (
          <PieceInspector
            piece={selected}
            subjectIndex={subjectIndex}
            copiedKey={copiedKey}
            reduceMotion={reduceMotion}
            onClose={closePiece}
            onSubjectIndex={setSubjectIndex}
            onCopy={copyText}
          />
        ) : null}
      </AnimatePresence>
    </BrandShell>
  );
}

function PositioningStrip() {
  return (
    <section className="grid gap-4 border-y border-cream/12 py-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-10">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9fb5aa]/70">
          Angle
        </p>
        <p className="mt-2 max-w-[54ch] font-sans text-[1.05rem] font-medium leading-snug tracking-[-0.02em] text-cream">
          {LAUNCH_POSITIONING.angle}
        </p>
      </div>
      <div className="flex flex-col gap-3 text-[0.8125rem] leading-relaxed text-cream/60">
        <p>{LAUNCH_POSITIONING.coreBenefit}</p>
        <p>
          {LAUNCH_POSITIONING.author}. {LAUNCH_POSITIONING.launchDate}.{' '}
          {LAUNCH_POSITIONING.formats}.
        </p>
      </div>
    </section>
  );
}

function summaryLine(
  campaign: LaunchView,
  summary: ReturnType<typeof summarizeLaunchCampaign>,
): string {
  switch (campaign) {
    case 'all':
      return `${summary.emails} emails and ${summary.posts} posts. ${summary.byRunway.before} before launch, ${summary.byRunway.launch} on the day, ${summary.byRunway.after} after.`;
    case 'warm':
      return `${summary.byChannel.warm} notes for the people closest to Soni.`;
    case 'waitlist':
      return `${summary.byChannel.waitlist} letters for people who wanted to hear.`;
    case 'stay-close':
      return `${summary.byChannel['stay-close']} quieter letters for Stay Close.`;
    case 'advance':
      return `${summary.byChannel.advance} notes for advance-listen companions.`;
    case 'linkedin':
      return `${summary.byChannel.linkedin} posts for the personal LinkedIn profile.`;
    case 'x':
      return `${summary.byChannel.x} posts. Insight first, title second.`;
    case 'landing':
      return 'Launch-state book page, ads, and two short videos.';
    case 'calendar':
      return 'Day-by-day from August 22 through November.';
    case 'intake':
      return 'Links, lists, and the site flip still to lock.';
    default: {
      const _never: never = campaign;
      return _never;
    }
  }
}

function CampaignTabs({
  campaign,
  summary,
  onSelect,
}: {
  campaign: LaunchView;
  summary: ReturnType<typeof summarizeLaunchCampaign>;
  onSelect: (campaign: LaunchView) => void;
}) {
  const tabs: Array<{ id: LaunchView; label: string; count?: number }> = [
    { id: 'all', label: 'Runway' },
    { id: 'warm', label: 'Warm', count: summary.byChannel.warm },
    { id: 'waitlist', label: 'Waitlist', count: summary.byChannel.waitlist },
    { id: 'stay-close', label: 'Stay Close', count: summary.byChannel['stay-close'] },
    { id: 'advance', label: 'Advance', count: summary.byChannel.advance },
    { id: 'linkedin', label: 'LinkedIn', count: summary.byChannel.linkedin },
    { id: 'x', label: 'X', count: summary.byChannel.x },
    { id: 'landing', label: 'Page' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'intake', label: 'Ops' },
  ];

  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Launch campaign"
    >
      {tabs.map((tab) => {
        const active = campaign === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(tab.id)}
            className={[
              TAB_CLASS,
              active
                ? 'border-cream/30 bg-cream/[0.06] text-cream'
                : 'border-cream/12 text-cream/60 hover:border-cream/25 hover:text-cream',
            ].join(' ')}
          >
            {tab.label}
            {tab.count != null ? (
              <span className="ml-2 text-cream/40">{tab.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function TimelineMatrix({
  phases,
  selectedId,
  onSelect,
}: {
  phases: LaunchPhase[];
  selectedId: string | null;
  onSelect: (piece: LaunchPiece) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      {LAUNCH_RUNWAYS.map((runway) => {
        const rows = phases.filter((phase) => phase.runway === runway.id);
        if (rows.length === 0) return null;
        return (
          <section key={runway.id} aria-labelledby={`runway-${runway.id}`}>
            <div
              className={[
                'mb-3 border-l-2 pl-3',
                runway.id === 'launch' ? 'border-clay' : 'border-cream/20',
              ].join(' ')}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/40">
                {runwayDateSpan(rows)}
              </p>
              <div className="mt-1 flex flex-wrap items-baseline justify-between gap-3">
                <h2
                  id={`runway-${runway.id}`}
                  className="font-sans text-[1.2rem] font-semibold tracking-tight text-cream"
                >
                  {runway.label}
                </h2>
                <p className="max-w-[46ch] text-[0.75rem] leading-relaxed text-cream/45">
                  {runway.job}
                </p>
              </div>
            </div>
            <RunwayTable
              phases={rows}
              selectedId={selectedId}
              onSelect={onSelect}
              runway={runway.id}
            />
          </section>
        );
      })}
    </div>
  );
}

function RunwayTable({
  phases,
  selectedId,
  onSelect,
  runway,
}: {
  phases: LaunchPhase[];
  selectedId: string | null;
  onSelect: (piece: LaunchPiece) => void;
  runway: LaunchRunwayId;
}) {
  return (
    <div className="overflow-x-auto">
        <table className="w-full min-w-[72rem] border-collapse text-left">
        <caption className="sr-only">
          {runwayLabel(runway)} emails and posts
        </caption>
        <thead>
          <tr className="border-b border-cream/12">
            <th className="w-[11rem] py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
              When
            </th>
            {LAUNCH_CHANNEL_IDS.map((channel) => (
              <th
                key={channel}
                className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40"
              >
                {LAUNCH_CHANNELS[channel].shortTitle}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {phases.map((phase) => {
            const row = piecesForPhase(phase.id);
            return (
              <tr key={phase.id} className="border-b border-cream/10 align-top">
                <th
                  className={[
                    'py-3.5 pr-4 font-sans text-[12px] font-normal leading-snug text-cream/55',
                    runway === 'launch' ? 'border-l-2 border-clay pl-3' : '',
                  ].join(' ')}
                >
                  <span className="block font-medium text-cream">{phase.label}</span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-cream/35">
                    {phase.dates}
                  </span>
                </th>
                {LAUNCH_CHANNEL_IDS.map((channel) => {
                  const cell = row.filter((piece) => piece.channel === channel);
                  return (
                    <td
                      key={channel}
                      className={[
                        'py-3 pr-4',
                        runway === 'launch' ? 'bg-clay/[0.04]' : '',
                      ].join(' ')}
                    >
                      {cell.length === 0 ? (
                        <span className="block min-h-[2.5rem]" />
                      ) : (
                        <ul className="flex flex-col gap-1.5">
                          {cell.map((piece) => (
                            <li key={piece.id}>
                              <PieceChip
                                piece={piece}
                                selected={piece.id === selectedId}
                                onSelect={() => onSelect(piece)}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function runwayDateSpan(phases: LaunchPhase[]): string {
  if (phases.length === 0) return '';
  const first = phases[0]?.dates ?? '';
  const last = phases[phases.length - 1]?.dates ?? first;
  return first === last ? first : `${first} · ${last}`;
}

function runwayLabel(runway: LaunchRunwayId): string {
  switch (runway) {
    case 'before':
      return 'Before launch';
    case 'launch':
      return 'Launch day';
    case 'after':
      return 'After launch';
    default: {
      const _never: never = runway;
      return _never;
    }
  }
}

function CampaignSequence({
  channel,
  selectedId,
  onSelect,
}: {
  channel: LaunchChannelId;
  selectedId: string | null;
  onSelect: (piece: LaunchPiece) => void;
}) {
  const meta = LAUNCH_CHANNELS[channel];
  const pieces = piecesForChannel(channel);

  return (
    <section aria-labelledby={`${channel}-heading`}>
      <h2
        id={`${channel}-heading`}
        className="font-sans text-[1.2rem] font-semibold tracking-tight text-cream"
      >
        {meta.title}
      </h2>
      <p className="mt-2 max-w-[54ch] text-[0.8125rem] leading-relaxed text-cream/55">
        {meta.audience}
      </p>
      <p className="mt-2 max-w-[54ch] text-[0.8125rem] leading-relaxed text-cream/45">
        {meta.rule}
      </p>
      <ul className="mt-5 divide-y divide-cream/10 border-y border-cream/12">
        {pieces.map((piece) => {
          const selected = piece.id === selectedId;
          return (
            <li key={piece.id}>
              <button
                type="button"
                onClick={() => onSelect(piece)}
                aria-current={selected ? 'true' : undefined}
                className={[
                  'flex w-full min-h-11 items-baseline justify-between gap-6 py-3.5 text-left transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9fb5aa]',
                  selected ? 'text-cream' : 'text-cream/80 hover:text-cream',
                ].join(' ')}
              >
                <span className="min-w-0">
                  <span className="mr-3 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
                    {pieceShortLabel(piece)}
                  </span>
                  <span className="text-[13px] tracking-wide">{piece.title}</span>
                </span>
                <span className="shrink-0 text-right text-[11px] leading-snug text-cream/45">
                  {piece.send}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function PieceChip({
  piece,
  selected,
  onSelect,
}: {
  piece: LaunchPiece;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? 'true' : undefined}
      className={[
        'block w-full rounded-sm px-2 py-1.5 text-left transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]',
        selected
          ? 'bg-cream/[0.08] text-cream'
          : 'text-cream/75 hover:bg-cream/[0.04] hover:text-cream',
      ].join(' ')}
    >
      <span className="block font-mono text-[8px] uppercase tracking-[0.16em] text-cream/40">
        {piece.send}
      </span>
      <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-cream/40">
        {pieceShortLabel(piece)}
      </span>
      <span className="mt-0.5 block text-[12px] font-medium leading-snug">{piece.title}</span>
    </button>
  );
}

function PieceInspector({
  piece,
  subjectIndex,
  copiedKey,
  reduceMotion,
  onClose,
  onSubjectIndex,
  onCopy,
}: {
  piece: LaunchPiece;
  subjectIndex: number;
  copiedKey: string | null;
  reduceMotion: boolean;
  onClose: () => void;
  onSubjectIndex: (index: number) => void;
  onCopy: (key: string, text: string) => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const channel = LAUNCH_CHANNELS[piece.channel];
  const slide = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 280, damping: 32 };

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [piece.id]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close piece"
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        initial={reduceMotion ? false : { x: '100%' }}
        animate={{ x: 0 }}
        exit={reduceMotion ? undefined : { x: '100%' }}
        transition={slide}
        className={PIECE_TRAY_PANEL}
        aria-labelledby="launch-piece-heading"
      >
        <div className="flex items-start justify-between gap-4 border-b border-cream/10 py-5 pl-6 pr-20">
          <p className="pt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#9fb5aa]/70">
            {channel.title} · {pieceKindLabel(piece.kind)} {piece.number}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-cream/45 transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]"
            aria-label="Close"
          >
            <X size={18} aria-hidden />
          </button>
        </div>
        <div
          ref={bodyRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6"
        >
          <PieceDetail
            piece={piece}
            subjectIndex={subjectIndex}
            copiedKey={copiedKey}
            onSubjectIndex={onSubjectIndex}
            onCopy={onCopy}
          />
        </div>
      </motion.aside>
    </>
  );
}

function PieceDetail({
  piece,
  subjectIndex,
  copiedKey,
  onSubjectIndex,
  onCopy,
}: {
  piece: LaunchPiece;
  subjectIndex: number;
  copiedKey: string | null;
  onSubjectIndex: (index: number) => void;
  onCopy: (key: string, text: string) => void;
}) {
  const copyKey = `${piece.id}:${subjectIndex}`;
  const subjectsKey = `${piece.id}:subjects`;
  const safeSubjectIndex =
    piece.subjects.length === 0
      ? 0
      : Math.min(subjectIndex, piece.subjects.length - 1);

  return (
    <article aria-labelledby="launch-piece-heading">
      <h2
        id="launch-piece-heading"
        className="font-sans text-[1.45rem] font-semibold leading-[1.08] tracking-[-0.03em] text-cream md:text-[1.65rem]"
      >
        {piece.title}
      </h2>
      <p className="mt-2 text-[0.8125rem] text-cream/55">{piece.send}</p>
      <p className="mt-3 max-w-[58ch] text-[0.875rem] leading-relaxed text-cream/65">
        {piece.purpose}
      </p>

      {piece.subjects.length > 0 ? (
        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
            Subject lines
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {piece.subjects.map((subject, index) => {
              const active = index === safeSubjectIndex;
              return (
                <li key={subject}>
                  <button
                    type="button"
                    onClick={() => onSubjectIndex(index)}
                    className={[
                      'w-full rounded-sm px-3 py-2.5 text-left text-[0.9375rem] leading-snug transition-colors',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]',
                      active
                        ? 'bg-cream/[0.07] text-cream'
                        : 'text-cream/70 hover:bg-cream/[0.04] hover:text-cream',
                    ].join(' ')}
                  >
                    {subject}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <CopyButton
          label={copiedKey === copyKey ? 'Copied' : `Copy ${pieceKindLabel(piece.kind).toLowerCase()}`}
          onClick={() =>
            void onCopy(copyKey, formatLaunchPieceCopy(piece, safeSubjectIndex))
          }
        />
        {piece.subjects.length > 0 ? (
          <CopyButton
            label={copiedKey === subjectsKey ? 'Copied' : 'Copy subjects'}
            onClick={() => void onCopy(subjectsKey, formatLaunchSubjects(piece))}
          />
        ) : null}
      </div>

      <pre className="mt-6 whitespace-pre-wrap font-sans text-[0.9375rem] leading-[1.6] text-cream/90 md:text-[1rem]">
        {piece.body}
      </pre>
    </article>
  );
}

function CopyButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-cream/12 px-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
    >
      <Copy className="h-3.5 w-3.5" aria-hidden />
      {label}
    </button>
  );
}

function LandingDesk({
  copiedKey,
  onCopy,
}: {
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
}) {
  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="landing-copy-heading">
        <h2
          id="landing-copy-heading"
          className="font-sans text-[1.2rem] font-semibold tracking-tight text-cream"
        >
          Book page, launch morning
        </h2>
        <p className="mt-2 max-w-[54ch] text-[0.8125rem] leading-relaxed text-cream/50">
          Same voice as waitlist. The only change is the ask: Kindle and Audible instead of notify me.
        </p>
        <div className="mt-5 divide-y divide-cream/10 border-y border-cream/12">
          {LAUNCH_LANDING.map((section) => (
            <article key={section.id} className="py-6">
              <h3 className="font-sans text-[0.9375rem] text-cream">{section.heading}</h3>
              <p className="mt-2 max-w-[62ch] text-[0.875rem] leading-relaxed text-cream/70">
                {section.body}
              </p>
              {section.cta ? (
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#9fb5aa]/70">
                  {section.cta}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="ads-heading">
        <h2
          id="ads-heading"
          className="font-sans text-[1.2rem] font-semibold tracking-tight text-cream"
        >
          Quiet ad variants
        </h2>
        <p className="mt-2 max-w-[54ch] text-[0.8125rem] leading-relaxed text-cream/50">
          Search and Amazon language only. Claims match the book page. No countdown, no scarcity.
        </p>
        <div className="mt-5 divide-y divide-cream/10 border-y border-cream/12">
          {LAUNCH_ADS.map((ad) => (
            <article key={ad.id} className="py-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
                {ad.angle}
              </p>
              <h3 className="mt-2 font-sans text-[0.9375rem] text-cream">{ad.shortHeadline}</h3>
              <p className="mt-1 text-[0.875rem] text-cream/75">{ad.longHeadline}</p>
              <p className="mt-2 max-w-[62ch] text-[0.875rem] leading-relaxed text-cream/65">
                {ad.body}
              </p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#9fb5aa]/70">
                {ad.cta}
              </p>
              <p className="mt-2 text-[0.75rem] text-cream/40">{ad.audience}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="scripts-heading">
        <h2
          id="scripts-heading"
          className="font-sans text-[1.2rem] font-semibold tracking-tight text-cream"
        >
          Short videos
        </h2>
        <div className="mt-5 flex flex-col gap-8">
          {LAUNCH_SCRIPTS.map((script) => (
            <article key={script.id} className="border-t border-cream/12 pt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-sans text-[0.9375rem] text-cream">{script.title}</h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
                  {script.duration}
                </p>
              </div>
              <p className="mt-2 max-w-[58ch] text-[0.8125rem] leading-relaxed text-cream/50">
                {script.purpose} {script.format}
              </p>
              <CopyButton
                label={copiedKey === script.id ? 'Copied' : 'Copy script'}
                onClick={() => void onCopy(script.id, formatScript(script))}
              />
              <ol className="mt-4 divide-y divide-cream/10 border-y border-cream/12">
                {script.beats.map((beat) => (
                  <li key={beat.clock} className="grid gap-2 py-3 md:grid-cols-[7rem_1fr]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream/40">
                      {beat.clock}
                    </span>
                    <div className="text-[0.8125rem] leading-relaxed text-cream/75">
                      <p>{beat.voice}</p>
                      <p className="mt-1 text-cream/45">On screen: {beat.onScreen}</p>
                      <p className="text-cream/40">Visual: {beat.visual}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatScript(script: (typeof LAUNCH_SCRIPTS)[number]): string {
  const beats = script.beats
    .map(
      (beat) =>
        `${beat.clock}\nVO: ${beat.voice}\nON SCREEN: ${beat.onScreen}\nVISUAL: ${beat.visual}`,
    )
    .join('\n\n');
  return `${script.title}\n${script.duration}\n${script.format}\n\n${beats}`;
}

function CalendarDesk() {
  return (
    <section aria-labelledby="calendar-heading">
      <h2
        id="calendar-heading"
        className="font-sans text-[1.2rem] font-semibold tracking-tight text-cream"
      >
        Day by day
      </h2>
      <p className="mt-2 max-w-[54ch] text-[0.8125rem] leading-relaxed text-cream/50">
        Site flip before the launch letters. Teaching starts only after the week is closed.
      </p>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-cream/12">
              <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
                When
              </th>
              <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
                Channel
              </th>
              <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
                What ships
              </th>
              <th className="py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
                Depends on
              </th>
            </tr>
          </thead>
          <tbody>
            {LAUNCH_CALENDAR.map((row) => (
              <tr key={row.id} className="border-b border-cream/10 align-top">
                <td className="py-3.5 pr-4">
                  <span className="block text-[12px] text-cream/80">{row.when}</span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-cream/35">
                    {runwayLabel(row.runway)}
                  </span>
                </td>
                <td className="py-3.5 pr-4 text-[12px] text-cream/60">{row.channel}</td>
                <td className="py-3.5 pr-4 text-[13px] leading-snug text-cream/85">{row.piece}</td>
                <td className="py-3.5 text-[12px] leading-snug text-cream/45">{row.dependsOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function IntakeDesk() {
  const both = LAUNCH_INTAKE.filter((section) => section.channel === 'both');
  const warm = LAUNCH_INTAKE.filter((section) => section.channel === 'warm');
  const lists = LAUNCH_INTAKE.filter((section) => section.channel === 'lists');

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="quick-intake-heading">
        <h2
          id="quick-intake-heading"
          className="font-sans text-[1.2rem] font-semibold tracking-tight text-cream"
        >
          Still to lock
        </h2>
        <ol className="mt-4 divide-y divide-cream/10 border-y border-cream/12">
          {LAUNCH_QUICK_QUESTIONS.map((question, index) => (
            <li
              key={question}
              className="flex gap-4 py-3.5 text-[0.9375rem] leading-snug text-cream/85"
            >
              <span className="w-6 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/35">
                {index + 1}
              </span>
              <span>{question}</span>
            </li>
          ))}
        </ol>
      </section>

      <IntakeGroup heading="Needed before anything sends" sections={both} />
      {warm.length > 0 ? <IntakeGroup heading="Warm circle" sections={warm} /> : null}
      {lists.length > 0 ? (
        <IntakeGroup heading="Waitlist, Stay Close, advance listen" sections={lists} />
      ) : null}
    </div>
  );
}

function IntakeGroup({
  heading,
  sections,
}: {
  heading: string;
  sections: LaunchIntakeSection[];
}) {
  const headingId = heading.toLowerCase().replace(/\s+/g, '-');
  return (
    <section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="font-sans text-[1.2rem] font-semibold tracking-tight text-cream"
      >
        {heading}
      </h2>
      <div className="mt-5 divide-y divide-cream/10 border-y border-cream/12">
        {sections.map((section) => (
          <article key={section.id} className="py-6">
            <h3 className="font-sans text-[0.9375rem] text-cream">{section.title}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {section.questions.map((question) => (
                <li
                  key={question}
                  className="text-[0.875rem] leading-relaxed text-cream/70"
                >
                  {question}
                </li>
              ))}
            </ul>
            {section.placeholders && section.placeholders.length > 0 ? (
              <p className="mt-3 font-mono text-[11px] leading-relaxed text-cream/40">
                Fills {section.placeholders.join(', ')}
              </p>
            ) : null}
            {section.note ? (
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-cream/50">
                {section.note}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
