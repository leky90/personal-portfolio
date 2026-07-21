import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("SkylineScene — smoke test export", () => {
  it("module export hàm component SkylineScene", async () => {
    const mod = await import(
      "@/features/concepts/commit-skyline/components/skyline-scene"
    );
    expect(typeof mod.SkylineScene).toBe("function");
  });
});
