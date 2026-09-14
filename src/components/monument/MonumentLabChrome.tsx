import { DesignReviewSwitcher } from '@/components/design-lab/DesignReviewSwitcher';
import { MONUMENT, MONUMENT_LAB_LINKS, type MonumentLabRoute } from './monumentShared';

type MonumentLabChromeProps = {
  active: MonumentLabRoute;
};

export function MonumentLabChrome({ active }: MonumentLabChromeProps) {
  return (
    <DesignReviewSwitcher
      ariaLabel="Monument page layout"
      activeId={active}
      items={MONUMENT_LAB_LINKS.map((link, i) => ({
        id: link.id,
        index: String(i + 1).padStart(2, '0'),
        label: link.label,
        href: link.href,
      }))}
    />
  );
}

export function MonumentLabFooter({ note }: { note: string }) {
  return (
    <footer
      className="border-t px-6 py-12 pb-28 text-center md:px-16"
      style={{ borderColor: MONUMENT.rule }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MONUMENT.textFaint }}>
        Monument lab · exploratory only · not production branding
      </p>
      <p className="mt-3 font-serif text-sm not-italic" style={{ color: MONUMENT.textMuted }}>
        {note}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-5 font-mono text-[10px] uppercase tracking-[0.18em]">
        <a href="/" style={{ color: MONUMENT.turquoiseGray }}>
          Production home
        </a>
        <a href="/book" style={{ color: MONUMENT.turquoiseGray }}>
          Production book
        </a>
        <a href="/design-lab" style={{ color: MONUMENT.turquoiseGray }}>
          Lab
        </a>
      </div>
    </footer>
  );
}
