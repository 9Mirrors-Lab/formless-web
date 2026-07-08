import type { PostHogConfig } from 'posthog-js';

export const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
export const posthogHost =
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

export const isPostHogConfigured = Boolean(posthogKey);

export const posthogOptions: Partial<PostHogConfig> = {
  api_host: posthogHost,
  autocapture: true,
  capture_pageview: 'history_change',
  capture_pageleave: true,
  capture_exceptions: true,
  persistence: 'localStorage+cookie',
};
