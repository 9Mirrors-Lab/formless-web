import { useId, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

export type HelixLockupMotion = 'unwind' | 'trace' | 'current' | 'dust';
export type HelixLockupPlayback = 'loop' | 'once';

export type HelixBeat = {
  head: string;
  body: string;
  side: 'left' | 'right';
  mark: 'pause' | 'observe' | 'recognize';
};

const DEFAULT_BEATS: HelixBeat[] = [
  {
    head: 'Pause.',
    body: 'For one moment, stop. Be here.',
    side: 'left',
    mark: 'pause',
  },
  {
    head: 'Observe.',
    body: 'Notice your thoughts, emotions, and the story your mind is telling.',
    side: 'right',
    mark: 'observe',
  },
  {
    head: 'Recognize.',
    body: 'You are not what you observe. You are the one observing it.',
    side: 'left',
    mark: 'recognize',
  },
];

const VIEW_W = 360;
const VIEW_H = 720;
const CX = 180;
/** Tip of the helix sits on the baseline rule. */
const HELIX_TOP = 48;
const HELIX_BOTTOM = 718;
const AMPLITUDE = 18;
const TURNS = 2.05;
const EASE = 'power3.out';

type HelixTeachingLockupProps = {
  motion?: HelixLockupMotion;
  /** loop for review; once for production scroll reveal */
  playback?: HelixLockupPlayback;
  className?: string;
  beats?: HelixBeat[];
  brandLabel?: string | null;
  ignoreReducedMotion?: boolean;
  /**
   * Root the helix into a full-bleed horizontal hairline at the bottom
   * (clean stroke Trace — not dust).
   */
  rooted?: boolean;
};

/** Map CMS quote strings into helix beats. */
export function beatsFromQuotes(quotes: string[]): HelixBeat[] {
  const marks: HelixBeat['mark'][] = ['pause', 'observe', 'recognize'];
  return quotes.slice(0, 3).map((quote, i) => {
    const lines = quote.split('\n').map((line) => line.trim()).filter(Boolean);
    const head = lines[0] ?? quote;
    const body = lines.slice(1).join(' ');
    const side: HelixBeat['side'] = i % 2 === 1 ? 'right' : 'left';
    return {
      head,
      body,
      side,
      mark: marks[i] ?? 'pause',
    };
  });
}

function helixPoint(t: number, phase: number, amplitude = AMPLITUDE) {
  const y = HELIX_TOP + t * (HELIX_BOTTOM - HELIX_TOP);
  const angle = t * Math.PI * 2 * TURNS + phase;
  // Converge both ends to the spine so the tip can root into the baseline.
  const envelope = Math.sin(t * Math.PI);
  const x = CX + Math.sin(angle) * amplitude * envelope;
  return { x, y, angle };
}

function buildHelixPath(
  phase: number,
  samples = 120,
  /** Bottom→top so Trace can grow out of the baseline rule. */
  fromBottom = false,
) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = fromBottom ? 1 - i / samples : i / samples;
    pts.push(helixPoint(t, phase));
  }
  // Pin exact endpoints on the vertical center for a clean root/tip.
  if (fromBottom) {
    pts[0] = { x: CX, y: HELIX_BOTTOM };
    pts[pts.length - 1] = { x: CX, y: HELIX_TOP };
  } else {
    pts[0] = { x: CX, y: HELIX_TOP };
    pts[pts.length - 1] = { x: CX, y: HELIX_BOTTOM };
  }

  let d = `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length - 1; i += 1) {
    const c = pts[i];
    const n = pts[i + 1];
    const mx = ((c.x + n.x) / 2).toFixed(2);
    const my = ((c.y + n.y) / 2).toFixed(2);
    d += ` Q${c.x.toFixed(2)} ${c.y.toFixed(2)} ${mx} ${my}`;
  }
  const last = pts[pts.length - 1];
  d += ` T${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

/**
 * Teaching marks for the POR lockup.
 * Recognize matches the approved mark: solid sage · vertical dashed · hollow ring.
 * Observe is the simple witness ring (not the multi-wave observer icon).
 */
function BeatMark({ mark }: { mark: HelixBeat['mark'] }) {
  if (mark === 'pause') {
    return (
      <svg
        className="helix-mark-svg h-8 w-8"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect x="8" y="6" width="5" height="20" rx="2.5" />
        <rect x="19" y="6" width="5" height="20" rx="2.5" />
      </svg>
    );
  }

  if (mark === 'observe') {
    return (
      <svg
        className="helix-mark-svg h-8 w-8"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="16"
          cy="16"
          r="7"
          stroke="currentColor"
          strokeWidth="2.25"
        />
      </svg>
    );
  }

  // Approved recognize mark: filled · vertical dash · outline
  return (
    <svg
      className="helix-mark-svg h-9 w-14"
      viewBox="0 0 56 36"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="18" r="7" fill="#9fb5aa" />
      <line
        className="recognize-divider"
        x1="28"
        y1="8"
        x2="28"
        y2="28"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeDasharray="2.5 3"
        strokeLinecap="round"
      />
      <circle
        cx="46"
        cy="18"
        r="7"
        stroke="currentColor"
        strokeWidth="1.85"
      />
    </svg>
  );
}

export const HELIX_MOTION_OPTIONS: {
  id: HelixLockupMotion;
  title: string;
  thesis: string;
}[] = [
  {
    id: 'unwind',
    title: 'Unwind',
    thesis:
      'The double helix slowly turns in place. Awareness keeps moving; the three beats stay anchored beside the path.',
  },
  {
    id: 'trace',
    title: 'Trace',
    thesis:
      'The strands draw themselves top to bottom. Each mark and teaching beat arrive together as the stroke reaches them.',
  },
  {
    id: 'current',
    title: 'Current',
    thesis:
      'A soft light travels the helix path, waking each content beat in order: Pause, Observe, Recognize.',
  },
  {
    id: 'dust',
    title: 'Dust',
    thesis:
      'Dotted-path energy, quieter: cream-moss motes catch light along the helix like dust in a beam. Strands stay as a faint ghost.',
  },
];

type DustMote = {
  strand: 0 | 1;
  t: number;
  r: number;
  opacity: number;
  warmth: number;
  drift: number;
  speed: number;
};

function buildDustMotes(count = 72): DustMote[] {
  const motes: DustMote[] = [];
  for (let i = 0; i < count; i += 1) {
    const n = ((i * 37 + 11) % 97) / 97;
    const n2 = ((i * 53 + 19) % 89) / 89;
    const n3 = ((i * 17 + 7) % 83) / 83;
    motes.push({
      strand: i % 2 === 0 ? 0 : 1,
      t: (i / count + n * 0.01) % 1,
      r: 0.7 + n2 * 1.6,
      opacity: 0.22 + n3 * 0.48,
      warmth: n > 0.78 ? 1 : 0,
      drift: (n2 - 0.5) * 3.6,
      speed: 0.014 + n3 * 0.022,
    });
  }
  return motes;
}

export function HelixTeachingLockup({
  motion = 'trace',
  playback = 'loop',
  className = '',
  beats = DEFAULT_BEATS,
  brandLabel = 'Formless',
  ignoreReducedMotion = false,
  rooted = false,
}: HelixTeachingLockupProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const gradId = `helix-grad-${reactId.replace(/:/g, '')}`;
  // Trace grows from the baseline: paths wind bottom → top.
  const fromBottom = motion === 'trace';
  const strandA = useMemo(
    () => buildHelixPath(0, 120, fromBottom),
    [fromBottom],
  );
  const strandB = useMemo(
    () => buildHelixPath(Math.PI, 120, fromBottom),
    [fromBottom],
  );
  const guidePath = useMemo(
    () => buildHelixPath(0.35, 120, fromBottom),
    [fromBottom],
  );
  const dustMotes = useMemo(() => buildDustMotes(72), []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduce =
        !ignoreReducedMotion &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const strandPaths = gsap.utils.toArray<SVGPathElement>(
        '.helix-strand',
        root,
      );
      const beatEls = gsap.utils.toArray<HTMLElement>('.helix-beat', root);
      const markEls = gsap.utils.toArray<HTMLElement>('.helix-mark', root);
      const traveler = root.querySelector<SVGCircleElement>('.helix-traveler');
      const glow = root.querySelector<SVGPathElement>('.helix-glow-strand');
      const dustEls = gsap.utils.toArray<SVGCircleElement>('.helix-dust', root);
      const dustLayer = root.querySelector<SVGGElement>('.helix-dust-layer');

      gsap.set(beatEls, { opacity: 1, y: 0, filter: 'none' });
      gsap.set(markEls, { opacity: 1, y: 0, scale: 1 });
      if (traveler) gsap.set(traveler, { opacity: 0 });
      if (glow) gsap.set(glow, { opacity: 0 });
      if (dustLayer) {
        gsap.set(dustLayer, { opacity: motion === 'dust' ? 1 : 0 });
      }
      if (motion !== 'dust') {
        gsap.set(strandPaths, { opacity: (i) => (i === 1 ? 0.85 : 1) });
      }

      if (reduce) {
        strandPaths.forEach((path) => {
          path.removeAttribute('stroke-dasharray');
          path.removeAttribute('stroke-dashoffset');
        });
        if (motion === 'dust') {
          gsap.set(strandPaths, { opacity: 0.16 });
          dustEls.forEach((el, i) => {
            const mote = dustMotes[i];
            if (!mote) return;
            const pt = helixPoint(
              mote.t,
              mote.strand === 0 ? 0 : Math.PI,
            );
            gsap.set(el, {
              attr: {
                cx: pt.x + mote.drift * 0.35,
                cy: pt.y,
                r: mote.r,
              },
              opacity: mote.opacity * 0.9,
            });
          });
        }
        return;
      }

      if (motion === 'dust') {
        gsap.set(strandPaths, { opacity: 0.14 });
        gsap.set(beatEls, { opacity: 1, y: 0, filter: 'none' });
        gsap.set(markEls, { opacity: 0.92, scale: 1, y: 0 });

        const state = dustMotes.map((mote) => ({ ...mote }));

        const place = () => {
          dustEls.forEach((el, i) => {
            const mote = state[i];
            if (!mote) return;
            const pt = helixPoint(
              mote.t,
              mote.strand === 0 ? 0 : Math.PI,
            );
            const lateral =
              Math.cos(mote.t * Math.PI * 2 * TURNS + mote.strand) *
              mote.drift;
            gsap.set(el, {
              attr: {
                cx: pt.x + lateral * 0.5,
                cy: pt.y,
                r: mote.r,
              },
            });
          });
        };

        place();

        const tick = () => {
          for (let i = 0; i < state.length; i += 1) {
            const mote = state[i];
            if (!mote) continue;
            mote.t = (mote.t + mote.speed * 0.012) % 1;
          }
          place();
        };
        gsap.ticker.add(tick);

        dustEls.forEach((el, i) => {
          const mote = state[i];
          if (!mote) return;
          const base = mote.opacity;
          gsap.fromTo(
            el,
            { opacity: base * 0.4 },
            {
              opacity: Math.min(0.88, base * (mote.warmth ? 1.4 : 1.15)),
              duration: 2.2 + (i % 5) * 0.3,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              delay: (i % 7) * 0.16,
            },
          );
        });

        return () => {
          gsap.ticker.remove(tick);
        };
      }

      if (motion === 'unwind') {
        const state = { phase: 0 };
        const updateStrands = () => {
          if (strandPaths[0]) {
            strandPaths[0].setAttribute('d', buildHelixPath(state.phase));
          }
          if (strandPaths[1]) {
            strandPaths[1].setAttribute(
              'd',
              buildHelixPath(state.phase + Math.PI),
            );
          }
        };

        updateStrands();
        gsap.to(state, {
          phase: Math.PI * 2,
          duration: 14,
          ease: 'none',
          repeat: -1,
          onUpdate: updateStrands,
        });
        return;
      }

      if (motion === 'trace') {
        strandPaths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        });
        gsap.set(markEls, { opacity: 0, y: 8, scale: 0.88 });
        gsap.set(beatEls, { opacity: 0, y: 14, filter: 'blur(5px)' });

        const tl = gsap.timeline({
          repeat: playback === 'loop' ? -1 : 0,
          repeatDelay: playback === 'loop' ? 1.2 : 0,
          defaults: { ease: 'power2.out' },
          scrollTrigger:
            playback === 'once'
              ? {
                  trigger: root,
                  start: 'top 78%',
                  once: true,
                }
              : undefined,
        });

        tl.to(strandPaths, {
          strokeDashoffset: 0,
          duration: 3,
          stagger: 0.16,
          ease: 'power1.inOut',
        });

        // Path draws bottom→top; reveal Recognize → Observe → Pause.
        const revealOrder = fromBottom
          ? beatEls.map((_, i) => beatEls.length - 1 - i)
          : beatEls.map((_, i) => i);

        revealOrder.forEach((beatIndex, order) => {
          const at = 0.55 + order * 0.7;
          tl.to(
            markEls[beatIndex] ?? null,
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: EASE },
            at,
          );
          tl.to(
            beatEls[beatIndex] ?? null,
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.7,
              ease: EASE,
            },
            at + 0.08,
          );
        });

        if (playback === 'loop') {
          tl.to({}, { duration: 1.8 });
          tl.to(
            [...strandPaths, ...beatEls, ...markEls],
            { opacity: 0.2, duration: 0.65, ease: 'power1.inOut' },
            '+=0.15',
          );
          tl.set(strandPaths, {
            strokeDashoffset: (_i, target) => {
              const path = target as SVGPathElement;
              return path.getTotalLength();
            },
            opacity: 1,
          });
          tl.set(markEls, { opacity: 0, y: 8, scale: 0.88 });
          tl.set(beatEls, { opacity: 0, y: 14, filter: 'blur(5px)' });
        }
        return;
      }

      // current
      const guide = root.querySelector<SVGPathElement>('.helix-guide');
      if (!traveler || !guide) return;

      gsap.set(beatEls, { opacity: 0.28 });
      gsap.set(markEls, { opacity: 0.28, scale: 0.94 });
      gsap.set(traveler, { opacity: 0.95, attr: { r: 4.5 } });
      if (glow) {
        const len = glow.getTotalLength();
        gsap.set(glow, {
          opacity: 0.5,
          strokeDasharray: `36 ${len}`,
          strokeDashoffset: 0,
        });
      }

      const tl = gsap.timeline({
        repeat: playback === 'loop' ? -1 : 0,
        defaults: { ease: 'none' },
        scrollTrigger:
          playback === 'once'
            ? {
                trigger: root,
                start: 'top 78%',
                once: true,
              }
            : undefined,
      });

      tl.to(
        traveler,
        {
          duration: 5.5,
          motionPath: {
            path: guide,
            align: guide,
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
        },
        0,
      );

      if (glow) {
        const len = glow.getTotalLength();
        tl.to(
          glow,
          { strokeDashoffset: -len, duration: 5.5, ease: 'none' },
          0,
        );
      }

      beatEls.forEach((_, i) => {
        const at = 0.4 + i * 1.55;
        tl.to(
          [markEls[i], beatEls[i]].filter(Boolean) as HTMLElement[],
          { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
          at,
        );
        if (playback === 'loop' && i < beatEls.length - 1) {
          tl.to(
            [markEls[i], beatEls[i]].filter(Boolean) as HTMLElement[],
            { opacity: 0.38, duration: 0.5, ease: 'sine.inOut' },
            at + 1.1,
          );
        }
      });

      if (playback === 'loop') tl.to({}, { duration: 0.9 });
    },
    {
      scope: rootRef,
      dependencies: [
        motion,
        playback,
        ignoreReducedMotion,
        fromBottom,
        dustMotes,
      ],
    },
  );

  return (
    <div
      ref={rootRef}
      className={[
        'helix-lockup relative mx-auto w-full max-w-[24rem] text-cream',
        rooted ? 'pb-0' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-motion={motion}
      data-rooted={rooted ? 'true' : 'false'}
    >
      {brandLabel ? (
        <p className="mb-8 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.38em] text-cream/45">
          {brandLabel}
        </p>
      ) : null}

      <div className="relative">
        <svg
          className="helix-svg pointer-events-none absolute inset-0 h-full w-full text-cream/70"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMax meet"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#f2f0e9" stopOpacity="0.85" />
              <stop offset="12%" stopColor="#f2f0e9" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#9fb5aa" stopOpacity="0.55" />
              <stop offset="88%" stopColor="#f2f0e9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f2f0e9" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          <path
            className="helix-guide"
            d={guidePath}
            stroke="transparent"
            strokeWidth="1"
            fill="none"
          />
          <path
            className="helix-glow-strand"
            d={strandA}
            stroke="#9fb5aa"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0"
          />
          <path
            className="helix-strand"
            d={strandA}
            stroke={`url(#${gradId})`}
            strokeWidth="1.35"
            strokeLinecap="round"
          />
          <path
            className="helix-strand"
            d={strandB}
            stroke={`url(#${gradId})`}
            strokeWidth="1.35"
            strokeLinecap="round"
            opacity="0.85"
          />
          <g
            className="helix-dust-layer"
            opacity={motion === 'dust' ? 1 : 0}
          >
            {dustMotes.map((mote, i) => {
              const pt = helixPoint(
                mote.t,
                mote.strand === 0 ? 0 : Math.PI,
              );
              return (
                <circle
                  key={`dust-${i}`}
                  className="helix-dust"
                  cx={pt.x}
                  cy={pt.y}
                  r={mote.r}
                  fill={mote.warmth ? '#d8c9a4' : '#f2f0e9'}
                  opacity={mote.opacity}
                  style={{ mixBlendMode: 'screen' }}
                />
              );
            })}
          </g>
          <circle
            className="helix-traveler"
            r="4.5"
            fill="#9fb5aa"
            opacity="0"
          />
        </svg>

        <ol
          className={[
            'relative z-10 flex min-h-[38rem] list-none flex-col justify-between gap-16 pl-0',
            rooted ? 'pb-10 pt-8' : 'py-8',
          ].join(' ')}
        >
          {beats.map((beat) => {
            const alignRight = beat.side === 'right';
            return (
              <li
                key={beat.head}
                className={[
                  'w-[48%] px-1',
                  alignRight ? 'ml-auto text-right' : 'mr-auto text-left',
                ].join(' ')}
              >
                <div
                  className={[
                    'helix-mark mb-3 flex w-full max-w-[20ch] text-cream/88',
                    alignRight ? 'ml-auto justify-end' : 'justify-start',
                  ].join(' ')}
                >
                  <BeatMark mark={beat.mark} />
                </div>
                <div className="helix-beat">
                  <h3 className="font-serif text-[clamp(2rem,8vw,2.65rem)] italic leading-[1.05] tracking-[-0.02em] text-cream/92">
                    {beat.head}
                  </h3>
                  {beat.body ? (
                    <p
                      className={[
                        'mt-2.5 max-w-[20ch] font-sans text-[0.84rem] leading-relaxed text-cream/48',
                        alignRight ? 'ml-auto' : '',
                      ].join(' ')}
                    >
                      {beat.body}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {rooted ? (
        <div
          className="helix-baseline pointer-events-none relative z-20 mt-0 h-px w-screen max-w-none -translate-x-1/2 left-1/2 bg-cream/20"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
