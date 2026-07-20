import { describe, expect, it } from "vitest";
import {
  GLYPH_FRAGMENT_SHADER,
  GLYPH_VERTEX_SHADER,
} from "@/features/concepts/glyph-field/lib/glyph-shaders";

describe("glyph-shaders — GLSL3 vì texelFetch bảng toạ độ heading", () => {
  it("vertex fetch target từ DataTexture bằng texelFetch theo aId", () => {
    expect(GLYPH_VERTEX_SHADER).toContain("texelFetch");
    expect(GLYPH_VERTEX_SHADER).toContain("aId");
    expect(GLYPH_VERTEX_SHADER).toContain("uBlend");
  });

  it("vertex có stagger theo seed, puff sin và repulsion con trỏ", () => {
    expect(GLYPH_VERTEX_SHADER).toContain("aSeed");
    expect(GLYPH_VERTEX_SHADER).toContain("uPointer");
    expect(GLYPH_VERTEX_SHADER).toContain("gl_PointSize");
  });

  it("fragment GLSL3: out vec4 fragColor + discard ngoài đĩa hạt", () => {
    expect(GLYPH_FRAGMENT_SHADER).toContain("out vec4 fragColor");
    expect(GLYPH_FRAGMENT_SHADER).not.toContain("gl_FragColor");
    expect(GLYPH_FRAGMENT_SHADER).toContain("discard");
  });

  it("không định nghĩa hàm luminance (đụng prefix tonemapping của three)", () => {
    expect(GLYPH_FRAGMENT_SHADER).not.toMatch(/float\s+luminance\s*\(/);
    expect(GLYPH_VERTEX_SHADER).not.toMatch(/float\s+luminance\s*\(/);
  });
});
