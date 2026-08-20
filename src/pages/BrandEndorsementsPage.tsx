import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Download, RefreshCw } from 'lucide-react';

import { BrandShell } from '@/components/app-sidebar';
import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  CUT_LABEL,
  CUT_TOGGLE_LABEL,
  ENDORSEMENTS,
  ENDORSEMENT_CUTS,
  ENDORSEMENT_THEMES,
  ENDORSEMENT_VOICES,
  STATUS_LABEL,
  THEME_LABEL,
  VOICE_LABEL,
  attributionLine,
  endorsementDeskHref,
  endorsementFiltersFromSearch,
  endorsementsToText,
  filterEndorsements,
  formatEndorsementCopy,
  preferredCut,
  summarizeEndorsements,
  type Endorsement,
  type EndorsementCut,
  type EndorsementCutKind,
  type EndorsementCutView,
  type EndorsementFilters,
  type EndorsementStatus,
  type EndorsementStatusFilter,
  type EndorsementThemeFilter,
  type EndorsementVoiceFilter,
} from '@/data/endorsements';
import {
  ENDORSEMENT_DOC_EDIT_URL,
  fetchLiveEndorsements,
} from '@/lib/endorsementDoc';

const SELECT_CLASS =
  'h-11 w-full rounded-md border border-cream/15 bg-transparent px-3 font-sans text-sm text-cream focus:border-cream/30 focus:outline-none';

function setFiltersInUrl(filters: EndorsementFilters) {
  window.history.replaceState({}, '', endorsementDeskHref(filters));
}

