/**
 * Book vs audio — printed ARC text (left) vs timed audio script (right).
 * Live word-level diff; normalized matching.
 */
import { Check, ChevronDown, ChevronUp, Flag, Speech } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

import { BrandPageHeader } from '@/components/BrandPageHeader';
import { BrandShell } from '@/components/app-sidebar';
import {
  AUDIO_CHAPTER_TITLE_BY_ID,
  AUDIO_LISTEN_ORDER,
  formatChapterIndex,
  type AudioChapterId,
} from '@/data/audioBook';
import {
  ARC_MANUSCRIPT_SOURCE,
  arcManuscriptForChapter,
} from '@/data/arcManuscriptChapters';
import {
  manuscriptForChapter,
  type AudioScriptWhisperModel,
} from '@/data/audioManuscripts';
import { manuscriptForChapterMedium } from '@/data/audioManuscriptsMedium';
import { useScriptDiffReview } from '@/hooks/useScriptDiffReview';
import {
  aggregateReviewCounts,
  differenceFingerprints,
  filterDifferenceIds,
  reviewCounts,
  statusForFingerprint,
  type DiffReviewCounts,
  type DiffReviewFilter,
  type DiffReviewStatus,
} from '@/lib/scriptDiffReview';
import {
  aggregateDiffStats,
  diffManuscriptTexts,
  scriptTextFromCues,
  type DiffChunk,
  type DiffKind,
  type DiffStats,
  type WordToken,
} from '@/lib/scriptWordDiff';

const SCRIPT_MODEL_LABEL: Record<AudioScriptWhisperModel, string> = {
  base: 'Whisper base.en (original)',
  medium: 'Whisper medium.en (new)',
};

const LABEL =
  'font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#9fb5aa]';

const KIND_STYLE: Record<
  DiffKind,
  { left: string; right: string; label: string }
> = {
  equal: {
    left: 'text-cream/70',
    right: 'text-cream/70',
    label: 'Same in both',
  },
  delete: {
    left: 'rounded-sm bg-[#c45c4a]/35 text-cream ring-1 ring-[#c45c4a]/50',
    right: '',
    label: 'In the book, missing from audio',
  },
  insert: {
    left: '',
    right: 'rounded-sm bg-[#3d7a6a]/40 text-cream ring-1 ring-[#3d7a6a]/55',
    label: 'In the audio, not in the book',
  },
  replace: {
    left: 'rounded-sm bg-[#c4a04a]/30 text-cream ring-1 ring-[#c4a04a]/45',
    right: 'rounded-sm bg-[#c4a04a]/30 text-cream ring-1 ring-[#c4a04a]/45',
    label: 'Different wording',
  },
};

const FILTER_OPTIONS: Array<{ id: DiffReviewFilter; label: string }> = [
  { id: 'open', label: 'Open' },
  { id: 'needs-update', label: 'Needs update' },
  { id: 'as-spoken', label: 'As spoken' },
  { id: 'cleared', label: 'Cleared' },
  { id: 'all', label: 'All' },
];

const TOOL_BUTTON =
  'inline-flex h-10 items-center gap-1.5 border px-3 font-sans text-xs uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70 disabled:opacity-40';

function tokenExcerpt(tokens: WordToken[], max = 14): string {
  if (tokens.length === 0) return '—';
  const words = tokens.map((token) => token.display);
  if (words.length <= max) return words.join(' ');
  return `${words.slice(0, max).join(' ')}…`;
}

function highlightClass(
  chunk: DiffChunk,
  side: 'left' | 'right',
  reviewStatus: DiffReviewStatus | null,
): string {
  const style = KIND_STYLE[chunk.kind];
  const base = side === 'left' ? style.left : style.right;
  if (reviewStatus == null) return base;
  switch (reviewStatus) {
    case 'cleared':
      return 'rounded-sm bg-cream/[0.04] text-cream/35 ring-1 ring-cream/10';
    case 'as-spoken':
      return 'rounded-sm bg-[#9fb5aa]/18 text-cream/55 ring-1 ring-[#9fb5aa]/40';
    case 'needs-update':
      return `${base} ring-1 ring-cream/45`;
    default: {
      const _exhaustive: never = reviewStatus;
      return _exhaustive;
    }
  }
}

function chapterFromSearch(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
): AudioChapterId {
  const raw = new URLSearchParams(search).get('chapter');
  const id = raw == null ? NaN : Number(raw);
  if ((AUDIO_LISTEN_ORDER as readonly number[]).includes(id)) {
    return id as AudioChapterId;
  }
  return 2;
}

function modelFromSearch(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
): AudioScriptWhisperModel {
  const raw = new URLSearchParams(search).get('model');
  return raw === 'medium' ? 'medium' : 'base';
}

function setCompareInUrl(
  chapterId: AudioChapterId,
  model: AudioScriptWhisperModel,
): void {
  const url = new URL(window.location.href);
  url.searchParams.set('chapter', String(chapterId));
  if (model === 'base') {
    url.searchParams.delete('model');
  } else {
    url.searchParams.set('model', model);
  }
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

function cuesForModel(
  chapterId: AudioChapterId,
  model: AudioScriptWhisperModel,
) {
  switch (model) {
    case 'base':
      return manuscriptForChapter(chapterId);
    case 'medium':
      return manuscriptForChapterMedium(chapterId);
    default: {
      const _exhaustive: never = model;
      return _exhaustive;
    }
  }
}

/** Diff/sync marker nearest the vertical center of a scroll pane. */
function nearestSyncId(root: HTMLElement): string | null {
  const rootRect = root.getBoundingClientRect();
  const centerY = rootRect.top + rootRect.height / 2;
  const anchors = root.querySelectorAll<HTMLElement>(
    '[data-sync-id], [data-diff-id]',
  );
  let bestId: string | null = null;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const el of anchors) {
    const rect = el.getBoundingClientRect();
    if (rect.bottom < rootRect.top || rect.top > rootRect.bottom) continue;
    const mid = rect.top + rect.height / 2;
    const dist = Math.abs(mid - centerY);
    if (dist < bestDist) {
      bestDist = dist;
      bestId = el.dataset.syncId ?? el.dataset.diffId ?? null;
    }
  }
  return bestId;
}

