import { describe, expect, it } from "vitest";
import { buildRidgelineGeometry } from "@/features/concepts/terrain/lib/terrain-geometry";

describe("buildRidgelineGeometry — 1 draw call LineSegments", () => {
  it("đúng số vertex và uv", () => {
    const geometry = buildRidgelineGeometry(10, 16, 60, 100);
    expect(geometry.getAttribute("position").count).toBe(10 * 16);
    expect(geometry.getAttribute("uv").count).toBe(10 * 16);
    geometry.dispose();
  });

  it("index chỉ nối các đoạn TRONG một line — không có segment vắt ngang line", () => {
    const lines = 6;
    const samples = 12;
    const geometry = buildRidgelineGeometry(lines, samples, 60, 100);
    const index = geometry.getIndex()!;
    expect(index.count).toBe(lines * (samples - 1) * 2);
    for (let i = 0; i < index.count; i += 2) {
      const a = index.getX(i);
      const b = index.getX(i + 1);
      expect(Math.floor(a / samples)).toBe(Math.floor(b / samples));
      expect(b - a).toBe(1);
    }
    geometry.dispose();
  });

  it("x trải đều [-width/2, width/2], z trong [0, depth]", () => {
    const geometry = buildRidgelineGeometry(8, 10, 64, 110);
    const position = geometry.getAttribute("position");
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (let i = 0; i < position.count; i += 1) {
      minX = Math.min(minX, position.getX(i));
      maxX = Math.max(maxX, position.getX(i));
      minZ = Math.min(minZ, position.getZ(i));
      maxZ = Math.max(maxZ, position.getZ(i));
    }
    expect(minX).toBeCloseTo(-32);
    expect(maxX).toBeCloseTo(32);
    expect(minZ).toBeCloseTo(0);
    expect(maxZ).toBeCloseTo(110);
    geometry.dispose();
  });
});
