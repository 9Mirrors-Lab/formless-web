import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import type { AudioCompareHandle } from '@/components/audio-review/AudioCompareMultitrack';

type DriveAudioEngineProps = {
  src: string | null;
  playing?: boolean;
  volume?: number;
  onTimeUpdate?: (time: number) => void;
  onReady?: () => void;
  onFinish?: () => void;
};

/** Hidden Google Drive audio element; no waveform decode or fetch. */
export const DriveAudioEngine = forwardRef<AudioCompareHandle, DriveAudioEngineProps>(
  function DriveAudioEngine(
    { src, playing = false, volume = 1, onTimeUpdate, onReady, onFinish },
    ref,
  ) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const onTimeUpdateRef = useRef(onTimeUpdate);
    const onReadyRef = useRef(onReady);
    const onFinishRef = useRef(onFinish);
    const rafRef = useRef<number | null>(null);

    onTimeUpdateRef.current = onTimeUpdate;
    onReadyRef.current = onReady;
    onFinishRef.current = onFinish;

    const stopPoll = useCallback(() => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }, []);

    const pollTime = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      onTimeUpdateRef.current?.(audio.currentTime);
      if (!audio.paused && !audio.ended) {
        rafRef.current = requestAnimationFrame(pollTime);
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          const audio = audioRef.current;
          if (!audio) return;
          void audio.play();
          stopPoll();
          rafRef.current = requestAnimationFrame(pollTime);
        },
        pause: () => {
          audioRef.current?.pause();
          stopPoll();
        },
        seek: (time: number) => {
          const audio = audioRef.current;
          if (!audio) return;
          audio.currentTime = Math.max(0, time);
          onTimeUpdateRef.current?.(audio.currentTime);
        },
        getCurrentTime: () => audioRef.current?.currentTime ?? 0,
        isPlaying: () => {
          const audio = audioRef.current;
          if (!audio) return false;
          return !audio.paused && !audio.ended;
        },
      }),
      [pollTime, stopPoll],
    );

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = Math.max(0, Math.min(1, volume));
    }, [volume]);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio || !src) return;
      if (playing) {
        void audio.play();
        stopPoll();
        rafRef.current = requestAnimationFrame(pollTime);
      } else {
        audio.pause();
        stopPoll();
      }
    }, [playing, pollTime, src, stopPoll]);

    useEffect(() => {
      return () => stopPoll();
    }, [stopPoll]);

    if (!src) return null;

    return (
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        className="sr-only"
        aria-hidden
        onCanPlay={() => onReadyRef.current?.()}
        onTimeUpdate={(event) => onTimeUpdateRef.current?.(event.currentTarget.currentTime)}
        onEnded={() => onFinishRef.current?.()}
      />
    );
  },
);
