import {
  AnalysisWorkspaceTabs,
  type AnalysisWorkspaceTab,
} from '@/components/audio-review/AnalysisWorkspaceTabs';
import { formatChapterIndex } from '@/data/audioBook';
import {
  masterTrackRunFor,
  phaseRecordFor,
} from '@/data/audioMasterPhaseRuns';
import type { StudioChapterRecord } from '@/data/audiobookStudioCatalog';

type StudioAnalysisPanelProps = {
  chapterTitle: string;
  chapterId: number;
  record: StudioChapterRecord;
  onSelectWorkspaceTab: (tab: AnalysisWorkspaceTab) => void;
  onListen: () => void;
};

export function StudioAnalysisPanel({
  chapterTitle,
  chapterId,
  record,
  onSelectWorkspaceTab,
  onListen,
}: StudioAnalysisPanelProps) {
  const run = masterTrackRunFor(chapterId);
  const editorial = phaseRecordFor(run, 2);
  const notes = editorial.notes ?? [];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#0d100e]">
      <header className="shrink-0 border-b border-cream/10 px-5 py-4 md:px-8">
        <AnalysisWorkspaceTabs
          value="analysis"
          onValueChange={onSelectWorkspaceTab}
        />
        <button
          type="button"
          onClick={onListen}
          className="mt-3 min-h-11 text-sm text-cream/50 transition-colors hover:text-cream"
        >
          Back to listen
        </button>
        <h2 className="mt-3 max-w-3xl text-xl font-medium leading-tight tracking-tight text-cream">
          {formatChapterIndex(chapterId)} {chapterTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-cream/55">
          Now on {record.currentRung.label}: {record.currentRung.truth}. Phase 2
          is the editorial read of the take, not a gate.
        </p>
      </header>

      <div className="px-6 py-6 md:px-10">
        {editorial.summary ? (
          <p className="max-w-3xl text-[15px] leading-relaxed text-cream/70">
            {editorial.summary}
          </p>
        ) : (
          <p className="max-w-3xl text-[15px] leading-relaxed text-cream/45">
            No editorial write-up yet. Run mastering through Phase 2 to land the
            assessment here.
          </p>
        )}

        {notes.length > 0 ? (
          <ol className="mt-8 max-w-3xl space-y-4">
            {notes.map((note, index) => (
              <li key={note} className="flex gap-4">
                <span className="mt-0.5 w-6 shrink-0 font-mono text-[11px] tabular-nums text-cream/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-sm leading-relaxed text-cream/60">{note}</p>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
}
