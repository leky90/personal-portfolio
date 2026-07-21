import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("CabinetScene — smoke test export", () => {
  it("module export hàm component CabinetScene", async () => {
    const mod = await import(
      "@/features/concepts/cabinet-of-shipped-worlds/components/cabinet-scene"
    );
    expect(typeof mod.CabinetScene).toBe("function");
  });
});
