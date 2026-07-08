import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

function currentUrl(): string {
  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}`;
}

/** Ensures each route reports a pageview when the shell mounts or history changes. */
export function PostHogPageView() {
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog) {
      return;
    }

    posthog.register({
      app: 'formless-web',
      path: window.location.pathname,
    });
  }, [posthog]);

  useEffect(() => {
    if (!posthog) {
      return;
    }

    const capture = () => {
      posthog.capture('$pageview', { $current_url: currentUrl() });
    };

    window.addEventListener('popstate', capture);
    return () => window.removeEventListener('popstate', capture);
  }, [posthog]);

  return null;
}
