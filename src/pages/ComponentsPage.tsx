import { useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

import {
  CALLOUT_VARIANTS,
  Callout,
  calloutVariantMeta,
  type CalloutSurface,
  type CalloutVariant,
} from '@/components/ui/Callout';
import {
  CALLOUT_TEACHING_ICON_IDS,
  TeachingIconMark,
  getTeachingIcon,
} from '@/components/iconography/TeachingIconMark';
import { useIconAnimations } from '@/hooks/useIconAnimations';

const SAMPLE = 'Arriving September 1, 2026';
const DEFAULT_ICON = 'formless';

function SurfacePanel({
  surface,
  title,
  icon,
}: {
  surface: CalloutSurface;
  title: string;
  icon: string;
}) {
  const isDark = surface === 'dark';

  return (
    <div
      className={
        isDark
          ? 'rounded-2xl border border-cream/10 bg-[#0c100e] p-6 md:p-8'
          : 'rounded-2xl border border-charcoal/10 bg-cream p-6 md:p-8'
      }
    >
      <p
        className={
          isDark
            ? 'mb-6 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/35'
            : 'mb-6 font-mono text-[10px] uppercase tracking-[0.22em] text-charcoal/40'
        }
      >
        {title}
      </p>
      <div className="flex flex-col gap-8">
        {CALLOUT_VARIANTS.map((variant) => (
          <VariantRow
            key={`${surface}-${variant}`}
            variant={variant}
            surface={surface}
            icon={variant === 'chrome-pill' ? undefined : icon}
          />
        ))}
      </div>
    </div>
  );
}

function VariantRow({
  variant,
  surface,
  icon,
}: {
  variant: CalloutVariant;
  surface: CalloutSurface;
  icon?: string;
}) {
  const meta = calloutVariantMeta(variant);
  const isDark = surface === 'dark';

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:items-center md:gap-8">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={
              isDark
                ? 'font-sans text-sm font-semibold text-cream'
                : 'font-sans text-sm font-semibold text-charcoal'
            }
          >
            {meta.label}
          </h3>
          {meta.recommended ? (
            <span className="rounded-full border border-moss/35 bg-moss/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#9fb5aa]">
              Recommended
            </span>
          ) : null}
          {meta.antiPattern ? (
            <span className="rounded-full border border-clay/40 bg-clay/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-clay">
              Anti-pattern
            </span>
          ) : null}
        </div>
        <p
          className={
            isDark
              ? 'mt-2 text-xs leading-relaxed text-cream/45'
              : 'mt-2 text-xs leading-relaxed text-charcoal/50'
          }
        >
          {meta.intent}
        </p>
        <p
          className={
            isDark
              ? 'mt-2 font-mono text-[10px] text-cream/25'
              : 'mt-2 font-mono text-[10px] text-charcoal/30'
          }
        >
          variant=&quot;{variant}&quot;
          {icon ? ` · icon="${icon}"` : ''}
        </p>
      </div>
      <div
        className={
          isDark
            ? 'flex min-h-16 items-center rounded-xl border border-cream/8 bg-cream/[0.02] px-5 py-4'
            : 'flex min-h-16 items-center rounded-xl border border-charcoal/8 bg-white/70 px-5 py-4'
        }
      >
        <Callout
          variant={variant}
          surface={surface}
          icon={icon}
          pulse={variant === 'chrome-pill'}
        >
          {SAMPLE}
        </Callout>
      </div>
    </div>
  );
}

