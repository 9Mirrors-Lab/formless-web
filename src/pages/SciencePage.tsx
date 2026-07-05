import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageLayout } from '../components/PageLayout';
import { ParticleButton } from '../components/ParticleButton';
import { useContent, type ContentApi } from '@/context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

type Pillar = { label: string; hook: string; body: string; keywords?: string[] };

const PILLAR_DISPLAY_ORDER = ['Perception', 'Neuroplasticity', 'The Body', 'Consciousness'];

function sortPillars(items: Pillar[]): Pillar[] {
  return [...items].sort((a, b) => {
    const ai = PILLAR_DISPLAY_ORDER.indexOf(a.label);
    const bi = PILLAR_DISPLAY_ORDER.indexOf(b.label);
    const aOrder = ai === -1 ? PILLAR_DISPLAY_ORDER.length : ai;
    const bOrder = bi === -1 ? PILLAR_DISPLAY_ORDER.length : bi;
    return aOrder - bOrder;
  });
}

const FALLBACK_PILLARS: Pillar[] = [
  {
    label: 'Perception',
    hook:
      "You don't experience life exactly as it is.\nYou experience life through the lens of memory, conditioning, beliefs, and past experiences.",
    body:
      'Your brain constantly filters and interprets information, creating a version of reality based on what it has learned.\n\nAwareness allows you to notice the lens.\n\nWhen you see the lens, you are no longer identified with it.',
  },
  {
    label: 'Neuroplasticity',
    hook: 'Your brain is not fixed.',
    body:
      "Every thought you repeatedly believe strengthens neural pathways. Likewise, every moment of awareness weakens them and begins creating new ones.\n\nThe patterns you've lived with for years are not permanent.\n\nChange begins the moment you stop identifying with them.",
  },
  {
    label: 'The Body',
    hook:
      "Your experiences don't live only in memory.\nYour nervous system and body learn emotional patterns through repetition and memorize them.",
    keywords: ['Stress', 'Fear', 'Worry', 'Safety', 'Joy', 'Love', 'Presence'],
    body:
      'Your body is always listening.\n\nAwareness allows those unconscious patterns to become conscious.',
  },
  {
    label: 'Consciousness',
    hook:
      "Science continues asking one of humanity's oldest questions:\nWhat is consciousness?",
    body:
      'Some theories suggest consciousness emerges from the brain.\nOthers explore whether consciousness is more fundamental than matter itself.\n\nRegardless of where science eventually lands, your own experience offers something immediate.\n\nThoughts come and go.\nEmotions come and go.\nSensations come and go.\n\nYet something remains aware of all of them.\n\nThat is the place this practice begins.',
  },
];

function pillarsFromContent(api: ContentApi): Pillar[] {
  const items = api.listItems('science', 'pillars').flatMap((entry) => {
    const v = entry.value;
    const label = typeof v.label === 'string' ? v.label : '';
    const hook = typeof v.hook === 'string' ? v.hook : '';
    const body = typeof v.body === 'string' ? v.body : '';
    const keywords = Array.isArray(v.keywords)
      ? v.keywords.filter((word): word is string => typeof word === 'string')
      : undefined;
    if (!label) return [];
    return [{ label, hook, body, keywords }];
  });
  return sortPillars(items.length ? items : FALLBACK_PILLARS);
}

// ── Orbit SVGs ──────────────────────────────────────────────────────────────
// Annotations are embedded inside the SVG at the exact dot coordinates so they
// are always correctly placed regardless of container size or aspect ratio.

