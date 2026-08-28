import { describe, expect, it } from 'vitest';
import {
  isInternalAnalyticsPath,
  isSessionReplayPath,
  normalizePathname,
} from './analyticsPaths';

describe('analyticsPaths', () => {
  it('normalizes trailing slashes and casing', () => {
    expect(normalizePathname('/book/')).toBe('/book');
    expect(normalizePathname('/Brand')).toBe('/brand');
    expect(normalizePathname('/')).toBe('/');
  });

  it('flags internal tooling routes', () => {
    expect(isInternalAnalyticsPath('/design-system')).toBe(true);
    expect(isInternalAnalyticsPath('/brand')).toBe(true);
    expect(isInternalAnalyticsPath('/brand/signups')).toBe(true);
    expect(isInternalAnalyticsPath('/brand/endorsements')).toBe(true);
    expect(isInternalAnalyticsPath('/brand/book-launch-campaign')).toBe(true);
    expect(isInternalAnalyticsPath('/brand/schedule')).toBe(true);
    expect(isInternalAnalyticsPath('/audio/process')).toBe(true);
    expect(isInternalAnalyticsPath('/audio/record-sessions')).toBe(true);
    expect(isInternalAnalyticsPath('/audio/re-records')).toBe(true);
    expect(isInternalAnalyticsPath('/components')).toBe(true);
    expect(isInternalAnalyticsPath('/design-lab')).toBe(true);
    expect(isInternalAnalyticsPath('/revised')).toBe(true);
    expect(isInternalAnalyticsPath('/book')).toBe(false);
    expect(isInternalAnalyticsPath('/preorder')).toBe(false);
    expect(isInternalAnalyticsPath('/special-preview')).toBe(false);
  });

  it('limits session replay to core content routes', () => {
    expect(isSessionReplayPath('/')).toBe(true);
    expect(isSessionReplayPath('/work')).toBe(true);
    expect(isSessionReplayPath('/special-preview')).toBe(true);
    expect(isSessionReplayPath('/preorder')).toBe(true);
    expect(isSessionReplayPath('/preorder/stay-close')).toBe(true);
    expect(isSessionReplayPath('/design-system')).toBe(false);
  });
});
