import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("DeskScene — smoke test export", () => {
  it("module export hàm component DeskScene", async () => {
    const mod = await import(
      "@/features/concepts/desk-version-controlled/components/desk-scene"
    );
    expect(typeof mod.DeskScene).toBe("function");
  });
});
