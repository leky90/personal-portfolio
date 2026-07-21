import { describe, expect, it } from "vitest";
import { createGalaxyState } from "@/features/concepts/ten-year-galaxy/lib/galaxy-state";

describe("galaxy-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: progress 0, chưa gắn invalidate", () => {
    const state = createGalaxyState();
    expect(state.progress).toBe(0);
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });
});
