/**
 * Re-records — client review of updated chapter masters (4–9).
 * Published optimized masters stream from Google Drive (same catalog as Listen).
 */
import { Pause, Play, RotateCcw, RotateCw, SkipBack, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { AudioCompareHandle } from '@/components/audio-review/AudioCompareMultitrack';
import { DriveAudioEngine } from '@/components/audio-review/DriveAudioEngine';
import { ReRecordMarkerStrip } from '@/components/audio-review/ReRecordMarkerStrip';
import { BrandShell } from '@/components/app-sidebar';
import { formatAudioTime, formatChapterIndex } from '@/data/audioBook';
import {
  RE_RECORD_TRACKS,
  reRecordCueNear,
  reRecordTrackByChapterId,
} from '@/data/audioReRecords';
import { useAudiobookReview } from '@/hooks/useAudiobookReview';

export default function AudioReRecordsPage() {
  const playerRef = useRef<AudioCompareHandle>(null);
  const [volume, setVolume] = useState(0.85);

  const onSeek = useCallback((time: number) => {
    playerRef.current?.seek(time);
  }, []);

  const review = useAudiobookReview({ initialChapterId: 4, onSeek });

  const track = useMemo(
    () => reRecordTrackByChapterId(review.chapterId) ?? RE_RECORD_TRACKS[0]!,
    [review.chapterId],
  );
  const activeCue = reRecordCueNear(track, review.currentTime);
  const durationSeconds = review.chapter.length;

  const selectChapter = useCallback(
    (chapterId: number) => {
      review.selectChapter(chapterId);
    },
    [review],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

      if (event.key === ' ') {
        event.preventDefault();
        review.setPlaying(!review.playing);
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        review.seek(review.currentTime - 10);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        review.seek(review.currentTime + 10);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [review]);

  const jumpToCue = useCallback(
    (atSeconds: number) => {
      review.seek(atSeconds);
      review.setPlaying(true);
    },
    [review],
  );

  return (
    <BrandShell activeId="re-records" crumb="Re-records" noise={false}>
      <div className="flex min-h-0 flex-1 flex-col bg-[#080a09] text-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-8 md:py-8">
          <aside className="flex w-full shrink-0 flex-col md:w-[22rem]">
            <header className="shrink-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50">
                Client review · Updated masters
              </p>
              <h1 className="mt-2 font-sans text-2xl tracking-[-0.02em] text-cream md:text-3xl">
                Re-records
              </h1>
              <p className="mt-2 max-w-[36ch] font-sans text-sm leading-relaxed text-cream/55">
                Jump the tags on the waveform to hear each punch. Chapters 4-9 only.
              </p>
            </header>

            <div className="scrollbar-cream mt-5 min-h-0 flex-1 overflow-y-auto rounded-sm border border-cream/12 bg-cream/[0.03]">
              <p className="border-b border-cream/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/45">
                Chapter {formatChapterIndex(track.chapterId)} punches
              </p>
              <ul className="divide-y divide-cream/10">
                {track.cues.map((cue) => {
                  const active = cue.id === activeCue?.id;
                  return (
                    <li key={cue.id}>
                      <button
                        type="button"
                        onClick={() => jumpToCue(cue.atSeconds)}
                        className={`block w-full px-4 py-3 text-left transition-colors ${
                          active
                            ? 'bg-cream/[0.07]'
                            : 'hover:bg-cream/[0.04]'
                        }`}
                      >
                        <span className="flex items-baseline justify-between gap-3">
                          <span
                            className={`font-mono text-[11px] tabular-nums uppercase tracking-[0.14em] ${
                              active ? 'text-[#9fb5aa]' : 'text-cream/45'
                            }`}
                          >
                            {formatAudioTime(cue.atSeconds)}
                          </span>
                          <span
                            className={`rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${
                              active
                                ? 'bg-moss/90 text-cream'
                                : 'bg-cream/10 text-cream/70'
                            }`}
                          >
                            {cue.tag}
                          </span>
                        </span>
                        <span
                          className={`mt-1.5 block font-sans text-[14px] leading-snug ${
                            active ? 'text-cream' : 'text-cream/70'
                          }`}
                        >
                          {cue.note}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <section className="flex min-h-0 min-w-0 flex-1 flex-col rounded-sm border border-cream/10 bg-[#080a09]/90 px-3 py-3 md:px-5 md:py-4">
            <header className="flex shrink-0 items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50">
                  Chapter {formatChapterIndex(track.chapterId)} · Optimized master
                </p>
                <h2 className="mt-1.5 font-sans text-2xl leading-tight tracking-[-0.02em] text-cream md:text-[2rem]">
                  {track.title}
                </h2>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-cream/50">
                  {durationSeconds > 0
                    ? formatAudioTime(durationSeconds)
                    : review.audioLoading
                      ? 'Loading…'
                      : 'Duration pending'}
                  {!review.audioLoading && review.optimizedUrl
                    ? ' · Google Drive'
                    : null}
                  {!review.audioLoading && !review.optimizedUrl
                    ? ' · Master not published yet'
                    : null}
                </p>
              </div>
            </header>

            <div className="mt-5 shrink-0">
              <ReRecordMarkerStrip
                durationSeconds={Math.max(durationSeconds, 1)}
                currentTime={review.currentTime}
                cues={track.cues}
                activeCueId={activeCue?.id ?? null}
                onSeek={jumpToCue}
              />
            </div>

            <DriveAudioEngine
              ref={playerRef}
              src={review.optimizedUrl}
              playing={review.playing}
              volume={volume}
              onTimeUpdate={review.setCurrentTime}
              onReady={() => review.setAudioReady(true)}
              onFinish={() => review.setPlaying(false)}
            />

            <div className="mt-5 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-3">
              <button
                type="button"
                onClick={() => review.setPlaying(!review.playing)}
                disabled={!review.optimizedUrl}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-moss text-cream transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-40"
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
                  className="rounded-full p-2 text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream"
                  aria-label="Skip to beginning"
                >
                  <SkipBack size={16} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => review.seek(review.currentTime - 10)}
                  className="rounded-full p-2 text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream"
                  aria-label="Rewind 10 seconds"
                >
                  <RotateCcw size={16} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => review.seek(review.currentTime + 10)}
                  className="rounded-full p-2 text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream"
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
                {formatAudioTime(durationSeconds)}
              </p>
            </div>

            <nav
              aria-label="Re-record chapters"
              className="scrollbar-cream mt-5 min-h-0 flex-1 overflow-y-auto border-t border-cream/15 pt-3"
            >
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">
                Chapters
              </p>
              <ol className="list-none">
                {RE_RECORD_TRACKS.map((item) => {
                  const active = item.chapterId === review.chapterId;
                  return (
                    <li
                      key={item.chapterId}
                      className="border-b border-cream/10 last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => selectChapter(item.chapterId)}
                        className={`group flex w-full items-baseline gap-3 py-2.5 text-left transition-colors ${
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
                          {formatChapterIndex(item.chapterId)}
                        </span>
                        <span
                          className={`min-w-0 flex-1 font-sans text-[14px] leading-snug tracking-[-0.01em] ${
                            active
                              ? 'font-medium text-cream'
                              : 'font-normal text-cream/80 group-hover:text-cream'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`shrink-0 font-mono text-[11px] tabular-nums tracking-wide ${
                            active
                              ? 'text-cream/65'
                              : 'text-cream/45 group-hover:text-cream/65'
                          }`}
                        >
                          {item.cues.length} tag{item.cues.length === 1 ? '' : 's'}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </section>
        </div>
      </div>
    </BrandShell>
  );
}
