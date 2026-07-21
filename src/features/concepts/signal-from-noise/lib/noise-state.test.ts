import { describe, expect, it } from "vitest";
import {
  createNoiseState,
  noisePhaseFromScroll,
} from "@/features/concepts/signal-from-noise/lib/noise-state";

describe("noise-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: phase 0, con trỏ nghỉ", () => {
    const state = createNoiseState();
    expect(state.phase).toBe(0);
    expect(state.pointer).toEqual([0, 0]);
    expect(state.pointerStrength).toBe(0);
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("noisePhaseFromScroll map [0,1] → [0,2] có clamp", () => {
    expect(noisePhaseFromScroll(0)).toBe(0);
    expect(noisePhaseFromScroll(0.5)).toBeCloseTo(1, 5);
    expect(noisePhaseFromScroll(1)).toBe(2);
    expect(noisePhaseFromScroll(-3)).toBe(0);
    expect(noisePhaseFromScroll(3)).toBe(2);
  });
});
