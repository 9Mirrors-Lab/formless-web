import { motion } from "framer-motion";

import type { Phase } from "@/data/designFramework";

import { SubstepBlock } from "./SubstepBlock";

type PhaseBlockProps = {
  phase: Phase;
  activeSubstepHash: string | null;
  reducedMotion: boolean;
};

export function PhaseBlock({
  phase,
  activeSubstepHash,
  reducedMotion,
}: PhaseBlockProps) {
  const titleId = `${phase.id}-title`;

  const header = (
    <header className="mb-10 border-b border-white/10 pb-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cream/70">
        Phase {phase.number}
      </p>
      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <span className="text-3xl md:text-4xl" aria-hidden>
          {phase.emoji}
        </span>
        <h2
          id={titleId}
          className="font-serif text-4xl font-light italic text-cream md:text-5xl"
        >
          {phase.title}
        </h2>
        <span className="text-lg text-cream/60 md:text-xl">
          ({phase.subtitle})
        </span>
      </div>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-cream/80 md:text-xl">
        {phase.purpose}
      </p>
    </header>
  );

  return (
    <section
      className="mb-24 md:mb-32"
      aria-labelledby={titleId}
    >
      {reducedMotion ? (
        header
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {header}
        </motion.div>
      )}

      <div className="flex flex-col gap-10 md:gap-12">
        {phase.substeps.map((sub) => (
          <SubstepBlock
            key={sub.id}
            substep={sub}
            isActive={activeSubstepHash === sub.hash}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}
