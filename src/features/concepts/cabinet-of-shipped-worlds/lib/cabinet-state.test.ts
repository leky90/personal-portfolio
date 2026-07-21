import { describe, expect, it, vi } from "vitest";
import {
  createCabinetState,
  enterCell,
  notifyCell,
} from "@/features/concepts/cabinet-of-shipped-worlds/lib/cabinet-state";

describe("cabinet-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: chưa hover, chưa bước vào ô nào", () => {
    const state = createCabinetState();
    expect(state.hovered).toBe(-1);
    expect(state.entered).toBe(-1);
    expect(state.setPlaque).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("notifyCell chỉ bắn plaque khi ô đổi", () => {
    const state = createCabinetState();
    const spy = vi.fn();
    state.setPlaque = spy;
    notifyCell(state, 2);
    notifyCell(state, 2);
    expect(spy).toHaveBeenCalledTimes(1);
    notifyCell(state, -1);
    expect(spy).toHaveBeenLastCalledWith(-1);
  });

  it("enterCell: vào ô, vào lại chính nó là bước ra", () => {
    const state = createCabinetState();
    const spy = vi.fn();
    state.invalidate = spy;
    enterCell(state, 1);
    expect(state.entered).toBe(1);
    enterCell(state, 1);
    expect(state.entered).toBe(-1);
    enterCell(state, 3);
    expect(state.entered).toBe(3);
    expect(spy).toHaveBeenCalled();
  });
});
