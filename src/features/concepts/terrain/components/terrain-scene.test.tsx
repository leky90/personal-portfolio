import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — không render trong jsdom,
// chỉ smoke-test kiểu export.
describe("TerrainScene — smoke test export", () => {
  it("module export hàm component TerrainScene", async () => {
    const mod = await import(
      "@/features/concepts/terrain/components/terrain-scene"
    );
    expect(typeof mod.TerrainScene).toBe("function");
  });
});
