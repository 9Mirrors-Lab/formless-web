import { Check, Circle, Mic, Timer } from 'lucide-react';
import type { ReactNode } from 'react';

import type { AudioChapterStatus } from '@/data/audioReviewMock';

/** Shared status icons for progress legend + chapter lists. */
export function audioChapterStatusIcon(
  status: AudioChapterStatus,
  size: 'sm' | 'md' = 'sm',
): ReactNode {
  const px = size === 'sm' ? 11 : 14;
  const stroke = size === 'sm' ? 2.25 : 2;

  switch (status) {
    case 'approved':
      return (
        <Check
          size={px}
          strokeWidth={stroke}
          className="text-[#9fb5aa]"
          aria-hidden
        />
      );
    case 'ready':
      return (
        <Timer
          size={px}
          strokeWidth={stroke}
          className="text-amber-300/85"
          aria-hidden
        />
      );
    case 'recorded':
      return (
        <Mic
          size={px}
          strokeWidth={stroke}
          className="text-cream/45"
          aria-hidden
        />
      );
    case 'pending':
      return (
        <Circle
          size={size === 'sm' ? 9 : 12}
          strokeWidth={2}
          className="text-cream/20"
          aria-hidden
        />
      );
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
