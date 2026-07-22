import { describe, expect, it } from "vitest";
import {
  DEFAULT_SEED,
  ERAS,
  TOTAL_WEEKS,
  activeEraIndex,
  generateWeeklyActivity,
  mulberry32,
} from "@/features/concepts/terrain/lib/career-data";

describe("mulberry32", () => {
  it("cùng seed sinh cùng chuỗi số", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seqA = Array.from({ length: 20 }, () => a());
    const seqB = Array.from({ length: 20 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("seed khác sinh chuỗi khác", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).not.toEqual(seqB);
  });

  it("giá trị luôn trong [0, 1)", () => {
    const rand = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("ERAS", () => {
  it("có đúng 4 era theo thứ tự thời gian 2012 → 2021", () => {
    expect(ERAS).toHaveLength(4);
    expect(ERAS.map((e) => e.year)).toEqual([2012, 2017, 2019, 2021]);
  });

  it("2021 (Treehouse, vai trò lead hiện tại) là peak cao nhất", () => {
    const current = ERAS.find((e) => e.year === 2021);
    expect(current).toBeDefined();
    for (const era of ERAS) {
      if (era.year !== 2021) {
        expect(current!.peak).toBeGreaterThan(era.peak);
      }
    }
  });

  it("timeU tăng dần và nằm trong [0, 1]", () => {
    for (let i = 0; i < ERAS.length; i++) {
      expect(ERAS[i].timeU).toBeGreaterThanOrEqual(0);
      expect(ERAS[i].timeU).toBeLessThanOrEqual(1);
      if (i > 0) {
        expect(ERAS[i].timeU).toBeGreaterThan(ERAS[i - 1].timeU);
      }
    }
  });
});

describe("generateWeeklyActivity", () => {
  it("trả về đúng số tuần của 10 năm", () => {
    expect(generateWeeklyActivity()).toHaveLength(TOTAL_WEEKS);
  });

  it("deterministic: cùng seed → mảng giống hệt nhau", () => {
    const a = generateWeeklyActivity(DEFAULT_SEED);
    const b = generateWeeklyActivity(DEFAULT_SEED);
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it("seed khác → mảng khác", () => {
    const a = generateWeeklyActivity(1);
    const b = generateWeeklyActivity(2);
    expect(Array.from(a)).not.toEqual(Array.from(b));
  });

  it("mọi giá trị nằm trong [0, 1]", () => {
    const data = generateWeeklyActivity();
    for (const v of data) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it("peak 2021 cao hơn hẳn baseline những tuần đầu 2012", () => {
    const data = generateWeeklyActivity();
    const rebuild = ERAS.find((e) => e.year === 2021)!;
    const peak2021 = data[rebuild.week];
    const baselineStart = data[0]; // tuần đầu 2012, trước peak đầu tiên
    expect(peak2021).toBeGreaterThan(baselineStart + 0.3);
  });

  it("peak 2021 là giá trị lớn nhất toàn mảng (trong lân cận era)", () => {
    const data = generateWeeklyActivity();
    const rebuild = ERAS.find((e) => e.year === 2021)!;
    const max = Math.max(...Array.from(data));
    // đỉnh toàn cục phải nằm gần tuần của era 2021
    const maxIndex = Array.from(data).indexOf(max);
    expect(Math.abs(maxIndex - rebuild.week)).toBeLessThanOrEqual(6);
  });
});

describe("activeEraIndex", () => {
  it("hero (đầu trang) không có era active", () => {
    expect(activeEraIndex(0)).toBe(-1);
    expect(activeEraIndex(0.05)).toBe(-1);
  });

  it("tâm mỗi section era map đúng index", () => {
    expect(activeEraIndex(0.2)).toBe(0);
    expect(activeEraIndex(0.4)).toBe(1);
    expect(activeEraIndex(0.6)).toBe(2);
    expect(activeEraIndex(0.8)).toBe(3);
  });

  it("giữa hai section vẫn trả về index hợp lệ liền kề", () => {
    expect(activeEraIndex(0.45)).toBe(1);
    expect(activeEraIndex(0.55)).toBe(2);
  });

  it("section contact (cuối trang) không có era active", () => {
    expect(activeEraIndex(0.95)).toBe(-1);
    expect(activeEraIndex(1)).toBe(-1);
  });
});
