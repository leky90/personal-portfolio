import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("EngineScene — smoke test export", () => {
  it("module export hàm component EngineScene", async () => {
    const mod = await import(
      "@/features/concepts/leverage-engine/components/engine-scene"
    );
    expect(typeof mod.EngineScene).toBe("function");
  });
});
