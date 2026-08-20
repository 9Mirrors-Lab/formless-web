/**
 * Editorial2 — studio ladder toward Audible.
 *
 * THESIS: Master phases is the workspace. Status lives in the phase table, not a listen dock.
 * OWN-WORLD: Dark desk, cream on charcoal, moss for completed work, Plus Jakarta Sans only.
 * STORY: Scan six phases per track, expand a row, open notes and metrics.
 * FIRST VIEWPORT: HUD + phase table. No player. No ladder or analysis views.
 * FORM: Operate studio ladder inside the Formless token world. Precisely specified; no concept-seed.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
 */
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { AudioCompanionFlow } from '@/components/audio-review/AudioCompanionFlow';
import {
  companionOpenFromSearch,
  masterPhaseTrackFromSearch,
  setCompanionOpenInUrl,
  setEditorialViewInUrl,
} from '@/components/audio-review/AudioWorkspaceNav';
import { MasterPhasesWorkspace } from '@/components/audio-review/MasterPhasesWorkspace';
import { BrandShell } from '@/components/app-sidebar';
import { AUDIO_BOOK } from '@/data/audioBook';
import {
  MASTER_TRACK_RUNS,
  masterBookProgress,
  masterTrackStatusLabel,
} from '@/data/audioMasterPhaseRuns';

const EDITORIAL_TRAY_PANEL =
  'absolute inset-y-0 right-0 z-30 flex w-full max-w-lg flex-col border-l border-cream/10 bg-[#121614] shadow-xl';

const HUD_LINK =
  'min-h-11 px-1 text-[11px] text-cream/45 transition-colors hover:text-cream';

export default function AudioEditorial2Page() {
  const [masterTrackId] = useState<number | null>(() =>
    masterPhaseTrackFromSearch(),
  );
  const [companionOpen, setCompanionOpen] = useState(() => companionOpenFromSearch());
  const progress = masterBookProgress(MASTER_TRACK_RUNS);

  const closeCompanion = useCallback(() => {
    setCompanionOpen(false);
    setCompanionOpenInUrl(false);
  }, []);

  const openCompanion = useCallback(() => {
    setCompanionOpen(true);
    setCompanionOpenInUrl(true, true);
  }, []);

  useEffect(() => {
    const companionWasOpen = companionOpenFromSearch();
    setEditorialViewInUrl('master-phases', masterTrackId);
    if (companionWasOpen) {
      setCompanionOpenInUrl(true, true);
    }
  }, [masterTrackId]);

  useEffect(() => {
    if (!companionOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      closeCompanion();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCompanion, companionOpen]);

  const shellActiveId = 'audible-studio' as const;

  return (
    <BrandShell activeId={shellActiveId} noise={false}>
      {/*
        THESIS: Master phases is the workspace. Status lives in the phase table, not a listen dock.
        OWN-WORLD: Dark desk, cream on charcoal, moss for completed work, Plus Jakarta Sans only.
        STORY: Scan six phases per track, expand a row, open notes and metrics.
        FIRST VIEWPORT: HUD + phase table. No player. No ladder or analysis views.
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
              <span className="text-cream/75">{progress.ready}</span>
              <span className="text-cream/25">/{progress.total}</span>
            </p>
          </div>
          <dl className="flex min-w-0 flex-[1_1_12rem] flex-wrap items-center gap-x-3 gap-y-0.5">
            {(
              [
                'ready-for-final-qc',
                'in-progress',
                'idle',
              ] as const
            )
              .filter((status) => progress.counts[status] > 0 || status === 'ready-for-final-qc')
              .map((status) => (
                <div key={status} className="flex items-baseline gap-1.5">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream/35">
                    {masterTrackStatusLabel(status)}
                  </dt>
                  <dd className="font-mono text-[11px] tabular-nums text-cream/65">
                    {progress.counts[status]}
                  </dd>
                </div>
              ))}
          </dl>
          <nav className="ml-auto flex flex-wrap items-center gap-3" aria-label="Studio tools">
            <button type="button" onClick={openCompanion} className={HUD_LINK}>
              Recording
            </button>
          </nav>
        </header>

        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#0d100e]">
          <MasterPhasesWorkspace
            focusTrackId={masterTrackId}
            variant="studio"
          />

          <AnimatePresence>
            {companionOpen ? (
              <>
                <motion.button
                  type="button"
                  aria-label="Close recording steps"
                  className="absolute inset-0 z-20 bg-black/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeCompanion}
                />
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
              </>
            ) : null}
          </AnimatePresence>
        </main>
      </div>
    </BrandShell>
  );
}
