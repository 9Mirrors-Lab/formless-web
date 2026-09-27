import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, RefreshCw } from 'lucide-react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  fetchSonikaInquiries,
  inquirySourceLabel,
  inquirySourcePath,
  type SonikaInquiryRow,
} from '@/lib/sonikaInquiries';

type LoadState = 'loading' | 'ready' | 'error';

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

function filterInquiries(
  rows: SonikaInquiryRow[],
  query: string,
): SonikaInquiryRow[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return rows;

  return rows.filter((row) => {
    const haystack = [
      row.question,
      row.name,
      row.email,
      row.topic,
      row.source,
      inquirySourceLabel(row.source),
      inquirySourcePath(row.source),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export type InquiriesDeskProps = {
  onActionsChange?: (actions: ReactNode) => void;
};

export function InquiriesDesk({ onActionsChange }: InquiriesDeskProps = {}) {
  const reduceMotion = usePrefersReducedMotion();
  const [state, setState] = useState<LoadState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<SonikaInquiryRow[]>([]);
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setState('loading');

    const result = await fetchSonikaInquiries();
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

  const visible = useMemo(() => filterInquiries(rows, query), [query, rows]);

  const actions = useMemo(
    () => (
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
    ),
    [load, refreshing, state],
  );

  useEffect(() => {
    onActionsChange?.(actions);
  }, [actions, onActionsChange]);

  async function copyQuestion(row: SonikaInquiryRow) {
    try {
      await navigator.clipboard.writeText(row.question);
      setCopiedId(row.id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === row.id ? null : current));
      }, 1400);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {!onActionsChange ? actions : null}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="font-sans text-sm text-cream/45">
          {state === 'ready' ? `${rows.length} submitted` : 'Questions from /inquire'}
        </p>
        <label className="relative block w-full md:max-w-xs">
          <span className="sr-only">Search inquiries</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search question, name, or email"
            className="h-11 w-full rounded-full border border-cream/15 bg-transparent px-4 font-sans text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-cream/30 focus:outline-none"
          />
        </label>
      </div>

      {state === 'error' ? (
        <p className="font-sans text-sm text-clay" role="alert">
          Could not load inquiries. {error}
        </p>
      ) : null}

      {state === 'loading' ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-20 rounded-lg bg-cream/[0.04]" />
          ))}
        </div>
      ) : null}

      {state === 'ready' && visible.length === 0 ? (
        <p className="py-10 font-sans text-sm text-cream/45">
          {rows.length === 0
            ? 'No inquiries submitted yet.'
            : 'No inquiries match this search.'}
        </p>
      ) : null}

      {state === 'ready' && visible.length > 0 ? (
        <div className="min-w-0">
          <div className="hidden border-b border-cream/10 pb-2 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,0.7fr)_minmax(0,0.9fr)_7rem_6rem_auto] md:gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">
              Question
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">
              Name
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">
              Email
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">
              Source
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">
              When
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
                  className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[minmax(0,2fr)_minmax(0,0.7fr)_minmax(0,0.9fr)_7rem_6rem_auto] md:items-start md:gap-4 md:py-3.5"
                >
                  <div className="min-w-0">
                    <p className="font-sans text-sm leading-snug text-cream">{row.question}</p>
                    {row.topic ? (
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cream/35">
                        {row.topic}
                      </p>
                    ) : null}
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cream/30 md:hidden">
                      {[row.name, row.email, inquirySourceLabel(row.source), formatWhen(row.createdAt)]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                  <p className="hidden truncate font-sans text-sm text-cream/70 md:block">
                    {row.name ?? '—'}
                  </p>
                  <p className="hidden truncate font-sans text-sm text-cream/55 md:block">
                    {row.email ?? '—'}
                  </p>
                  <p className="hidden font-sans text-sm text-cream/55 md:block">
                    <span className="block">{inquirySourceLabel(row.source)}</span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-cream/28">
                      {inquirySourcePath(row.source)}
                    </span>
                  </p>
                  <p className="hidden font-sans text-sm text-cream/45 md:block">
                    {formatWhen(row.createdAt)}
                  </p>
                  <div className="flex justify-start md:justify-end">
                    <button
                      type="button"
                      onClick={() => void copyQuestion(row)}
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
  );
}
