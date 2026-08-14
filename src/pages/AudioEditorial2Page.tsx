/**
 * Editorial2 — studio ladder toward Audible.
 *
 * THESIS: Chapter table is the scan. Status is one line. Listen lives in a grounded dock that survives view changes.
 * OWN-WORLD: Dark desk, cream on charcoal, moss for completed rungs, Plus Jakarta Sans only.
 * STORY: Scan rungs, expand for meaning, keep audio playing while Analysis or Phases overlay.
 * FIRST VIEWPORT: HUD + table + listen dock. Accordion holds status, not the player.
 * FORM: Operate studio ladder inside the Formless token world. Precisely specified; no concept-seed.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
 */
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, RotateCcw, RotateCw, SkipBack, Volume2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
import { MasterPhasesWorkspace } from '@/components/audio-review/MasterPhasesWorkspace';
import { StudioAnalysisPanel } from '@/components/audio-review/StudioAnalysisPanel';
import { StudioChapterTable } from '@/components/audio-review/StudioChapterTable';
import { StudioRungEvidence } from '@/components/audio-review/StudioFileLadder';
import { StudioPhaseResults } from '@/components/audio-review/StudioPhaseResults';
import { BrandShell } from '@/components/app-sidebar';
import { AUDIO_BOOK, formatAudioTime } from '@/data/audioBook';
import {
  studioBookProgress,
  studioCatalogForTracks,
} from '@/data/audiobookStudioCatalog';
import { STUDIO_RUNGS, studioRungNeedsCompanion } from '@/data/studioLadder';
import { useAudiobookReview } from '@/hooks/useAudiobookReview';
import { useStudioApprovals } from '@/hooks/useStudioApprovals';

const EDITORIAL_TRAY_PANEL =
  'absolute inset-y-0 right-0 z-30 flex w-full max-w-lg flex-col border-l border-cream/10 bg-[#121614] shadow-xl';

const HUD_LINK =
  'min-h-11 px-1 text-[11px] text-cream/45 transition-colors hover:text-cream';

