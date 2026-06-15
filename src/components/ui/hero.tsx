import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react";
import { Sun, Trees } from "lucide-react";

export type ShaderThemeId = "forest" | "sunset";

type ThemePalette = {
  baseBg: string;
  meshPrimary: readonly [string, string, string, string, string];
  meshOverlay: readonly [string, string, string, string];
  pulse: readonly [string, string, string, string, string];
  formless: {
    f1: string;
    f2: string;
    f3: string;
    h1: string;
    h2: string;
    h3: string;
  };
  beautiful: readonly [string, string, string, string];
  badgeLine: string;
};

const PALETTES: Record<ShaderThemeId, ThemePalette> = {
  forest: {
    baseBg: "#080A08",
    meshPrimary: ["#080A08", "#1B241B", "#26211A", "#4A5239", "#8C7A5A"],
    meshOverlay: ["#080A08", "#26211A", "#8C7A5A", "#4A5239"],
    pulse: ["#4A5239", "#8C7A5A", "#A89878", "#e8e4dc", "#1B241B"],
    formless: {
      f1: "#f8f6f3",
      f2: "#c9c0b2",
      f3: "#6f6348",
      h1: "#8C7A5A",
      h2: "#f5f2ec",
      h3: "#3d452f",
    },
    beautiful: ["#e8e4dc", "#8C7A5A", "#4A5239", "#d4cfc4"],
    badgeLine: "rgba(140, 122, 90, 0.35)",
  },
  sunset: {
    baseBg: "#0c0a14",
    meshPrimary: ["#0c0a14", "#1e1b4b", "#5b21b6", "#c2410c", "#fbbf24"],
    meshOverlay: ["#0c0a14", "#312e81", "#ea580c", "#fde68a"],
    pulse: ["#f97316", "#fbbf24", "#fb7185", "#fde047", "#4c1d95"],
    formless: {
      f1: "#fff7ed",
      f2: "#fdba74",
      f3: "#c2410c",
      h1: "#fde047",
      h2: "#fffbeb",
      h3: "#9d174d",
    },
    beautiful: ["#fff7ed", "#fb923c", "#db2777", "#fde047"],
    badgeLine: "rgba(251, 191, 36, 0.45)",
  },
};

/** Fixed particle anchors so layout does not jump on re-render. */
const PARTICLE_ANCHORS = [
  { left: 22, top: 41 },
  { left: 58, top: 28 },
  { left: 44, top: 62 },
  { left: 71, top: 55 },
  { left: 31, top: 73 },
  { left: 66, top: 38 },
] as const;

function themeCssVars(p: ThemePalette): CSSProperties {
  return {
    ["--fl-f1" as string]: p.formless.f1,
    ["--fl-f2" as string]: p.formless.f2,
    ["--fl-f3" as string]: p.formless.f3,
    ["--fl-h1" as string]: p.formless.h1,
    ["--fl-h2" as string]: p.formless.h2,
    ["--fl-h3" as string]: p.formless.h3,
  };
}

function probeWebGL2Support(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl2"));
}

const SHADER_BACKDROP_STYLE: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 1,
  pointerEvents: "none",
};

function ShaderCssFallback({ p }: { p: ThemePalette }) {
  return (
    <div
      className="shader-css-fallback fixed inset-0 z-[1] pointer-events-none overflow-hidden"
      aria-hidden
    >
      <div
        className="shader-css-fallback__blob shader-css-fallback__blob-a"
        style={{ backgroundColor: p.meshPrimary[3] }}
      />
      <div
        className="shader-css-fallback__blob shader-css-fallback__blob-b"
        style={{ backgroundColor: p.meshPrimary[4] }}
      />
      <div
        className="shader-css-fallback__blob shader-css-fallback__blob-c"
        style={{ backgroundColor: p.meshOverlay[2] }}
      />
      <div
        className="shader-css-fallback__blob shader-css-fallback__blob-d"
        style={{ backgroundColor: p.meshOverlay[3] }}
      />
    </div>
  );
}

