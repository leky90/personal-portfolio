import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("TowerCanvas — smoke test export", () => {
  it("module export hàm component TowerCanvas", async () => {
    const mod = await import(
      "@/features/concepts/cost-of-change/components/tower-canvas"
    );
    expect(typeof mod.TowerCanvas).toBe("function");
  });
});
