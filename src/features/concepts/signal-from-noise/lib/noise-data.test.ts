import { describe, expect, it } from "vitest";
import {
  FORMS,
  PARTICLE_TOTAL,
  buildGlobePoints,
  buildLatticePoints,
  buildNamePoints,
  formPhase,
} from "@/features/concepts/signal-from-noise/lib/noise-data";

describe("noise-data — hạt lạnh hoá trật tự thành form ấm", () => {
  it("3 form theo thứ tự name → globe → lattice, số hạt bội của 64", () => {
    expect(FORMS).toEqual(["name", "globe", "lattice"]);
    expect(PARTICLE_TOTAL % 64).toBe(0);
  });

  it("globe: mọi điểm nằm sát mặt cầu bán kính 1", () => {
    const points = buildGlobePoints(600);
    expect(points).toHaveLength(600);
    for (const [x, y, z] of points) {
      const radius = Math.hypot(x, y, z);
      expect(Math.abs(radius - 1)).toBeLessThan(0.06);
    }
  });

  it("lattice: mọi điểm nằm trên đoạn nối hai node của đồ thị", () => {
    const points = buildLatticePoints(400);
    expect(points).toHaveLength(400);
    for (const [x, y, z] of points) {
      expect(Number.isFinite(x)).toBe(true);
      expect(Math.abs(x)).toBeLessThanOrEqual(1.6);
      expect(Math.abs(y)).toBeLessThanOrEqual(1.6);
      expect(Math.abs(z)).toBeLessThanOrEqual(1.6);
    }
  });

  it("name fallback: không có canvas vẫn trả đủ điểm hữu hạn", () => {
    const points = buildNamePoints(500);
    expect(points).toHaveLength(500);
    for (const [x, y, z] of points) {
      expect(Number.isFinite(x)).toBe(true);
      expect(Number.isFinite(y)).toBe(true);
      expect(Number.isFinite(z)).toBe(true);
    }
  });

  it("formPhase: map progress [0,2] sang cặp form + blend, clamp biên", () => {
    expect(formPhase(0)).toEqual({ formA: 0, formB: 1, blend: 0 });
    expect(formPhase(0.5)).toEqual({ formA: 0, formB: 1, blend: 0.5 });
    expect(formPhase(2)).toEqual({ formA: 2, formB: 2, blend: 0 });
    expect(formPhase(-1)).toEqual({ formA: 0, formB: 1, blend: 0 });
    expect(formPhase(9)).toEqual({ formA: 2, formB: 2, blend: 0 });
  });
});
