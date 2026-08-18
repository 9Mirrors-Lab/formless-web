import { useId, useMemo } from 'react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  AUDIENCE_CHARTS,
  signupHistoryBuckets,
  signupWeekSeries,
  type PulseLoad,
} from '@/lib/brandPulse';
import {
  emptySignupSummary,
  signupListMeaning,
  type SignupSummary,
  type SiteSignup,
} from '@/lib/siteSignups';

const VIEW_W = 168;
const VIEW_H = 28;

function areaPath(values: number[], max: number): string {
  const last = values.length - 1;
  if (last < 0) return '';

  const xAt = (index: number) => (last === 0 ? VIEW_W : (index / last) * VIEW_W);
  const yAt = (value: number) => {
    if (max <= 0) return VIEW_H;
    return VIEW_H - (value / max) * (VIEW_H - 3);
  };

  let d = `M 0 ${VIEW_H} L 0 ${yAt(values[0] ?? 0)}`;
  for (let index = 1; index <= last; index += 1) {
    const prevX = xAt(index - 1);
    const x = xAt(index);
    const y = yAt(values[index] ?? 0);
    const midX = (prevX + x) / 2;
    d += ` C ${midX} ${yAt(values[index - 1] ?? 0)}, ${midX} ${y}, ${x} ${y}`;
  }
  d += ` L ${VIEW_W} ${VIEW_H} Z`;
  return d;
}

type BrandAudienceChartsProps = {
  state: PulseLoad;
  rows: SiteSignup[];
  summary: SignupSummary;
};

export function BrandAudienceCharts({
  state,
  rows,
  summary,
}: BrandAudienceChartsProps) {
  const reduceMotion = usePrefersReducedMotion();
  const clipId = useId();
  const counts = state === 'ready' ? summary : emptySignupSummary();
  const points = useMemo(() => signupHistoryBuckets(rows), [rows]);
  const series = useMemo(
    () =>
      AUDIENCE_CHARTS.map((chart) => {
        const values = signupWeekSeries(points, chart.list);
        return {
          ...chart,
          values,
          peak: Math.max(1, ...values),
          total: counts.byList[chart.list],
        };
      }),
    [counts.byList, points],
  );

  return (
    <ul
      className="mt-5 max-w-[34rem] space-y-1"
      aria-label="Signups by list since the first arrival"
    >
      {series.map((item, index) => (
        <li
          key={item.list}
          className="grid grid-cols-[minmax(0,1fr)_1.75rem] items-start gap-x-3 gap-y-1.5 py-2"
        >
          <span className="min-w-0">
            <span className="block font-sans text-[11px] text-cream/70">
              {item.label}
            </span>
            <span className="mt-0.5 block font-sans text-[10px] leading-snug text-cream/38">
              {signupListMeaning(item.list)}
            </span>
          </span>
          <span className="pt-0.5 text-right font-serif text-[1.05rem] leading-none text-cream">
            {state === 'loading' ? '—' : item.total}
          </span>
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="col-span-2 h-7 w-full overflow-visible"
            role="img"
            aria-hidden
          >
            <defs>
              <clipPath id={`${clipId}-${item.list}`}>
                <rect x="0" y="0" width={VIEW_W} height={VIEW_H} />
              </clipPath>
            </defs>
            <line
              x1="0"
              y1={VIEW_H - 0.5}
              x2={VIEW_W}
              y2={VIEW_H - 0.5}
              stroke="rgba(242, 240, 233, 0.12)"
              strokeWidth="1"
            />
            <g clipPath={`url(#${clipId}-${item.list})`}>
              <path
                className="brand-pulse-draw"
                d={areaPath(item.values, item.peak)}
                fill={item.color}
                fillOpacity={state === 'ready' ? 0.28 : 0.08}
                stroke={item.color}
                strokeOpacity={state === 'ready' ? 0.92 : 0.25}
                strokeWidth="1.35"
                style={
                  reduceMotion ? undefined : { animationDelay: `${index * 80}ms` }
                }
              />
            </g>
          </svg>
        </li>
      ))}
    </ul>
  );
}
