import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LayoutTestHeroSection } from '@/components/LayoutTestHeroSection';

const navItems = [
  { label: 'The Practice', href: '#practice' },
  { label: 'Formless', href: '#book' },
  { label: 'Spirituality & Science', href: '#science' },
  { label: 'About', href: '#about' },
  { label: 'Connect', href: '#connect' },
];

const practiceCards = [
  {
    title: 'Relationships',
    eyebrow: 'Mirror',
    body:
      'Every reaction in a relationship is a mirror of something unresolved within you. Your partner, your children, your parents or extended family. Each one reveals unconscious patterns, thoughts, and beliefs you have carried from the past into the present moment.',
  },
  {
    title: 'Career & Financial Wealth',
    eyebrow: 'Identity',
    body:
      'When your job becomes a part of your identity, losing it can feel like losing yourself. The fear around career and finances is tied to the story the mind has created about who you are, your worth, and what happens if it all disappears.',
  },
  {
    title: 'The Body',
    eyebrow: 'Memory',
    body:
      'The body memorizes what the mind repeatedly lives in. Stress, chronic tension, exhaustion, and emotional pain become conditioned patterns within the body until they are brought into awareness.',
  },
  {
    title: 'Family',
    eyebrow: 'Pattern',
    body:
      'Family dynamics shape many of the beliefs, fears, and emotional patterns carried into adulthood. Freedom begins not through blame or resistance, but through awareness.',
  },
];

const layoutNotes = [
  'Playground only: layout, type scale, and section rhythm experiments.',
  'Does not affect / or /revised until changes are promoted deliberately.',
  'Started from client feedback direction: Eyes Closed brand, The Practice, Spirituality & Science.',
  'Use this page to try dark-first heroes, clay CTAs, and new section grids.',
  'Live copy and IA for review live on /revised routes.',
];

function LayoutTestsNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav
        aria-label="Layout test navigation"
        className="fixed left-1/2 top-5 z-50 flex w-[94%] max-w-6xl -translate-x-1/2 items-center justify-between rounded-full border border-cream/12 bg-[#070806]/92 px-5 py-3 text-cream shadow-2xl shadow-black/25 md:px-7"
      >
        <a
          href="#top"
          className="inline-flex min-h-11 items-center gap-3 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80"
        >
          <span className="relative h-6 w-6 rounded-full border border-clay/70" aria-hidden>
            <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-clay" />
          </span>
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.32em]">
            Eyes Closed
          </span>
        </a>
        <div className="hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-cream/68 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center px-1 transition-colors hover:text-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#notes"
            className="inline-flex min-h-11 items-center rounded-full bg-cream px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal transition-transform motion-safe:hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80 lg:hidden"
          >
            Notes
          </a>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream transition-colors hover:bg-cream/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="layout-tests-nav-panel"
            aria-label="Open layout test menu"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <a
            href="#notes"
            className="hidden min-h-11 items-center rounded-full bg-cream px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal transition-transform motion-safe:hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80 lg:inline-flex"
          >
            Notes
          </a>
        </div>
      </nav>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal/80 lg:hidden"
          role="presentation"
          onClick={closeMobile}
        >
          <div
            id="layout-tests-nav-panel"
            className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border border-cream/10 bg-[#070806] p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Layout test menu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="font-serif text-xl italic text-cream">Eyes Closed</p>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80"
                onClick={closeMobile}
                aria-label="Close layout test menu"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <ul className="flex flex-col gap-1 text-sm font-semibold uppercase tracking-[0.18em]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={closeMobile}
                    className="inline-flex min-h-11 w-full items-center rounded-lg px-3 text-cream/75 transition-colors hover:bg-cream/5 hover:text-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="mt-4">
                <a
                  href="#notes"
                  onClick={closeMobile}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-cream px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80"
                >
                  Notes
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="mb-5 block font-mono text-xs uppercase tracking-[0.28em] text-clay/80">
      {children}
    </span>
  );
}

