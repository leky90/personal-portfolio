import { describe, expect, it } from "vitest";

describe("barrel export của feature monolith", () => {
  it("export MonolithExperience cho page dùng", async () => {
    const mod = await import("@/features/concepts/monolith");
    expect(typeof mod.MonolithExperience).toBe("function");
  });
});
