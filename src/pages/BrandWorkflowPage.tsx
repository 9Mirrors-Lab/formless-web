import { useCallback, useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';

import { BrandShell } from '@/components/app-sidebar';
import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import {
  GITHUB_ISSUES_URL,
  GITHUB_RELEASES_URL,
  GITHUB_REPO_URL,
  SHIP_CHEAT_SHEET,
  SHIP_DECISION,
  SHIP_LABELS,
  SHIP_LANES,
  SHIP_MILESTONES,
  SHIP_RELEASES,
  type ShipLane,
  type ShipLabel,
} from '@/data/shipFlow';

const CHIP =
  'inline-flex items-center rounded-full border border-cream/15 bg-cream/[0.04] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/70';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-cream/15 px-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/65 transition-colors hover:border-cream/30 hover:text-cream"
      aria-label={copied ? 'Copied' : 'Copy command'}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function LaneCard({ lane }: { lane: ShipLane }) {
  return (
    <article className="flex min-h-0 flex-col gap-3 rounded-2xl border border-cream/10 bg-cream/[0.03] p-4 md:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/45">
          Lane {lane.number}
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9fb5aa]/80">
          {lane.short}
        </p>
      </div>
      <h3 className="font-sans text-lg font-semibold tracking-[-0.02em] text-cream">
        {lane.title}
      </h3>
      <p className="text-sm leading-snug text-cream/55">{lane.when}</p>
      <ol className="mt-1 space-y-1.5 border-t border-cream/10 pt-3">
        {lane.steps.map((step, index) => (
          <li key={step} className="flex gap-2 text-sm leading-snug text-cream/75">
            <span className="font-mono text-[10px] text-cream/35">{index + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-auto rounded-xl border border-cream/10 bg-black/20 px-3 py-2.5">
        <p className="mb-1 font-mono text-[8px] uppercase tracking-[0.16em] text-cream/40">
          Real example
        </p>
        <p className="font-mono text-[11px] leading-snug text-[#9fb5aa]">
          <span className="text-cream/35">{lane.example.sha}</span>{' '}
          {lane.example.message}
        </p>
      </div>
    </article>
  );
}

function LaneDiagram() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-cream/10 bg-cream/[0.02] p-4 md:p-6">
      <svg
        viewBox="0 0 920 280"
        role="img"
        aria-label="Three ship lanes from idea to production deploy and release"
        className="mx-auto h-auto w-full min-w-[640px] max-w-5xl"
      >
        <defs>
          <marker
            id="ship-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(250,245,235,0.45)" />
          </marker>
        </defs>

        <text
          x="20"
          y="28"
          fill="rgba(250,245,235,0.45)"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          letterSpacing="2"
        >
          IDEA
        </text>
        <rect
          x="20"
          y="40"
          width="110"
          height="44"
          rx="10"
          fill="rgba(250,245,235,0.06)"
          stroke="rgba(250,245,235,0.18)"
        />
        <text
          x="75"
          y="67"
          textAnchor="middle"
          fill="rgba(250,245,235,0.85)"
          fontFamily="system-ui, sans-serif"
          fontSize="13"
          fontWeight="600"
        >
          Something to do
        </text>

        <line
          x1="130"
          y1="62"
          x2="168"
          y2="62"
          stroke="rgba(250,245,235,0.35)"
          strokeWidth="1.5"
          markerEnd="url(#ship-arrow)"
        />

        <rect
          x="170"
          y="28"
          width="200"
          height="68"
          rx="12"
          fill="rgba(159,181,170,0.08)"
          stroke="rgba(159,181,170,0.4)"
        />
        <text
          x="270"
          y="52"
          textAnchor="middle"
          fill="rgba(159,181,170,0.9)"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          letterSpacing="1.5"
        >
          RISKY?
        </text>
        <text
          x="270"
          y="72"
          textAnchor="middle"
          fill="rgba(250,245,235,0.55)"
          fontFamily="system-ui, sans-serif"
          fontSize="11"
        >
          auth · schema · live redesign
        </text>

        {/* Yes → Lane 3 */}
        <path
          d="M 370 48 L 420 48 L 420 210 L 450 210"
          fill="none"
          stroke="rgba(250,245,235,0.3)"
          strokeWidth="1.5"
          markerEnd="url(#ship-arrow)"
        />
        <text
          x="388"
          y="40"
          fill="rgba(250,245,235,0.5)"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
        >
          yes
        </text>

        {/* No → Q2 */}
        <line
          x1="270"
          y1="96"
          x2="270"
          y2="128"
          stroke="rgba(250,245,235,0.3)"
          strokeWidth="1.5"
          markerEnd="url(#ship-arrow)"
        />
        <text
          x="278"
          y="116"
          fill="rgba(250,245,235,0.5)"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
        >
          no
        </text>

        <rect
          x="170"
          y="132"
          width="200"
          height="56"
          rx="12"
          fill="rgba(196,165,116,0.08)"
          stroke="rgba(196,165,116,0.4)"
        />
        <text
          x="270"
          y="155"
          textAnchor="middle"
          fill="rgba(196,165,116,0.95)"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          letterSpacing="1.5"
        >
          CARE NEXT WEEK?
        </text>
        <text
          x="270"
          y="173"
          textAnchor="middle"
          fill="rgba(250,245,235,0.55)"
          fontFamily="system-ui, sans-serif"
          fontSize="11"
        >
          track it, or just ship
        </text>

        {/* yes → Lane 2 */}
        <path
          d="M 370 150 L 450 150"
          fill="none"
          stroke="rgba(250,245,235,0.3)"
          strokeWidth="1.5"
          markerEnd="url(#ship-arrow)"
        />
        <text
          x="400"
          y="142"
          fill="rgba(250,245,235,0.5)"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
        >
          yes
        </text>

        {/* no → Lane 1 */}
        <path
          d="M 270 188 L 270 230 L 450 230"
          fill="none"
          stroke="rgba(250,245,235,0.3)"
          strokeWidth="1.5"
          markerEnd="url(#ship-arrow)"
        />
        <text
          x="278"
          y="210"
          fill="rgba(250,245,235,0.5)"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
        >
          no
        </text>

        {/* Lane boxes */}
        <rect
          x="455"
          y="128"
          width="200"
          height="44"
          rx="10"
          fill="rgba(125,154,106,0.12)"
          stroke="rgba(125,154,106,0.45)"
        />
        <text
          x="555"
          y="155"
          textAnchor="middle"
          fill="rgba(250,245,235,0.9)"
          fontFamily="system-ui, sans-serif"
          fontSize="13"
          fontWeight="600"
        >
          Lane 2 · Tracked issue
        </text>

        <rect
          x="455"
          y="208"
          width="200"
          height="44"
          rx="10"
          fill="rgba(250,245,235,0.06)"
          stroke="rgba(250,245,235,0.22)"
        />
        <text
          x="555"
          y="235"
          textAnchor="middle"
          fill="rgba(250,245,235,0.9)"
          fontFamily="system-ui, sans-serif"
          fontSize="13"
          fontWeight="600"
        >
          Lane 1 · Main push
        </text>

        <rect
          x="455"
          y="48"
          width="200"
          height="44"
          rx="10"
          fill="rgba(122,143,196,0.12)"
          stroke="rgba(122,143,196,0.45)"
        />
        <text
          x="555"
          y="75"
          textAnchor="middle"
          fill="rgba(250,245,235,0.9)"
          fontFamily="system-ui, sans-serif"
          fontSize="13"
          fontWeight="600"
        >
          Lane 3 · Branch + PR
        </text>

        {/* Merge to deploy */}
        <path
          d="M 655 70 L 700 70 L 700 150"
          fill="none"
          stroke="rgba(250,245,235,0.28)"
          strokeWidth="1.5"
        />
        <path
          d="M 655 150 L 700 150"
          fill="none"
          stroke="rgba(250,245,235,0.28)"
          strokeWidth="1.5"
        />
        <path
          d="M 655 230 L 700 230 L 700 150"
          fill="none"
          stroke="rgba(250,245,235,0.28)"
          strokeWidth="1.5"
        />
        <line
          x1="700"
          y1="150"
          x2="738"
          y2="150"
          stroke="rgba(250,245,235,0.35)"
          strokeWidth="1.5"
          markerEnd="url(#ship-arrow)"
        />

        <rect
          x="740"
          y="108"
          width="160"
          height="40"
          rx="10"
          fill="rgba(250,245,235,0.06)"
          stroke="rgba(250,245,235,0.22)"
        />
        <text
          x="820"
          y="133"
          textAnchor="middle"
          fill="rgba(250,245,235,0.9)"
          fontFamily="system-ui, sans-serif"
          fontSize="13"
          fontWeight="600"
        >
          Vercel production
        </text>

        <line
          x1="820"
          y1="148"
          x2="820"
          y2="188"
          stroke="rgba(250,245,235,0.3)"
          strokeWidth="1.5"
          markerEnd="url(#ship-arrow)"
        />

        <rect
          x="740"
          y="192"
          width="160"
          height="48"
          rx="10"
          fill="rgba(196,165,116,0.1)"
          stroke="rgba(196,165,116,0.4)"
        />
        <text
          x="820"
          y="212"
          textAnchor="middle"
          fill="rgba(196,165,116,0.95)"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          letterSpacing="1"
        >
          DRAFT NOTES
        </text>
        <text
          x="820"
          y="228"
          textAnchor="middle"
          fill="rgba(250,245,235,0.55)"
          fontFamily="system-ui, sans-serif"
          fontSize="11"
        >
          publish on milestone
        </text>
      </svg>
    </div>
  );
}

function DecisionCard() {
  return (
    <section className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-4 md:p-6">
      <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.18em] text-cream/45">
        Which lane?
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-cream/10 bg-black/15 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9fb5aa]">
            Question 1
          </p>
          <p className="mt-2 text-sm leading-snug text-cream/85">
            {SHIP_DECISION.q1.prompt}
          </p>
          <p className="mt-3 text-xs text-cream/50">
            <span className="font-mono text-cream/35">yes →</span> {SHIP_DECISION.q1.yes}
          </p>
          <p className="mt-1 text-xs text-cream/50">
            <span className="font-mono text-cream/35">no →</span> {SHIP_DECISION.q1.no}
          </p>
        </div>
        <div className="rounded-xl border border-cream/10 bg-black/15 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#c4a574]">
            Question 2
          </p>
          <p className="mt-2 text-sm leading-snug text-cream/85">
            {SHIP_DECISION.q2.prompt}
          </p>
          <p className="mt-3 text-xs text-cream/50">
            <span className="font-mono text-cream/35">yes →</span> {SHIP_DECISION.q2.yes}
          </p>
          <p className="mt-1 text-xs text-cream/50">
            <span className="font-mono text-cream/35">no →</span> {SHIP_DECISION.q2.no}
          </p>
        </div>
        <div className="rounded-xl border border-cream/10 bg-black/15 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#c4a574]">
            After deploy
          </p>
          <p className="mt-2 text-sm leading-snug text-cream/85">
            {SHIP_DECISION.release.prompt}
          </p>
          <p className="mt-3 text-xs text-cream/50">
            <span className="font-mono text-cream/35">yes →</span> {SHIP_DECISION.release.yes}
          </p>
          <p className="mt-1 text-xs text-cream/50">
            <span className="font-mono text-cream/35">not yet →</span>{' '}
            {SHIP_DECISION.release.no}
          </p>
        </div>
      </div>
    </section>
  );
}