/** Layout playground: experimental sections, not wired to CMS or /revised. */
export default function LayoutTestsPage() {
  return (
    <div id="top" className="min-h-screen bg-[#080907] text-cream selection:bg-clay/40">
      <LayoutTestsNav />

      <main>
        <LayoutTestHeroSection />

        <section
          id="reflection"
          className="relative overflow-hidden bg-cream px-6 py-28 text-charcoal md:px-16 lg:px-24"
        >
          <div className="absolute right-[-12rem] top-[-8rem] h-[32rem] w-[32rem] rounded-full bg-moss/10 blur-[100px]" />
          <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <SectionLabel>Layout test · Reflection</SectionLabel>
              <h2 className="font-serif text-5xl italic leading-tight md:text-7xl">
                An invitation to go within and meet yourself beyond the identities
                and stories.
              </h2>
            </div>
            <div className="rounded-[2rem] border border-charcoal/10 bg-white/45 p-7 md:p-10">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-moss">
                The Mind
              </p>
              <p className="mt-8 font-serif text-3xl italic leading-snug md:text-5xl">
                Freedom begins the moment you separate yourself from your thoughts
                and simply observe the mind.
              </p>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-charcoal/64">
                Behind every thought is the awareness that sees it. That awareness
                is what you are, untouched and unharmed by any experience of life.
              </p>
            </div>
          </div>
        </section>

        <section id="practice" className="px-6 py-28 md:px-16 lg:px-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <SectionLabel>Layout test · The Practice</SectionLabel>
                <h2 className="font-serif text-5xl italic leading-tight md:text-7xl">
                  Observe the mind instead of becoming lost within it.
                </h2>
              </div>
              <div className="pt-2">
                <p className="text-xl leading-relaxed text-cream/66">
                  Beneath every inner struggle is unconscious identification with thought.
                </p>
                <p className="mt-8 border-t border-cream/10 pt-8 font-serif text-3xl italic leading-snug text-clay">
                  Your life circumstances are constantly changing. However, the
                  deep rooted internal patterns of the mind repeat themselves until
                  they are seen.
                </p>
              </div>
            </div>

            <div className="mt-16 grid gap-4 md:grid-cols-2">
              {practiceCards.map((card) => (
                <article
                  key={card.title}
                  className="min-h-[21rem] border border-cream/12 bg-cream/[0.055] p-7 transition-colors hover:border-clay/45 hover:bg-cream/[0.075] md:p-9"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-cream/36">
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-8 font-serif text-4xl italic text-cream">
                    {card.title}
                  </h3>
                  <p className="mt-7 max-w-xl text-sm leading-7 text-cream/58">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#11130f] px-6 py-28 md:px-16 lg:px-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <SectionLabel>Layout test · Reframe</SectionLabel>
              <h2 className="font-serif text-5xl italic leading-tight md:text-7xl">
                You are not your thoughts or beliefs.
              </h2>
              <p className="mt-8 font-serif text-4xl italic leading-tight text-clay md:text-6xl">
                You are the one that observes them. You are awareness.
              </p>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-cream/60">
              The mind creates stories based on the past, and projects fear into the
              future. Beneath every inner struggle is the identification with thought.
              The practice is not to fight those thoughts, but to become aware of them.
              When you begin to recognize these patterns, something deeper than the
              mind begins to emerge.
            </p>
          </div>
        </section>

        <section
          id="science"
          className="grid gap-0 bg-cream text-charcoal md:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="px-6 py-24 md:px-16 lg:px-24">
            <SectionLabel>Layout test · Spirituality & Science</SectionLabel>
            <h2 className="font-serif text-5xl italic leading-tight md:text-7xl">
              A quiet bridge between inner experience and what the body remembers.
            </h2>
          </div>
          <div className="border-t border-charcoal/10 px-6 py-24 md:border-l md:border-t-0 md:px-16 lg:px-24">
            <p className="max-w-2xl text-lg leading-8 text-charcoal/64">
              Split-panel science layout for testing rhythm and copy balance on a
              cream band between dark sections.
            </p>
          </div>
        </section>

        <section id="book" className="px-6 py-24 md:px-16 lg:px-24">
          <div className="mx-auto max-w-7xl border-y border-cream/12 py-16">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-cream/36">
              Layout test · Book
            </p>
            <div className="mt-8 grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
              <h2 className="font-serif text-6xl text-cream md:text-8xl">
                Formless
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-cream/60">
                Book remains the teaching doorway inside Eyes Closed. This block
                tests oversized serif title against supporting copy.
              </p>
            </div>
          </div>
        </section>

        <section id="notes" className="px-6 pb-20 pt-8 md:px-16 lg:px-24">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-clay px-7 py-12 text-cream md:px-12">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-cream/64">
                  /layout-tests
                </p>
                <h2 className="mt-5 font-serif text-4xl italic md:text-6xl">
                  Design playground. Not the live site.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/75">
                  Approved copy and IA ship on{' '}
                  <a href="/revised" className="underline decoration-cream/40 underline-offset-4">
                    /revised
                  </a>
                  . Promote layout wins from here when ready.
                </p>
              </div>
              <ul className="grid gap-4 text-sm leading-7 text-cream/80 md:grid-cols-2">
                {layoutNotes.map((note) => (
                  <li key={note} className="border-t border-cream/24 pt-4">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
