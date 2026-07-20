import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("PrismCanvas — smoke test export", () => {
  it("module export hàm component PrismCanvas", async () => {
    const mod = await import(
      "@/features/concepts/constraint-prism/components/prism-canvas"
    );
    expect(typeof mod.PrismCanvas).toBe("function");
  });
});
