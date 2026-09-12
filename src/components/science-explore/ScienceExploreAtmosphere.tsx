import { type ReactNode } from 'react';
import { SCIENCE_GRAIN } from './scienceExploreShared';

export function ScienceExploreAtmosphere({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 mix-blend-soft-light opacity-[0.09]"
        style={{ backgroundImage: SCIENCE_GRAIN }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 18% 8%,  rgba(159,181,170,0.12), transparent 36%),
            radial-gradient(circle at 82% 22%, rgba(204,88,51,0.10), transparent 32%),
            radial-gradient(circle at 50% 100%, rgba(159,181,170,0.06), transparent 50%)
          `,
        }}
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
