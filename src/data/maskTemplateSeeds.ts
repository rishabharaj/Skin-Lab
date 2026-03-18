import type { MaskTemplateConfig } from "@/lib/maskTemplateTypes";

/**
 * ~18 predefined mask templates covering all major phone designs.
 * Each template maps to multiple phone models with similar back panel shapes.
 *
 * Canvas: 400x820 px (portrait phone ratio ~1:2.05)
 * Body: rounded rect with brand-appropriate corner radii
 * Cutouts: camera lenses, flash, sensors positioned by real device layouts
 *
 * All cutout x/y/width/height are PERCENTAGES of the body area.
 */

// ─── APPLE ───────────────────────────────────────────

/** iPhone 16 Pro / 16 Pro Max — large square camera island, 3 circular lenses + flash */
export const IPHONE_16_PRO: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [42, 42, 42, 42] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "roundedRect", x: 3, y: 2, width: 28, height: 16, cornerRadius: 30 },
    { id: "main", label: "Main Camera", shape: "circle", x: 5, y: 3.5, width: 9, height: 5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 19, y: 3.5, width: 9, height: 5 },
    { id: "tele", label: "Telephoto", shape: "circle", x: 12, y: 10.5, width: 9, height: 5 },
    { id: "flash", label: "Flash", shape: "circle", x: 23, y: 11, width: 4, height: 2.2 },
  ],
};

/** iPhone 16 / 16 Plus — vertical dual camera, smaller island */
export const IPHONE_16: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [42, 42, 42, 42] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "roundedRect", x: 5, y: 2, width: 18, height: 16, cornerRadius: 40 },
    { id: "main", label: "Main Camera", shape: "circle", x: 8, y: 3, width: 10, height: 5.5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 8, y: 10, width: 10, height: 5.5 },
    { id: "flash", label: "Flash", shape: "circle", x: 17, y: 7, width: 3.5, height: 2 },
  ],
};

/** iPhone 15 Pro / 15 Pro Max — similar to 16 Pro but slightly different proportions */
export const IPHONE_15_PRO: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [40, 40, 40, 40] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "roundedRect", x: 3, y: 2, width: 27, height: 15.5, cornerRadius: 30 },
    { id: "main", label: "Main Camera", shape: "circle", x: 5, y: 3.5, width: 9, height: 5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 18, y: 3.5, width: 9, height: 5 },
    { id: "tele", label: "Telephoto", shape: "circle", x: 11, y: 10, width: 9, height: 5 },
    { id: "flash", label: "Flash", shape: "circle", x: 22, y: 10.5, width: 3.5, height: 2 },
  ],
};

/** iPhone 14 Pro / 14 Pro Max — triple camera */
export const IPHONE_14_PRO: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [38, 38, 38, 38] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "roundedRect", x: 3, y: 2, width: 27, height: 15.5, cornerRadius: 30 },
    { id: "main", label: "Main Camera", shape: "circle", x: 5, y: 3.5, width: 9, height: 5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 18, y: 3.5, width: 9, height: 5 },
    { id: "tele", label: "Telephoto", shape: "circle", x: 11, y: 10, width: 9, height: 5 },
    { id: "flash", label: "Flash", shape: "circle", x: 22, y: 10.5, width: 3.5, height: 2 },
  ],
};

/** iPhone 15/14/14 Plus/15 Plus — diagonal dual camera */
export const IPHONE_DUAL_DIAG: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [38, 38, 38, 38] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "roundedRect", x: 3, y: 2, width: 24, height: 14, cornerRadius: 30 },
    { id: "main", label: "Main Camera", shape: "circle", x: 5, y: 3, width: 9, height: 5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 15, y: 8, width: 9, height: 5 },
    { id: "flash", label: "Flash", shape: "circle", x: 18, y: 3.5, width: 3.5, height: 2 },
  ],
};

