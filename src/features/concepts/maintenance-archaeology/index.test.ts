import { describe, expect, it } from "vitest";

describe("barrel export của feature maintenance-archaeology", () => {
  it("export DigExperience cho page dùng", async () => {
    const mod = await import("@/features/concepts/maintenance-archaeology");
    expect(typeof mod.DigExperience).toBe("function");
  });
});