function ReleaseTimeline() {
  return (
    <section className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/45">
            Releases
          </p>
          <h2 className="mt-1 font-sans text-xl font-semibold tracking-[-0.02em] text-cream">
            Milestone ledger
          </h2>
        </div>
        <a
          href={GITHUB_RELEASES_URL}
          target="_blank"
          rel="noreferrer"
          className={`${CHIP} gap-1.5 hover:border-cream/30 hover:text-cream`}
        >
          Open on GitHub
          <ExternalLink className="size-3" />
        </a>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 right-0 top-[18px] hidden h-px bg-cream/15 md:block" />
        <ol className="grid gap-4 md:grid-cols-5">
          {SHIP_RELEASES.map((release) => {
            const isNext = release.status === 'next';
            return (
              <li key={release.tag} className="relative flex flex-col gap-2">
                <div
                  className={`relative z-10 size-3.5 rounded-full border-2 ${
                    isNext
                      ? 'border-dashed border-[#c4a574] bg-transparent'
                      : 'border-[#9fb5aa] bg-[#9fb5aa]'
                  }`}
                />
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream/40">
                  {release.when}
                </p>
                <p className="font-sans text-sm font-semibold leading-snug text-cream">
                  {release.title}
                </p>
                {!isNext ? (
                  <p className="font-mono text-[10px] text-[#9fb5aa]/80">{release.tag}</p>
                ) : null}
                <p className="text-xs leading-snug text-cream/50">{release.note}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function LabelChip({ label }: { label: ShipLabel }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-cream/12 bg-cream/[0.04] px-3 py-1.5"
      title={label.meaning}
    >
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: label.color }}
        aria-hidden
      />
      <span className="font-mono text-[10px] text-cream/85">{label.name}</span>
      <span className="text-[11px] text-cream/45">{label.meaning}</span>
    </span>
  );
}

function Legend() {
  const surfaces = SHIP_LABELS.filter((label) => label.kind === 'surface');
  const kinds = SHIP_LABELS.filter((label) => label.kind === 'kind');

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-4 md:p-5">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-cream/45">
          Labels
        </p>
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-xs text-cream/50">Surface</p>
            <div className="flex flex-wrap gap-2">
              {surfaces.map((label) => (
                <LabelChip key={label.name} label={label} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-cream/50">Kind</p>
            <div className="flex flex-wrap gap-2">
              {kinds.map((label) => (
                <LabelChip key={label.name} label={label} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-4 md:p-5">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-cream/45">
          Milestones
        </p>
        <ul className="space-y-2.5">
          {SHIP_MILESTONES.map((milestone) => (
            <li
              key={milestone.title}
              className="flex flex-col gap-0.5 rounded-xl border border-cream/10 bg-black/15 px-3 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <span className="font-sans text-sm font-semibold text-cream">
                {milestone.title}
              </span>
              <span className="text-xs text-cream/50">{milestone.meaning}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CheatSheet() {
  return (
    <section className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/45">
            Cheat sheet
          </p>
          <h2 className="mt-1 font-sans text-xl font-semibold tracking-[-0.02em] text-cream">
            Copyable commands
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={GITHUB_ISSUES_URL}
            target="_blank"
            rel="noreferrer"
            className={`${CHIP} gap-1.5 hover:border-cream/30 hover:text-cream`}
          >
            Issues
            <ExternalLink className="size-3" />
          </a>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className={`${CHIP} gap-1.5 hover:border-cream/30 hover:text-cream`}
          >
            Repo
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      <ul className="space-y-3">
        {SHIP_CHEAT_SHEET.map((entry) => (
          <li
            key={`${entry.lane}-${entry.label}`}
            className="flex flex-col gap-2 rounded-xl border border-cream/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/40">
                {entry.label}
              </p>
              <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-[#9fb5aa]/90">
                {entry.command}
              </pre>
            </div>
            <CopyButton text={entry.command} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function BrandWorkflowPage() {
  return (
    <BrandShell activeId="workflow">
      <BrandPageBody>
        <BrandPageHeader
          tone="desk"
          eyebrow="Materials"
          title="Ship flow"
          description="Solo-scale GitHub lanes for formless-web. Everyday pushes stay on main. Issues hold memory. Releases mark milestones."
          actions={
            <a
              href={GITHUB_RELEASES_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-cream/20 px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/75 transition-colors hover:border-cream/35 hover:text-cream"
            >
              Releases
              <ExternalLink className="size-3.5" />
            </a>
          }
        />

        <LaneDiagram />

        <div className="grid gap-4 lg:grid-cols-3">
          {SHIP_LANES.map((lane) => (
            <LaneCard key={lane.id} lane={lane} />
          ))}
        </div>

        <DecisionCard />
        <ReleaseTimeline />
        <Legend />
        <CheatSheet />
      </BrandPageBody>
    </BrandShell>
  );
}
