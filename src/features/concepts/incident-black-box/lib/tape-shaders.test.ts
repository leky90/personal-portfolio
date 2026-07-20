import { describe, expect, it } from "vitest";
import {
  TAPE_FRAGMENT_SHADER,
  TAPE_VERTEX_SHADER,
} from "@/features/concepts/incident-black-box/lib/tape-shaders";

describe("GLSL băng từ — telemetry khắc trên tape bằng DataTexture", () => {
  it("vertex có độ võng tape (sin) và truyền uv", () => {
    expect(TAPE_VERTEX_SHADER).toContain("sin(");
    expect(TAPE_VERTEX_SHADER).toContain("vUv");
    expect(TAPE_VERTEX_SHADER).toContain("gl_Position");
  });

  it("fragment: 3 trace từ uMetrics, tick fract, tint theo uSeverity", () => {
    expect(TAPE_FRAGMENT_SHADER).toContain("uMetrics");
    expect(TAPE_FRAGMENT_SHADER).toContain("uSeverity");
    expect(TAPE_FRAGMENT_SHADER).toContain("smoothstep(");
    expect(TAPE_FRAGMENT_SHADER).toContain("fract(");
    expect(TAPE_FRAGMENT_SHADER).toContain("void main");
  });
});
