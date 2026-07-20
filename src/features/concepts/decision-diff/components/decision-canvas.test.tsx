import { describe, expect, it } from "vitest";

// Canvas không render trong jsdom — smoke-test export.
describe("DecisionCanvas — smoke test export", () => {
  it("module export hàm component DecisionCanvas", async () => {
    const mod = await import(
      "@/features/concepts/decision-diff/components/decision-canvas"
    );
    expect(typeof mod.DecisionCanvas).toBe("function");
  });
});
