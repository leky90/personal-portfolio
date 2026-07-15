import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("MonolithScene — smoke test export", () => {
  it("module export hàm component MonolithScene", async () => {
    const mod = await import(
      "@/features/concepts/monolith/components/monolith-scene"
    );
    expect(typeof mod.MonolithScene).toBe("function");
  });
});