export default function AudioEditorial2Page() {
  const playerRef = useRef<AudioCompareHandle>(null);
  const [volume, setVolume] = useState(0.85);
  const [mode, setMode] = useState<EditorialView>(() =>
    companionOpenFromSearch() ? 'listen' : editorialViewFromSearch(),
  );
  const [masterTrackId, setMasterTrackId] = useState<number | null>(() =>
    masterPhaseTrackFromSearch(),
  );
  const [companionOpen, setCompanionOpen] = useState(() => companionOpenFromSearch());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { approvedIds } = useStudioApprovals();
  const onSeek = useCallback((time: number) => {
    playerRef.current?.seek(time);
  }, []);
  const review = useAudiobookReview({ initialChapterId: 13, onSeek });
  const records = useMemo(
    () => studioCatalogForTracks(review.tracks, approvedIds),
    [approvedIds, review.tracks],
  );
  const progress = useMemo(() => studioBookProgress(records), [records]);
  const activeRecord =
    records.find((record) => record.chapterId === review.chapterId) ?? records[0];

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

  const toggleChapter = useCallback(
    (chapterId: number) => {
      setExpandedId((current) => (current === chapterId ? null : chapterId));
      selectView('listen');
      review.selectChapter(chapterId);
    },
    [review, selectView],
  );

  const shellActiveId = 'audible-studio' as const;
  const showCompanionHint = activeRecord
    ? studioRungNeedsCompanion(activeRecord.current)
    : false;

  return (
    <BrandShell activeId={shellActiveId} noise={false}>
      {/*
        THESIS: Chapter table is the scan. Status is one line. Listen lives in a grounded dock that survives view changes.
        OWN-WORLD: Dark desk, cream on charcoal, moss for completed rungs, Plus Jakarta Sans only.
        STORY: Scan rungs, expand for meaning, keep audio playing while Analysis or Phases overlay.
        FIRST VIEWPORT: HUD + table + listen dock. Accordion holds status, not the player.
        FORM: Operate studio ladder inside the Formless token world. Precisely specified; no concept-seed.
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
      */}
      <div className="flex h-[calc(100dvh-2.5rem)] flex-col overflow-hidden bg-[#0a0c0b] font-sans text-cream antialiased">
        <header className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b border-cream/10 bg-[#101412] px-4 py-1.5">
          <div className="flex min-w-0 items-baseline gap-2">
            <h1 className="text-[13px] font-medium tracking-tight text-cream">
              {AUDIO_BOOK.title}
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">
              Toward Audible
            </p>
            <p className="font-mono text-[11px] tabular-nums text-cream/45">
              <span className="text-cream/75">{progress.towardAudible}</span>
              <span className="text-cream/25">/{progress.total}</span>
            </p>
          </div>
          <dl className="flex min-w-0 flex-[1_1_12rem] flex-wrap items-center gap-x-3 gap-y-0.5">
            {STUDIO_RUNGS.map((rung) => (
              <div key={rung.id} className="flex items-baseline gap-1.5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream/35">
                  {rung.short}
                </dt>
                <dd className="font-mono text-[11px] tabular-nums text-cream/65">
                  {progress.counts[rung.id]}
                </dd>
              </div>
            ))}
          </dl>
          <nav className="ml-auto flex flex-wrap items-center gap-3" aria-label="Studio views">
            <button
              type="button"
              onClick={() => selectView('listen')}
              className={`${HUD_LINK} ${mode === 'listen' ? 'text-cream' : ''}`}
            >
              Ladder
            </button>
            <button
              type="button"
              onClick={() => selectView('analysis')}
              className={`${HUD_LINK} ${mode === 'analysis' ? 'text-cream' : ''}`}
            >
              Analysis
            </button>
            <button
              type="button"
              onClick={() => selectView('master-phases')}
              className={`${HUD_LINK} ${mode === 'master-phases' ? 'text-cream' : ''}`}
            >
              Phases
            </button>
            <button type="button" onClick={openCompanion} className={HUD_LINK}>
              Recording
            </button>
            <button type="button" onClick={openReadAlong} className={HUD_LINK}>
              Read along
            </button>
          </nav>
        </header>

        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#0d100e]">
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
            <StudioChapterTable
              chapters={review.chapters}
              records={records}
              expandedId={expandedId}
              onToggle={toggleChapter}
              detail={
                activeRecord ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <StudioRungEvidence record={activeRecord} />
                      <button
                        type="button"
                        onClick={openCompanion}
                        className="min-h-11 text-[12px] text-cream/40 underline decoration-cream/20 underline-offset-4 hover:text-cream/70"
                      >
                        {showCompanionHint
                          ? 'Open recording steps'
                          : 'Recording steps'}
                      </button>
                    </div>
                    <StudioPhaseResults chapterId={review.chapterId} density="hud" />
                  </div>
                ) : null
              }
            />

            {mode === 'analysis' && activeRecord ? (
              <div className="absolute inset-0 z-20 flex flex-col bg-[#0d100e]">
                <StudioAnalysisPanel
                  chapterId={review.chapterId}
                  chapterTitle={review.chapter.title}
                  record={activeRecord}
                  onSelectWorkspaceTab={(tab) => selectView(tab)}
                  onListen={() => selectView('listen')}
                />
              </div>
            ) : null}

            {mode === 'master-phases' ? (
              <div className="absolute inset-0 z-20 flex flex-col bg-[#0d100e]">
                <MasterPhasesWorkspace
                  focusTrackId={masterTrackId}
                  variant="studio"
                  onSelectWorkspaceTab={(tab) => selectView(tab)}
                  onListen={() => selectView('listen')}
                />
              </div>
            ) : null}

            <AnimatePresence>
              {mode === 'listen' && (review.readAlongOpen || companionOpen) ? (
              <>
                <motion.button
                  type="button"
                  aria-label={companionOpen ? 'Close recording steps' : 'Close read along'}
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
                  <div className="flex items-center justify-between border-b border-cream/10 px-5 py-3">
                    <p className="text-[15px] font-medium text-cream">Manuscript</p>
                    <button
                      type="button"
                      onClick={() => review.setReadAlongOpen(false)}
                      className="inline-flex h-11 w-11 items-center justify-center text-cream/45 hover:text-cream"
                      aria-label="Close"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    <p className="mb-4 text-[12px] leading-relaxed text-cream/40">
                      Follow the spoken line as the playhead moves. Tap a sentence to jump.
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
                  aria-label="Recording steps"
                >
                  <div className="flex items-center justify-between border-b border-cream/10 px-5 py-3">
                    <p className="text-[15px] font-medium text-cream">Recording steps</p>
                    <button
                      type="button"
                      onClick={closeCompanion}
                      className="inline-flex h-11 w-11 items-center justify-center text-cream/45 hover:text-cream"
                      aria-label="Close"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    <AudioCompanionFlow variant="tray" />
                  </div>
                </motion.aside>
                ) : null}
              </>
            ) : null}
          </AnimatePresence>
          </div>

          <footer className="shrink-0 border-t border-cream/10 bg-[#101412] px-4 py-3 md:px-5">
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <p className="min-w-0 truncate text-[13px] text-cream/70">
                {review.chapter.title}
              </p>
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
              trackHeight={40}
              loading={review.audioLoading}
              durationSeconds={review.chapter.length}
              onSourceChange={review.setSource}
              onTimeUpdate={review.setCurrentTime}
              onReady={() => review.setAudioReady(true)}
              onFinish={() => review.setPlaying(false)}
            />
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <button
                type="button"
                onClick={() => review.setPlaying(!review.playing)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-moss text-cream transition-transform hover:scale-[1.03]"
                aria-label={review.playing ? 'Pause' : 'Play'}
              >
                {review.playing ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} className="ml-0.5" />
                )}
              </button>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => review.seek(0)}
                  className="inline-flex h-11 w-11 items-center justify-center text-cream/50 transition-colors hover:text-cream"
                  aria-label="Skip to beginning"
                >
                  <SkipBack size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => review.seek(review.currentTime - 10)}
                  className="relative inline-flex h-11 w-11 items-center justify-center text-cream/50 transition-colors hover:text-cream"
                  aria-label="Rewind 10 seconds"
                >
                  <RotateCcw size={14} />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center pt-px font-mono text-[8px] font-medium text-cream/70">
                    10
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => review.seek(review.currentTime + 10)}
                  className="relative inline-flex h-11 w-11 items-center justify-center text-cream/50 transition-colors hover:text-cream"
                  aria-label="Forward 10 seconds"
                >
                  <RotateCw size={14} />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center pt-px font-mono text-[8px] font-medium text-cream/70">
                    10
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 size={14} className="shrink-0 text-cream/45" aria-hidden />
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
              <p className="font-mono text-[11px] tabular-nums text-cream/65">
                {formatAudioTime(review.currentTime)}{' '}
                <span className="text-cream/30">/</span>{' '}
                {formatAudioTime(review.chapter.length)}
              </p>
            </div>
          </footer>
        </main>
      </div>
    </BrandShell>
  );
}
