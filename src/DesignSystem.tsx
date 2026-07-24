/**
 * Design System Foundations
 * Visual documentation of tokens and motion patterns.
 * Live at /design-system — dark immersive reference (matches /icons, brief-dark pages).
 */

import { useRef } from 'react';

import { TeachingIconGrid, TeachingIconMotionStrip } from '@/components/iconography/TeachingIconGrid';
import {
  ICON_ANIMATION_CATEGORIES,
  ICON_ANIMATIONS,
  type IconAnimationCategory,
} from '@/data/iconAnimations';
import { useIconAnimations } from '@/hooks/useIconAnimations';

const colors = {
  Brand: [
    { name: 'Moss', token: 'moss', hex: '#2E4036', textLight: true },
    { name: 'Clay', token: 'clay', hex: '#CC5833', textLight: true },
    { name: 'Cream', token: 'cream', hex: '#F2F0E9', textLight: false },
    { name: 'Charcoal', token: 'charcoal', hex: '#1A1A1A', textLight: true },
  ],
  'Dark accents': [
    { name: 'Moss Light', token: 'moss (on dark)', hex: '#9FB5AA', textLight: true },
    { name: 'Clay Light', token: 'clay (on dark)', hex: '#D46544', textLight: true },
    { name: 'Brief Dark', token: 'brief-dark', hex: '#080A09', textLight: true },
    { name: 'Icon Surface', token: 'icon-surface', hex: '#1A2332', textLight: true },
    { name: 'Chrome Muted', token: 'ce-chrome-muted', hex: '#9A9A94', textLight: true },
  ],
  'Moss Scale': [
    { name: 'Moss 900', token: 'moss-900', hex: '#1A2520', textLight: true },
    { name: 'Moss 700', token: 'moss-700', hex: '#243229', textLight: true },
    { name: 'Moss 500', token: 'moss-500', hex: '#2E4036', textLight: true },
    { name: 'Moss 300', token: 'moss-300', hex: '#4E6B5C', textLight: true },
    { name: 'Moss 100', token: 'moss-100', hex: '#A8C0B2', textLight: false },
  ],
  'Clay Scale': [
    { name: 'Clay 900', token: 'clay-900', hex: '#7A3420', textLight: true },
    { name: 'Clay 700', token: 'clay-700', hex: '#A34323', textLight: true },
    { name: 'Clay 500', token: 'clay-500', hex: '#CC5833', textLight: true },
    { name: 'Clay 300', token: 'clay-300', hex: '#E07A52', textLight: false },
    { name: 'Clay 100', token: 'clay-100', hex: '#F2C4B0', textLight: false },
  ],
  Semantic: [
    { name: 'Background (dark)', token: 'brief-dark', hex: '#080A09', textLight: true },
    { name: 'Background (light)', token: 'bg-cream', hex: '#F2F0E9', textLight: false },
    { name: 'Surface Dark', token: 'surface-dark', hex: '#1A2332', textLight: true },
    { name: 'Text Primary', token: 'text-cream', hex: '#F2F0E9', textLight: true },
    { name: 'Text Muted', token: 'text-cream/65', hex: '#F2F0E9A6', textLight: true },
    { name: 'Accent Warm', token: 'clay', hex: '#CC5833', textLight: true },
    { name: 'Accent Ground', token: 'moss', hex: '#2E4036', textLight: true },
  ],
};

const serifScale = [
  { label: 'Hero Display', size: '6.5rem', weight: 300, tracking: '0', lineHeight: '1.08', sample: 'A moment to go within' },
  { label: 'Section Headline', size: '3.75rem', weight: 300, tracking: '0', lineHeight: '1.1', sample: 'Who is listening?' },
  { label: 'Teaching XL', size: '3rem', weight: 400, tracking: '0', lineHeight: '1.15', sample: 'The bridge between nature and science.' },
  { label: 'Teaching MD', size: '1.5rem', weight: 400, tracking: '0', lineHeight: '1.4', sample: 'Space between you and the first rush to react.' },
  { label: 'Serif Body', size: '1.125rem', weight: 400, tracking: '0', lineHeight: '1.6', sample: 'Questions over declarations where teaching.' },
];

