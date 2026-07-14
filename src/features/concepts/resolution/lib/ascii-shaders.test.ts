import { describe, expect, it } from "vitest";
import {
  ASCII_FRAGMENT_SHADER,
  ASCII_VERTEX_SHADER,
} from "@/features/concepts/resolution/lib/ascii-shaders";

describe("GLSL pipeline ASCII", () => {
  it("xuất chuỗi shader không rỗng", () => {
    expect(ASCII_VERTEX_SHADER.length).toBeGreaterThan(0);
    expect(ASCII_FRAGMENT_SHADER.length).toBeGreaterThan(0);
  });

  it("vertex shader là quad phủ toàn view (clip-space)", () => {
    expect(ASCII_VERTEX_SHADER).toContain("gl_Position");
    expect(ASCII_VERTEX_SHADER).toContain("vUv");
  });

  it("fragment shader khai báo đủ các uniform của pipeline", () => {
    expect(ASCII_FRAGMENT_SHADER).toContain("uniform float uBayer[64]");
    expect(ASCII_FRAGMENT_SHADER).toContain("uSource");
    expect(ASCII_FRAGMENT_SHADER).toContain("uGlyphs");
    expect(ASCII_FRAGMENT_SHADER).toContain("uCellPx");
    expect(ASCII_FRAGMENT_SHADER).toContain("uLens");
    expect(ASCII_FRAGMENT_SHADER).toContain("uLensRadius");
    expect(ASCII_FRAGMENT_SHADER).toContain("uLensStrength");
    expect(ASCII_FRAGMENT_SHADER).toContain("uFocus");
    expect(ASCII_FRAGMENT_SHADER).toContain("uResolution");
    expect(ASCII_FRAGMENT_SHADER).toContain("uAccent");
    expect(ASCII_FRAGMENT_SHADER).toContain("void main");
  });

  it("fragment shader thực hiện đủ các bước: luminance → dither → glyph", () => {
    // Các bước cốt lõi phải hiện diện trong mã nguồn shader.
    expect(ASCII_FRAGMENT_SHADER).toMatch(/0\.2126|luminance/i);
    expect(ASCII_FRAGMENT_SHADER).toContain("floor(");
    expect(ASCII_FRAGMENT_SHADER).toContain("smoothstep(");
  });
});
