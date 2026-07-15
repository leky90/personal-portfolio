import { describe, expect, it } from "vitest";
import {
  BAYER_8X8,
  BAYER_NORMALIZED,
} from "@/features/concepts/compiled-light/lib/bayer";

describe("ma trận Bayer 8×8 (bản độc lập của compiled-light)", () => {
  it("có đúng 64 giá trị nguyên duy nhất 0..63", () => {
    expect(BAYER_8X8).toHaveLength(64);
    const sorted = [...BAYER_8X8].sort((a, b) => a - b);
    expect(sorted).toEqual(Array.from({ length: 64 }, (_, i) => i));
  });

  it("hàng đầu khớp ma trận Bayer chuẩn", () => {
    expect(BAYER_8X8.slice(0, 8)).toEqual([0, 32, 8, 40, 2, 34, 10, 42]);
  });

  it("BAYER_NORMALIZED là Float32Array 64 phần tử trong (0,1)", () => {
    expect(BAYER_NORMALIZED).toBeInstanceOf(Float32Array);
    expect(BAYER_NORMALIZED).toHaveLength(64);
    for (const v of BAYER_NORMALIZED) {
      expect(v).toBeGreaterThan(0);
      expect(v).toBeLessThan(1);
    }
  });
});
