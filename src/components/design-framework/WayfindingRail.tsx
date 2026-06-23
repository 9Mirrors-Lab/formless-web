import type { Phase } from "@/data/designFramework";

type WayfindingRailProps = {
  phases: Phase[];
  activeSubstepHash: string | null;
  onNavigate?: () => void;
  /** `plain` drops sticky positioning (e.g. mobile sheet). */
  variant?: "sidebar" | "plain";
};

export function WayfindingRail({
  phases,
  activeSubstepHash,
  onNavigate,
  variant = "sidebar",
}: WayfindingRailProps) {
  return (
    <nav
      className={
        variant === "plain"
          ? "text-sm"
          : "sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto text-sm"
      }
      aria-label="Design framework steps"
    >
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-cream/65">
        Jump to
      </p>
      <ol className="mt-4 space-y-6">
        {phases.map((phase) => (
          <li key={phase.id}>
            <p className="font-medium text-cream/95">
              <span aria-hidden>{phase.emoji}</span>{" "}
              <span className="ml-1">{phase.title}</span>
            </p>
            <ol className="mt-2 space-y-1.5">
              {phase.substeps.map((sub) => {
                const active = sub.hash === activeSubstepHash;
                return (
                  <li key={sub.id}>
                    <a
                      href={`#${sub.hash}`}
                      className={`group flex min-h-11 items-start gap-2 rounded-md py-1 pl-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70 ${
                        active
                          ? "text-clay"
                          : "text-cream/60 hover:text-cream"
                      }`}
                      onClick={() => {
                        onNavigate?.();
                        requestAnimationFrame(() => {
                          const el = document.getElementById(sub.hash);
                          const h = el?.querySelector("h3");
                          if (h && "focus" in h) (h as HTMLElement).focus();
                        });
                      }}
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                          active ? "bg-clay" : "bg-white/25 group-hover:bg-white/45"
                        }`}
                        aria-hidden
                      />
                      <span className="leading-snug">{sub.label}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </nav>
  );
}
