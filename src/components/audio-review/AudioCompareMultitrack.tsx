import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import MultiTrack from 'wavesurfer-multitrack';

import {
  WAVE_GRADIENTS,
} from '@/components/audio-review/waveformTheme';
import { extractAudioPeaks } from '@/lib/extractAudioPeaks';
import { isGoogleDriveMediaUrl } from '@/lib/audiobookTracks';

export type AudioCompareHandle = {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
  isPlaying: () => boolean;
};

type AudioCompareMultitrackProps = {
  originalUrl?: string | null;
  optimizedUrl?: string | null;
  activeSource?: 'original' | 'optimized';
  playing?: boolean;
  /** Master output level 0–1; applied to the audible source track. */
  volume?: number;
  className?: string;
  trackHeight?: number;
  /** When true, wait before creating Multitrack so we don't flash demo then remount. */
  loading?: boolean;
  /** Optional known duration; otherwise taken from the loaded media. */
  durationSeconds?: number | null;
  /** Single optimized waveform; hides the original lane and source rail. */
  optimizedOnly?: boolean;
  onSourceChange?: (source: 'original' | 'optimized') => void;
  onTimeUpdate?: (time: number) => void;
  onReady?: () => void;
  onFinish?: () => void;
};

type TrackPeaks = {
  original: number[][];
  optimized: number[][] | null;
  duration: number;
};

function getScrollEl(container: HTMLElement): HTMLElement | null {
  const child = container.firstElementChild;
  return child instanceof HTMLElement ? child : null;
}

/** Visible seconds at default zoom for long chapters (rest is pan). */
const DEFAULT_VIEW_SECONDS = 90;

/** Timeline labels: `:10` under a minute; `1:10` once past 60s. */
function formatCompareTimelineTime(seconds: number): string {
  if (seconds / 60 > 1) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
  }
  const rounded = Math.round(seconds * 1000) / 1000;
  if (rounded === 0) return '0';
  return `:${rounded}`;
}

function audioFormatBadge(url: string): string {
  const path = url.split('?')[0]?.toLowerCase() ?? '';
  if (path.endsWith('.mp3')) return 'MP3';
  if (path.endsWith('.wav')) return 'WAV';
  if (path.endsWith('.m4a') || path.endsWith('.mp4') || path.endsWith('.aac')) {
    return 'M4A';
  }
  return 'AUDIO';
}

/**
 * wavesurfer-multitrack stack: Original + Optimized, synced timeline.
 * Long chapters start zoomed to a ~90s window; wheel / shift-drag / footer scrollbar pan.
 *
 * Peaks are precomputed once per URL so wavesurfer does not re-fetch/decode the
 * full M4A for drawing (that path aborts on chapter change and leaves a blank wave).
 */
export const AudioCompareMultitrack = forwardRef<
  AudioCompareHandle,
  AudioCompareMultitrackProps
