import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("ToyboxScene — smoke test export", () => {
  it("module export hàm component ToyboxScene", async () => {
    const mod = await import(
      "@/features/concepts/gravity-toybox/components/toybox-scene"
    );
    expect(typeof mod.ToyboxScene).toBe("function");
  });
});
