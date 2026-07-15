import { describe, expect, it } from "vitest";
import {
  createTopologyState,
  yearForProgress,
} from "@/features/concepts/living-topology/lib/topology-state";

describe("topology state + ánh xạ scroll → năm", () => {
  it("khởi tạo: progress 0, chưa hover/focus hệ thống nào", () => {
    const state = createTopologyState();
    expect(state.progress).toBe(0);
    expect(state.hoverSystem).toBe(-1);
    expect(state.focusSystem).toBe(-1);
    expect(state.invalidate).toBeNull();
    expect(state.setTelemetry).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("yearForProgress: 0 → trước 2016, 1 → sau 2026, kẹp ngoài khoảng", () => {
    expect(yearForProgress(0)).toBeLessThan(2016);
    expect(yearForProgress(1)).toBeGreaterThan(2026);
    expect(yearForProgress(0.5)).toBeGreaterThan(2019);
    expect(yearForProgress(0.5)).toBeLessThan(2023);
    expect(yearForProgress(-5)).toBe(yearForProgress(0));
    expect(yearForProgress(5)).toBe(yearForProgress(1));
  });
});
