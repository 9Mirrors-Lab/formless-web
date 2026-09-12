import type { ReactNode } from 'react';
import { MONUMENT, MONUMENT_GRAIN } from './monumentShared';

type MonumentAtmosphereProps = {
  children: ReactNode;
  /** Stronger horizon band for closing sections. */
  horizon?: 'none' | 'soft' | 'strong';
};

export function MonumentAtmosphere({ children, horizon = 'soft' }: MonumentAtmosphereProps) {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: MONUMENT.canvas, color: MONUMENT.text }}
    >
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <MonumentMonolithField />
        {horizon !== 'none' ? (
          <div
            className="absolute inset-x-0 bottom-0 h-[min(42vh,420px)]"
            style={{
              background:
                horizon === 'strong'
                  ? `linear-gradient(to top, ${MONUMENT.horizonMuted} 0%, ${MONUMENT.horizon}22 18%, transparent 72%)`
                  : `linear-gradient(to top, ${MONUMENT.horizonMuted}88 0%, transparent 55%)`,
            }}
          />
        ) : null}
        <div
          className="absolute inset-0 opacity-[0.055] mix-blend-soft-light"
          style={{ backgroundImage: MONUMENT_GRAIN }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function MonumentMonolithField() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="1440" height="900" fill={MONUMENT.canvasDeep} />
      <polygon
        points="980,900 1120,120 1280,900"
        fill={MONUMENT.stone}
        opacity="0.95"
      />
      <polygon
        points="1080,900 1180,220 1320,900"
        fill={MONUMENT.stoneLight}
        opacity="0.55"
      />
      <polygon
        points="1180,900 1260,340 1380,900"
        fill={MONUMENT.stone}
        opacity="0.35"
      />
      <polygon points="40,900 180,280 320,900" fill={MONUMENT.stone} opacity="0.45" />
      <polygon points="220,900 300,420 420,900" fill={MONUMENT.stoneLight} opacity="0.28" />
      <line
        x1="0"
        y1="760"
        x2="1440"
        y2="760"
        stroke={MONUMENT.dustRedMuted}
        strokeWidth="1"
        opacity="0.35"
      />
      <rect x="0" y="758" width="1440" height="2" fill={MONUMENT.horizon} opacity="0.12" />
    </svg>
  );
}
