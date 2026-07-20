import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("GlyphScene — smoke test export", () => {
  it("module export hàm component GlyphScene", async () => {
    const mod = await import(
      "@/features/concepts/glyph-field/components/glyph-scene"
    );
    expect(typeof mod.GlyphScene).toBe("function");
  });
});
