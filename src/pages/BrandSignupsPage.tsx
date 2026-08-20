import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Download, RefreshCw } from 'lucide-react';

import { BrandShell } from '@/components/app-sidebar';
import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  SIGNUP_LISTS,
  fetchSiteSignups,
  filterSignups,
  signupDeskListFromSearch,
  signupListLabel,
  signupListPath,
  signupMetricHelp,
  signupsToCsv,
  summarizeSignups,
  type SignupDeskList,
  type SignupMetricKey,
  type SiteSignup,
} from '@/lib/siteSignups';

const DISPLAY_LISTS = SIGNUP_LISTS.filter((list) => list !== 'account');

type LoadState = 'loading' | 'ready' | 'error';
type ListFilter = SignupDeskList | 'all';

function setSignupListInUrl(list: ListFilter) {
  const url = new URL(window.location.href);
  if (list === 'all') url.searchParams.delete('list');
  else url.searchParams.set('list', list);
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function downloadCsv(rows: SiteSignup[]) {
  const blob = new Blob([signupsToCsv(rows)], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `eyes-closed-signups-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function BrandSignupsPage() {
  const reduceMotion = usePrefersReducedMotion();
  const [state, setState] = useState<LoadState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<SiteSignup[]>([]);
  const [listFilter, setListFilter] = useState<ListFilter>(() =>
    signupDeskListFromSearch(window.location.search),
  );
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setState('loading');

    const result = await fetchSiteSignups();
    if (!result.ok) {
      setError(result.error);
      setRows([]);
      setState('error');
      setRefreshing(false);
      return;
    }

    setRows(result.rows);
    setError(null);
    setState('ready');
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const summary = useMemo(() => summarizeSignups(rows), [rows]);
  const visible = useMemo(
    () => filterSignups(rows, { list: listFilter, query }),
    [listFilter, query, rows],
  );

  async function copyEmail(row: SiteSignup) {
    try {
      await navigator.clipboard.writeText(row.email);
      setCopiedId(row.id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === row.id ? null : current));
      }, 1400);
    } catch {
      setCopiedId(null);
    }
  }

  const metrics: Array<{
    key: SignupMetricKey;
    label: string;
    value: number;
  }> = [
    { key: 'people', label: 'People', value: summary.uniqueEmails },
    { key: 'entries', label: 'Entries', value: summary.total },
    ...DISPLAY_LISTS.map((list) => ({
      key: list,
      label: signupListLabel(list),
      value: summary.byList[list],
    })),
  ];

  return (
    <BrandShell activeId="signups" crumb="Signups">
      <BrandPageBody>
        <div className="flex flex-col gap-6 md:gap-8">
          <BrandPageHeader
            title="Signups"
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void load(true)}
                  disabled={state === 'loading' || refreshing}
                  className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-cream/15 px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/70 transition-colors hover:border-cream/30 hover:text-cream disabled:opacity-50"
                >
                  <RefreshCw
                    className={['h-3.5 w-3.5', refreshing ? 'animate-spin' : ''].join(' ')}
                    aria-hidden
                  />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={() => downloadCsv(visible)}
                  disabled={visible.length === 0}
                  className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-clay px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-clay/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  Export CSV
                </button>
              </div>
            }
          />

          <TooltipProvider delayDuration={180}>
            <motion.section
              aria-label="Signup counts"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 border-y border-cream/10 sm:grid-cols-3 lg:grid-cols-5"
            >
              {metrics.map((metric) => (
                <Tooltip key={metric.key}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="flex h-full cursor-help flex-col gap-1 px-3 py-4 text-left transition-colors hover:bg-cream/[0.035] md:px-5"
                    >
                      <span className="truncate whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">
                        {metric.label}
                      </span>
                      <span className="font-serif text-[1.65rem] leading-none text-cream md:text-[1.85rem]">
                        {state === 'loading' ? '—' : metric.value}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={6}
                    className="max-w-[17rem] border border-cream/10 bg-[#1a1f1c] px-3 py-2 text-left text-[12px] leading-snug text-cream"
                  >
                    <p className="font-medium text-cream">{metric.label}</p>
                    <p className="mt-1 text-cream/65">{signupMetricHelp(metric.key)}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </motion.section>
          </TooltipProvider>

          {summary.overlapCount > 0 && state === 'ready' ? (
            <p className="font-sans text-xs text-cream/45">
              {summary.overlapCount}{' '}
              {summary.overlapCount === 1 ? 'person appears' : 'people appear'} on more
              than one list.
            </p>
          ) : null}

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div
              className="flex flex-wrap gap-1.5"
              role="tablist"
              aria-label="Filter by list"
            >
              {(
                [
                  { id: 'all' as const, label: 'All' },
                  ...DISPLAY_LISTS.map((list) => ({
                    id: list,
                    label: signupListLabel(list),
                  })),
                ]
              ).map((item) => {
                const active = listFilter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setListFilter(item.id);
                      setSignupListInUrl(item.id);
                    }}
                    className={[
                      'h-10 rounded-full px-3.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors',
                      active
                        ? 'bg-cream/12 text-cream'
                        : 'text-cream/45 hover:bg-cream/[0.06] hover:text-cream/75',
                    ].join(' ')}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <label className="relative block w-full md:max-w-xs">
              <span className="sr-only">Search emails</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search email or list"
                className="h-11 w-full rounded-full border border-cream/15 bg-transparent px-4 font-sans text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-cream/30 focus:outline-none"
              />
            </label>
          </div>

          {state === 'error' ? (
            <p className="font-sans text-sm text-clay" role="alert">
              Could not load signups. {error}
            </p>
          ) : null}

          {state === 'loading' ? (
            <div className="flex flex-col gap-3" aria-busy="true">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="h-14 rounded-lg bg-cream/[0.04]"
                />
              ))}
            </div>
          ) : null}

          {state === 'ready' && visible.length === 0 ? (
            <p className="py-10 font-sans text-sm text-cream/45">
              {rows.length === 0
                ? 'No emails collected yet.'
                : 'No signups match this filter.'}
            </p>
          ) : null}

          {state === 'ready' && visible.length > 0 ? (
            <div className="min-w-0">
              <div className="hidden border-b border-cream/10 pb-2 md:grid md:grid-cols-[minmax(0,1.6fr)_9.5rem_7rem_auto] md:gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">
                  Email
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">
                  List
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">
                  Added
                </p>
                <p className="sr-only">Copy</p>
              </div>

              <ul className="divide-y divide-cream/10">
                <AnimatePresence initial={false}>
                  {visible.map((row, index) => (
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
                      className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[minmax(0,1.6fr)_9.5rem_7rem_auto] md:items-center md:gap-4 md:py-3.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-sans text-sm text-cream">{row.email}</p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cream/30 md:hidden">
                          {signupListLabel(row.list)} · {formatWhen(row.createdAt)}
                        </p>
                      </div>
                      <p className="hidden font-sans text-sm text-cream/55 md:block">
                        <span className="block">{signupListLabel(row.list)}</span>
                        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-cream/28">
                          {signupListPath(row.list)}
                        </span>
                      </p>
                      <p className="hidden font-sans text-sm text-cream/45 md:block">
                        {formatWhen(row.createdAt)}
                      </p>
                      <div className="flex justify-start md:justify-end">
                        <button
                          type="button"
                          onClick={() => void copyEmail(row)}
                          className="inline-flex h-11 items-center gap-2 rounded-full border border-cream/12 px-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
                        >
                          <Copy className="h-3.5 w-3.5" aria-hidden />
                          {copiedId === row.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          ) : null}
        </div>
      </BrandPageBody>
    </BrandShell>
  );
}