function scrollPaneToSyncId(
  root: HTMLElement,
  syncId: string,
  behavior: ScrollBehavior = 'smooth',
): boolean {
  const el =
    root.querySelector<HTMLElement>(`[data-sync-id="${syncId}"]`) ??
    root.querySelector<HTMLElement>(`[data-diff-id="${syncId}"]`);
  if (!el) return false;
  const rootRect = root.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const delta =
    elRect.top - rootRect.top - rootRect.height / 2 + elRect.height / 2;
  root.scrollTo({ top: root.scrollTop + delta, behavior });
  return true;
}

/** Scroll one pane so the shared diff anchor sits near vertical center. */
function scrollPaneToDiffId(
  root: HTMLElement,
  id: number,
  behavior: ScrollBehavior = 'smooth',
): boolean {
  return scrollPaneToSyncId(root, String(id), behavior);
}

const EQUAL_SYNC_GROUP = 20;

function renderTokenBody(
  tokens: DiffChunk['left'],
  chunkId: number,
  side: 'left' | 'right',
) {
  return tokens.map((token, index) => {
    const breakText =
      token.breakAfter === 'paragraph'
        ? '\n\n'
        : token.breakAfter === 'line'
          ? '\n'
          : index < tokens.length - 1
            ? ' '
            : '';
    return (
      <span key={`${chunkId}-${side}-${index}`}>
        {token.display}
        {breakText}
      </span>
    );
  });
}

function DiffAnchor({
  chunkId,
  side,
  active,
}: {
  chunkId: number;
  side: 'left' | 'right';
  active: boolean;
}) {
  return (
    <span
      data-diff-id={chunkId}
      data-sync-id={String(chunkId)}
      data-diff-side={side}
      data-diff-anchor="empty"
      aria-hidden
      className={`inline-block h-[1.1em] w-0 align-baseline ${
        active ? 'shadow-[0_0_0_2px_rgba(245,240,232,0.55)]' : ''
      }`}
    />
  );
}

