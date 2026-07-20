import { describe, expect, it } from "vitest";

// Canvas không render trong jsdom — smoke-test export.
describe("MeshCanvas — smoke test export", () => {
  it("module export hàm component MeshCanvas", async () => {
    const mod = await import(
      "@/features/concepts/monolith-to-mesh/components/mesh-canvas"
    );
    expect(typeof mod.MeshCanvas).toBe("function");
  });
});
