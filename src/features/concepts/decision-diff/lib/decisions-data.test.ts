import { describe, expect, it } from "vitest";
import { DECISIONS } from "@/features/concepts/decision-diff/lib/decisions-data";

describe("dữ liệu 6 ADR — nguồn sinh hình học của rail", () => {
  it("có đúng 6 quyết định, id không trùng, năm tăng dần", () => {
    expect(DECISIONS).toHaveLength(6);
    expect(new Set(DECISIONS.map((d) => d.id)).size).toBe(6);
    for (let i = 1; i < DECISIONS.length; i += 1) {
      expect(DECISIONS[i].year).toBeGreaterThanOrEqual(DECISIONS[i - 1].year);
    }
  });

  it("mỗi ADR đủ chosen/rejected/consequence và chi phí nhánh bỏ", () => {
    for (const d of DECISIONS) {
      expect(d.title.length).toBeGreaterThan(0);
      expect(d.chosen.length).toBeGreaterThan(0);
      expect(d.rejected.length).toBeGreaterThan(0);
      expect(d.rejectedCost.length).toBeGreaterThan(0);
      expect(d.consequence.length).toBeGreaterThan(0);
      expect(["left", "right"]).toContain(d.side);
    }
  });

  it("side trái phải xen kẽ để rail lượn qua lại", () => {
    for (let i = 1; i < DECISIONS.length; i += 1) {
      expect(DECISIONS[i].side).not.toBe(DECISIONS[i - 1].side);
    }
  });

  it("không chuỗi nào chứa em-dash", () => {
    for (const d of DECISIONS) {
      const all = [d.title, d.chosen, d.rejected, d.rejectedCost, d.consequence].join(" ");
      expect(all).not.toContain("—");
    }
  });
});
