import * as THREE from "three";

/**
 * Glyph atlas — bản độc lập của compiled-light (xem ghi chú trong bayer.ts
 * về lý do không import chéo giữa các feature concept).
 */
export const GLYPH_RAMP = " .':;~-=+*x%#&8@";

export const GLYPH_CELL = 64;

/** Vẽ atlas 16 glyph 1 hàng; trả null nếu thiếu 2D context (jsdom). */
export function createGlyphAtlas(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") {
    return null;
  }
  const canvas = document.createElement("canvas");
  canvas.width = GLYPH_CELL * GLYPH_RAMP.length;
  canvas.height = GLYPH_CELL;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = `${Math.round(GLYPH_CELL * 0.82)}px ui-monospace, Menlo, Consolas, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < GLYPH_RAMP.length; i += 1) {
    ctx.fillText(GLYPH_RAMP[i], (i + 0.5) * GLYPH_CELL, GLYPH_CELL * 0.54);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
