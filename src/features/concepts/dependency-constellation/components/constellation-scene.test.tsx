import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("ConstellationScene — smoke test export", () => {
  it("module export hàm component ConstellationScene", async () => {
    const mod = await import(
      "@/features/concepts/dependency-constellation/components/constellation-scene"
    );
    expect(typeof mod.ConstellationScene).toBe("function");
  });
});
