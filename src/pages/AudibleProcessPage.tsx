import { AudibleDeskTabs } from '@/components/AudibleDeskTabs';
import { BrandShell } from '@/components/app-sidebar';

export default function AudibleProcessPage() {
  return (
    <BrandShell activeId="audible-process" crumb="Audible process" noise={false}>
      <div className="flex h-[calc(100dvh-2.5rem)] flex-col bg-[#0A0A09]">
        <div className="shrink-0 border-b border-cream/12 px-4 pt-1 md:px-8">
          <AudibleDeskTabs activeId="audible-process" />
        </div>
        <iframe
          title="Audible process"
          src="/audible-process.html"
          className="block min-h-0 w-full flex-1 border-0 bg-[#0A0A09]"
        />
      </div>
    </BrandShell>
  );
}
