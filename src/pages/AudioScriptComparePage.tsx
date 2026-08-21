/**
 * Book vs audio — printed ARC text (left) vs timed audio script (right).
 * Live word-level diff; normalized matching.
 */
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  AUDIO_CHAPTER_TITLE_BY_ID,
  AUDIO_LISTEN_ORDER,
  formatChapterIndex,
  type AudioChapterId,
} from '@/data/audioBook';
import {
  ARC_MANUSCRIPT_SOURCE,
  arcManuscriptForChapter,
} from '@/data/arcManuscriptChapters';
import { manuscriptForChapter } from '@/data/audioManuscripts';
import {
  diffManuscriptTexts,
  scriptTextFromCues,
  type DiffChunk,
  type DiffKind,
} from '@/lib/scriptWordDiff';

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

function setChapterInUrl(chapterId: AudioChapterId): void {
  const url = new URL(window.location.href);
  url.searchParams.set('chapter', String(chapterId));
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

function WordRun({
  chunk,
  side,
  active,
  onSelect,
}: {
  chunk: DiffChunk;
  side: 'left' | 'right';
  active: boolean;
  onSelect: (id: number) => void;
}) {
  const tokens = side === 'left' ? chunk.left : chunk.right;
  if (tokens.length === 0) return null;

  const style = KIND_STYLE[chunk.kind];
  const className = side === 'left' ? style.left : style.right;
  const interactive = chunk.kind !== 'equal';

  const body = tokens.map((token, index) => {
    const breakText =
      token.breakAfter === 'paragraph'
        ? '\n\n'
        : token.breakAfter === 'line'
          ? '\n'
          : index < tokens.length - 1
            ? ' '
            : '';
    return (
      <span key={`${chunk.id}-${side}-${index}`}>
        {token.display}
        {breakText}
      </span>
    );
  });

  const trailingSpace =
    tokens.length > 0 && !tokens[tokens.length - 1]?.breakAfter ? ' ' : null;

  if (!interactive) {
    return (
      <span className={className}>
        {body}
        {trailingSpace}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        data-diff-id={chunk.id}
        data-diff-side={side}
        onClick={() => onSelect(chunk.id)}
        className={`mx-0.5 inline px-0.5 text-left transition-[box-shadow] ${className} ${
          active ? 'shadow-[0_0_0_2px_rgba(245,240,232,0.55)]' : ''
        }`}
      >
        {body}
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
  onSelect,
  scrollRef,
}: {
  title: string;
  subtitle: string;
  chunks: DiffChunk[];
  side: 'left' | 'right';
  activeId: number | null;
  onSelect: (id: number) => void;
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
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4 font-serif text-[0.95rem] leading-[1.75] tracking-[0.01em] text-cream md:text-[1.02rem]"
      >
        <div className="whitespace-pre-wrap">
          {chunks.map((chunk) => (
            <WordRun
              key={`${side}-${chunk.id}`}
              chunk={chunk}
              side={side}
              active={activeId === chunk.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-[5.5rem]">
      <p className={LABEL}>{label}</p>
      <p className="mt-1 font-mono text-sm text-cream tabular-nums">{value}</p>
    </div>
  );
}

export default function AudioScriptComparePage() {
  const [chapterId, setChapterId] = useState<AudioChapterId>(() =>
    chapterFromSearch(),
  );
  const [activeId, setActiveId] = useState<number | null>(null);
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  const arcText = useMemo(
    () => arcManuscriptForChapter(chapterId),
    [chapterId],
  );
  const scriptText = useMemo(
    () => scriptTextFromCues(manuscriptForChapter(chapterId)),
    [chapterId],
  );
  const diff = useMemo(
    () => diffManuscriptTexts(arcText, scriptText),
    [arcText, scriptText],
  );

  useEffect(() => {
    setChapterInUrl(chapterId);
  }, [chapterId]);

  useEffect(() => {
    setActiveId(diff.differenceIds[0] ?? null);
    // Reset focus when the track changes, not on every new array identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chapterId is the intentional trigger
  }, [chapterId]);

  const scrollToDiff = useCallback((id: number) => {
    setActiveId(id);
    for (const root of [leftScrollRef.current, rightScrollRef.current]) {
      if (!root) continue;
      const el = root.querySelector<HTMLElement>(`[data-diff-id="${id}"]`);
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, []);

  const jumpDiff = useCallback(
    (direction: -1 | 1) => {
      const ids = diff.differenceIds;
      if (ids.length === 0) return;
      const current = activeId == null ? -1 : ids.indexOf(activeId);
      let next = current + direction;
      if (next < 0) next = ids.length - 1;
      if (next >= ids.length) next = 0;
      scrollToDiff(ids[next]!);
    },
    [activeId, diff.differenceIds, scrollToDiff],
  );

  const title = AUDIO_CHAPTER_TITLE_BY_ID[chapterId];

  return (
    <BrandShell activeId="script-compare" crumb="Book vs audio" noise={false}>
      <div className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-[#080a09] pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:left-[19rem] md:pb-0">
        <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4 pt-2 md:gap-5 md:px-8 md:pb-8 md:pt-2.5 lg:px-10 lg:pb-10">
            <BrandPageHeader
              title="Book vs audio"
              description="Left is the printed book. Right is the timed script from the recording. Same words ignore case and punctuation."
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

              <Stat label="Same %" value={`${diff.stats.similarityPct}%`} />
              <Stat label="Same words" value={diff.stats.matchedWords} />
              <Stat
                label="In book, not audio"
                value={diff.stats.missingFromScript}
              />
              <Stat
                label="In audio, not book"
                value={diff.stats.onlyInScript}
              />
              <Stat label="Wording differs" value={diff.stats.replacements} />

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => jumpDiff(-1)}
                  disabled={diff.differenceIds.length === 0}
                  className="inline-flex h-10 items-center gap-1.5 border border-cream/20 px-3 font-sans text-xs uppercase tracking-[0.14em] text-cream/80 transition-colors hover:bg-cream/5 disabled:opacity-40"
                >
                  <ChevronUp size={14} aria-hidden />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => jumpDiff(1)}
                  disabled={diff.differenceIds.length === 0}
                  className="inline-flex h-10 items-center gap-1.5 border border-cream/20 px-3 font-sans text-xs uppercase tracking-[0.14em] text-cream/80 transition-colors hover:bg-cream/5 disabled:opacity-40"
                >
                  Next
                  <ChevronDown size={14} aria-hidden />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 px-0.5">
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
                onSelect={scrollToDiff}
                scrollRef={leftScrollRef}
              />
              <DiffPane
                title="Audio script"
                subtitle="Timed words taken from the recording"
                chunks={diff.chunks}
                side="right"
                activeId={activeId}
                onSelect={scrollToDiff}
                scrollRef={rightScrollRef}
              />
            </div>
        </div>
      </div>
    </BrandShell>
  );
}
