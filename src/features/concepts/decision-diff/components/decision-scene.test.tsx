import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("DecisionScene — smoke test export", () => {
  it("module export hàm component DecisionScene", async () => {
    const mod = await import(
      "@/features/concepts/decision-diff/components/decision-scene"
    );
    expect(typeof mod.DecisionScene).toBe("function");
  });
});
