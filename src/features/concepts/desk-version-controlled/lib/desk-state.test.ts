import { describe, expect, it, vi } from "vitest";
import {
  createDeskState,
  notifyDeskHover,
} from "@/features/concepts/desk-version-controlled/lib/desk-state";

describe("desk-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: progress 0, chưa hover, chưa gắn callback", () => {
    const state = createDeskState();
    expect(state.progress).toBe(0);
    expect(state.hover).toBe(-1);
    expect(state.setTooltip).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("notifyDeskHover chỉ bắn callback khi object đổi", () => {
    const state = createDeskState();
    const spy = vi.fn();
    state.setTooltip = spy;
    notifyDeskHover(state, 4);
    notifyDeskHover(state, 4);
    expect(spy).toHaveBeenCalledTimes(1);
    notifyDeskHover(state, -1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(-1);
  });
});
