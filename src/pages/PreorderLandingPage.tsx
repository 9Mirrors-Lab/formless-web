import { useEffect } from 'react';

import { ParticleButton } from '@/components/ParticleButton';
import { IntroductionPlayer } from '@/components/preorder/IntroductionPlayer';
import type { PreorderAudience } from '@/config/preorderAccess';
import {
  PREORDER_COPY,
  PREORDER_COVER_HEIGHT,
  PREORDER_COVER_SRC,
  PREORDER_COVER_WIDTH,
  PREORDER_FACTS,
  PREORDER_INTRO_LABEL,
  PREORDER_WORDMARK_SRC,
  kindlePreorderHref,
} from '@/data/preorderLanding';
import { captureCtaClick } from '@/lib/analytics';

type PreorderLandingPageProps = {
  audience: PreorderAudience;
};

function CreamWordmark() {
  return (
    <a href="/" className="inline-flex items-center" aria-label="Eyes Closed home">
      <img
        src={PREORDER_WORDMARK_SRC}
        alt="Eyes Closed"
        width={1450}
        height={640}
        className="h-[6.5rem] w-auto mix-blend-multiply md:h-[6.9rem]"
      />
    </a>
  );
}

function DuskWordmark() {
  return (
    <a href="/" className="inline-flex items-center" aria-label="Eyes Closed home">
      <img
        src={PREORDER_WORDMARK_SRC}
        alt="Eyes Closed"
        width={1450}
        height={640}
        className="h-11 w-auto brightness-0 invert md:h-12"
      />
    </a>
  );
}

function FactStrip() {
  const cells = [PREORDER_FACTS.format, PREORDER_FACTS.price, PREORDER_FACTS.delivers] as const;

  return (
    <ul className="grid max-w-md grid-cols-3 border-y border-charcoal/12">
      {cells.map((cell, index) => (
        <li
          key={cell}
          className={[
            'py-3 text-center font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-charcoal/70 md:text-[11px]',
            index > 0 ? 'border-l border-charcoal/12' : '',
          ].join(' ')}
        >
          {cell}
        </li>
      ))}
    </ul>
  );
}

function StayCloseLanding() {
  const copy = PREORDER_COPY['stay-close'];
  const href = kindlePreorderHref();
  const trackLocation = 'preorder_stay_close';

  useEffect(() => {
    document.title = copy.documentTitle;
  }, [copy.documentTitle]);

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-cream text-charcoal">
      <div className="noise-overlay pointer-events-none absolute inset-0" aria-hidden />

      <header className="relative z-10 flex items-center px-6 pt-2 pb-1 md:px-16 lg:px-24">
        <CreamWordmark />
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 pb-16 md:grid-cols-2 md:gap-12 md:px-16 lg:gap-16 lg:px-24">
        <div className="max-w-xl md:order-2">
          <h1 className="text-charcoal">
            <span className="block font-serif text-[clamp(3.5rem,10vw,5.75rem)] italic leading-[0.9] tracking-[-0.03em]">
              {copy.title}
            </span>
            <span className="mt-4 block font-serif text-[1.45rem] font-normal not-italic leading-[1.22] text-charcoal/85 md:text-[1.75rem]">
              {copy.deck}
            </span>
          </h1>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-charcoal/65 md:text-lg">
            {copy.lede}
          </p>
          <div className="mt-8">
            <FactStrip />
          </div>
          <div className="mt-8">
            <ParticleButton
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              trackLocation={trackLocation}
              trackLabel={copy.preorderLabel}
            >
              {copy.preorderLabel}
            </ParticleButton>
          </div>
          <nav className="mt-12 flex flex-wrap gap-x-8 gap-y-3 font-serif text-lg italic text-charcoal/60">
            <a
              className="min-h-11 underline-offset-4 hover:text-charcoal hover:underline"
              href="/work"
              onClick={() => captureCtaClick('The Practice', '/work', trackLocation)}
            >
              The Practice
            </a>
            <a
              className="min-h-11 underline-offset-4 hover:text-charcoal hover:underline"
              href="/about"
              onClick={() => captureCtaClick('About', '/about', trackLocation)}
            >
              About
            </a>
            <a
              className="min-h-11 underline-offset-4 hover:text-charcoal hover:underline"
              href="/book"
              onClick={() => captureCtaClick('The book', '/book', trackLocation)}
            >
              The book
            </a>
          </nav>
        </div>

        <img
          src={PREORDER_COVER_SRC}
          alt="Cover of Formless by Sonika Cottman"
          width={PREORDER_COVER_WIDTH}
          height={PREORDER_COVER_HEIGHT}
          className="w-full max-w-[min(100%,18rem)] justify-self-start object-contain md:order-1 md:max-w-[20rem]"
        />
      </main>
    </div>
  );
}

