/** A single cutout within the phone back panel */
export interface MaskCutout {
  id: string;
  label: string;
  shape: "circle" | "roundedRect" | "pill";
  /** X position relative to body top-left, as percentage (0-100) */
  x: number;
  /** Y position relative to body top-left, as percentage (0-100) */
  y: number;
  /** Width in percentage of body width */
  width: number;
  /** Height in percentage of body height */
  height: number;
  /** Corner radius for roundedRect, percentage of min(width,height). Default 20 */
  cornerRadius?: number;
  /** Rotation in degrees. Default 0 */
  rotation?: number;
}

/** Full parametric config for a phone mask template */
export interface MaskTemplateConfig {
  version: 1;
  /** Canvas output width in pixels */
  canvasWidth: number;
  /** Canvas output height in pixels */
  canvasHeight: number;
  /** Outer body shape (the white/visible area) */
  body: {
    /** Horizontal inset from canvas edge (pixels) */
    insetX: number;
    /** Vertical inset from canvas edge (pixels) */
    insetY: number;
    /** Corner radii [topLeft, topRight, bottomRight, bottomLeft] in pixels */
    cornerRadii: [number, number, number, number];
  };
  /** Cutouts punched out of the body (camera, flash, etc.) */
  cutouts: MaskCutout[];
}
