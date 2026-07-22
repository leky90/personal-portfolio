import { describe, expect, it } from "vitest";
import {
  DAY_COUNT,
  LANDMARKS,
  START_YEAR,
  YEAR_COUNT,
  buildSkyline,
  cameraAlong,
  dayCommits,
  dayInfo,
} from "@/features/concepts/commit-skyline/lib/skyline-data";

describe("skyline-data — 13 block năm commit (2014 → 2026) dựng thành phố đêm", () => {
  it("dayCommits deterministic, nằm trong [0,12]", () => {
    for (const day of [0, 100, 999, 2500, DAY_COUNT - 1]) {
      const commits = dayCommits(day);
      expect(commits).toBe(dayCommits(day));
      expect(commits).toBeGreaterThanOrEqual(0);
      expect(commits).toBeLessThanOrEqual(12);
      expect(Number.isInteger(commits)).toBe(true);
    }
  });

  it("cuối tuần thưa hơn ngày thường (trung bình toàn 13 block năm)", () => {
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

  it("buildSkyline: đủ DAY_COUNT toà, cao theo commit, x tiến theo năm", () => {
    const skyline = buildSkyline();
    expect(YEAR_COUNT).toBe(13);
    expect(DAY_COUNT).toBe(YEAR_COUNT * 365);
    expect(DAY_COUNT).toBe(4745);
    expect(skyline).toHaveLength(DAY_COUNT);
    for (const building of [skyline[0], skyline[1200], skyline[DAY_COUNT - 1]]) {
      expect(building.height).toBeGreaterThan(0);
      expect(building.intensity).toBeGreaterThanOrEqual(0);
      expect(building.intensity).toBeLessThanOrEqual(1);
    }
    // Toà đầu năm sau luôn đứng xa hơn toà cuối năm trước (đại lộ giữa các block)
    expect(skyline[365].x).toBeGreaterThan(skyline[364].x);
    expect(skyline[DAY_COUNT - 1].x).toBeGreaterThan(skyline[0].x);
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

  it("landmark xếp theo thời gian, trải từ 2014 tới 2026", () => {
    const years = LANDMARKS.map((l) => dayInfo(l.dayIndex).year);
    expect(years[0]).toBe(2014);
    expect(years.at(-1)).toBe(2026);
    for (let i = 1; i < LANDMARKS.length; i += 1) {
      expect(LANDMARKS[i].dayIndex).toBeGreaterThan(LANDMARKS[i - 1].dayIndex);
    }
    // Bốn chặng nghề đều có mặt: freelance, Synova, TESO, Treehouse
    expect(years).toContain(2017);
    expect(years).toContain(2019);
    expect(years).toContain(2021);
  });

  it("dayInfo: ngày 0 là đầu 2014, năm tăng mỗi 365 ngày", () => {
    expect(START_YEAR).toBe(2014);
    expect(dayInfo(0)).toEqual({ year: 2014, week: 0, weekday: 0 });
    expect(dayInfo(365).year).toBe(2015);
    expect(dayInfo(DAY_COUNT - 1).year).toBe(2026);
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
