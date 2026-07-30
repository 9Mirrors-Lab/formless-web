import { useLayoutEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import gsap from 'gsap';

import {
  TEACHING_ICON_CATEGORIES,
  TEACHING_ICONS,
  type TeachingIconCategory,
  type TeachingIconSpec,
} from '@/components/iconography/teachingIcons';
import {
  ICON_ANIMATIONS,
  type IconAnimationSpec,
} from '@/data/iconAnimations';

export const PLAYGROUND_EASINGS = [
  'none',
  'sine.inOut',
  'power1.in',
  'power1.out',
  'power1.inOut',
  'power2.in',
  'power2.out',
  'power2.inOut',
  'power3.out',
  'power3.inOut',
  'elastic.out(1, 0.3)',
] as const;

export type PlaygroundEasing = (typeof PLAYGROUND_EASINGS)[number];

export const PLAYGROUND_LOOPS = [
  { id: 'infinite', label: 'infinite' },
  { id: 'yoyo', label: 'yoyo' },
  { id: 'yoyo-delay', label: 'yoyo + delay' },
  { id: 'repeat-delay', label: 'repeat + delay' },
] as const;

export type PlaygroundLoopId = (typeof PLAYGROUND_LOOPS)[number]['id'];

export const PLAYGROUND_DURATIONS = [0.8, 1.2, 1.5, 2, 2.5, 3, 4, 6, 8, 12, 20] as const;

type MotionControls = {
  duration: number;
  easing: PlaygroundEasing;
  loop: PlaygroundLoopId;
};

function parseDurationSeconds(raw: string): number {
  const match = raw.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 2.5;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : 2.5;
}

function nearestDuration(value: number): number {
  return PLAYGROUND_DURATIONS.reduce((best, option) =>
    Math.abs(option - value) < Math.abs(best - value) ? option : best,
  );
}

function parsePrimaryEasing(raw: string): PlaygroundEasing {
  const primary = raw.split('/')[0]?.trim() ?? 'power1.inOut';
  const match = PLAYGROUND_EASINGS.find((entry) => entry === primary);
  return match ?? 'power1.inOut';
}

function parseLoopMode(raw: string): PlaygroundLoopId {
  const lower = raw.toLowerCase();
  if (lower.includes('yoyo') && lower.includes('delay')) return 'yoyo-delay';
  if (lower.includes('repeat') && lower.includes('delay')) return 'repeat-delay';
  if (lower.includes('yoyo')) return 'yoyo';
  return 'infinite';
}

function defaultsFromSpec(spec: IconAnimationSpec | undefined): MotionControls {
  if (!spec) {
    return { duration: 2.5, easing: 'power1.inOut', loop: 'infinite' };
  }
  return {
    duration: nearestDuration(parseDurationSeconds(spec.duration)),
    easing: parsePrimaryEasing(spec.easing),
    loop: parseLoopMode(spec.loop),
  };
}

function loopProps(loop: PlaygroundLoopId): {
  repeat: number;
  yoyo: boolean;
  repeatDelay?: number;
} {
  switch (loop) {
    case 'infinite':
      return { repeat: -1, yoyo: false };
    case 'yoyo':
      return { repeat: -1, yoyo: true };
    case 'yoyo-delay':
      return { repeat: -1, yoyo: true, repeatDelay: 1 };
    case 'repeat-delay':
      return { repeat: -1, yoyo: false, repeatDelay: 1 };
    default: {
      const _exhaustive: never = loop;
      return _exhaustive;
    }
  }
}

function $(root: HTMLElement, selector: string): Element[] {
  return gsap.utils.toArray<Element>(selector, root);
}

function has(root: HTMLElement, selector: string): boolean {
  return $(root, selector).length > 0;
}

/** Apply the icon's characteristic motion with playground overrides. */
export function applyTeachingIconPlaygroundMotion(
  root: HTMLElement,
  iconId: string,
  controls: MotionControls,
): gsap.Context {
  const { duration, easing, loop } = controls;
  const loopOpts = loopProps(loop);

  return gsap.context(() => {
    switch (iconId) {
      case 'dna':
        if (has(root, '.dna-gear')) {
          gsap.to($(root, '.dna-gear'), {
            rotation: 360,
            duration,
            ease: easing,
            ...loopOpts,
          });
        }
        break;
      case 'cells':
        if (has(root, '.laser-line')) {
          gsap.fromTo(
            $(root, '.laser-line'),
            { top: '0%' },
            { top: '100%', duration, ease: easing, ...loopOpts },
          );
        }
        break;
      case 'ekg':
        if (has(root, '.ekg-path')) {
          gsap.fromTo(
            $(root, '.ekg-path'),
            { strokeDashoffset: 250 },
            { strokeDashoffset: 0, duration, ease: easing, ...loopOpts },
          );
        }
        break;
      case 'neural':
        if (has(root, '.neural-node')) {
          gsap.to($(root, '.neural-node'), {
            scale: 1.3,
            duration,
            ease: easing,
            stagger: { each: 0.2, from: 'random' },
            transformOrigin: '50% 50%',
            ...loopOpts,
          });
        }
        if (has(root, '.neural-link')) {
          gsap.to($(root, '.neural-link'), {
            opacity: 0.3,
            duration: Math.max(0.6, duration * 0.9),
            ease: easing,
            stagger: { each: 0.3, from: 'random' },
            ...loopOpts,
          });
        }
        break;
      case 'molecule':
        if (has(root, '.molecule-group')) {
          gsap.to($(root, '.molecule-group'), {
            rotation: 360,
            duration: Math.max(duration, 8),
            ease: easing === 'none' ? 'none' : easing,
            transformOrigin: '50% 50%',
            repeat: -1,
          });
        }
        if (has(root, '.molecule-atom')) {
          gsap.to($(root, '.molecule-atom'), {
            scale: 1.4,
            duration: Math.min(duration, 2),
            ease: easing,
            stagger: 0.4,
            transformOrigin: '50% 50%',
            ...loopOpts,
          });
        }
        break;
      case 'quantum':
        if (has(root, '.quantum-ring-1')) {
          gsap.to($(root, '.quantum-ring-1'), {
            rotation: 360,
            duration,
            ease: 'none',
            transformOrigin: '50% 50%',
            repeat: -1,
          });
        }
        if (has(root, '.quantum-ring-2')) {
          gsap.to($(root, '.quantum-ring-2'), {
            rotation: -360,
            duration: duration * 1.4,
            ease: 'none',
            transformOrigin: '50% 50%',
            repeat: -1,
          });
        }
        if (has(root, '.quantum-ring-3')) {
          gsap.to($(root, '.quantum-ring-3'), {
            rotation: 360,
            duration: duration * 1.8,
            ease: 'none',
            transformOrigin: '50% 50%',
            repeat: -1,
          });
        }
        if (has(root, '.quantum-core-dot')) {
          gsap.to($(root, '.quantum-core-dot'), {
            scale: 1.5,
            opacity: 0.7,
            duration: Math.min(duration, 1.5),
            ease: easing,
            transformOrigin: '50% 50%',
            ...loopOpts,
          });
        }
        break;
      case 'observer':
        if (has(root, '.observer-wave') || has(root, '.observer-ring')) {
          const waves = [...$(root, '.observer-wave'), ...$(root, '.observer-ring')];
          gsap.fromTo(
            waves,
            { scale: 1, opacity: 0.8 },
            {
              scale: 2.5,
              opacity: 0,
              duration,
              ease: easing,
              stagger: 0.6,
              transformOrigin: '50% 50%',
              ...loopOpts,
            },
          );
        }
        break;
      case 'space':
        if (has(root, '.space-circle-left')) {
          gsap.to($(root, '.space-circle-left'), {
            attr: { cx: 28 },
            duration,
            ease: easing,
            ...loopOpts,
          });
        }
        if (has(root, '.space-circle-right')) {
          gsap.to($(root, '.space-circle-right'), {
            attr: { cx: 72 },
            duration,
            ease: easing,
            ...loopOpts,
          });
        }
        break;
      case 'seed':
        if (has(root, '.seed-circle')) {
          const SEED_R = 20;
          const step = Math.min(duration * 0.28, 0.75);
          const expandTargets = (n: number) => [
            ...$(root, '.seed-circle-' + n),
            ...$(root, '.seed-clip-r-' + n),
            ...$(root, '.seed-lens-fill-' + n),
          ];

          gsap.set($(root, '.seed-circle, .seed-clip-r, .seed-lens'), { attr: { r: 0 } });
          gsap.set($(root, '.seed-spark'), {
            opacity: 0,
            scale: 0,
            transformOrigin: '50% 50%',
          });

          const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: loop.includes('delay') ? 1 : 1.1,
            defaults: { ease: easing },
          });

          const sparkExpand = (n: number) => {
            const spark = $(root, '.seed-spark-' + n);
            const targets = expandTargets(n);
            tl.to(spark, { opacity: 1, scale: 1, duration: step * 0.35 }, '+=0.1');
            tl.to(
              targets,
              { attr: { r: SEED_R }, duration: step, ease: easing },
              '-=0.06',
            );
            tl.to(
              spark,
              { opacity: 0, scale: 0.4, duration: step * 0.4, ease: 'power1.in' },
              '-=0.28',
            );
          };

          sparkExpand(1);
          sparkExpand(2);
          sparkExpand(3);
          sparkExpand(4);
          sparkExpand(5);
          sparkExpand(6);
          sparkExpand(7);
          tl.to({}, { duration: Math.max(duration * 0.35, 1.2) });
          tl.to(
            [
              ...$(root, '.seed-orbit'),
              ...$(root, '.seed-clip-orbit'),
              ...$(root, '.seed-lens-orbit'),
            ],
            {
              attr: { r: 0 },
              duration: step * 0.85,
              stagger: 0.04,
              ease: 'power1.in',
            },
          );
          tl.to($(root, '.seed-spark'), { opacity: 0, scale: 0, duration: 0.2 }, '<');
          tl.to(
            [...$(root, '.seed-circle-1'), ...$(root, '.seed-clip-r-1')],
            { attr: { r: 0 }, duration: step * 0.6, ease: 'power1.in' },
            '-=0.15',
          );
        }
        break;
      case 'awakening':
        if (has(root, '.wake-sun')) {
          gsap.fromTo(
            $(root, '.wake-sun'),
            { y: 15 },
            { y: -10, duration, ease: easing, ...loopOpts },
          );
        }
        if (has(root, '.wake-beam')) {
          gsap.fromTo(
            $(root, '.wake-beam'),
            { scaleY: 0, opacity: 0 },
            {
              scaleY: 1,
              opacity: 1,
              duration: duration * 0.55,
              ease: easing,
              stagger: 0.15,
              transformOrigin: 'bottom center',
              ...loopOpts,
            },
          );
        }
        break;
      case 'grounded':
        if (has(root, '.ground-wind')) {
          gsap.to($(root, '.ground-wind'), {
            rotation: 360,
            duration: Math.max(duration, 6),
            ease: 'none',
            transformOrigin: '50% 50%',
            repeat: -1,
          });
        }
        if (has(root, '.ground-root')) {
          gsap.fromTo(
            $(root, '.ground-root'),
            { strokeDasharray: '0 100' },
            { strokeDasharray: '100 100', duration, ease: easing, ...loopOpts },
          );
        }
        break;
      case 'clarity':
        if (has(root, '.fog-dot')) {
          gsap.to($(root, '.fog-dot'), {
            x: 0,
            y: 0,
            opacity: 1,
            duration,
            ease: easing,
            stagger: { each: 0.05, from: 'random' },
            ...loopOpts,
          });
        }
        break;
      case 'illusion':
        if (has(root, '.illusion-box')) {
          gsap.to($(root, '.illusion-box'), {
            opacity: 0,
            scale: 1.2,
            duration,
            ease: easing,
            transformOrigin: '50% 50%',
            ...loopOpts,
          });
        }
        if (has(root, '.illusion-ring')) {
          gsap.fromTo(
            $(root, '.illusion-ring'),
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration,
              ease: easing,
              delay: duration * 0.4,
              transformOrigin: '50% 50%',
              ...loopOpts,
            },
          );
        }
        break;
      case 'undertow':
        if (has(root, '.undertow-group')) {
          gsap.fromTo(
            $(root, '.undertow-group'),
            { rotation: 0 },
            {
              rotation: 1080,
              duration,
              ease: easing,
              transformOrigin: '50% 50%',
              ...loopOpts,
            },
          );
        }
        break;
      case 'flow':
        if (has(root, '.flow-wave')) {
          gsap.to($(root, '.flow-wave'), {
            x: -100,
            duration,
            ease: easing,
            ...loopOpts,
          });
        }
        break;
      case 'releasing':
        if (has(root, '.release-knot')) {
          gsap.to($(root, '.release-knot'), {
            scale: 0.5,
            opacity: 0,
            duration,
            ease: easing,
            transformOrigin: '50% 50%',
            ...loopOpts,
          });
        }
        if (has(root, '.release-line')) {
          gsap.fromTo(
            $(root, '.release-line'),
            { y: 20, opacity: 0 },
            {
              y: -15,
              opacity: 1,
              duration: duration * 0.85,
              ease: easing,
              stagger: 0.2,
              ...loopOpts,
            },
          );
        }
        break;
      case 'north':
        if (has(root, '.north-needle')) {
          const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: loop === 'yoyo-delay' || loop === 'repeat-delay' ? 1 : 2,
          });
          tl.to($(root, '.north-needle'), {
            rotation: 70,
            duration: Math.min(0.2, duration * 0.08),
            transformOrigin: '50% 50%',
            ease: easing,
          })
            .to($(root, '.north-needle'), {
              rotation: -50,
              duration: Math.min(0.25, duration * 0.1),
              ease: easing,
            })
            .to($(root, '.north-needle'), {
              rotation: 30,
              duration: Math.min(0.2, duration * 0.08),
              ease: easing,
            })
            .to($(root, '.north-needle'), {
              rotation: 0,
              duration: Math.max(0.8, duration * 0.5),
              ease: 'elastic.out(1, 0.3)',
            });
        }
        break;
      case 'voice':
        if (has(root, '.voice-ring')) {
          const tl = gsap.timeline({ repeat: -1 });
          tl.to($(root, '.voice-ring'), {
            rotation: 180,
            duration: duration * 0.5,
            ease: easing,
            transformOrigin: '50% 50%',
          })
            .to(
              $(root, '.voice-ring'),
              {
                scale: 0.8,
                opacity: 0,
                duration: duration * 0.25,
                ease: easing,
                transformOrigin: '50% 50%',
              },
              '+=0.3',
            )
            .to(
              $(root, '.voice-ring'),
              {
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: duration * 0.25,
                transformOrigin: '50% 50%',
              },
              '+=0.3',
            );
        }
        break;
      case 'pause':
        if (has(root, '.pause-bar-left') && has(root, '.pause-bar-right')) {
          const tl = gsap.timeline({
            repeat: -1,
            yoyo: loop !== 'infinite',
            repeatDelay: loop.includes('delay') ? 1 : 0.4,
          });
          tl.to($(root, '.pause-bar-left'), { x: 12, duration: duration * 0.5, ease: easing }, 0).to(
            $(root, '.pause-bar-right'),
            { x: -12, duration: duration * 0.5, ease: easing },
            0,
          );
        }
        break;
      case 'reflection':
        if (
          has(root, '.reflect-circle-left') &&
          has(root, '.reflect-circle-right') &&
          has(root, '.reflect-line')
        ) {
          const tl = gsap.timeline({
            repeat: -1,
            yoyo: true,
            repeatDelay: loop.includes('delay') ? 1 : 0.5,
          });
          tl.fromTo(
            $(root, '.reflect-circle-left'),
            { x: -20 },
            { x: -5, duration, ease: easing },
            0,
          )
            .fromTo(
              $(root, '.reflect-circle-right'),
              { x: 20 },
              { x: 5, duration, ease: easing },
              0,
            )
            .to(
              $(root, '.reflect-line'),
              { opacity: 0.2, scaleY: 0.5, duration: duration * 0.5, transformOrigin: '50% 50%' },
              duration * 0.4,
            );
        }
        break;
      case 'relief':
        if (has(root, '.relief-box')) {
          gsap.to($(root, '.relief-box'), {
            attr: { rx: 25, ry: 25 },
            rotation: 90,
            scale: 0.8,
            strokeWidth: 1,
            opacity: 0.5,
            duration,
            ease: easing,
            transformOrigin: '50% 50%',
            ...loopOpts,
          });
        }
        break;
      case 'trigger':
        if (has(root, '.trigger-arrow') && has(root, '.trigger-shield')) {
          const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: loop.includes('delay') ? 1 : 0.8,
          });
          tl.to($(root, '.trigger-arrow'), { x: 15, duration: duration * 0.2, ease: easing })
            .to(
              $(root, '.trigger-shield'),
              {
                x: 5,
                scaleX: 0.6,
                duration: duration * 0.2,
                ease: easing,
                transformOrigin: 'center left',
              },
              '<',
            )
            .to($(root, '.trigger-shield'), {
              x: 0,
              scaleX: 1,
              duration: duration * 0.4,
              ease: 'elastic.out(1, 0.3)',
            })
            .to(
              $(root, '.trigger-arrow'),
              { x: 0, duration: duration * 0.4, ease: 'elastic.out(1, 0.3)' },
              '<0.1',
            );
        }
        break;
      case 'shift':
        if (has(root, '.shift-diamond') && has(root, '.shift-core')) {
          const tl = gsap.timeline({
            repeat: -1,
            yoyo: true,
            repeatDelay: loop.includes('delay') ? 1 : 0.5,
          });
          tl.to($(root, '.shift-diamond'), {
            rotation: 45,
            scale: 0.8,
            duration,
            ease: easing,
            transformOrigin: '50% 50%',
          }).to(
            $(root, '.shift-core'),
            {
              scale: 3,
              opacity: 0.8,
              duration,
              ease: easing,
              transformOrigin: '50% 50%',
            },
            '<',
          );
        }
        break;
      case 'tangle':
        if (has(root, '.tangle-chaos') && has(root, '.tangle-straight')) {
          const tl = gsap.timeline({
            repeat: -1,
            yoyo: true,
            repeatDelay: loop.includes('delay') ? 1 : 0.5,
          });
          tl.to(
            $(root, '.tangle-chaos'),
            {
              opacity: 0,
              scale: 0.8,
              duration,
              ease: easing,
              transformOrigin: '50% 50%',
            },
            0,
          ).fromTo(
            $(root, '.tangle-straight'),
            { opacity: 0, scaleX: 0 },
            {
              opacity: 1,
              scaleX: 1,
              duration,
              ease: easing,
              transformOrigin: '50% 50%',
            },
            duration * 0.3,
          );
        }
        break;
      case 'anchor':
        if (has(root, '.anchor-pendulum')) {
          gsap.fromTo(
            $(root, '.anchor-pendulum'),
            { rotation: -18, immediateRender: true, svgOrigin: '50 20' },
            {
              rotation: 18,
              duration,
              ease: easing,
              svgOrigin: '50 20',
              ...loopOpts,
            },
          );
        }
        break;
      case 'formless':
        if (has(root, '.formless-ring')) {
          gsap.fromTo(
            $(root, '.formless-ring'),
            { scale: 1, opacity: 0.85 },
            {
              scale: 2,
              opacity: 0,
              duration,
              ease: easing,
              stagger: duration * 0.32,
              transformOrigin: '50% 50%',
              ...loopOpts,
            },
          );
        }
        break;
      default:
        break;
    }
  }, root);
}

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#9fb5aa]/70">
      {children}
    </span>
  );
}

function SelectControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
        className="w-full truncate border border-[#9fb5aa]/25 bg-transparent px-2.5 py-2 font-mono text-[11px] text-cream/90 outline-none transition-colors focus:border-[#9fb5aa]/70"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#080a09] text-cream">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function IconMotionCard({
  icon,
  spec,
  inUse = false,
}: {
  icon: TeachingIconSpec;
  spec: IconAnimationSpec | undefined;
  /** True when this mark ships on a public product page (not design reference). */
  inUse?: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const shipped = useMemo(() => defaultsFromSpec(spec), [spec]);
  const [controls, setControls] = useState<MotionControls>(shipped);
  const dirty =
    controls.duration !== shipped.duration ||
    controls.easing !== shipped.easing ||
    controls.loop !== shipped.loop;

  useLayoutEffect(() => {
    const root = stageRef.current;
    if (!root) return;
    const ctx = applyTeachingIconPlaygroundMotion(root, icon.id, controls);
    return () => ctx.revert();
  }, [icon.id, controls]);

  return (
      <article className="grid grid-cols-1 md:grid-cols-[minmax(11rem,15rem)_minmax(0,1fr)]">
        <div
          ref={stageRef}
          className="relative flex min-h-[12rem] items-center justify-center border-b border-[#9fb5aa]/18 md:min-h-[14rem] md:border-b-0"
        >
          {inUse ? (
            <span className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.22em] text-clay">
              Live
            </span>
          ) : null}
          <div className="pointer-events-none absolute inset-3 border border-dashed border-[#9fb5aa]/12" aria-hidden />
          {icon.render({ theme: 'dark' })}
        </div>

        <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-sans text-base font-semibold tracking-wide text-cream">{icon.title}</h3>
              {dirty ? (
                <button
                  type="button"
                  onClick={() => setControls(shipped)}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9fb5aa] transition-colors hover:text-cream"
                >
                  Reset
                </button>
              ) : null}
            </div>
            <p className="font-mono text-[11px] tracking-wide text-[#9fb5aa]">
              id: <span className="text-cream/90">{icon.id}</span>
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-cream/65">{icon.desc}</p>
          </div>

          <div className="grid gap-3 border-t border-[#9fb5aa]/15 pt-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <FieldLabel>Motion</FieldLabel>
              <p className="text-[12px] leading-snug text-cream/70">{spec?.motion ?? 'Custom loop'}</p>
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Targets</FieldLabel>
              <p className="break-all font-mono text-[10px] leading-snug text-[#9fb5aa]/90">
                {spec?.targets ?? '—'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-[#9fb5aa]/15 pt-3 sm:grid-cols-3">
            <SelectControl
              label="Duration"
              value={String(controls.duration)}
              options={PLAYGROUND_DURATIONS.map((value) => ({
                value: String(value),
                label: `${value}s`,
              }))}
              onChange={(value) =>
                setControls((current) => ({ ...current, duration: Number(value) }))
              }
            />
            <SelectControl
              label="Easing"
              value={controls.easing}
              options={PLAYGROUND_EASINGS.map((value) => ({ value, label: value }))}
              onChange={(value) =>
                setControls((current) => ({
                  ...current,
                  easing: value as PlaygroundEasing,
                }))
              }
            />
            <SelectControl
              label="Loop"
              value={controls.loop}
              options={PLAYGROUND_LOOPS.map((entry) => ({
                value: entry.id,
                label: entry.label,
              }))}
              onChange={(value) =>
                setControls((current) => ({
                  ...current,
                  loop: value as PlaygroundLoopId,
                }))
              }
            />
          </div>
        </div>
      </article>
  );
}

