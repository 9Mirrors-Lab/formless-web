import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchChapterAudio } from '@/lib/audiobookTracks';

const INTRODUCTION_CHAPTER_ID = 0;

type IntroductionAudioStatus = 'loading' | 'ready' | 'missing';

export function useIntroductionAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<IntroductionAudioStatus>('loading');
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const audio = await fetchChapterAudio(INTRODUCTION_CHAPTER_ID);
      if (cancelled) return;
      const nextSrc = audio.optimizedUrl ?? audio.originalUrl;
      if (!nextSrc) {
        setStatus('missing');
        return;
      }
      setSrc(nextSrc);
      if (audio.durationSeconds && audio.durationSeconds > 0) {
        setDuration(audio.durationSeconds);
      }
      setStatus('ready');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const node = audioRef.current;
    if (!node || !src) return;

    const onTime = () => setCurrentTime(node.currentTime);
    const onMeta = () => {
      if (Number.isFinite(node.duration) && node.duration > 0) {
        setDuration(node.duration);
      }
    };
    const onEnded = () => setPlaying(false);
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);

    node.addEventListener('timeupdate', onTime);
    node.addEventListener('loadedmetadata', onMeta);
    node.addEventListener('ended', onEnded);
    node.addEventListener('pause', onPause);
    node.addEventListener('play', onPlay);

    return () => {
      node.removeEventListener('timeupdate', onTime);
      node.removeEventListener('loadedmetadata', onMeta);
      node.removeEventListener('ended', onEnded);
      node.removeEventListener('pause', onPause);
      node.removeEventListener('play', onPlay);
    };
  }, [src]);

  const toggle = useCallback(() => {
    const node = audioRef.current;
    if (!node || status !== 'ready') return;
    if (node.paused) {
      void node.play();
    } else {
      node.pause();
    }
  }, [status]);

  const seekRatio = useCallback((ratio: number) => {
    const node = audioRef.current;
    if (!node || !Number.isFinite(node.duration) || node.duration <= 0) return;
    const next = Math.min(1, Math.max(0, ratio)) * node.duration;
    node.currentTime = next;
    setCurrentTime(next);
  }, []);

  return {
    audioRef,
    src,
    status,
    playing,
    currentTime,
    duration,
    toggle,
    seekRatio,
  };
}