function IconMarkGrid() {
  return (
    <section className="mb-16">
      <div className="mb-8 max-w-3xl">
        <h2 className="font-serif text-3xl italic text-cream">Teaching marks as callout signals</h2>
        <p className="mt-4 text-base leading-relaxed text-cream/55">
          Instead of a generic bullet, pull from the approved marks on{' '}
          <a
            href="/icons"
            className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4 hover:text-cream"
          >
            /icons
          </a>
          . Same artwork, scaled into meta UI, so release dates and quiet notices still
          carry Formless teaching language.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CALLOUT_TEACHING_ICON_IDS.map((id) => {
          const spec = getTeachingIcon(id);
          if (!spec) return null;
          const isDefault = id === DEFAULT_ICON;
          return (
            <article
              key={id}
              className={`rounded-2xl border p-4 ${
                isDefault
                  ? 'border-moss/35 bg-moss/10'
                  : 'border-cream/10 bg-cream/[0.03]'
              }`}
            >
              <div className="mb-4 flex min-h-14 items-center justify-center rounded-xl border border-cream/8 bg-[#0c100e]">
                <TeachingIconMark id={id} theme="dark" size={40} animate />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-sans text-xs font-semibold uppercase tracking-wide text-cream">
                  {spec.title}
                </h3>
                {isDefault ? (
                  <span className="rounded-full border border-moss/35 bg-moss/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#9fb5aa]">
                    On /book
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-cream/45">{spec.desc}</p>
              <div className="mt-4 border-t border-cream/8 pt-4">
                <Callout variant="editorial" surface="dark" icon={id}>
                  {SAMPLE}
                </Callout>
              </div>
              <p className="mt-3 font-mono text-[10px] text-cream/30">icon=&quot;{id}&quot;</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function ComponentsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useIconAnimations(pageRef, { ignoreReducedMotion: true });

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#080a09] text-cream selection:bg-clay/35 selection:text-cream"
    >
      <div className="noise-overlay-dark pointer-events-none" aria-hidden />

      <header className="border-b border-cream/10 bg-[#080a09]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 md:flex-row md:items-end md:justify-between md:px-8 md:py-10">
          <div>
            <a
              href="/design-system"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2 text-sm font-medium text-cream/60 transition hover:border-moss/40 hover:text-[#9fb5aa]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Design system
            </a>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-moss">
              Component library
            </p>
            <h1 className="max-w-xl font-serif text-4xl font-light italic leading-tight md:text-5xl">
              Components
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream/55">
              Visual options for site patterns that must stay distinct from primary
              navigation. Callouts use teaching marks from the icon system so small
              status moments still feel branded.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/icons"
              className="inline-flex items-center rounded-full border border-cream/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/65 transition hover:border-clay/40 hover:text-cream"
            >
              Icon set
            </a>
            <a
              href="/book"
              className="inline-flex items-center rounded-full border border-cream/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/65 transition hover:border-clay/40 hover:text-cream"
            >
              Live on /book
            </a>
            <a
              href="/hub"
              className="inline-flex items-center rounded-full border border-cream/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/65 transition hover:border-clay/40 hover:text-cream"
            >
              Site hub
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <section className="mb-16 max-w-3xl">
          <h2 className="font-serif text-3xl italic text-cream">Status callouts</h2>
          <p className="mt-4 text-base leading-relaxed text-cream/55">
            Use for release dates, quiet notices, and other non-interactive meta.
            Do not borrow the nav capsule unless the element is actually a control.
            Prefer a teaching icon over a bullet.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-cream/45">
            <li>
              <span className="text-cream/70">Principle:</span> editorial signal, branded mark.
            </li>
            <li>
              <span className="text-cream/70">Marks:</span> scaled from{' '}
              <code className="rounded bg-cream/10 px-1.5 py-0.5 font-mono text-[11px] text-[#9fb5aa]">
                TEACHING_ICONS
              </code>
              .
            </li>
            <li>
              <span className="text-cream/70">Default on /book:</span>{' '}
              <code className="rounded bg-cream/10 px-1.5 py-0.5 font-mono text-[11px] text-[#9fb5aa]">
                variant=&quot;editorial&quot; icon=&quot;formless&quot;
              </code>
            </li>
          </ul>
        </section>

        <IconMarkGrid />

        <section className="mb-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/35">
              Primary nav (reference)
            </p>
            <div className="mt-4 inline-flex items-stretch gap-1 rounded-full border border-white/15 bg-black/25 p-1 backdrop-blur-md">
              {['The Practice', 'Formless', 'About'].map((label) => (
                <span
                  key={label}
                  className="rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-white/55"
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream/45">
              Interactive chrome. Soft capsule, bordered track, uppercase labels.
            </p>
          </article>
          <article className="rounded-2xl border border-clay/25 bg-clay/5 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
              What went wrong on /book
            </p>
            <div className="mt-4">
              <Callout variant="chrome-pill" surface="dark" pulse>
                {SAMPLE}
              </Callout>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream/45">
              Same pill recipe as nav, plus a generic bullet. Status looked clickable and
              carried no teaching language.
            </p>
          </article>
        </section>

        <section className="grid gap-8">
          <SurfacePanel surface="dark" title="On dark surfaces" icon={DEFAULT_ICON} />
          <SurfacePanel surface="light" title="On light surfaces" icon={DEFAULT_ICON} />
        </section>

        <section className="mt-16 max-w-3xl border-t border-cream/10 pt-10">
          <h2 className="font-serif text-2xl italic text-cream">Usage</h2>
          <pre className="mt-5 overflow-x-auto rounded-xl border border-cream/10 bg-black/30 p-5 font-mono text-[12px] leading-relaxed text-[#9fb5aa]">
{`import { Callout } from '@/components/ui/Callout';

<Callout variant="editorial" surface="dark" icon="formless">
  Arriving September 1, 2026
</Callout>`}
          </pre>
          <p className="mt-6 text-sm leading-relaxed text-cream/45">
            Source:{' '}
            <code className="rounded bg-cream/10 px-1.5 py-0.5 font-mono text-[11px] text-cream/70">
              src/components/ui/Callout.tsx
            </code>
            ,{' '}
            <code className="rounded bg-cream/10 px-1.5 py-0.5 font-mono text-[11px] text-cream/70">
              TeachingIconMark.tsx
            </code>
            . Full marks at{' '}
            <a
              href="/icons"
              className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4 hover:text-cream"
            >
              /icons
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
