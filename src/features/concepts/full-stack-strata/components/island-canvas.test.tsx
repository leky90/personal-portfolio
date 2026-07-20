import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("IslandCanvas — smoke test export", () => {
  it("module export hàm component IslandCanvas", async () => {
    const mod = await import(
      "@/features/concepts/full-stack-strata/components/island-canvas"
    );
    expect(typeof mod.IslandCanvas).toBe("function");
  });
});
