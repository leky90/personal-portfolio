import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("ConstellationCanvas — smoke test export", () => {
  it("module export hàm component ConstellationCanvas", async () => {
    const mod = await import(
      "@/features/concepts/dependency-constellation/components/constellation-canvas"
    );
    expect(typeof mod.ConstellationCanvas).toBe("function");
  });
});
