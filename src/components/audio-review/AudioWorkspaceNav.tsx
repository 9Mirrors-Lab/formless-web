/**
 * Editorial Listen / Analysis view helpers (URL sync).
 * Workspace switching lives in the brand sidebar, not an in-page tablist.
 */

export type AudioWorkspaceTab = 'listen' | 'analysis';

export type EditorialView = AudioWorkspaceTab;

export function editorialViewFromSearch(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
): EditorialView {
  const view = new URLSearchParams(search).get('view');
  if (view === 'analysis') return 'analysis';
  return 'listen';
}

export function setEditorialViewInUrl(view: EditorialView): void {
  const url = new URL(window.location.href);
  url.searchParams.set('view', view);
  url.searchParams.delete('companion');
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}
