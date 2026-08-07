import { ClientReviewBanner } from '@/components/ClientReviewBanner';
import {
  HELIX_DUST_VARIANTS,
  HelixDustStudy,
  type HelixDustVariant,
} from '@/components/HelixDustStudy';

/** Isolated dust-helix study: no teaching copy, three sunlit-mote variations. */
export default function ClientReviewHelixDustPage() {
  return (
    <div className="min-h-[100dvh] bg-[#080a09] text-cream">
      <ClientReviewBanner
        title="Helix dust study"
        status="experiment"
        note="Animation only. Teaching marks and copy removed. Three ways dust can catch light along the helix."
      />

      <header className="mx-auto max-w-6xl px-6 pb-2 pt-10 md:px-16 lg:px-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9fb5aa]/75">
          Motion study · particles
        </p>
        <h1 className="mt-3 max-w-2xl font-serif text-3xl italic leading-tight text-cream/90 md:text-4xl">
          Dust catching the sun.
        </h1>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-cream/50">
          Same helix path, denser motes, no Pause / Observe / Recognize lockup.
          Pick the particle behavior that feels closest.
        </p>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3 md:px-16 lg:px-24">
        {HELIX_DUST_VARIANTS.map((item) => (
          <article
            key={item.id}
            className="rounded-sm border border-cream/10 bg-[#0c0f0d] px-4 py-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/35">
              {item.id}
            </p>
            <h2 className="mt-2 font-serif text-2xl italic text-cream/88">
              {item.title}
            </h2>
            <p className="mt-2 mb-6 min-h-[4.5rem] font-sans text-[0.8rem] leading-relaxed text-cream/42">
              {item.thesis}
            </p>
            <HelixDustStudy
              variant={item.id as HelixDustVariant}
              ignoreReducedMotion
            />
          </article>
        ))}
      </section>
    </div>
  );
}
