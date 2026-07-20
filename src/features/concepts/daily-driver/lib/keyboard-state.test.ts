import { describe, expect, it, vi } from "vitest";
import {
  createKeyboardState,
  pressKey,
} from "@/features/concepts/daily-driver/lib/keyboard-state";

describe("keyboard-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: queue rỗng, chưa gắn callback", () => {
    const state = createKeyboardState();
    expect(state.progress).toBe(0);
    expect(state.pressQueue).toEqual([]);
    expect(state.onKeyClick).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("pressKey đẩy index vào queue và đánh thức frameloop", () => {
    const state = createKeyboardState();
    const spy = vi.fn();
    state.invalidate = spy;
    pressKey(state, 12);
    pressKey(state, 3);
    expect(state.pressQueue).toEqual([12, 3]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("pressKey bỏ qua index âm (code không có trên board)", () => {
    const state = createKeyboardState();
    pressKey(state, -1);
    expect(state.pressQueue).toEqual([]);
  });
});
