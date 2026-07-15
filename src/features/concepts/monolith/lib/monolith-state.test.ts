import { describe, expect, it } from "vitest";
import { createMonolithState } from "@/features/concepts/monolith/lib/monolith-state";

describe("monolith state chia sẻ DOM ↔ canvas", () => {
  it("khởi tạo đầu trang: progress 0, pointer giữa, desktop", () => {
    const state = createMonolithState();
    expect(state.progress).toBe(0);
    expect(state.pointer.x).toBe(0);
    expect(state.pointer.y).toBe(0);
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });
});
