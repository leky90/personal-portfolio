import { describe, expect, it } from "vitest";
import {
  HEADINGS,
  PARTICLE_COUNT,
  fitPoints,
  normalizePoints,
  pointsFromAlpha,
  rowPair,
} from "@/features/concepts/glyph-field/lib/glyph-data";

describe("glyph-data — 4096 hạt gánh toàn bộ typography", () => {
  it("4 heading, số hạt là bội của 64 (khớp texture 64 cột)", () => {
    expect(HEADINGS).toHaveLength(4);
    expect(HEADINGS[0]).toBe("KY LE");
    expect(PARTICLE_COUNT % 64).toBe(0);
  });

  it("pointsFromAlpha: lấy đúng pixel vượt ngưỡng alpha", () => {
    // Lưới 4×2: alpha đánh dấu tại (1,0), (0,1), (3,1)
    const alpha = [0, 255, 0, 0, 255, 0, 0, 255];
    expect(pointsFromAlpha(alpha, 4, 2, 128)).toEqual([
      [1, 0],
      [0, 1],
      [3, 1],
    ]);
    expect(pointsFromAlpha([0, 0, 0, 0], 2, 2, 128)).toEqual([]);
  });

  it("fitPoints: trả đúng n điểm, deterministic, có fallback khi rỗng", () => {
    const base: [number, number][] = [
      [0, 0],
      [10, 5],
      [20, 10],
    ];
    const fitted = fitPoints(base, 10, 7);
    expect(fitted).toHaveLength(10);
    expect(fitPoints(base, 10, 7)).toEqual(fitted);

    const fallback = fitPoints([], 12, 3);
    expect(fallback).toHaveLength(12);
    for (const [x, y] of fallback) {
      expect(Number.isFinite(x)).toBe(true);
      expect(Number.isFinite(y)).toBe(true);
    }
  });

  it("normalizePoints: tâm ảnh về ~0, trục y lật lên trên", () => {
    const [center] = normalizePoints([[256, 64]], 512, 128, 8);
    expect(center[0]).toBeCloseTo(0, 5);
    expect(center[1]).toBeCloseTo(0, 5);

    const [topLeft] = normalizePoints([[0, 0]], 512, 128, 8);
    expect(topLeft[0]).toBeLessThan(0);
    expect(topLeft[1]).toBeGreaterThan(0);
  });

  it("rowPair: map progress sang cặp hàng texture + blend, clamp biên", () => {
    expect(rowPair(0)).toEqual({ rowA: 0, rowB: 1, blend: 0 });
    expect(rowPair(1.5)).toEqual({ rowA: 1, rowB: 2, blend: 0.5 });
    expect(rowPair(3)).toEqual({ rowA: 3, rowB: 3, blend: 0 });
    expect(rowPair(-1)).toEqual({ rowA: 0, rowB: 1, blend: 0 });
    expect(rowPair(9)).toEqual({ rowA: 3, rowB: 3, blend: 0 });
  });
});
