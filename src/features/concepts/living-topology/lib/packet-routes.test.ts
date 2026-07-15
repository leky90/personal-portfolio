import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { buildTopologyGraph } from "@/features/concepts/living-topology/lib/topology-graph";
import {
  advancePacket,
  buildPacketRoutes,
} from "@/features/concepts/living-topology/lib/packet-routes";

describe("packet routes — luồng request chạy trên graph", () => {
  const graph = buildTopologyGraph(7, 1);

  it("deterministic theo seed, đúng số lượng yêu cầu", () => {
    const a = buildPacketRoutes(graph, 12, 3);
    const b = buildPacketRoutes(graph, 12, 3);
    expect(a).toHaveLength(12);
    expect(a.map((r) => Array.from(r.points))).toEqual(
      b.map((r) => Array.from(r.points)),
    );
  });

  it("mỗi route có ≥ 2 điểm, tổng chiều dài dương, year hữu hạn", () => {
    for (const route of buildPacketRoutes(graph, 10, 5)) {
      expect(route.points.length / 3).toBeGreaterThanOrEqual(2);
      expect(route.totalLength).toBeGreaterThan(0);
      expect(Number.isFinite(route.year)).toBe(true);
    }
  });

  it("advancePacket: t=0 ở điểm đầu, t=1 ở điểm cuối, ghi vào vector có sẵn", () => {
    const [route] = buildPacketRoutes(graph, 1, 9);
    const out = new THREE.Vector3();
    const sameOut = advancePacket(route, 0, out);
    expect(sameOut).toBe(out);
    expect(out.x).toBeCloseTo(route.points[0], 5);
    expect(out.y).toBeCloseTo(route.points[1], 5);

    advancePacket(route, 1, out);
    const last = route.points.length - 3;
    expect(out.x).toBeCloseTo(route.points[last], 5);
    expect(out.z).toBeCloseTo(route.points[last + 2], 5);
  });

  it("t giữa chừng nằm trong bbox của route, t ngoài [0,1] được kẹp", () => {
    const [route] = buildPacketRoutes(graph, 1, 11);
    const out = new THREE.Vector3();
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < route.points.length; i += 3) {
      minX = Math.min(minX, route.points[i]);
      maxX = Math.max(maxX, route.points[i]);
    }
    advancePacket(route, 0.5, out);
    expect(out.x).toBeGreaterThanOrEqual(minX - 1e-5);
    expect(out.x).toBeLessThanOrEqual(maxX + 1e-5);
    expect(() => advancePacket(route, -1, out)).not.toThrow();
    expect(() => advancePacket(route, 2, out)).not.toThrow();
  });
});
