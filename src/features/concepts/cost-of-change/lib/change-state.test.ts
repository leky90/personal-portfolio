import { describe, expect, it } from "vitest";
import {
  createChangeState,
  yearFromProgress,
  yearLabel,
} from "@/features/concepts/cost-of-change/lib/change-state";
import { YEAR_LABELS } from "@/features/concepts/cost-of-change/lib/ledger-data";

describe("change-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: năm 0, counterfactual tắt, chưa gắn invalidate", () => {
    const state = createChangeState();
    expect(state.year).toBe(0);
    expect(state.counterfactual).toBe(0);
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("yearFromProgress map [0,1] → [0,10] có clamp", () => {
    expect(yearFromProgress(0)).toBe(0);
    expect(yearFromProgress(0.5)).toBe(5);
    expect(yearFromProgress(1)).toBe(10);
    expect(yearFromProgress(-0.2)).toBe(0);
    expect(yearFromProgress(1.4)).toBe(10);
  });

  it("yearLabel tra bảng mốc thật: 0 → 2012, 10 → 2026", () => {
    expect(yearLabel(0)).toBe(2012);
    expect(yearLabel(4.7)).toBe(YEAR_LABELS[4]);
    expect(yearLabel(10)).toBe(2026);
    for (let step = 1; step <= 10; step += 1) {
      expect(yearLabel(step)).toBeGreaterThanOrEqual(yearLabel(step - 1));
    }
  });
});
