import { ClientReviewBanner } from '@/components/ClientReviewBanner';
import {
  HELIX_MOTION_OPTIONS,
  HelixTeachingLockup,
  type HelixLockupMotion,
} from '@/components/HelixTeachingLockup';

const SELECTED: HelixLockupMotion = 'dust';

/** Dust helix study: light-caught motes along the path; Trace kept for reference. */
export default function ClientReviewHelixLockupPage() {
  const selected = HELIX_MOTION_OPTIONS.find((o) => o.id === SELECTED)!;
  const others = HELIX_MOTION_OPTIONS.filter((o) => o.id !== SELECTED);

  return (
    <div className="min-h-[100dvh] bg-[#080a09] text-cream">
      <ClientReviewBanner
        title="Helix teaching lockup · Dust"
        status="experiment"
        note="Selected motion: Dust. Marks stay above each word. Helix reads as cream-moss motes catching light, not a hard stroke."
      />

      <header className="mx-auto max-w-5xl px-6 pb-2 pt-10 md:px-16 lg:px-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9fb5aa]/75">
          Selected · {selected.title}
        </p>
        <h1 className="mt-3 max-w-2xl font-serif text-3xl italic leading-tight text-cream/90 md:text-4xl">
          Dust when light finds the path.
        </h1>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-cream/50">
          {selected.thesis} Pause bars, witness ring, and recognize mark stay
          above their headlines. Trace remains below for comparison.
        </p>
      </header>

      <div className="mx-auto flex max-w-5xl justify-center px-6 py-10 md:px-16 lg:px-24">
        <div className="w-full max-w-[24rem] rounded-sm border border-cream/10 bg-[#0c0f0d] px-5 py-8">
          <HelixTeachingLockup
            motion="dust"
            ignoreReducedMotion
            rooted
          />
        </div>
      </div>

      <section className="mx-auto max-w-5xl border-t border-cream/8 px-6 py-12 md:px-16 lg:px-24">
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.24em] text-cream/35">
          Other motions kept for reference
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {others.map((variant) => (
            <article
              key={variant.id}
              className="rounded-sm border border-cream/8 bg-[#0c0f0d] px-4 py-6 opacity-80"
            >
              <h2 className="font-serif text-xl italic text-cream/80">
                {variant.title}
              </h2>
              <p className="mt-2 mb-6 font-sans text-[0.8rem] leading-relaxed text-cream/40">
                {variant.thesis}
              </p>
              <HelixTeachingLockup
                motion={variant.id}
                ignoreReducedMotion
                rooted={variant.id === 'trace'}
              />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
