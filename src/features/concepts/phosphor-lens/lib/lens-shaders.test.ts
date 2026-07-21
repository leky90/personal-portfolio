import { describe, expect, it } from "vitest";
import {
  LENS_FRAGMENT_SHADER,
  LENS_VERTEX_SHADER,
} from "@/features/concepts/phosphor-lens/lib/lens-shaders";

describe("lens-shaders — lớp phosphor fullscreen với lỗ thấu kính", () => {
  it("vertex pass-through clip-space (fullscreen quad, không ma trận)", () => {
    expect(LENS_VERTEX_SHADER).toContain("vec4(position.xy");
  });

  it("fragment có lens hole theo uPointer + band cell co giãn", () => {
    expect(LENS_FRAGMENT_SHADER).toContain("uPointer");
    expect(LENS_FRAGMENT_SHADER).toContain("uRadius");
    expect(LENS_FRAGMENT_SHADER).toContain("uCoverage");
    expect(LENS_FRAGMENT_SHADER).toContain("smoothstep(");
  });

  it("có scanline + shimmer phosphor theo uTime", () => {
    expect(LENS_FRAGMENT_SHADER).toContain("uTime");
    expect(LENS_FRAGMENT_SHADER).toContain("uResolution");
  });

  it("GLSL1: dùng gl_FragColor, không khai báo out vec4", () => {
    expect(LENS_FRAGMENT_SHADER).toContain("gl_FragColor");
    expect(LENS_FRAGMENT_SHADER).not.toContain("out vec4");
  });

  it("không định nghĩa hàm luminance (đụng prefix tonemapping của three)", () => {
    expect(LENS_FRAGMENT_SHADER).not.toMatch(/float\s+luminance\s*\(/);
    expect(LENS_VERTEX_SHADER).not.toMatch(/float\s+luminance\s*\(/);
  });
});