const sansScale = [
  { label: 'Body LG', size: '1.25rem', weight: 400, tracking: '0', lineHeight: '1.6' },
  { label: 'Body', size: '1rem', weight: 400, tracking: '0', lineHeight: '1.65' },
  { label: 'Body SM', size: '0.875rem', weight: 400, tracking: '0', lineHeight: '1.65' },
  { label: 'Label / CTA', size: '0.875rem', weight: 600, tracking: '0.15em', lineHeight: '1.5' },
  { label: 'Nav Link', size: '0.875rem', weight: 500, tracking: '0.05em', lineHeight: '1.5' },
];

const monoScale = [
  { label: 'Eyebrow', size: '0.75rem', weight: 400, tracking: '0.25em', sample: 'EYES CLOSED' },
  { label: 'Mono SM', size: '0.75rem', weight: 400, tracking: '0.2em', sample: 'SYSTEM.OPERATIONAL' },
  { label: 'Mono Base', size: '0.875rem', weight: 400, tracking: '0.1em', sample: 'PHASE.01' },
];

const spacing = [
  { token: 'space-4', value: '1rem', px: '16px' },
  { token: 'space-6', value: '1.5rem', px: '24px' },
  { token: 'space-8', value: '2rem', px: '32px' },
  { token: 'space-12', value: '3rem', px: '48px' },
  { token: 'space-16', value: '4rem', px: '64px' },
  { token: 'space-24', value: '6rem', px: '96px' },
  { token: 'space-32', value: '8rem', px: '128px' },
];

const radii = [
  { token: 'rounded-2xl', value: '1.5rem', label: 'Card' },
  { token: 'rounded-[2rem]', value: '2rem', label: 'Icon tile' },
  { token: 'rounded-[3rem]', value: '3rem', label: 'Section cap' },
  { token: 'rounded-full', value: '9999px', label: 'Pill / CTA' },
];

