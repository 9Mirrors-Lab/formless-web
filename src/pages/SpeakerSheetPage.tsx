import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { BrandShell } from "@/components/app-sidebar";
import {
  BrandPageBody,
  BrandPageHeader,
} from "@/components/BrandPageHeader";

type SpeakerVersion = {
  id: string;
  label: string;
  imageSrc: string;
  pdfSrc?: string;
};

type SpeakerConcept = {
  id: string;
  letter: string;
  name: string;
  hierarchy: string;
  recommended?: boolean;
  versions: SpeakerVersion[];
};

const ASSET_REV = "20260810-new-way-to-live";

const SPEAKER_CONCEPTS: SpeakerConcept[] = [
  {
    id: "a-ceremonial-center",
    letter: "A",
    name: "Ceremonial Center",
    hierarchy: "Keynote → portrait → bio → topics / takeaways → contact",
    recommended: true,
    versions: [
      {
        id: "a-light",
        label: "Light",
        imageSrc: `/design/speaker-notes/versions/a-ceremonial-center.png?v=${ASSET_REV}`,
        pdfSrc: `/design/speaker-notes/exports/layout-a-beyond-the-mind.pdf?v=${ASSET_REV}`,
      },
    ],
  },
  {
    id: "b-editorial-bands",
    letter: "B",
    name: "Editorial Bands",
    hierarchy: "Header → bio + portrait → intro → panels → contact bar",
    versions: [
      {
        id: "b-light",
        label: "Light",
        imageSrc: `/design/speaker-notes/versions/b-editorial-bands.png?v=${ASSET_REV}`,
        pdfSrc: `/design/speaker-notes/exports/layout-b-beyond-the-mind.pdf?v=${ASSET_REV}`,
      },
    ],
  },
  {
    id: "c-contact-first",
    letter: "C",
    name: "Contact First",
    hierarchy: "Portrait + title → topics → takeaways → bio → booking panel",
    versions: [
      {
        id: "c-light",
        label: "Light",
        imageSrc: `/design/speaker-notes/versions/c-contact-first.png?v=${ASSET_REV}`,
        pdfSrc: `/design/speaker-notes/exports/layout-c-beyond-the-mind.pdf?v=${ASSET_REV}`,
      },
    ],
  },
];

const FOUNDATION_SHEET: SpeakerVersion = {
  id: "foundation",
  label: "Foundation B",
  imageSrc: "/design/speaker-notes/versions/foundation-concept-b.png",
};

type LightboxState =
  | { kind: "concept"; concept: SpeakerConcept; index: number }
  | { kind: "foundation" };

export default function SpeakerSheetPage() {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (lightbox.kind !== "concept") return;
      if (event.key === "ArrowLeft") {
        setLightbox((prev) => {
          if (!prev || prev.kind !== "concept") return prev;
          return { ...prev, index: Math.max(0, prev.index - 1) };
        });
      }
      if (event.key === "ArrowRight") {
        setLightbox((prev) => {
          if (!prev || prev.kind !== "concept") return prev;
          return {
            ...prev,
            index: Math.min(prev.concept.versions.length - 1, prev.index + 1),
          };
        });
      }
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox]);

  const lightboxImage =
    lightbox?.kind === "foundation"
      ? FOUNDATION_SHEET
      : lightbox?.kind === "concept"
        ? lightbox.concept.versions[lightbox.index]
        : null;

  const lightboxTitle =
    lightbox?.kind === "foundation"
      ? FOUNDATION_SHEET.label
      : lightbox?.kind === "concept"
        ? `${lightbox.concept.letter} — ${lightbox.concept.name}`
        : "";

  return (
    <>
      <BrandShell activeId="speaker-sheet" crumb="Speaker sheet">
        <BrandPageBody>
          <SpeakerSheetSection
            concepts={SPEAKER_CONCEPTS}
            onOpen={(concept, index) =>
              setLightbox({ kind: "concept", concept, index })
            }
            onOpenFoundation={() => setLightbox({ kind: "foundation" })}
          />
        </BrandPageBody>
      </BrandShell>

      {lightbox && lightboxImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050806]/92 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxTitle}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 bg-charcoal/80 text-cream transition-colors hover:border-cream/30 hover:bg-charcoal"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>

          {lightbox.kind === "concept" && lightbox.index > 0 ? (
            <button
              type="button"
              className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/15 bg-charcoal/80 text-cream transition-colors hover:border-cream/30 hover:bg-charcoal sm:left-6"
              aria-label="Previous version"
              onClick={(event) => {
                event.stopPropagation();
                setLightbox((prev) =>
                  prev?.kind === "concept"
                    ? { ...prev, index: prev.index - 1 }
                    : prev,
                );
              }}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
          ) : null}

          {lightbox.kind === "concept" &&
          lightbox.index < lightbox.concept.versions.length - 1 ? (
            <button
              type="button"
              className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/15 bg-charcoal/80 text-cream transition-colors hover:border-cream/30 hover:bg-charcoal sm:right-6"
              aria-label="Next version"
              onClick={(event) => {
                event.stopPropagation();
                setLightbox((prev) =>
                  prev?.kind === "concept"
                    ? { ...prev, index: prev.index + 1 }
                    : prev,
                );
              }}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          ) : null}

          <figure
            className="flex max-h-full max-w-4xl flex-col gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={lightboxImage.imageSrc}
              alt={`${lightboxTitle} — ${lightboxImage.label}`}
              className="max-h-[min(82dvh,920px)] w-auto rounded-lg border border-cream/10 object-contain shadow-2xl"
            />
            <figcaption className="text-center text-sm text-cream/65">
              <span className="font-serif italic text-cream">{lightboxTitle}</span>
              {lightbox.kind === "concept" ? (
                <>
                  <span className="mx-2 text-cream/30">·</span>
                  {lightboxImage.label}
                  <span className="mx-2 text-cream/30">·</span>
                  {lightbox.index + 1} / {lightbox.concept.versions.length}
                </>
              ) : null}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}

