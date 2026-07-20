import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("IslandScene — smoke test export", () => {
  it("module export hàm component IslandScene", async () => {
    const mod = await import(
      "@/features/concepts/full-stack-strata/components/island-scene"
    );
    expect(typeof mod.IslandScene).toBe("function");
  });
});
