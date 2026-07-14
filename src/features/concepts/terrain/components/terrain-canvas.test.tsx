import { describe, expect, it } from "vitest";

// Canvas không render được trong jsdom (không WebGL) — smoke-test export.
describe("TerrainCanvas — smoke test export", () => {
  it("module export hàm component TerrainCanvas", async () => {
    const mod = await import(
      "@/features/concepts/terrain/components/terrain-canvas"
    );
    expect(typeof mod.TerrainCanvas).toBe("function");
  });
});
