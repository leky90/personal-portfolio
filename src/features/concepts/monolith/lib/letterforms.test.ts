import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  MONOLITH_LETTERS,
  letterShape,
} from "@/features/concepts/monolith/lib/letterforms";

describe("letterforms procedural (không cần font asset)", () => {
  it("hỗ trợ đủ các chữ của KY LE + HI", () => {
    for (const char of ["K", "Y", "L", "E", "H", "I"] as const) {
      const shape = letterShape(char);
      expect(shape).toBeInstanceOf(THREE.Shape);
      const points = shape.getPoints(4);
      expect(points.length).toBeGreaterThan(4);
    }
  });

  it("chữ không hỗ trợ thì ném lỗi rõ ràng", () => {
    // @ts-expect-error — cố tình truyền chữ không có trong bảng
    expect(() => letterShape("Z")).toThrow(/Z/);
  });

  it("outline nằm gọn trong hộp đơn vị (0..~0.8 ngang, 0..1 dọc)", () => {
    for (const char of ["K", "Y", "L", "E", "H", "I"] as const) {
      for (const p of letterShape(char).getPoints(8)) {
        expect(p.x).toBeGreaterThanOrEqual(-0.001);
        expect(p.x).toBeLessThanOrEqual(0.85);
        expect(p.y).toBeGreaterThanOrEqual(-0.001);
        expect(p.y).toBeLessThanOrEqual(1.001);
      }
    }
  });

  it("MONOLITH_LETTERS xếp KYLE theo trục z tăng dần", () => {
    expect(MONOLITH_LETTERS.map((l) => l.char).join("")).toBe("KYLE");
    for (let i = 1; i < MONOLITH_LETTERS.length; i += 1) {
      expect(MONOLITH_LETTERS[i].position[2]).toBeGreaterThan(
        MONOLITH_LETTERS[i - 1].position[2],
      );
    }
  });
});
