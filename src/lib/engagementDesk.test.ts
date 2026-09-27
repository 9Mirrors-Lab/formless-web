import { describe, expect, it } from 'vitest';

import {
  ENGAGEMENT_DESK_PATH,
  engagementDeskHref,
  engagementTabFromSearch,
} from '@/lib/engagementDesk';

describe('engagementDesk', () => {
  it('defaults to signups and opens inquiries via tab', () => {
    expect(engagementDeskHref()).toBe(ENGAGEMENT_DESK_PATH);
    expect(engagementDeskHref('signups')).toBe(ENGAGEMENT_DESK_PATH);
    expect(engagementDeskHref('inquiries')).toBe(
      `${ENGAGEMENT_DESK_PATH}?tab=inquiries`,
    );
  });

  it('reads tab from search, with list implying signups', () => {
    expect(engagementTabFromSearch('')).toBe('signups');
    expect(engagementTabFromSearch('?tab=inquiries')).toBe('inquiries');
    expect(engagementTabFromSearch('?list=newsletter')).toBe('signups');
  });
});
