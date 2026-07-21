import { describe, expect, it } from "vitest";
import { buildLatheProfile } from "@/features/concepts/phosphor-lens/lib/lathe-data";

describe("lathe-data — profile khối kim loại tiện chính xác", () => {
  it("đủ ≥16 điểm, y đơn điệu tăng, bán kính dương ở thân", () => {
    const profile = buildLatheProfile();
    expect(profile.length).toBeGreaterThanOrEqual(16);
    for (let i = 1; i < profile.length; i += 1) {
      expect(profile[i][1]).toBeGreaterThanOrEqual(profile[i - 1][1]);
    }
    for (const [radius, y] of profile) {
      expect(Number.isFinite(radius)).toBe(true);
      expect(Number.isFinite(y)).toBe(true);
      expect(radius).toBeGreaterThanOrEqual(0);
    }
    const maxRadius = Math.max(...profile.map(([radius]) => radius));
    expect(maxRadius).toBeGreaterThan(0.5);
  });

  it("có rãnh V: tồn tại điểm lõm giữa hai điểm nhô cao hơn", () => {
    const profile = buildLatheProfile();
    let hasGroove = false;
    for (let i = 1; i < profile.length - 1; i += 1) {
      if (
        profile[i][0] < profile[i - 1][0] - 0.03 &&
        profile[i][0] < profile[i + 1][0] - 0.03
      ) {
        hasGroove = true;
      }
    }
    expect(hasGroove).toBe(true);
  });
});
