/**
 * Full-viewport Formless portal dust for the send-take handoff.
 * Ambient drift and glow only. No vacuum pull toward center during upload.
 */
import { useEffect, useRef } from 'react';

type DustParticle = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  glow: number;
  phase: number;
  hue: number;
};

type PortalDustFieldProps = {
  /** 0 calm → 1 brighter / slightly livelier drift (not suction) */
  intensity?: number;
  className?: string;
};

export function PortalDustField({
  intensity = 0,
  className = '',
}: PortalDustFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let particles: DustParticle[] = [];
    let frameId = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(w, h);
    };

    const seed = (w: number, h: number) => {
      const count = Math.min(140, Math.max(64, Math.floor((w * h) / 10000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        opacity: Math.random() * 0.5 + 0.12,
        glow: Math.random() * 7 + 2,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.8 ? 1 : 0,
      }));
    };

    const draw = () => {
      if (!running) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w * 0.5;
      const cy = h * 0.42;
      const energy = intensityRef.current;

      ctx.clearRect(0, 0, w, h);

      const veil = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.75);
      veil.addColorStop(0, `rgba(46, 64, 54, ${0.22 + energy * 0.12})`);
      veil.addColorStop(0.5, 'rgba(12, 16, 14, 0.18)');
      veil.addColorStop(1, 'rgba(5, 8, 6, 0.94)');
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, w, h);

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.26);
      core.addColorStop(0, `rgba(242, 240, 233, ${0.05 + energy * 0.1})`);
      core.addColorStop(0.4, `rgba(159, 181, 170, ${0.07 + energy * 0.1})`);
      core.addColorStop(1, 'rgba(8, 10, 9, 0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.3, 0, Math.PI * 2);
      ctx.fill();

      const speed = reduceMotion ? 0.35 : 1 + energy * 0.55;

      for (const p of particles) {
        p.phase += (reduceMotion ? 0.004 : 0.016) * (1 + energy * 0.4);
        const driftX = Math.sin(p.phase) * 0.22 * speed;
        const driftY = Math.cos(p.phase * 0.85) * 0.18 * speed;

        // Soft orbital hint only; never suction into the center
        if (energy > 0.05) {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const orbit = energy * 0.004;
          p.vx += (-dy / dist) * orbit;
          p.vy += (dx / dist) * orbit;
        }

        p.vx = p.vx * 0.99 + driftX * 0.03;
        p.vy = p.vy * 0.99 + driftY * 0.03;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -12) p.x = w + 12;
        if (p.x > w + 12) p.x = -12;
        if (p.y < -12) p.y = h + 12;
        if (p.y > h + 12) p.y = -12;

        const alpha = Math.min(0.95, p.opacity + energy * 0.25);
        const cream = p.hue === 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + energy * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = cream
          ? `rgba(242, 240, 233, ${alpha})`
          : `rgba(159, 181, 170, ${alpha})`;
        ctx.shadowBlur = p.glow + energy * 6;
        ctx.shadowColor = cream
          ? 'rgba(242, 240, 233, 0.8)'
          : 'rgba(159, 181, 170, 0.7)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      frameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  );
}