const motionPatterns = [
  { name: 'Scroll scrub', token: 'scrub: 1', use: 'Curtain reveal, fog-to-clarity' },
  { name: 'Cinematic ease', token: 'cubic-bezier(0.16, 1, 0.3, 1)', use: 'Hovers, UI transitions' },
  { name: 'Entrance', token: 'power3.inOut', use: 'Clip-path title reveals' },
  { name: 'Ambient drift', token: 'sine.inOut yoyo', use: 'Header blobs, icon loops' },
  { name: 'Icon loops', token: 'GSAP repeat: -1', use: 'Approved teaching marks (foundations + /icons)' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-20">
      <div className="mb-8 flex items-center gap-4 border-b border-cream/10 pb-4">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#9fb5aa]">
          Foundations
        </span>
        <span className="text-xs text-cream/20">/</span>
        <h2 className="font-sans text-[22px] font-semibold tracking-tight text-cream">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function AnimationTable({ category }: { category: IconAnimationCategory }) {
  const rows = ICON_ANIMATIONS.filter((row) => row.category === category);
  if (rows.length === 0) return null;

  return (
    <div className="mb-10 overflow-x-auto">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-cream/50">{category}</p>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-cream/10 text-cream/45">
            <th className="pb-2 pr-4 font-mono text-[10px] font-normal uppercase tracking-widest">Icon</th>
            <th className="pb-2 pr-4 font-mono text-[10px] font-normal uppercase tracking-widest">Targets</th>
            <th className="pb-2 pr-4 font-mono text-[10px] font-normal uppercase tracking-widest">Motion</th>
            <th className="pb-2 pr-4 font-mono text-[10px] font-normal uppercase tracking-widest">Duration</th>
            <th className="pb-2 pr-4 font-mono text-[10px] font-normal uppercase tracking-widest">Easing</th>
            <th className="pb-2 font-mono text-[10px] font-normal uppercase tracking-widest">Loop</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-cream/5">
              <td className="py-3 pr-4 font-medium text-cream">{row.title}</td>
              <td className="py-3 pr-4 font-mono text-[11px] text-[#9fb5aa]">{row.targets}</td>
              <td className="py-3 pr-4 text-cream/70">{row.motion}</td>
              <td className="py-3 pr-4 font-mono text-[11px] text-cream/55">{row.duration}</td>
              <td className="py-3 pr-4 font-mono text-[11px] text-cream/55">{row.easing}</td>
              <td className="py-3 font-mono text-[11px] text-cream/55">{row.loop}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DesignSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  useIconAnimations(containerRef);

  return (
    <div
      ref={containerRef}
      className="brief-dark min-h-screen px-6 py-20 text-cream selection:bg-clay/30 selection:text-cream sm:px-10 lg:px-24"
    >
      <div className="noise-overlay-dark" aria-hidden />

      <header className="relative mb-24 max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-clay">Eyes Closed · v2.0</span>
        <h1 className="mt-4 font-serif text-5xl font-light italic leading-[1.08] text-cream md:text-6xl">
          Design foundations
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/65">
          Tokens from <code className="rounded bg-cream/5 px-1.5 py-0.5 font-mono text-sm text-cream/80">@theme</code>,
          motion patterns, and the approved GSAP teaching-icon set. Dark immersive reference; public pages use cream or brief-dark bands.
          Dual light/dark gallery also at{' '}
          <a href="/icons" className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4 hover:text-cream">
            /icons
          </a>
          .
        </p>
      </header>

      <Section title="Color">
        {Object.entries(colors).map(([group, swatches]) => (
          <div key={group} className="mb-10">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-cream/50">{group}</p>
            <div className="flex flex-wrap gap-2.5">
              {swatches.map((s) => (
                <div
                  key={s.token}
                  className="w-[120px] overflow-hidden rounded-xl border border-cream/10 bg-[#1a2332]"
                >
                  <div
                    className="flex h-[72px] items-end p-2"
                    style={{ backgroundColor: s.hex }}
                  >
                    <span
                      className="font-mono text-[9px] tracking-wide"
                      style={{ color: s.textLight ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }}
                    >
                      {s.hex}
                    </span>
                  </div>
                  <div className="px-2.5 py-2">
                    <p className="text-[11px] font-semibold text-cream">{s.name}</p>
                    <p className="font-mono text-[10px] tracking-wide text-cream/45">{s.token}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Typography">
        <div className="mb-12">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.15em] text-cream/50">
            Serif: Cormorant Garamond (display, teaching)
          </p>
          <div className="divide-y divide-cream/5">
            {serifScale.map((t) => (
              <div key={t.label} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:gap-8">
                <div className="w-40 shrink-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-clay">{t.label}</p>
                  <p className="mt-0.5 font-mono text-[9px] text-cream/40">
                    {t.size} / {t.weight} / {t.lineHeight}
                  </p>
                </div>
                <span
                  className="font-serif italic text-cream"
                  style={{
                    fontSize: t.size,
                    fontWeight: t.weight,
                    letterSpacing: t.tracking,
                    lineHeight: t.lineHeight,
                  }}
                >
                  {t.sample}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.15em] text-cream/50">
            Sans: Plus Jakarta Sans (UI, body, nav)
          </p>
          <div className="divide-y divide-cream/5">
            {sansScale.map((t) => (
              <div key={t.label} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:gap-8">
                <div className="w-40 shrink-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#9fb5aa]">{t.label}</p>
                  <p className="mt-0.5 font-mono text-[9px] text-cream/40">
                    {t.size} / {t.weight}
                  </p>
                </div>
                <span
                  className="font-sans text-cream"
                  style={{
                    fontSize: t.size,
                    fontWeight: t.weight,
                    letterSpacing: t.tracking,
                    lineHeight: t.lineHeight,
                    textTransform: t.tracking === '0.15em' ? 'uppercase' : undefined,
                  }}
                >
                  Formless teaching copy and interface labels
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.15em] text-cream/50">
            Mono: system monospace (eyebrows, metadata)
          </p>
          <div className="divide-y divide-cream/5">
            {monoScale.map((t) => (
              <div key={t.label} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:gap-8">
                <div className="w-40 shrink-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cream/60">{t.label}</p>
                  <p className="mt-0.5 font-mono text-[9px] text-cream/40">tracking {t.tracking}</p>
                </div>
                <span
                  className="font-mono uppercase text-cream"
                  style={{ fontSize: t.size, fontWeight: t.weight, letterSpacing: t.tracking }}
                >
                  {t.sample}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Spacing">
        <div className="flex flex-col gap-3">
          {spacing.map((s) => (
            <div key={s.token} className="flex items-center gap-5">
              <div className="w-24 shrink-0">
                <p className="font-mono text-[10px] tracking-wide text-[#9fb5aa]">{s.token}</p>
                <p className="mt-0.5 font-mono text-[9px] text-cream/40">
                  {s.value} · {s.px}
                </p>
              </div>
              <div
                className="h-6 min-w-1 max-w-lg rounded-sm bg-[#9fb5aa]"
                style={{ width: s.value }}
              />
              <span className="font-mono text-[11px] text-cream/40">{s.px}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-cream/55">
          Section gutters: <code className="text-cream/70">px-6 md:px-16 lg:px-24</code> · vertical rhythm{' '}
          <code className="text-cream/70">py-16 md:py-24</code> to <code className="text-cream/70">py-32</code>
        </p>
      </Section>

      <Section title="Border radius">
        <div className="flex flex-wrap gap-5">
          {radii.map((r) => (
            <div key={r.token} className="flex flex-col items-center gap-2.5">
              <div
                className="h-20 w-20 bg-[#9fb5aa]/80"
                style={{ borderRadius: r.value }}
              />
              <div className="text-center">
                <p className="font-mono text-[10px] tracking-wide text-[#9fb5aa]">{r.token}</p>
                <p className="mt-0.5 font-mono text-[9px] text-cream/50">{r.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Motion">
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {motionPatterns.map((m) => (
            <div key={m.name} className="rounded-2xl border border-cream/10 bg-cream/[0.04] p-4">
              <p className="font-sans text-sm font-semibold text-cream">{m.name}</p>
              <p className="mt-1 font-mono text-[11px] text-[#9fb5aa]">{m.token}</p>
              <p className="mt-2 text-xs leading-relaxed text-cream/55">{m.use}</p>
            </div>
          ))}
        </div>
        <ul className="list-inside list-disc space-y-1 text-sm text-cream/60">
          <li>Animate transform and opacity in hot paths; honor <code className="text-cream/75">prefers-reduced-motion</code></li>
          <li>UI transitions: 300–500ms with cinematic ease; scroll teaching moments: 1–2s+</li>
          <li>No bounce, flash, or arcade-style particle overload</li>
        </ul>

        <div className="mt-12">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-cream/50">
            Icon loop samples
          </p>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-cream/65">
            Live GSAP loops from the approved teaching set. Same marks as Icon animations below; this strip shows how
            motion tokens feel on the actual SVGs.
          </p>
          <TeachingIconMotionStrip />
        </div>
      </Section>

      <Section title="Icon animations">
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-cream/65">
          Approved teaching marks with GSAP loops via <code className="text-cream/80">useIconAnimations</code>. Each
          mark uses class-targeted tweens; loops are slow, organic, and respect reduced motion. Full set below; dual
          light/dark gallery at{' '}
          <a href="/icons" className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4 hover:text-cream">
            /icons
          </a>
          .
        </p>

        <TeachingIconGrid mode="dark" showMotionNotes />

        <div className="mt-14">
          {ICON_ANIMATION_CATEGORIES.map((category) => (
            <AnimationTable key={category} category={category} />
          ))}
        </div>
      </Section>
    </div>
  );
}
