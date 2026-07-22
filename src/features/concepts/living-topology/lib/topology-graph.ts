import {
  ARCH_LINKS,
  SYSTEMS,
  systemIndexById,
} from "@/features/concepts/living-topology/lib/systems-data";

/**
 * Layout bake deterministic — tinh thần "d3-force chạy lúc BUILD, không phải
 * runtime" của concept, thu nhỏ thành: cụm đặt theo trục thời gian (x = năm),
 * node rải seeded quanh tâm cụm + vài lượt đẩy tách, cạnh sinh spanning-tree.
 * Chạy một lần lúc mount; useFrame không đụng vào layout.
 */
export interface TopologyGraph {
  nodeCount: number;
  /** xyz liên tiếp — đổ thẳng vào BufferAttribute/InstancedMesh */
  positions: Float32Array;
  /** index hệ thống của từng node */
  nodeSystem: Uint16Array;
  /** năm "sinh" của node = năm hệ thống + stagger < 1 */
  nodeYear: Float32Array;
  /** cặp index node cho LineSegments */
  edges: Uint32Array;
  /** adjacency cho packet random-walk */
  adjacency: number[][];
  /** node đại diện (hub) của mỗi hệ thống */
  hubs: number[];
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

const YEAR_MIN = 2012;
const YEAR_SPAN = 11.5; // 2012..2023.5
const X_SPREAD = 40; // trục thời gian trải -20..20 rồi co lại còn ±~19 sau jitter

export function buildTopologyGraph(seed: number, density: number): TopologyGraph {
  const rand = mulberry32(seed);

  // Số node mỗi hệ thống: 7..14 (nhân density cho mobile), tối thiểu 4
  const counts = SYSTEMS.map(() =>
    Math.max(4, Math.round((7 + rand() * 7) * density)),
  );
  const nodeCount = counts.reduce((sum, c) => sum + c, 0);

  const positions = new Float32Array(nodeCount * 3);
  const nodeSystem = new Uint16Array(nodeCount);
  const nodeYear = new Float32Array(nodeCount);
  const hubs: number[] = [];
  const edgePairs: number[] = [];
  const adjacency: number[][] = Array.from({ length: nodeCount }, () => []);

  const addEdge = (a: number, b: number) => {
    edgePairs.push(a, b);
    adjacency[a].push(b);
    adjacency[b].push(a);
  };

  let cursor = 0;
  for (let sysIdx = 0; sysIdx < SYSTEMS.length; sysIdx += 1) {
    const system = SYSTEMS[sysIdx];
    const memberCount = counts[sysIdx];
    const start = cursor;
    hubs.push(start);

    // Tâm cụm: x theo năm (trục thời gian), y/z seeded quanh mặt phẳng
    const centerX =
      ((system.year - YEAR_MIN) / YEAR_SPAN) * X_SPREAD - X_SPREAD / 2;
    const centerY = (rand() - 0.5) * 6;
    const centerZ = (rand() - 0.5) * 10;

    for (let m = 0; m < memberCount; m += 1) {
      const i = cursor;
      positions[i * 3] = centerX + (rand() + rand() - 1) * 2.1;
      positions[i * 3 + 1] = centerY + (rand() + rand() - 1) * 1.6;
      positions[i * 3 + 2] = centerZ + (rand() + rand() - 1) * 2.1;
      nodeSystem[i] = sysIdx;
      nodeYear[i] = system.year + (m / memberCount) * 0.9;

      // Spanning tree nội bộ: nối về một node có sẵn trong cụm
      if (m > 0) {
        addEdge(i, start + Math.floor(rand() * m));
      }
      cursor += 1;
    }

    // Vài cạnh nội bộ phụ cho cảm giác mesh
    const extras = Math.floor(memberCount * 0.35);
    for (let e = 0; e < extras; e += 1) {
      const a = start + Math.floor(rand() * memberCount);
      const b = start + Math.floor(rand() * memberCount);
      if (a !== b) addEdge(a, b);
    }
  }

  // Vài lượt đẩy tách trong từng cụm để node không dính nhau
  for (let pass = 0; pass < 2; pass += 1) {
    let start = 0;
    for (let sysIdx = 0; sysIdx < SYSTEMS.length; sysIdx += 1) {
      const memberCount = counts[sysIdx];
      for (let a = start; a < start + memberCount; a += 1) {
        for (let b = a + 1; b < start + memberCount; b += 1) {
          const dx = positions[b * 3] - positions[a * 3];
          const dy = positions[b * 3 + 1] - positions[a * 3 + 1];
          const dz = positions[b * 3 + 2] - positions[a * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-4;
          if (dist < 0.85) {
            const push = (0.85 - dist) * 0.5;
            positions[a * 3] -= (dx / dist) * push;
            positions[a * 3 + 1] -= (dy / dist) * push;
            positions[a * 3 + 2] -= (dz / dist) * push;
            positions[b * 3] += (dx / dist) * push;
            positions[b * 3 + 1] += (dy / dist) * push;
            positions[b * 3 + 2] += (dz / dist) * push;
          }
        }
      }
      start += memberCount;
    }
  }

  // Cạnh liên hệ thống: hub nối hub theo ARCH_LINKS thật
  for (const [idA, idB] of ARCH_LINKS) {
    addEdge(hubs[systemIndexById(idA)], hubs[systemIndexById(idB)]);
  }

  return {
    nodeCount,
    positions,
    nodeSystem,
    nodeYear,
    edges: Uint32Array.from(edgePairs),
    adjacency,
    hubs,
  };
}
