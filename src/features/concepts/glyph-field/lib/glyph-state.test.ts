import { describe, expect, it } from "vitest";
import {
  createGlyphState,
  glyphProgressFromScroll,
} from "@/features/concepts/glyph-field/lib/glyph-state";

describe("glyph-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: progress 0, con trỏ nghỉ, chưa gắn invalidate", () => {
    const state = createGlyphState();
    expect(state.progress).toBe(0);
    expect(state.pointer).toEqual([0, 0]);
    expect(state.pointerStrength).toBe(0);
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("glyphProgressFromScroll map [0,1] → [0,3] có clamp", () => {
    expect(glyphProgressFromScroll(0)).toBe(0);
    expect(glyphProgressFromScroll(0.5)).toBeCloseTo(1.5, 5);
    expect(glyphProgressFromScroll(1)).toBe(3);
    expect(glyphProgressFromScroll(-2)).toBe(0);
    expect(glyphProgressFromScroll(2)).toBe(3);
  });
});
