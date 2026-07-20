import { describe, expect, it } from "vitest";
import {
  EDGES,
  NODES,
  adjacency,
  bfsFrom,
  layoutConstellation,
  resolvePaths,
} from "@/features/concepts/dependency-constellation/lib/constellation-data";

describe("constellation-data — đồ thị phụ thuộc 10 năm đã resolve sẵn", () => {
  it("27 node (5 role + 10 project + 12 skill), id không trùng", () => {
    expect(NODES).toHaveLength(27);
    expect(new Set(NODES.map((n) => n.id)).size).toBe(27);
    expect(NODES.filter((n) => n.kind === "role")).toHaveLength(5);
    expect(NODES.filter((n) => n.kind === "project")).toHaveLength(10);
    expect(NODES.filter((n) => n.kind === "skill")).toHaveLength(12);
  });

  it("mọi cạnh đều trỏ tới node có thật, không cạnh trùng", () => {
    const ids = new Set(NODES.map((n) => n.id));
    const seen = new Set<string>();
    for (const [a, b] of EDGES) {
      expect(ids.has(a)).toBe(true);
      expect(ids.has(b)).toBe(true);
      const key = [a, b].sort().join("|");
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it("layout: role vòng trong, project vòng giữa, skill vòng ngoài", () => {
    const layout = layoutConstellation();
    expect(layout.size).toBe(NODES.length);
    for (const node of NODES) {
      const [x, , z] = layout.get(node.id)!;
      const ringRadius = Math.hypot(x, z);
      if (node.kind === "role") expect(ringRadius).toBeCloseTo(1.6, 1);
      if (node.kind === "project") expect(ringRadius).toBeCloseTo(3.6, 1);
      if (node.kind === "skill") expect(ringRadius).toBeCloseTo(5.6, 1);
    }
  });

  it("bfsFrom: skill → project sâu 1 → role sâu 2, chính nó sâu 0", () => {
    const depths = bfsFrom("s-kafka");
    expect(depths.get("s-kafka")).toBe(0);
    expect(depths.get("p-realtime")).toBe(1);
    expect(depths.get("r-senior")).toBe(2);
  });

  it("đồ thị liên thông: BFS từ một node chạm được mọi node", () => {
    const depths = bfsFrom("s-ts");
    expect(depths.size).toBe(NODES.length);
    expect(adjacency().size).toBe(NODES.length);
  });

  it("resolvePaths kiểu pnpm why: skill < project < role", () => {
    const kafkaPaths = resolvePaths("s-kafka");
    expect(kafkaPaths).toEqual(["Kafka < realtime-pipeline < Senior Engineer"]);
    expect(resolvePaths("s-ts").length).toBeGreaterThanOrEqual(4);
    expect(resolvePaths("p-checkout")).toEqual([
      "checkout-platform < Full-stack Engineer",
    ]);
    expect(resolvePaths("r-staff")).toEqual(["Staff Engineer"]);
  });
});
