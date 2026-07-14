import { describe, expect, it } from "vitest";
import {
  TERRAIN_FRAGMENT_SHADER,
  TERRAIN_VERTEX_SHADER,
} from "@/features/concepts/terrain/lib/terrain-shaders";

describe("GLSL của terrain ridgeline", () => {
  it("vertex shader displace theo data texture + breathing + ripple", () => {
    expect(TERRAIN_VERTEX_SHADER).toContain("uHeight");
    expect(TERRAIN_VERTEX_SHADER).toContain("uAmp");
    expect(TERRAIN_VERTEX_SHADER).toContain("uTime");
    expect(TERRAIN_VERTEX_SHADER).toContain("uMotion");
    expect(TERRAIN_VERTEX_SHADER).toContain("uRippleOrigin");
    expect(TERRAIN_VERTEX_SHADER).toContain("uRippleStart");
    expect(TERRAIN_VERTEX_SHADER).toContain("gl_Position");
    expect(TERRAIN_VERTEX_SHADER).toContain("texture2D(");
    expect(TERRAIN_VERTEX_SHADER).toContain("sin(");
  });

  it("fragment shader có accent theo era + fog theo depth", () => {
    expect(TERRAIN_FRAGMENT_SHADER).toContain("uEraV");
    expect(TERRAIN_FRAGMENT_SHADER).toContain("uAccent");
    expect(TERRAIN_FRAGMENT_SHADER).toContain("uInk");
    expect(TERRAIN_FRAGMENT_SHADER).toContain("uFogDensity");
    expect(TERRAIN_FRAGMENT_SHADER).toContain("smoothstep(");
    expect(TERRAIN_FRAGMENT_SHADER).toContain("exp(");
    expect(TERRAIN_FRAGMENT_SHADER).toContain("void main");
  });
});
