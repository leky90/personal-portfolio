import * as THREE from "three";
import {
  PREMATURE_SPLIT,
  SERVICES,
} from "@/features/concepts/monolith-to-mesh/lib/migration-plan";

/**
 * Kerf-cut thuần TS: chia đệ quy một slab thành đúng N khối hộp rời nhau
 * (phân hoạch chính xác nên tổng thể tích bảo toàn), gán mỗi khối cho một
 * service, bake vị trí đích trong mesh + cửa sổ phase theo năm tách.
 * Chạy một lần lúc mount; useFrame chỉ ghi uniform.
 */

export const SLAB = { w: 6, h: 4, d: 3 };

/** kind: 0 = core (ở lại), 1 = tách bình thường, 2 = tách non gộp ngược */
export interface FragmentEntry {
  service: (typeof SERVICES)[number];
  home: { center: [number, number, number]; size: [number, number, number] };
  target: [number, number, number];
  /** Cửa sổ tách [startU, endU] theo thang u = (năm-2014)/12 */
  phase: [number, number];
  /** Cửa sổ gộp ngược cho kind 2 (0,0 nếu không dùng) */
  phase2: [number, number];
  kind: 0 | 1 | 2;
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

function yearToU(year: number): number {
  return Math.min(Math.max((year - 2014) / 12, 0), 1);
}

interface Box {
  center: [number, number, number];
  size: [number, number, number];
}

export function sliceMonolith(seed: number): FragmentEntry[] {
  const rand = mulberry32(seed);

  // Chia đệ quy: luôn cắt khối lớn nhất theo trục dài nhất
  const boxes: Box[] = [
    { center: [0, 0, 0], size: [SLAB.w, SLAB.h, SLAB.d] },
  ];
  while (boxes.length < SERVICES.length) {
    let largest = 0;
    let largestVolume = 0;
    boxes.forEach((box, index) => {
      const volume = box.size[0] * box.size[1] * box.size[2];
      if (volume > largestVolume) {
        largestVolume = volume;
        largest = index;
      }
    });
    const box = boxes.splice(largest, 1)[0];
    const axis = box.size.indexOf(Math.max(...box.size)) as 0 | 1 | 2;
    const ratio = 0.35 + rand() * 0.3;
    const sizeA = [...box.size] as [number, number, number];
    const sizeB = [...box.size] as [number, number, number];
    sizeA[axis] = box.size[axis] * ratio;
    sizeB[axis] = box.size[axis] * (1 - ratio);
    const centerA = [...box.center] as [number, number, number];
    const centerB = [...box.center] as [number, number, number];
    centerA[axis] = box.center[axis] - box.size[axis] / 2 + sizeA[axis] / 2;
    centerB[axis] = box.center[axis] + box.size[axis] / 2 - sizeB[axis] / 2;
    boxes.push({ center: centerA, size: sizeA });
    boxes.push({ center: centerB, size: sizeB });
  }

  // Khối to nhất cho core (ở lại), còn lại theo năm tách tăng dần
  const sortedBoxes = [...boxes].sort(
    (a, b) =>
      b.size[0] * b.size[1] * b.size[2] - a.size[0] * a.size[1] * a.size[2],
  );
  const sortedServices = [...SERVICES].sort((a, b) => {
    const ya = a.splitYear ?? 0;
    const yb = b.splitYear ?? 0;
    return ya - yb;
  });

  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  let shellIndex = 0;

  return sortedServices.map((service, index) => {
    const box = sortedBoxes[index];
    const isPremature = service.id === PREMATURE_SPLIT.id;
    const kind: 0 | 1 | 2 =
      service.splitYear === null ? 0 : isPremature ? 2 : 1;

    let target: [number, number, number];
    if (kind === 0) {
      // Core co cụm về gốc — nhịp "hợp nhất" cuối thập kỷ
      target = [
        box.center[0] * 0.45,
        box.center[1] * 0.45,
        box.center[2] * 0.45,
      ];
    } else {
      // Shell golden-angle quanh khối, bán kính 6.5..8.5
      const i = shellIndex;
      shellIndex += 1;
      // Kẹp y tránh hai cực — mọi node shell đều giữ bán kính xa khối core
      const raw = 1 - (2 * (i + 0.5)) / (SERVICES.length - 5);
      const y = Math.max(-0.72, Math.min(0.72, raw));
      const radiusAt = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = GOLDEN * i;
      const radius = 6.5 + rand() * 2;
      target = [
        Math.cos(theta) * radiusAt * radius,
        y * 3.2,
        Math.sin(theta) * radiusAt * radius,
      ];
    }

    const splitU = service.splitYear === null ? 1 : yearToU(service.splitYear);
    const phase: [number, number] =
      kind === 0
        ? [0.92, 1]
        : kind === 2
          ? [yearToU(PREMATURE_SPLIT.outYear), yearToU(PREMATURE_SPLIT.outYear) + 0.06]
          : [splitU, Math.min(1, splitU + 0.08)];
    const phase2: [number, number] =
      kind === 2
        ? [yearToU(PREMATURE_SPLIT.backYear), yearToU(PREMATURE_SPLIT.backYear) + 0.06]
        : [0, 0];

    return { service, home: box, target, phase, phase2, kind };
  });
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * Mirror TS của đường đi trong vertex shader — dùng cho hit-proxy raycast
 * và test. Ghi vào out có sẵn, zero allocation.
 */
export function fragmentPositionAt(
  entry: FragmentEntry,
  u: number,
  out: THREE.Vector3,
): THREE.Vector3 {
  const pOut = smoothstep(entry.phase[0], entry.phase[1], u);
  const pBack =
    entry.kind === 2 ? smoothstep(entry.phase2[0], entry.phase2[1], u) : 0;
  const sep = entry.kind === 0 ? pOut : pOut * (1 - pBack);
  const lift = Math.sin(sep * Math.PI) * 1.2;
  out.set(
    entry.home.center[0] + (entry.target[0] - entry.home.center[0]) * sep,
    entry.home.center[1] +
      (entry.target[1] - entry.home.center[1]) * sep +
      lift,
    entry.home.center[2] + (entry.target[2] - entry.home.center[2]) * sep,
  );
  return out;
}

export interface MeshLinks {
  /** Cặp index entry cho LineSegments */
  pairs: number[];
  /** Birth (thang u) cho mỗi CẶP — max năm tách của hai đầu */
  births: number[];
}

/** Cạnh mesh: mỗi service tách nối 2 láng giềng target gần nhất. */
export function buildMeshLinks(entries: FragmentEntry[]): MeshLinks {
  const pairs: number[] = [];
  const births: number[] = [];
  const seen = new Set<string>();

  entries.forEach((entry, i) => {
    if (entry.kind === 0) return;
    const distances = entries
      .map((other, j) => {
        if (j === i || other.kind === 0) return null;
        const dx = entry.target[0] - other.target[0];
        const dy = entry.target[1] - other.target[1];
        const dz = entry.target[2] - other.target[2];
        return { j, d: dx * dx + dy * dy + dz * dz };
      })
      .filter((x): x is { j: number; d: number } => x !== null)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);

    for (const { j } of distances) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push(i, j);
      births.push(Math.max(entries[i].phase[1], entries[j].phase[1]));
    }
  });

  return { pairs, births };
}
