import { describe, expect, it } from "vitest";
import {
  DIGIT_SEGMENTS,
  layoutSegmentString,
  segmentTransforms,
} from "@/features/concepts/monolith/lib/segment-digits";

describe("chữ số 7-segment (instanced cube)", () => {
  it("đủ bảng 0-9, số 8 đủ 7 thanh, số 1 chỉ 2 thanh", () => {
    for (let d = 0; d <= 9; d += 1) {
      expect(DIGIT_SEGMENTS[String(d)]).toBeDefined();
    }
    expect(DIGIT_SEGMENTS["8"]).toHaveLength(7);
    expect(DIGIT_SEGMENTS["1"]).toHaveLength(2);
  });

  it("segmentTransforms trả về đúng số instance cho một chữ số", () => {
    expect(segmentTransforms("8")).toHaveLength(7);
    expect(segmentTransforms("0")).toHaveLength(6);
  });

  it("layoutSegmentString dịch offset x tăng dần theo từng ký tự", () => {
    const transforms = layoutSegmentString("2016");
    // 2:5 thanh, 0:6, 1:2, 6:6 → tổng 19 instance
    expect(transforms).toHaveLength(19);
    const xOfDigit = (index: number) =>
      Math.min(...transforms.filter((t) => t.digitIndex === index).map((t) => t.position[0]));
    expect(xOfDigit(1)).toBeGreaterThan(xOfDigit(0));
    expect(xOfDigit(3)).toBeGreaterThan(xOfDigit(2));
  });

  it("ký tự ngoài bảng thì ném lỗi", () => {
    expect(() => layoutSegmentString("2a")).toThrow(/a/);
  });
});
