import { describe, expect, it, vi } from "vitest";
import {
  PULL_THRESHOLD,
  createBadgeState,
  releaseBadge,
} from "@/features/concepts/lanyard-badge/lib/badge-state";

describe("badge-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: không nắm, không lật, chưa kéo", () => {
    const state = createBadgeState();
    expect(state.grabbed).toBe(false);
    expect(state.flip).toBe(0);
    expect(state.pull).toBe(0);
    expect(state.onEnter).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("releaseBadge: kéo quá ngưỡng rồi thả mới bắn onEnter", () => {
    const state = createBadgeState();
    const spy = vi.fn();
    state.onEnter = spy;

    state.grabbed = true;
    state.pull = PULL_THRESHOLD * 0.5;
    releaseBadge(state);
    expect(spy).not.toHaveBeenCalled();
    expect(state.grabbed).toBe(false);

    state.grabbed = true;
    state.pull = PULL_THRESHOLD * 1.2;
    releaseBadge(state);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(state.pull).toBe(0);
  });
});
