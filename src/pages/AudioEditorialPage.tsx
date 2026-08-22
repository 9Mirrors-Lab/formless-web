/**
 * Editorial listen + analysis (Audible Master)
 *
 * Visual thesis: Dark reading room; cream type on charcoal; Formless brand leads;
 * audio compare stays spare, not DAW chrome. Analysis is per-track, not a sample report.
 * Recording Companion opens as a right tray (same width as Read along).
 * Listen = Audible Master. Analysis / Master phases stay as in-page tabs.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, RotateCcw, RotateCw, SkipBack, Volume2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AudioAnalysisDashboard } from '@/components/audio-review/AudioAnalysisDashboard';
import { AudioCompanionFlow } from '@/components/audio-review/AudioCompanionFlow';
import {
  AudioCompareMultitrack,
  type AudioCompareHandle,
} from '@/components/audio-review/AudioCompareMultitrack';
import {
  companionOpenFromSearch,
  editorialViewFromSearch,
  masterPhaseTrackFromSearch,
  setCompanionOpenInUrl,
  setEditorialViewInUrl,
  type EditorialView,
} from '@/components/audio-review/AudioWorkspaceNav';
import { audioChapterStatusIcon } from '@/components/audio-review/audioStatusIcons';
import { FormlessBookCoverPanel } from '@/components/audio-review/FormlessBookCoverPanel';
import { MasterPhasesWorkspace } from '@/components/audio-review/MasterPhasesWorkspace';
import { BrandShell } from '@/components/app-sidebar';
import {
  AUDIO_BOOK,
  audioStatusLabel,
  formatAudioTime,
  formatChapterIndex,
  type AudioChapterStatus,
} from '@/data/audioBook';
import { useAudiobookReview } from '@/hooks/useAudiobookReview';

/** Shared with Read along so both trays stay the same width. */
const EDITORIAL_TRAY_PANEL =
  'absolute inset-y-0 right-0 z-30 flex w-full max-w-lg flex-col border-l border-cream/10 bg-[#121614] shadow-xl';

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