/** iPhone 13/13 Pro/13 Pro Max/12 Pro/12 Pro Max — diagonal dual/triple camera */
export const IPHONE_13_SERIES: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [36, 36, 36, 36] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "roundedRect", x: 3, y: 2, width: 26, height: 15, cornerRadius: 28 },
    { id: "main", label: "Main Camera", shape: "circle", x: 5, y: 3, width: 9, height: 5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 5, y: 9.5, width: 9, height: 5 },
    { id: "tele", label: "Tele/Sensor", shape: "circle", x: 17, y: 6, width: 9, height: 5 },
    { id: "flash", label: "Flash", shape: "circle", x: 18, y: 12, width: 3.5, height: 2 },
  ],
};

/** iPhone 12/12 Mini — dual camera, diagonal layout */
export const IPHONE_12: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [34, 34, 34, 34] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "roundedRect", x: 3, y: 2, width: 23, height: 13, cornerRadius: 28 },
    { id: "main", label: "Main Camera", shape: "circle", x: 5, y: 3, width: 9, height: 5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 13, y: 7.5, width: 9, height: 5 },
    { id: "flash", label: "Flash", shape: "circle", x: 17, y: 3.5, width: 3.5, height: 2 },
  ],
};

/** iPhone SE (2022) — single camera, centered top-left */
export const IPHONE_SE: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [28, 28, 28, 28] },
  cutouts: [
    { id: "main", label: "Main Camera", shape: "circle", x: 5, y: 3, width: 10, height: 5.5 },
    { id: "flash", label: "Flash", shape: "circle", x: 5, y: 10, width: 3.5, height: 2 },
  ],
};

// ─── SAMSUNG ─────────────────────────────────────────

/** Galaxy S Ultra series (S24/S23/S22 Ultra) — individual lenses in vertical line, no island */
export const GALAXY_S_ULTRA: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [30, 30, 30, 30] },
  cutouts: [
    { id: "main", label: "Main Camera", shape: "circle", x: 5, y: 3, width: 9, height: 5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 5, y: 9, width: 9, height: 5 },
    { id: "tele1", label: "Telephoto 1", shape: "circle", x: 5, y: 15, width: 7, height: 4 },
    { id: "tele2", label: "Telephoto 2", shape: "circle", x: 5, y: 20, width: 7, height: 4 },
    { id: "flash", label: "Flash", shape: "circle", x: 16, y: 3.5, width: 3.5, height: 2 },
  ],
};

/** Galaxy S Standard (S24/S23/S22/S21/FE/A-series) — horizontal camera island */
export const GALAXY_S_STANDARD: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [32, 32, 32, 32] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "roundedRect", x: 3, y: 2, width: 34, height: 10, cornerRadius: 40 },
    { id: "main", label: "Main Camera", shape: "circle", x: 5, y: 3, width: 8, height: 4.5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 15, y: 3, width: 8, height: 4.5 },
    { id: "tele", label: "Telephoto", shape: "circle", x: 25, y: 3, width: 8, height: 4.5 },
    { id: "flash", label: "Flash", shape: "circle", x: 30, y: 8, width: 3, height: 1.7 },
  ],
};

/** Galaxy Z Fold (Fold 6/5/4) — wide rectangular back, vertical camera strip */
export const GALAXY_Z_FOLD: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 440,
  canvasHeight: 780,
  body: { insetX: 10, insetY: 10, cornerRadii: [28, 28, 28, 28] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "roundedRect", x: 3, y: 2, width: 16, height: 18, cornerRadius: 30 },
    { id: "main", label: "Main Camera", shape: "circle", x: 5, y: 3, width: 10, height: 5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 5, y: 9, width: 10, height: 5 },
    { id: "tele", label: "Telephoto", shape: "circle", x: 5, y: 15, width: 6, height: 3 },
  ],
};

/** Galaxy Z Flip (Flip 6/5/4) — compact top half, outer display + camera */
export const GALAXY_Z_FLIP: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 380,
  canvasHeight: 420,
  body: { insetX: 10, insetY: 10, cornerRadii: [30, 30, 30, 30] },
  cutouts: [
    { id: "outer-display", label: "Outer Display", shape: "roundedRect", x: 20, y: 8, width: 60, height: 50, cornerRadius: 20 },
    { id: "main", label: "Main Camera", shape: "circle", x: 28, y: 65, width: 14, height: 8 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 50, y: 65, width: 14, height: 8 },
    { id: "flash", label: "Flash", shape: "circle", x: 68, y: 68, width: 6, height: 3.5 },
  ],
};

