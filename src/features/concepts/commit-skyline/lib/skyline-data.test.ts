import { describe, expect, it } from "vitest";
import {
  DAY_COUNT,
  LANDMARKS,
  buildSkyline,
  cameraAlong,
  dayCommits,
  dayInfo,
} from "@/features/concepts/commit-skyline/lib/skyline-data";

describe("skyline-data — 3650 ngày commit dựng thành thành phố đêm", () => {
  it("dayCommits deterministic, nằm trong [0,12]", () => {
    for (const day of [0, 100, 999, 2500, DAY_COUNT - 1]) {
      const commits = dayCommits(day);
      expect(commits).toBe(dayCommits(day));
      expect(commits).toBeGreaterThanOrEqual(0);
      expect(commits).toBeLessThanOrEqual(12);
      expect(Number.isInteger(commits)).toBe(true);
    }
  });

  it("cuối tuần thưa hơn ngày thường (trung bình toàn thập kỷ)", () => {
    let weekendSum = 0;
    let weekendCount = 0;
    let weekdaySum = 0;
    let weekdayCount = 0;
    for (let day = 0; day < DAY_COUNT; day += 1) {
      if (day % 7 >= 5) {
        weekendSum += dayCommits(day);
        weekendCount += 1;
      } else {
        weekdaySum += dayCommits(day);
        weekdayCount += 1;
      }
    }
    expect(weekendSum / weekendCount).toBeLessThan(
      weekdaySum / weekdayCount,
    );
  });

  it("buildSkyline: đủ 3650 toà, cao theo commit, x tiến theo năm", () => {
    const skyline = buildSkyline();
    expect(skyline).toHaveLength(DAY_COUNT);
    for (const building of [skyline[0], skyline[1200], skyline[3649]]) {
      expect(building.height).toBeGreaterThan(0);
      expect(building.intensity).toBeGreaterThanOrEqual(0);
      expect(building.intensity).toBeLessThanOrEqual(1);
    }
    // Toà đầu năm sau luôn đứng xa hơn toà cuối năm trước (đại lộ giữa các block)
    expect(skyline[365].x).toBeGreaterThan(skyline[364].x);
    expect(skyline[3649].x).toBeGreaterThan(skyline[0].x);
  });

  it("6 landmark trỏ ngày hợp lệ, không trùng, có story", () => {
    expect(LANDMARKS).toHaveLength(6);
    expect(new Set(LANDMARKS.map((l) => l.dayIndex)).size).toBe(6);
    for (const landmark of LANDMARKS) {
      expect(landmark.dayIndex).toBeGreaterThanOrEqual(0);
      expect(landmark.dayIndex).toBeLessThan(DAY_COUNT);
      expect(landmark.label.length).toBeGreaterThan(0);
      expect(landmark.story.length).toBeGreaterThan(0);
    }
  });

  it("dayInfo: ngày 0 là đầu 2016, năm tăng mỗi 365 ngày", () => {
    expect(dayInfo(0)).toEqual({ year: 2016, week: 0, weekday: 0 });
    expect(dayInfo(365).year).toBe(2017);
    expect(dayInfo(3649).year).toBe(2025);
    expect(dayInfo(10).week).toBe(1);
  });

  it("cameraAlong: bay tiến theo x, toạ độ hữu hạn", () => {
    const start = cameraAlong(0);
    const end = cameraAlong(1);
    expect(end.position[0]).toBeGreaterThan(start.position[0]);
    for (const pose of [start, cameraAlong(0.5), end]) {
      for (const value of [...pose.position, ...pose.target]) {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
  });
});
