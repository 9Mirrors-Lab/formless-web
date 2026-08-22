/**
 * Advance listen — Immersive Formless listen world
 *
 * Visual thesis: Shader is the room. The approved jacket sits on that field
 * as a square object, never larger than the mobile well (381px).
 * Player and track list sit open beside it on desktop; optimized master only.
 * Standalone listen page. Not wrapped in BrandShell; no toolkit nav.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Pause, Play, RotateCcw, RotateCw, SkipBack, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  AudioCompareMultitrack,
  type AudioCompareHandle,
} from '@/components/audio-review/AudioCompareMultitrack';
import { AdvanceListenCoverJacket } from '@/components/audio-review/AdvanceListenCoverJacket';
import { AdvanceListenMobilePlayer } from '@/components/audio-review/AdvanceListenMobilePlayer';
import { AdvanceListenRuntime } from '@/components/audio-review/AdvanceListenRuntime';
import { listenLockup } from '@/components/audio-review/advanceListenType';
import { ListenFieldBackdrop } from '@/components/audio-review/ListenFieldBackdrop';
import {
  AUDIO_BOOK,
  formatAudioRuntime,
  formatAudioTime,
  formatChapterIndex,
} from '@/data/audioBook';
import { useAudiobookReview } from '@/hooks/useAudiobookReview';

const EASE_HEAVY = [0.32, 0.72, 0, 1] as const;

export default function AdvanceListenPage() {
  const playerRef = useRef<AudioCompareHandle>(null);
  const [volume, setVolume] = useState(0.85);
  const [entered, setEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const onSeek = useCallback((time: number) => {
    playerRef.current?.seek(time);
  }, []);
  const review = useAudiobookReview({ initialChapterId: 13, onSeek });

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#080a09] text-cream selection:bg-clay/30 selection:text-cream">
      <div className="relative flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#060807] font-sans text-cream antialiased">
        {/* Atmosphere — chapter shader only (desktop listen world) */}
        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
          <ListenFieldBackdrop chapterId={review.chapterId} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060807]/50 via-transparent to-[#060807]/78" />
        </div>

        <AdvanceListenMobilePlayer
          chapter={review.chapter}
          chapters={review.chapters}
          chapterId={review.chapterId}
          playing={review.playing}
          currentTime={review.currentTime}
          onPlayPause={() => review.setPlaying(!review.playing)}
          onSeek={review.seek}
          onSelectChapter={review.selectChapter}
          onJumpChapter={review.jumpChapter}
        />

        {/* Stage — desktop listen column. Parked offscreen on mobile so the
            waveform engine stays mounted and can play. */}
        <div
          className="relative z-10 flex min-h-0 flex-1 flex-col px-4 pt-4 pb-4 max-md:pointer-events-none max-md:invisible max-md:absolute max-md:top-0 max-md:left-0 max-md:h-[100dvh] max-md:w-[64rem] max-md:-translate-x-full md:px-8 md:pt-5 md:pb-6"
          aria-hidden={isMobile}
          inert={isMobile || undefined}
        >
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6 md:flex-row md:gap-8">
            <div className="flex h-full min-h-0 w-full shrink-0 flex-col md:w-[381px]">
              <div className="flex shrink-0 justify-center md:justify-start">
                <AdvanceListenCoverJacket />
              </div>
              <button
                type="button"
                aria-expanded={review.readAlongOpen}
                aria-controls="advance-listen-read-along"
                onClick={() => review.setReadAlongOpen(!review.readAlongOpen)}
                className="mt-4 flex w-full shrink-0 items-center justify-between rounded-sm border border-cream/20 bg-cream/[0.04] px-4 py-2.5 text-sm text-cream transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[#9fb5aa]/45 hover:bg-cream/[0.08]"
              >
                Read along
                <ChevronDown
                  size={16}
                  strokeWidth={1.5}
                  className={`text-cream/70 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    review.readAlongOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden
                />
              </button>
              <AnimatePresence initial={false}>
                {review.readAlongOpen ? (
                  <motion.div
                    id="advance-listen-read-along"
                    key="read-along"
                    role="region"
                    aria-label="Manuscript"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.45, ease: EASE_HEAVY }}
                    className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-cream/12 bg-[#080a09]/78 shadow-[inset_0_1px_0_rgba(242,240,233,0.06)] backdrop-blur-[10px]"
                  >
                    <p className="shrink-0 px-4 pt-3 pb-1 text-[12px] leading-relaxed text-cream/40">
                      Follow the spoken line as the playhead moves. The clock is the time in the track. Tap a sentence to jump.
                    </p>
                    <div className="scrollbar-cream min-h-0 flex-1 overflow-y-auto px-4 py-3">
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
                              className={`block w-full text-left transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                                active ? 'text-cream' : 'text-cream/35 hover:text-cream/70'
                              }`}
                            >
                              <span
                                className={`font-sans text-[14px] leading-relaxed ${
                                  active
                                    ? 'underline decoration-[#9fb5aa]/50 underline-offset-4'
                                    : ''
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
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            {/* Listen column — quiet work slab so type is not fighting the atmosphere */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 20 }}
              transition={{ duration: 0.9, ease: EASE_HEAVY, delay: 0.08 }}
              className="relative flex min-h-0 min-w-0 flex-1 flex-col rounded-sm bg-[#080a09]/78 px-3 py-3 shadow-[inset_0_1px_0_rgba(242,240,233,0.06)] backdrop-blur-[10px] md:px-5 md:py-4"
            >
              <header className="flex shrink-0 items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className={`${listenLockup.chrome} text-[10px] text-cream/55`}>
                    Chapter {formatChapterIndex(review.chapter.id)} · Advance Listening Edition
                  </p>
                  <h2 className={`${listenLockup.title} mt-1.5 text-3xl leading-tight text-cream md:text-[2.35rem]`}>
                    {review.chapter.title}
                  </h2>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-cream/55">
                    {formatAudioTime(review.chapter.length)}
                  </p>
                </div>
                <AdvanceListenRuntime />
              </header>

              <div className="mt-4 shrink-0">
                <AudioCompareMultitrack
                  ref={playerRef}
                  optimizedUrl={review.optimizedUrl}
                  optimizedOnly
                  activeSource="optimized"
                  playing={review.playing}
                  volume={volume}
                  trackHeight={48}
                  loading={review.audioLoading}
                  durationSeconds={review.chapter.length}
                  onTimeUpdate={review.setCurrentTime}
                  onReady={() => review.setAudioReady(true)}
                  onFinish={review.finishChapter}
                />
              </div>

              <div className="mt-4 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-3">
                <button
                  type="button"
                  onClick={() => review.setPlaying(!review.playing)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-moss text-cream transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03] active:scale-[0.98]"
                  aria-label={review.playing ? 'Pause' : 'Play'}
                >
                  {review.playing ? (
                    <Pause size={18} strokeWidth={1.5} />
                  ) : (
                    <Play size={18} strokeWidth={1.5} className="ml-0.5" />
                  )}
                </button>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => review.seek(0)}
                    className="rounded-full p-2 text-cream/50 transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream/5 hover:text-cream"
                    aria-label="Skip to beginning"
                  >
                    <SkipBack size={16} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => review.seek(review.currentTime - 10)}
                    className="rounded-full p-2 text-cream/50 transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream/5 hover:text-cream"
                    aria-label="Rewind 10 seconds"
                  >
                    <RotateCcw size={16} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => review.seek(review.currentTime + 10)}
                    className="rounded-full p-2 text-cream/50 transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream/5 hover:text-cream"
                    aria-label="Forward 10 seconds"
                  >
                    <RotateCw size={16} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2
                    size={16}
                    strokeWidth={1.5}
                    className="shrink-0 text-cream/45"
                    aria-hidden
                  />
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

              {/* Track list — Operate index: sans + high contrast under the player */}
              <nav
                aria-label="Chapters"
                className="scrollbar-cream mt-5 min-h-0 flex-1 overflow-y-auto border-t border-cream/15 pt-3"
              >
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <p className={`${listenLockup.chrome} text-[10px] text-cream/50`}>
                    Chapters
                  </p>
                  <p className="font-mono text-[10px] tabular-nums uppercase tracking-[0.18em] text-cream/50">
                    {formatAudioRuntime(AUDIO_BOOK.runtimeSeconds)}
                  </p>
                </div>
                <ol className="list-none">
                  {review.chapters.map((chapter) => {
                    const active = chapter.id === review.chapterId;
                    return (
                      <li key={chapter.id} className="border-b border-cream/10 last:border-b-0">
                        <button
                          type="button"
                          onClick={() => review.selectChapter(chapter.id)}
                          className={`group flex w-full items-baseline gap-3 py-2.5 text-left transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                            active
                              ? '-mx-2 rounded-sm bg-cream/[0.05] px-2'
                              : '-mx-2 rounded-sm px-2 hover:bg-cream/[0.03]'
                          }`}
                        >
                          <span
                            className={`w-9 shrink-0 font-mono text-[11px] tabular-nums tracking-wide ${
                              active ? 'text-[#9fb5aa]' : 'text-cream/50'
                            }`}
                          >
                            {formatChapterIndex(chapter.id)}
                          </span>
                          <span
                            className={`min-w-0 flex-1 font-sans text-[14px] leading-snug tracking-[-0.01em] ${
                              active
                                ? 'font-medium text-cream'
                                : 'font-normal text-cream/80 group-hover:text-cream'
                            }`}
                          >
                            {chapter.title}
                          </span>
                          <span
                            className={`shrink-0 font-mono text-[11px] tabular-nums tracking-wide ${
                              active
                                ? 'text-cream/65'
                                : 'text-cream/50 group-hover:text-cream/65'
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