function downloadVisible(rows: Endorsement[], view: EndorsementCutView) {
  const blob = new Blob([endorsementsToText(rows, view)], {
    type: 'text/plain;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `formless-endorsements-${view}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function quoteClass(kind: EndorsementCutKind): string {
  switch (kind) {
    case 'full':
      return 'whitespace-pre-line font-sans text-[0.9375rem] leading-[1.6] text-cream/90 md:text-[1rem]';
    case 'trimmed':
      return 'font-sans text-[1.0625rem] leading-[1.55] text-cream md:text-[1.125rem]';
    case 'pull':
      return 'font-sans text-[1.125rem] leading-[1.5] text-cream md:text-[1.1875rem]';
    default: {
      const _never: never = kind;
      return _never;
    }
  }
}

function mixLine(
  visible: number,
  voice: EndorsementVoiceFilter,
  theme: EndorsementThemeFilter,
  status: EndorsementStatusFilter,
): string {
  if (status === 'needs-trim') {
    return `${visible} ${visible === 1 ? 'letter still needs' : 'letters still need'} a short version.`;
  }
  if (status === 'needs-pick') {
    return `${visible} ${visible === 1 ? 'letter still needs' : 'letters still need'} a version pick.`;
  }
  if (voice !== 'all') {
    return `${visible} ${VOICE_LABEL[voice].toLowerCase()} ${visible === 1 ? 'voice' : 'voices'}.`;
  }
  if (theme !== 'all') {
    return `${visible} on ${THEME_LABEL[theme].toLowerCase()}.`;
  }
  return `${visible} ${visible === 1 ? 'voice' : 'voices'}.`;
}

function cutHeading(cut: EndorsementCut): string {
  const variant = cut.variant ? ` ${cut.variant.toUpperCase()}` : '';
  return `${CUT_LABEL[cut.kind]}${variant}`;
}

export default function BrandEndorsementsPage() {
  const reduceMotion = usePrefersReducedMotion();
  const [filters, setFilters] = useState<EndorsementFilters>(() =>
    endorsementFiltersFromSearch(window.location.search),
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [rows, setRows] = useState<Endorsement[]>(ENDORSEMENTS);
  const [source, setSource] = useState<'live' | 'fallback' | 'local'>('local');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    const result = await fetchLiveEndorsements({ refresh: isRefresh });
    if (result.ok) {
      setRows(result.rows);
      setSource(result.source);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const summary = useMemo(
    () => summarizeEndorsements(rows),
    [rows],
  );
  const visible = useMemo(
    () => filterEndorsements(rows, filters),
    [filters, rows],
  );

  function update(next: Partial<EndorsementFilters>) {
    setFilters((current) => {
      const merged = { ...current, ...next };
      setFiltersInUrl(merged);
      return merged;
    });
  }

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1400);
    } catch {
      setCopiedKey(null);
    }
  }

  const filterControls = (
    <FilterControls
      filters={filters}
      summary={summary}
      onUpdate={update}
    />
  );

  return (
    <BrandShell activeId="endorsements" crumb="Endorsements">
      <BrandPageBody>
        <div className="flex flex-col gap-6 md:gap-8">
          <BrandPageHeader
            title="Endorsements"
            description="Original letter, short version, and one-liner. New letters in the Google Doc show up here."
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void load(true)}
                  disabled={refreshing}
                  className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-cream/12 px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/70 transition-colors hover:border-cream/25 hover:text-cream disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
                    aria-hidden
                  />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={() => downloadVisible(visible, filters.cut)}
                  disabled={visible.length === 0}
                  className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-clay px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-clay/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  Export
                </button>
              </div>
            }
          />

          <div className="lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[17rem_minmax(0,1fr)]">
            <aside
              className="sticky top-3 z-10 border-b border-cream/10 bg-[#080a09] pb-5 lg:max-h-[calc(100dvh-5rem)] lg:self-start lg:overflow-y-auto lg:border lg:border-cream/10 lg:p-4 lg:pb-4"
              aria-label="Filter endorsements"
            >
              {filterControls}
            </aside>

            <div className="min-w-0">
              <p className="border-b border-cream/12 pb-3 font-sans text-sm text-cream/55">
                {mixLine(
                  visible.length,
                  filters.voice,
                  filters.theme,
                  filters.status,
                )}{' '}
                <a
                  href={ENDORSEMENT_DOC_EDIT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cream/40 underline decoration-cream/20 underline-offset-4 transition-colors hover:text-cream/70"
                >
                  {source === 'live' ? 'Google Doc' : 'Saved copy'}
                </a>
              </p>

              {visible.length === 0 ? (
                <p className="py-10 font-sans text-sm text-cream/45">
                  No endorsements match this filter.
                </p>
              ) : (
                <ul className="divide-y divide-cream/10">
                  <AnimatePresence initial={false}>
                    {visible.map((row, index) => {
                      const shown = preferredCut(row, filters.cut);
                      const open = openId === row.id;
                      const copyKey = `${row.id}:${shown.id}`;

                      return (
                        <motion.li
                          key={row.id}
                          layout={!reduceMotion}
                          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                          transition={{
                            duration: 0.22,
                            delay: reduceMotion ? 0 : Math.min(index, 12) * 0.02,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="py-7 md:py-8"
                        >
                          <article>
                            <p className={quoteClass(shown.kind)}>
                              {shown.kind === 'full'
                                ? shown.text
                                : `“${shown.text}”`}
                            </p>
                            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                              <div className="min-w-0">
                                <p className="font-sans text-sm text-cream">
                                  {row.name}
                                </p>
                                <p className="mt-0.5 text-[12px] text-cream/50">
                                  {row.role}
                                </p>
                                {row.status !== 'ready' ? (
                                  <p className="mt-2 text-[12px] text-clay">
                                    {STATUS_LABEL[row.status]}
                                    {row.note ? `. ${row.note}` : ''}
                                  </p>
                                ) : row.note ? (
                                  <p className="mt-2 text-[12px] text-cream/40">
                                    {row.note}
                                  </p>
                                ) : null}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    void copyText(
                                      copyKey,
                                      formatEndorsementCopy(row, shown),
                                    )
                                  }
                                  className="inline-flex h-11 items-center gap-2 rounded-full border border-cream/12 px-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
                                >
                                  <Copy className="h-3.5 w-3.5" aria-hidden />
                                  {copiedKey === copyKey ? 'Copied' : 'Copy'}
                                </button>
                                <button
                                  type="button"
                                  aria-expanded={open}
                                  onClick={() =>
                                    setOpenId((current) =>
                                      current === row.id ? null : row.id,
                                    )
                                  }
                                  className="inline-flex h-11 items-center rounded-full border border-cream/12 px-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
                                >
                                  {open ? 'Hide versions' : 'See versions'}
                                </button>
                              </div>
                            </div>

                            {open ? (
                              <CutLadder
                                endorsement={row}
                                copiedKey={copiedKey}
                                onCopy={copyText}
                              />
                            ) : null}
                          </article>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          </div>
        </div>
      </BrandPageBody>
    </BrandShell>
  );
}

function FilterControls({
  filters,
  summary,
  onUpdate,
}: {
  filters: EndorsementFilters;
  summary: ReturnType<typeof summarizeEndorsements>;
  onUpdate: (next: Partial<EndorsementFilters>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-sans text-sm text-cream">Filter</p>

      <label className="block">
        <span className="sr-only">Search endorsements</span>
        <input
          type="search"
          value={filters.query}
          onChange={(event) => onUpdate({ query: event.target.value })}
          placeholder="Search name or words"
          className="h-11 w-full rounded-md border border-cream/15 bg-transparent px-3 font-sans text-sm text-cream placeholder:text-cream/30 focus:border-cream/30 focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
        <FilterSelect
          label="Length"
          value={filters.cut}
          onChange={(value) =>
            onUpdate({ cut: value as EndorsementCutView })
          }
          options={ENDORSEMENT_CUTS.map((cut) => ({
            value: cut,
            label: CUT_TOGGLE_LABEL[cut],
          }))}
        />
        <FilterSelect
          label="Who"
          value={filters.voice}
          onChange={(value) =>
            onUpdate({ voice: value as EndorsementVoiceFilter })
          }
          options={[
            { value: 'all', label: `Everyone (${summary.total})` },
            ...ENDORSEMENT_VOICES.map((voice) => ({
              value: voice,
              label: `${VOICE_LABEL[voice]} (${summary.byVoice[voice]})`,
            })),
          ]}
        />
        <FilterSelect
          label="Theme"
          value={filters.theme}
          onChange={(value) =>
            onUpdate({ theme: value as EndorsementThemeFilter })
          }
          options={[
            { value: 'all', label: 'All themes' },
            ...ENDORSEMENT_THEMES.map((theme) => ({
              value: theme,
              label: `${THEME_LABEL[theme]} (${summary.byTheme[theme]})`,
            })),
          ]}
        />
        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(value) =>
            onUpdate({ status: value as EndorsementStatusFilter })
          }
          options={[
            { value: 'all', label: 'All letters' },
            { value: 'ready', label: 'Ready' },
            {
              value: 'needs-trim',
              label: `Needs short (${summary.byStatus['needs-trim']})`,
            },
            {
              value: 'needs-pick',
              label: `Needs a pick (${summary.byStatus['needs-pick']})`,
            },
          ]}
        />
      </div>

      <div className="hidden lg:flex lg:flex-col lg:gap-4">
        <FilterGroup legend="Length">
          {ENDORSEMENT_CUTS.map((cut) => (
            <FilterRow
              key={cut}
              label={CUT_TOGGLE_LABEL[cut]}
              active={filters.cut === cut}
              onClick={() => onUpdate({ cut })}
            />
          ))}
        </FilterGroup>

        <FilterGroup legend="Who">
          <FilterRow
            label="Everyone"
            count={summary.total}
            active={filters.voice === 'all'}
            onClick={() => onUpdate({ voice: 'all' })}
          />
          {ENDORSEMENT_VOICES.map((voice) => (
            <FilterRow
              key={voice}
              label={VOICE_LABEL[voice]}
              count={summary.byVoice[voice]}
              active={filters.voice === voice}
              onClick={() => onUpdate({ voice })}
            />
          ))}
        </FilterGroup>

        <FilterGroup legend="Theme">
          <FilterRow
            label="All"
            active={filters.theme === 'all'}
            onClick={() => onUpdate({ theme: 'all' })}
          />
          {ENDORSEMENT_THEMES.map((theme) => (
            <FilterRow
              key={theme}
              label={THEME_LABEL[theme]}
              count={summary.byTheme[theme]}
              active={filters.theme === theme}
              onClick={() => onUpdate({ theme })}
            />
          ))}
        </FilterGroup>

        <FilterGroup legend="Status">
          <FilterRow
            label="All"
            active={filters.status === 'all'}
            onClick={() => onUpdate({ status: 'all' })}
          />
          {(['ready', 'needs-trim', 'needs-pick'] as const).map((status) => (
            <FilterRow
              key={status}
              label={statusRowLabel(status)}
              count={
                status === 'ready' ? undefined : summary.byStatus[status]
              }
              active={filters.status === status}
              onClick={() =>
                onUpdate({
                  status: filters.status === status ? 'all' : status,
                })
              }
            />
          ))}
        </FilterGroup>
      </div>
    </div>
  );
}

function statusRowLabel(status: EndorsementStatus): string {
  switch (status) {
    case 'ready':
      return 'Ready';
    case 'needs-trim':
      return 'Needs short';
    case 'needs-pick':
      return 'Needs a pick';
    default: {
      const _never: never = status;
      return _never;
    }
  }
}

function FilterGroup({
  legend,
  children,
}: {
  legend: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[12px] text-cream/45">{legend}</p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function FilterRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        'flex min-h-8 w-full items-center justify-between gap-3 border-l-2 px-2.5 text-left text-[13px] leading-snug transition-colors',
        active
          ? 'border-clay text-cream'
          : 'border-transparent text-cream/50 hover:text-cream/80',
      ].join(' ')}
    >
      <span className="min-w-0 truncate">{label}</span>
      {count != null ? (
        <span className={active ? 'text-cream/55' : 'text-cream/30'}>
          {count}
        </span>
      ) : null}
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  const selectId = `endorsement-filter-${label.toLowerCase()}`;
  return (
    <label className="block" htmlFor={selectId}>
      <span className="mb-1.5 block text-[12px] text-cream/45">{label}</span>
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={SELECT_CLASS}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CutLadder({
  endorsement,
  copiedKey,
  onCopy,
}: {
  endorsement: Endorsement;
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
}) {
  return (
    <div className="mt-6 border-t border-cream/10 pt-5">
      <p className="sr-only">
        Original, short, and one-line versions for {endorsement.name}
      </p>
      <ul className="flex flex-col gap-6">
        {endorsement.cuts.map((cut) => {
          const key = `${endorsement.id}:${cut.id}:ladder`;
          return (
            <li key={cut.id} className="min-w-0">
              <p className="mb-2 text-[12px] text-cream/40">
                {cutHeading(cut)}
              </p>
              <p className={quoteClass(cut.kind)}>
                {cut.kind === 'full' ? cut.text : `“${cut.text}”`}
              </p>
              <p className="mt-2 text-[12px] text-cream/40">
                {attributionLine(endorsement)}
              </p>
              <button
                type="button"
                onClick={() =>
                  onCopy(key, formatEndorsementCopy(endorsement, cut))
                }
                className="mt-3 inline-flex h-11 items-center gap-2 rounded-full border border-cream/12 px-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
              >
                <Copy className="h-3.5 w-3.5" aria-hidden />
                {copiedKey === key ? 'Copied' : 'Copy'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
