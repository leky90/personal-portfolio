import { describe, expect, it } from "vitest";
import { createSceneState } from "@/features/concepts/resolution/lib/scene-state";

describe("state chia sẻ giữa DOM và canvas (mutable ref, không re-render)", () => {
  it("khởi tạo lens tắt, nằm ngoài màn hình", () => {
    const state = createSceneState(3);
    expect(state.lens.active).toBe(false);
    expect(state.lens.x).toBeLessThan(0);
    expect(state.lens.y).toBeLessThan(0);
  });

  it("cardFocus có đúng số phần tử theo số card, tất cả về 0", () => {
    const state = createSceneState(3);
    expect(state.cardFocus).toEqual([0, 0, 0]);
    expect(createSceneState(5).cardFocus).toHaveLength(5);
  });

  it("mặc định: chưa tap-fine, pointer mịn, cell scale 1, chưa có invalidate", () => {
    const state = createSceneState(3);
    expect(state.tapFine).toBe(false);
    expect(state.isCoarsePointer).toBe(false);
    expect(state.cellScale).toBe(1);
    expect(state.invalidate).toBeNull();
  });
});
