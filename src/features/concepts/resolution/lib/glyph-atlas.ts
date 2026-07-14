import * as THREE from "three";

/** Ramp 16 glyph từ thưa → đặc, index = bucket độ sáng của cell. */
export const GLYPH_RAMP = " .':;~-=+*x%#&8@";

/** Kích thước px của một ô glyph trong atlas (vuông). */
export const GLYPH_CELL = 64;

/** Ánh xạ luminance [0,1] → index glyph [0,15], kẹp ngoài khoảng. */
export function glyphIndexForLuminance(luminance: number): number {
  const clamped = Math.min(Math.max(luminance, 0), 1);
  return Math.round(clamped * (GLYPH_RAMP.length - 1));
}

/**
 * Vẽ atlas 16 glyph (1 hàng × 16 cột) bằng font monospace của site vào
 * CanvasTexture. Trả về null nếu môi trường không có 2D context (jsdom)
 * — caller phải tự fallback.
 */
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