function AnnoBadge({
  dotX, dotY,
  bx, by,
  keyChar,
  label,
  textLeft = false,
}: {
  dotX: number; dotY: number;
  bx: number; by: number;
  keyChar: string;
  label: string;
  textLeft?: boolean;
}) {
  const r = 11;
  // Approximate char width at 13px Cormorant (wide serif)
  const tw = label.length * 7.6;
  const gap = 4;
  const rectX = textLeft ? bx - r - gap - tw : bx + r + gap;
  const textX = textLeft ? bx - r - gap : bx + r + gap;
  const textAnchor = textLeft ? 'end' : 'start';

  return (
    <g>
      {/* Connector from badge to the notable dot */}
      <line
        x1={bx} y1={by}
        x2={dotX} y2={dotY}
        stroke="#CC5833" strokeWidth={0.6} strokeOpacity={0.38}
        strokeDasharray="2 5"
      />
      {/* Label backdrop */}
      <rect
        x={textLeft ? rectX - 2 : rectX}
        y={by - 9}
        width={tw + 4}
        height={17}
        rx={2}
        fill="rgba(7,9,10,0.58)"
      />
      {/* Badge circle */}
      <circle cx={bx} cy={by} r={r} fill="rgba(7,9,10,0.82)" stroke="#CC5833" strokeWidth={0.9} />
      <text
        x={bx} y={by + 3.5}
        textAnchor="middle"
        fill="#CC5833"
        fontFamily="ui-monospace, monospace"
        fontSize={8.5}
        fontWeight={600}
      >
        {keyChar}
      </text>
      {/* Label text */}
      <text
        x={textX}
        y={by + 4}
        textAnchor={textAnchor}
        fill="rgba(236,233,221,0.82)"
        fontFamily="'Cormorant Garamond', serif"
        fontSize={13}
        fontStyle="italic"
      >
        {label}
      </text>
    </g>
  );
}

// Perception (800 × 700 viewBox)
// Notable dots:
//   Clay at (775, 350) — rightmost point of main orbital = prediction output
//   Clay at (400,  76) — top of vertical ellipse = expectation/memory input
function OrbitPerception() {
  return (
    <svg viewBox="0 0 800 700" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="400" cy="350" rx="375" ry="108" fill="none" stroke="#9FB5AA" strokeWidth="0.8" opacity="0.30" />
      <ellipse cx="400" cy="350" rx="272" ry="152" fill="none" stroke="#9FB5AA" strokeWidth="0.8" opacity="0.24" transform="rotate(32 400 350)" />
      <ellipse cx="400" cy="350" rx="148" ry="274" fill="none" stroke="#9FB5AA" strokeWidth="0.8" opacity="0.20" />
      <circle cx="400" cy="350" r="42" fill="none" stroke="#9FB5AA" strokeWidth="1" opacity="0.45" />
      <circle cx="400" cy="350" r="16" fill="#9FB5AA" opacity="0.12" />
      {/* Notable dots */}
      <circle cx="775" cy="350" r="5" fill="#CC5833" opacity="0.85" />
      <circle cx="568" cy="162" r="4" fill="#9FB5AA" opacity="0.60" />
      <circle cx="400" cy="76" r="4" fill="#CC5833" opacity="0.70" />
      <line x1="400" y1="350" x2="775" y2="350" stroke="#CC5833" strokeWidth="0.6" strokeDasharray="4 9" opacity="0.28" />
      <line x1="400" y1="350" x2="400" y2="76" stroke="#9FB5AA" strokeWidth="0.6" strokeDasharray="4 9" opacity="0.20" />
      <line x1="400" y1="350" x2="568" y2="162" stroke="#9FB5AA" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.18" />
      {/* Annotation A — badge offset left+up from dot (775,350), text flows left */}
      <AnnoBadge dotX={775} dotY={350} bx={650} by={300} keyChar="A" label="Prediction layer" textLeft />
      {/* Annotation B — badge offset right+down from dot (400,76), text flows right */}
      <AnnoBadge dotX={400} dotY={76} bx={446} by={116} keyChar="B" label="Expectation bias" />
    </svg>
  );
}

// Observation (800 × 700 viewBox)
// Notable dots:
//   Clay at (268, 350) — left wave source = conscious observer
//   Clay at (400, 182) — top interference peak = observation alters pattern
function OrbitObservation() {
  const rings = [72, 144, 216, 288, 360];
  return (
    <svg viewBox="0 0 800 700" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {rings.map((r, i) => (
        <circle key={`l${i}`} cx={268} cy={350} r={r} fill="none" stroke="#9FB5AA" strokeWidth="0.7" opacity={0.27 - i * 0.04} />
      ))}
      {rings.map((r, i) => (
        <circle key={`r${i}`} cx={532} cy={350} r={r} fill="none" stroke="#9FB5AA" strokeWidth="0.7" opacity={0.27 - i * 0.04} />
      ))}
      <line x1="400" y1="0" x2="400" y2="700" stroke="#9FB5AA" strokeWidth="0.6" strokeDasharray="3 10" opacity="0.18" />
      {/* Notable dots */}
      <circle cx={268} cy={350} r="6" fill="#CC5833" opacity="0.90" />
      <circle cx={532} cy={350} r="6" fill="#CC5833" opacity="0.90" />
      <circle cx="400" cy="182" r="4.5" fill="#CC5833" opacity="0.75" />
      <circle cx="400" cy="518" r="3" fill="#9FB5AA" opacity="0.45" />
      {/* Annotation A — badge right+up from dot (268,350), text flows right */}
      <AnnoBadge dotX={268} dotY={350} bx={310} by={306} keyChar="A" label="Conscious observer" />
      {/* Annotation B — badge right+down from dot (400,182), text flows right */}
      <AnnoBadge dotX={400} dotY={182} bx={444} by={214} keyChar="B" label="Alters the pattern" />
    </svg>
  );
}

