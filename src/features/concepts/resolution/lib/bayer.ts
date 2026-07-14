/**
 * Ma trận Bayer 8×8 cho ordered dithering — sinh đệ quy theo công thức chuẩn
 * M(2n) = [[4M, 4M+2], [4M+3, 4M+1]] để tránh gõ tay 64 số dễ sai.
 */
function buildBayerMatrix(size: number): number[][] {
  if (size === 1) {
    return [[0]];
  }
  const half = size / 2;
  const base = buildBayerMatrix(half);
  const matrix: number[][] = Array.from({ length: size }, () =>
    new Array<number>(size).fill(0),
  );
  for (let y = 0; y < half; y += 1) {
    for (let x = 0; x < half; x += 1) {
      const v = base[y][x] * 4;
      matrix[y][x] = v;
      matrix[y][x + half] = v + 2;
      matrix[y + half][x] = v + 3;
      matrix[y + half][x + half] = v + 1;
    }
  }
  return matrix;
}

/** 64 giá trị nguyên 0..63, flatten theo hàng (row-major). */
export const BAYER_8X8: number[] = buildBayerMatrix(8).flat();

/** Bản chuẩn hóa (v + 0.5) / 64 ∈ (0, 1) — upload thẳng làm uniform float[64]. */
export const BAYER_NORMALIZED: Float32Array = Float32Array.from(
  BAYER_8X8,
  (v) => (v + 0.5) / 64,
);

/**
 * Ngưỡng dither tại tọa độ cell (x, y), tuần hoàn chu kỳ 8.
 * Modulo chuẩn hóa để tọa độ âm vẫn ánh xạ đúng ((-1 % 8) của JS là -1).
 */
export function bayerThreshold(x: number, y: number): number {
  const ix = ((Math.floor(x) % 8) + 8) % 8;
  const iy = ((Math.floor(y) % 8) + 8) % 8;
  return (BAYER_8X8[iy * 8 + ix] + 0.5) / 64;
}
