import { useMemo, useState, type CSSProperties } from "react";

type TypePairing = {
  id: string;
  label: string;
  note: string;
  display: string;
  body: string;
  labelFace: string;
};

const TYPE_PAIRINGS: TypePairing[] = [
  {
    id: "crimson-jakarta",
    label: "Warm Crimson",
    note: "Chosen system. Crimson Text for titles; Jakarta for content.",
    display: '"Crimson Text", serif',
    body: '"Plus Jakarta Sans", sans-serif',
    labelFace: '"Plus Jakarta Sans", sans-serif',
  },
  {
    id: "brand-mixed",
    label: "Brand mixed",
    note: "Cormorant display + Jakarta body. Brand site default.",
    display: '"Cormorant Garamond", serif',
    body: '"Plus Jakarta Sans", sans-serif',
    labelFace: '"Plus Jakarta Sans", sans-serif',
  },
  {
    id: "soft-outfit",
    label: "Soft Outfit",
    note: "Cormorant titles with Outfit body; slightly rounder sans.",
    display: '"Cormorant Garamond", serif',
    body: '"Outfit", sans-serif',
    labelFace: '"Outfit", sans-serif',
  },
  {
    id: "companion",
    label: "Companion",
    note: "Cormorant + Bricolage. More character in body and CTA.",
    display: '"Cormorant Garamond", serif',
    body: '"Bricolage Grotesque", sans-serif',
    labelFace: '"Bricolage Grotesque", sans-serif',
  },
  {
    id: "all-serif",
    label: "All serif",
    note: "Compare density. Titles and body both Cormorant.",
    display: '"Cormorant Garamond", serif',
    body: '"Cormorant Garamond", serif',
    labelFace: '"Cormorant Garamond", serif',
  },
  {
    id: "all-sans",
    label: "All sans",
    note: "Compare overwhelm. Everything in Plus Jakarta Sans.",
    display: '"Plus Jakarta Sans", sans-serif',
    body: '"Plus Jakarta Sans", sans-serif',
    labelFace: '"Plus Jakarta Sans", sans-serif',
  },
];

