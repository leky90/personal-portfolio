import { describe, expect, it } from "vitest";
import {
  countActive,
  createPrismState,
  isActive,
  maskWith,
} from "@/features/concepts/constraint-prism/lib/prism-state";

describe("prism-state — mask ràng buộc DOM ↔ canvas", () => {
  it("mặc định: mask 0 (tia thẳng ngây thơ), chưa gắn callback", () => {
    const state = createPrismState();
    expect(state.mask).toBe(0);
    expect(state.onToggle).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("maskWith: cuộn chèn tuần tự, muted loại trừ từng bit", () => {
    expect(maskWith(0, new Set())).toBe(0);
    expect(maskWith(3, new Set())).toBe(0b00111);
    expect(maskWith(5, new Set([1, 3]))).toBe(0b10101);
    expect(maskWith(2, new Set([4]))).toBe(0b00011);
  });

  it("isActive + countActive đọc đúng bit", () => {
    const mask = 0b10101;
    expect(isActive(mask, 0)).toBe(true);
    expect(isActive(mask, 1)).toBe(false);
    expect(isActive(mask, 4)).toBe(true);
    expect(countActive(mask)).toBe(3);
    expect(countActive(0)).toBe(0);
  });
});
