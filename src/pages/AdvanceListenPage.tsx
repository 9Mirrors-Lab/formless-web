/**
 * Advance listen — Immersive Formless listen world
 *
 * Visual thesis: Void Light cover is the room.
 * Player and track list sit open in that field; optimized master only.
 * Standalone listen page. Not wrapped in BrandShell; no toolkit nav.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, RotateCcw, RotateCw, SkipBack, Volume2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  AudioCompareMultitrack,
  type AudioCompareHandle,
} from '@/components/audio-review/AudioCompareMultitrack';
import { AdvanceListenMobilePlayer } from '@/components/audio-review/AdvanceListenMobilePlayer';
import { FORMLESS_COVER_DIRECTIONS } from '@/components/audio-review/FormlessBookCoverPanel';
import {
  formatAudioTime,
  formatChapterIndex,
} from '@/data/audioReviewMock';
import { useAudioReviewMock } from '@/hooks/useAudioReviewMock';

const EASE_HEAVY = [0.32, 0.72, 0, 1] as const;

/** Locked cover direction for editorial v2 atmosphere. */
const VOID_LIGHT_COVER =
  FORMLESS_COVER_DIRECTIONS.find((c) => c.id === 'c') ?? FORMLESS_COVER_DIRECTIONS[0]!;

export default function AdvanceListenPage() {
  const playerRef = useRef<AudioCompareHandle>(null);
  const [volume, setVolume] = useState(0.85);
  const [entered, setEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const onSeek = useCallback((time: number) => {
    playerRef.current?.seek(time);
  }, []);
  const review = useAudioReviewMock({ initialChapterId: 13, onSeek });

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
        {/* Atmosphere — Void Light only (desktop listen world) */}
        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
          <motion.img
            src={VOID_LIGHT_COVER.src}
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{
              opacity: review.playing ? 0.52 : 0.4,
              scale: review.playing ? 1.04 : 1.02,
            }}
            transition={{ duration: 1.1, ease: EASE_HEAVY }}
            className="absolute inset-0 h-full w-full scale-105 object-cover object-[50%_28%] blur-[3px]"
          />
          <div className="absolute inset-0 bg-[#060807]/55" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_48%_38%,rgba(159,181,170,0.14)_0%,transparent_52%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_85%,rgba(242,240,233,0.04)_0%,transparent_42%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060807] via-[#060807]/65 to-[#060807]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060807]/80 via-transparent to-[#060807]/65" />
          <div className="absolute inset-0 opacity-[0.45]">
            {[12, 28, 44, 61, 77, 19, 53, 88, 33, 69].map((left, i) => (
              <span
                key={`${left}-${i}`}
                className="absolute h-0.5 w-0.5 rounded-full bg-cream/50"
                style={{
                  left: `${left}%`,
                  top: `${14 + ((i * 19) % 70)}%`,
                  opacity: 0.18 + (i % 4) * 0.1,
                }}
              />
            ))}
          </div>
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
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
            {/* Listen column — quiet work slab so type is not fighting the atmosphere */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 20 }}
              transition={{ duration: 0.9, ease: EASE_HEAVY, delay: 0.08 }}
              className="relative flex min-h-0 min-w-0 flex-1 flex-col rounded-sm bg-[#080a09]/78 px-3 py-3 shadow-[inset_0_1px_0_rgba(242,240,233,0.06)] backdrop-blur-[10px] md:px-5 md:py-4"
            >
              <header className="flex shrink-0 items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/55">
                    Chapter {formatChapterIndex(review.chapter.id)} · Advance Listening Edition
                  </p>
                  <h2 className="mt-1.5 font-serif text-3xl italic leading-tight text-cream md:text-[2.35rem]">
                    {review.chapter.title}
                  </h2>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-cream/55">
                    {formatAudioTime(review.chapter.length)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => review.setReadAlongOpen(true)}
                  className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-cream/20 bg-cream/[0.04] px-4 py-2 text-sm text-cream transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[#9fb5aa]/45 hover:bg-cream/[0.08] active:scale-[0.98]"
                >
                  Read along
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cream/10 text-xs text-cream/85 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                    ↗
                  </span>
                </button>
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
                  onFinish={() => review.setPlaying(false)}
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
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/50">
                  Chapters
                </p>
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

        {/* Read along overlay */}
        <AnimatePresence>
          {review.readAlongOpen && !isMobile ? (
            <>
              <motion.button
                type="button"
                aria-label="Close read along"
                className="absolute inset-0 z-20 bg-black/55"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE_HEAVY }}
                onClick={() => review.setReadAlongOpen(false)}
              />
              <motion.aside
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.55, ease: EASE_HEAVY }}
                className="absolute inset-x-3 bottom-3 top-12 z-30 mx-auto flex max-w-xl flex-col overflow-hidden border border-cream/12 bg-[#121614]/96 md:inset-y-6 md:right-8 md:left-auto md:w-full"
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
                    className="rounded-full p-2 text-cream/45 transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream/5 hover:text-cream"
                    aria-label="Close"
                  >
                    <X size={18} strokeWidth={1.5} />
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
                          className={`block w-full text-left transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                            active ? 'text-cream' : 'text-cream/35 hover:text-cream/70'
                          }`}
                        >
                          <span
                            className={`font-sans text-lg leading-relaxed md:text-xl ${
                              active
                                ? 'underline decoration-[#9fb5aa]/50 underline-offset-8'
                                : ''
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
      </div>
    </div>
  );
}
