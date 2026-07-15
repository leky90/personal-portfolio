import { describe, expect, it } from "vitest";
import {
  GLYPH_RAMP,
  createGlyphAtlas,
} from "@/features/concepts/compiled-light/lib/glyph-atlas";

describe("glyph atlas (bản độc lập của compiled-light)", () => {
  it("ramp 16 ký tự duy nhất, thưa → đặc", () => {
    expect(GLYPH_RAMP).toHaveLength(16);
    expect(new Set(GLYPH_RAMP.split("")).size).toBe(16);
    expect(GLYPH_RAMP[0]).toBe(" ");
    expect(GLYPH_RAMP[15]).toBe("@");
  });

  it("createGlyphAtlas không throw trong jsdom (guard thiếu 2D context)", () => {
    expect(() => createGlyphAtlas()).not.toThrow();
  });
});
