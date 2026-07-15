import { describe, expect, it } from "vitest";

// Canvas không render trong jsdom — smoke-test export.
describe("TopologyCanvas — smoke test export", () => {
  it("module export hàm component TopologyCanvas", async () => {
    const mod = await import(
      "@/features/concepts/living-topology/components/topology-canvas"
    );
    expect(typeof mod.TopologyCanvas).toBe("function");
  });
});
