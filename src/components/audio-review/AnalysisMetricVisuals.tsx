import type { ReactNode } from 'react';

import type { AnalysisMetric, ChapterValue } from '@/data/audioAnalysisReport';

const SAGE = '#9fb5aa';
const CREAM = '#f2f0e9';
const CLAY = '#d46544';

type ChartProps = {
  metric: AnalysisMetric;
  className?: string;
};

function chartInk(verdict: AnalysisMetric['verdict']): string {
  switch (verdict) {
    case 'pass':
      return SAGE;
    case 'action':
      return CLAY;
    case 'guide':
      return CREAM;
    default: {
      const _exhaustive: never = verdict;
      return _exhaustive;
    }
  }
}

function BarChart({
  values,
  color,
  format,
  invertHeight,
}: {
  values: ChapterValue[];
  color: string;
  format: (v: number) => string;
  invertHeight?: boolean;
}) {
  const nums = values.map((v) => v.value);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = Math.max(max - min, 0.4);

  return (
    <div className="grid grid-cols-4 gap-3" role="img" aria-label="Chapter comparison chart">
      {values.map((item) => {
        const normalized = invertHeight
          ? (max - item.value) / span
          : (item.value - min) / span;
        const height = 28 + normalized * 72;
        return (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <span className="font-mono text-[11px] tabular-nums text-cream/70">
              {format(item.value)}
            </span>
            <div className="flex h-28 w-full items-end justify-center">
              <div
                className="w-[70%] max-w-[2.5rem] rounded-sm transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ height, backgroundColor: color, opacity: 0.85 }}
              />
            </div>
            <span className="text-center font-mono text-[9px] uppercase tracking-[0.14em] text-cream/35">
              {item.label.replace('Chapter ', 'Ch ')}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ShareRing({ percent, color }: { percent: number; color: string }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const filled = (percent / 100) * c;
  return (
    <svg viewBox="0 0 120 120" className="mx-auto h-36 w-36" role="img" aria-label={`${percent}% silence`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(242,240,233,0.08)" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${c - filled}`}
        transform="rotate(-90 60 60)"
      />
      <text
        x="60"
        y="58"
        textAnchor="middle"
        className="fill-cream"
        style={{ fontFamily: 'ui-monospace, monospace', fontSize: 22 }}
      >
        {percent}%
      </text>
      <text
        x="60"
        y="76"
        textAnchor="middle"
        className="fill-cream"
        style={{ fontFamily: 'ui-monospace, monospace', fontSize: 8, letterSpacing: '0.18em', opacity: 0.45 }}
      >
        SILENCE
      </text>
    </svg>
  );
}

function SpectrumBars({
  low,
  mid,
  high,
  color,
}: {
  low: number;
  mid: number;
  high: number;
  color: string;
}) {
  const bands = [
    { label: 'Low', value: low },
    { label: 'Mid', value: mid },
    { label: 'High', value: high },
  ];
  const max = Math.max(low, mid, high);
  return (
    <div className="space-y-3" role="img" aria-label="Spectral balance bars">
      {bands.map((band) => (
        <div key={band.label} className="grid grid-cols-[3.5rem_1fr_2rem] items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">
            {band.label}
          </span>
          <div className="h-3 overflow-hidden rounded-sm bg-cream/[0.06]">
            <div
              className="h-full rounded-sm"
              style={{
                width: `${(band.value / max) * 100}%`,
                backgroundColor: color,
                opacity: 0.9,
              }}
            />
          </div>
          <span className="font-mono text-[10px] tabular-nums text-cream/45">{band.value}</span>
        </div>
      ))}
    </div>
  );
}

function SpikeChart({ values, color }: { values: ChapterValue[]; color: string }) {
  return (
    <svg viewBox="0 0 320 140" className="h-40 w-full" role="img" aria-label="Peak spikes near zero dB">
      <line x1="16" y1="28" x2="304" y2="28" stroke="rgba(242,240,233,0.12)" strokeWidth="1" />
      <text x="16" y="20" fill="rgba(242,240,233,0.4)" fontSize="9" fontFamily="ui-monospace, monospace">
        0 dB
      </text>
      <line
        x1="16"
        y1="70"
        x2="304"
        y2="70"
        stroke={SAGE}
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.7"
      />
      <text x="16" y="64" fill={SAGE} fontSize="9" fontFamily="ui-monospace, monospace">
        −3 dB target
      </text>
      {values.map((item, i) => {
        const x = 60 + i * 90;
        const peakY = 28 + Math.abs(item.value) * 8;
        return (
          <g key={item.label}>
            <path
              d={`M ${x - 18} 118 L ${x} ${peakY} L ${x + 18} 118`}
              fill="none"
              stroke={color}
              strokeWidth="2"
            />
            <circle cx={x} cy={peakY} r="3.5" fill={color} />
            <text
              x={x}
              y="132"
              textAnchor="middle"
              fill="rgba(242,240,233,0.4)"
              fontSize="9"
              fontFamily="ui-monospace, monospace"
            >
              {item.value.toFixed(1)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CrestViz({ value, color }: { value: number; color: string }) {
  return (
    <div className="grid grid-cols-2 gap-6" role="img" aria-label={`Crest factor ${value} dB`}>
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/35">
          Compressed
        </p>
        <div className="flex h-24 items-end gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-cream/20"
              style={{ height: `${70 + (i % 2) * 8}%` }}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/35">
          Yours · {value} dB
        </p>
        <div className="flex h-24 items-end gap-1">
          {[40, 88, 52, 96, 46, 78, 58, 100, 48, 72, 54, 84].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{ height: `${h}%`, backgroundColor: color, opacity: 0.85 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HpfViz({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 320 120" className="h-32 w-full" role="img" aria-label="High-pass filter curve">
      <path
        d="M 20 100 C 70 100, 90 98, 110 70 S 150 28, 200 24 L 300 22"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
      <line x1="110" y1="16" x2="110" y2="110" stroke="rgba(242,240,233,0.2)" strokeDasharray="3 4" />
      <text x="96" y="114" fill="rgba(242,240,233,0.45)" fontSize="9" fontFamily="ui-monospace, monospace">
        ~80 Hz
      </text>
      <text x="24" y="114" fill="rgba(242,240,233,0.3)" fontSize="8" fontFamily="ui-monospace, monospace">
        rumble
      </text>
      <text x="250" y="48" fill="rgba(242,240,233,0.45)" fontSize="9" fontFamily="ui-monospace, monospace">
        voice
      </text>
    </svg>
  );
}

function CompressViz({ color }: { color: string }) {
  return (
    <div className="grid grid-cols-2 gap-5" role="img" aria-label="Light compression comparison">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">Before</p>
        <div className="flex h-20 items-end gap-1.5">
          {[30, 95, 28, 88, 35, 100, 32].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-cream/25" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">Gentle</p>
        <div className="flex h-20 items-end gap-1.5">
          {[48, 78, 52, 74, 50, 80, 54].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{ height: `${h}%`, backgroundColor: color, opacity: 0.85 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CeilingViz({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 320 130" className="h-36 w-full" role="img" aria-label="Limiter ceiling at minus 3 dB">
      <line x1="40" y1="24" x2="280" y2="24" stroke="rgba(242,240,233,0.15)" />
      <text x="40" y="16" fill="rgba(242,240,233,0.4)" fontSize="9" fontFamily="ui-monospace, monospace">
        0 dB
      </text>
      <line x1="40" y1="56" x2="280" y2="56" stroke={SAGE} strokeDasharray="5 4" />
      <text x="40" y="50" fill={SAGE} fontSize="9" fontFamily="ui-monospace, monospace">
        −3 dB ceiling
      </text>
      <path
        d="M 50 110 L 90 90 L 120 30 L 150 88 L 190 70 L 220 28 L 250 86 L 280 100"
        fill="none"
        stroke="rgba(242,240,233,0.25)"
        strokeWidth="1.5"
      />
      <path
        d="M 50 110 L 90 90 L 120 56 L 150 88 L 190 70 L 220 56 L 250 86 L 280 100"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
    </svg>
  );
}

function LegacyCompare({ values, color }: { values: ChapterValue[]; color: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
        <span className="text-[#9fb5aa]">LUFS · modern</span>
        <span className="text-cream/20">↓</span>
        <span>RMS · legacy / ACX</span>
      </div>
      <BarChart values={values} color={color} format={(v) => v.toFixed(1)} invertHeight />
    </div>
  );
}

export function AnalysisMetricChart({ metric, className = '' }: ChartProps) {
  const color = chartInk(metric.verdict);

  let body: ReactNode;
  switch (metric.chart) {
    case 'bars':
      body = (
        <BarChart
          values={metric.values ?? []}
          color={color}
          format={(v) => v.toFixed(1)}
          invertHeight
        />
      );
      break;
    case 'range':
      body = (
        <BarChart values={metric.values ?? []} color={color} format={(v) => v.toFixed(1)} />
      );
      break;
    case 'legacy':
      body = <LegacyCompare values={metric.values ?? []} color={color} />;
      break;
    case 'spike':
      body = <SpikeChart values={metric.values ?? []} color={color} />;
      break;
    case 'crest':
      body = <CrestViz value={metric.single?.value ?? 22} color={color} />;
      break;
    case 'floor':
      body = (
        <BarChart
          values={metric.values ?? []}
          color={color}
          format={(v) => String(v)}
          invertHeight
        />
      );
      break;
    case 'share':
      body = <ShareRing percent={metric.share ?? 23} color={color} />;
      break;
    case 'spectrum':
      body = (
        <SpectrumBars
          low={metric.spectrum?.low ?? 10}
          mid={metric.spectrum?.mid ?? 6}
          high={metric.spectrum?.high ?? 2}
          color={color}
        />
      );
      break;
    case 'hpf':
      body = <HpfViz color={color} />;
      break;
    case 'compress':
      body = <CompressViz color={color} />;
      break;
    case 'ceiling':
      body = <CeilingViz color={color} />;
      break;
    default: {
      const _exhaustive: never = metric.chart;
      body = _exhaustive;
    }
  }

  return <div className={className}>{body}</div>;
}

export function AnalysisMetricGlyph({
  id,
  className = '',
}: {
  id: AnalysisMetric['id'];
  className?: string;
}) {
  const common = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  let path: ReactNode;
  switch (id) {
    case 'lufs':
      path = (
        <>
          <path {...common} d="M6 18V8M11 18V5M16 18V10M21 18V7" />
        </>
      );
      break;
    case 'lra':
      path = <path {...common} d="M5 14c3-6 6-6 9 0s6 6 9 0" />;
      break;
    case 'rms':
      path = <path {...common} d="M4 15h5l2-6 3 10 2-4h6" />;
      break;
    case 'peak':
      path = <path {...common} d="M5 18l5-3 3-10 3 10 5 3" />;
      break;
    case 'crest':
      path = (
        <>
          <path {...common} d="M5 18h16" />
          <path {...common} d="M8 18V9M14 18V5M20 18v-7" />
        </>
      );
      break;
    case 'noise':
      path = <path {...common} d="M4 14c2-1 3 1 5 0s3 1 5 0 3 1 5 0 3 1 5 0" />;
      break;
    case 'silence':
      path = (
        <>
          <circle {...common} cx="13" cy="13" r="7" />
          <path {...common} d="M13 9v4l2.5 1.5" />
        </>
      );
      break;
    case 'spectral':
      path = <path {...common} d="M5 17h3v-5H5zm6 0h3V7h-3zm6 0h3v-9h-3z" />;
      break;
    case 'hpf':
      path = <path {...common} d="M4 18c4 0 5-1 7-8s4-7 11-7" />;
      break;
    case 'compression':
      path = (
        <>
          <path {...common} d="M7 6v14M19 6v14" />
          <path {...common} d="M7 13h12" />
        </>
      );
      break;
    case 'limiter':
      path = (
        <>
          <path {...common} d="M5 8h16" />
          <path {...common} d="M8 18V8M13 18v-6M18 18v-4" />
        </>
      );
      break;
    default: {
      const _exhaustive: never = id;
      path = _exhaustive;
    }
  }

  return (
    <svg viewBox="0 0 26 26" className={className} aria-hidden>
      {path}
    </svg>
  );
}
