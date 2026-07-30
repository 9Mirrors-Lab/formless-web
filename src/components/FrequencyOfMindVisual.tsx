import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export type FrequencyOfMindMotion = "loop" | "once" | "active" | "rest";

type FrequencyOfMindVisualProps = {
  className?: string;
  /** Brief-style label and quote overlay */
  showCaption?: boolean;
  /**
   * loop  — continuous ambient (Brief, Icons gallery)
   * once  — single breath in, then settle still
   * active — continuous transmit pulse (upload in progress)
   * rest  — soft settle from current pose (after upload completes)
   */
  motion?: FrequencyOfMindMotion;
  /**
   * Design / handset surfaces that use this field as status feedback
   * can keep motion even when the OS asks to reduce it.
   */
  ignoreReducedMotion?: boolean;
};

const EASE = "sine.inOut";
const REST_SCALE = 0.38;
const REST_OPACITY = 0.16;

type FieldControl = {
  setActive: (active: boolean) => void;
};

export function FrequencyOfMindVisual({
  className = "",
  showCaption = false,
  motion = "loop",
  ignoreReducedMotion = false,
}: FrequencyOfMindVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<FieldControl | null>(null);
  const isLoop = motion === "loop";

  // Ambient infinite loop for Brief / Icons.
  useGSAP(
    () => {
      if (!isLoop) return;

      const root = containerRef.current;
      if (!root) return;

      const lines = gsap.utils.toArray<Element>(
        ".frequency-of-mind-line",
        root,
      );
      if (!lines.length) return;

      const even = gsap.utils.toArray<Element>(
        ".frequency-of-mind-line:nth-child(even)",
        root,
      );
      const odd = gsap.utils.toArray<Element>(
        ".frequency-of-mind-line:nth-child(odd)",
        root,
      );

      gsap.set(lines, { transformOrigin: "50% 50%" });

      const reduceMotion =
        !ignoreReducedMotion &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(lines, { scaleY: 0.55, opacity: 0.22, y: 0 });
        return;
      }

      gsap.to(lines, {
        scaleY: 0.15,
        opacity: 0.1,
        duration: 3.5,
        ease: EASE,
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.1, from: "center" },
      });

      gsap.to(even, {
        y: -40,
        duration: 4,
        ease: EASE,
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.1, from: "edges" },
      });

      gsap.to(odd, {
        y: 40,
        duration: 4.5,
        ease: EASE,
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.1, from: "edges" },
      });
    },
    { scope: containerRef, dependencies: [isLoop, ignoreReducedMotion] },
  );

  // Send-take: intro once, then energy ramps from the same rest pose. No restart on upload.
  useGSAP(
    () => {
      if (isLoop) return;

      const root = containerRef.current;
      if (!root) return;

      const lines = gsap.utils.toArray<Element>(
        ".frequency-of-mind-line",
        root,
      );
      if (!lines.length) return;

      const even = gsap.utils.toArray<Element>(
        ".frequency-of-mind-line:nth-child(even)",
        root,
      );
      const odd = gsap.utils.toArray<Element>(
        ".frequency-of-mind-line:nth-child(odd)",
        root,
      );

      gsap.set(lines, { transformOrigin: "50% 50%" });

      const reduceMotion =
        !ignoreReducedMotion &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(lines, { scaleY: 0.55, opacity: 0.22, y: 0 });
        return;
      }

      const energy = { v: 0 };
      let phase = 0;
      let introDone = false;
      let pendingActive = false;
      let tickerAttached = false;
      let energyTween: gsap.core.Tween | null = null;

      const applyField = () => {
        const e = energy.v;
        phase += 0.016 * (0.55 + e * 1.1);

        for (let i = 0; i < lines.length; i++) {
          const wave = Math.sin(phase + i * 0.14);
          const drift = Math.cos(phase * 0.7 + i * 0.09);
          gsap.set(lines[i], {
            scaleY: Math.max(0.12, REST_SCALE + wave * e * 0.42),
            opacity: Math.min(
              0.45,
              Math.max(0.1, REST_OPACITY + e * 0.14 + wave * e * 0.05),
            ),
            y: drift * e * (i % 2 === 0 ? -40 : 40),
          });
        }
      };

      const startTicker = () => {
        if (tickerAttached) return;
        tickerAttached = true;
        gsap.ticker.add(applyField);
      };

      const rampEnergy = (to: number, duration: number) => {
        energyTween?.kill();
        if (to > 0) startTicker();
        energyTween = gsap.to(energy, {
          v: to,
          duration,
          ease: "power2.inOut",
          onComplete: () => {
            if (to <= 0.001) {
              gsap.set(lines, {
                scaleY: REST_SCALE,
                opacity: REST_OPACITY,
                y: 0,
              });
            }
          },
        });
      };

      const setActive = (active: boolean) => {
        if (active) {
          if (!introDone) {
            pendingActive = true;
            return;
          }
          rampEnergy(1, 1.35);
          return;
        }
        pendingActive = false;
        if (introDone) rampEnergy(0, 1.6);
      };

      controlRef.current = { setActive };

      const finishIntro = () => {
        introDone = true;
        gsap.set(lines, { scaleY: REST_SCALE, opacity: REST_OPACITY, y: 0 });
        if (pendingActive) rampEnergy(1, 1.35);
      };

      const intro = gsap.timeline({
        defaults: { ease: EASE },
        onComplete: finishIntro,
      });

      intro.fromTo(
        lines,
        { scaleY: 0.12, opacity: 0.08, y: 0 },
        {
          scaleY: 1,
          opacity: 0.35,
          duration: 1.8,
          stagger: { each: 0.04, from: "center" },
        },
      );

      intro.to(lines, {
        scaleY: 0.42,
        opacity: 0.18,
        duration: 2.4,
        stagger: { each: 0.035, from: "edges" },
      });

      intro.to(
        even,
        { y: -12, duration: 2.2, stagger: { each: 0.04, from: "edges" } },
        "<",
      );
      intro.to(
        odd,
        { y: 12, duration: 2.4, stagger: { each: 0.04, from: "edges" } },
        "<",
      );

      intro.to(lines, {
        scaleY: REST_SCALE,
        opacity: REST_OPACITY,
        y: 0,
        duration: 1.6,
        stagger: { each: 0.02, from: "center" },
      });

      return () => {
        controlRef.current = null;
        energyTween?.kill();
        if (tickerAttached) gsap.ticker.remove(applyField);
        intro.kill();
      };
    },
    { scope: containerRef, dependencies: [isLoop, ignoreReducedMotion] },
  );

  useEffect(() => {
    if (isLoop) return;
    controlRef.current?.setActive(motion === "active");
  }, [motion, isLoop]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(155,183,168,0.12)_0%,transparent_70%)]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 520 650"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g transform="translate(0, 0)">
          {Array.from({ length: 42 }).map((_, i) => (
            <rect
              key={i}
              className="frequency-of-mind-line"
              x={50 + i * 10}
              y="100"
              width="2"
              height="450"
              rx="1"
              fill={i % 7 === 0 ? "#CC5833" : "#9FB5AA"}
              opacity={i % 7 === 0 ? 0.4 : 0.2}
            />
          ))}
        </g>
      </svg>

      {showCaption ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050806] via-[#050806]/85 to-transparent p-7 pb-8 pt-24">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-clay animate-pulse" />
            <p className="text-xs uppercase tracking-[0.2em] text-cream/50">
              Frequency of Mind
            </p>
          </div>
          <p className="max-w-[280px] font-serif text-2xl italic leading-[1.3] text-cream/90">
            Noticing the space between the thoughts.
          </p>
        </div>
      ) : null}
    </div>
  );
}
