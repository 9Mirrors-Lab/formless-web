import { motion } from "framer-motion";

import type { Substep } from "@/data/designFramework";

function splitOutputs(output: string): string[] {
  return output
    .split(/\s*&\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

type SubstepBlockProps = {
  substep: Substep;
  isActive: boolean;
  reducedMotion: boolean;
};

export function SubstepBlock({
  substep,
  isActive,
  reducedMotion,
}: SubstepBlockProps) {
  const headingId = `${substep.hash}-heading`;
  const outputs = splitOutputs(substep.output);

  const inner = (
    <>
      <h3
        id={headingId}
        className="font-serif text-2xl font-light italic text-cream md:text-3xl"
      >
        {substep.label}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-cream/85 md:text-lg">
        {substep.guide}
      </p>
      <div
        className="mt-6 rounded-xl border-l-4 border-clay bg-moss/25 p-4 md:p-5"
        role="note"
      >
        <p className="text-xs font-medium uppercase tracking-widest text-cream/65">
          Prompt
        </p>
        <p className="mt-2 text-base italic leading-relaxed text-cream/95 md:text-lg">
          “{substep.prompt}”
        </p>
      </div>
      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-widest text-cream/65">
          Output
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {outputs.map((o) => (
            <li key={o}>
              <code className="rounded-lg bg-black/35 px-2.5 py-1 font-mono text-xs text-cream/90 ring-1 ring-white/10 md:text-sm">
                {o}
              </code>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <article
      id={substep.hash}
      aria-labelledby={headingId}
      className={`scroll-mt-28 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg shadow-black/20 backdrop-blur-sm transition-shadow md:p-8 ${
        isActive ? "shadow-xl ring-1 ring-clay/50" : ""
      }`}
    >
      {reducedMotion ? (
        inner
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {inner}
        </motion.div>
      )}
    </article>
  );
}
