import {
  ICON_ANIMATIONS,
  type IconAnimationSpec,
} from '@/data/iconAnimations';
import {
  TEACHING_ICON_CATEGORIES,
  TEACHING_ICON_CATEGORY_LABELS,
  TEACHING_ICONS,
  type IconTheme,
  type TeachingIconCategory,
  type TeachingIconSpec,
} from '@/components/iconography/teachingIcons';

function motionNoteFor(icon: TeachingIconSpec): string | undefined {
  const row: IconAnimationSpec | undefined = ICON_ANIMATIONS.find((entry) => entry.id === icon.id);
  if (!row) return undefined;
  return `${row.motion} (${row.duration}, ${row.easing})`;
}

type TeachingIconGridProps = {
  /** Dual light/dark tiles (gallery) or single dark preview (foundations). */
  mode?: 'dual' | 'dark';
  /** Limit to specific categories; defaults to all teaching categories. */
  categories?: TeachingIconCategory[];
  /** Show GSAP motion note under each title. */
  showMotionNotes?: boolean;
  /**
   * Show the stable registry id (e.g. formless) for product use:
   * TeachingIconMark id="…" / Callout icon="…".
   */
  showIds?: boolean;
  /** Category mono labels above each group (off when parent already titles sections). */
  showCategoryLabels?: boolean;
  className?: string;
};

function DualThemeTiles({ icon }: { icon: TeachingIconSpec }) {
  return (
    <div className="grid h-48 shrink-0 grid-cols-2 gap-4">
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-charcoal/5 bg-white shadow-sm group">
        <span className="absolute top-4 left-4 text-[9px] uppercase tracking-widest text-charcoal/35">
          Light
        </span>
        {icon.render({ theme: 'light' satisfies IconTheme })}
      </div>
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/5 bg-[#1a2332] shadow-inner group">
        <span className="absolute top-4 left-4 text-[9px] uppercase tracking-widest text-cream/35">
          Dark
        </span>
        {icon.render({ theme: 'dark' satisfies IconTheme })}
      </div>
    </div>
  );
}

function DarkThemeTile({ icon }: { icon: TeachingIconSpec }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-[2rem] border border-white/5 bg-[#1a2332] shadow-inner">
      {icon.render({ theme: 'dark' })}
    </div>
  );
}

export function TeachingIconGrid({
  mode = 'dual',
  categories = TEACHING_ICON_CATEGORIES,
  showMotionNotes = false,
  showIds = false,
  showCategoryLabels = true,
  className = '',
}: TeachingIconGridProps) {
  return (
    <div className={`space-y-16 ${className}`.trim()}>
      {categories.map((category) => {
        const icons = TEACHING_ICONS.filter((icon) => icon.category === category);
        if (icons.length === 0) return null;
        return (
          <div key={category}>
            {showCategoryLabels ? (
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-cream/50">
                {TEACHING_ICON_CATEGORY_LABELS[category]}
              </p>
            ) : null}
            <div
              className={
                mode === 'dual'
                  ? 'grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-12 xl:grid-cols-3 xl:gap-x-8 xl:gap-y-12'
                  : 'grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }
            >
              {icons.map((icon) => {
                const note = showMotionNotes ? motionNoteFor(icon) : undefined;
                return (
                  <div key={icon.id} className="flex h-full min-h-0 flex-col gap-3">
                    <div className="flex min-h-[4.25rem] flex-1 flex-col gap-1.5 px-1 sm:px-2">
                      <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-cream">
                        {icon.title}
                      </h3>
                      {showIds ? (
                        <p className="font-mono text-[11px] tracking-wide text-[#9fb5aa]">
                          id: <span className="text-cream/90">{icon.id}</span>
                        </p>
                      ) : null}
                      <p className="text-[11px] leading-relaxed text-cream/55">{icon.desc}</p>
                      {note ? (
                        <p className="font-mono text-[10px] leading-relaxed text-[#9fb5aa]/90">{note}</p>
                      ) : null}
                    </div>
                    {mode === 'dual' ? <DualThemeTiles icon={icon} /> : <DarkThemeTile icon={icon} />}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
