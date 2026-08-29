import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

import { BrandShell } from "@/components/app-sidebar";
import {
  BrandPageBody,
  BrandPageHeader,
} from "@/components/BrandPageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type SpeakerSheet = {
  id: string;
  letter: string;
  name: string;
  imageSrc: string;
  pdfSrc?: string;
};

const ASSET_REV = "20260829-canva-speaker-sheets";
const CANVA_SPEAKER_SHEETS = "https://canva.link/speaker-sheets";

const CURRENT_SHEETS: SpeakerSheet[] = [
  {
    id: "a-keynote-cover-pair",
    letter: "A",
    name: "Keynote cover pair",
    imageSrc: `/design/speaker-notes/versions/d1-keynote-cover-pair.jpg?v=${ASSET_REV}`,
  },
  {
    id: "b-contact-rail",
    letter: "B",
    name: "Contact rail",
    imageSrc: `/design/speaker-notes/versions/d2-contact-rail.png?v=${ASSET_REV}`,
  },
  {
    id: "c-profile-band",
    letter: "C",
    name: "Profile band",
    imageSrc: `/design/speaker-notes/versions/d3-profile-band.jpg?v=${ASSET_REV}`,
  },
  {
    id: "d-navy-keynote",
    letter: "D",
    name: "Navy keynote",
    imageSrc: `/design/speaker-notes/versions/d4-navy-keynote.jpg?v=${ASSET_REV}`,
  },
  {
    id: "e-signature-banner",
    letter: "E",
    name: "Signature banner",
    imageSrc: `/design/speaker-notes/versions/d5-signature-banner.jpg?v=${ASSET_REV}`,
  },
];

const PREVIOUS_SHEETS: SpeakerSheet[] = [
  {
    id: "a-ceremonial-center",
    letter: "A",
    name: "Ceremonial Center",
    imageSrc: "/design/speaker-notes/versions/a-ceremonial-center.png",
    pdfSrc: "/design/speaker-notes/exports/layout-a-beyond-the-mind.pdf",
  },
  {
    id: "b-editorial-bands",
    letter: "B",
    name: "Editorial Bands",
    imageSrc: "/design/speaker-notes/versions/b-editorial-bands.png",
    pdfSrc: "/design/speaker-notes/exports/layout-b-beyond-the-mind.pdf",
  },
  {
    id: "c-contact-first",
    letter: "C",
    name: "Contact First",
    imageSrc: "/design/speaker-notes/versions/c-contact-first.png",
    pdfSrc: "/design/speaker-notes/exports/layout-c-beyond-the-mind.pdf",
  },
  {
    id: "foundation",
    letter: "B",
    name: "Foundation B",
    imageSrc: "/design/speaker-notes/versions/foundation-concept-b.png",
  },
  {
    id: "b1-compact-cover-rail",
    letter: "B1",
    name: "Compact Cover Rail",
    imageSrc: "/design/speaker-notes/versions/b1-r4-warm-crimson.png",
  },
  {
    id: "b2-keynote-first",
    letter: "B2",
    name: "Keynote First",
    imageSrc: "/design/speaker-notes/versions/b2-r4-warm-crimson.png",
  },
  {
    id: "b3-two-column",
    letter: "B3",
    name: "Two Column",
    imageSrc: "/design/speaker-notes/versions/b3-r4-warm-crimson.png",
  },
];

