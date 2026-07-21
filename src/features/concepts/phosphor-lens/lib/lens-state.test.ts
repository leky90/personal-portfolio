import { describe, expect, it } from "vitest";
import {
  coverageFromScroll,
  createLensState,
} from "@/features/concepts/phosphor-lens/lib/lens-state";

describe("lens-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: coverage đầy, con trỏ nghỉ giữa màn", () => {
    const state = createLensState();
    expect(state.progress).toBe(0);
    expect(state.pointer).toEqual([0, 0]);
    expect(state.pointerActive).toBe(false);
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("coverageFromScroll: cuộn hết thì lớp phosphor gần như tan hẳn", () => {
    expect(coverageFromScroll(0)).toBe(1);
    expect(coverageFromScroll(1)).toBeCloseTo(0.15, 5);
    expect(coverageFromScroll(0.5)).toBeGreaterThan(
      coverageFromScroll(0.9),
    );
    expect(coverageFromScroll(-1)).toBe(1);
    expect(coverageFromScroll(2)).toBeCloseTo(0.15, 5);
  });
});
