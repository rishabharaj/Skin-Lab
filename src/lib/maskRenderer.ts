import type { MaskTemplateConfig, MaskCutout } from "./maskTemplateTypes";

/**
 * Renders a mask template config onto an offscreen canvas.
 * White (#FFF, fully opaque) = skin visible area
 * Transparent (alpha=0) = cutouts and outside the phone body
 */
export function renderMaskToCanvas(config: MaskTemplateConfig): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;
  const ctx = canvas.getContext("2d")!;

  // Start fully transparent
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw phone body as a white rounded rectangle
  const { insetX, insetY, cornerRadii } = config.body;
  const bodyW = canvas.width - insetX * 2;
  const bodyH = canvas.height - insetY * 2;
  const [tl, tr, br, bl] = cornerRadii;

  ctx.beginPath();
  ctx.moveTo(insetX + tl, insetY);
  ctx.lineTo(insetX + bodyW - tr, insetY);
  ctx.quadraticCurveTo(insetX + bodyW, insetY, insetX + bodyW, insetY + tr);
  ctx.lineTo(insetX + bodyW, insetY + bodyH - br);
  ctx.quadraticCurveTo(insetX + bodyW, insetY + bodyH, insetX + bodyW - br, insetY + bodyH);
  ctx.lineTo(insetX + bl, insetY + bodyH);
  ctx.quadraticCurveTo(insetX, insetY + bodyH, insetX, insetY + bodyH - bl);
  ctx.lineTo(insetX, insetY + tl);
  ctx.quadraticCurveTo(insetX, insetY, insetX + tl, insetY);
  ctx.closePath();

  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  // Punch out cutouts using destination-out compositing
  ctx.globalCompositeOperation = "destination-out";
  for (const cutout of config.cutouts) {
    drawCutout(ctx, cutout, insetX, insetY, bodyW, bodyH);
  }
  ctx.globalCompositeOperation = "source-over";

  return canvas;
}

function drawCutout(
  ctx: CanvasRenderingContext2D,
  cutout: MaskCutout,
  offsetX: number,
  offsetY: number,
  bodyW: number,
  bodyH: number,
) {
  const cx = offsetX + (cutout.x / 100) * bodyW;
  const cy = offsetY + (cutout.y / 100) * bodyH;
  const w = (cutout.width / 100) * bodyW;
  const h = (cutout.height / 100) * bodyH;

  ctx.save();

  if (cutout.rotation) {
    ctx.translate(cx + w / 2, cy + h / 2);
    ctx.rotate((cutout.rotation * Math.PI) / 180);
    ctx.translate(-(cx + w / 2), -(cy + h / 2));
  }

  ctx.beginPath();

  if (cutout.shape === "circle") {
    const r = Math.min(w, h) / 2;
    ctx.arc(cx + w / 2, cy + h / 2, r, 0, Math.PI * 2);
  } else {
    // roundedRect and pill both use roundRect
    const cr =
      cutout.shape === "pill"
        ? Math.min(w, h) / 2
        : ((cutout.cornerRadius ?? 20) / 100) * Math.min(w, h);
    ctx.roundRect(cx, cy, w, h, cr);
  }

  ctx.closePath();
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.restore();
}

/** Export canvas as PNG Blob for uploading to Supabase Storage */
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/png",
    );
  });
}

/** Export canvas as data URL for instant preview */
export function canvasToDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png");
}
