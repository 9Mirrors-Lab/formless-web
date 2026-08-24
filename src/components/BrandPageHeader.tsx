import type { ReactNode } from "react";

type BrandPageHeaderProps = {
  /** Optional section cue. Prefer omitting when the shell breadcrumb already names the page. */
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Desk pages use sans. Editorial pages keep the serif title. */
  tone?: "editorial" | "desk";
};

/** Shared top block for Brand Toolkit pages. Keep this structure identical across materials. */
export function BrandPageHeader({
  eyebrow,
  title,
  description,
  actions,
  tone = "editorial",
}: BrandPageHeaderProps) {
  return (
    <header className="flex flex-col gap-2 text-left md:flex-row md:items-end md:justify-between md:gap-6">
      <div className="min-w-0 max-w-3xl">
        {eyebrow ? (
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#9fb5aa]/70">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={
            tone === "desk"
              ? "font-sans text-[1.65rem] font-semibold leading-[1.08] tracking-[-0.03em] text-cream sm:text-[1.85rem] md:text-[2.05rem]"
              : "font-serif text-[1.75rem] italic leading-[1.05] tracking-[-0.02em] text-cream sm:text-[2rem] md:text-[2.25rem]"
          }
        >
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-xl text-[0.8125rem] leading-snug text-cream/55 md:mt-2 md:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </header>
  );
}

export function BrandPageBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-2 md:gap-5 md:px-8 md:pb-8 md:pt-2.5 lg:px-10 lg:pb-10">
      {children}
    </div>
  );
}
