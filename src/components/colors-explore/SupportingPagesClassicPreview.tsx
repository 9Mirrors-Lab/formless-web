import {
  COLORS_EXPLORE_ABOUT,
  COLORS_EXPLORE_SCIENCE,
  COLORS_EXPLORE_WORK,
} from "@/data/colorsExploreContent";

export type ClassicPreviewVariant = "t1" | "t2" | "brief";

function MiniAccordion({ scrim }: { scrim: "brief" | "explore" }) {
  const scrimClass =
    scrim === "explore"
      ? "ex-accordion-scrim"
      : "bg-gradient-to-t from-charcoal/92 via-charcoal/45 to-charcoal/15";

  return (
    <div className="flex h-[200px] gap-1.5 md:h-[220px] md:gap-2">
      {COLORS_EXPLORE_WORK.accordion.map((item, i) => {
        const flex = i === 0 ? "flex-[2.2]" : "flex-1";
        return (
          <div
            key={item.id}
            className={`relative min-w-0 overflow-hidden rounded-xl ${flex}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
              style={{ backgroundImage: `url("${item.image}")` }}
            />
            <div className={`absolute inset-0 ${scrimClass}`} />
            <div className="relative z-10 flex h-full flex-col justify-end p-3 md:p-4">
              <p className="font-sans text-xs font-bold text-cream md:text-sm">
                {item.title}
              </p>
              {i === 0 ? (
                <p className="mt-2 font-serif text-sm italic leading-snug text-cream/90">
                  {item.insight}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TokenShell({
  variant,
  children,
}: {
  variant: "t1" | "t2";
  children: React.ReactNode;
}) {
  const themeClass = variant === "t1" ? "colors-explore-t1" : "colors-explore-t2";
  const heroClass = variant === "t2" ? "colors-explore-t2-hero" : "";

  return (
    <div className={themeClass}>
      {variant === "t2" ? (
        <div className={`relative ${heroClass} px-5 py-5 md:px-6`}>
          <div className="ex-hero-orb-cool ex-ambient-slow pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full blur-3xl" />
          <div className="ex-hero-orb-warm pointer-events-none absolute -bottom-24 left-1/4 h-40 w-40 rounded-full opacity-40 blur-3xl ex-ambient-slow" />
          <p className="relative font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--ex-fg-soft)]">
            Live preview
          </p>
        </div>
      ) : null}

      <div className="relative space-y-0 px-5 pb-6 pt-5 md:px-6 md:pb-8 md:pt-6">
        {children}
      </div>
    </div>
  );
}

function WorkBlock({
  variant,
  cardClass = "",
}: {
  variant: ClassicPreviewVariant;
  cardClass?: string;
}) {
  if (variant === "brief") {
    return (
      <section className="border-b border-charcoal/8 pb-8">
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/40">
          {COLORS_EXPLORE_WORK.eyebrow}
        </span>
        <h2 className="mb-3 max-w-xl font-serif text-2xl italic leading-tight text-charcoal md:text-3xl">
          {COLORS_EXPLORE_WORK.title}
        </h2>
        <p className="mb-6 max-w-lg text-sm leading-relaxed text-charcoal/60">
          {COLORS_EXPLORE_WORK.lead}
        </p>
        <MiniAccordion scrim="brief" />
        <div className="mt-6 grid gap-4 rounded-2xl bg-charcoal px-4 py-5 text-cream md:grid-cols-2 md:items-center">
          <div>
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.28em] text-cream/30">
              {COLORS_EXPLORE_WORK.darkEyebrow}
            </span>
            <p className="font-serif text-xl italic leading-snug">
              {COLORS_EXPLORE_WORK.darkTitle}
            </p>
            <p className="mt-2 font-serif text-2xl italic text-clay">
              {COLORS_EXPLORE_WORK.darkAccent}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-cream/50">
            {COLORS_EXPLORE_WORK.darkBody}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`border-b border-[color:var(--ex-border)] pb-8 ${variant === "t2" ? "pt-2" : ""}`}
    >
      <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--ex-fg-soft)]">
        {COLORS_EXPLORE_WORK.eyebrow}
      </span>
      <h2 className="mb-3 max-w-xl font-serif text-2xl italic leading-tight text-[color:var(--ex-fg)] md:text-3xl">
        {COLORS_EXPLORE_WORK.title}
      </h2>
      <p className="mb-6 max-w-lg text-sm leading-relaxed text-[color:var(--ex-fg-muted)]">
        {COLORS_EXPLORE_WORK.lead}
      </p>
      <MiniAccordion scrim="explore" />
      <div
        className={`ex-band-surface mt-6 grid gap-4 rounded-2xl border px-4 py-5 md:grid-cols-2 md:items-center ${cardClass}`}
      >
        <div>
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--ex-fg-soft)]">
            {COLORS_EXPLORE_WORK.darkEyebrow}
          </span>
          <p className="font-serif text-xl italic leading-snug text-[color:var(--ex-fg)]">
            {COLORS_EXPLORE_WORK.darkTitle}
          </p>
          <p className="ex-accent-clay mt-2 font-serif text-2xl italic">
            {COLORS_EXPLORE_WORK.darkAccent}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-[color:var(--ex-fg-muted)]">
          {COLORS_EXPLORE_WORK.darkBody}
        </p>
      </div>
    </section>
  );
}

function AboutBlock({
  variant,
  cardClass = "",
}: {
  variant: ClassicPreviewVariant;
  cardClass?: string;
}) {
  if (variant === "brief") {
    return (
      <section className="border-b border-charcoal/8 py-8">
        <div className="grid gap-5 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[4/5]">
            <img
              src={COLORS_EXPLORE_ABOUT.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
          </div>
          <div>
            <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/40">
              {COLORS_EXPLORE_ABOUT.eyebrow}
            </span>
            <h2 className="mb-4 font-serif text-2xl italic leading-tight text-charcoal md:text-3xl">
              {COLORS_EXPLORE_ABOUT.title}
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-charcoal/70">
              {COLORS_EXPLORE_ABOUT.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/40">
            {COLORS_EXPLORE_ABOUT.futureEyebrow}
          </span>
          <h3 className="mb-5 font-serif text-xl italic text-charcoal/90 md:text-2xl">
            {COLORS_EXPLORE_ABOUT.futureTitle}
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {COLORS_EXPLORE_ABOUT.futureItems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-charcoal/8 bg-white/40 p-4"
              >
                <h4 className="mb-2 text-sm font-bold text-charcoal">
                  {item.title}
                </h4>
                <p className="text-xs leading-relaxed text-charcoal/55">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-[color:var(--ex-border)] py-8">
      <div className="grid gap-5 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[4/5]">
          <img
            src={COLORS_EXPLORE_ABOUT.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="ex-image-scrim absolute inset-0" />
        </div>
        <div>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--ex-fg-soft)]">
            {COLORS_EXPLORE_ABOUT.eyebrow}
          </span>
          <h2 className="mb-4 font-serif text-2xl italic leading-tight text-[color:var(--ex-fg)] md:text-3xl">
            {COLORS_EXPLORE_ABOUT.title}
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[color:var(--ex-fg-muted)]">
            {COLORS_EXPLORE_ABOUT.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--ex-fg-soft)]">
          {COLORS_EXPLORE_ABOUT.futureEyebrow}
        </span>
        <h3 className="mb-5 font-serif text-xl italic text-[color:var(--ex-fg)] md:text-2xl">
          {COLORS_EXPLORE_ABOUT.futureTitle}
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {COLORS_EXPLORE_ABOUT.futureItems.map((item) => (
            <article
              key={item.title}
              className={`rounded-2xl border p-4 ${cardClass}`}
            >
              <h4 className="mb-2 text-sm font-bold text-[color:var(--ex-fg)]">
                {item.title}
              </h4>
              <p className="text-xs leading-relaxed text-[color:var(--ex-fg-muted)]">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScienceBlock({
  variant,
  cardClass = "",
}: {
  variant: ClassicPreviewVariant;
  cardClass?: string;
}) {
  if (variant === "brief") {
    return (
      <section className="pt-8">
        <div className="relative mb-6 overflow-hidden rounded-xl pb-2">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[8%] top-[0%] h-40 w-40 rounded-full bg-moss/10 blur-3xl" />
            <div className="absolute bottom-[0%] right-[6%] h-36 w-36 rounded-full bg-clay/8 blur-3xl" />
          </div>
          <span className="relative mb-2 block font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/40">
            {COLORS_EXPLORE_SCIENCE.eyebrow}
          </span>
          <h2 className="relative mb-3 max-w-xl font-serif text-2xl italic leading-tight text-charcoal md:text-3xl">
            {COLORS_EXPLORE_SCIENCE.title}
          </h2>
          <p className="relative max-w-lg text-sm leading-relaxed text-charcoal/60">
            {COLORS_EXPLORE_SCIENCE.lead}
          </p>
        </div>
        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {COLORS_EXPLORE_SCIENCE.pillars.map((pillar) => (
            <article
              key={pillar.label}
              className="rounded-2xl border border-charcoal/8 bg-white/40 p-4"
            >
              <span className="mb-3 block font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-clay">
                {pillar.label}
              </span>
              <p className="mb-3 font-serif text-base italic leading-snug text-charcoal/80">
                {pillar.hook}
              </p>
              <p className="text-xs leading-relaxed text-charcoal/60">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
        <div className="rounded-t-3xl bg-charcoal px-4 py-8 text-center text-cream">
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.28em] text-cream/30">
            {COLORS_EXPLORE_SCIENCE.bandEyebrow}
          </span>
          <p className="mx-auto max-w-lg font-serif text-lg italic leading-snug text-cream/85 md:text-xl">
            {COLORS_EXPLORE_SCIENCE.bandQuote}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-8">
      <div className="relative mb-6 overflow-hidden rounded-xl pb-2">
        <div className="pointer-events-none absolute inset-0">
          <div className="ex-blob-moss absolute left-[8%] top-[0%] h-40 w-40 rounded-full blur-3xl" />
          <div className="ex-blob-clay absolute bottom-[0%] right-[6%] h-36 w-36 rounded-full blur-3xl" />
        </div>
        <span className="relative mb-2 block font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--ex-fg-soft)]">
          {COLORS_EXPLORE_SCIENCE.eyebrow}
        </span>
        <h2 className="relative mb-3 max-w-xl font-serif text-2xl italic leading-tight text-[color:var(--ex-fg)] md:text-3xl">
          {COLORS_EXPLORE_SCIENCE.title}
        </h2>
        <p className="relative max-w-lg text-sm leading-relaxed text-[color:var(--ex-fg-muted)]">
          {COLORS_EXPLORE_SCIENCE.lead}
        </p>
      </div>
      <div className="mb-8 grid gap-3 md:grid-cols-3">
        {COLORS_EXPLORE_SCIENCE.pillars.map((pillar) => (
          <article
            key={pillar.label}
            className={`rounded-2xl border p-4 ${cardClass}`}
          >
            <span className="ex-accent-clay mb-3 block font-mono text-[9px] font-semibold uppercase tracking-[0.22em]">
              {pillar.label}
            </span>
            <p className="mb-3 font-serif text-base italic leading-snug text-[color:var(--ex-fg)]">
              {pillar.hook}
            </p>
            <p className="text-xs leading-relaxed text-[color:var(--ex-fg-muted)]">
              {pillar.body}
            </p>
          </article>
        ))}
      </div>
      <div className="ex-band-surface rounded-t-3xl border border-t px-4 py-8 text-center">
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--ex-fg-soft)]">
          {COLORS_EXPLORE_SCIENCE.bandEyebrow}
        </span>
        <p className="mx-auto max-w-lg font-serif text-lg italic leading-snug text-[color:var(--ex-fg-muted)] md:text-xl">
          {COLORS_EXPLORE_SCIENCE.bandQuote}
        </p>
      </div>
    </section>
  );
}

export function SupportingPagesClassicPreview({
  variant,
}: {
  variant: ClassicPreviewVariant;
}) {
  const cardClass =
    variant === "t2" ? "ex-card-surface border" : "ex-card-surface border";

  if (variant === "brief") {
    return (
      <div className="brief-dark min-h-0 overflow-hidden rounded-xl px-5 py-6 text-cream md:px-6 md:py-8">
        <WorkBlock variant="brief" />
        <AboutBlock variant="brief" />
        <ScienceBlock variant="brief" />
      </div>
    );
  }

  const inner = (
    <>
      {variant === "t2" ? (
        <div className="ex-hero-orb-cool pointer-events-none absolute inset-x-0 top-24 mx-auto h-32 max-w-md rounded-full opacity-30 blur-3xl ex-ambient-slow" />
      ) : null}
      <div className="relative">
        <WorkBlock variant={variant} cardClass={cardClass} />
        <AboutBlock variant={variant} cardClass={cardClass} />
        <ScienceBlock variant={variant} cardClass={cardClass} />
      </div>
    </>
  );

  if (variant === "t1") {
    return (
      <div className="relative overflow-hidden rounded-xl">
        <TokenShell variant="t1">{inner}</TokenShell>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <TokenShell variant="t2">{inner}</TokenShell>
    </div>
  );
}
