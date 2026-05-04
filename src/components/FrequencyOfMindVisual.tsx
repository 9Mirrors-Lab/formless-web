import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type FrequencyOfMindVisualProps = {
  className?: string;
  /** Brief-style label and quote overlay */
  showCaption?: boolean;
};

export function FrequencyOfMindVisual({
  className = "",
  showCaption = false,
}: FrequencyOfMindVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".frequency-of-mind-line", { transformOrigin: "50% 50%" });

      gsap.to(".frequency-of-mind-line", {
        scaleY: 0.15,
        opacity: 0.1,
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.1,
          from: "center",
        },
      });

      gsap.to(".frequency-of-mind-line:nth-child(even)", {
        y: -40,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.1,
          from: "edges",
        },
      });

      gsap.to(".frequency-of-mind-line:nth-child(odd)", {
        y: 40,
        duration: 4.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.1,
          from: "edges",
        },
      });
    },
    { scope: containerRef }
  );

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
