import { describe, expect, it, vi } from "vitest";
import { TRACES } from "@/features/concepts/full-stack-strata/lib/island-data";
import {
  createIslandState,
  fireRequest,
} from "@/features/concepts/full-stack-strata/lib/island-state";

describe("island-state — bắn request xuyên stack qua cầu DOM ↔ canvas", () => {
  it("mặc định: không bắn, tiến độ 0, chưa gắn callback", () => {
    const state = createIslandState();
    expect(state.firing).toBe(-1);
    expect(state.fireT).toBe(0);
    expect(state.progress).toBe(0);
    expect(state.setTraceLine).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("fireRequest: chọn trace round-robin, không bắn chồng", () => {
    const state = createIslandState();
    const spy = vi.fn();
    state.invalidate = spy;

    fireRequest(state);
    expect(state.firing).toBe(0);
    expect(state.fireT).toBe(0);

    // Đang bay thì bấm thêm không ăn
    fireRequest(state);
    expect(state.firing).toBe(0);

    // Scene kết thúc chuyến bay → bắn tiếp sang trace kế
    state.firing = -1;
    fireRequest(state);
    expect(state.firing).toBe(1 % TRACES.length);
    expect(spy).toHaveBeenCalled();
  });
});
