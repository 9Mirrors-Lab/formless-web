export const ENGAGEMENT_DESK_PATH = '/brand/engagement';

export const ENGAGEMENT_TABS = ['signups', 'inquiries'] as const;

export type EngagementTab = (typeof ENGAGEMENT_TABS)[number];

export function isEngagementTab(value: string | null): value is EngagementTab {
  return value === 'signups' || value === 'inquiries';
}

export function engagementTabFromSearch(search: string): EngagementTab {
  const query = search.startsWith('?') ? search : `?${search}`;
  const params = new URLSearchParams(query);
  const value = params.get('tab');
  if (isEngagementTab(value)) return value;
  // Legacy signup list filters imply the Signups tab.
  if (params.has('list')) return 'signups';
  return 'signups';
}

export function engagementDeskHref(tab?: EngagementTab): string {
  if (!tab || tab === 'signups') return ENGAGEMENT_DESK_PATH;
  return `${ENGAGEMENT_DESK_PATH}?tab=${tab}`;
}

export function setEngagementTabInUrl(tab: EngagementTab) {
  const url = new URL(window.location.href);
  url.pathname = ENGAGEMENT_DESK_PATH;
  if (tab === 'signups') {
    url.searchParams.delete('tab');
  } else {
    url.searchParams.set('tab', tab);
    url.searchParams.delete('list');
  }
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

/** Legacy /brand/signups → Engagement signups tab, preserving list filters. */
export function legacySignupsRedirectTarget(search: string): string {
  const query = search.startsWith('?') ? search : search ? `?${search}` : '';
  const params = new URLSearchParams(query);
  params.delete('tab');
  const remainder = params.toString();
  return remainder ? `${ENGAGEMENT_DESK_PATH}?${remainder}` : ENGAGEMENT_DESK_PATH;
}
