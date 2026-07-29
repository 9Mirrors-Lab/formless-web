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
  | "logo-options"
  | "client-review"
  | "design-system";

export type BrandNavSection = BrandNavId;

type NavItem = {
  id: BrandNavId;
  title: string;
  href: string;
  description: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Materials",
    items: [
      {
        id: "speaker-sheet",
        title: "Speaker sheet",
        href: "/speaker-sheet",
        description: "Venue one-sheets",
      },
      {
        id: "logo-options",
        title: "Logo Options",
        href: "/brand-kit-export",
        description: "Export kit and lockups",
      },
    ],
  },
];

function navIdFromPath(pathname: string): BrandNavId {
  if (pathname === "/speaker-sheet") return "speaker-sheet";
  if (pathname === "/brand-kit-export") return "logo-options";
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
      ? navIdFromPath(window.location.pathname)
      : "brand",
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

      <div className="relative flex items-start justify-between gap-3 px-5 pb-7 pt-[4.25rem]">
        <a
          href="/brand"
          className="group block min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]"
          onClick={onClose}
        >
          <p
            id={labelledBy}
            className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#9fb5aa]"
          >
            Brand studio
          </p>
          <p className="mt-2 font-serif text-[1.65rem] font-light italic leading-none tracking-tight text-cream transition-colors group-hover:text-cream/90">
            Eyes Closed
          </p>
          <p className="mt-2 max-w-[11rem] text-[12px] leading-snug text-cream/40">
            Internal materials and foundations
          </p>
        </a>
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/12 text-cream/70 transition-colors hover:border-cream/25 hover:text-cream md:hidden"
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
        <ul className="flex flex-col gap-7">
          {NAV_GROUPS.map((group, groupIndex) => (
            <li key={group.label}>
              <p className="mb-2.5 px-3 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/35">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item, itemIndex) => {
                  const isActive = item.id === activeId;

                  return (
                    <li
                      key={item.id}
                      className="brand-nav-item"
                      style={{
                        animationDelay: `${80 + groupIndex * 60 + itemIndex * 40}ms`,
                      }}
                    >
                      <a
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={[
                          "group relative flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-300",
                          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]",
                          isActive
                            ? "bg-cream/[0.06] text-cream"
                            : "text-cream/58 hover:bg-cream/[0.03] hover:text-cream/85",
                        ].join(" ")}
                        onClick={onClose}
                      >
                        <span
                          className={[
                            "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300",
                            isActive
                              ? "bg-clay shadow-[0_0_12px_rgba(204,88,51,0.55)]"
                              : "bg-cream/20 group-hover:bg-[#9fb5aa]/70",
                          ].join(" ")}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14px] font-medium tracking-wide">
                            {item.title}
                          </span>
                          <span
                            className={[
                              "mt-0.5 block text-[11px] leading-snug",
                              isActive ? "text-cream/45" : "text-cream/28",
                            ].join(" ")}
                          >
                            {item.description}
                          </span>
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
          ))}
        </ul>
      </nav>

      <div className="relative mt-auto border-t border-cream/[0.08] px-5 py-5">
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
  crumb: string;
};

export function BrandShell({ children, activeId, crumb }: BrandShellProps) {
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
      <div className="noise-overlay-dark" aria-hidden />

      <BrandNav
        activeId={activeId}
        open={open}
        onClose={() => setOpen(false)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-cream/[0.08] bg-[#080a09]/85 px-4 backdrop-blur-md md:px-6">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/12 text-cream/75 transition-colors hover:border-cream/25 hover:text-cream md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" aria-hidden />
          </button>

          <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/45">
            <a
              href="/hub"
              className="hidden transition-colors hover:text-[#9fb5aa] sm:inline"
            >
              Hub
            </a>
            <span className="hidden text-cream/20 sm:inline" aria-hidden>
              /
            </span>
            <a href="/brand" className="transition-colors hover:text-[#9fb5aa]">
              Brand
            </a>
            <span className="text-cream/20" aria-hidden>
              /
            </span>
            <span className="truncate text-cream/75">{crumb}</span>
          </div>
        </header>

        <div className="relative flex-1">{children}</div>
      </div>
    </div>
  );
}
