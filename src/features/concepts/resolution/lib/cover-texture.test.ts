import { describe, expect, it } from "vitest";
import {
  coverGradientStops,
  createCoverTexture,
} from "@/features/concepts/resolution/lib/cover-texture";

describe("texture nguồn procedural cho cover project", () => {
  it("coverGradientStops sinh dải màu hsl chứa đúng hue", () => {
    const stops = coverGradientStops(210);
    expect(stops.length).toBeGreaterThanOrEqual(2);
    for (const stop of stops) {
      expect(stop).toMatch(/^hsl\(210[,\s]/);
    }
  });

  it("hue khác nhau cho dải màu khác nhau", () => {
    expect(coverGradientStops(24)).not.toEqual(coverGradientStops(152));
  });

  it("createCoverTexture guard jsdom: không throw khi thiếu 2D context", () => {
    expect(typeof createCoverTexture).toBe("function");
    // jsdom trả về null cho getContext("2d") — hàm phải trả null thay vì crash.
    expect(() => createCoverTexture(152)).not.toThrow();
  });
});
