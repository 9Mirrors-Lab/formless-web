/**
 * Shared workspace tabs for editorial listen/analysis and the companion kit.
 * Order: Listen · Companion · Analysis
 * Companion opens as a slide-out tray when onOpenCompanion is provided.
 */

export type AudioWorkspaceTab = 'listen' | 'companion' | 'analysis';

export type EditorialView = Exclude<AudioWorkspaceTab, 'companion'>;

const TABS: ReadonlyArray<{
  id: AudioWorkspaceTab;
  label: string;
  href: string;
}> = [
  { id: 'listen', label: 'Listen', href: '/audio/editorial?view=listen' },
  { id: 'companion', label: 'Companion', href: '/audio/editorial?companion=1' },
  { id: 'analysis', label: 'Analysis', href: '/audio/editorial?view=analysis' },
];

type AudioWorkspaceNavProps = {
  active: AudioWorkspaceTab;
  /** Accessible name for the tablist. */
  label?: string;
  /**
   * When set, Listen/Analysis switch in place (no full reload).
   */
  onSelectView?: (view: EditorialView) => void;
  /**
   * When set, Companion opens the recording tray instead of navigating away.
   */
  onOpenCompanion?: () => void;
};

export function AudioWorkspaceNav({
  active,
  label = 'Audio workspace',
  onSelectView,
  onOpenCompanion,
}: AudioWorkspaceNavProps) {
  return (
    <div
      className="inline-flex rounded-full border border-cream/15 bg-cream/[0.03] p-1"
      role="tablist"
      aria-label={label}
    >
      {TABS.map((tab) => {
        const selected = active === tab.id;
        const className = `inline-flex min-h-10 items-center rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          selected
            ? 'bg-moss text-cream'
            : 'text-cream/45 hover:text-cream/80'
        }`;

        if (tab.id === 'companion' && onOpenCompanion) {
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={onOpenCompanion}
              className={className}
            >
              {tab.label}
            </button>
          );
        }

        if (tab.id !== 'companion' && onSelectView) {
          const view: EditorialView = tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSelectView(view)}
              className={className}
            >
              {tab.label}
            </button>
          );
        }

        return (
          <a
            key={tab.id}
            href={tab.href}
            role="tab"
            aria-selected={selected}
            className={className}
          >
            {tab.label}
          </a>
        );
      })}
    </div>
  );
}

export function editorialViewFromSearch(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
): EditorialView {
  const view = new URLSearchParams(search).get('view');
  if (view === 'listen') return 'listen';
  if (view === 'analysis') return 'analysis';
  return 'listen';
}

export function companionOpenFromSearch(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
): boolean {
  return new URLSearchParams(search).get('companion') === '1';
}

export function setEditorialViewInUrl(view: EditorialView): void {
  const url = new URL(window.location.href);
  url.searchParams.set('view', view);
  url.searchParams.delete('companion');
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function setCompanionOpenInUrl(open: boolean): void {
  const url = new URL(window.location.href);
  if (open) {
    url.searchParams.set('companion', '1');
  } else {
    url.searchParams.delete('companion');
  }
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}
