import * as THREE from "three";
import {
  DEFAULT_SEED,
  TOTAL_WEEKS,
  generateWeeklyActivity,
  mulberry32,
} from "@/features/concepts/terrain/lib/career-data";

export interface HeightField {
  /** Row-major: data[line * samples + sample], giá trị [0,1] */
  data: Float32Array;
  lines: number;
  samples: number;
}

function smootherstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Value-noise 2D nhẹ (grid ngẫu nhiên + nội suy smoothstep) — tạo biến thiên
 * ngang cho mỗi đường ridgeline để địa hình không đối xứng nhân tạo.
 */
function buildValueNoise(seed: number, gridX: number, gridY: number) {
  const rand = mulberry32(seed);
  const grid = new Float32Array(gridX * gridY);
  for (let i = 0; i < grid.length; i += 1) {
    grid[i] = rand();
  }
  return (u: number, v: number): number => {
    const x = u * (gridX - 1);
    const y = v * (gridY - 1);
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = Math.min(x0 + 1, gridX - 1);
    const y1 = Math.min(y0 + 1, gridY - 1);
    const tx = smootherstep(x - x0);
    const ty = smootherstep(y - y0);
    const a = grid[y0 * gridX + x0];
    const b = grid[y0 * gridX + x1];
    const c = grid[y1 * gridX + x0];
    const d = grid[y1 * gridX + x1];
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
  };
}

/**
 * Bake trường độ cao lines × samples: mỗi line là một lát thời gian, độ cao
 * = hoạt động tuần đó × profile ngang (bell trung tâm × value-noise).
 */
export function buildHeightField(
  lines: number,
  samples: number,
  seed: number = DEFAULT_SEED,
): HeightField {
  const activity = generateWeeklyActivity(seed);
  const noise = buildValueNoise(seed ^ 0x9e3779b9, 18, 44);
  const data = new Float32Array(lines * samples);

  for (let line = 0; line < lines; line += 1) {
    const v = lines === 1 ? 0 : line / (lines - 1);
    const week = Math.min(
      TOTAL_WEEKS - 1,
      Math.round(v * (TOTAL_WEEKS - 1)),
    );
    const lineActivity = activity[week];
    for (let s = 0; s < samples; s += 1) {
      const u = samples === 1 ? 0 : s / (samples - 1);
      const centered = (u - 0.5) * 2;
      const bell = Math.exp(-centered * centered * 2.2);
      const grain = 0.55 + 0.45 * noise(u, v);
      data[line * samples + s] = Math.min(
        1,
        lineActivity * (0.35 + 0.65 * bell * grain),
      );
    }
  }
  return { data, lines, samples };
}

/**
 * Đóng gói trường độ cao thành DataTexture R8 (UnsignedByte) — không cần
 * extension float texture, vertex shader đọc .r đã chuẩn hóa [0,1].
 */
export function buildHeightTexture(field: HeightField): THREE.DataTexture {
  const bytes = new Uint8Array(field.data.length);
  for (let i = 0; i < field.data.length; i += 1) {
    bytes[i] = Math.round(field.data[i] * 255);
  }
  const texture = new THREE.DataTexture(
    bytes,
    field.samples,
    field.lines,
    THREE.RedFormat,
    THREE.UnsignedByteType,
  );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
