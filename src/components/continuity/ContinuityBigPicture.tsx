import { motion, useReducedMotion } from 'framer-motion';

import { ContinuityDisclosure } from '@/components/continuity/ContinuityDisclosure';
import { CONTINUITY_BIG_PICTURE } from '@/data/continuityHome';

export function ContinuityBigPicture() {
  const reduce = useReducedMotion();

  return (
    <section id="picture" className="scroll-mt-8">
      <p className="max-w-[58ch] font-sans text-sm leading-relaxed text-cream/65">
        Open each step for the plain-language version. This is the packing order of the site, not
        a to-do list.
      </p>

      <ol className="mt-8">
        {CONTINUITY_BIG_PICTURE.map((step, index) => (
          <motion.li
            key={step.id}
            className="relative border-l border-cream/20 pl-6 md:pl-8"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: reduce ? 0 : index * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            {index < CONTINUITY_BIG_PICTURE.length - 1 ? (
              <span className="sr-only">Then</span>
            ) : null}
            <ContinuityDisclosure title={step.label} className="group py-4 md:py-5">
              {step.explanation}
            </ContinuityDisclosure>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
