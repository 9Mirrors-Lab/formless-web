/**
 * Exploration: unify page-top marks (eyebrows / numbers / rules) across
 * Inquire, The Practice, and Spirituality & Science.
 *
 * Grammar is expanded from the /brand/designs concept lockups (Energy
 * Evolution, Beyond Boundaries): tracked eyebrow words, hairline rules,
 * stub rules, weight contrast, and dot-separated tag rows. Marks are the
 * animated teaching icons from /icons; no photographic backgrounds.
 *
 * Lab only — not design-system canon until a direction is chosen.
 */

import { useRef, type ReactNode } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import { useIconAnimations } from '@/hooks/useIconAnimations';

type SurfaceId = 'inquire' | 'practice' | 'science';
type DirectionId = 'a' | 'b' | 'c' | 'd';

const GOLD = '#d9b978';
const CLAY = '#CC5833';

const NAV = [
  { href: '#live-today', label: 'Live today' },
  { href: '#grammar', label: 'Shared grammar' },
  { href: '#inquire', label: 'Inquire' },
  { href: '#practice', label: 'Practice' },
  { href: '#science', label: 'Science' },
  { href: '#expand', label: 'Weight & placement' },
  { href: '#decide', label: 'Decide' },
] as const;

const DIRECTIONS: {
  id: DirectionId;
  title: string;
  effort: string;
  source: string;
  summary: string;
}[] = [
  {
    id: 'a',
    title: 'Rail',
    effort: 'Low',
    source: 'Energy Evolution eyebrow',
    summary:
      'Mark, tracked word, then a hairline that runs out to the edge of the measure. The rule becomes structure for the whole header instead of a short accent stub.',
  },
  {
    id: 'b',
    title: 'Compact pair',
    effort: 'Low',
    source: 'Current Science direction B',
    summary:
      'Mark, word, short rule, all on one tight line. The closest to what already reads right on Science; kept unchanged as the reference.',
  },
  {
    id: 'c',
    title: 'Understroke',
    effort: 'Low',
    source: 'Beyond Boundaries headline',
    summary:
      'Word and hairline lead in, then the mark moves below the title on a short stub rule. Puts the design element after the statement, not before it.',
  },
  {
    id: 'd',
    title: 'Meta rail',
    effort: 'Medium',
    source: 'Beyond Boundaries meta block',
    summary:
      'Mark, vertical hairline, then a two-line stack of word plus descriptor. Carries more information without adding a second type size.',
  },
];

/**
 * Animated teaching marks from /icons. GSAP loops come from useIconAnimations.
 * Bonds and open outcome loop without ever leaving the frame, so they hold at
 * eyebrow scale. Seed of life and the formless dissolve to nothing mid-loop.
 */
const SURFACE_ICONS: Record<SurfaceId, string> = {
  inquire: 'formless',
  practice: 'molecule',
  science: 'quantum',
};

const SURFACE_DESCRIPTORS: Record<SurfaceId, string> = {
  inquire: 'Ask Sonika',
  practice: 'The Practice',
  science: 'Spirituality & Science',
};

const SCIENCE_PILLARS: { label: string; icon: string }[] = [
  { label: 'Perception', icon: 'observer' },
  { label: 'Neuroplasticity', icon: 'neural' },
  { label: 'The Body', icon: 'anchor' },
  { label: 'Consciousness', icon: 'space' },
];

function Mark({ id, size = 26 }: { id: string; size?: number }) {
  return <TeachingIconMark id={id} theme="dark" size={size} />;
}

function HairRule({ flex = false, width }: { flex?: boolean; width?: number }) {
  return (
    <span
      className={`block h-px ${flex ? 'min-w-0 flex-1' : 'shrink-0'}`}
      style={{ background: GOLD, opacity: 0.5, width: flex ? undefined : width }}
      aria-hidden
    />
  );
}

function EyebrowWord({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.34em] text-cream/60 md:text-[11px]">
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d9b978]/85">
      {children}
    </p>
  );
}

/** Open specimen: hairline separator and a caption, no card chrome. */
function Specimen({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="border-t border-cream/10 pt-8">
      <figcaption className="mb-7 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/35">
        {caption}
      </figcaption>
      {children}
    </figure>
  );
}

type LockupParts = {
  top: ReactNode;
  underTitle?: ReactNode;
  footer?: ReactNode;
};

