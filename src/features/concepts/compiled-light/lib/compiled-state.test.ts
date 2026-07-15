import { describe, expect, it } from "vitest";
import { createCompiledState } from "@/features/concepts/compiled-light/lib/compiled-state";

describe("compiled-light state chia sẻ DOM ↔ canvas", () => {
  it("khởi tạo: progress 0, lens tắt ngoài màn hình", () => {
    const state = createCompiledState();
    expect(state.progress).toBe(0);
    expect(state.lens.active).toBe(false);
    expect(state.lens.x).toBeLessThan(0);
    expect(state.lens.y).toBeLessThan(0);
  });

  it("chưa gắn invalidate, mặc định desktop", () => {
    const state = createCompiledState();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });
});
