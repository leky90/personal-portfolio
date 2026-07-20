import { describe, expect, it, vi } from "vitest";
import {
  createTraceState,
  notifySpan,
} from "@/features/concepts/request-lifecycle/lib/trace-state";

describe("trace-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: progress 0, chưa có span active, chưa gắn callback", () => {
    const state = createTraceState();
    expect(state.progress).toBe(0);
    expect(state.activeSpan).toBe(-1);
    expect(state.invalidate).toBeNull();
    expect(state.setActiveSpan).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("notifySpan chỉ bắn callback khi span đổi, không lặp cùng span", () => {
    const state = createTraceState();
    const spy = vi.fn();
    state.setActiveSpan = spy;

    notifySpan(state, 0.05);
    notifySpan(state, 0.08);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(0);

    notifySpan(state, 0.97);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(5);
    expect(state.activeSpan).toBe(5);
  });

  it("notifySpan an toàn khi chưa gắn callback", () => {
    const state = createTraceState();
    expect(() => notifySpan(state, 0.5)).not.toThrow();
    expect(state.activeSpan).toBe(2);
  });
});
