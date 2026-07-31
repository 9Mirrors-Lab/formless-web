import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

import { BrandShell } from "@/components/app-sidebar";
import {
  BrandPageBody,
  BrandPageHeader,
} from "@/components/BrandPageHeader";

type ZoomBackground = {
  id: string;
  label: string;
  name: string;
  note: string;
  imageSrc: string;
};

type ZoomRound = {
  id: string;
  plate: string;
  title: string;
  items: ZoomBackground[];
};

const ZOOM_ROUNDS: ZoomRound[] = [
  {
    id: "round-1",
    plate: "01",
    title: "Brand foundations",
    items: [
      {
        id: "1a",
        label: "1a",
        name: "Charcoal Sanctuary",
        note: "Dark sanctuary field with quiet branding",
        imageSrc: "/design/zoom-backgrounds/formless-zoom-1a-charcoal-sanctuary.png",
      },
      {
        id: "1b",
        label: "1b",
        name: "Misty River",
        note: "Nature photography with brand overlay",
        imageSrc: "/design/zoom-backgrounds/formless-zoom-1b-misty-river.png",
      },
      {
        id: "1d",
        label: "1d",
        name: "Moss Editorial",
        note: "Moss editorial; Chapter One line; Formless book meta; center clear",
        imageSrc: "/design/zoom-backgrounds/formless-zoom-1d-moss-editorial.png",
      },
    ],
  },
  {
    id: "round-2",
    plate: "02",
    title: "Book launch",
    items: [
      {
        id: "2a",
        label: "2a",
        name: "Dusk Horizon",
        note: "Desert dusk with dark bottom brand strip",
        imageSrc: "/design/zoom-backgrounds/formless-zoom-2a-dusk-horizon.png",
      },
      {
        id: "2b",
        label: "2b",
        name: "Ghost Type",
        note: "Typography-led charcoal field",
        imageSrc: "/design/zoom-backgrounds/formless-zoom-2b-ghost-type.png",
      },
      {
        id: "2c",
        label: "2c",
        name: "Golden Coast",
        note: "Sunset coast with top brand band",
        imageSrc: "/design/zoom-backgrounds/formless-zoom-2c-golden-coast.png",
      },
      {
        id: "3b",
        label: "3b",
        name: "Dusk Announcement",
        note: "Top banner + right column; center clear",
        imageSrc: "/design/zoom-backgrounds/formless-zoom-3b-dusk-announcement.png",
      },
      {
        id: "3c",
        label: "3c",
        name: "Corner Anchors",
        note: "Misty field with right-edge book lockup",
        imageSrc: "/design/zoom-backgrounds/formless-zoom-3c-corner-anchors.png",
      },
    ],
  },
];

const ZOOM_BACKGROUNDS = ZOOM_ROUNDS.flatMap((round) => round.items);

function PlateStamp({
  label,
  size = "md",
}: {
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg"
      ? "min-w-14 px-3.5 py-1.5 text-sm"
      : size === "sm"
        ? "min-w-9 px-2 py-0.5 text-[10px]"
        : "min-w-11 px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-clay/40 bg-transparent font-sans font-semibold tracking-[0.04em] text-cream/75 ${sizeClass}`}
    >
      {label}
    </span>
  );
}

function PlateCard({
  item,
  onOpen,
}: {
  item: ZoomBackground;
  onOpen: (item: ZoomBackground) => void;
}) {
  return (
    <article id={item.id} className="group scroll-mt-28 flex min-w-0 flex-col gap-2">
      <button
        type="button"
        onClick={() => onOpen(item)}
        title={item.note}
        className="aspect-video w-full overflow-hidden rounded-md bg-[#050806] text-left ring-1 ring-cream/10 transition hover:ring-cream/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
        aria-label={`View ${item.label} ${item.name} full size`}
      >
        <img
          src={item.imageSrc}
          alt={`${item.label} ${item.name} Zoom background`}
          className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.015]"
          loading="lazy"
        />
      </button>

      <div className="flex items-baseline justify-between gap-2">
        <div className="flex min-w-0 items-baseline gap-2">
          <PlateStamp label={item.label} size="sm" />
          <h3 className="truncate font-sans text-xs font-medium leading-none text-cream/40 md:text-sm">
            {item.name}
          </h3>
        </div>
        <a
          href={item.imageSrc}
          download
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-1.5 text-[11px] font-medium text-cream/45 transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
          aria-label={`Download ${item.label} ${item.name} PNG`}
        >
          <Download className="h-3 w-3" aria-hidden />
          <span className="hidden sm:inline">PNG</span>
        </a>
      </div>
    </article>
  );
}

export default function ZoomBackgroundsPage() {
  const [lightbox, setLightbox] = useState<ZoomBackground | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const index = ZOOM_BACKGROUNDS.findIndex((item) => item.id === lightbox.id);
        if (index < 0) return;
        const next =
          event.key === "ArrowLeft"
            ? Math.max(0, index - 1)
            : Math.min(ZOOM_BACKGROUNDS.length - 1, index + 1);
        setLightbox(ZOOM_BACKGROUNDS[next] ?? null);
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

  return (
    <>
      <BrandShell activeId="zoom-backgrounds" crumb="Zoom backgrounds">
        <BrandPageBody>
          <div className="flex flex-col gap-10">
            <BrandPageHeader
              title="Zoom backgrounds"
              description="Eight 3840 × 2160 (16:9) session backdrops. Branding stays at the edges; center stays clear for head and shoulders."
            />

            <div className="flex flex-col gap-14">
              {ZOOM_ROUNDS.map((round) => (
                <section
                  key={round.id}
                  id={round.id}
                  aria-labelledby={`${round.id}-heading`}
                  className="scroll-mt-28 flex flex-col gap-6"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-4xl italic leading-none text-clay/45 md:text-5xl">
                      {round.plate}
                    </span>
                    <div className="h-px flex-1 bg-cream/12" aria-hidden />
                    <h2
                      id={`${round.id}-heading`}
                      className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-cream/55"
                    >
                      {round.title}
                    </h2>
                  </div>

                  <div
                    className={
                      round.items.length >= 5
                        ? "grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-5"
                        : "grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
                    }
                  >
                    {round.items.map((item) => (
                      <PlateCard
                        key={item.id}
                        item={item}
                        onOpen={setLightbox}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </BrandPageBody>
      </BrandShell>

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050806]/92 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.label} ${lightbox.name}`}
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
            className="flex max-h-full max-w-5xl flex-col gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-baseline justify-center gap-3">
              <PlateStamp label={lightbox.label} size="lg" />
              <p className="font-sans text-base font-medium text-cream/80 md:text-lg">
                {lightbox.name}
              </p>
            </div>
            <img
              src={lightbox.imageSrc}
              alt={`${lightbox.label} ${lightbox.name} Zoom background`}
              className="max-h-[min(78dvh,880px)] w-auto rounded-lg border border-cream/10 object-contain shadow-2xl"
            />
            <figcaption className="flex flex-wrap items-center justify-center gap-3 text-center text-sm text-cream/55">
              <span>{lightbox.note}</span>
              <a
                href={lightbox.imageSrc}
                download
                className="inline-flex items-center gap-1.5 text-cream/80 transition-colors hover:text-cream"
              >
                <Download className="h-3.5 w-3.5" aria-hidden />
                Download PNG
              </a>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