function WaitlistThankYou() {
  const copy = PREORDER_COPY.waitlist;
  const href = kindlePreorderHref();
  const trackLocation = 'preorder_waitlist';
  const facts = `Coming ${PREORDER_FACTS.deliversFull}`;

  useEffect(() => {
    document.title = copy.documentTitle;
  }, [copy.documentTitle]);

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-x-hidden bg-[#1a1410] text-cream">
      <img
        src={PREORDER_COVER_SRC}
        alt=""
        width={PREORDER_COVER_WIDTH}
        height={PREORDER_COVER_HEIGHT}
        className="pointer-events-none absolute inset-0 h-full w-full scale-150 object-cover object-center opacity-55 blur-3xl"
        aria-hidden
      />
      <div className="noise-overlay-dark pointer-events-none absolute inset-0" aria-hidden />

      <header className="relative z-10 flex items-center px-6 pt-4 md:px-16 lg:px-24">
        <DuskWordmark />
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 pt-2 pb-10 text-center">
        <img
          src={PREORDER_COVER_SRC}
          alt="Cover of Formless by Sonika Cottman"
          width={PREORDER_COVER_WIDTH}
          height={PREORDER_COVER_HEIGHT}
          className="w-full max-w-[11.5rem] object-contain md:max-w-[13.5rem]"
        />

        <p className="mt-5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-cream/75 md:text-xs md:font-normal">
          {copy.relation}
        </p>

        <h1
          className="mt-2 max-w-[30ch] font-serif text-[clamp(1.7rem,5vw,2.55rem)] leading-[1.12] tracking-[-0.03em] text-cream italic"
          style={{ textShadow: '0 4px 30px rgba(0,0,0,.9), 0 2px 10px rgba(0,0,0,.7)' }}
        >
          {copy.title}
        </h1>

        <p className="mt-3 max-w-md font-sans text-base leading-relaxed text-cream">
          {copy.lede}
        </p>

        <div className="mt-6 w-full max-w-sm">
          <IntroductionPlayer tone="dusk" layout="orb" label={PREORDER_INTRO_LABEL} />
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 min-h-11 font-serif text-lg text-cream italic underline-offset-4 hover:underline"
          onClick={() => captureCtaClick(copy.preorderLabel, href, trackLocation)}
        >
          {copy.deck}
        </a>
        <p className="mt-2 font-sans text-[10px] font-medium tracking-[0.18em] text-cream/75 uppercase">
          {facts}
        </p>

        <nav className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 font-serif text-lg text-cream/80 italic">
          <a
            className="min-h-11 underline-offset-4 hover:text-cream hover:underline"
            href="/work"
            onClick={() => captureCtaClick('The Practice', '/work', trackLocation)}
          >
            The Practice
          </a>
          <a
            className="min-h-11 underline-offset-4 hover:text-cream hover:underline"
            href="/about"
            onClick={() => captureCtaClick('About', '/about', trackLocation)}
          >
            About
          </a>
          <a
            className="min-h-11 underline-offset-4 hover:text-cream hover:underline"
            href="/book"
            onClick={() => captureCtaClick('The book', '/book', trackLocation)}
          >
            The book
          </a>
        </nav>
      </main>
    </div>
  );
}

export default function PreorderLandingPage({ audience }: PreorderLandingPageProps) {
  if (audience === 'waitlist') {
    return <WaitlistThankYou />;
  }
  return <StayCloseLanding />;
}
