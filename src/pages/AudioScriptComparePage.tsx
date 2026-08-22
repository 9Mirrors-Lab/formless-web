/**
 * Book vs audio — printed ARC text (left) vs timed audio script (right).
 * Live word-level diff; normalized matching.
 */
import { Check, ChevronDown, ChevronUp, Flag, Mic, Speech } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

import { BrandPageHeader } from '@/components/BrandPageHeader';
import { BrandShell } from '@/components/app-sidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import {
  AUDIO_CHAPTER_TITLE_BY_ID,
  AUDIO_LISTEN_ORDER,
  formatAudioTime,
  formatChapterIndex,
  type AudioChapterId,
} from '@/data/audioBook';
import {
  ARC_MANUSCRIPT_SOURCE,
  arcManuscriptForChapter,
} from '@/data/arcManuscriptChapters';
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
  cueStartForChunk,
  diffManuscriptTexts,
  diffWordTokens,
  scriptTextFromCues,
  scriptTokensFromCues,
  tokenizeWords,
  type DiffChunk,
  type DiffKind,
  type DiffStats,
  type WordToken,
} from '@/lib/scriptWordDiff';

const SCRIPT_MODEL = 'medium';

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
  { id: 'record', label: 'Record' },
  { id: 'as-spoken', label: 'As spoken' },
  { id: 'cleared', label: 'Cleared' },
  { id: 'all', label: 'All' },
];

const TOOL_BUTTON =
  'inline-flex h-10 items-center gap-1.5 border px-3 font-sans text-xs uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70 disabled:opacity-40';

const REVIEW_MARKS = [
  {
    status: 'cleared' as const,
    label: 'Looks fine',
    short: 'Ignore this highlight',
    Icon: Check,
    activeClass: 'border-[#9fb5aa]/55 bg-[#9fb5aa]/20 text-cream',
    accent: '#9fb5aa',
    detail:
      'The highlight is not a problem. Leave the book and the audio as they are. Use this for noise, a false match, punctuation, or anything that does not need a wording record.',
    exampleBook: 'Oh, well—',
    exampleAudio: 'oh well',
    exampleNote: 'Same line. The mark is only punctuation.',
    bubbleAlign: 'left' as const,
  },
  {
    status: 'as-spoken' as const,
    label: 'As spoken',
    short: 'Keep the spoken word',
    Icon: Speech,
    activeClass: 'border-[#9fb5aa]/55 bg-[#9fb5aa]/20 text-cream',
    accent: '#9fb5aa',
    detail:
      'The author said a different word than the printed book, and the take is the one to keep. This is a real wording change, not a dismiss.',
    exampleBook: 'the',
    exampleAudio: 'this',
    exampleNote: 'Different word. Keep what was said.',
    bubbleAlign: 'center' as const,
  },
  {
    status: 'needs-update' as const,
    label: 'Needs update',
    short: 'Fix the script',
    Icon: Flag,
    activeClass: 'border-[#c4a04a]/55 bg-[#c4a04a]/20 text-cream',
    accent: '#c4a04a',
    detail:
      'The audio script is wrong and should be corrected, including capitalization.',
    exampleBook: 'I',
    exampleAudio: 'i',
    exampleNote: 'Transcript error. Fix the script, not the book.',
    bubbleAlign: 'right' as const,
  },
  {
    status: 'record' as const,
    label: 'Record',
    short: 'This will be recut',
    Icon: Mic,
    activeClass: 'border-[#c45c4a]/60 bg-[#c45c4a]/20 text-cream',
    accent: '#c45c4a',
    detail:
      'This line will be recorded again. It is not a script typo and not something to keep as spoken. Mark it here so the recut list is separate from script fixes.',
    exampleBook: 'I sat with it',
    exampleAudio: 'I sat—',
    exampleNote: 'Broken take. Say the line again.',
    bubbleAlign: 'right' as const,
  },
];

type ReviewMark = (typeof REVIEW_MARKS)[number];

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
    case 'record':
      return `${base} ring-1 ring-[#c45c4a]/55`;
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

