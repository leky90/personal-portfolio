import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("NoiseCanvas — smoke test export", () => {
  it("module export hàm component NoiseCanvas", async () => {
    const mod = await import(
      "@/features/concepts/signal-from-noise/components/noise-canvas"
    );
    expect(typeof mod.NoiseCanvas).toBe("function");
  });
});
