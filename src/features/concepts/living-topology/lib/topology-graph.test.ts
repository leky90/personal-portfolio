import { describe, expect, it } from "vitest";
import { SYSTEMS } from "@/features/concepts/living-topology/lib/systems-data";
import { buildTopologyGraph } from "@/features/concepts/living-topology/lib/topology-graph";

describe("buildTopologyGraph — layout bake deterministic", () => {
  it("cùng seed + density → graph giống hệt; khác seed → khác", () => {
    const a = buildTopologyGraph(7, 1);
    const b = buildTopologyGraph(7, 1);
    const c = buildTopologyGraph(8, 1);
    expect(Array.from(a.positions)).toEqual(Array.from(b.positions));
    expect(Array.from(a.edges)).toEqual(Array.from(b.edges));
    expect(Array.from(a.positions)).not.toEqual(Array.from(c.positions));
  });

  it("density thấp sinh ít node hơn (đường mobile)", () => {
    const desktop = buildTopologyGraph(7, 1);
    const mobile = buildTopologyGraph(7, 0.6);
    expect(mobile.nodeCount).toBeLessThan(desktop.nodeCount);
    expect(mobile.nodeCount).toBeGreaterThan(SYSTEMS.length * 3);
  });

  it("positions hữu hạn và nằm trong sân khấu (|x|≤24, |y|≤10, |z|≤14)", () => {
    const graph = buildTopologyGraph(7, 1);
    expect(graph.positions).toHaveLength(graph.nodeCount * 3);
    for (let i = 0; i < graph.nodeCount; i += 1) {
      const x = graph.positions[i * 3];
      const y = graph.positions[i * 3 + 1];
      const z = graph.positions[i * 3 + 2];
      expect(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)).toBe(true);
      expect(Math.abs(x)).toBeLessThanOrEqual(24);
      expect(Math.abs(y)).toBeLessThanOrEqual(10);
      expect(Math.abs(z)).toBeLessThanOrEqual(14);
    }
  });

  it("trục x là trục thời gian: tâm cụm xếp theo năm tăng dần", () => {
    const graph = buildTopologyGraph(7, 1);
    const centers = SYSTEMS.map((_, sysIdx) => {
      let sum = 0;
      let count = 0;
      for (let i = 0; i < graph.nodeCount; i += 1) {
        if (graph.nodeSystem[i] === sysIdx) {
          sum += graph.positions[i * 3];
          count += 1;
        }
      }
      return sum / count;
    });
    for (let i = 0; i < SYSTEMS.length; i += 1) {
      for (let j = 0; j < SYSTEMS.length; j += 1) {
        if (SYSTEMS[i].year < SYSTEMS[j].year) {
          expect(centers[i]).toBeLessThan(centers[j]);
        }
      }
    }
  });

  it("edges tham chiếu node hợp lệ; mỗi hệ thống liên thông nội bộ", () => {
    const graph = buildTopologyGraph(7, 1);
    expect(graph.edges.length % 2).toBe(0);
    for (const idx of graph.edges) {
      expect(idx).toBeLessThan(graph.nodeCount);
    }
    // BFS trong từng hệ thống qua các cạnh nội bộ
    for (let sysIdx = 0; sysIdx < SYSTEMS.length; sysIdx += 1) {
      const members: number[] = [];
      for (let i = 0; i < graph.nodeCount; i += 1) {
        if (graph.nodeSystem[i] === sysIdx) members.push(i);
      }
      const adjacency = new Map<number, number[]>();
      for (let e = 0; e < graph.edges.length; e += 2) {
        const a = graph.edges[e];
        const b = graph.edges[e + 1];
        if (graph.nodeSystem[a] === sysIdx && graph.nodeSystem[b] === sysIdx) {
          adjacency.set(a, [...(adjacency.get(a) ?? []), b]);
          adjacency.set(b, [...(adjacency.get(b) ?? []), a]);
        }
      }
      const seen = new Set<number>([members[0]]);
      const queue = [members[0]];
      while (queue.length > 0) {
        for (const next of adjacency.get(queue.shift()!) ?? []) {
          if (!seen.has(next)) {
            seen.add(next);
            queue.push(next);
          }
        }
      }
      expect(seen.size).toBe(members.length);
    }
  });

  it("nodeYear ≥ năm hệ thống và stagger < 1 năm (mọc dần trong era)", () => {
    const graph = buildTopologyGraph(7, 1);
    for (let i = 0; i < graph.nodeCount; i += 1) {
      const systemYear = SYSTEMS[graph.nodeSystem[i]].year;
      expect(graph.nodeYear[i]).toBeGreaterThanOrEqual(systemYear);
      expect(graph.nodeYear[i]).toBeLessThan(systemYear + 1);
    }
  });
});