function SpeakerSheetSection({
  concepts,
  onOpen,
  onOpenFoundation,
}: {
  concepts: SpeakerConcept[];
  onOpen: (concept: SpeakerConcept, index: number) => void;
  onOpenFoundation: () => void;
}) {
  return (
    <div className="flex flex-col gap-10">
      <BrandPageHeader
        title="Speaker sheet"
        description="Three light layouts for Beyond the Mind, A New Way to Live: Ceremonial Center, Editorial Bands, and Contact First. No book cover; contact paths labeled with real links. Earlier dark Concept B variants stay available below as archive reference."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {concepts.map((concept) => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            onOpen={onOpen}
          />
        ))}
      </div>

      <article className="overflow-hidden rounded-2xl border border-cream/10 bg-cream/[0.03] md:max-w-sm">
        <button
          type="button"
          onClick={onOpenFoundation}
          className="flex aspect-[3/4] w-full items-center justify-center bg-[#050806] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
          aria-label="View Foundation B full size"
        >
          <img
            src={FOUNDATION_SHEET.imageSrc}
            alt="Foundation Concept B speaker sheet"
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </button>
        <div className="flex flex-col gap-3 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
            Reference
          </p>
          <h3 className="font-serif text-2xl italic text-cream">
            {FOUNDATION_SHEET.label}
          </h3>
          <p className="font-mono text-[11px] text-cream/45">
            Cover → author → themes
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={onOpenFoundation}
              className="inline-flex items-center rounded-full border border-cream/15 px-3.5 py-2 text-xs font-medium text-cream/80 transition-colors hover:border-cream/30 hover:text-cream"
            >
              View
            </button>
            <a
              href={FOUNDATION_SHEET.imageSrc}
              download
              className="inline-flex items-center rounded-full border border-cream/15 px-3.5 py-2 text-xs font-medium text-cream/80 transition-colors hover:border-cream/30 hover:text-cream"
            >
              Download PNG
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

function ConceptCard({
  concept,
  onOpen,
}: {
  concept: SpeakerConcept;
  onOpen: (concept: SpeakerConcept, index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const version = concept.versions[index] ?? concept.versions[0];

  const goTo = (next: number) => {
    setIndex(Math.max(0, Math.min(concept.versions.length - 1, next)));
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-cream/10 bg-cream/[0.03]">
      <button
        type="button"
        onClick={() => onOpen(concept, index)}
        onTouchStart={(event) => {
          touchX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchX.current == null) return;
          const endX = event.changedTouches[0]?.clientX ?? touchX.current;
          const delta = endX - touchX.current;
          touchX.current = null;
          if (delta > 48) goTo(index - 1);
          if (delta < -48) goTo(index + 1);
        }}
        className="flex aspect-[3/4] w-full items-center justify-center border-b border-cream/10 bg-[#050806] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
        aria-label={`View ${concept.name} ${version.label} full size`}
      >
        <img
          key={version.id}
          src={version.imageSrc}
          alt={`${concept.name} — ${version.label}`}
          className="max-h-full max-w-full object-contain"
          loading="eager"
          draggable={false}
        />
      </button>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
              Concept {concept.letter}
            </p>
            <h3 className="mt-1 font-serif text-2xl italic text-cream">
              {concept.name}
            </h3>
          </div>
          {concept.recommended ? (
            <span className="shrink-0 rounded-full border border-moss/40 bg-moss/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#9fb5aa]">
              Recommended
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index <= 0}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream/85 transition-colors hover:border-cream/30 hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={`Previous ${concept.letter} version`}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>

          <div className="flex min-w-0 flex-1 flex-wrap justify-center gap-1.5">
            {concept.versions.map((slide, slideIndex) => {
              const active = slideIndex === index;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(slideIndex)}
                  className={[
                    "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                    active
                      ? "border-moss/45 bg-moss/15 text-[#c5d9ce]"
                      : "border-cream/12 text-cream/45 hover:border-cream/25 hover:text-cream/75",
                  ].join(" ")}
                >
                  {slide.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index >= concept.versions.length - 1}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream/85 transition-colors hover:border-cream/30 hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={`Next ${concept.letter} version`}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <p className="font-mono text-[11px] text-cream/45">{concept.hierarchy}</p>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => onOpen(concept, index)}
            className="inline-flex items-center rounded-full border border-cream/15 px-3.5 py-2 text-xs font-medium text-cream/80 transition-colors hover:border-cream/30 hover:text-cream"
          >
            View
          </button>
          <a
            href={version.imageSrc}
            download
            className="inline-flex items-center rounded-full border border-cream/15 px-3.5 py-2 text-xs font-medium text-cream/80 transition-colors hover:border-cream/30 hover:text-cream"
          >
            Download PNG
          </a>
          {version.pdfSrc ? (
            <a
              href={version.pdfSrc}
              download
              className="inline-flex items-center rounded-full border border-cream/15 px-3.5 py-2 text-xs font-medium text-cream/80 transition-colors hover:border-cream/30 hover:text-cream"
            >
              Download PDF
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
