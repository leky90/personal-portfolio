import { describe, expect, it, vi } from "vitest";
import {
  createConstellationState,
  queryNode,
} from "@/features/concepts/dependency-constellation/lib/constellation-state";

describe("constellation-state — query pnpm-why qua cầu DOM ↔ canvas", () => {
  it("mặc định: chưa query, chưa pin, chưa gắn callback", () => {
    const state = createConstellationState();
    expect(state.queried).toBeNull();
    expect(state.pinned).toBe(false);
    expect(state.setTerminal).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("queryNode bắn terminal đúng path và không lặp cùng node", () => {
    const state = createConstellationState();
    const spy = vi.fn();
    state.setTerminal = spy;

    queryNode(state, "s-kafka");
    queryNode(state, "s-kafka");
    expect(spy).toHaveBeenCalledTimes(1);
    const lines = spy.mock.calls[0][0] as string[];
    expect(lines[0]).toMatch(/pnpm why/);
    expect(lines.some((line) => line.includes("realtime-pipeline"))).toBe(
      true,
    );
  });

  it("queryNode(null) xoá query và gửi terminal rỗng", () => {
    const state = createConstellationState();
    const spy = vi.fn();
    state.setTerminal = spy;
    queryNode(state, "s-ts");
    queryNode(state, null);
    expect(state.queried).toBeNull();
    expect(spy).toHaveBeenLastCalledWith([]);
  });
});