// Neuroplasticity (800 × 740 viewBox)
// Notable clay dots (i % 4 === 0):
//   i=0 → (580, 210) upper-right branch = established / habitual pathway
//   i=4 → (155, 375) left branch        = new pathway forming
function OrbitNeuroplasticity() {
  const cx = 400;
  const cy = 370;
  const branches: [number, number][] = [
    [580, 210], [645, 375], [560, 545],
    [225, 210], [155, 375], [250, 545],
    [400, 135], [400, 610],
  ];
  const secondary: [number, number, number, number][] = [
    [580, 210, 700, 130], [580, 210, 655, 272],
    [225, 210, 112, 138], [225, 210, 158, 280],
    [645, 375, 760, 330], [155, 375, 40, 330],
  ];
  return (
    <svg viewBox="0 0 800 740" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx={cx} cy={cy} r="228" fill="none" stroke="#9FB5AA" strokeWidth="0.6" strokeDasharray="2 12" opacity="0.14" />
      {branches.map(([x2, y2], i) => (
        <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="#9FB5AA" strokeWidth="0.9" opacity="0.30" />
      ))}
      {secondary.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9FB5AA" strokeWidth="0.65" opacity="0.20" />
      ))}
      {branches.map(([bx, by], i) => (
        <circle key={i} cx={bx} cy={by} r={i % 3 === 0 ? 5 : 3.5} fill={i % 4 === 0 ? '#CC5833' : '#9FB5AA'} opacity="0.70" />
      ))}
      <circle cx="700" cy="130" r="3" fill="#9FB5AA" opacity="0.40" />
      <circle cx="655" cy="272" r="2.5" fill="#9FB5AA" opacity="0.35" />
      <circle cx="112" cy="138" r="3" fill="#CC5833" opacity="0.50" />
      <circle cx="158" cy="280" r="2.5" fill="#9FB5AA" opacity="0.35" />
      <circle cx="760" cy="330" r="2.5" fill="#9FB5AA" opacity="0.30" />
      <circle cx="40" cy="330" r="2.5" fill="#9FB5AA" opacity="0.30" />
      <circle cx={cx} cy={cy} r="13" fill="none" stroke="#9FB5AA" strokeWidth="1" opacity="0.50" />
      <circle cx={cx} cy={cy} r="5" fill="#9FB5AA" opacity="0.38" />
      {/* Annotation A — badge left+up from dot (580,210), text flows left */}
      <AnnoBadge dotX={580} dotY={210} bx={534} by={174} keyChar="A" label="Established groove" textLeft />
      {/* Annotation B — badge right+up from dot (155,375), text flows right */}
      <AnnoBadge dotX={155} dotY={375} bx={198} by={338} keyChar="B" label="New pathway forming" />
    </svg>
  );
}

// Consciousness (800 × 700 viewBox)
// Central awareness with passing phenomena orbiting outward
function OrbitConsciousness() {
  const cx = 400;
  const cy = 350;
  return (
    <svg viewBox="0 0 800 700" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx={cx} cy={cy} r="248" fill="none" stroke="#9FB5AA" strokeWidth="0.6" strokeDasharray="2 12" opacity="0.14" />
      <circle cx={cx} cy={cy} r="168" fill="none" stroke="#9FB5AA" strokeWidth="0.7" opacity="0.22" />
      <circle cx={cx} cy={cy} r="92" fill="none" stroke="#9FB5AA" strokeWidth="0.8" opacity="0.28" />
      <ellipse cx={cx} cy={cy} rx="300" ry="88" fill="none" stroke="#9FB5AA" strokeWidth="0.7" opacity="0.18" transform="rotate(-18 400 350)" />
      <ellipse cx={cx} cy={cy} rx="300" ry="88" fill="none" stroke="#9FB5AA" strokeWidth="0.7" opacity="0.18" transform="rotate(24 400 350)" />
      {[
        [620, 210],
        [705, 350],
        [620, 490],
        [180, 490],
        [95, 350],
        [180, 210],
      ].map(([x, y], i) => (
        <g key={i}>
          <line x1={cx} y1={cy} x2={x} y2={y} stroke="#9FB5AA" strokeWidth="0.55" opacity="0.16" strokeDasharray="3 8" />
          <circle cx={x} cy={y} r={i % 2 === 0 ? 4 : 3} fill={i % 2 === 0 ? '#CC5833' : '#9FB5AA'} opacity="0.62" />
        </g>
      ))}
      <circle cx={cx} cy={cy} r="18" fill="none" stroke="#CC5833" strokeWidth="1" opacity="0.55" />
      <circle cx={cx} cy={cy} r="7" fill="#CC5833" opacity="0.82" />
      <AnnoBadge dotX={180} dotY={490} bx={118} by={548} keyChar="A" label="Phenomena pass" textLeft />
      <AnnoBadge dotX={cx} dotY={cy} bx={462} by={318} keyChar="B" label="Awareness remains" />
    </svg>
  );
}

