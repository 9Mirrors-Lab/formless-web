import { BrandShell } from '@/components/app-sidebar';

export default function AudibleProcessPage() {
  return (
    <BrandShell activeId="audible-process" crumb="Audible process" noise={false}>
      <iframe
        title="Audible process"
        src="/audible-process.html"
        className="block h-[calc(100dvh-2.5rem)] w-full border-0 bg-[#0A0A09]"
      />
    </BrandShell>
  );
}
