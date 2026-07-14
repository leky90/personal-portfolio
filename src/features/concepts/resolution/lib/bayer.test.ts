import { describe, expect, it } from "vitest";
import {
  BAYER_8X8,
  BAYER_NORMALIZED,
  bayerThreshold,
} from "@/features/concepts/resolution/lib/bayer";

describe("ma trận Bayer 8×8", () => {
  it("có đúng 64 giá trị nguyên duy nhất trong khoảng 0..63", () => {
    expect(BAYER_8X8).toHaveLength(64);
    const sorted = [...BAYER_8X8].sort((a, b) => a - b);
    expect(sorted).toEqual(Array.from({ length: 64 }, (_, i) => i));
  });

  it("hàng đầu tiên khớp ma trận Bayer chuẩn", () => {
    expect(BAYER_8X8.slice(0, 8)).toEqual([0, 32, 8, 40, 2, 34, 10, 42]);
  });

  it("bayerThreshold trả về giá trị chuẩn hóa trong (0, 1)", () => {
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        const t = bayerThreshold(x, y);
        expect(t).toBeGreaterThan(0);
        expect(t).toBeLessThan(1);
        expect(t).toBeCloseTo((BAYER_8X8[y * 8 + x] + 0.5) / 64, 10);
      }
    }
  });

  it("bayerThreshold tuần hoàn theo chu kỳ 8 (kể cả tọa độ âm)", () => {
    expect(bayerThreshold(0, 0)).toBeCloseTo(0.5 / 64, 10);
    expect(bayerThreshold(9, 9)).toBe(bayerThreshold(1, 1));
    expect(bayerThreshold(-1, -1)).toBe(bayerThreshold(7, 7));
  });

  it("BAYER_NORMALIZED là Float32Array 64 phần tử sẵn cho uniform", () => {
    expect(BAYER_NORMALIZED).toBeInstanceOf(Float32Array);
    expect(BAYER_NORMALIZED).toHaveLength(64);
    for (let i = 0; i < 64; i += 1) {
      expect(BAYER_NORMALIZED[i]).toBeCloseTo((BAYER_8X8[i] + 0.5) / 64, 5);
    }
  });
});
