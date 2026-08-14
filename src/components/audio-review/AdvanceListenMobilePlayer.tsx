import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { useState } from 'react';

import { ShaderBackdrop } from '@/components/shader/ShaderBackdrop';
import {
  AUDIO_BOOK,
  formatAudioTime,
  formatChapterIndex,
  type AudioChapter,
} from '@/data/audioBook';

const EASE_SHEET = [0.32, 0.72, 0, 1] as const;

type AdvanceListenMobilePlayerProps = {
  chapter: AudioChapter;
  chapters: AudioChapter[];
  chapterId: number;
  playing: boolean;
  currentTime: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onSelectChapter: (id: number) => void;
  onJumpChapter: (direction: -1 | 1) => void;
};

export function AdvanceListenMobilePlayer({
  chapter,
  chapters,
  chapterId,
  playing,
  currentTime,
  onPlayPause,
  onSeek,
  onSelectChapter,
  onJumpChapter,
}: AdvanceListenMobilePlayerProps) {
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const chapterIndex = chapters.findIndex((item) => item.id === chapterId);
  const canPrev = chapterIndex > 0;
  const canNext = chapterIndex >= 0 && chapterIndex < chapters.length - 1;
  const remaining = Math.max(0, chapter.length - currentTime);
  const progress = chapter.length > 0 ? Math.min(1, currentTime / chapter.length) : 0;

  const closeChapters = () => setChaptersOpen(false);

  const selectChapter = (id: number) => {
    onSelectChapter(id);
    closeChapters();
  };

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#060807] px-5 pt-5 md:hidden">
      <header className="shrink-0 text-center">
        <p className="font-serif text-[1.65rem] italic leading-[1.15] text-cream">
          {AUDIO_BOOK.title} · Advance Listening Edition
        </p>
      </header>

      <div className="flex min-h-0 flex-1 items-center justify-center bg-[#060807] py-3">
        <motion.div
          className="aspect-square w-[min(88vw,22.5rem)] shrink-0"
          animate={{ scale: playing ? 1 : 0.96 }}
          transition={{ duration: 0.7, ease: EASE_SHEET }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-[#060807] isolate [clip-path:circle(50%)]">
            <ShaderBackdrop
              theme="forest"
              position="absolute"
              overlay={false}
              className="rounded-full bg-[#060807]"
            />
          </div>
        </motion.div>
      </div>

      <div className="shrink-0 pb-[6.5rem]">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/45">
            Chapter {formatChapterIndex(chapter.id)}
          </p>
          <h1 className="mt-1.5 font-serif text-[1.85rem] italic leading-[1.15] text-cream">
            {chapter.title}
          </h1>
          <p className="mt-1.5 text-sm text-cream/55">{AUDIO_BOOK.imprint}</p>
        </div>

        <div className="mt-5">
          <div className="relative h-8">
            <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-cream/20">
              <div
                className="h-full rounded-full bg-cream"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream"
                style={{ left: `${progress * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(chapter.length, 1)}
              step={0.1}
              value={Math.min(currentTime, chapter.length)}
              onChange={(event) => onSeek(Number(event.target.value))}
              className="absolute inset-0 h-8 w-full cursor-pointer appearance-none opacity-0"
              aria-label="Seek"
            />
          </div>
          <div className="mt-1 flex items-center justify-between font-mono text-[11px] tabular-nums text-cream/50">
            <span>{formatAudioTime(currentTime)}</span>
            <span>-{formatAudioTime(remaining)}</span>
          </div>
        </div>

        <div className="mt-4 mb-2 flex items-center justify-center gap-10">
          <button
            type="button"
            onClick={() => onJumpChapter(-1)}
            disabled={!canPrev}
            className="inline-flex h-12 w-12 items-center justify-center text-cream disabled:text-cream/25"
            aria-label="Previous chapter"
          >
            <SkipBack size={28} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={onPlayPause}
            className="inline-flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-cream text-[#080a09] transition-transform active:scale-[0.96]"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <Pause size={28} strokeWidth={1.5} fill="currentColor" />
            ) : (
              <Play size={28} strokeWidth={1.5} fill="currentColor" className="ml-0.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onJumpChapter(1)}
            disabled={!canNext}
            className="inline-flex h-12 w-12 items-center justify-center text-cream disabled:text-cream/25"
            aria-label="Next chapter"
          >
            <SkipForward size={28} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setChaptersOpen(true)}
        className="absolute inset-x-0 bottom-0 z-10 flex h-[4.25rem] items-center justify-center rounded-t-[1.75rem] bg-[#4A5239] px-6 pb-[env(safe-area-inset-bottom)]"
        aria-expanded={chaptersOpen}
        aria-controls="advance-listen-chapters-sheet"
      >
        <span className="font-serif text-2xl font-bold italic leading-none text-cream">
          Chapters
        </span>
        <ChevronUp
          size={22}
          strokeWidth={1.5}
          className="absolute right-6 text-cream/80"
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {chaptersOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close chapters"
              className="absolute inset-0 z-20 bg-black/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_SHEET }}
              onClick={closeChapters}
            />
            <motion.div
              id="advance-listen-chapters-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Chapters"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease: EASE_SHEET }}
              className="absolute inset-x-0 bottom-0 top-[12%] z-30 flex flex-col overflow-hidden rounded-t-[1.75rem] bg-[#4A5239] pb-[env(safe-area-inset-bottom)]"
            >
              <button
                type="button"
                onClick={closeChapters}
                className="relative flex shrink-0 items-center justify-center px-6 py-5"
              >
                <span className="font-serif text-2xl font-bold italic leading-none text-cream">
                  Chapters
                </span>
                <ChevronUp
                  size={22}
                  strokeWidth={1.5}
                  className="absolute right-6 rotate-180 text-cream/80"
                  aria-hidden
                />
              </button>
              <nav aria-label="Chapters" className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
                <ol className="list-none">
                  {chapters.map((item) => {
                    const active = item.id === chapterId;
                    return (
                      <li key={item.id} className="border-b border-cream/10 last:border-b-0">
                        <button
                          type="button"
                          onClick={() => selectChapter(item.id)}
                          className={`flex min-h-12 w-full items-baseline gap-3 px-3 py-3 text-left ${
                            active ? 'rounded-sm bg-cream/[0.08]' : ''
                          }`}
                        >
                          <span
                            className={`w-9 shrink-0 font-mono text-[11px] tabular-nums tracking-wide ${
                              active ? 'text-cream' : 'text-cream/50'
                            }`}
                          >
                            {formatChapterIndex(item.id)}
                          </span>
                          <span
                            className={`min-w-0 flex-1 font-sans text-[15px] leading-snug ${
                              active ? 'font-medium text-cream' : 'text-cream/80'
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="shrink-0 font-mono text-[11px] tabular-nums text-cream/50">
                            {formatAudioTime(item.length)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
