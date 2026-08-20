import { useEffect, useRef } from 'react';

type DriveWaveformLaneProps = {
  peaks: number[];
  progress: number;
  height: number;
  loading: boolean;
  onSeekRatio: (ratio: number) => void;
};

const BAR_WIDTH = 2;
const BAR_GAP = 1;
const UNPLAYED = '#3d5f4e';
const PLAYED = '#9fb5aa';

function drawWaveform(
  canvas: HTMLCanvasElement,
  peaks: number[],
  progress: number,
): void {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width <= 0 || height <= 0) return;

  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const step = BAR_WIDTH + BAR_GAP;
  const barCount = Math.max(1, Math.floor(width / step));
  const mid = height / 2;
  const maxPeak = peaks.reduce((loudest, value) => Math.max(loudest, value), 0) || 1;

  ctx.fillStyle = 'rgba(242, 240, 233, 0.12)';
  ctx.fillRect(0, mid, width, 1);

  if (peaks.length === 0) return;

  for (let index = 0; index < barCount; index += 1) {
    const peakIndex = Math.min(
      peaks.length - 1,
      Math.floor((index / barCount) * peaks.length),
    );
    const amplitude = (peaks[peakIndex] ?? 0) / maxPeak;
    const barHeight = Math.max(2, amplitude * (height * 0.82));
    const x = index * step;
    ctx.fillStyle = index / barCount <= progress ? PLAYED : UNPLAYED;
    ctx.fillRect(x, mid - barHeight / 2, BAR_WIDTH, barHeight);
  }
}

export function DriveWaveformLane({
  peaks,
  progress,
  height,
  loading,
  onSeekRatio,
}: DriveWaveformLaneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const redraw = () => drawWaveform(canvas, peaks, progress);
    redraw();

    const observer = new ResizeObserver(redraw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [peaks, progress]);

  const seekFromClientX = (clientX: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onSeekRatio(ratio);
  };

  return (
    <button
      type="button"
      className="relative block w-full overflow-hidden text-left"
      style={{ height }}
      aria-label="Seek audio"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        seekFromClientX(event.clientX, event.currentTarget);
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        seekFromClientX(event.clientX, event.currentTarget);
      }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {loading && peaks.length === 0 ? (
        <span className="pointer-events-none absolute inset-x-3 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/35">
          Loading waveform…
        </span>
      ) : null}
      <span
        className="pointer-events-none absolute top-0 bottom-0 w-px bg-cream/85"
        style={{ left: `${progress * 100}%` }}
      />
      <span
        className="pointer-events-none absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream shadow-[0_0_0_3px_rgba(14,17,16,0.7)]"
        style={{ left: `${progress * 100}%` }}
      />
    </button>
  );
}
