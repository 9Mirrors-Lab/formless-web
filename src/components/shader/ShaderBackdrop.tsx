import { useEffect, useState, type CSSProperties } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';
import type { BackgroundId, ThemePalette } from './backgroundOptions';
import { getBackgroundOption, isShaderBackground } from './backgroundOptions';

type ShaderBackdropProps = {
  theme?: BackgroundId;
  /** Overrides the theme palette. Used by listen-field tones that are not site backgrounds. */
  palette?: ThemePalette;
  /** Stable id for mesh remounts when palette is overridden. */
  shaderId?: string;
  /** Fixed covers the viewport; absolute fills the positioned parent. */
  position?: 'fixed' | 'absolute';
  className?: string;
  /** Soft-light overlay mesh. Off removes the smeared/ghosted look. */
  overlay?: boolean;
};

function probeWebGL2Support(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const canvas = document.createElement('canvas');
  return Boolean(canvas.getContext('webgl2'));
}

function ShaderCssFallback({ p }: { p: ThemePalette }) {
  return (
    <div
      className="shader-css-fallback absolute inset-0 pointer-events-none overflow-hidden"
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

export function ShaderBackdrop({
  theme = 'forest',
  palette,
  shaderId,
  position = 'absolute',
  className = '',
  overlay = true,
}: ShaderBackdropProps) {
  const [webgl2Supported, setWebgl2Supported] = useState<boolean | null>(null);
  const option = getBackgroundOption(theme);
  const p = palette ?? (isShaderBackground(option) ? option.palette : null);
  const meshKey = shaderId ?? theme;

  useEffect(() => {
    setWebgl2Supported(probeWebGL2Support());
  }, []);

  if (!p) {
    return null;
  }

  const positionClass = position === 'fixed' ? 'fixed' : 'absolute';

  const meshStyle: CSSProperties = {
    position: position === 'fixed' ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
  };

  return (
    <div className={`inset-0 ${positionClass} z-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: p.baseBg }}
      />

      {webgl2Supported === false ? (
        <ShaderCssFallback p={p} />
      ) : webgl2Supported === true ? (
        <>
          <MeshGradient
            key={`mesh-a-${meshKey}`}
            className="transition-opacity duration-700"
            style={meshStyle}
            colors={[...p.meshPrimary]}
            speed={theme === 'forest' ? 0.22 : 0.26}
            distortion={theme === 'forest' ? 0.88 : 0.82}
            swirl={theme === 'forest' ? 0.12 : 0.18}
          />
          {overlay ? (
            <MeshGradient
              key={`mesh-b-${meshKey}`}
              className="opacity-45 mix-blend-soft-light transition-opacity duration-700"
              style={meshStyle}
              colors={[...p.meshOverlay]}
              speed={theme === 'forest' ? 0.15 : 0.2}
              distortion={theme === 'forest' ? 0.75 : 0.8}
              swirl={theme === 'forest' ? 0.28 : 0.32}
              grainOverlay={0.08}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