export default function AudioEditorialPage() {
  const playerRef = useRef<AudioCompareHandle>(null);
  const [volume, setVolume] = useState(0.85);
  const [mode, setMode] = useState<EditorialView>(() =>
    companionOpenFromSearch() ? 'listen' : editorialViewFromSearch(),
  );
  const [masterTrackId, setMasterTrackId] = useState<number | null>(() =>
    masterPhaseTrackFromSearch(),
  );
  const [companionOpen, setCompanionOpen] = useState(() => companionOpenFromSearch());
  const onSeek = useCallback((time: number) => {
    playerRef.current?.seek(time);
  }, []);
  const review = useAudiobookReview({ initialChapterId: 13, onSeek });

  const setReadAlongOpen = review.setReadAlongOpen;

  const closeCompanion = useCallback(() => {
    setCompanionOpen(false);
    setCompanionOpenInUrl(false);
  }, []);

  const openCompanion = useCallback(() => {
    setReadAlongOpen(false);
    setMode('listen');
    setCompanionOpen(true);
    setCompanionOpenInUrl(true);
  }, [setReadAlongOpen]);

  const openReadAlong = useCallback(() => {
    closeCompanion();
    setReadAlongOpen(true);
  }, [closeCompanion, setReadAlongOpen]);

  const closeTrays = useCallback(() => {
    setReadAlongOpen(false);
    closeCompanion();
  }, [closeCompanion, setReadAlongOpen]);

  useEffect(() => {
    if (!companionOpen && !review.readAlongOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      closeTrays();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeTrays, companionOpen, review.readAlongOpen]);

  const selectView = useCallback((view: EditorialView, trackId: number | null = null) => {
    setMode(view);
    setCompanionOpen(false);
    if (view !== 'master-phases') {
      setMasterTrackId(null);
      setEditorialViewInUrl(view);
      return;
    }
    setMasterTrackId(trackId);
    setEditorialViewInUrl(view, trackId);
  }, []);

  const shellActiveId = 'audible';

  return (
    <BrandShell
      activeId={shellActiveId}
      crumb={
        mode === 'master-phases'
          ? 'Master phases'
          : mode === 'analysis'
            ? 'Analysis'
            : 'Audible Master'
      }
      noise={false}
    >
    <div className="flex h-[calc(100dvh-2.5rem)] overflow-hidden bg-[#0a0c0b] font-sans text-cream antialiased">
      <aside className="hidden w-[300px] shrink-0 flex-col border-r border-cream/10 bg-[#101412] md:flex">
        <FormlessBookCoverPanel chapters={review.chapters} />

        <nav className="scrollbar-cream min-h-0 flex-1 overflow-y-auto px-5 py-3" aria-label="Chapters">
          <p className="mb-1 border-b border-cream/10 pb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/35">
            Chapter
          </p>
          <ol className="list-none">
            {review.chapters.map((chapter) => {
              const active =
                mode === 'master-phases'
                  ? chapter.id === masterTrackId
                  : chapter.id === review.chapterId;
              return (
                <li key={chapter.id} className="border-b border-cream/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      if (mode === 'master-phases') {
                        selectView('master-phases', chapter.id);
                        return;
                      }
                      selectView('listen');
                      review.selectChapter(chapter.id);
                    }}
                    className="group flex w-full items-baseline gap-2.5 py-2.5 text-left transition-colors"
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
        {mode === 'listen' ? (
          <div className="flex shrink-0 items-center justify-end gap-4 border-b border-cream/10 px-5 py-3 md:px-8">
            <button
              type="button"
              onClick={openReadAlong}
              className="shrink-0 border border-cream/15 bg-transparent px-4 py-2.5 text-sm text-cream transition-colors hover:border-[#9fb5aa]/50 hover:bg-moss hover:text-cream"
            >
              Read along
            </button>
          </div>
        ) : null}

        {mode === 'analysis' ? (
          <AudioAnalysisDashboard
            onSelectWorkspaceTab={(tab) => selectView(tab)}
          />
        ) : mode === 'master-phases' ? (
          <MasterPhasesWorkspace
            focusTrackId={masterTrackId}
            onSelectWorkspaceTab={(tab) => selectView(tab)}
          />
        ) : (
          <>
            <header className="border-b border-cream/10 px-6 py-5 md:px-10">
              <div className="flex w-full max-w-[900px] items-end justify-between gap-6">
                <div>
                  <button
                    type="button"
                    onClick={openCompanion}
                    aria-expanded={companionOpen}
                    aria-controls="recording-companion-tray"
                    className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9fb5aa]/80 underline decoration-[#9fb5aa]/35 underline-offset-[5px] transition-colors hover:text-[#9fb5aa] hover:decoration-[#9fb5aa]/70"
                  >
                    Recording Companion
                  </button>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/40">
                    Chapter {formatChapterIndex(review.chapter.id)} · {AUDIO_BOOK.format}
                  </p>
                  <h2 className="mt-1.5 font-serif text-3xl italic leading-tight text-cream md:text-4xl">
                    {review.chapter.title}
                  </h2>
                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-sm text-cream/50">
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

            <div className="flex min-h-0 w-full max-w-[900px] flex-1 flex-col overflow-y-auto px-6 py-5 md:px-10">
              <p className="mb-4 text-sm leading-relaxed text-cream/45">
                Listen to the original chapter recording, then the optimized mix. Press{' '}
                <kbd className="rounded border border-cream/15 bg-cream/5 px-1.5 py-0.5 font-mono text-[11px] text-cream/70">
                  T
                </kbd>{' '}
                to flip sources without losing your place.
              </p>

              <section className="mb-6 border-b border-cream/10 pb-5">
                <div className="mb-3 flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-xl italic text-cream">Compare</h3>
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
          {mode === 'listen' && (review.readAlongOpen || companionOpen) ? (
            <>
              <motion.button
                type="button"
                aria-label={companionOpen ? 'Close recording companion' : 'Close read along'}
                className="absolute inset-0 z-20 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeTrays}
              />
              {review.readAlongOpen ? (
              <motion.aside
                key="read-along-tray"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 32 }}
                className={EDITORIAL_TRAY_PANEL}
              >
                <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/40">
                      Read along
                    </p>
                    <p className="mt-1 font-serif text-xl italic text-cream">Manuscript</p>
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
                  <p className="mb-4 text-[12px] leading-relaxed text-cream/40">
                    Follow the spoken line as the playhead moves. The clock is the time in the track. Tap a sentence to jump.
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
                          className={`block w-full text-left transition-colors ${
                            active ? 'text-cream' : 'text-cream/35 hover:text-cream/70'
                          }`}
                        >
                          <span
                            className={`font-sans text-[14px] leading-relaxed ${
                              active ? 'underline decoration-[#9fb5aa]/50 underline-offset-4' : ''
                            }`}
                          >
                            {sentence.text}
                          </span>
                          <span className="mt-1 block select-all font-mono text-[10px] uppercase tracking-[0.14em] text-cream/30 tabular-nums">
                            {formatAudioTime(sentence.start)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.aside>
              ) : null}
              {companionOpen ? (
              <motion.aside
                key="companion-tray"
                id="recording-companion-tray"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 32 }}
                className={EDITORIAL_TRAY_PANEL}
                aria-label="Recording companion"
              >
                <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/40">
                      Recording Companion
                    </p>
                    <p className="mt-1 font-serif text-2xl italic text-cream">Companion</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeCompanion}
                    className="p-2 text-cream/45 hover:text-cream"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                  <AudioCompanionFlow variant="tray" />
                </div>
              </motion.aside>
              ) : null}
            </>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
    </BrandShell>
  );
}
