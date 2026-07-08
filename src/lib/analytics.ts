import posthog from 'posthog-js';
import { isPostHogConfigured } from '@/lib/posthog';

export function captureEvent(
  event: string,
  properties?: Record<string, string | number | boolean | null>,
): void {
  if (!isPostHogConfigured) {
    return;
  }

  posthog.capture(event, properties);
}

export function captureCtaClick(label: string, href: string, location: string): void {
  captureEvent('cta_clicked', { label, href, location });
}
