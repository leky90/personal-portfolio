import { describe, expect, it } from "vitest";
import { createDigState } from "@/features/concepts/maintenance-archaeology/lib/dig-state";

describe("dig state chia sẻ DOM ↔ canvas", () => {
  it("khởi tạo: progress 0 (mặt đất 2026), chưa probe mảnh nào", () => {
    const state = createDigState();
    expect(state.progress).toBe(0);
    expect(state.probed).toBe(-1);
    expect(state.setFindCard).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });
});
