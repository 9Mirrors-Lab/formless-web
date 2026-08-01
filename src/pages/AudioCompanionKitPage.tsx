/**
 * Audible companion kit — full page (setup → room tone → read → send).
 */
import { AudioCompanionFlow } from '@/components/audio-review/AudioCompanionFlow';
import { BrandPageBody } from '@/components/BrandPageHeader';
import { BrandShell } from '@/components/app-sidebar';

export default function AudioCompanionKitPage() {
  return (
    <BrandShell activeId="audible" crumb="Audible">
      <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
        <BrandPageBody>
          <AudioCompanionFlow />
        </BrandPageBody>
      </div>
    </BrandShell>
  );
}
