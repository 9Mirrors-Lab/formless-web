import { useEffect, useState } from "react";

/**
 * Tracks which substep is most visible. Pass the same strings used as DOM `id`
 * (use `substep.hash` on each scroll target so `#fragment` links work).
 */
export function useActiveSubstepId(substepHashes: string[]): string | null {
  const [active, setActive] = useState<string | null>(() => substepHashes[0] ?? null);
  const hashesKey = substepHashes.join(",");

  useEffect(() => {
    if (substepHashes.length === 0) return;

    const elements = substepHashes
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (top?.target.id) setActive(top.target.id);
      },
      {
        root: null,
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [hashesKey, substepHashes]);

  return active;
}
