import { describe, expect, it, vi } from "vitest";
import {
  createToyboxState,
  notifyHover,
  redrop,
} from "@/features/concepts/gravity-toybox/lib/toybox-state";

describe("toybox-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: không grab, không hover, nonce 0", () => {
    const state = createToyboxState();
    expect(state.grabbed).toBe(-1);
    expect(state.hover).toBe(-1);
    expect(state.replayNonce).toBe(0);
    expect(state.setLabel).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("notifyHover chỉ bắn callback khi token đổi", () => {
    const state = createToyboxState();
    const spy = vi.fn();
    state.setLabel = spy;
    notifyHover(state, 3);
    notifyHover(state, 3);
    expect(spy).toHaveBeenCalledTimes(1);
    notifyHover(state, -1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(-1);
  });

  it("redrop tăng nonce và đánh thức frameloop", () => {
    const state = createToyboxState();
    const spy = vi.fn();
    state.invalidate = spy;
    redrop(state);
    redrop(state);
    expect(state.replayNonce).toBe(2);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
