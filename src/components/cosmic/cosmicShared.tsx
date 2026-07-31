/**
 * Shared cosmic lab primitives — science orbit grammar + design-system marks.
 * Lab only (/cosmic-concepts); does not change production home until promoted.
 */

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import { ParticleButton } from '@/components/ParticleButton';
import { useContent } from '@/context/ContentContext';
import { useSiteAccess } from '@/context/SiteAccessContext';
import { useIconAnimations } from '@/hooks/useIconAnimations';
import { stripAnchorsFromCopy } from '@/lib/stripCopyLinks';

export const COSMIC_GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='ng'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23ng)'/%3E%3C/svg%3E")`;

export type CosmicVariantId = 'a' | 'b' | 'c' | 'd';

export const COSMIC_VARIANTS: {
  id: CosmicVariantId;
  label: string;
  title: string;
  blurb: string;
}[] = [
  {
    id: 'a',
    label: 'A',
    title: 'Annotated observatory',
    blurb: 'Science orbit + teaching icons on clay nodes',
  },
  {
    id: 'b',
    label: 'B',
    title: 'Icon constellation',
    blurb: 'TeachingIconGrid as starfield',
  },
  {
    id: 'c',
    label: 'C',
    title: 'Pillar index home',
    blurb: 'Science page machine on home',
  },
  {
    id: 'd',
    label: 'D',
    title: 'Nucleus witness',
    blurb: 'Edge-to-edge orbit, readout panel',
  },
];