function lockupParts(
  direction: DirectionId,
  { surface, word, tags }: { surface: SurfaceId; word: string; tags?: string[] },
): LockupParts {
  const iconId = SURFACE_ICONS[surface];

  switch (direction) {
    case 'a':
      return {
        top: (
          <div className="flex items-center gap-5">
            <Mark id={iconId} />
            <EyebrowWord>{word}</EyebrowWord>
            <HairRule flex />
          </div>
        ),
      };
    case 'b':
      return {
        top: (
          <div className="flex max-w-xl flex-wrap items-center gap-3 md:gap-4">
            <Mark id={iconId} size={24} />
            <EyebrowWord>{word}</EyebrowWord>
            <HairRule width={96} />
          </div>
        ),
      };
    case 'c':
      return {
        top: (
          <div className="flex items-center gap-5">
            <EyebrowWord>{word}</EyebrowWord>
            <HairRule flex />
          </div>
        ),
        underTitle: (
          <div className="flex items-center gap-4">
            <HairRule width={56} />
            <Mark id={iconId} size={24} />
          </div>
        ),
      };
    case 'd': {
      const descriptor = SURFACE_DESCRIPTORS[surface];
      return {
        top: (
          <div className="flex items-stretch gap-5">
            <Mark id={iconId} />
            <span className="w-px shrink-0" style={{ background: GOLD, opacity: 0.4 }} aria-hidden />
            <span className="flex flex-col justify-center gap-1.5">
              <EyebrowWord>{word}</EyebrowWord>
              {descriptor === word ? null : (
                <span className="font-serif text-[0.95rem] italic leading-none text-cream/55">
                  {descriptor}
                </span>
              )}
            </span>
          </div>
        ),
        footer: tags?.length ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cream/45">
            {tags.map((tag, i) => (
              <span key={tag} className="flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden style={{ color: GOLD }}>
                    ·
                  </span>
                ) : null}
                {tag}
              </span>
            ))}
          </div>
        ) : undefined,
      };
    }
    default: {
      const _exhaustive: never = direction;
      return _exhaustive;
    }
  }
}

function InquireHeroMock({ direction }: { direction: DirectionId }) {
  const parts = lockupParts(direction, { surface: 'inquire', word: 'Inquire' });
  return (
    <Specimen caption={`Inquire · direction ${direction.toUpperCase()}`}>
      {parts.top}
      <h3 className="mt-7 font-serif text-[2rem] font-medium uppercase leading-[0.98] tracking-[0.01em] text-[#f5f1e9] md:text-[2.6rem]">
        <span className="block" style={{ color: GOLD }}>
          Inquire
        </span>
        <span className="block">
          With <span style={{ color: GOLD }}>Sonika</span>
        </span>
      </h3>
      {parts.underTitle ? <div className="mt-6">{parts.underTitle}</div> : null}
      <p className="mt-6 max-w-[34rem] font-sans text-[0.95rem] leading-[1.65] text-[#e8e0d2]/80">
        Submit a question. Sonika reads each inquiry and points you back to the wisdom already
        within you.
      </p>
      {parts.footer ? <div className="mt-7">{parts.footer}</div> : null}
    </Specimen>
  );
}

function PracticeHeroMock({ direction }: { direction: DirectionId }) {
  const parts = lockupParts(direction, { surface: 'practice', word: 'The Practice' });
  return (
    <Specimen caption={`The Practice · direction ${direction.toUpperCase()}`}>
      {parts.top}
      <h3 className="mt-7 max-w-3xl font-serif text-4xl italic leading-[1.08] text-cream md:text-[3rem]">
        Learn to observe the mind without becoming lost in it.
      </h3>
      {parts.underTitle ? <div className="mt-6">{parts.underTitle}</div> : null}
      <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-cream/55">
        Beneath every inner struggle is unconscious identification with thought.
      </p>
      {parts.footer ? <div className="mt-7">{parts.footer}</div> : null}
    </Specimen>
  );
}

