import {
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { Menu, X } from "lucide-react";

export type BrandNavId =
    | "brand"
    | "speaker-sheet"
    | "audible"
    | "audible-analysis"
    | "audible-studio"
    | "zoom-backgrounds"
    | "brand-kit"
    | "client-review"
    | "design-system";

export type BrandNavSection = BrandNavId;

type NavChild = {
  id: BrandNavId;
  title: string;
  href: string;
  description: string;
};

type NavItem = {
  id: BrandNavId;
  title: string;
  href: string;
  description: string;
  children?: NavChild[];
};

const NAV_ITEMS: NavItem[] = [
  {
    id: "speaker-sheet",
    title: "Speaker sheet",
    href: "/speaker-sheet",
    description: "Venue one-sheets",
  },
  {
    id: "audible",
    title: "Audible",
    href: "/audio/editorial",
    description: "Audible master",
    children: [
      {
        id: "audible-analysis",
        title: "Analysis",
        href: "/audio/editorial?view=analysis",
        description: "Recording report · Master phases",
      },
      {
        id: "audible-studio",
        title: "Studio ladder",
        href: "/audio/editorial2",
        description: "File status toward Audible",
      },
    ],
  },
  {
    id: "zoom-backgrounds",
    title: "Zoom backgrounds",
    href: "/zoom-backgrounds",
    description: "Virtual session backdrops",
  },
  {
    id: "brand-kit",
    title: "Logo Options",
    href: "/brand-kit-export",
    description: "Download logos.",
  },
];

function navIdFromPath(
  pathname: string,
  search: string = typeof window !== "undefined" ? window.location.search : "",
): BrandNavId {
  if (pathname === "/speaker-sheet") return "speaker-sheet";
  if (pathname === "/audio/companion" || pathname.startsWith("/audio/companion")) {
    return "audible";
  }
  if (pathname === "/advance-listen" || pathname.startsWith("/advance-listen")) {
    return "audible";
  }
  if (pathname === "/audio/editorial2" || pathname.startsWith("/audio/editorial2")) {
    return "audible-studio";
  }
  if (pathname === "/audio/editorial-v2" || pathname.startsWith("/audio/editorial-v2")) {
    return "audible";
  }
  if (pathname === "/audio/editorial" || pathname.startsWith("/audio/editorial")) {
    const view = new URLSearchParams(search).get("view");
    if (view === "analysis" || view === "master-phases") return "audible-analysis";
    return "audible";
  }
  if (pathname === "/zoom-backgrounds") return "zoom-backgrounds";
  if (pathname === "/brand-kit-export") return "brand-kit";
  if (pathname === "/design-system") return "design-system";
  if (pathname === "/client/review" || pathname.startsWith("/client/review/")) {
    return "client-review";
  }
  if (pathname === "/brand") return "brand";
  return "brand";
}

export function useBrandNavActive(): BrandNavId {
  const [active, setActive] = useState<BrandNavId>(() =>
    typeof window !== "undefined"
      ? navIdFromPath(window.location.pathname, window.location.search)
      : "brand",
  );

  useEffect(() => {
    const sync = () =>
      setActive(navIdFromPath(window.location.pathname, window.location.search));
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
  open: boolean;
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
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9fb5aa]"
          >
            Brand Toolkit
          </p>
          <p className="mt-2 font-serif text-[1.85rem] font-light italic leading-none tracking-tight text-cream transition-colors group-hover:text-cream/90">
            Eyes Closed
          </p>
        </a>
        <button
          type="button"
          className="absolute right-3 top-5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream/12 text-cream/70 transition-colors hover:border-cream/25 hover:text-cream md:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <nav
        className="relative flex-1 overflow-y-auto px-3 pb-6"
        aria-labelledby={labelledBy}
      >
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item, itemIndex) => {
            const isActive = item.id === activeId;
            const childActive = item.children?.some((child) => child.id === activeId) ?? false;
            const groupActive = isActive || childActive;

            return (
              <li
                key={item.id}
                className="brand-nav-item"
                style={{
                  animationDelay: `${80 + itemIndex * 40}ms`,
                }}
              >
                <a
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "group relative block rounded-lg px-3 py-2 transition-colors duration-300",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]",
                    groupActive
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
                      "mt-0.5 block text-[10px] leading-snug",
                      groupActive ? "text-cream/40" : "text-cream/25",
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

                {item.children && item.children.length > 0 ? (
                  <ul className="mt-0.5 ml-3 border-l border-cream/[0.08] pl-2">
                    {item.children.map((child) => {
                      const isChildActive = child.id === activeId;
                      return (
                        <li key={child.id}>
                          <a
                            href={child.href}
                            aria-current={isChildActive ? "page" : undefined}
                            className={[
                              "group relative block rounded-lg px-3 py-1.5 transition-colors duration-300",
                              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]",
                              isChildActive
                                ? "bg-cream/[0.05] text-cream"
                                : "text-cream/40 hover:bg-cream/[0.03] hover:text-cream/70",
                            ].join(" ")}
                            onClick={onClose}
                          >
                            <span className="block text-[11px] font-normal tracking-wide">
                              {child.title}
                            </span>
                            <span
                              className={[
                                "mt-0.5 block text-[10px] leading-snug",
                                isChildActive ? "text-cream/40" : "text-cream/20",
                              ].join(" ")}
                            >
                              {child.description}
                            </span>
                            {isChildActive ? (
                              <span
                                className="absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-clay"
                                aria-hidden
                              />
                            ) : null}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative mt-auto border-t border-cream/[0.08] px-3 py-5">
        <a
          href="/hub"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40 transition-colors hover:text-[#9fb5aa]"
          onClick={onClose}
        >
          <span aria-hidden>←</span>
          Site hub
        </a>
      </div>
    </div>
  );
}

export function BrandNav({ activeId, open, onClose }: BrandNavProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
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

      <div
        className={[
          "fixed inset-0 z-40 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={[
            "absolute inset-0 bg-[#050806]/72 backdrop-blur-[2px] transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
          aria-label="Dismiss navigation"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
        />
        <aside
          className={[
            "absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col border-r border-cream/[0.1] bg-[#060807] shadow-[20px_0_60px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          aria-label="Brand navigation"
          aria-hidden={!open}
        >
          <BrandNavPanel
            activeId={activeId}
            onClose={onClose}
            labelledBy={`${titleId}-mobile`}
          />
        </aside>
      </div>
    </>
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
        open={open}
        onClose={() => setOpen(false)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-10 shrink-0 items-center gap-2 border-b border-cream/[0.08] bg-[#080a09]/85 px-4 backdrop-blur-md md:h-10 md:px-6">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-cream/12 text-cream/75 transition-colors hover:border-cream/25 hover:text-cream md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-3.5 w-3.5" aria-hidden />
          </button>
        </header>

        <div className="relative flex-1">{children}</div>
      </div>
    </div>
  );
}
