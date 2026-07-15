import type * as THREE from "three";
import type { TopologyGraph } from "@/features/concepts/living-topology/lib/topology-graph";
import { SYSTEMS } from "@/features/concepts/living-topology/lib/systems-data";

/**
 * Route của một packet: random-walk seeded trên adjacency của graph —
 * polyline bake sẵn, useFrame chỉ nội suy theo chiều dài (zero allocation).
 */
export interface PacketRoute {
  /** xyz liên tiếp của polyline */
  points: Float32Array;
  /** chiều dài cộng dồn tại từng đỉnh (segmentEnds[cuối] = totalLength) */
  segmentEnds: Float32Array;
  totalLength: number;
  /** packet chỉ chạy khi năm hiện tại ≥ year (node trẻ nhất trên route) */
  year: number;
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

export function buildPacketRoutes(
  graph: TopologyGraph,
  count: number,
  seed: number,
): PacketRoute[] {
  const rand = mulberry32(seed);
  const routes: PacketRoute[] = [];

  for (let r = 0; r < count; r += 1) {
    // Xuất phát từ hub một hệ thống seeded — packet là "request" đi qua kiến trúc
    const startHub = graph.hubs[Math.floor(rand() * graph.hubs.length)];
    const walk = [startHub];
    let current = startHub;
    let previous = -1;
    const hops = 3 + Math.floor(rand() * 4);
    for (let h = 0; h < hops; h += 1) {
      const neighbors = graph.adjacency[current].filter((n) => n !== previous);
      if (neighbors.length === 0) break;
      previous = current;
      current = neighbors[Math.floor(rand() * neighbors.length)];
      walk.push(current);
    }

    const points = new Float32Array(walk.length * 3);
    const segmentEnds = new Float32Array(walk.length);
    let total = 0;
    let year = 2016;
    for (let i = 0; i < walk.length; i += 1) {
      const node = walk[i];
      points[i * 3] = graph.positions[node * 3];
      points[i * 3 + 1] = graph.positions[node * 3 + 1];
      points[i * 3 + 2] = graph.positions[node * 3 + 2];
      year = Math.max(year, SYSTEMS[graph.nodeSystem[node]].year);
      if (i > 0) {
        const dx = points[i * 3] - points[(i - 1) * 3];
        const dy = points[i * 3 + 1] - points[(i - 1) * 3 + 1];
        const dz = points[i * 3 + 2] - points[(i - 1) * 3 + 2];
        total += Math.sqrt(dx * dx + dy * dy + dz * dz);
      }
      segmentEnds[i] = total;
    }

    routes.push({ points, segmentEnds, totalLength: total || 1e-4, year });
  }
  return routes;
}

/** Nội suy vị trí packet tại t ∈ [0,1] theo chiều dài — ghi vào out có sẵn. */
export function advancePacket(
  route: PacketRoute,
  t: number,
  out: THREE.Vector3,
): THREE.Vector3 {
  const clamped = Math.min(Math.max(t, 0), 1);
  const target = clamped * route.totalLength;

  let i = 1;
  while (i < route.segmentEnds.length - 1 && route.segmentEnds[i] < target) {
    i += 1;
  }
  const segStart = route.segmentEnds[i - 1];
  const segLength = route.segmentEnds[i] - segStart || 1e-6;
  const local = Math.min(Math.max((target - segStart) / segLength, 0), 1);

  const a = (i - 1) * 3;
  const b = i * 3;
  out.set(
    route.points[a] + (route.points[b] - route.points[a]) * local,
    route.points[a + 1] + (route.points[b + 1] - route.points[a + 1]) * local,
    route.points[a + 2] + (route.points[b + 2] - route.points[a + 2]) * local,
  );
  return out;
}
