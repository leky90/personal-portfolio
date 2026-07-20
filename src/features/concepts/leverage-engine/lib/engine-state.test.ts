import { describe, expect, it, vi } from "vitest";
import {
  createEngineState,
  decayOmega,
  nudgeOmega,
} from "@/features/concepts/leverage-engine/lib/engine-state";

describe("engine-state — tay quay, ma sát và cầu nối DOM ↔ canvas", () => {
  it("mặc định: đứng yên, chưa kéo, chưa gắn callback", () => {
    const state = createEngineState();
    expect(state.omega).toBe(0);
    expect(state.dragging).toBe(false);
    expect(state.progress).toBe(0);
    expect(state.setOdometer).toBeNull();
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("decayOmega: ma sát mũ giảm dần về 0 và snap khi đủ chậm", () => {
    const slower = decayOmega(4, 0.3);
    expect(slower).toBeLessThan(4);
    expect(slower).toBeGreaterThan(0);
    expect(decayOmega(0.01, 0.016)).toBe(0);
    expect(decayOmega(-0.01, 0.016)).toBe(0);
  });

  it("nudgeOmega: cộng dồn có clamp hai chiều và đánh thức frameloop", () => {
    const state = createEngineState();
    const spy = vi.fn();
    state.invalidate = spy;
    nudgeOmega(state, 0.6);
    expect(state.omega).toBeCloseTo(0.6, 6);
    for (let i = 0; i < 40; i += 1) nudgeOmega(state, 1);
    expect(state.omega).toBeLessThanOrEqual(8);
    for (let i = 0; i < 80; i += 1) nudgeOmega(state, -1);
    expect(state.omega).toBeGreaterThanOrEqual(-8);
    expect(spy).toHaveBeenCalled();
  });
});
