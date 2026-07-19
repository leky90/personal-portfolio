import { describe, expect, it } from "vitest";
import { nearestEraIndex } from "@/lib/scroll-era";

const vh = 800;

describe("nearestEraIndex — era active theo vị trí card trong viewport", () => {
  it("trả về -1 khi không có card nào gần tâm viewport", () => {
    expect(nearestEraIndex([], vh)).toBe(-1);
    expect(
      nearestEraIndex([{ top: 2000, height: 400 }], vh),
    ).toBe(-1);
  });

  it("chọn card có tâm gần tâm viewport nhất", () => {
    const rects = [
      { top: -900, height: 400 }, // đã cuộn qua
      { top: 250, height: 300 },  // tâm 400 = giữa viewport
      { top: 1400, height: 400 }, // chưa tới
    ];
    expect(nearestEraIndex(rects, vh)).toBe(1);
  });

  it("card hơi lệch vẫn được chọn nếu trong ngưỡng 60% viewport", () => {
    expect(
      nearestEraIndex([{ top: 700, height: 300 }], vh), // tâm 850, lệch 450 > 0.6*800? 450 < 480 ✓
    ).toBe(0);
    expect(
      nearestEraIndex([{ top: 900, height: 300 }], vh), // tâm 1050, lệch 650 > 480
    ).toBe(-1);
  });
});
