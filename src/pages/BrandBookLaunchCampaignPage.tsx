import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';

import { BrandShell } from '@/components/app-sidebar';
import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  LAUNCH_CHANNELS,
  LAUNCH_CHANNEL_IDS,
  LAUNCH_INTAKE,
  LAUNCH_QUICK_QUESTIONS,
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
  type LaunchPiece,
  type LaunchView,
} from '@/data/bookLaunchCampaign';

const TAB_CLASS =
  'inline-flex h-11 items-center rounded-full border px-3.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors';

function setFiltersInUrl(filters: LaunchDeskFilters) {
  window.history.replaceState({}, '', launchDeskHref(filters));
}

function defaultPiece(filters: LaunchDeskFilters): LaunchPiece | null {
  const selected = findLaunchPiece(filters.piece);
  if (selected) {
    if (filters.campaign === 'all' || filters.campaign === 'intake') {
      return selected;
    }
    if (selected.channel === filters.campaign) return selected;
  }

  if (filters.campaign === 'intake') return null;
  const visible = piecesForView(filters.campaign);
  return visible[0] ?? null;
}

export default function BrandBookLaunchCampaignPage() {
  const reduceMotion = usePrefersReducedMotion();
  const [filters, setFilters] = useState<LaunchDeskFilters>(() =>
    launchFiltersFromSearch(window.location.search),
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [subjectIndex, setSubjectIndex] = useState(0);

  const summary = useMemo(() => summarizeLaunchCampaign(), []);
  const selected = defaultPiece(filters);
  const timelinePieces = piecesForView(
    filters.campaign === 'intake' ? 'all' : filters.campaign,
  );
  const phases = phasesUsedBy(timelinePieces);
  const showTimeline = filters.campaign !== 'intake';
  const showMatrix = filters.campaign === 'all';

  function update(next: Partial<LaunchDeskFilters>) {
    setFilters((current) => {
      const merged: LaunchDeskFilters = { ...current, ...next };
      if (next.campaign && next.campaign !== current.campaign && next.piece === undefined) {
        const first = piecesForView(next.campaign)[0];
        merged.piece = next.campaign === 'intake' ? null : first?.id ?? null;
      }
      setFiltersInUrl(merged);
      return merged;
    });
    setSubjectIndex(0);
  }

  function selectPiece(piece: LaunchPiece, campaign: LaunchView) {
    update({ piece: piece.id, campaign });
    window.requestAnimationFrame(() => {
      document.getElementById('launch-piece-heading')?.scrollIntoView({
        block: 'start',
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    });
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
            title="Book launch campaign"
            description="Warm network, professional list, and LinkedIn, lined up on the same launch calendar."
          />

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

          {filters.campaign === 'intake' ? <IntakeDesk /> : null}

          {selected && showTimeline ? (
            <PieceDetail
              piece={selected}
              subjectIndex={subjectIndex}
              copiedKey={copiedKey}
              onSubjectIndex={setSubjectIndex}
              onCopy={copyText}
            />
          ) : null}
        </div>
      </BrandPageBody>
    </BrandShell>
  );
}

function summaryLine(
  campaign: LaunchView,
  summary: ReturnType<typeof summarizeLaunchCampaign>,
): string {
  switch (campaign) {
    case 'all':
      return `${summary.emails} emails and ${summary.posts} LinkedIn posts across three tracks.`;
    case 'warm':
      return `${summary.byChannel.warm} emails for people who know the author personally.`;
    case 'professional':
      return `${summary.byChannel.professional} emails for the broader professional list.`;
    case 'linkedin':
      return `${summary.byChannel.linkedin} posts for the personal LinkedIn profile.`;
    case 'intake':
      return 'Questions to fill the placeholders.';
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
    { id: 'all', label: 'Timeline' },
    { id: 'warm', label: 'Warm', count: summary.byChannel.warm },
    {
      id: 'professional',
      label: 'Professional',
      count: summary.byChannel.professional,
    },
    { id: 'linkedin', label: 'LinkedIn', count: summary.byChannel.linkedin },
    { id: 'intake', label: 'Intake' },
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
  phases: ReturnType<typeof phasesUsedBy>;
  selectedId: string | null;
  onSelect: (piece: LaunchPiece) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[44rem] border-collapse text-left">
        <caption className="sr-only">
          Emails and posts grouped by send window and campaign
        </caption>
        <thead>
          <tr className="border-b border-cream/12">
            <th className="w-[9.5rem] py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
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
                <th className="py-3.5 pr-4 font-sans text-[12px] font-normal leading-snug text-cream/55">
                  {phase.label}
                </th>
                {LAUNCH_CHANNEL_IDS.map((channel) => {
                  const cell = row.filter((piece) => piece.channel === channel);
                  return (
                    <td key={channel} className="py-3 pr-4">
                      {cell.length === 0 ? (
                        <span className="text-[12px] text-cream/20">—</span>
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
        className="font-serif text-[1.35rem] italic leading-tight tracking-[-0.02em] text-cream"
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
      <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-cream/40">
        {pieceShortLabel(piece)}
      </span>
      <span className="mt-0.5 block text-[12px] leading-snug">{piece.title}</span>
    </button>
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
  const channel = LAUNCH_CHANNELS[piece.channel];
  const copyKey = `${piece.id}:${subjectIndex}`;
  const subjectsKey = `${piece.id}:subjects`;
  const safeSubjectIndex =
    piece.subjects.length === 0
      ? 0
      : Math.min(subjectIndex, piece.subjects.length - 1);

  return (
    <article
      className="scroll-mt-24 border-t border-cream/12 pt-7"
      aria-labelledby="launch-piece-heading"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9fb5aa]/70">
        {channel.title} · {pieceKindLabel(piece.kind)} {piece.number}
      </p>
      <h2
        id="launch-piece-heading"
        className="mt-2 font-serif text-[1.6rem] italic leading-[1.08] tracking-[-0.02em] text-cream md:text-[1.85rem]"
      >
        {piece.title}
      </h2>
      <p className="mt-2 text-[0.8125rem] text-cream/55">{piece.send}</p>

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

function IntakeDesk() {
  const both = LAUNCH_INTAKE.filter((section) => section.channel === 'both');
  const warm = LAUNCH_INTAKE.filter((section) => section.channel === 'warm');
  const professional = LAUNCH_INTAKE.filter(
    (section) => section.channel === 'professional',
  );

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="quick-intake-heading">
        <h2
          id="quick-intake-heading"
          className="font-serif text-[1.35rem] italic leading-tight tracking-[-0.02em] text-cream"
        >
          Quick author questions
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

      <IntakeGroup
        heading="Needed for both campaigns"
        sections={both}
      />
      <IntakeGroup heading="Warm network only" sections={warm} />
      <IntakeGroup heading="Professional list only" sections={professional} />
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
        className="font-serif text-[1.35rem] italic leading-tight tracking-[-0.02em] text-cream"
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
