import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  activeSentenceAt,
  AUDIO_LISTEN_ORDER,
  type AudioChapter,
  type AudioSentence,
} from '@/data/audioBook';
import {
  chapterAudioFromTracks,
  chaptersFromTracks,
  listPublishedAudiobookTracks,
  type AudiobookTrack,
} from '@/lib/audiobookTracks';

export type AudioSource = 'original' | 'optimized';

type UseAudiobookReviewOptions = {
  initialChapterId?: number;
  /** Called when transport seeks so the waveform player can follow. */
  onSeek?: (time: number) => void;
};

export function useAudiobookReview({
  initialChapterId = 13,
  onSeek,
}: UseAudiobookReviewOptions = {}) {
  const onSeekRef = useRef(onSeek);
  onSeekRef.current = onSeek;
  const [chapterId, setChapterId] = useState(initialChapterId);
  const [source, setSource] = useState<AudioSource>('original');
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [readAlongOpen, setReadAlongOpen] = useState(false);
  const [sourceFlash, setSourceFlash] = useState(0);
  const [tracks, setTracks] = useState<AudiobookTrack[]>([]);
  const [catalogReady, setCatalogReady] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [audioLoading, setAudioLoading] = useState(true);

  const chapters = useMemo(() => chaptersFromTracks(tracks), [tracks]);

  const baseChapter: AudioChapter =
    chapters.find((chapter) => chapter.id === chapterId) ??
    chapters[0] ?? {
      id: initialChapterId,
      title: '',
      length: 0,
      status: 'pending',
      manuscript: [],
    };

  const audio = chapterAudioFromTracks(tracks, chapterId);
  const originalUrl = audio.originalUrl;
  const optimizedUrl = audio.optimizedUrl;
  const chapter: AudioChapter = {
    ...baseChapter,
    length: audio.durationSeconds ?? baseChapter.length,
  };

  const activeSentence: AudioSentence | null = activeSentenceAt(chapter, currentTime);

  useEffect(() => {
    let cancelled = false;
    setAudioLoading(true);
    void (async () => {
      const result = await listPublishedAudiobookTracks();
      if (cancelled) return;
      const nextTracks = result.ok ? result.tracks : [];
      setTracks(nextTracks);
      setCatalogReady(true);
      setAudioLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const advancingRef = useRef(false);

  useEffect(() => {
    if (!catalogReady) return;
    setAudioReady(false);
    setAudioLoading(true);
    setCurrentTime(0);
    if (optimizedUrl) {
      setSource('optimized');
    } else if (originalUrl) {
      setSource('original');
    }
    setAudioLoading(false);
    advancingRef.current = false;
  }, [catalogReady, chapterId, originalUrl, optimizedUrl]);

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
      const order = chapters.length > 0 ? chapters.map((chapter) => chapter.id) : [...AUDIO_LISTEN_ORDER];
      const index = order.indexOf(id);
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= order.length) return id;
      return order[nextIndex]!;
    });
  }, [chapters]);

  const finishChapter = useCallback(() => {
    if (advancingRef.current) return;
    const order = chapters.length > 0 ? chapters.map((item) => item.id) : [...AUDIO_LISTEN_ORDER];
    const index = order.indexOf(chapterId);
    if (index < 0 || index >= order.length - 1) {
      setPlaying(false);
      return;
    }
    advancingRef.current = true;
    setChapterId(order[index + 1]!);
  }, [chapters, chapterId]);

  return {
    chapters,
    chapter,
    chapterId,
    selectChapter,
    jumpChapter,
    finishChapter,
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
    tracks,
    catalogReady,
    audioReady,
    setAudioReady,
    audioLoading,
    hasUploadedAudio: Boolean(originalUrl || optimizedUrl),
  };
}