// ─── GOOGLE PIXEL ────────────────────────────────────

/** Pixel 9 series — horizontal camera bar (pill-shaped visor) */
export const PIXEL_9: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [36, 36, 36, 36] },
  cutouts: [
    { id: "visor", label: "Camera Visor", shape: "pill", x: 8, y: 3, width: 84, height: 7, cornerRadius: 50 },
    { id: "main", label: "Main Camera", shape: "circle", x: 18, y: 3.5, width: 8, height: 4.5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 30, y: 3.5, width: 8, height: 4.5 },
    { id: "tele", label: "Telephoto", shape: "circle", x: 42, y: 3.5, width: 7, height: 4 },
    { id: "flash", label: "Flash", shape: "circle", x: 72, y: 4, width: 4, height: 2.2 },
  ],
};

/** Pixel 8/7/6 series — full-width camera bar from edge to edge */
export const PIXEL_BAR: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [34, 34, 34, 34] },
  cutouts: [
    { id: "bar", label: "Camera Bar", shape: "roundedRect", x: 0, y: 4, width: 100, height: 6, cornerRadius: 10 },
    { id: "main", label: "Main Camera", shape: "circle", x: 18, y: 4.5, width: 7, height: 4 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 30, y: 4.5, width: 7, height: 4 },
    { id: "flash", label: "Flash", shape: "circle", x: 70, y: 5, width: 3.5, height: 2 },
  ],
};

/** Pixel 9 Pro Fold — wide aspect ratio for foldable */
export const PIXEL_FOLD: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 440,
  canvasHeight: 780,
  body: { insetX: 10, insetY: 10, cornerRadii: [30, 30, 30, 30] },
  cutouts: [
    { id: "visor", label: "Camera Visor", shape: "pill", x: 8, y: 3, width: 80, height: 7, cornerRadius: 50 },
    { id: "main", label: "Main Camera", shape: "circle", x: 18, y: 3.5, width: 8, height: 4.5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 30, y: 3.5, width: 8, height: 4.5 },
    { id: "tele", label: "Telephoto", shape: "circle", x: 42, y: 3.5, width: 7, height: 4 },
  ],
};

// ─── ONEPLUS ─────────────────────────────────────────

/** OnePlus 11/12/13 — large circular camera island */
export const ONEPLUS_CIRCLE: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [34, 34, 34, 34] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "circle", x: 3, y: 1.5, width: 28, height: 16, cornerRadius: 0 },
    { id: "main", label: "Main Camera", shape: "circle", x: 5, y: 2.5, width: 9, height: 5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 18, y: 2.5, width: 9, height: 5 },
    { id: "tele", label: "Telephoto", shape: "circle", x: 11, y: 9, width: 9, height: 5 },
    { id: "flash", label: "Flash", shape: "circle", x: 23, y: 10, width: 3.5, height: 2 },
  ],
};

/** OnePlus Nord / 10 Pro — rectangular camera island, top-left */
export const ONEPLUS_RECT: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [32, 32, 32, 32] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "roundedRect", x: 3, y: 2, width: 20, height: 18, cornerRadius: 25 },
    { id: "main", label: "Main Camera", shape: "circle", x: 6, y: 3, width: 10, height: 5.5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 6, y: 10, width: 10, height: 5.5 },
    { id: "macro", label: "Macro", shape: "circle", x: 6, y: 16, width: 5, height: 2.8 },
    { id: "flash", label: "Flash", shape: "circle", x: 16, y: 16, width: 3.5, height: 2 },
  ],
};

// ─── GENERIC TEMPLATES ───────────────────────────────

/** Generic top-left rectangular island — covers Xiaomi, Realme, Oppo, Vivo, POCO, Redmi */
export const GENERIC_RECT_TL: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [32, 32, 32, 32] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "roundedRect", x: 3, y: 2, width: 22, height: 20, cornerRadius: 25 },
    { id: "main", label: "Main Camera", shape: "circle", x: 6, y: 3, width: 10, height: 5.5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 6, y: 10, width: 10, height: 5.5 },
    { id: "macro", label: "Macro/Depth", shape: "circle", x: 6, y: 17, width: 5, height: 2.8 },
    { id: "flash", label: "Flash", shape: "circle", x: 17, y: 5, width: 3.5, height: 2 },
  ],
};