function ScienceHeroMock({
  direction,
  pillars = 'numbers',
}: {
  direction: DirectionId;
  pillars?: 'numbers' | 'icons';
}) {
  const parts = lockupParts(direction, {
    surface: 'science',
    word: 'Two Languages One Truth',
    tags: SCIENCE_PILLARS.map((pillar) => pillar.label),
  });
  return (
    <Specimen caption={`Science · direction ${direction.toUpperCase()} · pillars ${pillars}`}>
      <div className="grid gap-10 md:grid-cols-[1.35fr_1fr] md:items-end">
        <div>
          {parts.top}
          <h3 className="mt-6 font-serif text-[clamp(1.85rem,3.6vw,2.75rem)] leading-[1.05] tracking-[-0.012em] text-[#ECE9DD]">
            A bridge for the part of you that needs to understand.
          </h3>
          {parts.underTitle ? <div className="mt-6">{parts.underTitle}</div> : null}
        </div>
        <div>
          <p className="font-serif text-[1.05rem] leading-[1.55] text-[#ECE9DD]/85">
            The deepest truths about who you are do not require belief. For the mind that needs a
            rational foothold before it can let go: here is one.
          </p>
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 border-t border-[#ECE9DD]/12 pt-5">
            {SCIENCE_PILLARS.map((pillar, i) => (
              <div key={pillar.label} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
                {pillars === 'icons' ? (
                  <Mark id={pillar.icon} size={18} />
                ) : (
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: CLAY }}
                  >
                    0{i + 1}
                  </span>
                )}
                <span className="font-serif italic text-[13px] text-[#ECE9DD]/70">
                  {pillar.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Specimen>
  );
}

function LiveDialect({
  title,
  href,
  note,
  children,
}: {
  title: string;
  href: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <article className="border-t border-cream/10 pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-serif text-xl text-cream">{title}</h3>
        <a
          href={href}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4"
        >
          {href}
        </a>
      </div>
      <p className="mt-2 font-sans text-sm leading-relaxed text-cream/50">{note}</p>
      <div className="mt-7">{children}</div>
    </article>
  );
}

export default function PageMarksExplorePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Design reference surface: keep the teaching-mark loops visible for review.
  useIconAnimations(containerRef, { ignoreReducedMotion: true });

  return (
    <PageLayout dark>
      <div ref={containerRef} className="min-h-screen bg-[#07090b] text-[#f2eee6]">
        <header className="px-6 py-12 md:px-16 md:py-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-cream/50">
              Exploration · page marks · not design-system yet
            </p>
            <h1 className="mt-4 max-w-[22ch] font-serif text-4xl italic leading-tight md:text-5xl">
              One family of small marks at the top of each page.
            </h1>
            <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-cream/70 md:text-lg">
              The words stay. What changes is the mark, the weight, and where the rule sits. Marks
              are the animated teaching icons; the type and rule patterns are expanded from the
              Energy Evolution and Beyond Boundaries lockups in the studio.
            </p>
            <nav aria-label="Page marks jump links" className="mt-8 flex flex-wrap gap-2">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-10 items-center border border-cream/20 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/85 transition-colors duration-300 hover:border-[#d9b978]/55 hover:text-[#d9b978]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
              <a
                href="/icons"
                className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4"
              >
                /icons
              </a>
              <a
                href="/inquire"
                className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4"
              >
                /inquire
              </a>
              <a
                href="/brand/designs"
                className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4"
              >
                /brand/designs
              </a>
            </div>
          </div>
        </header>

        <section id="live-today" className="scroll-mt-24 px-6 py-14 md:px-16 md:py-20 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>01 · Live today</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl italic md:text-4xl">Three different dialects</h2>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-cream/60">
              Same site, three top treatments. The goal is kinship, not cloning.
            </p>

            <div className="mt-10 grid gap-8 lg:grid-cols-3">
              <LiveDialect
                title="Inquire"
                href="/inquire"
                note="Number 01 + gold horizontal rule. Strongest existing accent."
              >
                <div className="flex items-center gap-4">
                  <span className="font-sans text-[0.95rem] font-medium tracking-[0.14em] text-[#f2eee6]/85">
                    01
                  </span>
                  <span className="h-px w-28" style={{ background: GOLD }} aria-hidden />
                </div>
                <p className="mt-5 font-serif text-lg uppercase tracking-[0.02em]">
                  Inquire with Sonika
                </p>
              </LiveDialect>

              <LiveDialect
                title="The Practice"
                href="/work"
                note="Word-only mono eyebrow. No mark, no rule."
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cream/40">
                  The Practice
                </span>
                <p className="mt-5 font-serif text-lg italic text-cream/90">
                  Learn to observe the mind…
                </p>
              </LiveDialect>

              <LiveDialect
                title="Science"
                href="/science"
                note="Word eyebrow + clay numbered pillar row (01–04)."
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-cream/55">
                  Two Languages One Truth
                </span>
                <div className="mt-5 flex flex-wrap gap-3">
                  {['Perception', 'Neuroplasticity', 'Body', 'Consciousness'].map((label, i) => (
                    <span key={label} className="font-serif italic text-sm text-cream/70">
                      <span className="mr-1.5 font-mono text-[10px] not-italic" style={{ color: CLAY }}>
                        0{i + 1}
                      </span>
                      {label}
                    </span>
                  ))}
                </div>
              </LiveDialect>
            </div>
          </div>
        </section>

        <section id="grammar" className="scroll-mt-24 px-6 py-14 md:px-16 md:py-20 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>02 · Shared grammar</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl italic md:text-4xl">Four ways to relate</h2>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-cream/60">
              Every direction keeps the page word and an animated teaching mark. What differs is
              placement and how far the rule travels. Live map: formless for Inquire, bonds for
              The Practice, open outcome for Science, seed of life for About.
            </p>

            <div className="mt-12 grid gap-12 md:grid-cols-2">
              {DIRECTIONS.map((dir) => {
                const parts = lockupParts(dir.id, { surface: 'inquire', word: 'Inquire' });
                return (
                  <article key={dir.id} className="border-t border-cream/10 pt-7">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-serif text-2xl text-cream">
                        <span className="mr-3 font-mono text-sm tracking-[0.18em] text-[#d9b978]">
                          {dir.id.toUpperCase()}
                        </span>
                        <span>{dir.title}</span>
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/35">
                        {dir.effort} effort
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/30">
                      From {dir.source}
                    </p>
                    <p className="mt-4 max-w-[46ch] font-sans text-sm leading-relaxed text-cream/60">
                      {dir.summary}
                    </p>
                    <div className="mt-8">
                      {parts.top}
                      <p className="mt-5 font-serif text-xl uppercase tracking-[0.02em] text-cream/90">
                        Inquire with Sonika
                      </p>
                      {parts.underTitle ? <div className="mt-5">{parts.underTitle}</div> : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="inquire" className="scroll-mt-24 px-6 py-14 md:px-16 md:py-20 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>03 · Inquire applications</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl italic md:text-4xl">
              Drop the number. Keep the word.
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-cream/60">
              Reference surface. Mark: formless. The rule stays gold on every direction; only its
              length and position move.
            </p>
            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              <InquireHeroMock direction="a" />
              <InquireHeroMock direction="b" />
              <InquireHeroMock direction="c" />
              <InquireHeroMock direction="d" />
            </div>
          </div>
        </section>

        <section id="practice" className="scroll-mt-24 px-6 py-14 md:px-16 md:py-20 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>04 · The Practice applications</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl italic md:text-4xl">
              Give the word eyebrow a sibling mark.
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-cream/60">
              Mark: bonds. The long italic title wants either the full rail (A) or the
              understroke (C) so the mark does not crowd the first line. Bonds stay in frame
              between cycles; seed of life is reserved for About.
            </p>
            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              <PracticeHeroMock direction="a" />
              <PracticeHeroMock direction="b" />
              <PracticeHeroMock direction="c" />
              <PracticeHeroMock direction="d" />
            </div>
          </div>
        </section>

        <section id="science" className="scroll-mt-24 px-6 py-14 md:px-16 md:py-20 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>05 · Science applications</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl italic md:text-4xl">
              Eyebrow kinship plus pillar evolution.
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-cream/60">
              Hero mark: open outcome. Pillar row can keep clay numbers for now, or graduate to small
              teaching marks so the top of the page stops mixing “words only” with “numbers only.”
            </p>
            <div className="mt-12 grid gap-12">
              <ScienceHeroMock direction="b" pillars="numbers" />
              <ScienceHeroMock direction="a" pillars="icons" />
              <ScienceHeroMock direction="c" pillars="icons" />
            </div>
          </div>
        </section>

        <section id="expand" className="scroll-mt-24 px-6 py-14 md:px-16 md:py-20 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>06 · Weight & placement</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl italic md:text-4xl">
              Expanded from the studio lockups
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-cream/60">
              Four moves borrowed from Energy Evolution and Beyond Boundaries, with no background
              imagery: weight contrast between the two title lines, a divider that carries a mark,
              a stub rule over real pillar tags, and a meta rail. These can combine with any
              direction above. Study 04 runs the formless mark large, where its rings have room to
              read.
            </p>

            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              <Specimen caption="Study 01 · serif over tracked sans">
                <div className="flex items-center gap-5">
                  <Mark id="molecule" />
                  <EyebrowWord>The</EyebrowWord>
                  <HairRule flex />
                </div>
                <p className="mt-6 font-serif text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.92]" style={{ color: GOLD }}>
                  Inquire
                </p>
                <p className="mt-2 font-sans text-[clamp(1.1rem,2.2vw,1.6rem)] font-light uppercase tracking-[0.3em] text-cream/90">
                  With Sonika
                </p>
                <p className="mt-6 max-w-[34rem] font-sans text-sm leading-relaxed text-cream/55">
                  Heavy serif line against a light, widely tracked sans line. Same two words, two
                  weights, no extra chrome.
                </p>
              </Specimen>

              <Specimen caption="Study 02 · divider carrying the mark">
                <div className="flex items-center gap-5">
                  <EyebrowWord>Two Languages One Truth</EyebrowWord>
                  <HairRule flex />
                </div>
                <p className="mt-6 max-w-[20ch] font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.05] text-cream">
                  A bridge for the part of you that needs to understand.
                </p>
                <div className="mt-7 flex items-center gap-4">
                  <HairRule flex />
                  <Mark id="quantum" size={22} />
                  <HairRule flex />
                </div>
                <p className="mt-6 max-w-[34rem] font-sans text-sm leading-relaxed text-cream/55">
                  The Energy Evolution diamond divider, with a teaching mark in the gap instead of
                  a decorative shape.
                </p>
              </Specimen>

              <Specimen caption="Study 03 · stub rule over pillar tags">
                <div className="flex items-center gap-5">
                  <Mark id="quantum" />
                  <EyebrowWord>The Practice</EyebrowWord>
                  <HairRule flex />
                </div>
                <p className="mt-6 max-w-[22ch] font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] italic leading-[1.08] text-cream">
                  Learn to observe the mind without becoming lost in it.
                </p>
                <div className="mt-7">
                  <HairRule width={44} />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cream/45">
                  {SCIENCE_PILLARS.map((pillar, i) => (
                    <span key={pillar.label} className="flex items-center gap-3">
                      {i > 0 ? (
                        <span aria-hidden style={{ color: GOLD }}>
                          ·
                        </span>
                      ) : null}
                      {pillar.label}
                    </span>
                  ))}
                </div>
              </Specimen>

              <Specimen caption="Study 04 · meta rail under the title">
                <div className="flex items-center gap-5">
                  <EyebrowWord>Formless</EyebrowWord>
                  <HairRule flex />
                </div>
                <p className="mt-6 max-w-[18ch] font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.98] uppercase" style={{ color: GOLD }}>
                  Inquire
                  <span className="block text-cream">With Sonika</span>
                </p>
                <div className="mt-7 flex items-stretch gap-5">
                  <Mark id="formless" size={44} />
                  <span
                    className="w-px shrink-0"
                    style={{ background: GOLD, opacity: 0.4 }}
                    aria-hidden
                  />
                  <span className="flex flex-col justify-center gap-1.5">
                    <EyebrowWord>Ask Sonika</EyebrowWord>
                    <span className="font-serif text-[0.95rem] italic leading-none text-cream/55">
                      Submit anonymously
                    </span>
                  </span>
                </div>
              </Specimen>
            </div>
          </div>
        </section>

        <section id="decide" className="scroll-mt-24 px-6 py-16 md:px-16 md:py-24 lg:px-24">
          <div className="mx-auto max-w-3xl">
            <SectionLabel>07 · Where to start</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl italic md:text-4xl">Suggested path</h2>
            <ul className="mt-8 space-y-5 font-sans text-base leading-relaxed text-cream/70">
              <li>
                <span className="font-semibold text-cream">Promoted to live pages.</span> Inquire A
                (formless), Practice C (bonds), Book B (space), Science B (open outcome), About B
                (seed of life).
              </li>
              <li>
                <span className="font-semibold text-cream">Keep B as the reference.</span> It is the
                closest to right today and already reads on Science and About.
              </li>
              <li>
                <span className="font-semibold text-cream">Practice uses understroke C.</span> Bonds
                stay in frame; seed of life lives on About instead so each page mark is unique.
              </li>
            </ul>
            <p className="mt-10 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-cream/40">
              Live on /inquire · /work · /book · /science · /about
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
