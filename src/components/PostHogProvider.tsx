import { PostHogProvider as PHProvider } from 'posthog-js/react';
import type { ReactNode } from 'react';
import { isPostHogConfigured, posthogKey, posthogOptions } from '@/lib/posthog';

type PostHogProviderProps = {
  children: ReactNode;
};

export function PostHogProvider({ children }: PostHogProviderProps) {
  if (!isPostHogConfigured || !posthogKey) {
    return <>{children}</>;
  }

  return (
    <PHProvider apiKey={posthogKey} options={posthogOptions}>
      {children}
    </PHProvider>
  );
}
