import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

import { AccessLandscape } from '@/components/continuity-v2/AccessLandscape';
import { ArchiveLegend, AssetArchive } from '@/components/continuity-v2/AssetArchive';
import { AtlasMap } from '@/components/continuity-v2/AtlasMap';
import { BeginHere } from '@/components/continuity-v2/BeginHere';
import { DomainAsset } from '@/components/continuity-v2/DomainAsset';
import { FormlessEcosystem } from '@/components/continuity-v2/FormlessEcosystem';
import {
  ContinuityPrinciplesSection,
  HelpSituations,
} from '@/components/continuity-v2/PeopleAndCare';
import { RunningSystems } from '@/components/continuity-v2/RunningSystems';
import { SignalJourney } from '@/components/continuity-v2/SignalJourney';
import { SocialEcosystem } from '@/components/continuity-v2/SocialEcosystem';
import { WebsiteSystem } from '@/components/continuity-v2/WebsiteSystem';
import { EASE } from '@/components/continuity-v2/motion';
import { Reveal, SectionHeading } from '@/components/continuity-v2/primitives';
import { ShaderBackdrop } from '@/components/shader/ShaderBackdrop';
import { useAuth } from '@/context/AuthContext';
import {
  ATLAS_HEADLINE,
  ATLAS_INTRO,
  ATLAS_LEDE,
  CONTINUITY_PATHS,
  CONTINUITY_SECTIONS,
  type ContinuityPathId,
} from '@/data/continuityAtlas';
import logoWhiteSrc from '../../../design/eyes-closed-logo-variations/Final-logos/09a-white-ec-notagline.svg';

type SectionSpec = {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  body: ReactNode;
  wide?: boolean;
};

