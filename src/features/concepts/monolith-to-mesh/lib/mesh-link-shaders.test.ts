import { describe, expect, it } from "vitest";
import {
  LINK_FRAGMENT_SHADER,
  LINK_VERTEX_SHADER,
} from "@/features/concepts/monolith-to-mesh/lib/mesh-link-shaders";

describe("GLSL filament mesh — sinh theo uU, pulse theo uTime", () => {
  it("vertex truyền aBirth + aParam", () => {
    expect(LINK_VERTEX_SHADER).toContain("aBirth");
    expect(LINK_VERTEX_SHADER).toContain("aParam");
    expect(LINK_VERTEX_SHADER).toContain("gl_Position");
  });

  it("fragment: reveal theo uU, dash pulse chạy theo uTime", () => {
    expect(LINK_FRAGMENT_SHADER).toContain("uU");
    expect(LINK_FRAGMENT_SHADER).toContain("uTime");
    expect(LINK_FRAGMENT_SHADER).toContain("fract(");
    expect(LINK_FRAGMENT_SHADER).toContain("uCyan");
    expect(LINK_FRAGMENT_SHADER).toContain("void main");
  });
});
