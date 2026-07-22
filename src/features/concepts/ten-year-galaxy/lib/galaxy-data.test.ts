import { describe, expect, it } from "vitest";
import {
  GALAXY_ERAS,
  STAR_COUNT,
  SUPERNOVAE,
  buildStars,
  galaxyYearAt,
} from "@/features/concepts/ten-year-galaxy/lib/galaxy-data";

describe("galaxy-data — mỗi tuần làm việc một cụm sao, 4 cánh tay era", () => {
  it("buildStars: đủ sao, birth [0,1], era 0..3, toạ độ hữu hạn", () => {
    const stars = buildStars();
    expect(stars.spiral.length).toBe(STAR_COUNT * 3);
    expect(stars.dust.length).toBe(STAR_COUNT * 3);
    expect(stars.birth.length).toBe(STAR_COUNT);
    expect(stars.era.length).toBe(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i += 20) {
      expect(stars.birth[i]).toBeGreaterThanOrEqual(0);
      expect(stars.birth[i]).toBeLessThanOrEqual(1);
      expect(stars.era[i]).toBeGreaterThanOrEqual(0);
      expect(stars.era[i]).toBeLessThanOrEqual(3);
      for (const axis of [0, 1, 2]) {
        expect(Number.isFinite(stars.spiral[i * 3 + axis])).toBe(true);
        expect(Number.isFinite(stars.dust[i * 3 + axis])).toBe(true);
      }
    }
  });

  it("sao sinh muộn nằm xa tâm hơn sao sinh sớm (xoắn ốc nở ra)", () => {
    const stars = buildStars();
    let earlySum = 0;
    let earlyCount = 0;
    let lateSum = 0;
    let lateCount = 0;
    for (let i = 0; i < STAR_COUNT; i += 1) {
      const radius = Math.hypot(
        stars.spiral[i * 3],
        stars.spiral[i * 3 + 2],
      );
      if (stars.birth[i] < 0.2) {
        earlySum += radius;
        earlyCount += 1;
      } else if (stars.birth[i] > 0.8) {
        lateSum += radius;
        lateCount += 1;
      }
    }
    expect(lateSum / lateCount).toBeGreaterThan(earlySum / earlyCount);
  });

  it("4 era phủ kín [0,1] theo thứ tự, mỗi era một màu hex", () => {
    expect(GALAXY_ERAS).toHaveLength(4);
    expect(GALAXY_ERAS[0].from).toBe(0);
    expect(GALAXY_ERAS[3].to).toBe(1);
    for (let i = 1; i < GALAXY_ERAS.length; i += 1) {
      expect(GALAXY_ERAS[i].from).toBeCloseTo(GALAXY_ERAS[i - 1].to, 5);
    }
    for (const era of GALAXY_ERAS) {
      expect(era.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("10 supernova milestone: birth hợp lệ, label + story đầy đủ", () => {
    expect(SUPERNOVAE).toHaveLength(10);
    for (const supernova of SUPERNOVAE) {
      expect(supernova.birth).toBeGreaterThanOrEqual(0);
      expect(supernova.birth).toBeLessThanOrEqual(1);
      expect(supernova.label.length).toBeGreaterThan(0);
      expect(supernova.story.length).toBeGreaterThan(0);
    }
  });

  it("galaxyYearAt: 0 → 2012 (job đầu tiên), 1 → 2026", () => {
    expect(galaxyYearAt(0)).toBe(2012);
    expect(galaxyYearAt(1)).toBe(2026);
    expect(galaxyYearAt(0.5)).toBeGreaterThanOrEqual(2018);
    expect(galaxyYearAt(0.5)).toBeLessThanOrEqual(2020);
  });
});