export function ContinuityV2() {
  const { user, signOut } = useAuth();
  const reduce = useReducedMotion();
  const [activeSection, setActiveSection] = useState<string>('atlas');
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroFade = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.06]);

  const jump = useCallback((sectionId: string) => {
    const target = document.getElementById(`section-${sectionId}`);
    if (!target) return;
    target.scrollIntoView({
      behavior:
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      block: 'start',
    });
    target.focus({ preventScroll: true });
  }, []);

  const sections = useMemo<SectionSpec[]>(
    () => [
      {
        id: 'atlas',
        eyebrow: 'The Continuity Map',
        title: 'An atlas of everything Eyes Closed is made of',
        lede: 'Eyes Closed sits at the centre. Around it are the four territories that keep it alive. Follow a path to see what connects to what.',
        body: <AtlasMap onJump={jump} />,
        wide: true,
      },
      {
        id: 'begin',
        eyebrow: 'Start of the path',
        title: 'Begin Here',
        body: <BeginHere onJump={jump} />,
      },
      {
        id: 'picture',
        eyebrow: 'The Big Picture',
        title: 'How Eyes Closed reaches someone',
        lede: 'One continuous journey, from the moment a person types the name to the systems that answer.',
        body: <SignalJourney />,
        wide: true,
      },
      {
        id: 'website',
        eyebrow: 'The Website',
        title: 'One live experience, four systems behind it',
        body: <WebsiteSystem />,
        wide: true,
      },
      {
        id: 'formless',
        eyebrow: 'The Work',
        title: 'Formless',
        lede: 'Who You Truly Are Beyond the Mind',
        body: <FormlessEcosystem />,
        wide: true,
      },
      {
        id: 'social',
        eyebrow: 'Social & Audience',
        title: 'How the work stays in touch',
        body: <SocialEcosystem />,
        wide: true,
      },
      {
        id: 'access',
        eyebrow: 'Access & Credentials',
        title: 'Where the keys are kept',
        body: <AccessLandscape />,
        wide: true,
      },
      {
        id: 'assets',
        eyebrow: 'Asset Library',
        title: 'The archive behind the brand',
        body: (
          <div>
            <AssetArchive />
            <Reveal className="mt-12 border-t border-cream/10 pt-7">
              <ArchiveLegend />
            </Reveal>
          </div>
        ),
        wide: true,
      },
      {
        id: 'domain',
        eyebrow: 'The Domain',
        title: 'One name, held carefully',
        body: <DomainAsset />,
        wide: true,
      },
      {
        id: 'running',
        eyebrow: 'What Keeps Running',
        title: 'What is holding Eyes Closed up',
        body: <RunningSystems />,
        wide: true,
      },
      {
        id: 'principles',
        eyebrow: 'Before a Major Change',
        title: 'Six things worth keeping steady',
        body: <ContinuityPrinciplesSection />,
        wide: true,
      },
      {
        id: 'help',
        eyebrow: 'Who Can Help',
        title: 'Who should I contact?',
        body: <HelpSituations />,
      },
    ],
    [jump],
  );

  useEffect(() => {
    const observed = CONTINUITY_SECTIONS.map((section) =>
      document.getElementById(`section-${section.id}`),
    ).filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id.replace('section-', ''));
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.2, 0.6] },
    );

    observed.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const activePath: ContinuityPathId =
    CONTINUITY_SECTIONS.find((section) => section.id === activeSection)?.path ?? 'understand';

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#080a09] font-sans text-cream antialiased">
      <ShaderBackdrop theme="forest" position="fixed" overlay={false} />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(8,10,9,0.72)_0%,rgba(8,10,9,0.94)_55%,#080a09_100%)]"
        aria-hidden
      />
      <div className="noise-overlay-dark" aria-hidden />

      <a
        href="#continuity-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-cream focus:px-4 focus:py-2 focus:text-sm focus:text-charcoal"
      >
        Skip to Continuity
      </a>

      <header className="relative z-30 border-b border-cream/10 backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-6 px-5 py-4 md:px-10 lg:px-14">
          <div className="flex items-center gap-4">
            <img src={logoWhiteSrc} alt="Eyes Closed" width={1929} height={865} className="h-7 w-auto" />
            <span className="hidden font-sans text-[12.5px] tracking-[0.24em] text-cream/40 sm:inline">
              CONTINUITY
            </span>
          </div>
          {user ? (
            <button
              type="button"
              onClick={() => {
                void signOut();
              }}
              className="min-h-11 cursor-pointer px-2 font-sans text-[13px] text-cream/55 underline-offset-4 transition-colors hover:text-cream hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70"
            >
              Sign out
            </button>
          ) : null}
        </div>
      </header>

      {/* Opening */}
      <section
        ref={heroRef}
        className="relative z-10 flex min-h-[88svh] items-center px-5 py-24 md:px-10 lg:px-14"
      >
        <motion.div
          className="mx-auto w-full max-w-[1560px]"
          style={reduce ? undefined : { y: heroY, opacity: heroFade, scale: heroScale }}
        >
          <div className="max-w-[46rem]">
            <motion.img
              src={logoWhiteSrc}
              alt="Eyes Closed"
              width={1929}
              height={865}
              className="h-11 w-auto md:h-14"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE }}
            />
            <motion.h1
              className="mt-12 font-sans text-[3.2rem] font-light leading-[0.94] tracking-[-0.05em] text-cream sm:text-[4.6rem] lg:text-[6rem]"
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: EASE }}
            >
              {ATLAS_HEADLINE}
            </motion.h1>
            <motion.p
              className="mt-8 max-w-[38ch] font-sans text-[1.15rem] leading-[1.5] tracking-[-0.015em] text-cream/80 md:text-[1.5rem]"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.28, ease: EASE }}
            >
              {ATLAS_LEDE}
            </motion.p>
            <motion.p
              className="mt-12 max-w-[54ch] border-l border-cream/20 pl-6 font-sans text-[1rem] leading-[1.85] text-cream/60 md:text-[1.08rem]"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.42, ease: EASE }}
            >
              {ATLAS_INTRO}
            </motion.p>

            <motion.div
              className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <button
                type="button"
                onClick={() => jump('begin')}
                className="group inline-flex min-h-11 cursor-pointer items-center gap-3 font-sans text-[15px] text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/70"
              >
                <span className="border-b border-cream/40 pb-1 transition-colors group-hover:border-cream">
                  Begin here
                </span>
                <span className="transition-transform duration-300 group-hover:translate-y-1" aria-hidden>
                  ↓
                </span>
              </button>
              <button
                type="button"
                onClick={() => jump('atlas')}
                className="group inline-flex min-h-11 cursor-pointer items-center gap-3 font-sans text-[15px] text-cream/60 transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/70"
              >
                <span className="border-b border-cream/20 pb-1 transition-colors group-hover:border-cream/60">
                  See the whole map
                </span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Four ways in */}
      <PathRailMobile activePath={activePath} onJump={jump} />

      <div className="relative z-10 mx-auto flex max-w-[1560px] gap-14 px-5 pb-32 md:px-10 lg:gap-20 lg:px-14">
        <PathRailDesktop activePath={activePath} activeSection={activeSection} onJump={jump} />

        <main id="continuity-main" className="min-w-0 flex-1" tabIndex={-1}>
          {sections.map((section) => (
            <section
              key={section.id}
              id={`section-${section.id}`}
              tabIndex={-1}
              aria-labelledby={`heading-${section.id}`}
              className="scroll-mt-24 border-t border-cream/8 py-24 first:border-0 first:pt-8 md:py-32"
            >
              <SectionHeading
                id={`heading-${section.id}`}
                eyebrow={section.eyebrow}
                title={section.title}
                lede={section.lede}
              />
              <div className={section.wide ? 'mt-14 md:mt-20' : 'mt-12 md:mt-16'}>{section.body}</div>
            </section>
          ))}

          <Reveal className="border-t border-cream/10 pt-14">
            <p className="max-w-[50ch] font-sans text-[1.2rem] leading-[1.6] tracking-[-0.02em] text-cream/75 md:text-[1.45rem]">
              I already organised this for you. Nothing here needs to be solved today.
            </p>
            <p className="mt-6 max-w-[56ch] font-sans text-[14px] leading-relaxed text-cream/45">
              Continuity holds orientation, ownership context, and where access is kept. It is
              deliberately not a vault: no passwords, keys, tokens, recovery codes, or secret values
              are stored in this page.
            </p>
          </Reveal>
        </main>
      </div>
    </div>
  );
}

