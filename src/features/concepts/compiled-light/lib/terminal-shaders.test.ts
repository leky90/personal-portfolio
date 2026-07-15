import { describe, expect, it } from "vitest";
import {
  TERMINAL_FRAGMENT_SHADER,
  TERMINAL_VERTEX_SHADER,
} from "@/features/concepts/compiled-light/lib/terminal-shaders";

describe("GLSL composite pass terminal (ASCII + lens decompile)", () => {
  it("vertex là quad clip-space", () => {
    expect(TERMINAL_VERTEX_SHADER).toContain("gl_Position");
    expect(TERMINAL_VERTEX_SHADER).toContain("vUv");
  });

  it("fragment khai báo đủ uniform pipeline + output GLSL3", () => {
    expect(TERMINAL_FRAGMENT_SHADER).toContain("uniform float uBayer[64]");
    expect(TERMINAL_FRAGMENT_SHADER).toContain("uSource");
    expect(TERMINAL_FRAGMENT_SHADER).toContain("uGlyphs");
    expect(TERMINAL_FRAGMENT_SHADER).toContain("uCellPx");
    expect(TERMINAL_FRAGMENT_SHADER).toContain("uLens");
    expect(TERMINAL_FRAGMENT_SHADER).toContain("uLensRadius");
    expect(TERMINAL_FRAGMENT_SHADER).toContain("uLensStrength");
    expect(TERMINAL_FRAGMENT_SHADER).toContain("uPhosphor");
    // GLSL3: phải tự khai báo out (bài học batch 1 — three không cấp gl_FragColor)
    expect(TERMINAL_FRAGMENT_SHADER).toContain("out vec4 fragColor");
    expect(TERMINAL_FRAGMENT_SHADER).not.toContain("gl_FragColor");
    // không được đặt tên hàm luminance — đụng prefix tonemapping của three
    expect(TERMINAL_FRAGMENT_SHADER).not.toMatch(/float\s+luminance\s*\(/);
  });
});
