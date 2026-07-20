import { describe, expect, it } from "vitest";
import {
  RAIL_FRAGMENT_SHADER,
  RAIL_VERTEX_SHADER,
} from "@/features/concepts/decision-diff/lib/rail-shaders";

describe("GLSL của rail — tương lai dashed, đã đi qua đông đặc diff-green", () => {
  it("vertex truyền tọa độ dọc rail (uv.x) và depth cho fog", () => {
    expect(RAIL_VERTEX_SHADER).toContain("vPathT");
    expect(RAIL_VERTEX_SHADER).toContain("uv.x");
    expect(RAIL_VERTEX_SHADER).toContain("gl_Position");
  });

  it("fragment: dash thủ tục cho đoạn chưa tới, solidify quanh uProgress", () => {
    expect(RAIL_FRAGMENT_SHADER).toContain("uProgress");
    expect(RAIL_FRAGMENT_SHADER).toContain("fract(");
    expect(RAIL_FRAGMENT_SHADER).toContain("smoothstep(");
    expect(RAIL_FRAGMENT_SHADER).toContain("uGreen");
    expect(RAIL_FRAGMENT_SHADER).toContain("uFogDensity");
    expect(RAIL_FRAGMENT_SHADER).toContain("void main");
  });
});
