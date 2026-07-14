import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { ERAS } from "@/features/concepts/terrain/lib/career-data";
import {
  buildHeightField,
  buildHeightTexture,
} from "@/features/concepts/terrain/lib/height-field";

describe("buildHeightField", () => {
  it("đúng kích thước lines × samples", () => {
    const field = buildHeightField(40, 64);
    expect(field.lines).toBe(40);
    expect(field.samples).toBe(64);
    expect(field.data).toHaveLength(40 * 64);
  });

  it("deterministic theo seed", () => {
    const a = buildHeightField(30, 48, 7);
    const b = buildHeightField(30, 48, 7);
    const c = buildHeightField(30, 48, 8);
    expect(Array.from(a.data)).toEqual(Array.from(b.data));
    expect(Array.from(a.data)).not.toEqual(Array.from(c.data));
  });

  it("mọi giá trị trong [0, 1]", () => {
    const field = buildHeightField(50, 80);
    for (const v of field.data) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it("hàng ở era 2021 cao vượt hẳn hàng baseline đầu 2016", () => {
    const lines = 120;
    const samples = 96;
    const field = buildHeightField(lines, samples);
    const rebuild = ERAS.find((e) => e.year === 2021)!;
    const rowOf = (timeU: number) => {
      const line = Math.round(timeU * (lines - 1));
      const row = field.data.slice(line * samples, (line + 1) * samples);
      return Math.max(...Array.from(row));
    };
    expect(rowOf(rebuild.timeU)).toBeGreaterThan(rowOf(0.005) + 0.3);
  });
});

describe("buildHeightTexture", () => {
  it("trả về DataTexture kích thước samples × lines", () => {
    const field = buildHeightField(24, 32);
    const texture = buildHeightTexture(field);
    expect(texture).toBeInstanceOf(THREE.DataTexture);
    expect(texture.image.width).toBe(32);
    expect(texture.image.height).toBe(24);
  });
});
