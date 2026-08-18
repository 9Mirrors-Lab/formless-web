import {
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";

import { BrandMobileCurtain } from "@/components/BrandMobileCurtain";
import {
  NAV_ROOMS,
  navIdFromPath,
  type BrandNavId,
} from "@/components/brandNavData";

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
};

function BrandNavPanel({
  activeId,
  onClose,
  labelledBy,
}: {
  activeId: BrandNavId;
  onClose: () => void;
  labelledBy: string;
}) {
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

      <div className="relative flex min-h-[135px] flex-col items-start justify-center px-3 pb-5 pt-5">
        <a
          href="/brand"
          className="group block w-full min-w-0 px-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]"
          onClick={onClose}
        >
          <p
            id={labelledBy}
            className="text-[12px] font-medium uppercase tracking-[0.12em] text-[#9fb5aa]"
          >
            Brand Toolkit
          </p>
          <p className="mt-2 font-serif text-[1.85rem] font-light italic leading-none tracking-tight text-cream transition-colors group-hover:text-cream/90">
            Eyes Closed
          </p>
        </a>
      </div>

      <nav
        className="relative flex-1 overflow-y-auto px-3 pb-6"
        aria-labelledby={labelledBy}
      >
        <ul className="flex flex-col gap-6">
          {NAV_ROOMS.map((room, roomIndex) => {
            const roomActive = room.items.some((item) => item.id === activeId);

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
                    const isActive = item.id === activeId;
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
                            "group relative block rounded-lg px-3 py-2 transition-colors duration-300",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]",
                            isActive
                              ? "bg-cream/[0.05] text-cream"
                              : "text-cream/50 hover:bg-cream/[0.03] hover:text-cream/80",
                          ].join(" ")}
                          onClick={onClose}
                        >
                          <span className="block text-[12px] font-normal tracking-wide">
                            {item.title}
                          </span>
                          <span
                            className={[
                              "mt-0.5 block text-[12px] leading-[1.4]",
                              isActive ? "text-cream/55" : "text-cream/40",
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
          className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.12em] text-cream/55 transition-colors hover:text-[#9fb5aa]"
          onClick={onClose}
        >
          <span aria-hidden>←</span>
          Site hub
        </a>
      </div>
    </div>
  );
}

export function BrandNav({ activeId, onClose }: BrandNavProps) {
  const titleId = useId();

  return (
    <aside
      className="brand-nav-rail relative z-30 hidden w-[15.5rem] shrink-0 border-r border-cream/[0.08] bg-[#060807] md:flex md:flex-col"
      aria-label="Brand navigation"
    >
      <BrandNavPanel
        activeId={activeId}
        onClose={onClose}
        labelledBy={titleId}
      />
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

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="brand-shell flex min-h-[100dvh] bg-[#080a09] text-cream selection:bg-clay/30 selection:text-cream">
      {noise ? <div className="noise-overlay-dark" aria-hidden /> : null}

      <BrandNav
        activeId={activeId}
        onClose={() => setOpen(false)}
      />

      <BrandMobileCurtain
        activeId={activeId}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="relative flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
