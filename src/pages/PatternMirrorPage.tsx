import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageLayout } from '../components/PageLayout';
import { ParticleButton } from '../components/ParticleButton';

gsap.registerPlugin(ScrollTrigger);

interface PatternEntry {
  id: string;
  label: string;
  situation: string;
  mechanism: string;
}

const PATTERNS: PatternEntry[] = [
  {
    id: 'email',
    label: 'email',
    situation: 'One email can shift the entire day.',
    mechanism:
      'The mind reads a subject line as a verdict — on your worth, your standing, your safety. Before you have fully processed the words, a feeling has already arrived: tension, urgency, dread, or defensive anger. The email did not create the feeling. It triggered what was already there, waiting.',
  },
  {
    id: 'boss',
    label: 'boss',
    situation: 'A word from a manager and the afternoon belongs to that moment.',
    mechanism:
      'The reaction moves faster than thought. A tone of voice, a brief reply, a silence where approval was expected — and the nervous system responds as if safety itself is threatened. The boss did not cause this. They activated a belief that was already running.',
  },
  {
    id: 'money',
    label: 'money',
    situation: 'The number in the account creates the feeling of safety or fear.',
    mechanism:
      'When the number drops, a threat arrives — not from outside but from the interpretation inside. The mind has linked a bank balance to survival, to worth, to the right to exist without anxiety. The number is information. The fear is a story told on top of it.',
  },
  {
    id: 'partner',
    label: 'partner',
    situation: 'A tone. A silence. A look. The relationship becomes the weather.',
    mechanism:
      'The reaction arrives before the words are processed. Something in their voice activates something old in you — a need for reassurance, a fear of abandonment, a wound that has never fully closed. The partner did not create it. They touched it.',
  },
  {
    id: 'body',
    label: 'body',
    situation: 'Something in the body creates urgency, shame, or fear.',
    mechanism:
      'The mind layers a story onto a sensation. The sensation passes; the story lingers — building a future from a present moment, running toward diagnosis before the evidence exists. The body communicates. The mind narrates. They are not the same.',
  },
  {
    id: 'family',
    label: 'family',
    situation: 'Every visit pulls you back into who you were.',
    mechanism:
      'Old programming runs deeper than memory. The body knows its role before the mind has agreed to play it. Decades of conditioning does not dissolve when you leave the house. It waits. Proximity reactivates it — precisely, reliably, every time.',
  },
  {
    id: 'career',
    label: 'career',
    situation: 'The work becomes the measure of the self.',
    mechanism:
      'The identity needs constant proof. A promotion, a comparison, a project ignored — each feeds or threatens the story of who you are. Without achievement, the question surfaces beneath the surface: if this is taken away, who am I?',
  },
  {
    id: 'health',
    label: 'health',
    situation: 'A symptom creates a spiral.',
    mechanism:
      "The imagination runs further and faster than the doctor's report. Fear fills the space that certainty cannot reach. The mind builds a future from a present sensation and then lives inside that future as if it were already here.",
  },
  {
    id: 'child',
    label: 'child',
    situation: "A child's choices become evidence of your failures.",
    mechanism:
      'The child becomes a mirror held at an uncomfortable angle. Their struggles feel like proof of your inadequacy as a parent, a person, a guide. The love is real. But the fear beneath the love — the fear of failing them, of being seen as failing — that is the pattern running.',
  },
];

// ── Reveal panel — remounts on each new selection for a clean GSAP entrance ──

function RevealContent({ pattern }: { pattern: PatternEntry }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
    );
  }, []);

  return (
    <div ref={ref}>
      <span className="font-mono text-xs tracking-[0.3em] uppercase text-cream/35 mb-6 block">
        {pattern.label}
      </span>
      <blockquote
        className="font-serif italic text-cream leading-[1.1] mb-8"
        style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)' }}
      >
        &ldquo;{pattern.situation}&rdquo;
      </blockquote>
      <p className="font-sans text-base md:text-lg text-cream/55 leading-relaxed max-w-2xl mb-10">
        {pattern.mechanism}
      </p>
      <div className="border-t border-cream/10 pt-6">
        <p className="font-mono text-xs tracking-[0.28em] uppercase text-clay/70">
          The subject changes. The mechanism doesn&rsquo;t.
        </p>
      </div>
    </div>
  );
}

// ── Pulsing observer ring ────────────────────────────────────────────────────

