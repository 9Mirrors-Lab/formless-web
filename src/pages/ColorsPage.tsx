import { ArrowLeft, LayoutGrid, Sparkles } from "lucide-react";

import { SupportingPagesClassicPreview } from "@/components/colors-explore/SupportingPagesClassicPreview";
import { SupportingPagesImmersivePreview } from "@/components/colors-explore/SupportingPagesImmersivePreview";

const THEMES = [
  {
    id: "t1",
    group: "Same layout",
    groupDetail: "Structure matches Work, About, and Science today.",
    name: "Basalt translation",
    intent:
      "Same grid, spacing, and typography rhythm as the light supporting pages; only surfaces, type, and borders move into a cool dark key.",
    preview: "classic-t1" as const,
  },
  {
    id: "t2",
    group: "Same layout",
    groupDetail: "Structure matches Work, About, and Science today.",
    name: "Nocturne elevated",
    intent:
      "Keeps the familiar page architecture while adding controlled light: radial washes, lifted cards, and hover depth so the UI feels more cinematic without new composition rules.",
    preview: "classic-t2" as const,
  },
  {
    id: "t3",
    group: "New layout",
    groupDetail: "Experimental composition for the same narrative content.",
    name: "Meridian immersive",
    intent:
      "Full-bleed photography, a vertical page rail, overlapping pillar panels, and a gradient outro band; tests how far the story can travel when layout itself becomes atmospheric.",
    preview: "immersive" as const,
  },
  {
    id: "t4",
    group: "Brief reference",
    groupDetail: "Aligns with the live brief environment.",
    name: "Brief spectrum",
    intent:
      "Uses the same brief-dark shell, moss/clay accents, and translucent glass cards as the Brief page so supporting-page content can be judged inside that established dark system.",
    preview: "classic-brief" as const,
  },
] as const;

function ThemePreview({
  preview,
}: {
  preview: (typeof THEMES)[number]["preview"];
}) {
  if (preview === "immersive") return <SupportingPagesImmersivePreview />;
  if (preview === "classic-brief")
    return <SupportingPagesClassicPreview variant="brief" />;
  if (preview === "classic-t1")
    return <SupportingPagesClassicPreview variant="t1" />;
  return <SupportingPagesClassicPreview variant="t2" />;
}

function ThemeChrome({
  group,
  groupDetail,
  name,
  intent,
}: {
  group: string;
  groupDetail: string;
  name: string;
  intent: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[color:var(--color-ce-divider)] bg-[color-mix(in_srgb,var(--color-ce-divider)_18%,transparent)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ce-chrome-muted)]">
          {group}
        </span>
        <span className="text-sm text-[color:var(--color-ce-chrome-muted)]">
          {groupDetail}
        </span>
      </div>
      <h2 className="font-serif text-3xl italic text-cream md:text-4xl">{name}</h2>
      <p className="mt-4 text-base leading-relaxed text-[color:var(--color-ce-chrome-muted)]">
        {intent}
      </p>
    </div>
  );
}

export default function ColorsPage() {
  return (
    <div className="min-h-screen bg-ce-chrome text-cream selection:bg-clay/35 selection:text-cream">
      <div className="noise-overlay-dark pointer-events-none" aria-hidden />

      <header className="border-b border-[color:var(--color-ce-divider)] bg-[color:var(--color-ce-chrome)]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 md:flex-row md:items-end md:justify-between md:px-8 md:py-10">
          <div>
            <a
              href="/brief"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ce-divider)] px-4 py-2 text-sm font-medium text-[color:var(--color-ce-chrome-muted)] transition hover:border-moss/40 hover:text-moss"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to brief
            </a>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-moss">
              Design exploration
            </p>
            <h1 className="max-w-xl font-serif text-4xl font-light italic leading-tight md:text-5xl">
              Dark directions for Work, About, and Science
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--color-ce-chrome-muted)]">
              Four isolated previews using shared tokens (see{" "}
              <code className="rounded bg-[color:var(--color-ce-divider)]/40 px-1.5 py-0.5 font-mono text-xs text-cream/90">
                .colors-explore-t*
              </code>{" "}
              and{" "}
              <code className="rounded bg-[color:var(--color-ce-divider)]/40 px-1.5 py-0.5 font-mono text-xs text-cream/90">
                brief-dark
              </code>
              ). Compare mood, depth, and layout without touching production routes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-[color:var(--color-ce-chrome-muted)]">
            <div className="flex items-center gap-2 rounded-lg border border-[color:var(--color-ce-divider)] px-3 py-2">
              <LayoutGrid className="h-4 w-4 text-moss" aria-hidden />
              <span className="text-xs">Themes 1, 2, 4: classic rhythm</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[color:var(--color-ce-divider)] px-3 py-2">
              <Sparkles className="h-4 w-4 text-clay" aria-hidden />
              <span className="text-xs">Theme 3: immersive layout</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-20 px-5 py-16 md:space-y-24 md:px-8 md:py-20">
        {THEMES.map((theme) => (
          <section
            key={theme.id}
            id={theme.id}
            className="scroll-mt-8 border-t border-[color:var(--color-ce-divider)] pt-16 md:pt-20"
          >
            <ThemeChrome
              group={theme.group}
              groupDetail={theme.groupDetail}
              name={theme.name}
              intent={theme.intent}
            />
            <div className="overflow-hidden rounded-2xl border border-[color:var(--color-ce-divider)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.75)]">
              <ThemePreview preview={theme.preview} />
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t border-[color:var(--color-ce-divider)] px-5 py-10 text-center text-sm text-[color:var(--color-ce-chrome-muted)] md:px-8">
        Tokens live in{" "}
        <code className="font-mono text-xs text-cream/80">src/index.css</code>{" "}
        under{" "}
        <code className="font-mono text-xs text-cream/80">@theme</code> and{" "}
        <code className="font-mono text-xs text-cream/80">@layer components</code>
        .
      </footer>
    </div>
  );
}
