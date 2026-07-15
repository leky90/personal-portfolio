import { describe, expect, it } from "vitest";
import { CONCEPTS, getConcept } from "@/features/concepts/registry";

describe("concepts registry", () => {
  it("chứa đúng 5 concept, rank 1..5 không trùng", () => {
    expect(CONCEPTS).toHaveLength(5);
    const ranks = CONCEPTS.map((c) => c.rank).sort();
    expect(ranks).toEqual([1, 2, 3, 4, 5]);
  });

  it("id không trùng nhau", () => {
    const ids = CONCEPTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("batch 1 có đúng 2 concept ở trạng thái ready (terrain, resolution)", () => {
    const batch1 = CONCEPTS.filter((c) => c.batch === 1);
    expect(batch1.map((c) => c.id).sort()).toEqual(["resolution", "terrain"]);
    expect(batch1.every((c) => c.status === "ready")).toBe(true);
  });

  it("batch 2 (monolith, compiled-light) đã ready; living-topology còn planned", () => {
    const batch2 = CONCEPTS.filter((c) => c.batch === 2);
    expect(batch2.map((c) => c.id).sort()).toEqual([
      "compiled-light",
      "monolith",
    ]);
    expect(batch2.every((c) => c.status === "ready")).toBe(true);
    expect(getConcept("living-topology").status).toBe("planned");
  });

  it("mọi điểm số nằm trong thang 0-10, difficulty trong 1-5", () => {
    for (const c of CONCEPTS) {
      for (const score of Object.values(c.scores)) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(10);
      }
      expect(c.difficulty).toBeGreaterThanOrEqual(1);
      expect(c.difficulty).toBeLessThanOrEqual(5);
      expect(c.accent).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("getConcept trả về đúng concept theo id", () => {
    expect(getConcept("terrain").rank).toBe(1);
    expect(getConcept("resolution").scores.overall).toBeCloseTo(7.7);
  });

  it("getConcept ném lỗi với id không tồn tại", () => {
    // @ts-expect-error — cố tình truyền id sai để test guard runtime
    expect(() => getConcept("khong-ton-tai")).toThrow();
  });
});
