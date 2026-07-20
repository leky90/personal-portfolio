import { describe, expect, it } from "vitest";
import { CONCEPTS, getConcept } from "@/features/concepts/registry";

const READY_IDS = [
  "terrain",
  "resolution",
  "monolith",
  "compiled-light",
  "living-topology",
  "decision-diff",
  "monolith-to-mesh",
  "incident-black-box",
  "maintenance-archaeology",
].sort();

describe("concepts registry — bảng xếp hạng thống nhất 26 concept", () => {
  it("chứa đúng 26 concept, id không trùng", () => {
    expect(CONCEPTS).toHaveLength(26);
    expect(new Set(CONCEPTS.map((c) => c.id)).size).toBe(26);
  });

  it("rank là 1..26 không trùng và khớp thứ tự điểm overall giảm dần", () => {
    const ranks = CONCEPTS.map((c) => c.rank).sort((a, b) => a - b);
    expect(ranks).toEqual(Array.from({ length: 26 }, (_, i) => i + 1));

    const byRank = [...CONCEPTS].sort((a, b) => a.rank - b.rank);
    for (let i = 1; i < byRank.length; i += 1) {
      expect(byRank[i].scores.overall).toBeLessThanOrEqual(
        byRank[i - 1].scores.overall,
      );
    }
  });

  it("đúng 9 concept đã build ở trạng thái ready, còn lại planned", () => {
    const ready = CONCEPTS.filter((c) => c.status === "ready").map((c) => c.id);
    expect(ready.sort()).toEqual(READY_IDS);
    expect(CONCEPTS.filter((c) => c.status === "planned")).toHaveLength(17);
  });

  it("nguồn gốc: 18 concept vòng 1, 8 concept vòng bổ sung", () => {
    expect(CONCEPTS.filter((c) => c.origin === "v1")).toHaveLength(18);
    expect(CONCEPTS.filter((c) => c.origin === "v2")).toHaveLength(8);
  });

  it("điểm trong thang 0-10, difficulty 1-5, accent là hex", () => {
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

  it("tagline và pitch không chứa em-dash (quy tắc thiết kế trang lab)", () => {
    for (const c of CONCEPTS) {
      expect(c.tagline).not.toContain("—");
      expect(c.pitch).not.toContain("—");
    }
  });

  it("getConcept trả đúng concept và ném lỗi với id lạ", () => {
    expect(getConcept("terrain").status).toBe("ready");
    expect(getConcept("decision-diff").origin).toBe("v2");
    // @ts-expect-error — cố tình truyền id sai để test guard runtime
    expect(() => getConcept("khong-ton-tai")).toThrow();
  });
});
