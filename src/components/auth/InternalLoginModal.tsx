import { useEffect } from 'react';
import { XIcon } from 'lucide-react';

import { AuthForm } from '@/components/AuthForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { safeAuthNextPath, stashAuthNextPath } from '@/lib/auth';

export type InternalLoginGate = 'internal' | 'advance-listen';

function currentLocationPath(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function goHome(): void {
  window.location.assign('/');
}

function copyForGate(gate: InternalLoginGate): {
  eyebrow: string;
  title: string;
  description: string;
  defaultPath: string;
} {
  switch (gate) {
    case 'advance-listen':
      return {
        eyebrow: 'Advance Listening Access',
        title: 'Sign in',
        description:
          'This listening room is for approved accounts only. New signups are closed.',
        defaultPath: '/advance-listen',
      };
    case 'internal':
      return {
        eyebrow: 'Member access',
        title: 'Sign in',
        description: 'This area is only open to approved Eyes Closed accounts.',
        defaultPath: '/brand',
      };
    default: {
      const _exhaustive: never = gate;
      throw new Error(`Unhandled login gate: ${_exhaustive}`);
    }
  }
}

/**
 * Login dialog for Brand Studio and other internal routes.
 * Closing it returns home; the protected page is not rendered behind it.
 * Sign-in only; public account creation is closed.
 */
export function InternalLoginModal({
  gate = 'internal',
}: {
  gate?: InternalLoginGate;
}) {
  const { signIn } = useAuth();
  const copy = copyForGate(gate);
  const nextPath = safeAuthNextPath(currentLocationPath(), copy.defaultPath);

  useEffect(() => {
    stashAuthNextPath(nextPath);
  }, [nextPath]);

  return (
    <div className="min-h-[100dvh] bg-[#080a09]">
      <div className="noise-overlay-dark" aria-hidden />
      <Dialog open>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-[#050806]/78 supports-backdrop-filter:backdrop-blur-[3px]"
          className="max-h-[90dvh] overflow-y-auto border-cream/12 bg-[#0e120f] p-6 text-cream shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:max-w-md sm:p-8"
          onEscapeKeyDown={(event) => {
            event.preventDefault();
            goHome();
          }}
          onPointerDownOutside={(event) => {
            event.preventDefault();
            goHome();
          }}
        >
          <button
            type="button"
            className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-md text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
            onClick={goHome}
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
          <DialogHeader className="text-center sm:text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cream/45">
              {copy.eyebrow}
            </p>
            <DialogTitle className="font-serif text-4xl font-normal italic text-cream">
              {copy.title}
            </DialogTitle>
            <DialogDescription className="text-cream/65">
              {copy.description}
            </DialogDescription>
          </DialogHeader>

          <AuthForm
            title={copy.title}
            description={copy.description}
            submitLabel="Sign in"
            mode="signin"
            passwordAutoComplete="current-password"
            showGoogleAuth={false}
            hideIntro
            googleNextPath={nextPath}
            alternateAction={
              <button
                type="button"
                className="font-medium text-cream underline-offset-4 hover:text-white hover:underline"
                onClick={goHome}
              >
                Back to home
              </button>
            }
            onSubmit={async (credentials) => {
              const result = await signIn(credentials);
              if (result.errorMessage) {
                return result;
              }
              return {};
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
