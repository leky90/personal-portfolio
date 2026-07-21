import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("NoiseScene — smoke test export", () => {
  it("module export hàm component NoiseScene", async () => {
    const mod = await import(
      "@/features/concepts/signal-from-noise/components/noise-scene"
    );
    expect(typeof mod.NoiseScene).toBe("function");
  });
});
