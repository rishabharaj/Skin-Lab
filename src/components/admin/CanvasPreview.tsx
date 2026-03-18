import { useEffect, useRef } from "react";
import { renderMaskToCanvas } from "@/lib/maskRenderer";
import type { MaskTemplateConfig } from "@/lib/maskTemplateTypes";

interface CanvasPreviewProps {
  config: MaskTemplateConfig;
  skinTextureUrl?: string;
  width?: number;
  height?: number;
}

const CanvasPreview = ({
  config,
  skinTextureUrl,
  width = 260,
  height = 530,
}: CanvasPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;

    // Render the mask
    const maskCanvas = renderMaskToCanvas(config);

    if (skinTextureUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw skin texture
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Apply mask: only keep pixels where mask is opaque
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.globalCompositeOperation = "source-over";
      };
      img.src = skinTextureUrl;
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(maskCanvas, 0, 0);
    }
  }, [config, skinTextureUrl]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width,
        height,
        borderRadius: "1rem",
        background: "repeating-conic-gradient(#1a1a2e 0% 25%, #16162a 0% 50%) 0 0 / 16px 16px",
      }}
    />
  );
};

export default CanvasPreview;
