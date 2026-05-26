import {
  ArrowLeft,
  ArrowUpRight,
  CircleDashed,
  Image as ImageIcon,
  Layers3,
  MousePointer2,
  Palette,
  Pause,
  Sparkles,
  Type,
  Waves,
  X,
} from "lucide-react";

import {
  AVOID_NOTES,
  COLOR_SWATCHES,
  IMAGE_REFERENCES,
  INTERACTION_CUES,
  INTERFACE_NOTES,
  MOODBOARD_SECTIONS,
  MOOD_KEYWORDS,
  MOTION_NOTES,
  SPATIAL_DIRECTIONS,
  TEXTURE_NOTES,
  TYPOGRAPHY_DIRECTIONS,
  type ImageReference,
} from "@/data/moodboardContent";

function slugFor(label: string) {
  return label.toLowerCase().replaceAll(" ", "-").replace("&", "and");
}

function TorusFieldStudy({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className="moodboard-field-art h-full w-full"
      viewBox="0 0 560 460"
      fill="none"
      aria-hidden="true"
    >
      <rect width="560" height="460" fill="#050806" />
      <path
        d="M0 320C90 270 154 282 236 314c97 38 171 10 324-124"
        stroke="#9FB5AA"
        strokeOpacity="0.14"
      />
      <path
        d="M0 360C104 304 164 318 249 351c102 40 181 7 311-113"
        stroke="#F2F0E9"
        strokeOpacity="0.08"
      />
      <g className="moodboard-spin-slow" strokeLinecap="round">
        <ellipse
          cx="280"
          cy="216"
          rx={compact ? 138 : 184}
          ry={compact ? 42 : 58}
          stroke="#9FB5AA"
          strokeOpacity="0.38"
        />
        <ellipse
          cx="280"
          cy="216"
          rx={compact ? 160 : 212}
          ry={compact ? 58 : 78}
          stroke="#CC5833"
          strokeDasharray="2 13"
          strokeOpacity="0.52"
          transform="rotate(18 280 216)"
        />
        <ellipse
          cx="280"
          cy="222"
          rx={compact ? 60 : 78}
          ry={compact ? 156 : 210}
          stroke="#F2F0E9"
          strokeDasharray="1 16"
          strokeOpacity="0.2"
          transform="rotate(-27 280 222)"
        />
      </g>
      <g className="moodboard-drift">
        {Array.from({ length: compact ? 24 : 42 }).map((_, index) => {
          const angle = index * 0.67;
          const radius = compact ? 72 + index * 3 : 90 + index * 4;
          const x = 314 + Math.cos(angle) * radius;
          const y = 94 + index * (compact ? 7.5 : 6.8) + Math.sin(angle) * 22;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={index % 5 === 0 ? 2.6 : 1.25}
              fill={index % 6 === 0 ? "#CC5833" : "#F2F0E9"}
              opacity={0.22 + (index % 6) * 0.08}
            />
          );
        })}
      </g>
    </svg>
  );
}

