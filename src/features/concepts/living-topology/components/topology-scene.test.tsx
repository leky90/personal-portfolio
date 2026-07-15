import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("TopologyScene — smoke test export", () => {
  it("module export hàm component TopologyScene", async () => {
    const mod = await import(
      "@/features/concepts/living-topology/components/topology-scene"
    );
    expect(typeof mod.TopologyScene).toBe("function");
  });
});
