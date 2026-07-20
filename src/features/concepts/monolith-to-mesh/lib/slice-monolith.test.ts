import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { SERVICES } from "@/features/concepts/monolith-to-mesh/lib/migration-plan";
import {
  SLAB,
  buildMeshLinks,
  fragmentPositionAt,
  sliceMonolith,
} from "@/features/concepts/monolith-to-mesh/lib/slice-monolith";

describe("sliceMonolith — kerf-cut thuần TS, không Blender", () => {
  const entries = sliceMonolith(7);

  it("mỗi service một block, deterministic theo seed", () => {
    expect(entries).toHaveLength(SERVICES.length);
    const again = sliceMonolith(7);
    expect(again.map((e) => e.home.center)).toEqual(
      entries.map((e) => e.home.center),
    );
    const other = sliceMonolith(8);
    expect(other.map((e) => e.home.center)).not.toEqual(
      entries.map((e) => e.home.center),
    );
  });

  it("phân hoạch chính xác: tổng thể tích khối = thể tích slab", () => {
    const total = entries.reduce(
      (sum, e) => sum + e.home.size[0] * e.home.size[1] * e.home.size[2],
      0,
    );
    expect(total).toBeCloseTo(SLAB.w * SLAB.h * SLAB.d, 5);
  });

  it("các block rời nhau và nằm trong slab", () => {
    const eps = 1e-6;
    for (const e of entries) {
      for (let axis = 0; axis < 3; axis += 1) {
        const half = [SLAB.w, SLAB.h, SLAB.d][axis] / 2;
        expect(Math.abs(e.home.center[axis]) + e.home.size[axis] / 2).toBeLessThanOrEqual(half + eps);
      }
    }
    for (let i = 0; i < entries.length; i += 1) {
      for (let j = i + 1; j < entries.length; j += 1) {
        const a = entries[i].home;
        const b = entries[j].home;
        const overlaps = [0, 1, 2].every(
          (axis) =>
            Math.abs(a.center[axis] - b.center[axis]) <
            (a.size[axis] + b.size[axis]) / 2 - eps,
        );
        expect(overlaps).toBe(false);
      }
    }
  });

  it("target: service tách bay ra shell xa, core co cụm gần gốc", () => {
    for (const e of entries) {
      const r = Math.hypot(e.target[0], e.target[1], e.target[2]);
      if (e.kind === 0) {
        expect(r).toBeLessThan(3.5);
      } else {
        expect(r).toBeGreaterThan(4.5);
      }
    }
  });

  it("fragmentPositionAt: 2016 ở home, 2026 ở target (premature về lại home)", () => {
    const out = new THREE.Vector3();
    for (const e of entries) {
      fragmentPositionAt(e, 0, out);
      expect(out.x).toBeCloseTo(e.home.center[0], 4);
      fragmentPositionAt(e, 1, out);
      if (e.kind === 2) {
        expect(out.distanceTo(new THREE.Vector3(...e.home.center))).toBeLessThan(1.5);
      } else if (e.kind === 1) {
        expect(out.x).toBeCloseTo(e.target[0], 3);
      }
    }
  });
});

describe("buildMeshLinks", () => {
  it("cạnh nối index hợp lệ, birth trong [0,1]", () => {
    const entries = sliceMonolith(7);
    const links = buildMeshLinks(entries);
    expect(links.pairs.length).toBeGreaterThan(10);
    expect(links.pairs.length % 2).toBe(0);
    for (const idx of links.pairs) {
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(entries.length);
    }
    for (const birth of links.births) {
      expect(birth).toBeGreaterThanOrEqual(0);
      expect(birth).toBeLessThanOrEqual(1);
    }
  });
});