function setCompareInUrl(chapterId: AudioChapterId): void {
  const url = new URL(window.location.href);
  url.searchParams.set('chapter', String(chapterId));
  url.searchParams.delete('model');
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
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

function CueClock({ seconds }: { seconds: number }) {
  const label = formatAudioTime(seconds);
  return (
    <span
      className="mr-2 inline-block w-[2.85rem] select-all font-mono text-[0.7rem] font-medium tracking-wide text-[#c5d9cf] tabular-nums"
      title={`Track ${label}`}
    >
      {label}
    </span>
  );
}

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
    const cueBreak = side === 'right' && token.cueStart != null ? '\n' : '';
    return (
      <span key={`${chunkId}-${side}-${index}`}>
        {cueBreak}
        {side === 'right' && token.cueStart != null ? (
          <CueClock seconds={token.cueStart} />
        ) : null}
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

function TrackNav({
  chapterId,
  onChapter,
}: {
  chapterId: AudioChapterId;
  onChapter: (id: AudioChapterId) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex min-w-[14rem] flex-col gap-1.5">
        <span className={LABEL}>Track</span>
        <select
          value={chapterId}
          onChange={(event) =>
            onChapter(Number(event.target.value) as AudioChapterId)
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
  className,
}: {
  book: DiffStats;
  track: DiffStats;
  chapterIndex: string;
  chapterTitle: string;
  bookCounts: DiffReviewCounts;
  trackCounts: DiffReviewCounts;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border border-cream/12 bg-[#0c100e] px-4 py-3 lg:flex-row lg:items-stretch lg:gap-8',
        className,
      )}
    >
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
  return counts.cleared + counts.asSpoken + counts.needsUpdate + counts.record;
}

const STATUS_SWATCH = {
  fine: '#f2f0e9',
  spoken: '#9fb5aa',
  update: '#c4a04a',
  record: '#c45c4a',
  open: 'rgb(242 240 233 / 0.42)',
} as const;

type StatusSlice = {
  id: 'fine' | 'spoken' | 'update' | 'record' | 'open';
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
    {
      id: 'record',
      label: 'Record',
      value: book.record,
      color: STATUS_SWATCH.record,
    },
  ];
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

  return (
    <div
      className="min-w-0 flex-1 lg:border-l lg:border-cream/10 lg:pl-6"
      aria-label={
        book.all === 0
          ? 'No differences in the book'
          : `${formatCount(book.all)} differences in the book, ${formatCount(bookChecked)} checked. Fine ${formatCount(book.cleared)}, spoken ${formatCount(book.asSpoken)}, update ${formatCount(book.needsUpdate)}, record ${formatCount(book.record)}, open ${formatCount(book.open)}. Track ${chapterIndex} has ${formatCount(track.open)} open.`
      }
    >
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
  );
}

function ReviewMarkButton({
  mark,
  active,
  onSelect,
}: {
  mark: ReviewMark;
  active: boolean;
  onSelect: () => void;
}) {
  const { Icon } = mark;
  const helpId = `review-mark-${mark.status}-help`;
  const bubbleX =
    mark.bubbleAlign === 'left'
      ? 'left-0'
      : mark.bubbleAlign === 'right'
        ? 'right-0'
        : 'left-[calc(50%-9.25rem)]';
  const caretX =
    mark.bubbleAlign === 'left'
      ? 'left-8'
      : mark.bubbleAlign === 'right'
        ? 'right-8'
        : 'left-[calc(50%-6px)]';

  return (
    <div className="group relative">
      <button
        type="button"
        aria-pressed={active}
        aria-describedby={helpId}
        onClick={onSelect}
        className="flex flex-col items-start gap-1.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70"
      >
        <span
          className={cn(
            'inline-flex h-[30px] items-center gap-1.5 border px-[9px] font-sans text-[9px] font-normal leading-[12px] uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-150',
            active
              ? mark.activeClass
              : 'border-cream/20 bg-transparent text-cream/80 group-hover:bg-cream/5',
          )}
        >
          <Icon size={14} aria-hidden />
          {mark.label}
        </span>
        <span
          className={cn(
            'px-0.5 font-sans text-[0.68rem] leading-snug',
            active
              ? 'text-cream/70'
              : 'text-cream/42 group-hover:text-cream/58',
          )}
        >
          {mark.short}
        </span>
      </button>
      <p id={helpId} className="sr-only">
        {mark.short}. {mark.detail} Example: book {mark.exampleBook}, audio{' '}
        {mark.exampleAudio}. {mark.exampleNote}
      </p>
      <div
        className={cn(
          'pointer-events-none absolute top-full z-40 w-[18.5rem] pt-2.5',
          bubbleX,
        )}
        aria-hidden
      >
        <div
          className={cn(
            'pointer-events-none invisible relative border border-cream/14 bg-[#161c19] text-left opacity-0 shadow-[0_22px_48px_rgba(0,0,0,0.58)] transition-[opacity,visibility] duration-150 ease-out delay-0',
            '[@media(hover:hover)]:group-hover:visible [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:delay-500',
          )}
        >
          <div
            className="h-0.5 w-full"
            style={{ backgroundColor: mark.accent }}
          />
          <div className="px-3.5 py-3">
            <p className={LABEL}>{mark.label}</p>
            <p className="mt-1.5 font-serif text-[1.08rem] italic leading-tight text-cream">
              {mark.short}
            </p>
            <p className="mt-2 font-sans text-[0.78rem] leading-relaxed text-cream/65">
              {mark.detail}
            </p>
            <div className="mt-3 border border-cream/10 bg-black/30 px-3 py-2">
              <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1">
                <span className="font-sans text-[0.6rem] uppercase tracking-[0.14em] text-cream/35">
                  Book
                </span>
                <span className="font-serif text-[0.98rem] italic text-cream/88">
                  {mark.exampleBook}
                </span>
                <span className="font-sans text-[0.6rem] uppercase tracking-[0.14em] text-cream/35">
                  Audio
                </span>
                <span className="font-serif text-[0.98rem] italic text-[#9fb5aa]">
                  {mark.exampleAudio}
                </span>
              </div>
              <p className="mt-1.5 font-sans text-[0.7rem] leading-snug text-cream/45">
                {mark.exampleNote}
              </p>
            </div>
          </div>
          <span
            className={cn(
              'absolute bottom-full h-0 w-0 border-x-[6px] border-b-[6px] border-x-transparent border-b-[#161c19]',
              caretX,
            )}
          />
        </div>
      </div>
    </div>
  );
}

function ReviewBar({
  chunk,
  status,
  trackTime,
  onStatus,
  className,
}: {
  chunk: DiffChunk;
  status: DiffReviewStatus | null;
  trackTime: number | null;
  onStatus: (next: DiffReviewStatus) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative z-20 flex flex-wrap items-end gap-3 border border-cream/12 bg-[#0c100e] px-4 py-3',
        className,
      )}
    >
      <div className="min-w-[14rem] flex-1">
        <p className={LABEL}>{KIND_STYLE[chunk.kind].label}</p>
        {trackTime != null ? (
          <p className="mt-1 font-mono text-xs tabular-nums tracking-[0.08em] text-[#9fb5aa]">
            Track {formatAudioTime(trackTime)}
          </p>
        ) : null}
        <p className="mt-1 font-sans text-sm text-cream/80">
          Book: {tokenExcerpt(chunk.left)}
        </p>
        <p className="mt-0.5 font-sans text-sm text-cream/55">
          Audio: {tokenExcerpt(chunk.right)}
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        {REVIEW_MARKS.map((mark) => (
          <ReviewMarkButton
            key={mark.status}
            mark={mark}
            active={status === mark.status}
            onSelect={() => onStatus(mark.status)}
          />
        ))}
      </div>
    </div>
  );
}

export default function AudioScriptComparePage() {
  const [chapterId, setChapterId] = useState<AudioChapterId>(() =>
    chapterFromSearch(),
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
  const scriptTokens = useMemo(
    () => scriptTokensFromCues(manuscriptForChapterMedium(chapterId)),
    [chapterId],
  );
  const diff = useMemo(
    () => diffWordTokens(tokenizeWords(arcText), scriptTokens),
    [arcText, scriptTokens],
  );

  const bookDiffs = useMemo(
    () =>
      AUDIO_LISTEN_ORDER.map((id) => {
        const result = diffManuscriptTexts(
          arcManuscriptForChapter(id),
          scriptTextFromCues(manuscriptForChapterMedium(id)),
        );
        return {
          chapterId: id,
          stats: result.stats,
          differenceIds: result.differenceIds,
          fingerprints: differenceFingerprints(result.chunks),
        };
      }),
    [],
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
            model: SCRIPT_MODEL,
          }),
        ),
      ),
    [bookDiffs, store],
  );

  const fingerprints = useMemo(
    () => differenceFingerprints(diff.chunks),
    [diff.chunks],
  );
  const reviewScope = useMemo(
    () => ({ chapterId, model: SCRIPT_MODEL }),
    [chapterId],
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
  const activeTrackTime = useMemo(
    () => (activeId == null ? null : cueStartForChunk(diff.chunks, activeId)),
    [activeId, diff.chunks],
  );
  const activeStatus =
    activeId == null ? null : statusFor(activeId);
  const filteredIndex =
    activeId == null ? -1 : filteredIds.indexOf(activeId);

  useEffect(() => {
    setCompareInUrl(chapterId);
  }, [chapterId]);

  useEffect(() => {
    setFilter('open');
    const fps = differenceFingerprints(diff.chunks);
    const openIds = filterDifferenceIds(
      diff.differenceIds,
      fps,
      store,
      { chapterId, model: SCRIPT_MODEL },
      'open',
    );
    setActiveId(openIds[0] ?? diff.differenceIds[0] ?? null);
    // Reset focus when the track changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chapterId is the intentional trigger
  }, [chapterId]);

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
      case 'record':
        return counts.record;
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
      <div className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-[#080a09] pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:left-[var(--brand-nav-width,19rem)] md:pb-0">
        <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4 pt-2 md:gap-3.5 md:px-8 md:pb-8 md:pt-2.5 lg:px-10 lg:pb-10">
            <BrandPageHeader title="Book vs audio" />

            <Accordion
              type="single"
              collapsible
              className="shrink-0 border border-cream/12 bg-[#0c100e]"
            >
              <AccordionItem value="nav" className="border-none">
                <AccordionTrigger className="rounded-none px-4 py-2.5 hover:no-underline hover:bg-cream/[0.03] focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70 data-[state=open]:border-b data-[state=open]:border-cream/12 [&>svg]:text-[#9fb5aa]">
                  <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-4 gap-y-1 text-left">
                    <span className={LABEL}>Track</span>
                    <span className="truncate font-sans text-sm text-cream">
                      {formatChapterIndex(chapterId)} · {title}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-cream/45">
                      {diff.stats.similarityPct}% · {formatCount(counts.open)}{' '}
                      open
                    </span>
                    {activeChunk && activeChunk.kind !== 'equal' ? (
                      <span className="truncate font-sans text-xs text-cream/40">
                        {KIND_STYLE[activeChunk.kind].label}
                      </span>
                    ) : null}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-3 px-4 pt-3 pb-3">
                  <TrackNav
                    chapterId={chapterId}
                    onChapter={setChapterId}
                  />
                  <MetricsBand
                    book={bookStats}
                    track={diff.stats}
                    chapterIndex={formatChapterIndex(chapterId)}
                    chapterTitle={title}
                    bookCounts={bookCounts}
                    trackCounts={counts}
                    className="border-cream/10 bg-transparent px-0"
                  />
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-cream/10 pt-3">
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
                    <span className="inline-flex items-center gap-2 font-sans text-xs text-cream/55">
                      <span
                        className="inline-block h-3 w-3 bg-[#c45c4a]/70"
                        aria-hidden
                      />
                      Record
                    </span>
                    <span className="font-sans text-xs text-cream/35">
                      {title} · {ARC_MANUSCRIPT_SOURCE}
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-0.5">
              <div className="flex items-center gap-1.5">
                <p className="font-mono text-[0.7rem] tabular-nums text-cream/45">
                  {filteredIds.length === 0
                    ? '0'
                    : `${filteredIndex >= 0 ? filteredIndex + 1 : '—'} / ${filteredIds.length}`}
                </p>
                <button
                  type="button"
                  onClick={() => jumpDiff(-1)}
                  disabled={filteredIds.length === 0}
                  className={cn(
                    TOOL_BUTTON,
                    'h-6 gap-1 border-cream/20 px-1.5 text-[0.6rem] tracking-[0.1em] text-cream/80 hover:bg-cream/5',
                  )}
                >
                  <ChevronUp size={11} aria-hidden />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => jumpDiff(1)}
                  disabled={filteredIds.length === 0}
                  className={cn(
                    TOOL_BUTTON,
                    'h-6 gap-1 border-cream/20 px-1.5 text-[0.6rem] tracking-[0.1em] text-cream/80 hover:bg-cream/5',
                  )}
                >
                  Next
                  <ChevronDown size={11} aria-hidden />
                </button>
              </div>
              <div className="flex flex-wrap gap-1" role="group" aria-label="Review filter">
                {FILTER_OPTIONS.map((option) => {
                  const active = filter === option.id;
                  const count = filterCount(option.id);
                  const openComplete = option.id === 'open' && count === 0;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(option.id)}
                      className={cn(
                        'inline-flex h-6 items-center gap-1.5 border px-2 font-sans text-[0.6rem] uppercase tracking-[0.14em] transition-colors',
                        openComplete
                          ? active
                            ? 'border-[#6fd4b8]/80 bg-[#6fd4b8]/18 text-[#e7fff6] shadow-[inset_0_0_18px_rgba(111,212,184,0.22)]'
                            : 'border-transparent text-[#6fd4b8]/80 hover:text-[#8fe0c8]'
                          : active
                            ? 'border-cream/35 bg-cream/10 text-cream'
                            : 'border-transparent text-cream/45 hover:text-cream/80',
                      )}
                    >
                      {option.label}
                      <span
                        className={cn(
                          'font-mono tabular-nums',
                          openComplete ? 'text-[#8fe0c8]' : 'text-cream/55',
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {activeChunk && activeChunk.kind !== 'equal' ? (
              <ReviewBar
                chunk={activeChunk}
                status={activeStatus}
                trackTime={activeTrackTime}
                onStatus={applyStatus}
              />
            ) : (
              <p className="border border-cream/12 bg-[#0c100e] px-4 py-3 font-sans text-xs text-cream/40">
                Tap a highlight in the script to review it here.
              </p>
            )}

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
                subtitle="Spoken line with its time in the audio track"
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
