import { PageLayout } from '../components/PageLayout';
import { LockupStickyStack } from '@/components/book/lockups/LockupStickyStack';
import { LockupCurtainReveal } from '@/components/book/lockups/LockupCurtainReveal';
import { LockupStickyCards } from '@/components/book/lockups/LockupStickyCards';
import { LockupSplitScroll } from '@/components/book/lockups/LockupSplitScroll';
import { BookChapterSampleSection } from '@/components/book/BookChapterSampleSection';

const NAV = [
  { href: '#lockup-baseline', label: 'Baseline' },
  { href: '#lockup-sticky-stack', label: 'Sticky stack' },
  { href: '#lockup-curtain', label: 'Curtain' },
  { href: '#lockup-sticky-cards', label: 'Sticky cards' },
  { href: '#lockup-split-scroll', label: 'Split scroll' },
] as const;

/**
 * Live lab for book editorial lockups.
 * Cinematic Modules patterns remapped to Formless tokens; reusable sitewide once chosen.
 */
export default function BookLockupsExplorePage() {
  return (
    <PageLayout>
      <div className="bg-cream text-charcoal">
        <header className="border-b border-charcoal/10 bg-moss px-6 py-10 text-cream md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-cream/70">
              Exploration · cinematic lockups
            </p>
            <h1 className="mt-4 max-w-[18ch] font-serif text-4xl italic leading-tight md:text-5xl">
              Ways to hold chapter + From Soni information.
            </h1>
            <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-cream/75 md:text-lg">
              Same Formless content, four Cinematic Modules patterns (sticky stack, curtain
              reveal, sticky cards, split scroll), plus the current baseline chapter sample.
              Pick what travels to /book, /work, and elsewhere.
            </p>
            <nav
              aria-label="Lockup jump links"
              className="mt-8 flex flex-wrap gap-2"
            >
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-10 items-center border border-cream/25 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors duration-300 hover:bg-cream hover:text-charcoal"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <div id="lockup-baseline">
          <div className="border-b border-charcoal/10 px-6 py-6 md:px-16 lg:px-24">
            <p className="mx-auto max-w-6xl font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-moss">
              Lockup 0 · Baseline (live on /book today)
            </p>
          </div>
          <BookChapterSampleSection />
        </div>

        <LockupStickyStack />
        <LockupCurtainReveal />
        <LockupStickyCards />
        <LockupSplitScroll />

        <section className="border-t border-charcoal/10 bg-cream px-6 py-16 md:px-16 md:py-24 lg:px-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-3xl italic md:text-4xl">What to decide</h2>
            <ul className="mt-8 space-y-4 font-sans text-base leading-relaxed text-charcoal/70">
              <li>
                <span className="font-semibold text-charcoal">Sticky stack</span> — best when a
                pinned visual should teach while copy scrolls (chapter + IG stills, practice
                domains).
              </li>
              <li>
                <span className="font-semibold text-charcoal">Curtain reveal</span> — best for a
                single teaching opposition (resistance / surrender) that earns a reveal moment.
              </li>
              <li>
                <span className="font-semibold text-charcoal">Sticky cards</span> — best for a
                short sequence of beats; works mobile without a dual-column sticky.
              </li>
              <li>
                <span className="font-semibold text-charcoal">Split scroll</span> — best for pairing
                book language with Instagram stills as a dual stream; heaviest motion budget.
              </li>
            </ul>
            <p className="mt-10 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal/45">
              Tell me which lockup(s) to promote · /book stays on baseline until then
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
