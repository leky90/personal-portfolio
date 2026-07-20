import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("TrenchScene — smoke test export", () => {
  it("module export hàm component TrenchScene", async () => {
    const mod = await import(
      "@/features/concepts/maintenance-archaeology/components/trench-scene"
    );
    expect(typeof mod.TrenchScene).toBe("function");
  });
});