export function SpeakerSheetTypeLab() {
  const [pairingId, setPairingId] = useState("crimson-jakarta");
  const pairing = useMemo(
    () => TYPE_PAIRINGS.find((p) => p.id === pairingId) ?? TYPE_PAIRINGS[0],
    [pairingId],
  );

  return (
    <section className="mt-16 border-t border-cream/10 pt-12">
      <header className="max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9fb5aa]">
          Type lab · live text
        </p>
        <h2 className="mt-3 font-serif text-3xl italic text-cream md:text-4xl">
          Try font pairings
        </h2>
        <p className="mt-4 text-base leading-relaxed text-cream/65">
          Real HTML text you can switch. Mixed pairings keep serif for display
          and sans for content so the sheet does not feel one-note. Use this to
          pick a system, then we bake it into the next PNG pass.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {TYPE_PAIRINGS.map((option) => {
          const active = option.id === pairing.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setPairingId(option.id)}
              className={[
                "rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
                active
                  ? "border-moss/50 bg-moss/20 text-[#c5d9ce]"
                  : "border-cream/15 text-cream/70 hover:border-cream/30 hover:text-cream",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 max-w-2xl text-sm text-cream/50">{pairing.note}</p>

      <div
        className="mt-8 overflow-hidden rounded-2xl border border-cream/10 bg-[#0a0c0b]"
        style={
          {
            ["--ss-display" as string]: pairing.display,
            ["--ss-body" as string]: pairing.body,
            ["--ss-label" as string]: pairing.labelFace,
          } as CSSProperties
        }
      >
        <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <aside className="border-b border-cream/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:border-cream/10">
            <img
              src="/assets/Soni-shot6.png"
              alt="Sonika Cottman"
              className="mx-auto h-28 w-28 rounded-full object-cover ring-1 ring-[#c4a574]/35"
            />
            <h3
              className="mt-5 text-center text-3xl italic leading-tight text-[#9fb5aa]"
              style={{ fontFamily: "var(--ss-display)" }}
            >
              Sonika Cottman
            </h3>
            <p
              className="mt-2 text-center text-[11px] uppercase tracking-[0.14em] text-cream/70"
              style={{ fontFamily: "var(--ss-label)" }}
            >
              Author | Speaker | Awareness Guide | HR Leader
            </p>
            <p
              className="mt-4 text-center text-sm leading-relaxed text-cream/60"
              style={{ fontFamily: "var(--ss-body)" }}
            >
              Helping people and organizations discover a more conscious way to
              lead, work, and live.
            </p>
            <img
              src="/book-covers/formless-ebook.jpg"
              alt="Formless book cover"
              className="mx-auto mt-6 w-28 rounded-sm shadow-lg shadow-black/40"
            />
            <p
              className="mt-6 text-center text-sm font-medium tracking-wide text-[#d4a574]"
              style={{ fontFamily: "var(--ss-label)" }}
            >
              BOOK SONIKA TO SPEAK
            </p>
            <p
              className="mt-3 text-center text-[11px] leading-relaxed text-cream/45"
              style={{ fontFamily: "var(--ss-body)" }}
            >
              eyesclosed.love · hello@eyesclosed.love
              <br />
              LinkedIn · YouTube · Instagram · Facebook
            </p>
          </aside>

          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.22em] text-[#c4a574]"
                style={{ fontFamily: "var(--ss-label)" }}
              >
                Bio
              </p>
              <p
                className="mt-2 text-sm leading-relaxed text-cream/75"
                style={{ fontFamily: "var(--ss-body)" }}
              >
                Sonika Cottman is an author, speaker, Awareness Guide, and Human
                Resources leader with more than 20 years of experience. Blending
                her leadership background with the transformative power of
                awareness, she helps audiences recognize the unconscious
                patterns that shape how they lead, work, and live. As the author
                of Formless and founder of Eyes Closed, Sonika inspires people
                to create lasting change, not by doing more, but by becoming
                more aware.
              </p>
            </div>

            <div className="border-t border-cream/10 pt-6">
              <p
                className="text-[10px] uppercase tracking-[0.22em] text-[#c4a574]"
                style={{ fontFamily: "var(--ss-label)" }}
              >
                Signature keynote
              </p>
              <h4
                className="mt-2 text-3xl italic text-cream"
                style={{ fontFamily: "var(--ss-display)" }}
              >
                Beyond the Mind
              </h4>
              <p
                className="mt-1 text-sm italic text-[#c4a574]/90"
                style={{ fontFamily: "var(--ss-display)" }}
              >
                A New Way to Lead, Work, and Live
              </p>
              <p
                className="mt-3 text-sm leading-relaxed text-cream/75"
                style={{ fontFamily: "var(--ss-body)" }}
              >
                Most of us unknowingly live from the outside in, allowing our
                outer circumstances, achievements, workplace pressures, and the
                constant activity of the mind shape how we show up day-to-day.
                In this inspiring keynote, Sonika explores how awareness helps
                us break free from unconscious patterns to reclaim our inner
                state, and live with greater clarity, resilience, and purpose.
              </p>
            </div>

            <div className="grid gap-6 border-t border-cream/10 pt-6 sm:grid-cols-2">
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.22em] text-[#c4a574]"
                  style={{ fontFamily: "var(--ss-label)" }}
                >
                  Speaking topics
                </p>
                <ol
                  className="mt-3 space-y-3 text-sm text-cream/75"
                  style={{ fontFamily: "var(--ss-body)" }}
                >
                  <li>
                    <span className="font-medium text-cream">
                      1. The Invisible Prison
                    </span>
                    <br />
                    How unconscious thoughts, beliefs, and conditioning keep us
                    living from the outside in.
                  </li>
                  <li>
                    <span className="font-medium text-cream">2. The Shift</span>
                    <br />
                    How awareness creates space to respond instead of react,
                    reclaiming our inner state.
                  </li>
                  <li>
                    <span className="font-medium text-cream">
                      3. Living Beyond the Mind
                    </span>
                    <br />
                    How to lead, work, and live from the inside out, with
                    greater clarity, resilience, and purpose.
                  </li>
                </ol>
              </div>
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.22em] text-[#c4a574]"
                  style={{ fontFamily: "var(--ss-label)" }}
                >
                  Key takeaways
                </p>
                <ul
                  className="mt-3 space-y-2 text-sm text-cream/75"
                  style={{ fontFamily: "var(--ss-body)" }}
                >
                  <li>Know Yourself Beyond the Mind</li>
                  <li>Live from the Inside Out</li>
                  <li>Lead with Presence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
