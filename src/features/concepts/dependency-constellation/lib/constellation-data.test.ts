import { describe, expect, it } from "vitest";
import {
  EDGES,
  NODES,
  adjacency,
  bfsFrom,
  layoutConstellation,
  resolvePaths,
} from "@/features/concepts/dependency-constellation/lib/constellation-data";

describe("constellation-data — đồ thị phụ thuộc 12 năm đã resolve sẵn", () => {
  it("27 node (5 role + 10 project + 12 skill), id không trùng", () => {
    expect(NODES).toHaveLength(27);
    expect(new Set(NODES.map((n) => n.id)).size).toBe(27);
    expect(NODES.filter((n) => n.kind === "role")).toHaveLength(5);
    expect(NODES.filter((n) => n.kind === "project")).toHaveLength(10);
    expect(NODES.filter((n) => n.kind === "skill")).toHaveLength(12);
  });

  it("mốc năm: nghề bắt đầu 2014, không node nào sớm hơn", () => {
    const freelance = NODES.find((n) => n.id === "r-freelance");
    expect(freelance?.year).toBe(2014);
    expect(Math.min(...NODES.map((n) => n.year))).toBe(2014);
    // Các mốc chặng còn lại giữ nguyên theo hồ sơ thật.
    expect(NODES.find((n) => n.id === "r-fullstack")?.year).toBe(2017);
    expect(NODES.find((n) => n.id === "r-swe")?.year).toBe(2019);
    expect(NODES.find((n) => n.id === "r-senior")?.year).toBe(2021);
    expect(NODES.find((n) => n.id === "r-lead")?.year).toBe(2021);
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
    const depths = bfsFrom("s-ethers");
    expect(depths.get("s-ethers")).toBe(0);
    expect(depths.get("p-treehouse")).toBe(1);
    expect(depths.get("r-senior")).toBe(2);
  });

  it("đồ thị liên thông: BFS từ một node chạm được mọi node", () => {
    const depths = bfsFrom("s-ts");
    expect(depths.size).toBe(NODES.length);
    expect(adjacency().size).toBe(NODES.length);
  });

  it("resolvePaths kiểu pnpm why: skill < project < role", () => {
    const ethersPaths = resolvePaths("s-ethers");
    expect(ethersPaths).toEqual([
      "Ethers.js < teth-dashboard < Lead Frontend Engineer · Treehouse",
      "Ethers.js < treehouse-dapp < Senior Software Engineer · Treehouse",
    ]);
    expect(resolvePaths("s-ts").length).toBeGreaterThanOrEqual(4);
    expect(resolvePaths("p-build-to-rent")).toEqual([
      "build-to-rent < Software Engineer · TESO",
    ]);
    expect(resolvePaths("r-lead")).toEqual([
      "Lead Frontend Engineer · Treehouse",
    ]);
  });
});
