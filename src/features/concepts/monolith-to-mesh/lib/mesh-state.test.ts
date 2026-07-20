import { describe, expect, it } from "vitest";
import {
  createMeshState,
  progressToU,
} from "@/features/concepts/monolith-to-mesh/lib/mesh-state";

describe("mesh state + ánh xạ scroll → độ tách", () => {
  it("khởi tạo: progress 0, chưa hover, pointer giữa", () => {
    const state = createMeshState();
    expect(state.progress).toBe(0);
    expect(state.hover).toBe(-1);
    expect(state.pointer.x).toBe(0);
    expect(state.pointer.y).toBe(0);
    expect(state.setServiceHud).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("progressToU kẹp [0,1]", () => {
    expect(progressToU(-1)).toBe(0);
    expect(progressToU(0.5)).toBe(0.5);
    expect(progressToU(2)).toBe(1);
  });
});
