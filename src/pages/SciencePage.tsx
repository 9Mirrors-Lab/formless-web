import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageLayout } from '../components/PageLayout';
import { ParticleButton } from '../components/ParticleButton';
import { useContent, type ContentApi } from '@/context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

type Pillar = { label: string; hook: string; body: string };

const FALLBACK_PILLARS: Pillar[] = [
  {
    label: 'Perception',
    hook: 'Your brain is not showing you reality. It is building a prediction of what reality should be.',
    body: 'Neuroscience reveals that perception is constructed, not received. What you see is filtered through memory, expectation, and conditioning — a model refined over a lifetime.',
  },
  {
    label: 'Observation',
    hook: 'Conscious observation changes what is being observed.',
    body: 'The observer effect in quantum mechanics mirrors a deeper truth: awareness itself alters the pattern. The act of watching is never neutral.',
  },
  {
    label: 'Neuroplasticity',
    hook: 'The neural pathways of suffering can be interrupted: not by force, but by awareness.',
    body: 'Repeated patterns of thought create physical grooves in the brain. New attention creates new pathways. The structure of mind is not fixed.',
  },
];

function pillarsFromContent(api: ContentApi): Pillar[] {
  const items = api.listItems('science', 'pillars').flatMap((entry) => {
    const v = entry.value;
    const label = typeof v.label === 'string' ? v.label : '';
    const hook = typeof v.hook === 'string' ? v.hook : '';
    const body = typeof v.body === 'string' ? v.body : '';
    if (!label) return [];
    return [{ label, hook, body }];
  });
  return items.length ? items : FALLBACK_PILLARS;
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

const ORBIT_COMPONENTS = [OrbitPerception, OrbitObservation, OrbitNeuroplasticity];

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
      });

      gsap.utils.toArray<HTMLElement>('.sci-num').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 0.18,
            duration: 1.3,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

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
        <section className="relative z-10 w-full pt-44 pb-24 px-6 md:px-[72px] overflow-hidden">
          <div className="max-w-[1240px] mx-auto grid md:grid-cols-[1.4fr_1fr] gap-16 items-end">
            <div className="sci-hero-text">
              <span className="font-mono text-[11px] tracking-[0.24em] uppercase text-[#ECE9DD]/70 mb-7 block">
                {getText('science', 'header', 'eyebrow') || 'A quiet bridge'}
              </span>
              <h1 className="font-serif font-normal text-[clamp(44px,6.2vw,76px)] leading-[1.04] tracking-[-0.012em] text-[#ECE9DD]">
                {getText('science', 'header', 'title') ||
                  'A bridge for the part of you that needs to understand.'}
              </h1>
            </div>
            <div className="sci-hero-lede">
              <p className="font-serif text-[21px] leading-[1.55] text-[#ECE9DD]/70 mb-10">
                {getText('science', 'header', 'lede') ||
                  'The teaching does not depend on science. But for the mind that needs a rational foothold before it can let go. Here is one.'}
              </p>
              <div className="pt-6 border-t border-[#ECE9DD]/10 flex gap-10 flex-wrap">
                {pillars.map((p, i) => (
                  <div key={i} className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#CC5833]">
                      0{i + 1}
                    </span>
                    <span className="font-serif italic text-[15px] text-[#ECE9DD]/70">{p.label}</span>
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
          const Orbit = ORBIT_COMPONENTS[i % ORBIT_COMPONENTS.length];

          return (
            <section
              key={i}
              className="sci-pillar relative w-full overflow-hidden"
              style={{ minHeight: 720, padding: '120px 0 80px' }}
            >
              {/* Orbit art — bleeds off edge; annotations are inside the SVG */}
              <div
                className="sci-orbit pointer-events-none absolute inset-y-0"
                style={{
                  width: '78%',
                  opacity: 0.95,
                  ...(artRight ? { right: '-18%' } : { left: '-18%' }),
                }}
              >
                <Orbit />
              </div>

              {/* Pillar text */}
              <div
                className="sci-pillar-text relative z-10 px-6"
                style={{
                  maxWidth: 560,
                  ...(artRight
                    ? { marginLeft: 'max(72px, calc((100vw - 1240px) / 2 + 72px))' }
                    : {
                        marginLeft: 'auto',
                        marginRight: 'max(72px, calc((100vw - 1240px) / 2 + 72px))',
                      }),
                }}
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

                <p className="font-serif italic text-[#CC5833] text-[clamp(20px,2.2vw,24px)] leading-[1.38] mb-6">
                  {pillar.hook}
                </p>

                <p className="font-sans text-[15px] leading-[1.72] text-[#ECE9DD]/70">
                  {pillar.body}
                </p>
              </div>
            </section>
          );
        })}

        <div className="w-full border-t border-[#ECE9DD]/10" />

        {/* Closing band */}
        <section className="relative z-10 w-full px-6 md:px-[72px] py-36 text-center overflow-hidden">
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
              {getText('science', 'closing', 'eyebrow') || 'From understanding to being'}
            </span>
            <p className="font-serif font-normal text-[clamp(34px,5.2vw,60px)] leading-[1.12] text-[#ECE9DD] mb-12">
              {getText('science', 'closing', 'title_line1') || 'The map is not the territory.'}
              <br />
              <em className="text-[#CC5833] not-italic">
                {getText('science', 'closing', 'title_line2') || 'But it can point the way.'}
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
