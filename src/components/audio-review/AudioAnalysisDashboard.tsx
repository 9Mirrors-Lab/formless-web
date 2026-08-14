import {
  AnalysisWorkspaceTabs,
  type AnalysisWorkspaceTab,
} from '@/components/audio-review/AnalysisWorkspaceTabs';

type AudioAnalysisDashboardProps = {
  onSelectWorkspaceTab: (tab: AnalysisWorkspaceTab) => void;
};

export function AudioAnalysisDashboard({
  onSelectWorkspaceTab,
}: AudioAnalysisDashboardProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="shrink-0 border-b border-cream/10 px-6 py-8 md:px-10">
        <AnalysisWorkspaceTabs
          value="analysis"
          onValueChange={onSelectWorkspaceTab}
        />
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/40">
          Recording analysis
        </p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl italic leading-[1.12] text-cream md:text-5xl lg:text-[3.35rem]">
          Analysis lives on each track.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/60">
          Open Master phases for the measured pre-flight, restoration notes, and
          post-flight numbers. There is no separate sample report.
        </p>
      </header>
    </div>
  );
}
