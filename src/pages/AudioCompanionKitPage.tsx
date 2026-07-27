/**
 * Legacy /audio/companion route.
 * Companion now opens as a slide-out tray on the editorial workspace.
 */
import { useEffect } from 'react';

export default function AudioCompanionKitPage() {
  useEffect(() => {
    window.location.replace('/audio/editorial?companion=1');
  }, []);

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-[#0a0c0b] font-companion text-cream">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-cream/40">
        Opening companion tray…
      </p>
    </div>
  );
}
