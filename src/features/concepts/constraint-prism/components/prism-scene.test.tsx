import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("PrismScene — smoke test export", () => {
  it("module export hàm component PrismScene", async () => {
    const mod = await import(
      "@/features/concepts/constraint-prism/components/prism-scene"
    );
    expect(typeof mod.PrismScene).toBe("function");
  });
});
