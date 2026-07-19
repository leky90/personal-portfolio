import { describe, expect, it } from "vitest";
import { EXPERIENCE } from "@/lib/data/experience";

describe("experience — adapter timeline từ terrain career-data", () => {
  it("có 4 era theo năm tăng dần", () => {
    expect(EXPERIENCE).toHaveLength(4);
    for (let i = 1; i < EXPERIENCE.length; i += 1) {
      expect(EXPERIENCE[i].year).toBeGreaterThan(EXPERIENCE[i - 1].year);
    }
  });

  it("mỗi era đủ nội dung card cho section experience", () => {
    for (const era of EXPERIENCE) {
      expect(era.title.length).toBeGreaterThan(0);
      expect(era.role.length).toBeGreaterThan(0);
      expect(era.description.length).toBeGreaterThan(0);
      expect(era.metric.length).toBeGreaterThan(0);
      expect(["left", "right"]).toContain(era.side);
    }
  });
});