function ObserverRing() {
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.pm-observer-ring', {
        scale: 2.8,
        opacity: 0,
        duration: 3,
        repeat: -1,
        stagger: 0.75,
        ease: 'power1.out',
        transformOrigin: '50% 50%',
      });
    }, svgRef);
    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      className="w-36 h-36 md:w-52 md:h-52 text-cream/15"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
      aria-hidden
    >
      <circle className="pm-observer-ring" cx="50" cy="50" r="8" />
      <circle className="pm-observer-ring" cx="50" cy="50" r="8" />
      <circle className="pm-observer-ring" cx="50" cy="50" r="8" />
      <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="50" cy="50" r="38" strokeDasharray="2 7" opacity="0.1" />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PatternMirrorPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.pm-blob-1', {
        x: 60,
        y: -40,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.pm-blob-2', {
        x: -50,
        y: 50,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.from('.pm-title-line', {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.2,
        stagger: 0.12,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      gsap.from('.pm-lede', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 60%',
          once: true,
        },
      });

      const chips = pageRef.current?.querySelectorAll('.pm-chip') ?? [];
      gsap.fromTo(
        chips,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.055,
          duration: 0.7,
          ease: 'power3.out',
          delay: 0.4,
          scrollTrigger: {
            trigger: chipsRef.current,
            start: 'top 95%',
            once: true,
          },
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  };

  const selectedPattern = PATTERNS.find((p) => p.id === selectedId) ?? null;

  return (
    <PageLayout briefSpectrum>
      <div ref={pageRef}>

        {/* ── Header ──────────────────────────────────────────── */}
        <section
          ref={headerRef}
          className="site-page-header relative w-full overflow-hidden px-6 pb-20 md:px-16 lg:px-24"
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="pm-blob-1 absolute top-[5%] left-[18%] w-[500px] h-[500px] rounded-full bg-clay/8 blur-[130px] will-change-transform" />
            <div className="pm-blob-2 absolute bottom-[10%] right-[8%] w-[450px] h-[450px] rounded-full bg-moss/10 blur-[110px] will-change-transform" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="max-w-5xl">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/40 mb-6 block">
                An observation
              </span>
              <h1
                className="font-serif italic leading-[1.08]"
                style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}
              >
                <span className="pm-title-line block text-charcoal">The Subject Changes.</span>
                <span className="pm-title-line block text-charcoal">The Pattern Remains.</span>
              </h1>
              <p className="pm-lede mt-10 text-charcoal/60 font-sans text-lg md:text-xl max-w-2xl leading-relaxed">
                Look closely at what disturbs your peace. Whether it arrives through an email, a
                relationship, a bank account, or a body sensation — the mechanism beneath is
                always the same.
              </p>
            </div>
          </div>
        </section>

        {/* ── Pattern Mirror ──────────────────────────────────── */}
        <section className="w-full px-6 md:px-16 lg:px-24 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">

            <div className="mb-12">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-cream/30 mb-4 block">
                The mechanism
              </span>
              <p
                className="font-serif italic text-cream/65 leading-snug"
                style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
              >
                Select what&rsquo;s on your mind right now.
              </p>
            </div>

            {/* Chip grid */}
            <div
              ref={chipsRef}
              className="flex flex-wrap gap-3 mb-16"
              role="group"
              aria-label="Life categories"
            >
              {PATTERNS.map((pattern) => {
                const isSelected = selectedId === pattern.id;
                return (
                  <button
                    key={pattern.id}
                    type="button"
                    className={[
                      'pm-chip inline-flex items-center px-5 py-2.5 rounded-full border font-mono text-xs uppercase tracking-[0.15em] cursor-pointer transition-all duration-300',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-cream/30',
                      isSelected
                        ? 'bg-cream/8 border-cream/35 text-cream'
                        : 'border-cream/15 text-cream/40 hover:border-cream/28 hover:text-cream/68',
                    ].join(' ')}
                    onClick={() => handleSelect(pattern.id)}
                    aria-pressed={isSelected}
                  >
                    {pattern.label}
                  </button>
                );
              })}
            </div>

            {/* Reveal panel */}
            <div
              className="min-h-[20rem] border-t border-cream/8 pt-12"
              aria-live="polite"
            >
              {selectedPattern ? (
                <RevealContent key={selectedId} pattern={selectedPattern} />
              ) : (
                <p
                  className="font-serif italic text-cream/18"
                  style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}
                >
                  Or notice which one your mind moved to first.
                </p>
              )}
            </div>

          </div>
        </section>

        {/* ── Reframe band ────────────────────────────────────── */}
        <section className="w-full bg-charcoal text-cream px-6 md:px-16 lg:px-24 py-24 md:py-32 rounded-t-[3rem]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

              <div>
                <span className="font-mono text-xs tracking-[0.3em] uppercase text-cream/30 mb-8 block">
                  The recognition
                </span>
                <h2
                  className="font-serif italic text-cream leading-[1.1] mb-8"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}
                >
                  If you can see the pattern,
                  <br />
                  you are not the pattern.
                </h2>
                <p
                  className="font-serif italic text-clay leading-[1.12] mb-10"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.8rem)' }}
                >
                  You are the one who sees it.
                </p>
                <p className="font-sans text-base text-cream/50 max-w-md leading-relaxed mb-10">
                  Separation begins the moment you notice the voice — not believe it. This is the
                  doorway{' '}
                  <em className="font-serif italic">Formless</em> points to.
                </p>
                <ParticleButton href="/book">Explore the book</ParticleButton>
              </div>

              <div className="flex items-center justify-center">
                <ObserverRing />
              </div>

            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
