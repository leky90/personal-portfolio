import { describe, expect, it } from "vitest";
import {
  GALAXY_FRAGMENT_SHADER,
  GALAXY_VERTEX_SHADER,
} from "@/features/concepts/ten-year-galaxy/lib/galaxy-shaders";

describe("galaxy-shaders — sao ngưng tụ từ bụi tại frontier uProgress", () => {
  it("vertex mix bụi → xoắn ốc theo smoothstep quanh aBirth", () => {
    expect(GALAXY_VERTEX_SHADER).toContain("aBirth");
    expect(GALAXY_VERTEX_SHADER).toContain("aDust");
    expect(GALAXY_VERTEX_SHADER).toContain("uProgress");
    expect(GALAXY_VERTEX_SHADER).toContain("smoothstep(");
    expect(GALAXY_VERTEX_SHADER).toContain("gl_PointSize");
  });

  it("fragment ramp màu 4 era từ aEra, radial falloff", () => {
    expect(GALAXY_VERTEX_SHADER).toContain("aEra");
    expect(GALAXY_FRAGMENT_SHADER).toContain("vEra");
    expect(GALAXY_FRAGMENT_SHADER).toContain("gl_PointCoord");
  });

  it("GLSL1: dùng gl_FragColor, không khai báo out vec4", () => {
    expect(GALAXY_FRAGMENT_SHADER).toContain("gl_FragColor");
    expect(GALAXY_FRAGMENT_SHADER).not.toContain("out vec4");
  });

  it("không định nghĩa hàm luminance (đụng prefix tonemapping của three)", () => {
    expect(GALAXY_FRAGMENT_SHADER).not.toMatch(/float\s+luminance\s*\(/);
    expect(GALAXY_VERTEX_SHADER).not.toMatch(/float\s+luminance\s*\(/);
  });
});
