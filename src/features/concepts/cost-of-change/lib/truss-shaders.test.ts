import { describe, expect, it } from "vitest";
import {
  TRUSS_FRAGMENT_SHADER,
  TRUSS_VERTEX_SHADER,
} from "@/features/concepts/cost-of-change/lib/truss-shaders";

describe("truss-shaders — GLSL3 vì index mảng uniform theo tầng", () => {
  it("vertex đọc uStrain[12]/uStrainAlt[12] theo int(aFloor)", () => {
    expect(TRUSS_VERTEX_SHADER).toContain("uniform float uStrain[12]");
    expect(TRUSS_VERTEX_SHADER).toContain("uniform float uStrainAlt[12]");
    expect(TRUSS_VERTEX_SHADER).toContain("int(aFloor)");
  });

  it("vertex có build-in theo aBuiltYear và blend uCounterfactual", () => {
    expect(TRUSS_VERTEX_SHADER).toContain("aBuiltYear");
    expect(TRUSS_VERTEX_SHADER).toContain("uCounterfactual");
    expect(TRUSS_VERTEX_SHADER).toContain("uTremor");
  });

  it("fragment GLSL3: khai báo out vec4 fragColor, không dùng gl_FragColor", () => {
    expect(TRUSS_FRAGMENT_SHADER).toContain("out vec4 fragColor");
    expect(TRUSS_FRAGMENT_SHADER).not.toContain("gl_FragColor");
  });

  it("fragment có ramp ứng suất + flash cyan refactor qua uFlash", () => {
    expect(TRUSS_FRAGMENT_SHADER).toContain("uFlash");
    expect(TRUSS_FRAGMENT_SHADER).toContain("vRefactor");
  });

  it("không định nghĩa hàm luminance (đụng prefix tonemapping của three)", () => {
    expect(TRUSS_FRAGMENT_SHADER).not.toMatch(/float\s+luminance\s*\(/);
    expect(TRUSS_VERTEX_SHADER).not.toMatch(/float\s+luminance\s*\(/);
  });
});
