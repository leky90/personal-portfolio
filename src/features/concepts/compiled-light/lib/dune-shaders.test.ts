import { describe, expect, it } from "vitest";
import {
  DUNE_FRAGMENT_SHADER,
  DUNE_VERTEX_SHADER,
} from "@/features/concepts/compiled-light/lib/dune-shaders";

describe("GLSL dune-field FBM", () => {
  it("vertex shader displace bằng FBM 3 octave + tính normal finite-difference", () => {
    expect(DUNE_VERTEX_SHADER).toContain("fbm(");
    expect(DUNE_VERTEX_SHADER).toContain("uAmp");
    expect(DUNE_VERTEX_SHADER).toContain("uTime");
    expect(DUNE_VERTEX_SHADER).toContain("uScale");
    expect(DUNE_VERTEX_SHADER).toContain("vNormal");
    expect(DUNE_VERTEX_SHADER).toContain("gl_Position");
  });

  it("fragment shader chiếu sáng raking light đơn sắc", () => {
    expect(DUNE_FRAGMENT_SHADER).toContain("uLightDir");
    expect(DUNE_FRAGMENT_SHADER).toContain("vNormal");
    expect(DUNE_FRAGMENT_SHADER).toContain("dot(");
    expect(DUNE_FRAGMENT_SHADER).toContain("void main");
  });
});