export default function ShaderShowcase() {
  const [theme, setTheme] = useState<ShaderThemeId>("forest");
  const [webgl2Supported, setWebgl2Supported] = useState<boolean | null>(null);
  const p = PALETTES[theme];

  const beautifulGradient = `linear-gradient(135deg, ${p.beautiful[0]} 0%, ${p.beautiful[1]} 32%, ${p.beautiful[2]} 68%, ${p.beautiful[3]} 100%)`;

  useEffect(() => {
    setWebgl2Supported(probeWebGL2Support());
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={themeCssVars(p)}
    >
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: p.baseBg }}
      />

      {webgl2Supported === false ? (
        <ShaderCssFallback p={p} />
      ) : webgl2Supported === true ? (
        <>
          <MeshGradient
            key={`mesh-a-${theme}`}
            className="transition-opacity duration-700"
            style={SHADER_BACKDROP_STYLE}
            colors={[...p.meshPrimary]}
            speed={theme === "forest" ? 0.22 : 0.26}
            distortion={theme === "forest" ? 0.88 : 0.82}
            swirl={theme === "forest" ? 0.12 : 0.18}
          />
          <MeshGradient
            key={`mesh-b-${theme}`}
            className="opacity-45 mix-blend-soft-light transition-opacity duration-700"
            style={SHADER_BACKDROP_STYLE}
            colors={[...p.meshOverlay]}
            speed={theme === "forest" ? 0.15 : 0.2}
            distortion={theme === "forest" ? 0.75 : 0.8}
            swirl={theme === "forest" ? 0.28 : 0.32}
            grainOverlay={0.08}
          />
        </>
      ) : null}
      <svg className="absolute inset-0 w-0 h-0" aria-hidden>
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves={1} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={0.3} />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={4} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <header className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-6">
        <motion.a
          href="/"
          className="flex items-center group cursor-pointer relative -m-1 p-1 order-1"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          aria-label="Formless, home"
        >
          <motion.span
            className="relative z-10 inline-block font-sans font-semibold text-sm md:text-base tracking-[0.3em] uppercase bg-gradient-to-br from-[var(--fl-f1)] via-[var(--fl-f2)] to-[var(--fl-f3)] bg-clip-text text-transparent transition-all duration-500 [background-size:100%_100%] group-hover:from-[var(--fl-h1)] group-hover:via-[var(--fl-h2)] group-hover:to-[var(--fl-h3)]"
            whileHover={{
              rotate: [0, -1, 1, 0],
              transition: { duration: 0.6, ease: "easeInOut" },
            }}
          >
            Formless
          </motion.span>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {PARTICLE_ANCHORS.map((pos, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                }}
                animate={{
                  y: [-10, -20, -10],
                  x: [0, (i % 3) * 6 - 6, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.a>

        <nav className="flex items-center space-x-2 order-3 w-full justify-center sm:w-auto sm:order-2 sm:justify-start">
          <a
            href="#"
            className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Features
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Docs
          </a>
        </nav>

        <div className="flex items-center gap-3 order-2 sm:order-3 ml-auto sm:ml-0">
          <div
            className="flex rounded-full border border-white/15 p-0.5 bg-black/25 backdrop-blur-md shadow-inner"
            role="group"
            aria-label="Background palette"
          >
            <button
              type="button"
              onClick={() => setTheme("forest")}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-all duration-300 ${
                theme === "forest"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/55 hover:text-white/85 hover:bg-white/5"
              }`}
              aria-pressed={theme === "forest"}
            >
              <Trees className="size-3.5 shrink-0 opacity-90" aria-hidden />
              <span className="hidden sm:inline">Forest</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme("sunset")}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-all duration-300 ${
                theme === "sunset"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/55 hover:text-white/85 hover:bg-white/5"
              }`}
              aria-pressed={theme === "sunset"}
            >
              <Sun className="size-3.5 shrink-0 opacity-90" aria-hidden />
              <span className="hidden sm:inline">Sunset</span>
            </button>
          </div>

          <div
            id="gooey-btn"
            className="relative flex items-center group"
            style={{ filter: "url(#gooey-filter)" }}
          >
            <button
              type="button"
              className="absolute right-0 px-2.5 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-[4.75rem] z-0"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </button>
            <button
              type="button"
              className="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="absolute bottom-8 left-8 z-20 max-w-2xl">
        <div className="text-left">
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-6 relative border border-white/10"
            style={{
              filter: "url(#glass-effect)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="absolute top-0 left-1 right-1 h-px rounded-full"
              style={{ background: `linear-gradient(to right, transparent, ${p.badgeLine}, transparent)` }}
            />
            <span className="text-white/90 text-sm font-medium relative z-10 tracking-wide">
              New Paper Shaders experience
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              key={theme}
              className="inline-block w-fit max-w-full font-light text-4xl md:text-5xl lg:text-6xl mb-2 tracking-wider"
              style={{
                background: beautifulGradient,
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              Beautiful
            </motion.span>
            <span className="block font-black text-white drop-shadow-2xl">Shader</span>
            <span className="block font-light text-white/80 italic">Experiences</span>
          </motion.h1>

          <motion.p
            className="text-lg font-light text-white/70 mb-8 leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Create stunning visual experiences with advanced shader lighting, smooth motion, and effects that
            respond as you move.
          </motion.p>

          <motion.div
            className="flex items-center gap-6 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <motion.button
              type="button"
              className={`px-10 py-4 rounded-full bg-transparent border-2 border-white/25 text-white font-medium text-sm transition-all duration-300 hover:bg-white/10 cursor-pointer backdrop-blur-sm ${
                theme === "forest"
                  ? "hover:border-[rgba(140,122,90,0.55)] hover:text-[#e8e4dc]"
                  : "hover:border-[rgba(251,146,60,0.65)] hover:text-[#fff7ed]"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View pricing
            </motion.button>
            <motion.button
              type="button"
              className={`px-10 py-4 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer shadow-lg shadow-black/40 hover:shadow-xl bg-gradient-to-r ${
                theme === "forest"
                  ? "from-[#4A5239] to-[#8C7A5A] hover:from-[#5a6348] hover:to-[#9d8a6a] text-[#f5f2ec]"
                  : "from-[#c2410c] to-[#db2777] hover:from-[#ea580c] hover:to-[#e11d48] text-[#fffbeb]"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get started
            </motion.button>
          </motion.div>
        </div>
      </main>

      <div className="absolute bottom-8 right-8 z-30">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {webgl2Supported ? (
            <PulsingBorder
              key={`pulse-${theme}`}
              colors={[...p.pulse]}
              colorBack="#00000000"
              speed={1.5}
              roundness={1}
              thickness={0.1}
              softness={0.2}
              intensity={1}
              spots={4}
              spotSize={0.1}
              pulse={0.1}
              smoke={0.5}
              smokeSize={0.6}
              scale={0.65}
              rotation={0}
              bloom={0.25}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
              }}
            />
          ) : (
            <motion.div
              aria-hidden
              className="rounded-full"
              style={{
                width: "60px",
                height: "60px",
                background: `conic-gradient(from 0deg, ${p.pulse.join(", ")}, ${p.pulse[0]})`,
              }}
              animate={{ rotate: 360, scale: [1, 1.06, 1] }}
              transition={{
                rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
            />
          )}

          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{ transform: "scale(1.6)" }}
            aria-hidden
          >
            <defs>
              <path
                id="shader-showcase-circle"
                d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              />
            </defs>
            <text className="text-sm fill-white/80 font-medium">
              <textPath href="#shader-showcase-circle" startOffset="0%">
                SONIKA · COTTMAN · FORMLESS · FORMLESS ·
              </textPath>
            </text>
          </motion.svg>
        </div>
      </div>
    </div>
  );
}
