import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("GalaxyCanvas — smoke test export", () => {
  it("module export hàm component GalaxyCanvas", async () => {
    const mod = await import(
      "@/features/concepts/ten-year-galaxy/components/galaxy-canvas"
    );
    expect(typeof mod.GalaxyCanvas).toBe("function");
  });
});
