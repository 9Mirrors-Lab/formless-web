/**
 * Audio mockup A — Studio compare
 *
 * Visual thesis: Dark production desk; moss accent; waveform is the primary visual;
 * Formless identity stays quiet in the sidebar.
 * Content plan: sidebar book + chapters → chapter meta + dual waveforms → transport → read-along tray.
 * Interaction thesis: chapter select highlight; T-key source flash; tray slides in with sentence sync.
 */
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  SkipBack,
  Volume2,
  X,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import {
  AudioCompareMultitrack,
  type AudioCompareHandle,
} from '@/components/audio-review/AudioCompareMultitrack';
import { audioChapterStatusIcon } from '@/components/audio-review/audioStatusIcons';
import {
  AUDIO_BOOK,
  audioStatusLabel,
  chapterProgressSummary,
  formatAudioPrecise,
  formatAudioTime,
  formatChapterIndex,
} from '@/data/audioReviewMock';
import { useAudioReviewMock } from '@/hooks/useAudioReviewMock';

export default function AudioStudioMockupPage() {
  const playerRef = useRef<AudioCompareHandle>(null);
  const [volume, setVolume] = useState(0.85);
  const onSeek = useCallback((time: number) => {
    playerRef.current?.seek(time);
  }, []);
  const review = useAudioReviewMock({ initialChapterId: 1, onSeek });
  const summary = chapterProgressSummary(review.chapters);

  return (
    <div className="flex h-[100svh] overflow-hidden bg-[#0b0d0c] font-sans text-cream antialiased">
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-cream/10 bg-[#101412]">
        <div className="border-b border-cream/10 px-5 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/40">
            Audiobook review
          </p>
          <div className="mt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9fb5aa]/80">
              {AUDIO_BOOK.imprint}
            </p>
            <h1 className="mt-1 font-serif text-3xl italic leading-none text-cream">
              {AUDIO_BOOK.title}
            </h1>
            <p className="mt-2 text-sm leading-snug text-cream/50">{AUDIO_BOOK.subtitle}</p>
            <p className="mt-4 text-xs text-cream/40">{AUDIO_BOOK.author}</p>
          </div>
          <div className="mt-6">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/35">
                Project progress
              </p>
              <p className="font-mono text-xs text-cream/55">{summary.percent}%</p>
            </div>
            <p className="mb-2 text-xs text-cream/45">
              {summary.recorded} of {summary.total} recorded · {summary.optimized} optimized
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-cream/10">
              <div
                className="h-full rounded-full bg-[#9fb5aa] transition-all duration-500"
                style={{ width: `${summary.percent}%` }}
              />
            </div>
          </div>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3" aria-label="Chapters">
          {review.chapters.map((chapter) => {
            const active = chapter.id === review.chapterId;
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => review.selectChapter(chapter.id)}
                className={`flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                  active ? 'bg-moss/45 text-cream' : 'text-cream/65 hover:bg-cream/5 hover:text-cream'
                }`}
              >
                <span className="mt-0.5">{audioChapterStatusIcon(chapter.status, 'md')}</span>
                <span className="min-w-0">
                  <span className="block text-sm leading-snug">
                    <span className="text-cream/40">{formatChapterIndex(chapter.id)}.</span>{' '}
                    {chapter.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-cream/35">
                    {formatAudioTime(chapter.length)}
                    {chapter.provisional ? ' · title TBD' : ''}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-cream/10 px-4 py-3">
          <a
            href="/audio/editorial?companion=1"
            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#9fb5aa]/80 transition-colors hover:text-[#9fb5aa]"
          >
            Companion kit →
          </a>
          <a
            href="/audio/editorial"
            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40 transition-colors hover:text-[#9fb5aa]"
          >
            Compare editorial mockup →
          </a>
        </div>
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-start justify-between gap-6 border-b border-cream/10 px-8 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
              Chapter {formatChapterIndex(review.chapter.id)}
            </p>
            <h2 className="mt-1 font-serif text-3xl italic text-cream">{review.chapter.title}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-cream/50">
              <span className="font-mono uppercase tracking-wider">
                Length {formatAudioTime(review.chapter.length)}
              </span>
              <span className="rounded-full bg-moss/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#9fb5aa]">
                {audioStatusLabel(review.chapter.status)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => review.jumpChapter(-1)}
              className="inline-flex items-center gap-1 rounded-md border border-cream/12 px-3 py-2 text-xs text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              type="button"
              onClick={() => review.jumpChapter(1)}
              className="inline-flex items-center gap-1 rounded-md border border-cream/12 px-3 py-2 text-xs text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
            >
              Next <ChevronRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => review.setReadAlongOpen(true)}
              className="ml-2 rounded-md bg-cream/10 px-3.5 py-2 text-xs font-medium text-cream transition-colors hover:bg-moss hover:text-charcoal"
            >
              Read along
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
          <div className="relative mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/35">
              Compare · press <kbd className="rounded bg-cream/10 px-1.5 py-0.5 text-cream/70">T</kbd> to
              toggle source
              {review.audioLoading ? ' · loading audio…' : null}
              {review.hasUploadedAudio ? ' · supabase' : null}
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={`${review.source}-${review.sourceFlash}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9fb5aa]"
              >
                Hearing {review.source}
              </motion.p>
            </AnimatePresence>
          </div>

          <section className="rounded-lg border border-cream/10 bg-[#121614] p-4">
            <AudioCompareMultitrack
              ref={playerRef}
              originalUrl={review.originalUrl}
              optimizedUrl={review.optimizedUrl}
              activeSource={review.source}
              playing={review.playing}
              volume={volume}
              trackHeight={68}
              loading={review.audioLoading}
              durationSeconds={review.chapter.length}
              onTimeUpdate={review.setCurrentTime}
              onReady={() => review.setAudioReady(true)}
              onFinish={() => review.setPlaying(false)}
            />
          </section>

          <div className="mt-auto border-t border-cream/10 pt-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <button
                type="button"
                onClick={() => review.setPlaying(!review.playing)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-moss text-cream transition-transform hover:scale-[1.03]"
                aria-label={review.playing ? 'Pause' : 'Play'}
              >
                {review.playing ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} className="ml-0.5" />
                )}
              </button>

              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => review.seek(0)}
                  className="rounded-md p-2 text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream"
                  aria-label="Skip to beginning"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => review.seek(review.currentTime - 10)}
                  className="relative rounded-md p-2 text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream"
                  aria-label="Rewind 10 seconds"
                >
                  <RotateCcw size={16} />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center pt-px font-mono text-[8px] font-medium text-cream/70">
                    10
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => review.seek(review.currentTime + 10)}
                  className="relative rounded-md p-2 text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream"
                  aria-label="Forward 10 seconds"
                >
                  <RotateCw size={16} />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center pt-px font-mono text-[8px] font-medium text-cream/70">
                    10
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Volume2 size={16} className="shrink-0 text-cream/45" aria-hidden />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-cream/15 accent-[#9fb5aa]"
                  aria-label="Volume"
                />
              </div>

              <p className="font-mono text-sm tabular-nums text-cream/70">
                {formatAudioPrecise(review.currentTime)}{' '}
                <span className="text-cream/30">/</span>{' '}
                {formatAudioTime(review.chapter.length)}
              </p>

              <div
                className="ml-auto inline-flex rounded-md border border-cream/12 bg-cream/[0.03] p-0.5"
                role="group"
                aria-label="Audio source"
              >
                <button
                  type="button"
                  onClick={() => review.setSource('original')}
                  className={`rounded px-3 py-1.5 text-xs transition-colors ${
                    review.source === 'original'
                      ? 'bg-cream/15 text-cream'
                      : 'text-cream/45 hover:text-cream/70'
                  }`}
                >
                  Original
                </button>
                <button
                  type="button"
                  onClick={() => review.setSource('optimized')}
                  className={`rounded px-3 py-1.5 text-xs transition-colors ${
                    review.source === 'optimized'
                      ? 'bg-moss text-cream'
                      : 'text-cream/45 hover:text-cream/70'
                  }`}
                >
                  Optimized
                </button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {review.readAlongOpen ? (
            <>
              <motion.button
                type="button"
                aria-label="Close read along"
                className="absolute inset-0 z-20 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => review.setReadAlongOpen(false)}
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                className="absolute inset-y-0 right-0 z-30 flex w-full max-w-md flex-col border-l border-cream/10 bg-[#0f1311] shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-cream/10 px-5 py-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
                      Read along
                    </p>
                    <p className="mt-1 font-serif text-xl italic text-cream">Manuscript sync</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => review.setReadAlongOpen(false)}
                    className="rounded-md p-2 text-cream/50 hover:bg-cream/5 hover:text-cream"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                  <p className="mb-5 text-sm leading-relaxed text-cream/45">
                    Sentences highlight with the playhead. Waveforms on the left stay linked to the
                    same position.
                  </p>
                  <div className="space-y-3">
                    {review.chapter.manuscript.map((sentence) => {
                      const active =
                        review.currentTime >= sentence.start &&
                        review.currentTime < sentence.end;
                      return (
                        <button
                          key={sentence.id}
                          type="button"
                          onClick={() => review.seek(sentence.start)}
                          className={`block w-full rounded-md border px-3 py-3 text-left transition-colors ${
                            active
                              ? 'border-[#9fb5aa]/40 bg-moss/25 text-cream'
                              : 'border-transparent text-cream/55 hover:bg-cream/5 hover:text-cream/80'
                          }`}
                        >
                          <span className="mb-1 block font-mono text-[10px] text-cream/35">
                            {formatAudioPrecise(sentence.start)} – {formatAudioPrecise(sentence.end)}
                          </span>
                          <span className="font-sans text-base leading-snug">{sentence.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
