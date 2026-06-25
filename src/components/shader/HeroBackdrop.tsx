import { getBackgroundOption, isImageBackground, type BackgroundId } from './backgroundOptions';
import { ShaderBackdrop } from './ShaderBackdrop';

type HeroBackdropProps = {
  backgroundId: BackgroundId;
  /** Fixed covers the viewport; absolute fills the positioned parent. */
  position?: 'fixed' | 'absolute';
  className?: string;
};

type ImageBackdropProps = {
  src: string;
  baseBg: string;
  position: 'fixed' | 'absolute';
  className: string;
};

function ImageBackdrop({ src, baseBg, position, className }: ImageBackdropProps) {
  const positionClass = position === 'fixed' ? 'fixed' : 'absolute';

  return (
    <div className={`inset-0 ${positionClass} z-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: baseBg }}
      />
      <img
        src={src}
        alt=""
        className="home-hero__image absolute inset-0 h-full w-full transition-opacity duration-700"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}

export function HeroBackdrop({
  backgroundId,
  position = 'absolute',
  className = '',
}: HeroBackdropProps) {
  const option = getBackgroundOption(backgroundId);

  if (isImageBackground(option)) {
    return (
      <ImageBackdrop
        src={option.imageSrc}
        baseBg={option.baseBg}
        position={position}
        className={className}
      />
    );
  }

  return <ShaderBackdrop theme={backgroundId} position={position} className={className} />;
}
