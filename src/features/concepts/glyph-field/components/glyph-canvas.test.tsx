import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("GlyphCanvas — smoke test export", () => {
  it("module export hàm component GlyphCanvas", async () => {
    const mod = await import(
      "@/features/concepts/glyph-field/components/glyph-canvas"
    );
    expect(typeof mod.GlyphCanvas).toBe("function");
  });
});
