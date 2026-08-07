import { useCallback, useEffect, useRef, useState } from 'react';

import {
  activeSentenceAt,
  AUDIO_CHAPTERS,
  type AudioChapter,
  type AudioSentence,
} from '@/data/audioReviewMock';
import { fetchChapterAudio } from '@/lib/audiobookTracks';

export type AudioSource = 'original' | 'optimized';

type UseAudioReviewMockOptions = {
  initialChapterId?: number;
  /** Called when transport seeks so the waveform player can follow. */
  onSeek?: (time: number) => void;
};

export function useAudioReviewMock({
  initialChapterId = 13,
  onSeek,
}: UseAudioReviewMockOptions = {}) {
  const onSeekRef = useRef(onSeek);
  onSeekRef.current = onSeek;
  const [chapterId, setChapterId] = useState(initialChapterId);
  const [source, setSource] = useState<AudioSource>('original');
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [readAlongOpen, setReadAlongOpen] = useState(false);
  const [sourceFlash, setSourceFlash] = useState(0);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null);
  const [trackDuration, setTrackDuration] = useState<number | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [audioLoading, setAudioLoading] = useState(true);

  const baseChapter: AudioChapter =
    AUDIO_CHAPTERS.find((c) => c.id === chapterId) ?? AUDIO_CHAPTERS[0]!;

  const chapter: AudioChapter = {
    ...baseChapter,
    length: trackDuration ?? baseChapter.length,
  };

  const activeSentence: AudioSentence | null = activeSentenceAt(chapter, currentTime);

  useEffect(() => {
    let cancelled = false;
    setAudioReady(false);
    setAudioLoading(true);
    setPlaying(false);
    setCurrentTime(0);

    void (async () => {
      const result = await fetchChapterAudio(chapterId);
      if (cancelled) return;
      setOriginalUrl(result.originalUrl);
      setOptimizedUrl(result.optimizedUrl);
      setTrackDuration(result.durationSeconds);
      setAudioLoading(false);
      if (result.optimizedUrl) {
        setSource('optimized');
      } else if (result.originalUrl) {
        setSource('original');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chapterId]);

  const toggleSource = useCallback(() => {
    setSource((prev) => (prev === 'original' ? 'optimized' : 'original'));
    setSourceFlash((n) => n + 1);
  }, []);

  const selectSource = useCallback((next: AudioSource) => {
    setSource(next);
    setSourceFlash((n) => n + 1);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

      if (event.key === 't' || event.key === 'T') {
        event.preventDefault();
        toggleSource();
        return;
      }
      if (event.key === ' ') {
        event.preventDefault();
        setPlaying((p) => !p);
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setCurrentTime((t) => {
          const next = Math.max(0, t - 10);
          onSeekRef.current?.(next);
          return next;
        });
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setCurrentTime((t) => {
          const next = Math.min(chapter.length, t + 10);
          onSeekRef.current?.(next);
          return next;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chapter.length, toggleSource]);

  const seek = useCallback(
    (time: number) => {
      const next = Math.min(chapter.length, Math.max(0, time));
      setCurrentTime(next);
      onSeekRef.current?.(next);
    },
    [chapter.length],
  );

  const selectChapter = useCallback((id: number) => {
    setChapterId(id);
  }, []);

  const jumpChapter = useCallback((direction: -1 | 1) => {
    setChapterId((id) => {
      const index = AUDIO_CHAPTERS.findIndex((c) => c.id === id);
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= AUDIO_CHAPTERS.length) return id;
      return AUDIO_CHAPTERS[nextIndex]!.id;
    });
  }, []);

  return {
    chapters: AUDIO_CHAPTERS,
    chapter,
    chapterId,
    selectChapter,
    jumpChapter,
    source,
    setSource: selectSource,
    toggleSource,
    sourceFlash,
    playing,
    setPlaying,
    currentTime,
    setCurrentTime,
    seek,
    activeSentence,
    readAlongOpen,
    setReadAlongOpen,
    originalUrl,
    optimizedUrl,
    audioReady,
    setAudioReady,
    audioLoading,
    hasUploadedAudio: Boolean(originalUrl || optimizedUrl),
  };
}
