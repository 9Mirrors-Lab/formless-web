/**
 * Shared workspace tabs for editorial listen/analysis and the companion kit.
 * Order: Brand · Companion · Listen · Analysis (client arrives on companion first).
 * Brand links back to the Brand Toolkit. Companion opens a shadcn Sheet (side=top)
 * when onOpenCompanion is provided.
 */

export type AudioWorkspaceTab = 'listen' | 'companion' | 'analysis';

export type EditorialView = Exclude<AudioWorkspaceTab, 'companion'>;

const TABS: ReadonlyArray<{
  id: AudioWorkspaceTab | 'brand';
  label: string;
  href: string;
}> = [
  { id: 'brand', label: 'Brand', href: '/brand' },
  { id: 'companion', label: 'Companion', href: '/audio/editorial?companion=1' },
  { id: 'listen', label: 'Listen', href: '/audio/editorial?view=listen' },
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
        const selected = tab.id !== 'brand' && active === tab.id;
        const className = `inline-flex min-h-10 items-center rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          selected
            ? 'bg-moss text-cream'
            : 'text-cream/45 hover:text-cream/80'
        }`;

        if (tab.id === 'brand') {
          return (
            <a
              key={tab.id}
              href={tab.href}
              className={className}
            >
              {tab.label}
            </a>
          );
        }

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

/**
 * Client default: companion open on bare /audio/editorial.
 * Explicit ?view=listen|analysis (without companion=1) stays on that surface.
 * ?companion=0 forces closed; ?companion=1 forces open.
 */
export function companionOpenFromSearch(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
): boolean {
  const params = new URLSearchParams(search);
  const companion = params.get('companion');
  if (companion === '0') return false;
  if (companion === '1') return true;
  const view = params.get('view');
  if (view === 'listen' || view === 'analysis') return false;
  return true;
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
    url.searchParams.delete('view');
  } else {
    url.searchParams.delete('companion');
    if (!url.searchParams.get('view')) {
      url.searchParams.set('view', 'listen');
    }
  }
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}
