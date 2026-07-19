import { describe, expect, it } from "vitest";
import { SKILL_GROUPS } from "@/lib/data/skills";

describe("skills — nhóm badge, không progress bar", () => {
  it("có ≥ 3 nhóm, mỗi nhóm ≥ 3 mục", () => {
    expect(SKILL_GROUPS.length).toBeGreaterThanOrEqual(3);
    for (const group of SKILL_GROUPS) {
      expect(group.label.length).toBeGreaterThan(0);
      expect(group.items.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("không có mục trùng lặp giữa toàn bộ nhóm", () => {
    const all = SKILL_GROUPS.flatMap((g) => g.items);
    expect(new Set(all).size).toBe(all.length);
  });
});
