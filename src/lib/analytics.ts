import posthog from 'posthog-js';
import { shouldCaptureAnalytics } from '@/lib/analyticsPaths';
import { isPostHogConfigured } from '@/lib/posthog';

export type SignupSource = 'home_invitation' | 'about_stay_close' | 'book_page';

export type SignupFailureReason = 'invalid_email' | 'server_error';

type AnalyticsProperties = Record<string, string | number | boolean | null>;

function canCapture(): boolean {
  return isPostHogConfigured && shouldCaptureAnalytics();
}

export function captureEvent(event: string, properties?: AnalyticsProperties): void {
  if (!canCapture()) {
    return;
  }

  posthog.capture(event, properties);
}

export function captureCtaClick(label: string, href: string, location: string): void {
  captureEvent('cta_clicked', { label, href, location });
}

export function captureSignupStarted(source: SignupSource, location: string): void {
  captureEvent('signup_started', { source, location });
}

export function captureSignupSucceeded(source: SignupSource, location: string): void {
  captureEvent('signup_succeeded', { source, location });
}

export function captureSignupFailed(
  source: SignupSource,
  location: string,
  reason: SignupFailureReason,
): void {
  captureEvent('signup_failed', { source, location, reason });
}
