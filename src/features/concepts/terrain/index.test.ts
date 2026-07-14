import { describe, expect, it } from "vitest";

describe("barrel export của feature terrain", () => {
  it("export TerrainExperience cho page dùng", async () => {
    const mod = await import("@/features/concepts/terrain");
    expect(typeof mod.TerrainExperience).toBe("function");
  });
});
