import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("MeshScene — smoke test export", () => {
  it("module export hàm component MeshScene", async () => {
    const mod = await import(
      "@/features/concepts/monolith-to-mesh/components/mesh-scene"
    );
    expect(typeof mod.MeshScene).toBe("function");
  });
});
