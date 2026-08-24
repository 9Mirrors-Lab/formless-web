import { AUDIBLE_DESK_TABS, type BrandNavId } from "@/components/brandNavData";
import { cn } from "@/lib/utils";

type AudibleDeskTabsProps = {
  activeId: BrandNavId;
};

export function AudibleDeskTabs({ activeId }: AudibleDeskTabsProps) {
  return (
    <nav aria-label="Audible pages" className="flex flex-wrap gap-x-1 border-b border-cream/12">
      {AUDIBLE_DESK_TABS.map((tab) => {
        const active = tab.id === activeId;
        return (
          <a
            key={tab.id}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center border-b-2 px-3 text-sm tracking-wide -mb-px",
              active
                ? "border-cream text-cream"
                : "border-transparent text-cream/45 hover:text-cream/80",
            )}
          >
            {tab.title}
          </a>
        );
      })}
    </nav>
  );
}
