import { describe, expect, it } from "vitest";
import {
  CELLS,
  buildDiorama,
  cameraForCell,
  cellCenter,
} from "@/features/concepts/cabinet-of-shipped-worlds/lib/cabinet-data";

describe("cabinet-data — tủ kính 8 ô, 4 thế giới sống + 4 ô lưu kho", () => {
  it("8 ô id không trùng: đúng 4 ô live có world, 4 ô storage", () => {
    expect(CELLS).toHaveLength(8);
    expect(new Set(CELLS.map((c) => c.id)).size).toBe(8);
    expect(CELLS.filter((c) => c.world !== null)).toHaveLength(4);
    expect(CELLS.filter((c) => c.world === null)).toHaveLength(4);
    for (const cell of CELLS.filter((c) => c.world !== null)) {
      expect(cell.title.length).toBeGreaterThan(0);
      expect(cell.metric.length).toBeGreaterThan(0);
    }
  });

  it("lưới 4×2: tâm ô duy nhất, toạ độ hữu hạn", () => {
    const centers = CELLS.map((cell) => cellCenter(cell.col, cell.row));
    const keys = centers.map(([x, y]) => `${x.toFixed(3)}|${y.toFixed(3)}`);
    expect(new Set(keys).size).toBe(8);
    for (const [x, y, z] of centers) {
      expect(Number.isFinite(x)).toBe(true);
      expect(Number.isFinite(y)).toBe(true);
      expect(Number.isFinite(z)).toBe(true);
    }
  });

  it("mỗi world diorama có ≥5 chi tiết nằm gọn trong lòng ô", () => {
    for (const world of ["vault", "port", "terminal", "observatory"] as const) {
      const parts = buildDiorama(world);
      expect(parts.length).toBeGreaterThanOrEqual(5);
      for (const part of parts) {
        expect(Math.abs(part.position[0])).toBeLessThanOrEqual(0.72);
        expect(Math.abs(part.position[1])).toBeLessThanOrEqual(0.52);
        expect(Math.abs(part.position[2])).toBeLessThanOrEqual(0.5);
      }
    }
  });

  it("cameraForCell: pose gallery khác pose dolly vào từng ô", () => {
    const gallery = cameraForCell(-1);
    const enterFirst = cameraForCell(0);
    expect(gallery.position[2]).toBeGreaterThan(enterFirst.position[2]);
    for (const pose of [gallery, enterFirst, cameraForCell(5)]) {
      for (const value of [...pose.position, ...pose.target]) {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
  });
});
