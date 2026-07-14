import { describe, expect, it } from "vitest";

describe("barrel export của feature resolution", () => {
  it("export ResolutionExperience cho page dùng", async () => {
    const mod = await import("@/features/concepts/resolution");
    expect(typeof mod.ResolutionExperience).toBe("function");
  });
});
