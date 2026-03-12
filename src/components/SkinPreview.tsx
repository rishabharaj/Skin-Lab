import { useState } from "react";

interface SkinPreviewProps {
  /** URL to the phone mask PNG (white = skin area, transparent = cutouts) */
  maskUrl: string | null;
  /** URL or imported path to the skin texture image */
  skinImage: string | null;
  /** Fallback color if no skin image */
  skinColor?: string;
  /** Phone model name for alt text */
  modelName?: string;
  className?: string;
}

/**
 * Renders a skin texture clipped inside a phone mask template.
 * The mask PNG defines the visible area:
 * - White/opaque pixels → skin is visible
 * - Transparent pixels → cutouts (camera, edges, etc.)
 *
 * Uses CSS `mask-image` for GPU-accelerated compositing.
 */
const SkinPreview = ({
  maskUrl,
  skinImage,
  skinColor = "#333",
  modelName = "Phone",
  className = "",
}: SkinPreviewProps) => {
  const [maskLoaded, setMaskLoaded] = useState(false);
  const [maskError, setMaskError] = useState(false);

  // If no mask, show a simple rounded rect fallback
  if (!maskUrl || maskError) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        <div
          className="w-48 h-80 rounded-[2rem] border-4 border-foreground/20 overflow-hidden"
          style={
            skinImage
              ? { backgroundImage: `url(${skinImage})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { backgroundColor: skinColor }
          }
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* Preload mask to detect load/error */}
      <img
        src={maskUrl}
        alt=""
        className="hidden"
        onLoad={() => setMaskLoaded(true)}
        onError={() => setMaskError(true)}
      />

      {maskLoaded && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Skin texture clipped by mask */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: skinImage ? `url(${skinImage})` : undefined,
              backgroundColor: !skinImage ? skinColor : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              WebkitMaskImage: `url(${maskUrl})`,
              maskImage: `url(${maskUrl})`,
              WebkitMaskSize: "contain",
              maskSize: "contain" as any,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat" as any,
              WebkitMaskPosition: "center",
              maskPosition: "center" as any,
            }}
            role="img"
            aria-label={`${modelName} with skin applied`}
          />
        </div>
      )}

      {!maskLoaded && !maskError && (
        <div className="w-48 h-80 rounded-[2rem] bg-secondary animate-pulse" />
      )}
    </div>
  );
};

export default SkinPreview;
