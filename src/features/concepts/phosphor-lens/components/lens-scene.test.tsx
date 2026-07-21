import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("LensScene — smoke test export", () => {
  it("module export hàm component LensScene", async () => {
    const mod = await import(
      "@/features/concepts/phosphor-lens/components/lens-scene"
    );
    expect(typeof mod.LensScene).toBe("function");
  });
});
