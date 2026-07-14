import { describe, expect, it } from "vitest";
import { COVER_PROJECTS } from "@/features/concepts/resolution/lib/cover-data";

describe("dữ liệu 3 case study giả cho hàng SELECTED WORK", () => {
  it("có đúng 3 project", () => {
    expect(COVER_PROJECTS).toHaveLength(3);
  });

  it("mỗi project đủ title / role / hue", () => {
    for (const project of COVER_PROJECTS) {
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.role.length).toBeGreaterThan(0);
      expect(project.hue).toBeGreaterThanOrEqual(0);
      expect(project.hue).toBeLessThan(360);
    }
  });

  it("hue của 3 project khác nhau rõ rệt", () => {
    const hues = COVER_PROJECTS.map((p) => p.hue);
    expect(new Set(hues).size).toBe(3);
  });

  it("id duy nhất để làm React key", () => {
    const ids = COVER_PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(3);
  });
});