/** Same section titles + sentences as /icons, for a clear cognitive break per group. */
const STUDIO_SECTIONS: Array<{
  category: TeachingIconCategory;
  title: string;
  intro: string;
}> = [
  {
    category: 'Protocol',
    title: 'Measurement-style icons',
    intro:
      'Stands for how the book and site contrast human experience with charts, vitals, wiring, and odds: the way a life gets reduced to numbers and parts.',
  },
  {
    category: 'Philosophy',
    title: 'Theme icons',
    intro:
      'One mark per teaching theme the book returns to: witness, space, ground, clarity, problems-as-label, pull of old habit, allowing, dropping judgment, and inner direction.',
  },
  {
    category: 'Realization',
    title: 'Narrative order icons',
    intro:
      'Same teaching beats as the client brief and book walkthrough: voice, pause, reflection, relief, trigger, shift, tangle, anchor, formless.',
  },
];

/**
 * Teaching icon ids that ship on public product pages today.
 * Design reference pages (/design-system, /icons, /components) do not count.
 * Update this list when a mark is wired into real site UI.
 */
export const LIVE_ON_SITE_TEACHING_ICON_IDS = ['formless'] as const;

type TeachingIconMotionStudioProps = {
  categories?: TeachingIconCategory[];
  className?: string;
};

