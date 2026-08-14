import { FormlessBookCoverPanel } from '@/components/audio-review/FormlessBookCoverPanel';
import { StudioRungTick } from '@/components/audio-review/StudioFileLadder';
import {
  AUDIO_BOOK,
  formatAudioTime,
  formatChapterIndex,
  type AudioChapter,
} from '@/data/audioBook';
import {
  studioBookProgress,
  type StudioChapterRecord,
} from '@/data/audiobookStudioCatalog';
import { STUDIO_RUNGS } from '@/data/studioLadder';

type StudioChapterRailProps = {
  chapters: AudioChapter[];
  records: StudioChapterRecord[];
  activeId: number;
  showCover: boolean;
  onSelect: (chapterId: number) => void;
  onOpenCompanion: () => void;
};

export function StudioChapterRail({
  chapters,
  records,
  activeId,
  showCover,
  onSelect,
  onOpenCompanion,
}: StudioChapterRailProps) {
  const progress = studioBookProgress(records);
  const recordById = new Map(records.map((record) => [record.chapterId, record]));

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col border-r border-cream/10 bg-[#101412] md:flex">
      {showCover ? (
        <FormlessBookCoverPanel chapters={chapters} />
      ) : (
        <div className="shrink-0 border-b border-cream/10 px-5 pb-4 pt-5">
          <h1 className="text-[1.35rem] font-medium leading-none tracking-tight text-cream">
            {AUDIO_BOOK.title}
          </h1>
          <p className="mt-2 text-sm text-cream/50">Toward Audible</p>
          <p className="mt-3 font-mono text-[11px] tabular-nums text-cream/45">
            <span className="text-cream/75">{progress.towardAudible}</span>
            <span className="text-cream/25">/{progress.total}</span>
            {' '}mastered or further
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1">
            {STUDIO_RUNGS.map((rung) => (
              <div key={rung.id} className="flex items-baseline justify-between gap-2">
                <dt className="truncate text-[11px] text-cream/40">{rung.label}</dt>
                <dd className="font-mono text-[11px] tabular-nums text-cream/65">
                  {progress.counts[rung.id]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <nav className="scrollbar-cream min-h-0 flex-1 overflow-y-auto px-5 py-3" aria-label="Chapters">
        <p className="mb-1 border-b border-cream/10 pb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/35">
          Chapter
        </p>
        <ol className="list-none">
          {chapters.map((chapter) => {
            const active = chapter.id === activeId;
            const record = recordById.get(chapter.id);
            return (
              <li key={chapter.id} className="border-b border-cream/[0.06]">
                <button
                  type="button"
                  onClick={() => onSelect(chapter.id)}
                  className="group flex w-full flex-col gap-1 py-2.5 text-left transition-colors"
                >
                  <span className="flex w-full items-baseline gap-2.5">
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        active ? 'text-cream/45' : 'text-cream/30'
                      }`}
                    >
                      {formatChapterIndex(chapter.id)}
                    </span>
                    <span
                      className={`min-w-0 flex-1 text-[15px] leading-snug tracking-tight ${
                        active
                          ? 'text-cream'
                          : 'text-cream/55 group-hover:text-cream/85'
                      }`}
                    >
                      {chapter.title}
                    </span>
                    <span
                      className={`shrink-0 font-mono text-[10px] tabular-nums tracking-wide ${
                        active ? 'text-cream/50' : 'text-cream/25 group-hover:text-cream/40'
                      }`}
                    >
                      {formatAudioTime(chapter.length)}
                    </span>
                  </span>
                  {record ? (
                    <span className="inline-flex items-center gap-[3px]" aria-hidden>
                      {STUDIO_RUNGS.map((rung) => (
                        <StudioRungTick
                          key={rung.id}
                          id={rung.id}
                          state={record.states[rung.id]}
                        />
                      ))}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="shrink-0 border-t border-cream/10 px-5 py-3">
        <button
          type="button"
          onClick={onOpenCompanion}
          className="text-left text-[13px] text-cream/40 underline decoration-cream/20 underline-offset-4 transition-colors hover:text-cream/70 hover:decoration-cream/40"
        >
          Recording steps
        </button>
        <p className="mt-1 text-[12px] leading-snug text-cream/30">
          First take or a rerecord. Kept quiet on purpose.
        </p>
      </div>
    </aside>
  );
}