function VisualReference({ reference, index }: { reference: ImageReference; index: number }) {
  return (
    <article
      className={`moodboard-plate group ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
    >
      <div className="moodboard-plate-media" role="img" aria-label={reference.title}>
        {reference.visual === "torus-body" ? <TorusFieldStudy /> : null}
        {reference.visual === "particle-field" ? <ParticleStudy /> : null}
        {reference.visual === "fog-clarity" ? <FogStudy /> : null}
        {reference.visual === "manuscript" ? <ManuscriptStudy /> : null}
        {reference.visual === "cosmic-cell" ? <ScaleStudy /> : null}
      </div>
      <div className="moodboard-plate-copy">
        <span className="font-mono text-xs text-[#9FB5AA]">0{index + 1}</span>
        <h3>{reference.title}</h3>
        <p>{reference.caption}</p>
        <small>{reference.usage}</small>
      </div>
    </article>
  );
}

function ParticleStudy() {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 320" fill="none" aria-hidden="true">
      <rect width="420" height="320" fill="#080D09" />
      {Array.from({ length: 6 }).map((_, index) => (
        <ellipse
          key={index}
          cx="210"
          cy="160"
          rx={72 + index * 28}
          ry={20 + index * 9}
          stroke={index % 2 ? "#CC5833" : "#9FB5AA"}
          strokeOpacity={0.16 + index * 0.04}
          transform={`rotate(${index * 19} 210 160)`}
        />
      ))}
      {Array.from({ length: 52 }).map((_, index) => {
        const angle = index * 0.55;
        const radius = 26 + index * 2.4;
        return (
          <circle
            key={index}
            cx={210 + Math.cos(angle) * radius}
            cy={160 + Math.sin(angle * 1.4) * radius * 0.4}
            r={index % 8 === 0 ? 2.5 : 1.2}
            fill={index % 5 === 0 ? "#CC5833" : "#F2F0E9"}
            opacity={0.18 + (index % 6) * 0.08}
          />
        );
      })}
    </svg>
  );
}

function FogStudy() {
  return (
    <div className="moodboard-fog-study">
      <span>noise</span>
      <strong>clarity</strong>
    </div>
  );
}

function ManuscriptStudy() {
  return (
    <div className="moodboard-manuscript-study">
      <p className="font-serif text-5xl italic">pause</p>
      <span />
      <span />
      <span />
      <small>margin notes / fragments / living manuscript</small>
    </div>
  );
}

function ScaleStudy() {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 320" fill="none" aria-hidden="true">
      <rect width="420" height="320" fill="#050806" />
      <circle cx="210" cy="160" r="92" fill="#9FB5AA" opacity="0.08" />
      <circle cx="210" cy="160" r="42" fill="#CC5833" opacity="0.13" />
      <circle cx="210" cy="160" r="11" fill="#F2F0E9" opacity="0.66" />
      {Array.from({ length: 34 }).map((_, index) => {
        const angle = (Math.PI * 2 * index) / 34;
        const radius = 48 + Math.sin(index) * 44;
        return (
          <g key={index}>
            <line
              x1="210"
              y1="160"
              x2={210 + Math.cos(angle) * radius}
              y2={160 + Math.sin(angle) * radius}
              stroke="#F2F0E9"
              strokeOpacity="0.08"
            />
            <circle
              cx={210 + Math.cos(angle) * radius}
              cy={160 + Math.sin(angle) * radius}
              r={index % 8 === 0 ? 3 : 1.25}
              fill={index % 3 === 0 ? "#9FB5AA" : "#F2F0E9"}
              opacity={0.24 + (index % 4) * 0.08}
            />
          </g>
        );
      })}
    </svg>
  );
}

function SectionHeader({
  id,
  label,
  title,
  icon,
}: {
  id: string;
  label: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="mb-7 flex items-center gap-3 text-[#CC5833]">
        {icon}
        <p className="text-sm uppercase text-[#9FB5AA]">{label}</p>
      </div>
      <h2 className="mb-10 max-w-4xl font-serif text-4xl italic leading-tight text-cream md:text-6xl">
        {title}
      </h2>
    </div>
  );
}

export default function MoodboardPage() {
  return (
    <div className="moodboard-page min-h-screen bg-[#050806] text-cream selection:bg-clay/35 selection:text-cream">
      <div className="noise-overlay-dark" aria-hidden />

      <header className="relative min-h-screen overflow-hidden border-b border-cream/10">
        <div className="moodboard-ambient-grid" aria-hidden />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <a
            href="formless-hub.html"
            className="moodboard-link inline-flex items-center gap-2 border border-cream/14 bg-cream/[0.06] px-4 py-2 text-sm text-cream/78"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Project hub
          </a>
          <a
            href="#mood-vocabulary"
            className="moodboard-link moodboard-link-primary inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
          >
            Enter board
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-10 md:px-8 md:pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <p className="mb-6 text-sm uppercase text-[#9FB5AA]">
              Formless visual system
            </p>
            <h1 className="max-w-4xl font-serif text-6xl font-light italic leading-[1.02] text-cream md:text-8xl">
              Formless Moodboard
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-9 text-cream/70">
              A field-study wall for translating the client meeting into image
              direction, typography, color, motion, texture, and interface
              behavior.
            </p>

            <div className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
              <div className="moodboard-signal-strip">
                <span>Primary image</span>
                <strong>Body dissolving into field</strong>
              </div>
              <div className="moodboard-signal-strip">
                <span>Core feeling</span>
                <strong>Still, spacious, awake</strong>
              </div>
              <div className="moodboard-signal-strip">
                <span>Interface role</span>
                <strong>Invitation, not instruction</strong>
              </div>
            </div>
          </div>

          <aside className="moodboard-lens">
            <TorusFieldStudy compact />
            <div className="moodboard-lens-copy">
              <p>Living toroidal field</p>
              <span>human / particle / intelligence / space</span>
            </div>
          </aside>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <section className="mb-24" aria-label="Moodboard navigation">
          <div className="moodboard-thread">
            {MOODBOARD_SECTIONS.map((section) => (
              <a key={section} href={`#${slugFor(section)}`} className="moodboard-thread-link">
                {section}
              </a>
            ))}
          </div>
        </section>

        <section className="mb-28">
          <SectionHeader
            id="mood-vocabulary"
            label="Mood Vocabulary"
            title="The words the visual system should make felt before they are read."
            icon={<Sparkles className="h-5 w-5" aria-hidden />}
          />
          <div className="moodboard-keyword-field">
            {MOOD_KEYWORDS.map((word, index) => (
              <span key={word} style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}>
                {word}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-28">
          <SectionHeader
            id="image-direction"
            label="Image Direction"
            title="Not stock wellness. A body becoming field, then awareness."
            icon={<ImageIcon className="h-5 w-5" aria-hidden />}
          />
          <div className="moodboard-gallery-wall">
            {IMAGE_REFERENCES.map((reference, index) => (
              <VisualReference key={reference.title} reference={reference} index={index} />
            ))}
          </div>
        </section>

        <section className="mb-28">
          <SectionHeader
            id="color-system"
            label="Color System"
            title="A dark field with manuscript warmth and small human heat."
            icon={<Palette className="h-5 w-5" aria-hidden />}
          />
          <div className="moodboard-color-field">
            {COLOR_SWATCHES.map((swatch, index) => (
              <article key={swatch.name} className="moodboard-swatch" style={{ "--swatch": swatch.hex, "--i": index } as React.CSSProperties}>
                <span>{swatch.name}</span>
                <strong>{swatch.hex}</strong>
                <p>{swatch.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-28">
          <SectionHeader
            id="typography"
            label="Typography"
            title="A human editorial voice held by quiet structural labels."
            icon={<Type className="h-5 w-5" aria-hidden />}
          />
          <div className="moodboard-type-stage">
            {TYPOGRAPHY_DIRECTIONS.map((font) => (
              <article key={font.role} className="moodboard-type-specimen">
                <p>{font.role} / {font.family}</p>
                <strong
                  className={
                    font.role === "Display"
                      ? "font-serif italic"
                      : font.role === "Technical"
                        ? "font-mono"
                        : ""
                  }
                >
                  {font.sample}
                </strong>
                <span>{font.usage}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-28">
          <SectionHeader
            id="texture-and-material"
            label="Texture & Material"
            title="Surfaces should feel touched, not rendered."
            icon={<Layers3 className="h-5 w-5" aria-hidden />}
          />
          <div className="moodboard-material-ribbon">
            {TEXTURE_NOTES.map((note) => (
              <article key={note.title}>
                <CircleDashed className="h-5 w-5" aria-hidden />
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-28">
          <SectionHeader
            id="spatial-composition"
            label="Spatial Composition"
            title="The page should move like attention settling."
            icon={<Pause className="h-5 w-5" aria-hidden />}
          />
          <div className="moodboard-composition-path">
            {SPATIAL_DIRECTIONS.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.principle}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-28">
          <SectionHeader
            id="motion-language"
            label="Motion Language"
            title="Micro-interactions should reveal, clarify, and soften."
            icon={<Waves className="h-5 w-5" aria-hidden />}
          />
          <div className="moodboard-motion-lab">
            <div className="moodboard-motion-demo" aria-hidden>
              <TorusFieldStudy compact />
            </div>
            <div className="space-y-4">
              {INTERACTION_CUES.map((cue) => (
                <article key={cue.title} className="moodboard-interaction-cue">
                  <MousePointer2 className="h-5 w-5" aria-hidden />
                  <div>
                    <h3>{cue.title}</h3>
                    <p>{cue.trigger}</p>
                    <small>{cue.response}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {MOTION_NOTES.map((note) => (
              <article key={note.title} className="moodboard-note-line">
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-28">
          <SectionHeader
            id="interface-notes"
            label="Interface Notes"
            title="The interface should feel like an invitation into a reflective field."
            icon={<ArrowUpRight className="h-5 w-5" aria-hidden />}
          />
          <div className="moodboard-interface-stage">
            <div className="moodboard-reflection-module">
              <p>A moment to reflect</p>
              <h3>What would happen if you allowed this moment to be here?</h3>
              <button type="button">Sit with the question</button>
            </div>
            <div className="moodboard-interface-notes">
              {INTERFACE_NOTES.map((note) => (
                <article key={note.title}>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="avoid" className="scroll-mt-24 border-t border-cream/10 py-16">
          <div className="mb-8 flex items-center gap-3 text-[#CC5833]">
            <X className="h-5 w-5" aria-hidden />
            <p className="text-sm uppercase text-[#9FB5AA]">Avoid</p>
          </div>
          <div className="moodboard-avoid-rail">
            {AVOID_NOTES.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
