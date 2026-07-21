import { describe, expect, it } from "vitest";
import {
  NOISE_FRAGMENT_SHADER,
  NOISE_VERTEX_SHADER,
} from "@/features/concepts/signal-from-noise/lib/noise-shaders";

describe("noise-shaders — GLSL3 texelFetch form + ordering lens", () => {
  it("vertex fetch target hai form từ DataTexture theo aId", () => {
    expect(NOISE_VERTEX_SHADER).toContain("texelFetch");
    expect(NOISE_VERTEX_SHADER).toContain("aId");
    expect(NOISE_VERTEX_SHADER).toContain("uBlend");
  });

  it("ordering lens ĐẢO chiều: gần con trỏ thì trật tự hoá SỚM hơn", () => {
    expect(NOISE_VERTEX_SHADER).toContain("uPointer");
    expect(NOISE_VERTEX_SHADER).toContain("vOrder");
  });

  it("fragment ramp hai stop lạnh → ấm theo vOrder", () => {
    expect(NOISE_FRAGMENT_SHADER).toContain("uCold");
    expect(NOISE_FRAGMENT_SHADER).toContain("uWarm");
    expect(NOISE_FRAGMENT_SHADER).toContain("vOrder");
    expect(NOISE_FRAGMENT_SHADER).toContain("out vec4 fragColor");
    expect(NOISE_FRAGMENT_SHADER).not.toContain("gl_FragColor");
  });

  it("không định nghĩa hàm luminance (đụng prefix tonemapping của three)", () => {
    expect(NOISE_FRAGMENT_SHADER).not.toMatch(/float\s+luminance\s*\(/);
    expect(NOISE_VERTEX_SHADER).not.toMatch(/float\s+luminance\s*\(/);
  });
});
