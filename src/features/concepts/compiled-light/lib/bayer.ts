/**
 * Ma trận Bayer 8×8 — bản sao độc lập của resolution/lib/bayer để mỗi
 * feature concept tự đóng gói: khi chốt concept khác, xóa trọn thư mục
 * này không để lại dependency chéo.
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

/** 64 giá trị nguyên 0..63, row-major. */
export const BAYER_8X8: number[] = buildBayerMatrix(8).flat();

/** Bản chuẩn hóa (v + 0.5) / 64 ∈ (0,1) — upload thẳng làm uniform float[64]. */
export const BAYER_NORMALIZED: Float32Array = Float32Array.from(
  BAYER_8X8,
  (v) => (v + 0.5) / 64,
);
