import { describe, expect, it, vi } from "vitest";
import {
  createSkylineState,
  notifyBuildingHover,
} from "@/features/concepts/commit-skyline/lib/skyline-state";

describe("skyline-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: progress 0, chưa hover, chưa gắn callback", () => {
    const state = createSkylineState();
    expect(state.progress).toBe(0);
    expect(state.hover).toBe(-1);
    expect(state.setTooltip).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("notifyBuildingHover chỉ bắn callback khi toà nhà đổi", () => {
    const state = createSkylineState();
    const spy = vi.fn();
    state.setTooltip = spy;
    notifyBuildingHover(state, 120);
    notifyBuildingHover(state, 120);
    expect(spy).toHaveBeenCalledTimes(1);
    notifyBuildingHover(state, -1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(-1);
  });
});
