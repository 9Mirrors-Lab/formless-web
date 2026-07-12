import { ArrowLeft, Type } from "lucide-react";
import { useEffect, useState } from "react";

import {
  FONT_CATEGORIES,
  FONT_FEELS_SECTION,
  PRODUCTION_BASELINE,
  SAMPLE_COPY,
  type FontCandidate,
  type FontRole,
} from "@/data/fontExploration";
import { isFontFamilyAvailable } from "@/lib/fontAvailability";

import "./FontsPage.css";

function useFontAvailable(family: string): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const ok = await isFontFamilyAvailable(family);
      if (!cancelled) setAvailable(ok);
    })();

    return () => {
      cancelled = true;
    };
  }, [family]);

  return available;
}

function FontBadge({
  label,
  tone = "muted",
}: {
  label: string;
  tone?: "current" | "loaded" | "missing" | "free" | "muted";
}) {
  const classes = {
    current: "border-moss/30 bg-moss/10 text-moss",
    loaded: "border-moss/30 bg-moss/10 text-moss",
    missing: "border-clay/35 bg-clay/12 text-clay",
    free: "border-charcoal/15 bg-charcoal/[0.04] text-charcoal/60",
    muted: "border-charcoal/10 bg-charcoal/[0.03] text-charcoal/55",
  }[tone];

  return (
    <span
      className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${classes}`}
    >
      {label}
    </span>
  );
}

function MiniSitePreview({
  candidate,
  role,
  sansFamily = PRODUCTION_BASELINE.sans.family,
}: {
  candidate: FontCandidate;
  role: FontRole;
  sansFamily?: string;
}) {
  const isSansRole = role === "sans-ui";
  const displayFamily = candidate.family;
  const bodyFamily = isSansRole ? displayFamily : sansFamily;
  const headlineFamily = isSansRole ? PRODUCTION_BASELINE.serif.family : displayFamily;
  const longBodyFamily = role === "serif-organic" ? displayFamily : bodyFamily;

  return (
    <div className="overflow-hidden rounded-xl border border-charcoal/10">
      <div className="fonts-explore-mini-hero px-5 py-8 md:px-6 md:py-10">
        <p
          className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/55"
          style={{ fontFamily: 'ui-monospace, monospace' }}
        >
          {SAMPLE_COPY.eyebrow}
        </p>
        <h3
          className="text-[clamp(1.75rem,3vw,2.35rem)] font-light italic leading-[1.08] tracking-tight text-cream"
          style={{ fontFamily: headlineFamily }}
        >
          <span className="block">{SAMPLE_COPY.headlinePrimary}</span>
          <span className="block text-cream/88">{SAMPLE_COPY.headlineSecondary}</span>
        </h3>
        <p
          className="mt-4 max-w-md text-sm leading-relaxed text-cream/72 md:text-[0.95rem]"
          style={{ fontFamily: bodyFamily }}
        >
          {SAMPLE_COPY.lede}
        </p>
      </div>

      <div className="fonts-explore-mini-body px-5 py-6 md:px-6">
        <div
          className="mb-4 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.16em] text-charcoal/45"
          style={{ fontFamily: bodyFamily }}
        >
          {SAMPLE_COPY.nav.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <p
          className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-moss"
          style={{ fontFamily: 'ui-monospace, monospace' }}
        >
          {SAMPLE_COPY.sectionTitle}
        </p>
        <p
          className="max-w-prose text-sm leading-[1.75] text-charcoal/78 md:text-[0.95rem]"
          style={{ fontFamily: longBodyFamily }}
        >
          {SAMPLE_COPY.body}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span
            className="inline-flex rounded-full bg-moss px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream"
            style={{ fontFamily: bodyFamily }}
          >
            {SAMPLE_COPY.button}
          </span>
          <span
            className="text-xs text-charcoal/45"
            style={{ fontFamily: bodyFamily }}
          >
            Nav, buttons, and lede use the candidate when it is a sans role.
          </span>
        </div>
      </div>

      <div className="fonts-explore-mini-dark px-5 py-5 md:px-6">
        <p
          className="font-serif text-2xl italic leading-tight text-cream md:text-3xl"
          style={{ fontFamily: headlineFamily }}
        >
          What if nothing needed to change?
        </p>
        <p
          className="mt-3 max-w-prose text-sm leading-relaxed text-cream/58"
          style={{ fontFamily: longBodyFamily }}
        >
          Dark-band editorial moment: serif display with muted sans or organic body
          depending on the category you are evaluating.
        </p>
      </div>
    </div>
  );
}

function FontSampleCard({
  candidate,
  role,
  isCurrent = false,
  sansFamily,
  variant,
}: {
  candidate: FontCandidate;
  role: FontRole;
  isCurrent?: boolean;
  sansFamily?: string;
  variant?: "feels";
}) {
  const available = useFontAvailable(candidate.family);
  const resolvedRole = candidate.role ?? role;
  const isLoaded = available === true;

  const cardClass = [
    "fonts-explore-card rounded-2xl p-4 md:p-5",
    variant === "feels" ? "fonts-explore-card--feels" : "",
    isCurrent ? "fonts-explore-card--current" : "",
    !isLoaded && available !== null ? "fonts-explore-card--unavailable" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClass}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h3 className="font-serif text-2xl italic text-charcoal">{candidate.name}</h3>
        {isCurrent ? <FontBadge label="Current reference" tone="current" /> : null}
        {candidate.free ? <FontBadge label="Free" tone="free" /> : null}
        {available === null ? null : isLoaded ? (
          <FontBadge label="Loaded" tone="loaded" />
        ) : (
          <FontBadge label="Not loaded" tone="missing" />
        )}
      </div>

      <p className="mb-4 font-mono text-[11px] text-charcoal/45">
        font-family: &quot;{candidate.family}&quot;
      </p>

      {!isLoaded && available !== null ? (
        <p className="fonts-explore-unavailable-banner">
          This family is not in the browser yet. The preview below may render blank or
          with the wrong shapes. Add WOFF2 under{" "}
          <code className="text-charcoal/75">public/fonts/explore/</code> or load from a
          CDN in FontsPage.css.
        </p>
      ) : null}

      <MiniSitePreview
        candidate={candidate}
        role={resolvedRole}
        sansFamily={sansFamily}
      />
    </article>
  );
}

function FeelsSection() {
  const { feels, fonts, intent, role, title } = FONT_FEELS_SECTION;

  return (
    <section
      id="feels"
      className="fonts-explore-feels-section scroll-mt-8 border-t border-charcoal/10 pt-20 md:pt-24"
    >
      <div className="fonts-explore-feels mb-8">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-moss">
          Active direction
        </p>
        <h2 className="font-serif text-3xl italic text-charcoal md:text-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal/65">
          {intent}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {feels.map((feel) => (
            <span
              key={feel}
              className="rounded-full border border-clay/25 bg-clay/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-clay"
            >
              {feel}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {fonts.map((candidate) => (
          <FontSampleCard
            key={candidate.id}
            candidate={candidate}
            role={role}
            sansFamily={PRODUCTION_BASELINE.sans.family}
            variant="feels"
          />
        ))}
      </div>
    </section>
  );
}

function ProductionBaselineSection() {
  return (
    <section className="scroll-mt-8 border-t border-charcoal/10 pt-16 md:pt-20">
      <div className="mb-8 max-w-3xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-moss">
          Live site today
        </p>
        <h2 className="font-serif text-3xl italic text-charcoal md:text-4xl">
          Production pairing
        </h2>
        <p className="mt-4 text-base leading-relaxed text-charcoal/65">
          The public site currently ships{" "}
          <strong className="font-medium text-charcoal">
            {PRODUCTION_BASELINE.serif.name}
          </strong>{" "}
          for editorial serif and{" "}
          <strong className="font-medium text-charcoal">
            {PRODUCTION_BASELINE.sans.name}
          </strong>{" "}
          for UI and body. Use this block as the control when comparing candidates
          below.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FontSampleCard
          candidate={PRODUCTION_BASELINE.serif}
          role="serif-display"
          isCurrent
          sansFamily={PRODUCTION_BASELINE.sans.family}
        />
        <FontSampleCard
          candidate={PRODUCTION_BASELINE.sans}
          role="sans-ui"
          isCurrent
        />
      </div>
    </section>
  );
}

function CategorySection({
  category,
}: {
  category: (typeof FONT_CATEGORIES)[number];
}) {
  return (
    <section
      id={category.id}
      className="scroll-mt-8 border-t border-charcoal/10 pt-16 md:pt-20"
    >
      <div className="mb-8 max-w-3xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
          Instead of {category.replaces}
        </p>
        <h2 className="font-serif text-3xl italic text-charcoal md:text-4xl">
          {category.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-charcoal/65">{category.intent}</p>
      </div>

      <div className="mb-8">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/45">
          Current reference
        </p>
        <FontSampleCard
          candidate={category.current}
          role={category.role}
          isCurrent
          sansFamily={PRODUCTION_BASELINE.sans.family}
        />
      </div>

      <div>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/45">
          Try
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          {category.alternatives.map((candidate) => (
            <FontSampleCard
              key={candidate.id}
              candidate={candidate}
              role={category.role}
              sansFamily={PRODUCTION_BASELINE.sans.family}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FontsPage() {
  return (
    <div className="min-h-screen bg-cream text-charcoal selection:bg-clay/25">
      <div className="noise-overlay pointer-events-none" aria-hidden />

      <header className="border-b border-charcoal/10 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 md:flex-row md:items-end md:justify-between md:px-8 md:py-10">
          <div>
            <a
              href="/design-system"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal/65 transition hover:border-moss/35 hover:text-moss"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to design system
            </a>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-moss">
              Design exploration
            </p>
            <h1 className="max-w-2xl font-serif text-4xl font-light italic leading-tight md:text-5xl">
              Typography directions
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal/65">
              Every card stays visible. Green &quot;Loaded&quot; means the browser has that
              exact family; clay &quot;Not loaded&quot; means you need to add the font file or
              CDN import.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-charcoal/10 px-3 py-2 text-charcoal/55">
            <Type className="h-4 w-4 text-moss" aria-hidden />
            <span className="text-xs">Route: /fonts</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-20 px-5 py-16 md:space-y-24 md:px-8 md:py-20">
        <ProductionBaselineSection />
        <FeelsSection />

        {FONT_CATEGORIES.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </main>

      <footer className="border-t border-charcoal/10 px-5 py-10 text-center text-sm text-charcoal/55 md:px-8">
        To preview licensed fonts exactly, add WOFF2 files under{" "}
        <code className="rounded bg-charcoal/5 px-1.5 py-0.5 font-mono text-xs">
          public/fonts/explore/
        </code>{" "}
        and wire @font-face rules in{" "}
        <code className="rounded bg-charcoal/5 px-1.5 py-0.5 font-mono text-xs">
          FontsPage.css
        </code>
        .
      </footer>
    </div>
  );
}
