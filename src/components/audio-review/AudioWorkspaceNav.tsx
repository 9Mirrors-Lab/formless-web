/**
 * Editorial Listen / Analysis / Master phases view helpers (URL sync).
 * Analysis ↔ Master phases switches via in-page tabs; Listen stays in the brand sidebar.
 */

export type AudioWorkspaceTab = 'listen' | 'analysis' | 'master-phases';

export type EditorialView = AudioWorkspaceTab;

export function editorialViewFromSearch(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
): EditorialView {
  const view = new URLSearchParams(search).get('view');
  if (view === 'analysis') return 'analysis';
  if (view === 'master-phases') return 'master-phases';
  return 'listen';
}

export function masterPhaseTrackFromSearch(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
): number | null {
  const raw = new URLSearchParams(search).get('track');
  if (raw == null || raw === '') return null;
  const id = Number(raw);
  return Number.isInteger(id) ? id : null;
}

export function setEditorialViewInUrl(view: EditorialView, trackId?: number | null): void {
  const url = new URL(window.location.href);
  url.searchParams.set('view', view);
  url.searchParams.delete('companion');
  if (view === 'master-phases' && trackId != null) {
    url.searchParams.set('track', String(trackId));
  } else {
    url.searchParams.delete('track');
  }
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function companionOpenFromSearch(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
): boolean {
  return new URLSearchParams(search).get('companion') === '1';
}

export function setCompanionOpenInUrl(
  open: boolean,
  keepView = false,
): void {
  const url = new URL(window.location.href);
  if (open) {
    if (!keepView) {
      url.searchParams.set('view', 'listen');
    }
    url.searchParams.set('companion', '1');
  } else {
    url.searchParams.delete('companion');
  }
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}
