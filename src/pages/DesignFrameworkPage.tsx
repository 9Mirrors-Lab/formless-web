import { List } from "lucide-react";
import { useEffect, useState } from "react";

import { PhaseBlock } from "@/components/design-framework/PhaseBlock";
import { WayfindingRail } from "@/components/design-framework/WayfindingRail";
import {
  ALL_SUBSTEP_HASHES,
  DESIGN_FRAMEWORK_PHASES,
} from "@/data/designFramework";
import { useActiveSubstepId } from "@/hooks/useActiveSubstepId";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function DesignFrameworkPage() {
  const reducedMotion = usePrefersReducedMotion();
  const activeSubstepHash = useActiveSubstepId(ALL_SUBSTEP_HASHES);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    const scrollToHash = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) return;
      requestAnimationFrame(() => {
        const el = document.getElementById(raw);
        if (!el) return;
        el.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
        const heading = el.querySelector("h3");
        if (heading && "focus" in heading) {
          (heading as HTMLElement).focus({ preventScroll: true });
        }
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [reducedMotion]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-charcoal text-cream selection:bg-clay/40 selection:text-cream">
      <div className="noise-overlay-dark" aria-hidden />

      <a
        href="#design-framework-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-cream focus:px-4 focus:py-2 focus:text-sm focus:text-charcoal focus:shadow-lg"
      >
        Skip to framework content
      </a>

      {/* Mobile steps control */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-charcoal/90 p-3 backdrop-blur-md lg:hidden"
        role="presentation"
      >
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-clay py-3 font-medium text-cream shadow-lg shadow-clay/25 transition hover:bg-clay/90"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls="design-framework-mobile-panel"
        >
          <List className="h-5 w-5" aria-hidden />
          Steps
        </button>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-[2px] lg:hidden"
          role="presentation"
          onClick={() => setMobileOpen(false)}
        >
          <div
            id="design-framework-mobile-panel"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-[#1f2420] p-6 shadow-2xl shadow-black/40"
            role="dialog"
            aria-modal="true"
            aria-label="Framework steps"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-serif text-xl italic text-cream">Jump to step</p>
              <button
                type="button"
                className="rounded-lg px-3 py-1 text-sm text-cream/70 hover:bg-white/10 hover:text-cream"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </button>
            </div>
            <WayfindingRail
              variant="plain"
              phases={DESIGN_FRAMEWORK_PHASES}
              activeSubstepHash={activeSubstepHash}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-12 md:px-8 md:pb-16 md:pt-16 lg:pb-16">
        <header className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cream/70">
            Formless site
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light italic text-cream md:text-6xl">
            Design framework
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream/75 md:text-xl">
            A single arc from intent to manifestation. Use each prompt to define
            and design the Formless website; outputs are the artifacts you carry
            forward.
          </p>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
          <main
            id="design-framework-main"
            tabIndex={-1}
            className="min-w-0 outline-none"
          >
            {DESIGN_FRAMEWORK_PHASES.map((phase) => (
              <PhaseBlock
                key={phase.id}
                phase={phase}
                activeSubstepHash={activeSubstepHash}
                reducedMotion={reducedMotion}
              />
            ))}
          </main>

          <aside className="hidden lg:block">
            <WayfindingRail
              phases={DESIGN_FRAMEWORK_PHASES}
              activeSubstepHash={activeSubstepHash}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
