import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("TowerScene — smoke test export", () => {
  it("module export hàm component TowerScene", async () => {
    const mod = await import(
      "@/features/concepts/cost-of-change/components/tower-scene"
    );
    expect(typeof mod.TowerScene).toBe("function");
  });
});
