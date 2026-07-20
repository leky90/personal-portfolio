import { describe, expect, it } from "vitest";
import {
  ROUTE_FRAGMENT_SHADER,
  ROUTE_VERTEX_SHADER,
} from "@/features/concepts/request-lifecycle/lib/route-shaders";

describe("route-shaders — xung packet chạy dọc tube bằng uv.x", () => {
  it("vertex đẩy uv.x thành vPathT cho fragment", () => {
    expect(ROUTE_VERTEX_SHADER).toContain("varying float vPathT");
    expect(ROUTE_VERTEX_SHADER).toContain("uv.x");
  });

  it("fragment có đầu xung uProgress + đuôi exp fade", () => {
    expect(ROUTE_FRAGMENT_SHADER).toContain("uProgress");
    expect(ROUTE_FRAGMENT_SHADER).toContain("exp(");
  });

  it("đoạn hàng đợi tint amber qua cửa sổ uQueueT0..uQueueT1", () => {
    expect(ROUTE_FRAGMENT_SHADER).toContain("uQueueT0");
    expect(ROUTE_FRAGMENT_SHADER).toContain("uQueueT1");
  });

  it("GLSL1: dùng gl_FragColor, không khai báo out vec4", () => {
    expect(ROUTE_FRAGMENT_SHADER).toContain("gl_FragColor");
    expect(ROUTE_FRAGMENT_SHADER).not.toContain("out vec4");
  });

  it("không định nghĩa hàm luminance (đụng prefix tonemapping của three)", () => {
    expect(ROUTE_FRAGMENT_SHADER).not.toMatch(/float\s+luminance\s*\(/);
    expect(ROUTE_VERTEX_SHADER).not.toMatch(/float\s+luminance\s*\(/);
  });
});