/** Generic center large circle — covers Motorola, some Vivo */
export const GENERIC_CENTER_CIRCLE: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [32, 32, 32, 32] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "circle", x: 28, y: 2, width: 36, height: 20 },
    { id: "main", label: "Main Camera", shape: "circle", x: 32, y: 3, width: 12, height: 7 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 48, y: 3, width: 12, height: 7 },
    { id: "macro", label: "Macro", shape: "circle", x: 40, y: 14, width: 8, height: 4.5 },
    { id: "flash", label: "Flash", shape: "circle", x: 55, y: 14, width: 4, height: 2.2 },
  ],
};

/** Nothing Phone style — flat back, dual camera top-left */
export const NOTHING_PHONE: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [34, 34, 34, 34] },
  cutouts: [
    { id: "cam-island", label: "Camera Island", shape: "roundedRect", x: 3, y: 2, width: 24, height: 14, cornerRadius: 30 },
    { id: "main", label: "Main Camera", shape: "circle", x: 5, y: 3, width: 9, height: 5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 15, y: 3, width: 9, height: 5 },
    { id: "flash", label: "Flash", shape: "circle", x: 10, y: 10, width: 4, height: 2.2 },
  ],
};

/** Foldable generic — for Oppo Find N3 Flip, Moto Razr series */
export const FOLDABLE_GENERIC: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 380,
  canvasHeight: 440,
  body: { insetX: 10, insetY: 10, cornerRadii: [28, 28, 28, 28] },
  cutouts: [
    { id: "outer-display", label: "Outer Display", shape: "roundedRect", x: 18, y: 8, width: 64, height: 48, cornerRadius: 18 },
    { id: "main", label: "Main Camera", shape: "circle", x: 30, y: 62, width: 14, height: 8.5 },
    { id: "ultrawide", label: "Ultra Wide", shape: "circle", x: 50, y: 62, width: 14, height: 8.5 },
    { id: "flash", label: "Flash", shape: "circle", x: 68, y: 65, width: 5, height: 3 },
  ],
};

// ─── EXPORTS ─────────────────────────────────────────

