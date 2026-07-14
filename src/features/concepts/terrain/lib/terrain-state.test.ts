import { describe, expect, it } from "vitest";
import { createTerrainState } from "@/features/concepts/terrain/lib/terrain-state";

describe("terrain state chia sẻ DOM ↔ canvas", () => {
  it("khởi tạo ở đầu trang: progress 0, không era active", () => {
    const state = createTerrainState();
    expect(state.progress).toBe(0);
    expect(state.era).toBe(-1);
  });

  it("ripple khởi tạo nằm ngoài sân khấu, chưa từng kích hoạt", () => {
    const state = createTerrainState();
    expect(state.ripple.startAt).toBeLessThan(0);
    expect(state.ripple.z).toBeLessThan(0);
  });

  it("chưa gắn invalidate, mặc định desktop", () => {
    const state = createTerrainState();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });
});