export function CosmicAtmosphere({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 mix-blend-soft-light opacity-[0.09]"
        style={{ backgroundImage: COSMIC_GRAIN }}
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

export function CosmicAnnoBadge({
  keyChar,
  label,
  className = '',
  align = 'right',
}: {
  keyChar: string;
  label: string;
  className?: string;
  align?: 'left' | 'right';
}) {
  return (
    <div
      className={`pointer-events-none absolute flex items-center gap-2 ${
        align === 'left' ? 'flex-row-reverse' : ''
      } ${className}`}
    >
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-clay bg-[#07090a]/82 font-mono text-[9px] font-semibold text-clay">
        {keyChar}
      </span>
      <span className="rounded-sm bg-[#07090a]/58 px-1.5 py-0.5 font-serif text-[13px] italic text-cream/80">
        {label}
      </span>
    </div>
  );
}

/** Perception-style orbital rings (no baked-in annotations). */
export function OrbitRingsPerception({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 700"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-full w-full ${className}`}
      aria-hidden
    >
      <ellipse cx="400" cy="350" rx="375" ry="108" fill="none" stroke="#9FB5AA" strokeWidth="0.8" opacity="0.30" />
      <ellipse
        cx="400"
        cy="350"
        rx="272"
        ry="152"
        fill="none"
        stroke="#9FB5AA"
        strokeWidth="0.8"
        opacity="0.24"
        transform="rotate(32 400 350)"
      />
      <ellipse cx="400" cy="350" rx="148" ry="274" fill="none" stroke="#9FB5AA" strokeWidth="0.8" opacity="0.20" />
      <circle cx="400" cy="350" r="42" fill="none" stroke="#9FB5AA" strokeWidth="1" opacity="0.45" />
      <circle cx="400" cy="350" r="16" fill="#9FB5AA" opacity="0.12" />
      <line
        x1="400"
        y1="350"
        x2="775"
        y2="350"
        stroke="#CC5833"
        strokeWidth="0.6"
        strokeDasharray="4 9"
        opacity="0.28"
      />
      <line
        x1="400"
        y1="350"
        x2="400"
        y2="76"
        stroke="#9FB5AA"
        strokeWidth="0.6"
        strokeDasharray="4 9"
        opacity="0.20"
      />
      <line
        x1="400"
        y1="350"
        x2="568"
        y2="162"
        stroke="#9FB5AA"
        strokeWidth="0.5"
        strokeDasharray="3 8"
        opacity="0.18"
      />
    </svg>
  );
}

export function OrbitRingsConsciousness({ className = '' }: { className?: string }) {
  const cx = 400;
  const cy = 350;
  return (
    <svg
      viewBox="0 0 800 700"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-full w-full ${className}`}
      aria-hidden
    >
      <circle cx={cx} cy={cy} r="248" fill="none" stroke="#9FB5AA" strokeWidth="0.6" strokeDasharray="2 12" opacity="0.14" />
      <circle cx={cx} cy={cy} r="168" fill="none" stroke="#9FB5AA" strokeWidth="0.7" opacity="0.22" />
      <circle cx={cx} cy={cy} r="92" fill="none" stroke="#9FB5AA" strokeWidth="0.8" opacity="0.28" />
      <ellipse
        cx={cx}
        cy={cy}
        rx="300"
        ry="88"
        fill="none"
        stroke="#9FB5AA"
        strokeWidth="0.7"
        opacity="0.18"
        transform="rotate(-18 400 350)"
      />
      <ellipse
        cx={cx}
        cy={cy}
        rx="300"
        ry="88"
        fill="none"
        stroke="#9FB5AA"
        strokeWidth="0.7"
        opacity="0.18"
        transform="rotate(24 400 350)"
      />
      {[
        [620, 210],
        [705, 350],
        [620, 490],
        [180, 490],
        [95, 350],
        [180, 210],
      ].map(([x, y], i) => (
        <g key={i}>
          <line
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#9FB5AA"
            strokeWidth="0.55"
            opacity="0.16"
            strokeDasharray="3 8"
          />
          <circle cx={x} cy={y} r={i % 2 === 0 ? 4 : 3} fill={i % 2 === 0 ? '#CC5833' : '#9FB5AA'} opacity="0.62" />
        </g>
      ))}
    </svg>
  );
}

export function OrbitRingsObservation({ className = '' }: { className?: string }) {
  const rings = [72, 144, 216, 288, 360];
  return (
    <svg
      viewBox="0 0 800 700"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-full w-full ${className}`}
      aria-hidden
    >
      {rings.map((r, i) => (
        <circle
          key={`l${i}`}
          cx={268}
          cy={350}
          r={r}
          fill="none"
          stroke="#9FB5AA"
          strokeWidth="0.7"
          opacity={0.27 - i * 0.04}
        />
      ))}
      {rings.map((r, i) => (
        <circle
          key={`r${i}`}
          cx={532}
          cy={350}
          r={r}
          fill="none"
          stroke="#9FB5AA"
          strokeWidth="0.7"
          opacity={0.27 - i * 0.04}
        />
      ))}
      <line
        x1="400"
        y1="0"
        x2="400"
        y2="700"
        stroke="#9FB5AA"
        strokeWidth="0.6"
        strokeDasharray="3 10"
        opacity="0.18"
      />
    </svg>
  );
}

export function OrbitRingsNeuro({ className = '' }: { className?: string }) {
  const cx = 400;
  const cy = 370;
  const branches: [number, number][] = [
    [580, 210],
    [645, 375],
    [560, 545],
    [225, 210],
    [155, 375],
    [250, 545],
    [400, 135],
    [400, 610],
  ];
  return (
    <svg
      viewBox="0 0 800 740"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-full w-full ${className}`}
      aria-hidden
    >
      <circle cx={cx} cy={cy} r="228" fill="none" stroke="#9FB5AA" strokeWidth="0.6" strokeDasharray="2 12" opacity="0.14" />
      {branches.map(([x2, y2], i) => (
        <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="#9FB5AA" strokeWidth="0.9" opacity="0.30" />
      ))}
      {branches.map(([bx, by], i) => (
        <circle
          key={`d${i}`}
          cx={bx}
          cy={by}
          r={i % 3 === 0 ? 5 : 3.5}
          fill={i % 4 === 0 ? '#CC5833' : '#9FB5AA'}
          opacity="0.70"
        />
      ))}
      <circle cx={cx} cy={cy} r="13" fill="none" stroke="#9FB5AA" strokeWidth="1" opacity="0.50" />
      <circle cx={cx} cy={cy} r="5" fill="#9FB5AA" opacity="0.38" />
    </svg>
  );
}

export function useCosmicHeroCopy() {
  const { restricted } = useSiteAccess();
  const { getText, getLink } = useContent();
  const cx = (key: string) => {
    const raw = getText('home', 'hero', key);
    return restricted ? stripAnchorsFromCopy(raw) : raw;
  };
  const cta = restricted ? null : getLink('home', 'hero', 'cta_reflection');
  return {
    eyebrow: cx('eyebrow') || 'An Invitation to go within',
    headlinePrimary: cx('headline_primary') || 'Remembering Who You Are',
    headlineSecondary: cx('headline_secondary') || 'Beyond The Mind',
    lede:
      cx('lede') ||
      'The world teaches you to look outward for fulfillment. Eyes Closed points you inward.',
    cta,
  };
}

export function CosmicHeroCopyBlock({
  className = '',
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const copy = useCosmicHeroCopy();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cosmic-hero-elem', {
        y: 36,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      <span className="cosmic-hero-elem mb-7 block font-mono text-[11px] uppercase tracking-[0.24em] text-cream/70">
        {copy.eyebrow}
      </span>
      <h1
        className={`cosmic-hero-elem font-serif font-normal leading-[1.04] tracking-[-0.012em] text-cream ${
          compact
            ? 'text-[clamp(28px,4vw,44px)]'
            : 'text-[clamp(40px,5.8vw,72px)]'
        }`}
      >
        <span className="block">{copy.headlinePrimary}</span>
        <span className="block">{copy.headlineSecondary}</span>
      </h1>
      <p
        className={`cosmic-hero-elem mt-6 whitespace-pre-line font-serif leading-[1.55] text-cream/70 ${
          compact ? 'text-[17px]' : 'text-[19px] md:text-[21px]'
        }`}
      >
        {copy.lede}
      </p>
      {copy.cta ? (
        <div className="cosmic-hero-elem mt-8">
          <ParticleButton
            href={copy.cta.href}
            trackLocation="cosmic_concepts"
            trackLabel={copy.cta.text}
            className="!bg-moss !text-cream"
          >
            {copy.cta.text}
          </ParticleButton>
        </div>
      ) : null}
    </div>
  );
}

/** Scoped icon loops for a cosmic stage. */
export function CosmicIconStage({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);
  useIconAnimations(scope);
  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}

export function IconNode({
  id,
  size = 48,
  className = '',
  animate = true,
}: {
  id: string;
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <TeachingIconMark id={id} theme="dark" size={size} animate={animate} />
    </span>
  );
}
