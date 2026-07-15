import { describe, expect, it } from "vitest";
import {
  EDGE_FRAGMENT_SHADER,
  EDGE_VERTEX_SHADER,
} from "@/features/concepts/living-topology/lib/edge-shaders";

describe("GLSL cạnh graph (reveal theo năm + highlight hệ thống)", () => {
  it("vertex khai báo attribute năm sinh + cặp hệ thống của cạnh", () => {
    expect(EDGE_VERTEX_SHADER).toContain("attribute float aYear");
    expect(EDGE_VERTEX_SHADER).toContain("attribute vec2 aSystems");
    expect(EDGE_VERTEX_SHADER).toContain("gl_Position");
  });

  it("fragment reveal theo uYear, highlight theo uFocus, có accent", () => {
    expect(EDGE_FRAGMENT_SHADER).toContain("uYear");
    expect(EDGE_FRAGMENT_SHADER).toContain("uFocus");
    expect(EDGE_FRAGMENT_SHADER).toContain("uAccent");
    expect(EDGE_FRAGMENT_SHADER).toContain("uInk");
    expect(EDGE_FRAGMENT_SHADER).toContain("smoothstep(");
    expect(EDGE_FRAGMENT_SHADER).toContain("void main");
  });
});