const ORBIT_BY_LABEL: Record<string, typeof OrbitPerception> = {
  Perception: OrbitPerception,
  Neuroplasticity: OrbitNeuroplasticity,
  'The Body': OrbitObservation,
  Consciousness: OrbitConsciousness,
  Observation: OrbitObservation,
};

const ORBIT_COMPONENTS = [OrbitPerception, OrbitNeuroplasticity, OrbitObservation, OrbitConsciousness];

const GRAIN_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='ng'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23ng)'/%3E%3C/svg%3E")`;

export default function SciencePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const content = useContent();
  const { getText, getLink } = content;
  const pillars = pillarsFromContent(content);
  const ctaWork = getLink('science', 'closing', 'cta_work');
  const ctaBook = getLink('science', 'closing', 'cta_book');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.sci-hero-text',
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.25 },
      );
      gsap.fromTo(
        '.sci-hero-lede',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.5 },
      );

      gsap.utils.toArray<HTMLElement>('.sci-orbit').forEach((el) => {
        gsap.to(el, {
          y: -55,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('.sci-pillar') as Element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.8,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.sci-pillar-text').forEach((el) => {
        const num = el.querySelector<HTMLElement>('.sci-num');

        gsap.fromTo(
          el,
          { y: 38, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          },
        );

        if (num) {
          gsap.fromTo(
            num,
            { opacity: 0 },
            {
              opacity: 0.18,
              duration: 1.3,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 80%', once: true },
            },
          );
        }
      });

      ScrollTrigger.refresh();

      gsap.utils.toArray<HTMLElement>('.sci-num').forEach((num) => {
        const rect = num.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          gsap.set(num, { opacity: 0.18 });
        }
      });
    }, pageRef);
    return () => ctx.revert();
  }, [pillars.length]);

  return (
    <PageLayout briefSpectrum>
      <div ref={pageRef} className="relative overflow-hidden">
        {/* Grain */}
        <div
          className="pointer-events-none fixed inset-0 z-0 mix-blend-soft-light opacity-[0.09]"
          style={{ backgroundImage: GRAIN_URL }}
          aria-hidden
        />

        {/* Radial washes */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(circle at 18% 8%,  rgba(159,181,170,0.12), transparent 36%),
              radial-gradient(circle at 82% 22%, rgba(204,88,51,0.10), transparent 32%),
              radial-gradient(circle at 50% 100%, rgba(159,181,170,0.06), transparent 50%)
            `,
          }}
          aria-hidden
        />

        {/* Hero */}
        <section className="site-page-header relative z-10 w-full overflow-hidden px-6 pb-14 md:pb-16 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[1.4fr_1fr] gap-16 items-end">
            <div className="sci-hero-text">
              <span className="font-mono text-[11px] tracking-[0.24em] uppercase text-[#ECE9DD]/70 mb-7 block">
                {getText('science', 'header', 'eyebrow') || 'Two Languages One Truth'}
              </span>
              <h1 className="font-serif font-normal text-[clamp(44px,6.2vw,76px)] leading-[1.04] tracking-[-0.012em] text-[#ECE9DD]">
                {getText('science', 'header', 'title') ||
                  'A bridge for the part of you that needs to understand.'}
              </h1>
            </div>
            <div className="sci-hero-lede">
              <p className="font-serif text-[21px] leading-[1.55] text-[#ECE9DD] mb-5">
                {getText('science', 'header', 'intro') ||
                  'The deepest truths about who you are do not require belief.'}
              </p>
              <p className="font-serif text-[21px] leading-[1.55] text-[#ECE9DD]/70 mb-10">
                {getText('science', 'header', 'lede') ||
                  'The teaching does not depend on science. But for the mind that needs a rational foothold before it can let go. Here is one.'}
              </p>
              <div className="pt-6 border-t border-[#ECE9DD]/10 flex flex-nowrap items-baseline justify-between gap-3 md:gap-4">
                {pillars.map((p, i) => (
                  <div key={i} className="flex shrink-0 items-baseline gap-2 whitespace-nowrap">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#CC5833]">
                      0{i + 1}
                    </span>
                    <span className="font-serif italic text-[13px] md:text-[14px] text-[#ECE9DD]/70">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="w-full border-t border-[#ECE9DD]/10" />

        {/* Pillar sections */}
        {pillars.map((pillar, i) => {
          const artRight = i % 2 === 0;
          const Orbit = ORBIT_BY_LABEL[pillar.label] ?? ORBIT_COMPONENTS[i % ORBIT_COMPONENTS.length];

          return (
            <section
              key={i}
              className={`sci-pillar relative w-full overflow-hidden${i === 0 ? ' sci-pillar--tight-next' : ''}${i === 1 ? ' sci-pillar--tight-prev' : ''}`}
            >
              <div
                className={`sci-orbit pointer-events-none absolute ${artRight ? 'sci-orbit--right' : 'sci-orbit--left'}`}
              >
                <Orbit />
              </div>

              {/* Pillar text */}
              <div className="relative z-10 w-full px-6 md:px-16 lg:px-24">
                <div className="max-w-6xl mx-auto">
                  <div
                    className={`sci-pillar-text max-w-[560px] ${artRight ? '' : 'ml-auto'}`}
                  >
                    <div
                      className="sci-num font-mono font-medium text-[#ECE9DD] leading-[0.9] mb-2 select-none"
                      style={{ fontSize: 110, letterSpacing: '-0.04em', opacity: 0 }}
                    >
                      0{i + 1}
                    </div>

                    <div className="font-mono text-[11px] tracking-[0.20em] uppercase text-[#ECE9DD]/62 mb-6">
                      {pillar.label}
                    </div>

                    <p className="font-serif italic text-[#CC5833] text-[clamp(20px,2.2vw,24px)] leading-[1.38] mb-6 whitespace-pre-line">
                      {pillar.hook}
                    </p>

                    {pillar.keywords?.length ? (
                      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#ECE9DD]/55 mb-6 flex flex-wrap gap-x-4 gap-y-2">
                        {pillar.keywords.map((word) => (
                          <span key={word}>{word}</span>
                        ))}
                      </p>
                    ) : null}

                    <p className="font-sans text-[15px] leading-[1.72] text-[#ECE9DD]/70 whitespace-pre-line">
                      {pillar.body}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        <div className="w-full border-t border-[#ECE9DD]/10" />

        {/* Closing band */}
        <section className="relative z-10 w-full px-6 md:px-16 lg:px-24 py-24 md:py-28 text-center overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 28% 42%, rgba(204,88,51,0.09), transparent 44%),
                radial-gradient(circle at 72% 58%, rgba(159,181,170,0.08), transparent 44%)
              `,
            }}
            aria-hidden
          />
          <div className="relative max-w-[880px] mx-auto">
            <span className="font-mono text-[11px] tracking-[0.24em] uppercase text-[#ECE9DD]/55 mb-7 block">
              {getText('science', 'closing', 'eyebrow') ||
                'Science points to what the ancient teachings have known.'}
            </span>
            <p className="font-serif font-normal text-[clamp(34px,5.2vw,60px)] leading-[1.12] text-[#ECE9DD] mb-12 whitespace-pre-line">
              {getText('science', 'closing', 'title_line1') ||
                "You are not the mind's\ninterpretation of reality."}
              <br />
              <em className="text-[#CC5833] not-italic">
                {getText('science', 'closing', 'title_line2') || 'You are the awareness that sees it.'}
              </em>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <ParticleButton href={ctaWork.href || '/work'}>
                {ctaWork.text || 'Work with me'}
              </ParticleButton>
              <ParticleButton href={ctaBook.href || '/book'} variant="secondary">
                {ctaBook.text || 'Get the book'}
              </ParticleButton>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
