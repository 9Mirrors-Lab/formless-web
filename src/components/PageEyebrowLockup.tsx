import type { ReactNode } from 'react';
import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';

const GOLD = '#d9b978';

export type PageEyebrowDirection = 'a' | 'b' | 'c';
export type PageEyebrowTone = 'dark' | 'light';

type PageEyebrowLockupProps = {
  direction: PageEyebrowDirection;
  iconId: string;
  word: string;
  tone?: PageEyebrowTone;
  /**
   * Direction C splits across the title: `top` before the headline,
   * `under` after it. A and B only use `top`.
   */
  piece?: 'top' | 'under';
  className?: string;
};

function HairRule({
  flex = false,
  width,
}: {
  flex?: boolean;
  width?: number;
}) {
  // Shared gold hairline opacity across every page lockup.
  return (
    <span
      className={`block h-px ${flex ? 'min-w-0 flex-1' : 'shrink-0'}`}
      style={{ background: GOLD, opacity: 0.5, width: flex ? undefined : width }}
      aria-hidden
    />
  );
}

function EyebrowWord({ children, tone }: { children: ReactNode; tone: PageEyebrowTone }) {
  const color = tone === 'dark' ? 'text-cream/60' : 'text-charcoal/45';
  return (
    <span
      className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.34em] md:text-[11px] ${color}`}
    >
      {children}
    </span>
  );
}

function Mark({
  id,
  tone,
  size,
}: {
  id: string;
  tone: PageEyebrowTone;
  size: number;
}) {
  return <TeachingIconMark id={id} theme={tone} size={size} />;
}

/**
 * Shared page-top accent: animated teaching mark + tracked word + gold hairline.
 * Grammars from /page-marks-explore (Rail A, Compact pair B, Understroke C).
 */
export function PageEyebrowLockup({
  direction,
  iconId,
  word,
  tone = 'dark',
  piece = 'top',
  className = '',
}: PageEyebrowLockupProps) {
  if (piece === 'under') {
    if (direction !== 'c') return null;
    return (
      <div className={`flex items-center gap-4 ${className}`.trim()}>
        <HairRule width={56} />
        <Mark id={iconId} tone={tone} size={24} />
      </div>
    );
  }

  switch (direction) {
    case 'a':
      return (
        <div className={`flex items-center gap-5 ${className}`.trim()}>
          <Mark id={iconId} tone={tone} size={26} />
          <EyebrowWord tone={tone}>{word}</EyebrowWord>
          <HairRule flex />
        </div>
      );
    case 'b':
      return (
        <div className={`flex max-w-xl flex-wrap items-center gap-3 md:gap-4 ${className}`.trim()}>
          <Mark id={iconId} tone={tone} size={24} />
          <EyebrowWord tone={tone}>{word}</EyebrowWord>
          <HairRule width={96} />
        </div>
      );
    case 'c':
      return (
        <div className={`flex items-center gap-5 ${className}`.trim()}>
          <EyebrowWord tone={tone}>{word}</EyebrowWord>
          <HairRule flex />
        </div>
      );
    default: {
      const _exhaustive: never = direction;
      return _exhaustive;
    }
  }
}
