import { useState, type ReactNode } from 'react';

import { listenLockup } from '@/components/audio-review/advanceListenType';
import { AdvanceListenEmailModal } from '@/components/auth/AdvanceListenEmailModal';
import { useAuth } from '@/context/AuthContext';
import { hasStoredAdvanceListenEmail } from '@/lib/advanceListenAccess';

function AdvanceListenStatusScreen({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#080a09] px-6 text-center">
      <div className="noise-overlay-dark" aria-hidden />
      <div className="relative max-w-md">
        <p className={`${listenLockup.chrome} text-[11px] text-cream/45`}>
          Advance Listening Access
        </p>
        <h1 className={`${listenLockup.book} mt-3 text-4xl text-cream`}>{title}</h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-cream/65">
          {description}
        </p>
      </div>
    </div>
  );
}

/**
 * Public early-listen room. Visitors leave an email; no Eyes Closed account.
 * Signed-in members skip the form. Local Brand Studio bypass does not apply here.
 */
export function RequireAdvanceListenEmail({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const [unlocked, setUnlocked] = useState(() => hasStoredAdvanceListenEmail());

  if (unlocked || user) {
    return children;
  }

  if (status === 'loading') {
    return (
      <AdvanceListenStatusScreen
        title="Loading"
        description="Opening the listening room…"
      />
    );
  }

  if (status === 'misconfigured') {
    return (
      <AdvanceListenStatusScreen
        title="Unavailable"
        description="Email capture is not configured yet. Add your Supabase URL and anon key to the environment."
      />
    );
  }

  return <AdvanceListenEmailModal onUnlocked={() => setUnlocked(true)} />;
}
