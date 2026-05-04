import {
  COLORS_EXPLORE_ABOUT,
  COLORS_EXPLORE_SCIENCE,
  COLORS_EXPLORE_WORK,
} from "@/data/colorsExploreContent";

const heroImage = COLORS_EXPLORE_WORK.accordion[0]?.image ?? "";

export function SupportingPagesImmersivePreview() {
  return (
    <div className="colors-explore-t3 min-h-0 overflow-hidden rounded-xl text-[color:var(--ex-fg)] [background:var(--ex-bg)]">
      {/* Full-bleed hero: imagery + overlay copy */}
      <div className="relative -mx-5 -mt-5 min-h-[240px] md:-mx-6 md:-mt-6 md:min-h-[280px]">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="ex-accordion-scrim absolute inset-0" />
        <div className="ex-immersive-hero-mesh absolute inset-0" aria-hidden />
        <div className="relative flex h-full min-h-[240px] flex-col justify-end gap-3 p-6 md:min-h-[280px] md:p-8">
          <p className="max-w-lg font-mono text-[10px] uppercase tracking-[0.35em] text-[color:var(--ex-fg-soft)]">
            {COLORS_EXPLORE_WORK.eyebrow} · {COLORS_EXPLORE_ABOUT.eyebrow} ·{" "}
            {COLORS_EXPLORE_SCIENCE.eyebrow}
          </p>
          <h2 className="max-w-xl font-serif text-3xl italic leading-[1.08] text-[color:var(--ex-fg)] md:text-4xl">
            {COLORS_EXPLORE_WORK.title}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-[color:var(--ex-fg-muted)]">
            {COLORS_EXPLORE_WORK.lead}
          </p>
        </div>
      </div>

      {/* Asymmetric split: rail + layered stack */}
      <div className="grid gap-8 px-5 py-10 md:grid-cols-[minmax(0,0.28fr)_1fr] md:gap-12 md:px-6 md:py-12">
        <div className="flex flex-col justify-between gap-8 border-[color:var(--ex-border)] md:border-r md:pr-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--ex-fg-soft)]">
              Pages
            </p>
            <ul className="mt-6 space-y-4 font-serif text-2xl italic text-[color:var(--ex-fg)] md:text-3xl">
              <li className="text-[color:var(--ex-clay)]">Work</li>
              <li>About</li>
              <li>Science</li>
            </ul>
          </div>
          <p className="max-w-[14rem] text-xs leading-relaxed text-[color:var(--ex-fg-muted)]">
            {COLORS_EXPLORE_ABOUT.paragraphs[0]}
          </p>
        </div>

        <div className="space-y-6">
          <div className="ex-immersive-card relative overflow-hidden rounded-2xl border p-6 md:p-8">
            <div
              className="ex-immersive-stack-glow pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full blur-3xl"
              aria-hidden
            />
            <span className="relative font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--ex-fg-soft)]">
              {COLORS_EXPLORE_ABOUT.futureEyebrow}
            </span>
            <h3 className="relative mt-3 font-serif text-2xl italic text-[color:var(--ex-fg)] md:text-3xl">
              {COLORS_EXPLORE_ABOUT.futureTitle}
            </h3>
            <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
              {COLORS_EXPLORE_ABOUT.futureItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-[color:var(--ex-border)] bg-[color:var(--ex-surface)] p-4"
                >
                  <p className="text-sm font-semibold text-[color:var(--ex-fg)]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[color:var(--ex-fg-muted)]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative pl-4 md:pl-8">
            <div
              className="absolute bottom-0 left-0 top-0 w-px bg-[color:var(--ex-border-strong)]"
              aria-hidden
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--ex-fg-soft)]">
              {COLORS_EXPLORE_SCIENCE.eyebrow}
            </p>
            <p className="mt-3 font-serif text-xl italic leading-snug text-[color:var(--ex-fg)] md:text-2xl">
              {COLORS_EXPLORE_SCIENCE.title}
            </p>
            <p className="mt-3 max-w-xl text-sm text-[color:var(--ex-fg-muted)]">
              {COLORS_EXPLORE_SCIENCE.lead}
            </p>
          </div>
        </div>
      </div>

      {/* Overlapping pillar strip */}
      <div className="border-y border-[color:var(--ex-border)] bg-[color:var(--ex-bg-subtle)] px-5 py-8 md:px-6">
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--ex-fg-soft)]">
          Pillars
        </p>
        <div className="grid gap-4 md:grid-cols-3 md:gap-0">
          {COLORS_EXPLORE_SCIENCE.pillars.map((pillar, i) => (
            <article
              key={pillar.label}
              className={`ex-immersive-card relative rounded-2xl border p-5 md:-ml-3 md:first:ml-0 md:px-6 ${i === 0 ? "md:z-30" : ""} ${i === 1 ? "md:z-20" : ""} ${i === 2 ? "md:z-10" : ""}`}
            >
              <span className="ex-pillar-label mb-3 block font-mono text-[9px] font-semibold uppercase tracking-[0.22em]">
                {pillar.label}
              </span>
              <p className="font-serif text-lg italic leading-snug text-[color:var(--ex-fg)]">
                {pillar.hook}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-[color:var(--ex-fg-muted)]">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* Full-bleed closing band */}
      <div className="ex-immersive-outro relative -mx-5 px-5 py-10 md:-mx-6 md:px-8 md:py-12">
        <div
          className="ex-immersive-outro-glow pointer-events-none absolute inset-0"
          aria-hidden
        />
        <p className="relative max-w-3xl font-serif text-2xl italic leading-snug text-[color:var(--ex-fg)] md:text-3xl">
          {COLORS_EXPLORE_SCIENCE.bandQuote}
        </p>
        <p className="relative mt-4 max-w-xl font-mono text-[10px] uppercase tracking-[0.26em] text-[color:var(--ex-fg-soft)]">
          {COLORS_EXPLORE_SCIENCE.bandEyebrow}
        </p>
      </div>
    </div>
  );
}