function WordRun({
  chunk,
  side,
  active,
  reviewStatus,
  onSelect,
}: {
  chunk: DiffChunk;
  side: 'left' | 'right';
  active: boolean;
  reviewStatus: DiffReviewStatus | null;
  onSelect: (id: number) => void;
}) {
  const tokens = side === 'left' ? chunk.left : chunk.right;
  // Keep a shared anchor on the empty side of insert/delete so both panes can jump.
  if (tokens.length === 0) {
    return <DiffAnchor chunkId={chunk.id} side={side} active={active} />;
  }

  const className = highlightClass(chunk, side, reviewStatus);
  const interactive = chunk.kind !== 'equal';

  const trailingSpace =
    tokens.length > 0 && !tokens[tokens.length - 1]?.breakAfter ? ' ' : null;

  if (!interactive) {
    // Split long equal runs so scroll lock-step can track within a paragraph.
    const groups: ReactNode[] = [];
    for (let start = 0; start < tokens.length; start += EQUAL_SYNC_GROUP) {
      const slice = tokens.slice(start, start + EQUAL_SYNC_GROUP);
      const syncId = `${chunk.id}:${start}`;
      groups.push(
        <span
          key={syncId}
          data-diff-id={chunk.id}
          data-sync-id={syncId}
          data-diff-side={side}
          className={KIND_STYLE[chunk.kind][side]}
        >
          {renderTokenBody(slice, chunk.id, side)}
          {start + EQUAL_SYNC_GROUP < tokens.length ? ' ' : null}
        </span>,
      );
    }
    return (
      <>
        {groups}
        {trailingSpace}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        data-diff-id={chunk.id}
        data-sync-id={String(chunk.id)}
        data-diff-side={side}
        data-review-status={reviewStatus ?? 'open'}
        onClick={() => onSelect(chunk.id)}
        className={`mx-0.5 inline px-0.5 text-left transition-[box-shadow] ${className} ${
          active ? 'shadow-[0_0_0_2px_rgba(245,240,232,0.55)]' : ''
        }`}
      >
        {renderTokenBody(tokens, chunk.id, side)}
      </button>
      {trailingSpace}
    </>
  );
}

function DiffPane({
  title,
  subtitle,
  chunks,
  side,
  activeId,
  statusFor,
  onSelect,
  onScroll,
  scrollRef,
}: {
  title: string;
  subtitle: string;
  chunks: DiffChunk[];
  side: 'left' | 'right';
  activeId: number | null;
  statusFor: (id: number) => DiffReviewStatus | null;
  onSelect: (id: number) => void;
  onScroll: (side: 'left' | 'right') => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col border border-cream/12 bg-[#0c100e]">
      <header className="shrink-0 border-b border-cream/10 px-4 py-3">
        <p className={LABEL}>{title}</p>
        <p className="mt-1 font-sans text-xs text-cream/45">{subtitle}</p>
      </header>
      <div
        ref={scrollRef}
        onScroll={() => onScroll(side)}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4 font-serif text-[0.95rem] leading-[1.75] tracking-[0.01em] text-cream md:text-[1.02rem]"
      >
        <div className="whitespace-pre-wrap">
          {chunks.map((chunk) => (
            <WordRun
              key={`${side}-${chunk.id}`}
              chunk={chunk}
              side={side}
              active={activeId === chunk.id}
              reviewStatus={statusFor(chunk.id)}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function formatCount(value: number): string {
  return value.toLocaleString('en-US');
}

const TICK: Record<'delete' | 'insert' | 'replace', string> = {
  delete: 'bg-[#c45c4a]/80',
  insert: 'bg-[#3d7a6a]/85',
  replace: 'bg-[#c4a04a]/80',
};

function DualMetric({
  label,
  bookValue,
  trackValue,
  tick,
  bookHint,
  trackHint,
  folio,
}: {
  label: string;
  bookValue: string;
  trackValue: string;
  tick?: keyof typeof TICK;
  bookHint?: string;
  trackHint?: string;
  folio?: string;
}) {
  return (
    <div className="min-w-0">
      <p className={`${LABEL} flex items-center gap-1.5`}>
        {tick ? (
          <span className={`inline-block h-1.5 w-1.5 ${TICK[tick]}`} aria-hidden />
        ) : null}
        {label}
      </p>
      <p className="mt-1.5 font-mono text-[1.7rem] leading-none tracking-tight text-cream tabular-nums">
        {bookValue}
      </p>
      <p className="mt-1.5 h-4 font-sans text-[0.7rem] text-cream/40">
        {bookHint ?? ''}
      </p>
      <div className="mt-2.5 border-t border-cream/[0.08] pt-2">
        <p className="flex items-baseline gap-2">
          {folio ? (
            <span className="font-serif text-[1.05rem] italic leading-none text-cream/50">
              {folio}
            </span>
          ) : (
            <span
              className={`inline-block h-1 w-1 shrink-0 ${tick ? TICK[tick] : 'bg-transparent'}`}
              aria-hidden
            />
          )}
          <span className="font-mono text-[0.92rem] leading-none text-cream/70 tabular-nums">
            {trackValue}
          </span>
        </p>
        {trackHint ? (
          <p className="mt-1 font-sans text-[0.65rem] text-cream/35">{trackHint}</p>
        ) : null}
      </div>
    </div>
  );
}

function MetricsBand({
  book,
  track,
  chapterIndex,
  chapterTitle,
  bookCounts,
  trackCounts,
}: {
  book: DiffStats;
  track: DiffStats;
  chapterIndex: string;
  chapterTitle: string;
  bookCounts: DiffReviewCounts;
  trackCounts: DiffReviewCounts;
}) {
  return (
    <div className="flex flex-col gap-4 border border-cream/12 bg-[#0c100e] px-4 py-3 lg:flex-row lg:items-stretch lg:gap-8">
      <div className="min-w-0 flex-[1.45]">
        <div
          className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4"
          title={chapterTitle}
        >
          <DualMetric
            label="Whole book"
            bookValue={`${book.similarityPct}%`}
            bookHint={`${formatCount(book.matchedWords)} same words`}
            folio={chapterIndex}
            trackValue={`${track.similarityPct}%`}
            trackHint={`${formatCount(track.matchedWords)} same · this track`}
          />
          <DualMetric
            label="In book"
            bookValue={formatCount(book.missingFromScript)}
            tick="delete"
            trackValue={formatCount(track.missingFromScript)}
          />
          <DualMetric
            label="In audio"
            bookValue={formatCount(book.onlyInScript)}
            tick="insert"
            trackValue={formatCount(track.onlyInScript)}
          />
          <DualMetric
            label="Wording"
            bookValue={formatCount(book.replacements)}
            tick="replace"
            trackValue={formatCount(track.replacements)}
          />
        </div>
      </div>

      <CheckCluster
        book={bookCounts}
        track={trackCounts}
        chapterIndex={chapterIndex}
      />
    </div>
  );
}

function checkedOf(counts: DiffReviewCounts): number {
  return counts.cleared + counts.asSpoken + counts.needsUpdate;
}

const STATUS_SWATCH = {
  fine: '#f2f0e9',
  spoken: '#9fb5aa',
  update: '#c4a04a',
  open: 'rgb(242 240 233 / 0.42)',
} as const;

const GRAPH_FILL = {
  fine: '#f2f0e9',
  spoken: '#9fb5aa',
  update: '#c4a04a',
  open: '#9fb5aa',
} as const;

type StatusSlice = {
  id: 'fine' | 'spoken' | 'update' | 'open';
  label: string;
  value: number;
  color: string;
};

function statusSlices(book: DiffReviewCounts): StatusSlice[] {
  return [
    { id: 'open', label: 'Open', value: book.open, color: STATUS_SWATCH.open },
    { id: 'fine', label: 'Fine', value: book.cleared, color: STATUS_SWATCH.fine },
    {
      id: 'spoken',
      label: 'Spoken',
      value: book.asSpoken,
      color: STATUS_SWATCH.spoken,
    },
    {
      id: 'update',
      label: 'Update',
      value: book.needsUpdate,
      color: STATUS_SWATCH.update,
    },
  ];
}

function StatusGraph({
  slices,
  total,
  trackSlices,
}: {
  slices: StatusSlice[];
  total: number;
  trackSlices: StatusSlice[];
}) {
  const uid = useId().replace(/:/g, '');
  const glowId = `check-glow-${uid}`;
  const hotGlowId = `check-hot-${uid}`;
  const floorFadeId = `check-floor-${uid}`;
  const areaFillId = `check-area-${uid}`;

  const width = 220;
  const height = 128;
  const plotLeft = 14;
  const plotRight = 206;
  const plotTop = 12;
  const horizon = 82;
  const floorBottom = 126;
  const vpX = 110;
  const vpY = 4;
  const plotHeight = horizon - plotTop;
  const maxValue = Math.max(1, ...slices.map((slice) => slice.value));
  const checked = slices
    .filter((slice) => slice.id !== 'open')
    .reduce((sum, slice) => sum + slice.value, 0);
  const checkedPct = total === 0 ? 0 : checked / total;
  const groupWidth = (plotRight - plotLeft) / slices.length;
  const depthX = 8;
  const depthY = -5;

  const bookBars = slices.map((slice, index) => {
    const groupX = plotLeft + index * groupWidth;
    const barH = (slice.value / maxValue) * (plotHeight - 12);
    const h = slice.value > 0 ? Math.max(barH, 8) : 10;
    const x = groupX + 6;
    const w = 20;
    return {
      ...slice,
      x,
      w,
      h,
      y: horizon - h,
      tipX: x + w / 2 + depthX / 2,
      tipY: horizon - h + depthY,
    };
  });

  const trackLine = trackSlices.map((slice, index) => {
    const groupX = plotLeft + index * groupWidth;
    const barH = (slice.value / maxValue) * (plotHeight - 12);
    const h = Math.max(barH, slice.value > 0 ? 4 : 0);
    return {
      x: groupX + 16,
      y: horizon - h,
    };
  });

  const trailX = plotLeft + 8 + checkedPct * (plotRight - plotLeft - 16);
  const recedeCount = 17;
  const floorBands = 8;
  const linePath = bookBars
    .map((bar, index) => `${index === 0 ? 'M' : 'L'} ${bar.tipX} ${bar.tipY}`)
    .join(' ');
  const areaPath = `${linePath} L ${bookBars[bookBars.length - 1].x + bookBars[bookBars.length - 1].w} ${horizon} L ${bookBars[0].x} ${horizon} Z`;
  const trackPath = trackLine
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-[7.25rem] w-[12rem] shrink-0"
      aria-hidden
    >
      <defs>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={hotGlowId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={floorFadeId} x1="0" y1={horizon} x2="0" y2={floorBottom} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9fb5aa" stopOpacity="0.38" />
          <stop offset="1" stopColor="#9fb5aa" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={areaFillId} x1="0" y1={plotTop} x2="0" y2={horizon} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9fb5aa" stopOpacity="0.5" />
          <stop offset="1" stopColor="#9fb5aa" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {Array.from({ length: 4 }, (_, i) => {
        const y = plotTop + ((i + 1) / 5) * plotHeight;
        return (
          <line
            key={`grid-y-${i}`}
            x1={plotLeft}
            y1={y}
            x2={plotRight}
            y2={y}
            stroke="rgb(159 181 170 / 0.22)"
            strokeWidth={0.7}
            strokeDasharray="2 3"
          />
        );
      })}
      {slices.map((slice, index) => {
        const x = plotLeft + (index + 0.5) * groupWidth;
        return (
          <line
            key={`grid-x-${slice.id}`}
            x1={x}
            y1={plotTop}
            x2={x}
            y2={horizon}
            stroke="rgb(159 181 170 / 0.16)"
            strokeWidth={0.7}
          />
        );
      })}

      <polygon
        points={`${plotLeft},${horizon} ${plotRight},${horizon} ${plotRight - 10},${floorBottom} ${plotLeft + 10},${floorBottom}`}
        fill={`url(#${floorFadeId})`}
      />
      <line
        x1={plotLeft}
        y1={horizon}
        x2={plotRight}
        y2={horizon}
        stroke="#9fb5aa"
        strokeWidth={1.35}
        filter={`url(#${glowId})`}
      />

      {Array.from({ length: recedeCount }, (_, i) => {
        const t = i / (recedeCount - 1);
        const x = plotLeft + 10 + t * (plotRight - plotLeft - 20);
        const dy = vpY - floorBottom;
        const hit = (horizon - floorBottom) / dy;
        const hx = x + (vpX - x) * hit;
        const spine = i === 8;
        return (
          <line
            key={`recede-${i}`}
            x1={x}
            y1={floorBottom}
            x2={hx}
            y2={horizon}
            stroke={spine ? '#9fb5aa' : 'rgb(159 181 170 / 0.55)'}
            strokeWidth={spine ? 1.35 : 0.9}
            filter={spine ? `url(#${glowId})` : undefined}
          />
        );
      })}

      {Array.from({ length: floorBands }, (_, i) => {
        const u = ((i + 1) / (floorBands + 1)) ** 0.68;
        const y = horizon + (floorBottom - horizon) * u;
        const scale = (y - vpY) / (floorBottom - vpY);
        const left = vpX + (plotLeft + 10 - vpX) * scale;
        const right = vpX + (plotRight - 10 - vpX) * scale;
        return (
          <line
            key={`band-${i}`}
            x1={left}
            y1={y}
            x2={right}
            y2={y}
            stroke="rgb(159 181 170 / 0.55)"
            strokeWidth={0.85}
          />
        );
      })}

      <path
        d={`M ${plotLeft} ${plotTop + 8} V ${plotTop} H ${plotLeft + 8}`}
        fill="none"
        stroke="#9fb5aa"
        strokeWidth={1.15}
      />
      <path
        d={`M ${plotRight} ${plotTop + 8} V ${plotTop} H ${plotRight - 8}`}
        fill="none"
        stroke="#9fb5aa"
        strokeWidth={1.15}
      />
      <path
        d={`M ${plotLeft} ${horizon - 8} V ${horizon} H ${plotLeft + 8}`}
        fill="none"
        stroke="#9fb5aa"
        strokeWidth={1.15}
      />
      <path
        d={`M ${plotRight} ${horizon - 8} V ${horizon} H ${plotRight - 8}`}
        fill="none"
        stroke="#9fb5aa"
        strokeWidth={1.15}
      />

      <path d={areaPath} fill={`url(#${areaFillId})`} />

      {bookBars.map((bar) => {
        const color = GRAPH_FILL[bar.id];
        const x2 = bar.x + bar.w;
        const yb = horizon;
        const yt = bar.y;
        const tx = bar.x + depthX;
        const ty = yt + depthY;
        const sx = x2 + depthX;
        const syb = yb + depthY;
        const live = bar.value > 0;
        return (
          <g key={`book-${bar.id}`}>
            <polygon
              points={`${bar.x},${yb} ${tx},${yb + depthY} ${tx + bar.w},${yb + depthY} ${x2},${yb}`}
              fill={color}
              opacity={0.2}
            />
            <polygon
              points={`${x2},${yt} ${sx},${ty} ${sx},${syb} ${x2},${yb}`}
              fill="#080a09"
              stroke={color}
              strokeWidth={1}
              opacity={0.9}
            />
            <polygon
              points={`${bar.x},${yt} ${x2},${yt} ${x2},${yb} ${bar.x},${yb}`}
              fill={live ? color : 'transparent'}
              opacity={live ? 0.42 : 1}
              stroke={color}
              strokeWidth={1.2}
            />
            <polygon
              points={`${bar.x},${yt} ${tx},${ty} ${sx},${ty} ${x2},${yt}`}
              fill={live ? '#f2f0e9' : 'transparent'}
              opacity={live ? 0.35 : 1}
              stroke={color}
              strokeWidth={1.2}
            />
            <path
              d={`M ${bar.x} ${yb} L ${bar.x} ${yt} L ${tx} ${ty} L ${sx} ${ty} L ${sx} ${syb} L ${x2} ${yb}`}
              fill="none"
              stroke={color}
              strokeWidth={live ? 1.45 : 0.9}
              filter={`url(#${hotGlowId})`}
            />
            {live
              ? Array.from({ length: 4 }, (_, i) => {
                  const y = yt + ((i + 1) / 5) * (yb - yt);
                  return (
                    <line
                      key={`${bar.id}-win-${i}`}
                      x1={bar.x + 2}
                      y1={y}
                      x2={x2 - 2}
                      y2={y}
                      stroke="#f2f0e9"
                      strokeWidth={0.6}
                      opacity={0.28}
                    />
                  );
                })
              : null}
          </g>
        );
      })}

      <path
        d={trackPath}
        fill="none"
        stroke="#9fb5aa"
        strokeWidth={1.35}
        strokeLinejoin="miter"
        filter={`url(#${hotGlowId})`}
      />
      <path
        d={linePath}
        fill="none"
        stroke="#f2f0e9"
        strokeWidth={1.45}
        strokeLinejoin="miter"
        filter={`url(#${hotGlowId})`}
      />
      {bookBars.map((bar) => (
        <rect
          key={`node-${bar.id}`}
          x={bar.tipX - 1.6}
          y={bar.tipY - 1.6}
          width={3.2}
          height={3.2}
          fill="#f2f0e9"
          filter={`url(#${glowId})`}
        />
      ))}

      <line
        x1={plotLeft + 8}
        y1={plotTop + 4}
        x2={Math.max(plotLeft + 12, trailX)}
        y2={plotTop + 4}
        stroke="#9fb5aa"
        strokeWidth={1.8}
        filter={`url(#${hotGlowId})`}
      />
      <rect
        x={Math.max(plotLeft + 12, trailX) - 2}
        y={plotTop + 2}
        width={4}
        height={4}
        fill="#f2f0e9"
        filter={`url(#${hotGlowId})`}
      />
    </svg>
  );
}

function CheckCluster({
  book,
  track,
  chapterIndex,
}: {
  book: DiffReviewCounts;
  track: DiffReviewCounts;
  chapterIndex: string;
}) {
  const bookChecked = checkedOf(book);
  const slices = statusSlices(book);
  const trackSlices = statusSlices(track);

  return (
    <div
      className="flex min-w-[24rem] flex-1 gap-4 lg:border-l lg:border-cream/10 lg:pl-6"
      aria-label={
        book.all === 0
          ? 'No differences in the book'
          : `${formatCount(book.all)} differences in the book, ${formatCount(bookChecked)} checked. Fine ${formatCount(book.cleared)}, spoken ${formatCount(book.asSpoken)}, update ${formatCount(book.needsUpdate)}, open ${formatCount(book.open)}. Track ${chapterIndex} has ${formatCount(track.open)} open.`
      }
    >
      <div className="min-w-0 flex-1">
        <p className={LABEL}>Check</p>
        {book.all === 0 ? (
          <p className="mt-1.5 font-sans text-[0.7rem] text-cream/40">
            No differences in the book
          </p>
        ) : (
          <>
            <div className="mt-1.5 flex items-baseline gap-6">
              <p className="font-mono text-[1.7rem] leading-none tracking-tight text-cream tabular-nums">
                {formatCount(book.all)}
                <span className="ml-2 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-cream/40">
                  total
                </span>
              </p>
              <p className="font-mono text-[1.7rem] leading-none tracking-tight text-cream tabular-nums">
                {formatCount(bookChecked)}
                <span className="ml-2 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-cream/40">
                  checked
                </span>
              </p>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {slices.map((slice) => (
                <li
                  key={slice.id}
                  className="flex items-baseline gap-1.5 font-sans text-[0.65rem] uppercase tracking-[0.14em] text-cream/40"
                >
                  <span
                    className="mb-0.5 inline-block h-1.5 w-1.5 shrink-0"
                    style={{ backgroundColor: slice.color }}
                    aria-hidden
                  />
                  <span className="font-mono text-sm tabular-nums text-cream/75">
                    {formatCount(slice.value)}
                  </span>
                  {slice.label}
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-[1.05rem] italic leading-[1.1] text-cream/50">
                {chapterIndex}
              </span>
              <span className="font-sans text-[0.65rem] uppercase tracking-[0.14em] text-cream/35">
                {track.all === 0
                  ? 'No diffs on this track'
                  : `${formatCount(track.open)} open here`}
              </span>
            </p>
          </>
        )}
      </div>
      {book.all > 0 ? (
        <StatusGraph
          slices={slices}
          total={book.all}
          trackSlices={trackSlices}
        />
      ) : null}
    </div>
  );
}

function ReviewBar({
  chunk,
  status,
  onStatus,
}: {
  chunk: DiffChunk;
  status: DiffReviewStatus | null;
  onStatus: (next: DiffReviewStatus) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3 border border-cream/12 bg-[#0c100e] px-4 py-3">
      <div className="min-w-[14rem] flex-1">
        <p className={LABEL}>{KIND_STYLE[chunk.kind].label}</p>
        <p className="mt-1 font-sans text-sm text-cream/80">
          Book: {tokenExcerpt(chunk.left)}
        </p>
        <p className="mt-0.5 font-sans text-sm text-cream/55">
          Audio: {tokenExcerpt(chunk.right)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={status === 'cleared'}
          onClick={() => onStatus('cleared')}
          className={`${TOOL_BUTTON} ${
            status === 'cleared'
              ? 'border-[#9fb5aa]/55 bg-[#9fb5aa]/20 text-cream'
              : 'border-cream/20 text-cream/80 hover:bg-cream/5'
          }`}
        >
          <Check size={14} aria-hidden />
          Looks fine
        </button>
        <button
          type="button"
          aria-pressed={status === 'as-spoken'}
          onClick={() => onStatus('as-spoken')}
          className={`${TOOL_BUTTON} ${
            status === 'as-spoken'
              ? 'border-[#9fb5aa]/55 bg-[#9fb5aa]/20 text-cream'
              : 'border-cream/20 text-cream/80 hover:bg-cream/5'
          }`}
        >
          <Speech size={14} aria-hidden />
          As spoken
        </button>
        <button
          type="button"
          aria-pressed={status === 'needs-update'}
          onClick={() => onStatus('needs-update')}
          className={`${TOOL_BUTTON} ${
            status === 'needs-update'
              ? 'border-[#c4a04a]/55 bg-[#c4a04a]/20 text-cream'
              : 'border-cream/20 text-cream/80 hover:bg-cream/5'
          }`}
        >
          <Flag size={14} aria-hidden />
          Needs update
        </button>
      </div>
      <p className="basis-full font-sans text-xs text-cream/45">
        As spoken is for a different word the author said, like the vs this.
        Needs update is for the audio script, including capitalization.
      </p>
    </div>
  );
}

export default function AudioScriptComparePage() {
  const [chapterId, setChapterId] = useState<AudioChapterId>(() =>
    chapterFromSearch(),
  );
  const [scriptModel, setScriptModel] = useState<AudioScriptWhisperModel>(() =>
    modelFromSearch(),
  );
  const [filter, setFilter] = useState<DiffReviewFilter>('open');
  const [activeId, setActiveId] = useState<number | null>(null);
  const { store, setStatus } = useScriptDiffReview();
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const syncingScrollRef = useRef(false);

  const arcText = useMemo(
    () => arcManuscriptForChapter(chapterId),
    [chapterId],
  );
  const scriptText = useMemo(
    () => scriptTextFromCues(cuesForModel(chapterId, scriptModel)),
    [chapterId, scriptModel],
  );
  const diff = useMemo(
    () => diffManuscriptTexts(arcText, scriptText),
    [arcText, scriptText],
  );

  const bookDiffs = useMemo(
    () =>
      AUDIO_LISTEN_ORDER.map((id) => {
        const result = diffManuscriptTexts(
          arcManuscriptForChapter(id),
          scriptTextFromCues(cuesForModel(id, scriptModel)),
        );
        return {
          chapterId: id,
          stats: result.stats,
          differenceIds: result.differenceIds,
          fingerprints: differenceFingerprints(result.chunks),
        };
      }),
    [scriptModel],
  );
  const bookStats = useMemo(
    () => aggregateDiffStats(bookDiffs.map((part) => part.stats)),
    [bookDiffs],
  );
  const bookCounts = useMemo(
    () =>
      aggregateReviewCounts(
        bookDiffs.map((part) =>
          reviewCounts(part.differenceIds, part.fingerprints, store, {
            chapterId: part.chapterId,
            model: scriptModel,
          }),
        ),
      ),
    [bookDiffs, scriptModel, store],
  );

  const fingerprints = useMemo(
    () => differenceFingerprints(diff.chunks),
    [diff.chunks],
  );
  const reviewScope = useMemo(
    () => ({ chapterId, model: scriptModel }),
    [chapterId, scriptModel],
  );
  const counts = useMemo(
    () =>
      reviewCounts(diff.differenceIds, fingerprints, store, reviewScope),
    [diff.differenceIds, fingerprints, store, reviewScope],
  );
  const filteredIds = useMemo(
    () =>
      filterDifferenceIds(
        diff.differenceIds,
        fingerprints,
        store,
        reviewScope,
        filter,
      ),
    [diff.differenceIds, fingerprints, store, reviewScope, filter],
  );
  const statusFor = useCallback(
    (id: number): DiffReviewStatus | null => {
      const fingerprint = fingerprints.get(id);
      if (!fingerprint) return null;
      return statusForFingerprint(store, {
        ...reviewScope,
        fingerprint,
      });
    },
    [fingerprints, store, reviewScope],
  );
  const activeChunk = useMemo(
    () => diff.chunks.find((chunk) => chunk.id === activeId) ?? null,
    [diff.chunks, activeId],
  );
  const activeStatus =
    activeId == null ? null : statusFor(activeId);
  const filteredIndex =
    activeId == null ? -1 : filteredIds.indexOf(activeId);

  useEffect(() => {
    setCompareInUrl(chapterId, scriptModel);
  }, [chapterId, scriptModel]);

  useEffect(() => {
    setFilter('open');
    const fps = differenceFingerprints(diff.chunks);
    const openIds = filterDifferenceIds(
      diff.differenceIds,
      fps,
      store,
      { chapterId, model: scriptModel },
      'open',
    );
    setActiveId(openIds[0] ?? diff.differenceIds[0] ?? null);
    // Reset focus when the track or Whisper model changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chapterId/scriptModel are the intentional triggers
  }, [chapterId, scriptModel]);

  const scrollToDiff = useCallback((id: number) => {
    setActiveId(id);
    syncingScrollRef.current = true;
    for (const root of [leftScrollRef.current, rightScrollRef.current]) {
      if (!root) continue;
      scrollPaneToDiffId(root, id, 'smooth');
    }
    window.setTimeout(() => {
      syncingScrollRef.current = false;
    }, 450);
  }, []);

  const handlePaneScroll = useCallback((side: 'left' | 'right') => {
    if (syncingScrollRef.current) return;
    const source =
      side === 'left' ? leftScrollRef.current : rightScrollRef.current;
    const target =
      side === 'left' ? rightScrollRef.current : leftScrollRef.current;
    if (!source || !target) return;

    const syncId = nearestSyncId(source);
    if (syncId == null) return;

    syncingScrollRef.current = true;
    scrollPaneToSyncId(target, syncId, 'auto');
    // Release on next frame so programmatic scroll doesn't bounce back.
    requestAnimationFrame(() => {
      syncingScrollRef.current = false;
    });
  }, []);

  const jumpDiff = useCallback(
    (direction: -1 | 1) => {
      const ids = filteredIds;
      if (ids.length === 0) return;
      const current = activeId == null ? -1 : ids.indexOf(activeId);
      let next = current + direction;
      if (current === -1) next = direction === 1 ? 0 : ids.length - 1;
      if (next < 0) next = ids.length - 1;
      if (next >= ids.length) next = 0;
      scrollToDiff(ids[next]!);
    },
    [activeId, filteredIds, scrollToDiff],
  );

  const applyStatus = useCallback(
    (nextStatus: DiffReviewStatus) => {
      if (activeId == null) return;
      const fingerprint = fingerprints.get(activeId);
      if (!fingerprint) return;
      const current = statusForFingerprint(store, {
        ...reviewScope,
        fingerprint,
      });
      const status = current === nextStatus ? null : nextStatus;
      setStatus({ ...reviewScope, fingerprint, status });

      if (filter !== 'open' || status == null) return;

      const ids = diff.differenceIds;
      const start = ids.indexOf(activeId);
      if (start < 0) return;
      for (let i = 1; i < ids.length; i += 1) {
        const id = ids[(start + i) % ids.length];
        if (id == null || id === activeId) continue;
        const otherFingerprint = fingerprints.get(id);
        if (!otherFingerprint) continue;
        const otherStatus = statusForFingerprint(store, {
          ...reviewScope,
          fingerprint: otherFingerprint,
        });
        if (otherStatus == null) {
          scrollToDiff(id);
          return;
        }
      }
    },
    [
      activeId,
      diff.differenceIds,
      filter,
      fingerprints,
      reviewScope,
      scrollToDiff,
      setStatus,
      store,
    ],
  );

  const title = AUDIO_CHAPTER_TITLE_BY_ID[chapterId];
  const filterCount = (id: DiffReviewFilter): number => {
    switch (id) {
      case 'open':
        return counts.open;
      case 'cleared':
        return counts.cleared;
      case 'as-spoken':
        return counts.asSpoken;
      case 'needs-update':
        return counts.needsUpdate;
      case 'all':
        return counts.all;
      default: {
        const _exhaustive: never = id;
        return _exhaustive;
      }
    }
  };

  return (
    <BrandShell activeId="script-compare" crumb="Book vs audio" noise={false}>
      <div className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-[#080a09] pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:left-[19rem] md:pb-0">
        <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4 pt-2 md:gap-5 md:px-8 md:pb-8 md:pt-2.5 lg:px-10 lg:pb-10">
            <BrandPageHeader
              title="Book vs audio"
              description="Left is the printed book. Right is the timed script from the recording. Tap a highlight to mark looks fine, as spoken, or needs update."
            />

            <div className="flex flex-wrap items-end gap-3 border border-cream/12 bg-[#0c100e] px-4 py-3">
              <label className="flex min-w-[14rem] flex-col gap-1.5">
                <span className={LABEL}>Track</span>
                <select
                  value={chapterId}
                  onChange={(event) =>
                    setChapterId(Number(event.target.value) as AudioChapterId)
                  }
                  className="h-10 rounded-none border border-cream/20 bg-[#080a09] px-3 font-sans text-sm text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70"
                >
                  {AUDIO_LISTEN_ORDER.map((id) => (
                    <option key={id} value={id}>
                      {formatChapterIndex(id)} · {AUDIO_CHAPTER_TITLE_BY_ID[id]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex min-w-[14rem] flex-col gap-1.5">
                <span className={LABEL}>Audio script</span>
                <select
                  value={scriptModel}
                  onChange={(event) =>
                    setScriptModel(
                      event.target.value as AudioScriptWhisperModel,
                    )
                  }
                  className="h-10 rounded-none border border-cream/20 bg-[#080a09] px-3 font-sans text-sm text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70"
                >
                  {(Object.keys(SCRIPT_MODEL_LABEL) as AudioScriptWhisperModel[]).map(
                    (model) => (
                      <option key={model} value={model}>
                        {SCRIPT_MODEL_LABEL[model]}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <div className="ml-auto flex items-center gap-2">
                <p className="font-mono text-xs tabular-nums text-cream/45">
                  {filteredIds.length === 0
                    ? '0'
                    : `${filteredIndex >= 0 ? filteredIndex + 1 : '—'} / ${filteredIds.length}`}
                </p>
                <button
                  type="button"
                  onClick={() => jumpDiff(-1)}
                  disabled={filteredIds.length === 0}
                  className={`${TOOL_BUTTON} border-cream/20 text-cream/80 hover:bg-cream/5`}
                >
                  <ChevronUp size={14} aria-hidden />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => jumpDiff(1)}
                  disabled={filteredIds.length === 0}
                  className={`${TOOL_BUTTON} border-cream/20 text-cream/80 hover:bg-cream/5`}
                >
                  Next
                  <ChevronDown size={14} aria-hidden />
                </button>
              </div>
            </div>

            <MetricsBand
              book={bookStats}
              track={diff.stats}
              chapterIndex={formatChapterIndex(chapterId)}
              chapterTitle={title}
              bookCounts={bookCounts}
              trackCounts={counts}
            />

            {activeChunk && activeChunk.kind !== 'equal' ? (
              <ReviewBar
                chunk={activeChunk}
                status={activeStatus}
                onStatus={applyStatus}
              />
            ) : null}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-0.5">
              <div className="flex flex-wrap gap-1" role="group" aria-label="Review filter">
                {FILTER_OPTIONS.map((option) => {
                  const active = filter === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(option.id)}
                      className={`inline-flex h-8 items-center gap-1.5 border px-2.5 font-sans text-[0.65rem] uppercase tracking-[0.14em] transition-colors ${
                        active
                          ? 'border-cream/35 bg-cream/10 text-cream'
                          : 'border-transparent text-cream/45 hover:text-cream/80'
                      }`}
                    >
                      {option.label}
                      <span className="font-mono tabular-nums text-cream/55">
                        {filterCount(option.id)}
                      </span>
                    </button>
                  );
                })}
              </div>
              {(
                [
                  'equal',
                  'delete',
                  'insert',
                  'replace',
                ] as const
              ).map((kind) => (
                <span
                  key={kind}
                  className="inline-flex items-center gap-2 font-sans text-xs text-cream/55"
                >
                  <span
                    className={`inline-block h-3 w-3 ${
                      kind === 'equal'
                        ? 'bg-cream/25'
                        : kind === 'delete'
                          ? 'bg-[#c45c4a]/70'
                          : kind === 'insert'
                            ? 'bg-[#3d7a6a]/80'
                            : 'bg-[#c4a04a]/70'
                    }`}
                    aria-hidden
                  />
                  {KIND_STYLE[kind].label}
                </span>
              ))}
              <span className="inline-flex items-center gap-2 font-sans text-xs text-cream/55">
                <span
                  className="inline-block h-3 w-3 bg-cream/20 ring-1 ring-cream/15"
                  aria-hidden
                />
                Looks fine
              </span>
              <span className="inline-flex items-center gap-2 font-sans text-xs text-cream/55">
                <span
                  className="inline-block h-3 w-3 bg-[#9fb5aa]/70"
                  aria-hidden
                />
                As spoken
              </span>
              <span className="inline-flex items-center gap-2 font-sans text-xs text-cream/55">
                <span
                  className="inline-block h-3 w-3 bg-[#c4a04a]/70 ring-1 ring-cream/45"
                  aria-hidden
                />
                Needs update
              </span>
              <span className="font-sans text-xs text-cream/35">
                {title} · {ARC_MANUSCRIPT_SOURCE}
              </span>
            </div>

            <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-2">
              <DiffPane
                title="Book text"
                subtitle="Printed ARC wording for this track"
                chunks={diff.chunks}
                side="left"
                activeId={activeId}
                statusFor={statusFor}
                onSelect={scrollToDiff}
                onScroll={handlePaneScroll}
                scrollRef={leftScrollRef}
              />
              <DiffPane
                title="Audio script"
                subtitle="Timed words taken from the recording"
                chunks={diff.chunks}
                side="right"
                activeId={activeId}
                statusFor={statusFor}
                onSelect={scrollToDiff}
                onScroll={handlePaneScroll}
                scrollRef={rightScrollRef}
              />
            </div>
        </div>
      </div>
    </BrandShell>
  );
}
