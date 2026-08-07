import { useId } from 'react';
import {
  TEACHING_ICONS,
  type IconTheme,
  type TeachingIconSpec,
} from '@/components/iconography/teachingIcons';

/** Teaching marks that stay readable when scaled into callouts and meta UI. */
export const CALLOUT_TEACHING_ICON_IDS = [
  'formless',
  'north',
  'quantum',
  'observer',
  'space',
  'pause',
  'anchor',
  'awakening',
  'flow',
  'clarity',
] as const;

export type CalloutTeachingIconId = (typeof CALLOUT_TEACHING_ICON_IDS)[number];

const NATIVE_MARK_SIZE = 96;

export function getTeachingIcon(id: string): TeachingIconSpec | undefined {
  return TEACHING_ICONS.find((icon) => icon.id === id);
}

type TeachingIconMarkProps = {
  id: string;
  theme?: IconTheme;
  /** Rendered square size in px. Native teaching marks are 96px. */
  size?: number;
  /**
   * Enable compact CSS motion for marks that support it (formless rings,
   * space circles). Independent of page-level GSAP so callouts and the book
   * notify form still animate when scaled down.
   */
  animate?: boolean;
  className?: string;
};

/**
 * Compact inline teaching mark for callouts and other meta UI.
 * Scales the canonical /icons artwork instead of inventing a second icon set.
 */
export function TeachingIconMark({
  id,
  theme = 'dark',
  size = 28,
  animate = false,
  className = '',
}: TeachingIconMarkProps) {
  const reactId = useId().replace(/:/g, '');
  const icon = getTeachingIcon(id);
  if (!icon) return null;

  const scale = size / NATIVE_MARK_SIZE;

  return (
    <span
      className={[
        'teaching-icon-mark relative inline-flex shrink-0 items-center justify-center overflow-visible',
        animate ? 'teaching-icon-mark--live' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 flex items-center justify-center [&_svg]:overflow-visible"
        style={{
          width: NATIVE_MARK_SIZE,
          height: NATIVE_MARK_SIZE,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {icon.render({ theme, instanceId: `${id}-${theme}-${reactId}` })}
      </span>
    </span>
  );
}
