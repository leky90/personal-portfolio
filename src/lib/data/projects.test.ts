import { describe, expect, it } from "vitest";
import { PROJECTS } from "@/lib/data/projects";

describe("projects — selected work", () => {
  it("có 3 project, slug không trùng", () => {
    expect(PROJECTS).toHaveLength(3);
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(3);
  });

  it("mỗi project đủ title/role/summary, stack và metric không rỗng", () => {
    for (const project of PROJECTS) {
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.role.length).toBeGreaterThan(0);
      expect(project.summary.length).toBeGreaterThan(0);
      expect(project.stack.length).toBeGreaterThanOrEqual(2);
      expect(project.metrics.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("sắp xếp theo năm giảm dần (mới nhất trước)", () => {
    for (let i = 1; i < PROJECTS.length; i += 1) {
      expect(PROJECTS[i].year).toBeLessThanOrEqual(PROJECTS[i - 1].year);
    }
  });
});
