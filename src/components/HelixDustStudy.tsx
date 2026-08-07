import { useId, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export type HelixDustVariant = 'sunshaft' | 'volume' | 'catchlight';

export const HELIX_DUST_VARIANTS: {
  id: HelixDustVariant;
  title: string;
  thesis: string;
}[] = [
  {
    id: 'sunshaft',
    title: 'Sunshaft',
    thesis:
      'Dense cream motes ride both strands. A soft beam sweeps the column so particles brighten when they catch the light.',
  },
  {
    id: 'volume',
    title: 'Volume',
    thesis:
      'A thicker dust cloud hangs around the helix, with near and far layers drifting off-path like motes in still air.',
  },
  {
    id: 'catchlight',
    title: 'Catchlight',
    thesis:
      'Fine field plus sudden warm glints. Most dust stays quiet; a few motes flare when they hit the angle of the light.',
  },
];

const VIEW_W = 360;
const VIEW_H = 720;
const CX = 180;
const HELIX_TOP = 36;
const HELIX_BOTTOM = 690;
const AMPLITUDE = 22;
const TURNS = 2.15;

type Particle = {
  strand: 0 | 1;
  t: number;
  r: number;
  baseOpacity: number;
  warmth: number;
  scatter: number;
  depth: number;
  speed: number;
  wobble: number;
  wobblePhase: number;
  spark: number;
};

function helixPoint(t: number, phase: number, amplitude = AMPLITUDE) {
  const y = HELIX_TOP + t * (HELIX_BOTTOM - HELIX_TOP);
  const angle = t * Math.PI * 2 * TURNS + phase;
  const envelope = Math.sin(t * Math.PI);
  const x = CX + Math.sin(angle) * amplitude * envelope;
  return { x, y, angle, envelope };
}

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function buildParticles(variant: HelixDustVariant): Particle[] {
  const count =
    variant === 'volume' ? 620 : variant === 'sunshaft' ? 520 : 480;
  const particles: Particle[] = [];

  for (let i = 0; i < count; i += 1) {
    const a = seeded(i, 1);
    const b = seeded(i, 2);
    const c = seeded(i, 3);
    const d = seeded(i, 4);
    const e = seeded(i, 5);

    const scatterScale =
      variant === 'volume'
        ? 16 + b * 22
        : variant === 'sunshaft'
          ? 1.8 + b * 4.5
          : 3 + b * 9;

    // Bias density toward the mid-column where light reads strongest.
    const tBias =
      variant === 'sunshaft'
        ? Math.pow(a, 0.85) * 0.15 + a * 0.85
        : a;

    // Extra fine grit: most particles stay tiny; a few read as brighter motes.
    const grit = c > 0.9 ? 1.6 : c > 0.7 ? 0.7 : 0;

    particles.push({
      strand: i % 2 === 0 ? 0 : 1,
      t: tBias,
      r:
        variant === 'catchlight'
          ? 0.22 + b * 1.05 + grit
          : 0.18 + b * 0.85 + grit * 0.85,
      baseOpacity:
        variant === 'volume'
          ? 0.06 + c * 0.38
          : 0.1 + c * 0.48,
      warmth:
        d > (variant === 'catchlight' ? 0.7 : 0.8)
          ? 1
          : d > 0.52
            ? 0.45
            : 0,
      scatter: (e - 0.5) * scatterScale,
      depth: variant === 'volume' ? a : 0.3 + b * 0.7,
      speed: 0.006 + c * 0.024 + (variant === 'volume' ? 0.003 : 0),
      wobble: (variant === 'volume' ? 1.8 : 0.55) + b * 1.25,
      wobblePhase: d * Math.PI * 2,
      spark: variant === 'catchlight' && e > 0.82 ? 0.5 + a * 0.5 : 0,
    });
  }

  return particles;
}

function buildStrandPath(phase: number, samples = 100) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= samples; i += 1) {
    pts.push(helixPoint(i / samples, phase));
  }
  pts[0] = { x: CX, y: HELIX_TOP };
  pts[pts.length - 1] = { x: CX, y: HELIX_BOTTOM };

  let d = `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length - 1; i += 1) {
    const cur = pts[i];
    const next = pts[i + 1];
    const mx = ((cur.x + next.x) / 2).toFixed(2);
    const my = ((cur.y + next.y) / 2).toFixed(2);
    d += ` Q${cur.x.toFixed(2)} ${cur.y.toFixed(2)} ${mx} ${my}`;
  }
  const last = pts[pts.length - 1];
  d += ` T${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

type HelixDustStudyProps = {
  variant: HelixDustVariant;
  className?: string;
  ignoreReducedMotion?: boolean;
};

export function HelixDustStudy({
  variant,
  className = '',
  ignoreReducedMotion = false,
}: HelixDustStudyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reactId = useId().replace(/:/g, '');
  const shaftGradId = `shaft-${reactId}`;
  const particles = useMemo(() => buildParticles(variant), [variant]);
  const strandA = useMemo(() => buildStrandPath(0), []);
  const strandB = useMemo(() => buildStrandPath(Math.PI), []);

  useGSAP(
    () => {
      const root = rootRef.current;
      const canvas = canvasRef.current;
      if (!root || !canvas) return;

      const reduce =
        !ignoreReducedMotion &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();

      const state = particles.map((p) => ({ ...p }));
      const beam = { t: 0.35 };
      let time = 0;

      const draw = () => {
        const rect = canvas.getBoundingClientRect();
        const sx = rect.width / VIEW_W;
        const sy = rect.height / VIEW_H;
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < state.length; i += 1) {
          const p = state[i];
          if (!p) continue;
          const phase = p.strand === 0 ? 0 : Math.PI;
          const pt = helixPoint(p.t, phase);
          const lateral =
            Math.cos(pt.angle) * p.scatter * 0.35 +
            Math.sin(time * 0.7 + p.wobblePhase) * p.wobble * (0.35 + p.depth * 0.65);
          const along =
            Math.cos(time * 0.55 + p.wobblePhase * 1.3) *
            p.wobble *
            0.25 *
            (variant === 'volume' ? 1.4 : 0.7);

          const x = (pt.x + lateral) * sx;
          const y = (pt.y + along) * sy;

          let brightness = p.baseOpacity * (0.55 + p.depth * 0.7);

          if (variant === 'sunshaft') {
            const beamDist = Math.abs(p.t - beam.t);
            const inBeam = Math.max(0, 1 - beamDist / 0.18);
            brightness *= 0.45 + inBeam * 1.55;
            // Soft falloff near tips so the shaft feels lit mid-column.
            brightness *= 0.55 + pt.envelope * 0.7;
          } else if (variant === 'volume') {
            brightness *= 0.35 + (1 - p.depth) * 0.9;
          }

          let catchHit = 0;
          if (variant === 'catchlight') {
            const pulse = Math.sin(time * (1.2 + p.spark * 2.4) + p.wobblePhase);
            catchHit =
              p.spark > 0 && pulse > 0.78
                ? (pulse - 0.78) / 0.22
                : 0;
            brightness *= 0.5 + catchHit * 2.4;
          }

          const warm = p.warmth;
          const r = 230 + warm * 18;
          const g = 224 + warm * 8;
          const b = 210 - warm * 55;
          const flare = catchHit > 0.35 ? 0.9 + catchHit * 2.2 : 0;
          const radius =
            Math.max(p.r, flare) *
            (0.7 + p.depth * 0.55) *
            ((sx + sy) * 0.5);

          ctx.beginPath();
          ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${Math.min(0.95, brightness)})`;
          ctx.arc(x, y, Math.max(0.35, radius), 0, Math.PI * 2);
          ctx.fill();

          // Soft halo on the brightest motes only (keeps the sun-catch bloom cheap).
          if (brightness > 0.62 || catchHit > 0.35) {
            const halo = radius * (variant === 'catchlight' ? 3.4 : 2.6);
            ctx.beginPath();
            ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${Math.min(0.22, brightness * 0.18)})`;
            ctx.arc(x, y, halo, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.globalCompositeOperation = 'source-over';
      };

      draw();

      if (reduce) return;

      const beamTween =
        variant === 'sunshaft'
          ? gsap.to(beam, {
              t: 0.78,
              duration: 7.5,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
            })
          : null;

      const tick = () => {
        time += 0.016;
        for (let i = 0; i < state.length; i += 1) {
          const p = state[i];
          if (!p) continue;
          // Slow climb; wrap at ends so the helix feels continuous.
          p.t += p.speed * 0.01;
          if (p.t > 1) p.t -= 1;
        }
        draw();
      };

      gsap.ticker.add(tick);
      const onResize = () => {
        resize();
        draw();
      };
      window.addEventListener('resize', onResize);

      return () => {
        gsap.ticker.remove(tick);
        beamTween?.kill();
        window.removeEventListener('resize', onResize);
      };
    },
    {
      scope: rootRef,
      dependencies: [variant, particles, ignoreReducedMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={rootRef}
      className={['helix-dust-study relative aspect-[360/720] w-full', className]
        .filter(Boolean)
        .join(' ')}
      data-variant={variant}
    >
      {/* Ghost strands — barely there structure under the dust */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={strandA}
          stroke="#9fb5aa"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.1"
        />
        <path
          d={strandB}
          stroke="#f2f0e9"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.08"
        />
        {variant === 'sunshaft' ? (
          <>
            <defs>
              <linearGradient id={shaftGradId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f2f0e9" stopOpacity="0" />
                <stop offset="45%" stopColor="#d8c9a4" stopOpacity="0.07" />
                <stop offset="55%" stopColor="#f2f0e9" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#f2f0e9" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect
              x={CX - 42}
              y={HELIX_TOP}
              width={84}
              height={HELIX_BOTTOM - HELIX_TOP}
              fill={`url(#${shaftGradId})`}
              opacity="0.9"
            />
          </>
        ) : null}
      </svg>

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}
