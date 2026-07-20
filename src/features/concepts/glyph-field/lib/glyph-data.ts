/**
 * Glyph Field: toàn bộ typography của trang là MỘT hệ hạt trong đúng
 * một draw call. Toạ độ chữ sample từ canvas 2D lúc runtime; phần lõi
 * (lọc alpha, fit về đúng N hạt, chuẩn hoá toạ độ, map progress → cặp
 * hàng texture) là hàm thuần test được — canvas chỉ là nguồn pixel.
 */

export const HEADINGS = ["KY LE", "WORK", "LAB", "CONTACT"];

/** Số hạt — bội của 64 để xếp vừa texture 64 cột (64 × 64 = 4096) */
export const PARTICLE_COUNT = 4096;

/** Kích thước canvas sample cho mỗi heading */
export const SAMPLE_WIDTH = 512;
export const SAMPLE_HEIGHT = 128;

/** Lọc pixel chữ từ mảng alpha (đã tách kênh) của canvas 2D. */
export function pointsFromAlpha(
  alpha: ArrayLike<number>,
  width: number,
  height: number,
  threshold: number,
): [number, number][] {
  const points: [number, number][] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (alpha[y * width + x] > threshold) {
        points.push([x, y]);
      }
    }
  }
  return points;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fit tập điểm về ĐÚNG n hạt: lặp vòng + jitter sub-pixel deterministic.
 * Nguồn rỗng (headless, font chưa sẵn) → fallback vòng tròn để field
 * không bao giờ trống.
 */
export function fitPoints(
  points: readonly [number, number][],
  n: number,
  seed: number,
): [number, number][] {
  const rand = mulberry32(seed);
  const fitted: [number, number][] = [];
  if (points.length === 0) {
    for (let i = 0; i < n; i += 1) {
      const angle = (i / n) * Math.PI * 2;
      const radius = 40 + rand() * 12;
      fitted.push([
        SAMPLE_WIDTH / 2 + Math.cos(angle) * radius * 2.2,
        SAMPLE_HEIGHT / 2 + Math.sin(angle) * radius,
      ]);
    }
    return fitted;
  }
  for (let i = 0; i < n; i += 1) {
    const [x, y] = points[i % points.length];
    fitted.push([x + (rand() - 0.5) * 0.9, y + (rand() - 0.5) * 0.9]);
  }
  return fitted;
}

/** Pixel canvas → toạ độ world tâm giữa, y hướng lên. */
export function normalizePoints(
  points: readonly [number, number][],
  width: number,
  height: number,
  worldWidth: number,
): [number, number][] {
  const aspect = height / width;
  return points.map(([x, y]) => [
    (x / width - 0.5) * worldWidth,
    -(y / height - 0.5) * worldWidth * aspect,
  ]);
}

export interface RowPair {
  rowA: number;
  rowB: number;
  blend: number;
}

/** Progress [0, số heading - 1] → cặp hàng texture + hệ số blend. */
export function rowPair(progress: number): RowPair {
  const max = HEADINGS.length - 1;
  const p = Math.min(Math.max(progress, 0), max);
  const rowA = Math.floor(p);
  const rowB = Math.min(rowA + 1, max);
  return { rowA, rowB, blend: p - rowA };
}
