import { Download } from "lucide-react";

const logoOptions = [
  {
    id: "04G",
    kind: "No tagline",
    name: "No tagline",
    src: new URL(
      "../../design/eyes-closed-logo-variations/04g-tagline-none.svg",
      import.meta.url,
    ).href,
    wide: true,
    downloads: [
      {
        label: "Cream SVG",
        href: "/downloads/eyes-closed/eyes-closed-mark-04g-cream.svg",
        fileName: "eyes-closed-mark-04g-cream.svg",
      },
      {
        label: "Black SVG",
        href: "/downloads/eyes-closed/eyes-closed-mark-04g-black.svg",
        fileName: "eyes-closed-mark-04g-black.svg",
      },
    ],
  },
  {
    id: "04H",
    kind: "Tagline",
    name: "Begin With A Reflection",
    src: new URL(
      "../../design/eyes-closed-logo-variations/04h-tagline-begin-reflection.svg",
      import.meta.url,
    ).href,
    wide: false,
  },
  {
    id: "04I",
    kind: "Tagline",
    name: "Inner Awareness",
    src: new URL(
      "../../design/eyes-closed-logo-variations/04i-tagline-inner-awareness.svg",
      import.meta.url,
    ).href,
    wide: false,
  },
  {
    id: "04J",
    kind: "Tagline",
    name: "Return To Presence",
    src: new URL(
      "../../design/eyes-closed-logo-variations/04j-tagline-return-presence-rule.svg",
      import.meta.url,
    ).href,
    wide: false,
  },
  {
    id: "04K",
    kind: "Tagline",
    name: "Stop Pause Notice",
    src: new URL(
      "../../design/eyes-closed-logo-variations/04k-tagline-stop-pause-notice.svg",
      import.meta.url,
    ).href,
    wide: false,
  },
  {
    id: "04L",
    kind: "Tagline",
    name: "Quiet Space For Inner Awareness",
    src: new URL(
      "../../design/eyes-closed-logo-variations/04l-tagline-quiet-space.svg",
      import.meta.url,
    ).href,
    wide: true,
  },
  {
    id: "04M",
    kind: "Horizontal lockup",
    name: "Serif right lockup with tagline",
    src: new URL(
      "../../design/eyes-closed-logo-variations/04m-horizontal-serif-tagline.svg",
      import.meta.url,
    ).href,
    wide: true,
  },
] as const;

export default function EyesClosedLogoOptionsPage() {
  return (
    <div className="min-h-screen bg-[#080a09] px-5 py-20 text-cream selection:bg-clay/30 selection:text-cream sm:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-screen-2xl">
        <header className="mb-16 max-w-3xl text-left">
          <span className="font-mono text-xs uppercase tracking-widest text-clay">
            Site reference
          </span>
          <h1 className="mt-4 font-serif text-4xl italic text-cream md:text-5xl">
            Eyes Closed logo options
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream/72">
            Reference page for the selected 04 direction. Same mark and wordmark,
            exploring tagline treatments and horizontal lockups.
          </p>
        </header>

        <section aria-label="Selected 04 logo options">
          <h2 className="mb-3 border-b border-cream/10 pb-4 font-serif text-2xl italic text-cream">
            Selected 04 direction
          </h2>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-cream/65">
            Tagline lockups for the final mark direction, shown as isolated dark
            lockups for contrast, spacing, and right-side name placement review.
          </p>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-12">
            {logoOptions.map((option) => (
              <article
                key={option.id}
                className={`flex h-full min-h-0 flex-col gap-3 ${
                  option.wide ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex min-h-[4.25rem] flex-1 flex-col gap-1.5 px-1 sm:px-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                    {option.id}
                    <span className="ml-4">{option.kind}</span>
                  </p>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-cream">
                    {option.name}
                  </h3>
                  {"downloads" in option && option.downloads ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {option.downloads.map((download) => (
                        <a
                          key={download.fileName}
                          href={download.href}
                          download={download.fileName}
                          className="inline-flex items-center gap-2 border border-cream/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/72 transition hover:border-cream/40 hover:bg-cream/8 hover:text-cream"
                        >
                          <Download aria-hidden="true" className="h-3.5 w-3.5" />
                          {download.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div
                  className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[2rem] border border-white/5 bg-[#050806] shadow-inner ${
                    option.wide ? "h-[23.75rem]" : "h-[18.75rem]"
                  }`}
                >
                  <img
                    src={option.src}
                    alt={`${option.name} Eyes Closed logo lockup`}
                    className="h-full w-full object-contain"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