export default function SpeakerSheetPage() {
  const [lightbox, setLightbox] = useState<SpeakerSheet | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox]);

  return (
    <>
      <BrandShell activeId="speaker-sheet" crumb="Speaker sheet">
        <BrandPageBody>
          <SpeakerSheetSection onOpen={setLightbox} />
        </BrandPageBody>
      </BrandShell>

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050806]/92 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.letter} — ${lightbox.name}`}
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

          <figure
            className="flex max-h-full max-w-4xl flex-col gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={lightbox.imageSrc}
              alt={`${lightbox.letter} — ${lightbox.name}`}
              className="max-h-[min(82dvh,920px)] w-auto rounded-lg border border-cream/10 object-contain shadow-2xl"
            />
            <figcaption className="text-center text-sm text-cream/65">
              <span className="font-sans font-medium text-cream">
                {lightbox.letter} — {lightbox.name}
              </span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}

function LetterStamp({ letter }: { letter: string }) {
  return (
    <span className="inline-flex min-w-9 items-center justify-center rounded-full border border-clay/40 bg-transparent px-2 py-0.5 font-sans text-[10px] font-semibold tracking-[0.04em] text-cream/75">
      {letter}
    </span>
  );
}

function DownloadLink({
  href,
  label,
  name,
}: {
  href: string;
  label: string;
  name: string;
}) {
  return (
    <a
      href={href}
      download
      className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-1.5 text-[11px] font-medium text-cream/45 transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
      aria-label={`Download ${name} ${label}`}
    >
      <Download className="h-3 w-3" aria-hidden />
      {label}
    </a>
  );
}

function SectionHeading({
  plate,
  title,
  headingId,
}: {
  plate: string;
  title: string;
  headingId: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-sans text-4xl font-semibold leading-none tracking-[-0.03em] text-clay/45 md:text-5xl">
        {plate}
      </span>
      <div className="h-px flex-1 bg-cream/12" aria-hidden />
      <h2
        id={headingId}
        className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-cream/55"
      >
        {title}
      </h2>
    </div>
  );
}

function SpeakerSheetSection({
  onOpen,
}: {
  onOpen: (sheet: SpeakerSheet) => void;
}) {
  return (
    <div className="flex flex-col gap-10">
      <BrandPageHeader
        tone="desk"
        title="Speaker sheet"
        description="Current Canva speaker sheets for booking and venues. Open a layout to preview, or jump into Canva to edit."
        actions={
          <a
            href={CANVA_SPEAKER_SHEETS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center border border-clay/40 bg-clay/10 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cream transition-colors hover:border-clay/60 hover:bg-clay/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]"
          >
            Open in Canva
          </a>
        }
      />

      <p className="max-w-xl font-sans text-sm leading-relaxed text-cream/55">
        Source files live in Canva:{" "}
        <a
          href={CANVA_SPEAKER_SHEETS}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cream/80 underline decoration-cream/25 underline-offset-4 transition-colors hover:text-cream hover:decoration-cream/60"
        >
          {CANVA_SPEAKER_SHEETS}
        </a>
        .
      </p>

      <div className="flex flex-col gap-14">
        <section
          aria-labelledby="current-sheets-heading"
          className="flex flex-col gap-6"
        >
          <SectionHeading
            plate="01"
            title="Current"
            headingId="current-sheets-heading"
          />
          <SheetGrid sheets={CURRENT_SHEETS} onOpen={onOpen} />
        </section>

        <section
          aria-labelledby="previous-sheets-heading"
          className="flex flex-col gap-4"
        >
          <SectionHeading
            plate="02"
            title="Previous"
            headingId="previous-sheets-heading"
          />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="previous-sheets" className="border-cream/12">
              <AccordionTrigger className="py-3 font-sans text-sm font-medium text-cream/70 hover:no-underline hover:text-cream [&>svg]:text-cream/45">
                Earlier speaker sheet layouts ({PREVIOUS_SHEETS.length})
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <SheetGrid sheets={PREVIOUS_SHEETS} onOpen={onOpen} columns={4} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  );
}

function SheetGrid({
  sheets,
  onOpen,
  columns = 3,
}: {
  sheets: SpeakerSheet[];
  onOpen: (sheet: SpeakerSheet) => void;
  columns?: 3 | 4;
}) {
  const gridClass =
    columns === 4
      ? "grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
      : "grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6";

  return (
    <div className={gridClass}>
      {sheets.map((sheet) => (
        <SheetCard key={sheet.id} sheet={sheet} onOpen={onOpen} />
      ))}
    </div>
  );
}

function SheetCard({
  sheet,
  onOpen,
}: {
  sheet: SpeakerSheet;
  onOpen: (sheet: SpeakerSheet) => void;
}) {
  return (
    <article className="group flex min-w-0 flex-col gap-3">
      <button
        type="button"
        onClick={() => onOpen(sheet)}
        className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-md bg-[#050806] text-left ring-1 ring-cream/10 transition hover:ring-cream/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
        aria-label={`View ${sheet.name} full size`}
      >
        <img
          src={sheet.imageSrc}
          alt={`${sheet.letter} — ${sheet.name}`}
          className="h-full w-full object-contain transition-transform duration-500 motion-safe:group-hover:scale-[1.015]"
          loading="lazy"
          draggable={false}
        />
      </button>

      <div className="flex items-start justify-between gap-2 pt-0.5">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <LetterStamp letter={sheet.letter} />
          <h3 className="font-sans text-xs font-medium leading-snug text-cream/40 md:text-sm">
            {sheet.name}
          </h3>
        </div>
        <div className="flex shrink-0 items-center">
          <DownloadLink
            href={sheet.imageSrc}
            label={sheet.imageSrc.includes(".png") ? "PNG" : "JPG"}
            name={sheet.name}
          />
          {sheet.pdfSrc ? (
            <DownloadLink href={sheet.pdfSrc} label="PDF" name={sheet.name} />
          ) : null}
        </div>
      </div>
    </article>
  );
}
