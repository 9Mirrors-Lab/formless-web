/**
 * Audio mockup B — Editorial listen + analysis (Audible Master)
 *
 * Visual thesis: Dark reading room; cream type on charcoal; Formless brand leads;
 * audio compare stays spare, not DAW chrome. Analysis is editorial report, not DAW meters.
 * Companion ritual lives on /audio/companion. This page is Listen / Analysis only.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, RotateCcw, RotateCw, SkipBack, Volume2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AudioAnalysisDashboard } from '@/components/audio-review/AudioAnalysisDashboard';
import {
  AudioCompareMultitrack,
  type AudioCompareHandle,
} from '@/components/audio-review/AudioCompareMultitrack';
import {
  AudioWorkspaceNav,
  editorialViewFromSearch,
  setEditorialViewInUrl,
  type EditorialView,
} from '@/components/audio-review/AudioWorkspaceNav';
import { audioChapterStatusIcon } from '@/components/audio-review/audioStatusIcons';
import { FormlessBookCoverPanel } from '@/components/audio-review/FormlessBookCoverPanel';
import { BrandShell } from '@/components/app-sidebar';
import {
  AUDIO_BOOK,
  audioStatusLabel,
  formatAudioTime,
  formatChapterIndex,
  type AudioChapterStatus,
} from '@/data/audioReviewMock';
import { useAudioReviewMock } from '@/hooks/useAudioReviewMock';

function statusTone(status: AudioChapterStatus): string {
  switch (status) {
    case 'approved':
      return 'text-[#9fb5aa]';
    case 'ready':
      return 'text-amber-300/80';
    case 'recorded':
      return 'text-cream/55';
    case 'pending':
      return 'text-cream/35';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export default function AudioEditorialMockupPage() {
  const playerRef = useRef<AudioCompareHandle>(null);
  const [volume, setVolume] = useState(0.85);
  const [mode, setMode] = useState<EditorialView>(() => editorialViewFromSearch());
  const onSeek = useCallback((time: number) => {
    playerRef.current?.seek(time);
  }, []);
  const review = useAudioReviewMock({ initialChapterId: 1, onSeek });

  // Old tray deep-links land on the companion page.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('companion') === '1') {
      window.location.replace('/audio/companion');
    }
  }, []);

  const selectView = useCallback((view: EditorialView) => {
    setMode(view);
    setEditorialViewInUrl(view);
  }, []);

  return (
    <BrandShell activeId="audible-master" crumb="Audible Master" noise={false}>
    <div className="flex h-[calc(100dvh-2.5rem)] overflow-hidden bg-[#0a0c0b] font-sans text-cream antialiased">
      <aside className="hidden w-[300px] shrink-0 flex-col border-r border-cream/10 bg-[#101412] md:flex">
        <FormlessBookCoverPanel chapters={review.chapters} />

        <nav className="min-h-0 flex-1 overflow-y-auto px-5 py-2" aria-label="Chapters">
          <p className="mb-1 border-b border-cream/10 pb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/35">
            Chapter
          </p>
          <ol className="list-none">
            {review.chapters.map((chapter) => {
              const active = chapter.id === review.chapterId;
              return (
                <li key={chapter.id} className="border-b border-cream/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      selectView('listen');
                      review.selectChapter(chapter.id);
                    }}
                    className="group flex w-full items-baseline gap-2.5 py-3 text-left transition-colors"
                  >
                    <span
                      className="mt-1 inline-flex w-3.5 shrink-0 justify-center"
                      title={audioStatusLabel(chapter.status)}
                      aria-label={audioStatusLabel(chapter.status)}
                    >
                      {audioChapterStatusIcon(chapter.status, 'sm')}
                    </span>
                    <span
                      className={`min-w-0 flex-1 font-serif text-[15px] leading-snug tracking-tight ${
                        active
                          ? 'italic text-cream'
                          : 'text-cream/55 group-hover:text-cream/85'
                      }`}
                    >
                      <span
                        className={`mr-2 font-mono text-[11px] not-italic tabular-nums ${
                          active ? 'text-cream/45' : 'text-cream/30'
                        }`}
                      >
                        {formatChapterIndex(chapter.id)}
                      </span>
                      {chapter.title}
                    </span>
                    <span
                      className={`shrink-0 font-mono text-[10px] tabular-nums tracking-wide ${
                        active ? 'text-cream/50' : 'text-cream/25 group-hover:text-cream/40'
                      }`}
                    >
                      {formatAudioTime(chapter.length)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col bg-[#0d100e]">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-cream/10 px-5 py-3 md:px-8">
          <AudioWorkspaceNav active={mode} onSelectView={selectView} />

          {mode === 'listen' ? (
            <button
              type="button"
              onClick={() => review.setReadAlongOpen(true)}
              className="shrink-0 border border-cream/15 bg-transparent px-4 py-2.5 text-sm text-cream transition-colors hover:border-[#9fb5aa]/50 hover:bg-moss hover:text-cream"
            >
              Read along
            </button>
          ) : null}
        </div>

        {mode === 'analysis' ? (
          <AudioAnalysisDashboard />
        ) : (
          <>
            <header className="border-b border-cream/10 px-6 py-8 md:px-10">
              <div className="flex w-full max-w-[900px] items-end justify-between gap-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/40">
                    Chapter {formatChapterIndex(review.chapter.id)} · {AUDIO_BOOK.format}
                  </p>
                  <h2 className="mt-2 font-serif text-4xl italic leading-tight text-cream md:text-5xl">
                    {review.chapter.title}
                  </h2>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-cream/50">
                    <span className="font-mono text-[11px] uppercase tracking-wider">
                      <span className="text-cream/35">Length</span>{' '}
                      {formatAudioTime(review.chapter.length)}
                    </span>
                    <span className="h-3 w-px bg-cream/20" aria-hidden="true" />
                    <span
                      className={`font-mono text-[11px] uppercase tracking-wider ${statusTone(review.chapter.status)}`}
                    >
                      <span className="text-cream/35">Status</span>{' '}
                      {audioStatusLabel(review.chapter.status)}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <div className="flex min-h-0 w-full max-w-[900px] flex-1 flex-col overflow-y-auto px-6 py-8 md:px-10">
              <p className="mb-6 text-sm leading-relaxed text-cream/45">
                Listen to the original chapter recording, then the optimized mix. Press{' '}
                <kbd className="rounded border border-cream/15 bg-cream/5 px-1.5 py-0.5 font-mono text-[11px] text-cream/70">
                  T
                </kbd>{' '}
                to flip sources without losing your place.
              </p>

              <section className="mb-8 border-b border-cream/10 pb-6">
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-2xl italic text-cream">Compare</h3>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${review.source}-${review.sourceFlash}`}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]"
                      aria-live="polite"
                      aria-label={`Hearing ${review.source}`}
                    >
                      <span
                        className={
                          review.source === 'original' ? 'text-cream' : 'text-cream/30'
                        }
                      >
                        Original
                      </span>
                      <span className="text-cream/25" aria-hidden>
                        ·
                      </span>
                      <span
                        className={
                          review.source === 'optimized' ? 'text-[#9fb5aa]' : 'text-cream/30'
                        }
                      >
                        Optimized
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <AudioCompareMultitrack
                  ref={playerRef}
                  originalUrl={review.originalUrl}
                  optimizedUrl={review.optimizedUrl}
                  activeSource={review.source}
                  playing={review.playing}
                  volume={volume}
                  trackHeight={56}
                  loading={review.audioLoading}
                  durationSeconds={review.chapter.length}
                  onSourceChange={review.setSource}
                  onTimeUpdate={review.setCurrentTime}
                  onReady={() => review.setAudioReady(true)}
                  onFinish={() => review.setPlaying(false)}
                />

                <div className="mt-5 flex gap-4">
                  <div className="w-[88px] shrink-0" aria-hidden />
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-3">
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

                    <p className="font-mono text-sm tabular-nums text-cream/65">
                      {formatAudioTime(review.currentTime)}{' '}
                      <span className="text-cream/30">/</span>{' '}
                      {formatAudioTime(review.chapter.length)}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}

        <AnimatePresence>
          {review.readAlongOpen && mode === 'listen' ? (
            <>
              <motion.button
                type="button"
                aria-label="Close read along"
                className="absolute inset-0 z-20 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => review.setReadAlongOpen(false)}
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 32 }}
                className="absolute inset-y-0 right-0 z-30 flex w-full max-w-lg flex-col border-l border-cream/10 bg-[#121614] shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/40">
                      Read along
                    </p>
                    <p className="mt-1 font-serif text-2xl italic text-cream">Manuscript</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => review.setReadAlongOpen(false)}
                    className="p-2 text-cream/45 hover:text-cream"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                  <p className="mb-6 text-sm leading-relaxed text-cream/40">
                    Follow the spoken line as the playhead moves. Tap a sentence to jump.
                  </p>
                  <div className="space-y-5">
                    {review.chapter.manuscript.map((sentence) => {
                      const active =
                        review.currentTime >= sentence.start &&
                        review.currentTime < sentence.end;
                      return (
                        <button
                          key={sentence.id}
                          type="button"
                          onClick={() => review.seek(sentence.start)}
                          className={`block w-full text-left transition-colors ${
                            active ? 'text-cream' : 'text-cream/35 hover:text-cream/70'
                          }`}
                        >
                          <span
                            className={`font-sans text-lg leading-relaxed md:text-xl ${
                              active ? 'underline decoration-[#9fb5aa]/50 underline-offset-8' : ''
                            }`}
                          >
                            {sentence.text}
                          </span>
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
    </BrandShell>
  );
}
