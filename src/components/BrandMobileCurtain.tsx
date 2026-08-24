import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronUp } from "lucide-react";

import {
  NAV_ROOMS,
  brandNavPlace,
  navHighlightId,
  type BrandNavId,
} from "@/components/brandNavData";

gsap.registerPlugin(useGSAP);

const CLOSED_CLIP = "inset(100% 0% 0% 0%)";
const OPEN_CLIP = "inset(0% 0% 0% 0%)";
const FOCUSABLE = "a[href], button:not([disabled])";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]";

type BrandMobileCurtainProps = {
  activeId: BrandNavId;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export function BrandMobileCurtain({
  activeId,
  open,
  onOpen,
  onClose,
}: BrandMobileCurtainProps) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLButtonElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const didMount = useRef(false);
  const place = brandNavPlace(activeId);
  const highlightId = navHighlightId(activeId);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      const links =
        linksRef.current?.querySelectorAll<HTMLElement>(".curtain-link") ?? [];
      if (!overlay) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!didMount.current) {
        didMount.current = true;
        gsap.set(overlay, { clipPath: CLOSED_CLIP });
        if (links.length) gsap.set(links, { opacity: 0, y: 16 });
        return;
      }

      if (reduced) {
        gsap.set(overlay, { clipPath: open ? OPEN_CLIP : CLOSED_CLIP });
        if (links.length) gsap.set(links, { opacity: open ? 1 : 0, y: 0 });
        return;
      }

      if (open) {
        const tl = gsap.timeline();
        tl.fromTo(
          overlay,
          { clipPath: CLOSED_CLIP },
          { clipPath: OPEN_CLIP, duration: 0.42, ease: "power3.out" },
        );
        if (links.length) {
          tl.fromTo(
            links,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.32,
              stagger: 0.035,
              ease: "power2.out",
            },
            0.12,
          );
        }
        return;
      }

      const tl = gsap.timeline();
      if (links.length) {
        tl.to(
          links,
          {
            opacity: 0,
            y: 8,
            duration: 0.16,
            stagger: 0.018,
            ease: "power2.in",
          },
          0,
        );
      }
      tl.to(
        overlay,
        { clipPath: CLOSED_CLIP, duration: 0.28, ease: "power3.in" },
        0,
      );
    },
    { scope: rootRef, dependencies: [open] },
  );

  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    if (!root) return;
    const previous = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.tabIndex !== -1 && !el.hasAttribute("disabled"),
      );

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div ref={rootRef} className="md:hidden">
      <div
        ref={overlayRef}
        id={panelId}
        className="fixed inset-0 z-40 flex flex-col bg-[#060807] pb-[calc(3.5rem+env(safe-area-inset-bottom))]"
        style={{
          clipPath: CLOSED_CLIP,
          paddingTop: "env(safe-area-inset-top)",
        }}
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        aria-label="Brand toolkit"
        aria-hidden={!open}
        inert={!open}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 90% 50% at 50% 100%, rgba(46,64,54,0.55), transparent 58%), radial-gradient(ellipse 70% 40% at 80% 0%, rgba(204,88,51,0.08), transparent 50%)",
          }}
        />

        <nav
          ref={linksRef}
          className="relative flex-1 overflow-y-auto overscroll-contain px-2 pb-4 pt-10"
          aria-label="Brand toolkit"
        >
          <ul className="flex flex-col gap-5">
            <li>
              <a
                href="/brand"
                aria-current={activeId === "brand" ? "page" : undefined}
                className={[
                  "curtain-link group flex min-h-11 flex-col justify-center rounded-lg px-4 py-3 transition-colors duration-200",
                  focusRing,
                  activeId === "brand"
                    ? "bg-cream/[0.05] text-cream"
                    : "text-cream/80 hover:bg-cream/[0.03] hover:text-cream",
                ].join(" ")}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
              >
                <span className="font-sans text-[1.55rem] font-semibold leading-none tracking-[-0.03em]">
                  Eyes Closed
                </span>
                <span
                  className={[
                    "mt-1.5 text-[0.8125rem] leading-snug",
                    activeId === "brand" ? "text-cream/55" : "text-cream/45",
                  ].join(" ")}
                >
                  Brand Toolkit
                </span>
              </a>
            </li>
            {NAV_ROOMS.map((room) => (
              <li key={room.id}>
                <p className="px-4 pb-1 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#9fb5aa]">
                  {room.title}
                </p>
                <ul className="flex flex-col">
                  {room.items.map((item) => {
                    const isActive = item.id === highlightId;
                    return (
                      <li key={item.id}>
                        <a
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={[
                            "curtain-link group flex min-h-11 flex-col justify-center rounded-lg px-4 py-2.5 transition-colors duration-200",
                            focusRing,
                            isActive
                              ? "bg-cream/[0.05] text-cream"
                              : "text-cream/55 hover:bg-cream/[0.03] hover:text-cream/85",
                          ].join(" ")}
                          onClick={onClose}
                          tabIndex={open ? 0 : -1}
                        >
                          <span className="font-sans text-[1.05rem] tracking-wide">
                            {item.title}
                          </span>
                          <span
                            className={[
                              "mt-0.5 text-[0.8125rem] leading-snug",
                              isActive ? "text-cream/55" : "text-cream/45",
                            ].join(" ")}
                          >
                            {item.description}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative px-5 pb-3">
          <a
            href="/hub"
            className={`curtain-link inline-flex min-h-11 items-center font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40 hover:text-[#9fb5aa] ${focusRing}`}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
          >
            <span aria-hidden>←</span>
            <span className="ml-2">Site hub</span>
          </a>
        </div>
      </div>

      <button
        ref={dockRef}
        type="button"
        className={[
          "fixed inset-x-0 bottom-0 z-50 flex min-h-14 items-center justify-between gap-3 border-t border-cream/[0.1] bg-[#060807] px-5 text-left",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3",
          "touch-manipulation",
          focusRing,
        ].join(" ")}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={
          open
            ? `Close menu. ${place.title}`
            : `Open menu. ${place.room}. ${place.title}`
        }
        onClick={() => (open ? onClose() : onOpen())}
      >
        <span className="min-w-0 font-sans text-[1.05rem] font-semibold leading-none tracking-tight text-cream">
          {place.title}
        </span>
        <span className="inline-flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9fb5aa]">
          {open ? "Close" : "Menu"}
          <ChevronUp
            className={[
              "h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              open ? "rotate-180" : "rotate-0",
            ].join(" ")}
            aria-hidden
          />
        </span>
      </button>
    </div>
  );
}