/**
 * Design-system icon studio: live mark + motion controls in one blueprint row.
 * Pick an id for product use; tune duration / easing / loop and watch the loop update.
 */
export function TeachingIconMotionStudio({
  categories = TEACHING_ICON_CATEGORIES,
  className = '',
}: TeachingIconMotionStudioProps) {
  const sections = STUDIO_SECTIONS.filter((section) => categories.includes(section.category));

  return (
    <div className={`space-y-20 ${className}`.trim()}>
      {sections.map((section, index) => {
        const icons = TEACHING_ICONS.filter((icon) => icon.category === section.category);
        if (icons.length === 0) return null;
        return (
          <section key={section.category} className="relative">
            <div className="mb-8 border-b border-[#9fb5aa]/25 pb-5">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9fb5aa]/80">
                  {String(index + 1).padStart(2, '0')} / {section.category}
                </span>
                <span className="h-px flex-1 bg-[#9fb5aa]/15" aria-hidden />
              </div>
              <h3 className="font-serif text-2xl italic text-cream md:text-3xl">{section.title}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/65">{section.intro}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {icons.map((icon) => {
                const spec = ICON_ANIMATIONS.find((entry) => entry.id === icon.id);
                const inUse = (LIVE_ON_SITE_TEACHING_ICON_IDS as readonly string[]).includes(
                  icon.id,
                );
                return (
                  <IconMotionCard key={icon.id} icon={icon} spec={spec} inUse={inUse} />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
