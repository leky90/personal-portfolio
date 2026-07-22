import { describe, expect, it } from "vitest";
import {
  DEBT_MAX,
  FLOOR_COUNT,
  LEDGER,
  REFACTOR_YEARS,
  YEAR_LABELS,
  YEAR_SPAN,
  buildTruss,
  debtAt,
  estimatedCostMonths,
  fillStrain,
} from "@/features/concepts/cost-of-change/lib/ledger-data";

describe("ledger-data — sổ cái nghề thật 2014 → 2025 nén vào 10 tầng", () => {
  it("10 chặng, yearIndex 0..9, năm tăng dần từ 2014 tới 2025", () => {
    expect(LEDGER).toHaveLength(FLOOR_COUNT);
    for (const [index, event] of LEDGER.entries()) {
      expect(event.yearIndex).toBe(index);
      if (index > 0) {
        expect(event.year).toBeGreaterThan(LEDGER[index - 1].year);
      }
      if (event.yearEnd !== undefined) {
        expect(event.yearEnd).toBeGreaterThan(event.year);
      }
    }
    expect(LEDGER[0].year).toBe(2014);
    expect(LEDGER[FLOOR_COUNT - 1].year).toBe(2025);
  });

  it("YEAR_LABELS: 11 mốc scrub, mốc cuối là hôm nay 2026", () => {
    expect(YEAR_LABELS).toHaveLength(YEAR_SPAN + 1);
    expect(YEAR_LABELS[0]).toBe(2014);
    expect(YEAR_LABELS[YEAR_SPAN]).toBe(2026);
  });

  it("refactor có relief < 1, feature thì không; REFACTOR_YEARS khớp", () => {
    for (const event of LEDGER) {
      if (event.kind === "refactor") {
        expect(event.relief).toBeGreaterThan(0);
        expect(event.relief).toBeLessThan(1);
      } else {
        expect(event.relief).toBeUndefined();
      }
    }
    expect(REFACTOR_YEARS).toEqual(
      LEDGER.filter((e) => e.kind === "refactor").map((e) => e.yearIndex),
    );
    expect(REFACTOR_YEARS.length).toBe(3);
  });

  it("debtAt: refactor kéo nợ thật xuống, timeline giả định chỉ tăng", () => {
    for (const yearIndex of REFACTOR_YEARS) {
      expect(debtAt(yearIndex + 1, false)).toBeLessThan(
        debtAt(yearIndex, false),
      );
    }
    for (let year = 1; year <= YEAR_SPAN; year += 1) {
      expect(debtAt(year, true)).toBeGreaterThanOrEqual(
        debtAt(year - 1, true),
      );
    }
  });

  it("nợ giả định luôn ≥ nợ thật, DEBT_MAX là đỉnh giả định năm 10", () => {
    for (let step = 0; step <= 40; step += 1) {
      const year = (step / 40) * YEAR_SPAN;
      expect(debtAt(year, true)).toBeGreaterThanOrEqual(
        debtAt(year, false) - 1e-9,
      );
    }
    expect(debtAt(YEAR_SPAN, true)).toBeCloseTo(DEBT_MAX, 5);
  });

  it("fillStrain: tầng thấp chịu lực hơn tầng cao, tầng chưa xây = 0", () => {
    const out = new Float32Array(12);
    fillStrain(out, YEAR_SPAN, false);
    expect(out[0]).toBeGreaterThan(out[5]);
    expect(out[5]).toBeGreaterThan(out[9]);

    fillStrain(out, 2, false);
    expect(out[0]).toBeGreaterThan(0);
    for (let floor = 2; floor < FLOOR_COUNT; floor += 1) {
      expect(out[floor]).toBe(0);
    }
  });

  it("fillStrain giả định ≥ thật trên mọi tầng ở năm 10", () => {
    const trueStrain = new Float32Array(12);
    const altStrain = new Float32Array(12);
    fillStrain(trueStrain, YEAR_SPAN, false);
    fillStrain(altStrain, YEAR_SPAN, true);
    for (let floor = 0; floor < FLOOR_COUNT; floor += 1) {
      expect(altStrain[floor]).toBeGreaterThanOrEqual(trueStrain[floor]);
    }
  });

  it("estimatedCostMonths: 0 trước refactor đầu tiên, dương ở năm 10", () => {
    expect(estimatedCostMonths(2)).toBe(0);
    expect(estimatedCostMonths(YEAR_SPAN)).toBeGreaterThan(0);
  });

  it("buildTruss: 120 thanh + 44 khớp, 4 cột mỗi tầng, toạ độ hữu hạn", () => {
    const truss = buildTruss();
    expect(truss.beams).toHaveLength(120);
    expect(truss.joints).toHaveLength(44);
    for (let floor = 0; floor < FLOOR_COUNT; floor += 1) {
      expect(
        truss.beams.filter(
          (beam) => beam.floor === floor && beam.kind === "column",
        ),
      ).toHaveLength(4);
    }
    for (const beam of truss.beams) {
      for (const value of [...beam.position, ...beam.rotation, ...beam.scale]) {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
    for (const joint of truss.joints) {
      expect(joint.level).toBeGreaterThanOrEqual(0);
      expect(joint.level).toBeLessThanOrEqual(FLOOR_COUNT);
    }
  });
});
