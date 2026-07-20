import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("EngineCanvas — smoke test export", () => {
  it("module export hàm component EngineCanvas", async () => {
    const mod = await import(
      "@/features/concepts/leverage-engine/components/engine-canvas"
    );
    expect(typeof mod.EngineCanvas).toBe("function");
  });
});
