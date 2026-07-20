import { describe, expect, it } from "vitest";
import { createDecisionState } from "@/features/concepts/decision-diff/lib/decision-state";

describe("decision state chia sẻ DOM ↔ canvas", () => {
  it("khởi tạo: progress 0, chưa active card, chưa materialize nhánh nào", () => {
    const state = createDecisionState();
    expect(state.progress).toBe(0);
    expect(state.active).toBe(-1);
    expect(state.materialized).toBe(-1);
    expect(state.invalidate).toBeNull();
    expect(state.setGhostHud).toBeNull();
    expect(state.isMobile).toBe(false);
  });
});
