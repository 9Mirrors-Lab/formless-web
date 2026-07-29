import { isPostHogConfigured } from '@/lib/posthog';

/** Routes used for design, review, or internal tooling; excluded from analytics. */
export const INTERNAL_ANALYTICS_PATH_PREFIXES = [
  '/design-system',
  '/components',
  '/icons',
  '/brief',
  '/brief2',
  '/moodboard',
  '/colors',
  '/shader',
  '/shaderEC',
  '/backgrounds',
  '/design-framework',
  '/layout-tests',
  '/brand-kit-export',
  '/brand',
  '/speaker-sheet',
  '/eyes-closed-logo-options',
  '/pattern-mirror',
  '/about-magazine',
  '/client-feedback-revision',
  '/revised',
  '/client/review',
  '/hub',
] as const;

/** Production content routes where session replay is enabled. */
export const SESSION_REPLAY_PATHS = ['/', '/work', '/book', '/science', '/about'] as const;

export function normalizePathname(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

export function currentPathname(): string {
  return normalizePathname(window.location.pathname);
}

export function isInternalAnalyticsPath(pathname: string): boolean {
  const normalized = normalizePathname(pathname);
  return INTERNAL_ANALYTICS_PATH_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}

export function isSessionReplayPath(pathname: string): boolean {
  return (SESSION_REPLAY_PATHS as readonly string[]).includes(normalizePathname(pathname));
}

export function isAnalyticsDisabledByEnv(): boolean {
  return import.meta.env.VITE_PUBLIC_POSTHOG_DISABLED === 'true';
}

export function shouldCaptureAnalytics(pathname = currentPathname()): boolean {
  if (!isPostHogConfigured) {
    return false;
  }
  if (isAnalyticsDisabledByEnv()) {
    return false;
  }
  if (isInternalAnalyticsPath(pathname)) {
    return false;
  }
  return true;
}
