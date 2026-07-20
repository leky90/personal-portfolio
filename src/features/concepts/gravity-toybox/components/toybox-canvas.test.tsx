import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("ToyboxCanvas — smoke test export", () => {
  it("module export hàm component ToyboxCanvas", async () => {
    const mod = await import(
      "@/features/concepts/gravity-toybox/components/toybox-canvas"
    );
    expect(typeof mod.ToyboxCanvas).toBe("function");
  });
});