export const ALL_TEMPLATES: Record<string, { name: string; description: string; brandHint: string; config: MaskTemplateConfig }> = {
  "iphone-16-pro": { name: "iPhone 16 Pro Style", description: "Large square island, 3 lenses + flash", brandHint: "apple", config: IPHONE_16_PRO },
  "iphone-16": { name: "iPhone 16 Standard", description: "Vertical dual camera, compact island", brandHint: "apple", config: IPHONE_16 },
  "iphone-15-pro": { name: "iPhone 15 Pro Style", description: "Triple camera square island", brandHint: "apple", config: IPHONE_15_PRO },
  "iphone-14-pro": { name: "iPhone 14 Pro Style", description: "Triple camera square island", brandHint: "apple", config: IPHONE_14_PRO },
  "iphone-dual-diag": { name: "iPhone Dual Diagonal", description: "Diagonal dual camera (14/15 base)", brandHint: "apple", config: IPHONE_DUAL_DIAG },
  "iphone-13-series": { name: "iPhone 13/12 Pro Series", description: "Diagonal triple/dual camera", brandHint: "apple", config: IPHONE_13_SERIES },
  "iphone-12": { name: "iPhone 12/12 Mini", description: "Dual camera diagonal layout", brandHint: "apple", config: IPHONE_12 },
  "iphone-se": { name: "iPhone SE", description: "Single camera, compact design", brandHint: "apple", config: IPHONE_SE },
  "galaxy-s-ultra": { name: "Galaxy S Ultra", description: "Individual vertical lenses, no island", brandHint: "samsung", config: GALAXY_S_ULTRA },
  "galaxy-s-standard": { name: "Galaxy S Standard", description: "Horizontal triple camera island", brandHint: "samsung", config: GALAXY_S_STANDARD },
  "galaxy-z-fold": { name: "Galaxy Z Fold", description: "Wide back with vertical camera strip", brandHint: "samsung", config: GALAXY_Z_FOLD },
  "galaxy-z-flip": { name: "Galaxy Z Flip", description: "Compact with outer display cutout", brandHint: "samsung", config: GALAXY_Z_FLIP },
  "pixel-9": { name: "Pixel 9 Series", description: "Horizontal pill-shaped camera visor", brandHint: "google", config: PIXEL_9 },
  "pixel-bar": { name: "Pixel Camera Bar", description: "Full-width edge-to-edge camera bar", brandHint: "google", config: PIXEL_BAR },
  "pixel-fold": { name: "Pixel Fold", description: "Wide foldable with camera visor", brandHint: "google", config: PIXEL_FOLD },
  "oneplus-circle": { name: "OnePlus Circle Island", description: "Large circular camera module", brandHint: "oneplus", config: ONEPLUS_CIRCLE },
  "oneplus-rect": { name: "OnePlus Rect Island", description: "Rectangular island top-left", brandHint: "oneplus", config: ONEPLUS_RECT },
  "generic-rect-tl": { name: "Generic Rect Top-Left", description: "Standard rect island (Xiaomi/Realme/Oppo/Vivo)", brandHint: "", config: GENERIC_RECT_TL },
  "generic-center-circle": { name: "Generic Center Circle", description: "Centered circular module (Motorola/Vivo)", brandHint: "", config: GENERIC_CENTER_CIRCLE },
  "nothing-phone": { name: "Nothing Phone", description: "Flat back, dual camera top-left", brandHint: "nothing", config: NOTHING_PHONE },
  "foldable-generic": { name: "Foldable Generic", description: "Compact foldable with outer display", brandHint: "", config: FOLDABLE_GENERIC },
};

/**
 * Model slug -> Template key mapping.
 * Maps each of the ~87 device models to their closest template.
 */
