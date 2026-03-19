import { useState, useMemo } from "react";
import type { MaskTemplateConfig } from "@/lib/maskTemplateTypes";
import { renderMaskToCanvas, canvasToDataUrl } from "@/lib/maskRenderer";

interface SkinPreviewProps {
  /** URL to the phone mask PNG (white = skin area, transparent = cutouts) */
  maskUrl: string | null;
  /** Parametric template config — used as runtime fallback when maskUrl is null */
  templateConfig?: MaskTemplateConfig | null;
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
 * Falls back to Canvas-rendered mask when only templateConfig is available.
 */
const SkinPreview = ({
  maskUrl,
  templateConfig,
  skinImage,
  skinColor = "#333",
  modelName = "Phone",
  className = "",
}: SkinPreviewProps) => {
  const [maskLoaded, setMaskLoaded] = useState(false);
  const [maskError, setMaskError] = useState(false);

  // Generate mask data URL from template config (runtime fallback)
  const generatedMaskUrl = useMemo(() => {
    if (maskUrl || !templateConfig) return null;
    try {
      const canvas = renderMaskToCanvas(templateConfig);
      return canvasToDataUrl(canvas);
    } catch {
      return null;
    }
  }, [maskUrl, templateConfig]);

  const effectiveMaskUrl = maskUrl || generatedMaskUrl;

  // If no mask at all (no URL, no template), show a simple rounded rect fallback
  if (!effectiveMaskUrl || maskError) {
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

  // Generated masks (data URLs) are already loaded — skip preload
  const isDataUrl = effectiveMaskUrl.startsWith("data:");
  const isReady = isDataUrl || maskLoaded;

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* Preload remote mask to detect load/error */}
      {!isDataUrl && (
        <img
          src={effectiveMaskUrl}
          alt=""
          className="hidden"
          onLoad={() => setMaskLoaded(true)}
          onError={() => setMaskError(true)}
        />
      )}

      {isReady && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Skin texture clipped by mask */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: skinImage ? `url(${skinImage})` : undefined,
              backgroundColor: !skinImage ? skinColor : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              WebkitMaskImage: `url(${effectiveMaskUrl})`,
              maskImage: `url(${effectiveMaskUrl})`,
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

      {!isReady && !maskError && (
        <div className="w-48 h-80 rounded-[2rem] bg-secondary animate-pulse" />
      )}
    </div>
  );
};

export default SkinPreview;
