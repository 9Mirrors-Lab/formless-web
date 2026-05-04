import { useEffect, useRef } from "react";
import { Wind } from "lucide-react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  glow: number;
  phase: number;
};

export type QuantumDustVisualProps = {
  className?: string;
  /** hero = wide brief hero with caption overlay; embed = fill parent (e.g. icon study tile), canvas only */
  variant?: "hero" | "embed";
};

/** Canvas-based quantum dust / dandelion particle field */
export function QuantumDustVisual({
  className = "",
  variant = "hero",
}: QuantumDustVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          vx: Math.random() * 0.5 - 0.25,
          vy: Math.random() * -0.5 - 0.1,
          opacity: Math.random() * 0.5 + 0.2,
          glow: Math.random() * 5 + 2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      gradient.addColorStop(0, "rgba(20, 25, 22, 0.4)");
      gradient.addColorStop(1, "rgba(5, 8, 6, 0.8)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(p.phase) * 0.2;
        p.y += p.vy;
        p.phase += 0.02;

        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 230, 220, ${p.opacity})`;
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = "rgba(200, 220, 200, 0.8)";
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.radius > 1.2) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + Math.cos(p.phase) * 4, p.y + Math.sin(p.phase) * 4);
          ctx.strokeStyle = `rgba(200, 220, 200, ${p.opacity * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const frameClass =
    variant === "hero"
      ? "relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/5 bg-[#050806] shadow-2xl md:aspect-[21/9]"
      : "relative h-full w-full min-h-0 overflow-hidden rounded-xl bg-[#050806]";

  return (
    <div className={[frameClass, className].filter(Boolean).join(" ")}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050806] via-transparent to-transparent opacity-80" />

      {variant === "hero" ? (
        <div className="absolute bottom-6 left-6 z-10 md:bottom-10 md:left-10">
          <div className="mb-2 flex items-center gap-3">
            <Wind className="h-5 w-5 text-moss/80" />
            <span className="text-sm uppercase tracking-widest text-cream/60">
              Quantum Dust
            </span>
          </div>
          <h2 className="font-serif text-2xl font-light italic text-cream/90 md:text-4xl">
            Subtle like dandelions flowing
          </h2>
        </div>
      ) : null}
    </div>
  );
}