function PathRailDesktop({
  activePath,
  activeSection,
  onJump,
}: {
  activePath: ContinuityPathId;
  activeSection: string;
  onJump: (section: string) => void;
}) {
  return (
    <nav
      aria-label="Continuity paths"
      className="sticky top-8 hidden h-fit w-[15.5rem] shrink-0 self-start pt-10 lg:block xl:w-[17.5rem]"
    >
      <p className="font-sans text-[10.5px] uppercase tracking-[0.34em] text-cream/30">
        Four ways in
      </p>
      <ol className="mt-7 flex flex-col gap-7">
        {CONTINUITY_PATHS.map((path) => {
          const isActive = path.id === activePath;
          const sections = CONTINUITY_SECTIONS.filter((section) => section.path === path.id);
          return (
            <li key={path.id}>
              <button
                type="button"
                onClick={() => onJump(sections[0]?.id ?? 'atlas')}
                className="group flex w-full cursor-pointer items-baseline gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/70"
                aria-current={isActive ? 'true' : undefined}
              >
                <span
                  className={`font-mono text-[10.5px] tracking-[0.2em] transition-colors ${
                    isActive ? 'text-cream/60' : 'text-cream/25'
                  }`}
                >
                  {path.index}
                </span>
                <span
                  className={`font-sans text-[15px] transition-colors ${
                    isActive ? 'text-cream' : 'text-cream/50 group-hover:text-cream/80'
                  }`}
                >
                  {path.label}
                </span>
              </button>
              <p
                className={`mt-2 pl-[1.9rem] font-sans text-[12px] leading-snug transition-colors duration-500 ${
                  isActive ? 'text-cream/45' : 'text-cream/25'
                }`}
              >
                {path.question}
              </p>
              <motion.ul
                className="overflow-hidden pl-[1.9rem]"
                initial={false}
                animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className="mt-3.5 flex flex-col gap-2 border-l border-cream/12 pl-4">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => onJump(section.id)}
                        className={`cursor-pointer text-left font-sans text-[12.5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/70 ${
                          activeSection === section.id
                            ? 'text-cream'
                            : 'text-cream/40 hover:text-cream/75'
                        }`}
                        aria-current={activeSection === section.id ? 'true' : undefined}
                      >
                        {section.label}
                      </button>
                    </li>
                  ))}
                </div>
              </motion.ul>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function PathRailMobile({
  activePath,
  onJump,
}: {
  activePath: ContinuityPathId;
  onJump: (section: string) => void;
}) {
  return (
    <nav
      aria-label="Continuity paths"
      className="sticky top-0 z-20 border-y border-cream/10 bg-[#080a09]/92 backdrop-blur-sm lg:hidden"
    >
      <ul className="flex gap-1 overflow-x-auto px-4 py-2">
        {CONTINUITY_PATHS.map((path) => {
          const first = CONTINUITY_SECTIONS.find((section) => section.path === path.id)?.id ?? 'atlas';
          const isActive = path.id === activePath;
          return (
            <li key={path.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onJump(first)}
                aria-current={isActive ? 'true' : undefined}
                className={`min-h-11 cursor-pointer whitespace-nowrap px-3.5 font-sans text-[13px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70 ${
                  isActive ? 'text-cream' : 'text-cream/45'
                }`}
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-cream/25">
                  {path.index}
                </span>
                <span className="ml-2">{path.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