export const MODEL_TEMPLATE_MAP: Record<string, string> = {
  // Apple
  "iphone-16-pro-max": "iphone-16-pro",
  "iphone-16-pro": "iphone-16-pro",
  "iphone-17-pro-max": "iphone-16-pro",
  "iphone-16-plus": "iphone-16",
  "iphone-16": "iphone-16",
  "iphone-15-pro-max": "iphone-15-pro",
  "iphone-15-pro": "iphone-15-pro",
  "iphone-15-plus": "iphone-dual-diag",
  "iphone-15": "iphone-dual-diag",
  "iphone-14-pro-max": "iphone-14-pro",
  "iphone-14-pro": "iphone-14-pro",
  "iphone-14-plus": "iphone-dual-diag",
  "iphone-14": "iphone-dual-diag",
  "iphone-13-pro-max": "iphone-13-series",
  "iphone-13-pro": "iphone-13-series",
  "iphone-13": "iphone-13-series",
  "iphone-13-mini": "iphone-13-series",
  "iphone-12-pro-max": "iphone-13-series",
  "iphone-12-pro": "iphone-13-series",
  "iphone-12": "iphone-12",
  "iphone-12-mini": "iphone-12",
  "iphone-se-2022": "iphone-se",

  // Samsung
  "galaxy-s24-ultra": "galaxy-s-ultra",
  "galaxy-s23-ultra": "galaxy-s-ultra",
  "galaxy-s22-ultra": "galaxy-s-ultra",
  "galaxy-s21-ultra": "galaxy-s-ultra",
  "galaxy-s24-plus": "galaxy-s-standard",
  "galaxy-s24": "galaxy-s-standard",
  "galaxy-s24-fe": "galaxy-s-standard",
  "galaxy-s23-plus": "galaxy-s-standard",
  "galaxy-s23": "galaxy-s-standard",
  "galaxy-s23-fe": "galaxy-s-standard",
  "galaxy-s22-plus": "galaxy-s-standard",
  "galaxy-s22": "galaxy-s-standard",
  "galaxy-a55": "galaxy-s-standard",
  "galaxy-a54": "galaxy-s-standard",
  "galaxy-a35": "galaxy-s-standard",
  "galaxy-z-fold6": "galaxy-z-fold",
  "galaxy-z-fold5": "galaxy-z-fold",
  "galaxy-z-fold4": "galaxy-z-fold",
  "galaxy-z-flip6": "galaxy-z-flip",
  "galaxy-z-flip5": "galaxy-z-flip",
  "galaxy-z-flip4": "galaxy-z-flip",

  // Google Pixel
  "pixel-9-pro-xl": "pixel-9",
  "pixel-9-pro": "pixel-9",
  "pixel-9": "pixel-9",
  "pixel-9-pro-fold": "pixel-fold",
  "pixel-8-pro": "pixel-bar",
  "pixel-8": "pixel-bar",
  "pixel-8a": "pixel-bar",
  "pixel-7-pro": "pixel-bar",
  "pixel-7": "pixel-bar",
  "pixel-7a": "pixel-bar",
  "pixel-6-pro": "pixel-bar",
  "pixel-6": "pixel-bar",

  // OnePlus
  "oneplus-13": "oneplus-circle",
  "oneplus-12": "oneplus-circle",
  "oneplus-12r": "oneplus-rect",
  "oneplus-11": "oneplus-circle",
  "oneplus-10-pro": "oneplus-circle",
  "oneplus-nord-4": "oneplus-rect",
  "oneplus-nord-3": "oneplus-rect",
  "oneplus-nord-ce-4": "oneplus-rect",

  // Xiaomi / POCO / Redmi
  "xiaomi-14-ultra": "generic-rect-tl",
  "xiaomi-14-pro": "generic-rect-tl",
  "xiaomi-14": "generic-rect-tl",
  "xiaomi-13-ultra": "generic-rect-tl",
  "xiaomi-13-pro": "generic-rect-tl",
  "xiaomi-13": "generic-rect-tl",
  "poco-f6-pro": "generic-rect-tl",
  "poco-f5": "generic-rect-tl",
  "redmi-note-12-pro-plus": "generic-rect-tl",
  "redmi-note-13-pro": "generic-rect-tl",
  "redmi-note-13-pro-plus": "generic-rect-tl",
  "redmi-note-14": "generic-rect-tl",

  // Realme
  "realme-gt5-pro": "generic-rect-tl",
  "realme-gt3": "generic-rect-tl",
  "realme-12-pro-plus": "generic-rect-tl",
  "realme-12-pro": "generic-rect-tl",
  "realme-11-pro-plus": "generic-rect-tl",
  "realme-narzo-70-pro": "generic-rect-tl",
  "realme-gt-7-pro": "generic-rect-tl",

  // Oppo
  "oppo-find-x7-ultra": "generic-rect-tl",
  "oppo-find-x6-pro": "generic-rect-tl",
  "oppo-find-n3-flip": "foldable-generic",
  "oppo-reno-12-pro": "generic-rect-tl",
  "oppo-reno-11-pro": "generic-rect-tl",
  "oppo-a79": "generic-rect-tl",

  // Vivo / iQOO
  "vivo-x100-ultra": "generic-rect-tl",
  "vivo-x100-pro": "generic-rect-tl",
  "vivo-x100": "generic-rect-tl",
  "vivo-x90-pro": "generic-rect-tl",
  "vivo-v30-pro": "generic-rect-tl",
  "iqoo-12": "generic-rect-tl",

  // Motorola
  "moto-edge-50-ultra": "generic-center-circle",
  "moto-edge-50-pro": "generic-center-circle",
  "moto-edge-40-pro": "generic-center-circle",
  "motorola-edge-60-pro": "generic-center-circle",
  "moto-razr-50-ultra": "foldable-generic",
  "moto-razr-40-ultra": "foldable-generic",
  "moto-g84": "generic-center-circle",

  // Nothing
  "nothing-phone-2a-plus": "nothing-phone",
  "nothing-phone-2a": "nothing-phone",
  "nothing-phone-2": "nothing-phone",
  "nothing-phone-1": "nothing-phone",
};
