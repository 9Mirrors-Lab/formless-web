import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type AnalysisWorkspaceTab = 'analysis' | 'master-phases';

type AnalysisWorkspaceTabsProps = {
  value: AnalysisWorkspaceTab;
  onValueChange: (value: AnalysisWorkspaceTab) => void;
};

export function AnalysisWorkspaceTabs({
  value,
  onValueChange,
}: AnalysisWorkspaceTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        if (next === 'analysis' || next === 'master-phases') {
          onValueChange(next);
        }
      }}
      className="gap-0"
    >
      <TabsList
        variant="line"
        aria-label="Analysis workspace"
        className="h-auto gap-0 rounded-none bg-transparent p-0"
      >
        <TabsTrigger
          value="analysis"
          className="h-auto rounded-none border-0 bg-transparent px-0 py-0 pr-3 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/40 shadow-none after:bottom-[-2px] after:h-px after:bg-[#9fb5aa] data-[state=active]:bg-transparent data-[state=active]:text-cream data-[state=active]:shadow-none hover:text-cream/70 dark:data-[state=active]:bg-transparent"
        >
          Analysis
        </TabsTrigger>
        <TabsTrigger
          value="master-phases"
          className="relative h-auto rounded-none border-0 bg-transparent px-0 py-0 pl-3 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/40 shadow-none after:bottom-[-2px] after:h-px after:bg-[#9fb5aa] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:text-cream/25 before:content-['·'] data-[state=active]:bg-transparent data-[state=active]:text-cream data-[state=active]:shadow-none hover:text-cream/70 dark:data-[state=active]:bg-transparent"
        >
          Master phases
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
