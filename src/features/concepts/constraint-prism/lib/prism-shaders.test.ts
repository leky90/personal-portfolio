import { describe, expect, it } from "vitest";
import {
  BEAM_FRAGMENT_SHADER,
  BEAM_VERTEX_SHADER,
} from "@/features/concepts/constraint-prism/lib/prism-shaders";

describe("prism-shaders — ribbon topology cố định, cong theo uPoints[8]", () => {
  it("vertex nội suy Catmull-Rom qua 8 control point uniform", () => {
    expect(BEAM_VERTEX_SHADER).toContain("uniform vec3 uPoints[8]");
    expect(BEAM_VERTEX_SHADER).toContain("sampleCurve");
    expect(BEAM_VERTEX_SHADER).toContain("uWidth");
  });

  it("vertex index mảng uniform động (lý do bắt buộc GLSL3)", () => {
    expect(BEAM_VERTEX_SHADER).toMatch(/uPoints\[[^\]0-9]/);
  });

  it("fragment GLSL3: out vec4 fragColor, không gl_FragColor", () => {
    expect(BEAM_FRAGMENT_SHADER).toContain("out vec4 fragColor");
    expect(BEAM_FRAGMENT_SHADER).not.toContain("gl_FragColor");
    expect(BEAM_VERTEX_SHADER).not.toContain("gl_FragColor");
  });

  it("không định nghĩa hàm luminance (đụng prefix tonemapping của three)", () => {
    expect(BEAM_FRAGMENT_SHADER).not.toMatch(/float\s+luminance\s*\(/);
    expect(BEAM_VERTEX_SHADER).not.toMatch(/float\s+luminance\s*\(/);
  });
});
