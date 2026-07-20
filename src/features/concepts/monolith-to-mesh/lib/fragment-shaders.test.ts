import { describe, expect, it } from "vitest";
import {
  FRAGMENT_FRAGMENT_SHADER,
  FRAGMENT_VERTEX_SHADER,
} from "@/features/concepts/monolith-to-mesh/lib/fragment-shaders";

describe("GLSL mảnh monolith — morph home→target trong VERTEX shader", () => {
  it("vertex đọc attribute per-instance và uU, có arc lift", () => {
    for (const token of ["aHome", "aTarget", "aPhase", "aPhase2", "aKind", "aSize", "aIndex", "uU", "sin("]) {
      expect(FRAGMENT_VERTEX_SHADER).toContain(token);
    }
    expect(FRAGMENT_VERTEX_SHADER).toContain("gl_Position");
  });

  it("fragment: edge glow cyan tăng theo độ tách + hover", () => {
    expect(FRAGMENT_FRAGMENT_SHADER).toContain("uCyan");
    expect(FRAGMENT_FRAGMENT_SHADER).toContain("smoothstep(");
    expect(FRAGMENT_FRAGMENT_SHADER).toContain("vSep");
    expect(FRAGMENT_FRAGMENT_SHADER).toContain("void main");
  });
});
