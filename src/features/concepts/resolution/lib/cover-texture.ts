import * as THREE from "three";

/** Dải màu gradient theo hue — giữ nguyên hue, đổi lightness để có tương phản. */
export function coverGradientStops(hue: number): string[] {
  return [
    `hsl(${hue}, 75%, 10%)`,
    `hsl(${hue}, 65%, 42%)`,
    `hsl(${hue}, 85%, 76%)`,
  ];
}

/**
 * Texture nguồn procedural cho một cover project: gradient chéo + vài khối
 * hình học sáng/tối để pipeline ASCII có biến thiên luminance thú vị.
 * Trả về null nếu không có 2D context (jsdom) — caller tự fallback.
 */
export function createCoverTexture(hue: number): THREE.CanvasTexture | null {
  if (typeof document === "undefined") {
    return null;
  }
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  const stops = coverGradientStops(hue);
  const gradient = ctx.createLinearGradient(0, size, size, 0);
  for (let i = 0; i < stops.length; i += 1) {
    gradient.addColorStop(i / (stops.length - 1), stops[i]);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Khối sáng lớn — vùng highlight sẽ ăn accent trong shader.
  ctx.fillStyle = `hsl(${hue}, 90%, 88%)`;
  ctx.beginPath();
  ctx.arc(size * 0.68, size * 0.34, size * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Vài thanh tối tạo nhịp — gợi bố cục UI của case study.
  ctx.fillStyle = `hsl(${hue}, 70%, 6%)`;
  ctx.fillRect(size * 0.12, size * 0.62, size * 0.5, size * 0.06);
  ctx.fillRect(size * 0.12, size * 0.74, size * 0.34, size * 0.06);
  ctx.fillStyle = `hsl(${hue}, 80%, 62%)`;
  ctx.fillRect(size * 0.12, size * 0.18, size * 0.1, size * 0.1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/** Fallback không cần canvas 2D: gradient dọc 1×32 bake bằng DataTexture. */
export function createFallbackCoverTexture(hue: number): THREE.DataTexture {
  const height = 32;
  const data = new Uint8Array(height * 4);
  for (let y = 0; y < height; y += 1) {
    const t = y / (height - 1);
    const color = new THREE.Color().setHSL(hue / 360, 0.7, 0.1 + t * 0.65);
    data[y * 4] = Math.round(color.r * 255);
    data[y * 4 + 1] = Math.round(color.g * 255);
    data[y * 4 + 2] = Math.round(color.b * 255);
    data[y * 4 + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, 1, height, THREE.RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}
