import { describe, expect, it } from "vitest";
import {
  TRENCH_FRAGMENT_SHADER,
  TRENCH_VERTEX_SHADER,
  buildEraRamp,
} from "@/features/concepts/maintenance-archaeology/lib/trench-shaders";

describe("GLSL vách hố khai quật + era ramp bake CPU", () => {
  it("vertex truyền uv và world position", () => {
    expect(TRENCH_VERTEX_SHADER).toContain("vUv");
    expect(TRENCH_VERTEX_SHADER).toContain("gl_Position");
  });

  it("fragment: màu địa tầng từ uEraRamp, grain noise, vạch nén fract", () => {
    expect(TRENCH_FRAGMENT_SHADER).toContain("uEraRamp");
    expect(TRENCH_FRAGMENT_SHADER).toContain("fract(");
    expect(TRENCH_FRAGMENT_SHADER).toContain("void main");
  });

  it("buildEraRamp: 256 texel RGBA, seam giữa hai stratum tối hơn lòng band", () => {
    const ramp = buildEraRamp();
    expect(ramp).toHaveLength(256 * 4);
    const lum = (i: number) => ramp[i * 4] + ramp[i * 4 + 1] + ramp[i * 4 + 2];
    // texel giữa band đầu tiên sáng hơn texel sát ranh giới band
    const midFirstBand = lum(12);
    let seamIndex = -1;
    for (let i = 1; i < 255; i += 1) {
      if (lum(i) < lum(i - 1) * 0.7 && lum(i) < lum(i + 1) * 0.7) {
        seamIndex = i;
        break;
      }
    }
    expect(seamIndex).toBeGreaterThan(0);
    expect(lum(seamIndex)).toBeLessThan(midFirstBand);
  });

  it("buildEraRamp deterministic", () => {
    expect(Array.from(buildEraRamp())).toEqual(Array.from(buildEraRamp()));
  });
});
