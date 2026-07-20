import { describe, expect, it } from "vitest";
import {
  TRAIL_FRAGMENT_SHADER,
  TRAIL_VERTEX_SHADER,
} from "@/features/concepts/knowledge-relay/lib/relay-shaders";

describe("relay-shaders — vệt gậy hiện dần theo uYear", () => {
  it("vertex đẩy aYear thành varying cho fragment", () => {
    expect(TRAIL_VERTEX_SHADER).toContain("attribute float aYear");
    expect(TRAIL_VERTEX_SHADER).toContain("varying float vYear");
  });

  it("fragment lộ vệt bằng step(vYear, uYear) + đầu gậy glow", () => {
    expect(TRAIL_FRAGMENT_SHADER).toContain("uYear");
    expect(TRAIL_FRAGMENT_SHADER).toContain("step(");
    expect(TRAIL_FRAGMENT_SHADER).toContain("smoothstep(");
  });

  it("GLSL1: dùng gl_FragColor, không khai báo out vec4", () => {
    expect(TRAIL_FRAGMENT_SHADER).toContain("gl_FragColor");
    expect(TRAIL_FRAGMENT_SHADER).not.toContain("out vec4");
  });

  it("không định nghĩa hàm luminance (đụng prefix tonemapping của three)", () => {
    expect(TRAIL_FRAGMENT_SHADER).not.toMatch(/float\s+luminance\s*\(/);
    expect(TRAIL_VERTEX_SHADER).not.toMatch(/float\s+luminance\s*\(/);
  });
});
