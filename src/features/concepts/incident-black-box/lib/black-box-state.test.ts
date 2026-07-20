import { describe, expect, it } from "vitest";
import { createBlackBoxState } from "@/features/concepts/incident-black-box/lib/black-box-state";

describe("black-box state chia sẻ DOM ↔ canvas", () => {
  it("khởi tạo: progress 0, chưa event nào qua playhead", () => {
    const state = createBlackBoxState();
    expect(state.progress).toBe(0);
    expect(state.docked).toBe(-1);
    expect(state.setDocked).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });
});
