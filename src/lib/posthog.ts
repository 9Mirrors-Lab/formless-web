import type { PostHogConfig } from 'posthog-js';
import {
  currentPathname,
  isInternalAnalyticsPath,
  isSessionReplayPath,
  shouldCaptureAnalytics,
} from '@/lib/analyticsPaths';

export const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
export const posthogHost =
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

export const isPostHogConfigured = Boolean(posthogKey);

export const posthogOptions: Partial<PostHogConfig> = {
  api_host: posthogHost,
  autocapture: true,
  capture_pageview: true,
  capture_pageleave: true,
  capture_exceptions: true,
  persistence: 'localStorage+cookie',
  disable_session_recording: true,
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: '[data-private]',
  },
  before_send: (event) => {
    if (!event) {
      return null;
    }

    const pathname = currentPathname();
    if (!shouldCaptureAnalytics(pathname)) {
      return null;
    }

    const eventPath =
      typeof event.properties?.$pathname === 'string'
        ? event.properties.$pathname
        : pathname;

    if (isInternalAnalyticsPath(eventPath)) {
      return null;
    }

    return event;
  },
  loaded: (client) => {
    const pathname = currentPathname();

    if (!shouldCaptureAnalytics(pathname)) {
      client.opt_out_capturing();
      return;
    }

    client.register({
      app: 'formless-web',
      page_category: isSessionReplayPath(pathname) ? 'core' : 'other',
    });

    if (isSessionReplayPath(pathname)) {
      client.startSessionRecording();
    }
  },
};
