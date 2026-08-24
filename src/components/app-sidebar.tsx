import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { BrandMobileCurtain } from "@/components/BrandMobileCurtain";
import {
  NAV_ROOMS,
  navHighlightId,
  navIdFromPath,
  type BrandNavId,
} from "@/components/brandNavData";

const NAV_WIDTH = "19rem";
const NAV_STRIP = "2.75rem";
const NAV_COLLAPSED_KEY = "formless-brand-nav-collapsed";

const TOGGLE_CLASS =
  "flex h-8 w-8 shrink-0 items-center justify-center border border-cream/20 text-[#9fb5aa] transition-colors hover:bg-cream/5 hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]";

function readNavCollapsed(): boolean {
  try {
    return window.localStorage.getItem(NAV_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeNavCollapsed(collapsed: boolean): void {
  try {
    window.localStorage.setItem(NAV_COLLAPSED_KEY, collapsed ? "1" : "0");
  } catch {
    /* ignore quota / private mode */
  }
}

export type { BrandNavId, BrandNavSection } from "@/components/brandNavData";

export function useBrandNavActive(): BrandNavId {
  const [active, setActive] = useState<BrandNavId>(() =>
    typeof window !== "undefined" ? navIdFromPath(window.location.pathname) : "brand",
  );

  useEffect(() => {
    const sync = () => setActive(navIdFromPath(window.location.pathname));
    window.addEventListener("popstate", sync);
    sync();
    return () => {
      window.removeEventListener("popstate", sync);
    };
  }, []);

  return active;
}

type BrandNavProps = {
  activeId: BrandNavId;
  onClose: () => void;
  collapsed: boolean;
  onToggle: () => void;
};

function BrandNavPanel({
  activeId,
  onClose,
  labelledBy,
  onCollapse,
}: {
  activeId: BrandNavId;
  onClose: () => void;
  labelledBy: string;
  onCollapse: () => void;
}) {
  const highlightId = navHighlightId(activeId);

  return (
    <div className="relative flex h-full flex-col">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 120% 60% at 0% 0%, rgba(46,64,54,0.55), transparent 55%), radial-gradient(ellipse 80% 50% at 100% 100%, rgba(204,88,51,0.08), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#9fb5aa]/35 to-transparent"
        aria-hidden
      />

      <div className="relative flex min-h-[135px] items-start justify-between gap-2 px-2 pb-5 pt-5">
        <a
          href="/brand"
          className="group block min-w-0 flex-1 px-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]"
          onClick={onClose}
        >
          <p
            id={labelledBy}
            className="text-[12px] font-medium uppercase tracking-[0.12em] text-[#9fb5aa]"
          >
            Brand Toolkit
          </p>
          <p className="mt-2 font-sans text-[1.55rem] font-semibold leading-none tracking-[-0.03em] text-cream transition-colors group-hover:text-cream/90">
            Eyes Closed
          </p>
        </a>
        <button
          type="button"
          aria-expanded="true"
          aria-controls="brand-nav-links"
          aria-label="Hide navigation"
          className={`${TOGGLE_CLASS} mt-0.5 mr-1`}
          onClick={onCollapse}
        >
          <PanelLeftClose size={16} aria-hidden />
        </button>
      </div>

      <nav
        id="brand-nav-links"
        className="relative flex-1 overflow-y-auto px-2 pb-6"
        aria-labelledby={labelledBy}
      >
        <ul className="flex flex-col gap-6">
          {NAV_ROOMS.map((room, roomIndex) => {
            const roomActive = room.items.some((item) => item.id === highlightId);

            return (
              <li key={room.id} className="brand-nav-item">
                <p
                  className={[
                    "px-3 pb-1.5 text-[12px] font-medium uppercase tracking-[0.12em]",
                    roomActive ? "text-[#9fb5aa]" : "text-cream/30",
                  ].join(" ")}
                >
                  {room.title}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {room.items.map((item, itemIndex) => {
                    const isActive = item.id === highlightId;
                    return (
                      <li
                        key={item.id}
                        style={{
                          animationDelay: `${80 + roomIndex * 90 + itemIndex * 35}ms`,
                        }}
                      >
                        <a
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={[
                            "group relative block rounded-lg px-3 py-2.5 transition-colors duration-300",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]",
                            isActive
                              ? "bg-cream/[0.05]"
                              : "hover:bg-cream/[0.03]",
                          ].join(" ")}
                          onClick={onClose}
                        >
                          <span
                            className={[
                              "block text-[16px] font-semibold leading-snug tracking-normal",
                              isActive
                                ? "text-cream"
                                : "text-cream/90 group-hover:text-cream",
                            ].join(" ")}
                          >
                            {item.title}
                          </span>
                          <span
                            className={[
                              "mt-1 block text-[12px] font-normal leading-none whitespace-nowrap",
                              isActive
                                ? "text-cream/45"
                                : "text-cream/35 group-hover:text-cream/45",
                            ].join(" ")}
                          >
                            {item.description}
                          </span>
                          {isActive ? (
                            <span
                              className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-clay"
                              aria-hidden
                            />
                          ) : null}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative mt-auto border-t border-cream/[0.08] px-3 py-5">
        <a
          href="/hub"
          className="inline-flex items-center gap-2 px-3 text-[12px] font-medium uppercase tracking-[0.12em] text-cream/55 transition-colors hover:text-[#9fb5aa]"
          onClick={onClose}
        >
          <span aria-hidden>←</span>
          Site hub
        </a>
      </div>
    </div>
  );
}

export function BrandNav({
  activeId,
  onClose,
  collapsed,
  onToggle,
}: BrandNavProps) {
  const titleId = useId();

  return (
    <aside
      id="brand-nav-rail"
      className={[
        "brand-nav-rail relative z-40 hidden shrink-0 border-r border-cream/[0.08] bg-[#060807] md:flex md:flex-col",
        collapsed ? "w-[2.75rem]" : "w-[19rem]",
      ].join(" ")}
      aria-label="Brand navigation"
    >
      {collapsed ? (
        <button
          type="button"
          aria-expanded="false"
          aria-controls="brand-nav-links"
          aria-label="Show navigation"
          className="flex h-full w-full flex-col items-center gap-4 pt-6 text-[#9fb5aa] transition-colors hover:bg-cream/[0.03] hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]"
          onClick={onToggle}
        >
          <PanelLeftOpen size={16} aria-hidden />
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] [writing-mode:vertical-rl] rotate-180">
            Nav
          </span>
        </button>
      ) : (
        <BrandNavPanel
          activeId={activeId}
          onClose={onClose}
          labelledBy={titleId}
          onCollapse={onToggle}
        />
      )}
    </aside>
  );
}

type BrandShellProps = {
  children: ReactNode;
  activeId: BrandNavId;
  /** Kept for call-site compatibility; breadcrumb chrome was removed. */
  crumb?: string;
  /** Soft-light grain over the shell. Turn off behind full-bleed shaders. */
  noise?: boolean;
};

export function BrandShell({
  children,
  activeId,
  noise = true,
}: BrandShellProps) {
  const [open, setOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(() =>
    typeof window !== "undefined" ? readNavCollapsed() : false,
  );

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const toggleNav = () => {
    setNavCollapsed((current) => {
      const next = !current;
      writeNavCollapsed(next);
      return next;
    });
  };

  return (
    <div
      className="brand-shell flex min-h-[100dvh] bg-[#080a09] text-cream selection:bg-clay/30 selection:text-cream"
      style={
        {
          "--brand-nav-width": navCollapsed ? NAV_STRIP : NAV_WIDTH,
        } as CSSProperties
      }
    >
      {noise ? <div className="noise-overlay-dark" aria-hidden /> : null}

      <BrandNav
        activeId={activeId}
        onClose={() => setOpen(false)}
        collapsed={navCollapsed}
        onToggle={toggleNav}
      />

      <BrandMobileCurtain
        activeId={activeId}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      />

      <div
        className="relative flex min-w-0 flex-1 flex-col"
        aria-hidden={open || undefined}
        inert={open || undefined}
      >
        <div className="relative flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
