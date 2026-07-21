import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("GalaxyScene — smoke test export", () => {
  it("module export hàm component GalaxyScene", async () => {
    const mod = await import(
      "@/features/concepts/ten-year-galaxy/components/galaxy-scene"
    );
    expect(typeof mod.GalaxyScene).toBe("function");
  });
});
