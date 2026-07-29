import type { ReactNode } from 'react';

import {
  TeachingIconMark,
  type CalloutTeachingIconId,
} from '@/components/iconography/TeachingIconMark';
import type { IconTheme } from '@/components/iconography/teachingIcons';

/**
 * Status / meta callouts for Eyes Closed.
 *
 * These are editorial signals (dates, availability, quiet notices).
 * They must not reuse primary-nav chrome (rounded-full bordered pills).
 *
 * Prefer a teaching icon mark from /icons over a generic bullet so brand
 * language carries into small meta moments.
 *
 * Variants live on /components for visual comparison.
 */

export type CalloutVariant =
  | 'editorial'
  | 'letterpress'
  | 'horizon'
  | 'presence'
  | 'chrome-pill';

export type CalloutSurface = 'dark' | 'light';

export type CalloutProps = {
  children: ReactNode;
  variant?: CalloutVariant;
  surface?: CalloutSurface;
  /**
   * Teaching icon id from /icons (e.g. formless, north, quantum).
   * Replaces the generic pulse bullet when set.
   */
  icon?: CalloutTeachingIconId | string;
  /** Soft pulse bullet when no teaching icon is provided. */
  pulse?: boolean;
  className?: string;
};

const VARIANT_META: Record<
  CalloutVariant,
  { label: string; intent: string; recommended?: boolean; antiPattern?: boolean }
> = {
  editorial: {
    label: 'Editorial mark',
    intent:
      'Teaching mark + mono date. No nav pill, no hairline rule. Clearest branded status signal.',
    recommended: true,
  },
  letterpress: {
    label: 'Letterpress seal',
    intent: 'Pressed-ink well. Soft inset, low opacity, rectangular; tactile without reading as a button.',
  },
  horizon: {
    label: 'Horizon line',
    intent: 'Typographic only, anchored by a short ground line. Quietest option.',
  },
  presence: {
    label: 'Quiet presence',
    intent: 'Serif italic spoken date with a teaching mark. Voice-led, less “system badge.”',
  },
  'chrome-pill': {
    label: 'Chrome pill',
    intent: 'Anti-pattern. Same language as primary nav. Do not use for non-interactive status.',
    antiPattern: true,
  },
};

export function calloutVariantMeta(variant: CalloutVariant) {
  return VARIANT_META[variant];
}

export const CALLOUT_VARIANTS = Object.keys(VARIANT_META) as CalloutVariant[];

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function surfaceTheme(surface: CalloutSurface): IconTheme {
  return surface === 'dark' ? 'dark' : 'light';
}

function PulseDot({ surface }: { surface: CalloutSurface }) {
  return (
    <span
      className={cx(
        'inline-block h-1.5 w-1.5 shrink-0 rounded-full animate-pulse',
        surface === 'dark' ? 'bg-clay/70' : 'bg-clay/80',
      )}
      aria-hidden
    />
  );
}

function CalloutMark({
  surface,
  icon,
  pulse,
  size = 22,
}: {
  surface: CalloutSurface;
  icon?: string;
  pulse?: boolean;
  size?: number;
}) {
  if (icon) {
    return (
      <TeachingIconMark
        id={icon}
        theme={surfaceTheme(surface)}
        size={size}
        animate
      />
    );
  }
  if (pulse) {
    return <PulseDot surface={surface} />;
  }
  return null;
}

function Label({
  children,
  surface,
  className,
}: {
  children: ReactNode;
  surface: CalloutSurface;
  className?: string;
}) {
  return (
    <span
      className={cx(
        'font-mono text-[10px] uppercase tracking-[0.25em]',
        surface === 'dark' ? 'text-cream/55' : 'text-charcoal/55',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Callout({
  children,
  variant = 'editorial',
  surface = 'dark',
  icon,
  pulse = false,
  className,
}: CalloutProps) {
  const isDark = surface === 'dark';

  switch (variant) {
    case 'editorial':
      return (
        <div className={cx('inline-flex items-center gap-3', className)}>
          <CalloutMark surface={surface} icon={icon} pulse={pulse} size={48} />
          <Label surface={surface}>{children}</Label>
        </div>
      );

    case 'letterpress':
      return (
        <div
          className={cx(
            'inline-flex items-center gap-2.5 rounded-sm border px-3 py-1.5',
            isDark
              ? 'border-cream/10 bg-black/[0.22] text-cream/32 shadow-[inset_0_1px_2px_rgba(0,0,0,0.55)]'
              : 'border-charcoal/10 bg-charcoal/[0.04] text-charcoal/45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]',
            className,
          )}
        >
          <CalloutMark surface={surface} icon={icon} pulse={pulse} size={16} />
          <span
            className={cx(
              'font-mono text-[10px] uppercase tracking-[0.22em]',
              isDark
                ? '[filter:drop-shadow(0_-0.5px_0_rgba(255,255,255,0.08))_drop-shadow(0_1px_0_rgba(0,0,0,0.45))]'
                : undefined,
            )}
          >
            {children}
          </span>
        </div>
      );

    case 'horizon':
      return (
        <div className={cx('inline-flex flex-col gap-2', className)}>
          <div className="inline-flex items-center gap-2.5">
            <CalloutMark surface={surface} icon={icon} pulse={pulse} size={18} />
            <Label surface={surface} className={isDark ? 'text-cream/50' : 'text-charcoal/50'}>
              {children}
            </Label>
          </div>
          <span
            className={cx('h-px w-16', isDark ? 'bg-moss/45' : 'bg-moss/40')}
            aria-hidden
          />
        </div>
      );

    case 'presence':
      return (
        <div className={cx('inline-flex items-center gap-2.5', className)}>
          {icon || pulse ? (
            <CalloutMark surface={surface} icon={icon} pulse={pulse} size={18} />
          ) : (
            <span
              className={cx(
                'inline-block h-1.5 w-1.5 shrink-0 rounded-full',
                isDark ? 'bg-clay/60' : 'bg-clay/70',
              )}
              aria-hidden
            />
          )}
          <span
            className={cx(
              'font-serif text-sm italic leading-none tracking-normal normal-case',
              isDark ? 'text-cream/50' : 'text-charcoal/55',
            )}
          >
            {children}
          </span>
        </div>
      );

    case 'chrome-pill':
      return (
        <div
          className={cx(
            'inline-flex items-center gap-2 rounded-full border px-3 py-1.5',
            isDark
              ? 'border-cream/15 bg-cream/5 text-cream/50'
              : 'border-charcoal/15 bg-charcoal/5 text-charcoal/50',
            className,
          )}
        >
          <CalloutMark surface={surface} icon={icon} pulse={pulse} size={14} />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
            {children}
          </span>
        </div>
      );

    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}
