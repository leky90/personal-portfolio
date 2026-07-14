import { describe, expect, it } from "vitest";
import {
  GLYPH_RAMP,
  createGlyphAtlas,
  glyphIndexForLuminance,
} from "@/features/concepts/resolution/lib/glyph-atlas";

describe("bảng ramp glyph theo độ sáng", () => {
  it("có đúng 16 ký tự, không trùng lặp", () => {
    expect(GLYPH_RAMP).toHaveLength(16);
    expect(new Set(GLYPH_RAMP.split("")).size).toBe(16);
  });

  it("sắp xếp từ thưa (space) đến đặc (@)", () => {
    expect(GLYPH_RAMP[0]).toBe(" ");
    expect(GLYPH_RAMP[15]).toBe("@");
  });

  it("glyphIndexForLuminance ánh xạ luminance 0..1 sang index 0..15", () => {
    expect(glyphIndexForLuminance(0)).toBe(0);
    expect(glyphIndexForLuminance(1)).toBe(15);
    expect(glyphIndexForLuminance(0.5)).toBeGreaterThanOrEqual(7);
    expect(glyphIndexForLuminance(0.5)).toBeLessThanOrEqual(8);
  });

  it("glyphIndexForLuminance đơn điệu không giảm và kẹp ngoài khoảng", () => {
    let prev = glyphIndexForLuminance(0);
    for (let lum = 0; lum <= 1.0001; lum += 0.05) {
      const idx = glyphIndexForLuminance(lum);
      expect(idx).toBeGreaterThanOrEqual(prev);
      expect(Number.isInteger(idx)).toBe(true);
      prev = idx;
    }
    expect(glyphIndexForLuminance(-2)).toBe(0);
    expect(glyphIndexForLuminance(2)).toBe(15);
  });

  it("createGlyphAtlas là hàm và không throw trong jsdom (không có 2D context)", () => {
    expect(typeof createGlyphAtlas).toBe("function");
    // jsdom không rasterize canvas 2D — hàm phải guard và trả về null êm ái.
    expect(() => createGlyphAtlas()).not.toThrow();
  });
});
