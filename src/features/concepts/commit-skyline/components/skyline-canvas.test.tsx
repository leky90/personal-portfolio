import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("SkylineCanvas — smoke test export", () => {
  it("module export hàm component SkylineCanvas", async () => {
    const mod = await import(
      "@/features/concepts/commit-skyline/components/skyline-canvas"
    );
    expect(typeof mod.SkylineCanvas).toBe("function");
  });
});
