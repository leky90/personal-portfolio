import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("LensCanvas — smoke test export", () => {
  it("module export hàm component LensCanvas", async () => {
    const mod = await import(
      "@/features/concepts/phosphor-lens/components/lens-canvas"
    );
    expect(typeof mod.LensCanvas).toBe("function");
  });
});