>(function AudioCompareMultitrack(
  {
    originalUrl,
    optimizedUrl,
    activeSource = 'optimized',
    playing = false,
    volume = 1,
    className = '',
    trackHeight = 72,
    loading = false,
    durationSeconds = null,
    optimizedOnly = false,
    onSourceChange,
    onTimeUpdate,
    onReady,
    onFinish,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const driveAudioRef = useRef<HTMLAudioElement | null>(null);
  const multitrackRef = useRef<ReturnType<typeof MultiTrack.create> | null>(null);
  const activeSourceRef = useRef(activeSource);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onReadyRef = useRef(onReady);
  const onFinishRef = useRef(onFinish);
  const rafRef = useRef<number | null>(null);
  const panDragRef = useRef<{
    startX: number;
    startScroll: number;
    trackWidth: number;
    thumbWidth: number;
    maxScroll: number;
  } | null>(null);

  const [peaksReady, setPeaksReady] = useState(false);
  const [peaksError, setPeaksError] = useState<string | null>(null);
  const [trackPeaks, setTrackPeaks] = useState<TrackPeaks | null>(null);
  const [driveTime, setDriveTime] = useState(0);
  const [scrollMetrics, setScrollMetrics] = useState({
    scrollLeft: 0,
    clientWidth: 0,
    scrollWidth: 0,
  });

  activeSourceRef.current = activeSource;
  onTimeUpdateRef.current = onTimeUpdate;
  onReadyRef.current = onReady;
  onFinishRef.current = onFinish;

  const hasOriginal = Boolean(originalUrl);
  const resolvedOriginal = originalUrl;
  const hasOptimized = Boolean(optimizedUrl);
  const resolvedOptimized = optimizedUrl || null;
  const waveformUrl = optimizedOnly ? resolvedOptimized : resolvedOriginal;
  const isDriveMedia = isGoogleDriveMediaUrl(waveformUrl);
  const hasUploadedAudio = optimizedOnly
    ? hasOptimized
    : hasOriginal || hasOptimized;
  const laneCount = optimizedOnly ? 1 : hasOptimized ? 2 : 1;

  const peaksLoading =
    !isDriveMedia &&
    (loading || (hasUploadedAudio && (!peaksReady || !trackPeaks)));

  const syncScrollMetrics = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const scrollEl = getScrollEl(container);
    if (!scrollEl) {
      setScrollMetrics({ scrollLeft: 0, clientWidth: 0, scrollWidth: 0 });
      return;
    }
    setScrollMetrics({
      scrollLeft: scrollEl.scrollLeft,
      clientWidth: scrollEl.clientWidth,
      scrollWidth: scrollEl.scrollWidth,
    });
  }, []);

  const setScrollLeft = useCallback((next: number) => {
    const container = containerRef.current;
    if (!container) return;
    const scrollEl = getScrollEl(container);
    if (!scrollEl) return;
    const max = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
    scrollEl.scrollLeft = Math.max(0, Math.min(max, next));
    syncScrollMetrics();
  }, [syncScrollMetrics]);

  const stopPoll = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const pollTime = useCallback(() => {
    const drive = driveAudioRef.current;
    if (drive) {
      onTimeUpdateRef.current?.(drive.currentTime);
      setDriveTime(drive.currentTime);
      if (!drive.paused && !drive.ended) {
        rafRef.current = requestAnimationFrame(pollTime);
      }
      return;
    }
    const mt = multitrackRef.current;
    if (!mt) return;
    onTimeUpdateRef.current?.(mt.getCurrentTime());
    if (mt.isPlaying()) {
      rafRef.current = requestAnimationFrame(pollTime);
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      play: () => {
        const drive = driveAudioRef.current;
        if (drive) {
          void drive.play();
          stopPoll();
          rafRef.current = requestAnimationFrame(pollTime);
          return;
        }
        multitrackRef.current?.play();
        stopPoll();
        rafRef.current = requestAnimationFrame(pollTime);
      },
      pause: () => {
        driveAudioRef.current?.pause();
        multitrackRef.current?.pause();
        stopPoll();
      },
      seek: (time: number) => {
        const drive = driveAudioRef.current;
        if (drive) {
          drive.currentTime = Math.max(0, time);
          setDriveTime(drive.currentTime);
          onTimeUpdateRef.current?.(drive.currentTime);
          return;
        }
        multitrackRef.current?.setTime(time);
        onTimeUpdateRef.current?.(time);
      },
      getCurrentTime: () =>
        driveAudioRef.current?.currentTime ??
        multitrackRef.current?.getCurrentTime() ??
        0,
      isPlaying: () => {
        const drive = driveAudioRef.current;
        if (drive) return !drive.paused && !drive.ended;
        return multitrackRef.current?.isPlaying() ?? false;
      },
    }),
    [pollTime, stopPoll],
  );

  // Precompute peaks before Multitrack mounts (one fetch/decode per URL).
  useEffect(() => {
    if (isDriveMedia) {
      setPeaksReady(true);
      setTrackPeaks(null);
      setPeaksError(null);
      return;
    }
    if (loading || !waveformUrl) {
      setPeaksReady(false);
      setTrackPeaks(null);
      setPeaksError(null);
      return;
    }

    const controller = new AbortController();
    setPeaksReady(false);
    setTrackPeaks(null);
    setPeaksError(null);

    void (async () => {
      try {
        if (optimizedOnly) {
          const optimized = await extractAudioPeaks(waveformUrl, {
            signal: controller.signal,
          });
          if (controller.signal.aborted) return;
          let duration = optimized.duration;
          if (durationSeconds != null && durationSeconds > 0) {
            duration = durationSeconds;
          }
          setTrackPeaks({
            original: [],
            optimized: optimized.peaks,
            duration,
          });
          setPeaksReady(true);
          return;
        }

        const original = await extractAudioPeaks(resolvedOriginal!, {
          signal: controller.signal,
        });
        let optimizedPeaks: number[][] | null = null;
        let duration = original.duration;

        if (resolvedOptimized) {
          const optimized = await extractAudioPeaks(resolvedOptimized, {
            signal: controller.signal,
          });
          optimizedPeaks = optimized.peaks;
          duration = Math.max(duration, optimized.duration);
        }

        if (controller.signal.aborted) return;

        if (durationSeconds != null && durationSeconds > 0) {
          duration = durationSeconds;
        }

        setTrackPeaks({
          original: original.peaks,
          optimized: optimizedPeaks,
          duration,
        });
        setPeaksReady(true);
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error instanceof DOMException && error.name === 'AbortError') return;
        const message =
          error instanceof Error ? error.message : 'Waveform decode failed';
        console.error('audiobook waveform peaks failed', message);
        setPeaksError(message);
        setPeaksReady(false);
        setTrackPeaks(null);
      }
    })();

    return () => controller.abort();
  }, [
    isDriveMedia,
    loading,
    waveformUrl,
    optimizedOnly,
    resolvedOriginal,
    resolvedOptimized,
    durationSeconds,
  ]);

  useEffect(() => {
    if (loading || !peaksReady || !trackPeaks || !waveformUrl) return;
    if (optimizedOnly && !trackPeaks.optimized) return;
    const container = containerRef.current;
    if (!container) return;

    const muted = WAVE_GRADIENTS.muted;
    const moss = WAVE_GRADIENTS.moss;

    const optimizedLane = {
      id: 'optimized',
      url: resolvedOptimized ?? waveformUrl,
      peaks: trackPeaks.optimized ?? trackPeaks.original,
      startPosition: 0,
      volume: 1,
      options: {
        height: trackHeight,
        waveColor: moss.wave,
        progressColor: moss.progress,
        barWidth: 2,
        barGap: 1,
        barRadius: 1,
        normalize: true,
      },
    };

    const tracks = optimizedOnly
      ? [optimizedLane]
      : [
          {
            id: 'original',
            url: resolvedOriginal!,
            peaks: trackPeaks.original,
            startPosition: 0,
            volume: 1,
            options: {
              height: trackHeight,
              waveColor: muted.wave,
              progressColor: muted.progress,
              barWidth: 2,
              barGap: 1,
              barRadius: 1,
              normalize: true,
            },
          },
          ...(hasOptimized && resolvedOptimized && trackPeaks.optimized
            ? [
                {
                  ...optimizedLane,
                  url: resolvedOptimized,
                  peaks: trackPeaks.optimized,
                  volume: activeSourceRef.current === 'optimized' ? 1 : 0,
                },
              ]
            : []),
        ];

    if (!optimizedOnly && hasOptimized) {
      tracks[0]!.volume = activeSourceRef.current === 'original' ? 1 : 0;
    }

    const width = Math.max(container.clientWidth, 320);
    const duration = trackPeaks.duration > 0 ? trackPeaks.duration : 120;
    const initialPx = Math.max(
      4,
      width / Math.min(duration, DEFAULT_VIEW_SECONDS),
    );

    const multitrack = MultiTrack.create(tracks, {
      container,
      minPxPerSec: initialPx,
      cursorColor: '#9fb5aa',
      cursorWidth: 1,
      trackBackground: '#0e1110',
      trackBorderColor: 'rgba(242, 240, 233, 0.1)',
      rightButtonDrag: false,
      dragBounds: true,
      timelineOptions: {
        formatTimeCallback: formatCompareTimelineTime,
      },
    });

    multitrackRef.current = multitrack;

    const readyUnsub = multitrack.on('canplay', () => {
      onReadyRef.current?.();
      // Layout settles after peaks paint; sync pan scrollbar.
      requestAnimationFrame(() => syncScrollMetrics());
    });

    let panStartX = 0;
    let panStartScroll = 0;
    let panning = false;

    const onWheel = (event: WheelEvent) => {
      const scrollEl = getScrollEl(container);
      if (!scrollEl) return;
      if (scrollEl.scrollWidth <= scrollEl.clientWidth + 1) return;

      // Map vertical or horizontal wheel / trackpad to timeline pan.
      if (Math.abs(event.deltaX) > 0.5 || Math.abs(event.deltaY) > 0.5) {
        event.preventDefault();
        scrollEl.scrollLeft += event.deltaX + event.deltaY;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      // Shift / Alt / middle-mouse drag pans without seeking.
      if (event.button === 1 || event.altKey || event.shiftKey) {
        const scrollEl = getScrollEl(container);
        if (!scrollEl || scrollEl.scrollWidth <= scrollEl.clientWidth + 1) return;
        event.preventDefault();
        event.stopPropagation();
        panning = true;
        panStartX = event.clientX;
        panStartScroll = scrollEl.scrollLeft;
        scrollEl.setPointerCapture(event.pointerId);
        scrollEl.style.cursor = 'grabbing';
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!panning) return;
      const scrollEl = getScrollEl(container);
      if (!scrollEl) return;
      scrollEl.scrollLeft = panStartScroll - (event.clientX - panStartX);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!panning) return;
      panning = false;
      const scrollEl = getScrollEl(container);
      if (scrollEl) {
        scrollEl.style.cursor = '';
        try {
          scrollEl.releasePointerCapture(event.pointerId);
        } catch {
          // ignore
        }
      }
    };

    const onScroll = () => syncScrollMetrics();
    const scrollEl = getScrollEl(container);
    scrollEl?.addEventListener('scroll', onScroll, { passive: true });
    const resizeObserver = new ResizeObserver(() => syncScrollMetrics());
    if (scrollEl) resizeObserver.observe(scrollEl);
    resizeObserver.observe(container);
    requestAnimationFrame(() => syncScrollMetrics());

    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      stopPoll();
      if (typeof readyUnsub === 'function') readyUnsub();
      scrollEl?.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      multitrack.destroy();
      multitrackRef.current = null;
    };
  }, [
    loading,
    peaksReady,
    trackPeaks,
    waveformUrl,
    resolvedOriginal,
    resolvedOptimized,
    hasOptimized,
    optimizedOnly,
    trackHeight,
    stopPoll,
    syncScrollMetrics,
  ]);

  useEffect(() => {
    const drive = driveAudioRef.current;
    if (drive) {
      drive.volume = Math.max(0, Math.min(1, volume));
    }
    const mt = multitrackRef.current;
    if (!mt) return;
    const level = Math.max(0, Math.min(1, volume));
    if (optimizedOnly || !hasOptimized) {
      mt.setTrackVolume(0, level);
      return;
    }
    mt.setTrackVolume(0, activeSource === 'original' ? level : 0);
    mt.setTrackVolume(1, activeSource === 'optimized' ? level : 0);
  }, [activeSource, hasOptimized, optimizedOnly, volume]);

  useEffect(() => {
    const drive = driveAudioRef.current;
    if (drive) {
      if (playing) {
        void drive.play();
        stopPoll();
        rafRef.current = requestAnimationFrame(pollTime);
      } else {
        drive.pause();
        stopPoll();
      }
      return;
    }
    const mt = multitrackRef.current;
    if (!mt) return;
    if (playing) {
      mt.play();
      stopPoll();
      rafRef.current = requestAnimationFrame(pollTime);
    } else {
      mt.pause();
      stopPoll();
    }
  }, [playing, pollTime, stopPoll]);

  useEffect(() => {
    setDriveTime(0);
  }, [waveformUrl]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const drive = driveAudioRef.current;
      if (drive) {
        if (playing && drive.ended) onFinishRef.current?.();
        return;
      }
      const mt = multitrackRef.current;
      if (!mt || !playing) return;
      const t = mt.getCurrentTime();
      if (!mt.isPlaying() && t > 0.5) {
        onFinishRef.current?.();
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [playing]);

  const driveDuration =
    durationSeconds && durationSeconds > 0
      ? durationSeconds
      : driveAudioRef.current?.duration && Number.isFinite(driveAudioRef.current.duration)
        ? driveAudioRef.current.duration
        : 0;
  const driveProgress =
    driveDuration > 0 ? Math.min(1, Math.max(0, driveTime / driveDuration)) : 0;

  const onDriveSeekPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDriveMedia || driveDuration <= 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const time = ratio * driveDuration;
    const drive = driveAudioRef.current;
    if (drive) drive.currentTime = time;
    setDriveTime(time);
    onTimeUpdateRef.current?.(time);
  };

  const { scrollLeft, clientWidth, scrollWidth } = scrollMetrics;
  const canPan = scrollWidth > clientWidth + 1;
  const maxScroll = Math.max(0, scrollWidth - clientWidth);
  const thumbRatio = canPan ? clientWidth / scrollWidth : 1;
  const thumbWidthPct = canPan ? Math.max(thumbRatio * 100, 12) : 100;
  const thumbLeftPct = canPan
    ? (scrollLeft / maxScroll) * (100 - thumbWidthPct)
    : 0;

  const onPanTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canPan) return;
    const track = event.currentTarget;
    const rect = track.getBoundingClientRect();
    const trackWidth = rect.width;
    const thumbWidth = (thumbWidthPct / 100) * trackWidth;
    const clickX = event.clientX - rect.left;
    const nextLeft = Math.max(
      0,
      Math.min(trackWidth - thumbWidth, clickX - thumbWidth / 2),
    );
    const travel = trackWidth - thumbWidth;
    setScrollLeft(travel > 0 ? (nextLeft / travel) * maxScroll : 0);
  };

  const onPanThumbPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canPan) return;
    event.preventDefault();
    event.stopPropagation();
    const track = event.currentTarget.parentElement;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const trackWidth = rect.width;
    const thumbWidth = (thumbWidthPct / 100) * trackWidth;
    panDragRef.current = {
      startX: event.clientX,
      startScroll: scrollLeft,
      trackWidth,
      thumbWidth,
      maxScroll,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPanThumbPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = panDragRef.current;
    if (!drag) return;
    const travel = drag.trackWidth - drag.thumbWidth;
    if (travel <= 0) return;
    const deltaScroll =
      ((event.clientX - drag.startX) / travel) * drag.maxScroll;
    setScrollLeft(drag.startScroll + deltaScroll);
  };

  const onPanThumbPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!panDragRef.current) return;
    panDragRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      {optimizedOnly ? null : (
        <div
          className="flex w-[88px] shrink-0 flex-col"
          role={onSourceChange ? 'group' : undefined}
          aria-label={onSourceChange ? 'Audio source' : undefined}
          aria-hidden={onSourceChange ? undefined : true}
        >
          <button
            type="button"
            disabled={!onSourceChange}
            onClick={() => onSourceChange?.('original')}
            className={`flex flex-col justify-center border-b border-cream/8 px-0.5 text-left transition-colors ${
              onSourceChange
                ? 'cursor-pointer hover:bg-cream/[0.03]'
                : 'cursor-default'
            }`}
            style={{ height: trackHeight }}
            aria-pressed={onSourceChange ? activeSource === 'original' : undefined}
          >
            <p
              className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                activeSource === 'original' ? 'text-cream' : 'text-cream/45'
              }`}
            >
              Original
            </p>
            <span className="mt-1 font-mono text-[9px] text-cream/25">
              {originalUrl
                ? audioFormatBadge(originalUrl)
                : loading
                  ? '…'
                  : 'PENDING'}
            </span>
          </button>
          <button
            type="button"
            disabled={!onSourceChange || !hasOptimized}
            onClick={() => onSourceChange?.('optimized')}
            className={`flex flex-col justify-center px-0.5 text-left transition-colors ${
              onSourceChange && hasOptimized
                ? 'cursor-pointer hover:bg-cream/[0.03]'
                : 'cursor-default'
            }`}
            style={{ height: trackHeight }}
            aria-pressed={onSourceChange ? activeSource === 'optimized' : undefined}
          >
            <p
              className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                activeSource === 'optimized' ? 'text-[#9fb5aa]' : 'text-[#9fb5aa]/55'
              }`}
            >
              Optimized
            </p>
            <span className="mt-1 font-mono text-[9px] text-[#9fb5aa]/45">
              {optimizedUrl ? audioFormatBadge(optimizedUrl) : 'PENDING'}
            </span>
          </button>
        </div>
      )}
      <div className="audio-compare-scroll min-w-0 flex-1 overflow-hidden rounded-md border border-cream/10 bg-[#0e1110]">
        {isDriveMedia && waveformUrl ? (
          <>
            <audio
              ref={driveAudioRef}
              src={waveformUrl}
              preload="metadata"
              onCanPlay={() => onReadyRef.current?.()}
              onTimeUpdate={(event) => {
                const time = event.currentTarget.currentTime;
                setDriveTime(time);
                onTimeUpdateRef.current?.(time);
              }}
              onEnded={() => onFinishRef.current?.()}
            />
            <button
              type="button"
              className="relative flex w-full items-center px-3 text-left"
              style={{ height: trackHeight }}
              onClick={(event) => {
                if (driveDuration <= 0) return;
                const rect = event.currentTarget.getBoundingClientRect();
                const ratio = Math.min(
                  1,
                  Math.max(0, (event.clientX - rect.left) / rect.width),
                );
                const time = ratio * driveDuration;
                const drive = driveAudioRef.current;
                if (drive) drive.currentTime = time;
                setDriveTime(time);
                onTimeUpdateRef.current?.(time);
              }}
              aria-label="Seek mastered audio"
            >
              <span
                className="absolute inset-y-0 left-0 bg-[#9fb5aa]/20"
                style={{ width: `${driveProgress * 100}%` }}
              />
              <span className="relative font-mono text-[10px] uppercase tracking-[0.18em] text-cream/55">
                Mastered · Google Drive · MP3
              </span>
            </button>
          </>
        ) : !hasUploadedAudio && !loading ? (
          <div
            className="flex items-center px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/35"
            style={{ height: trackHeight }}
          >
            {optimizedOnly
              ? 'Optimized master not uploaded yet'
              : 'Original master not uploaded yet'}
          </div>
        ) : peaksLoading ? (
          <div
            className="flex items-center px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/35"
            style={{ height: trackHeight * laneCount }}
          >
            {peaksError ? 'Waveform failed to load' : 'Loading waveform…'}
          </div>
        ) : (
          <div ref={containerRef} id="audio-compare-waveform" className="w-full" />
        )}
        {!hasOptimized && !optimizedOnly ? (
          <div
            className="flex items-center border-t border-cream/8 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9fb5aa]/45"
            style={{ height: trackHeight }}
          >
            Optimized master not uploaded yet
          </div>
        ) : null}
        <div className="border-t border-cream/8 px-3 py-2">
          <div
            className={`relative h-1 w-full rounded-full bg-cream/15 ${
              isDriveMedia || canPan ? 'cursor-pointer' : 'opacity-40'
            }`}
            role="scrollbar"
            aria-label={isDriveMedia ? 'Seek mastered audio' : 'Pan waveform'}
            aria-orientation="horizontal"
            aria-controls="audio-compare-waveform"
            aria-valuemin={0}
            aria-valuemax={isDriveMedia ? Math.round(driveDuration) : Math.round(maxScroll)}
            aria-valuenow={
              isDriveMedia ? Math.round(driveTime) : Math.round(scrollLeft)
            }
            onPointerDown={isDriveMedia ? onDriveSeekPointerDown : onPanTrackPointerDown}
          >
            <div
              className={`absolute top-0 h-1 rounded-full ${
                isDriveMedia
                  ? 'bg-[#9fb5aa]/70'
                  : canPan
                    ? 'cursor-grab bg-cream/45 active:cursor-grabbing'
                    : 'bg-cream/25'
              }`}
              style={{
                width: isDriveMedia
                  ? `${Math.max(driveProgress * 100, 2)}%`
                  : `${thumbWidthPct}%`,
                left: isDriveMedia ? '0%' : `${thumbLeftPct}%`,
              }}
              onPointerDown={isDriveMedia ? undefined : onPanThumbPointerDown}
              onPointerMove={isDriveMedia ? undefined : onPanThumbPointerMove}
              onPointerUp={isDriveMedia ? undefined : onPanThumbPointerUp}
              onPointerCancel={isDriveMedia ? undefined : onPanThumbPointerUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
