/** State chia sẻ DOM ↔ canvas của leverage-engine (mutable ref). */
export interface EngineState {
  /** Tốc độ góc tay quay (rad/s), dấu = chiều quay */
  omega: number;
  /** Đang kéo crank bằng pointer (tắt ma sát) */
  dragging: boolean;
  /** Tiến độ cuộn [0,1] — camera dolly dọc hộp số */
  progress: number;
  /** Canvas đẩy số vòng ra HUD DOM (input, output cộng dồn) */
  setOdometer: ((inputRevs: number, outputRevs: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createEngineState(): EngineState {
  return {
    omega: 0,
    dragging: false,
    progress: 0,
    setOdometer: null,
    invalidate: null,
    isMobile: false,
  };
}

const FRICTION = 1.6;
const SNAP = 0.02;
const OMEGA_MAX = 8;

/** Ma sát mũ: thả tay là hộp số trôi chậm dần rồi snap 0 (dừng render). */
export function decayOmega(omega: number, dt: number): number {
  const next = omega * Math.exp(-FRICTION * dt);
  return Math.abs(next) < SNAP ? 0 : next;
}

/** Phím mũi tên / nút DOM đẩy tay quay, clamp hai chiều. */
export function nudgeOmega(state: EngineState, delta: number): void {
  state.omega = Math.min(Math.max(state.omega + delta, -OMEGA_MAX), OMEGA_MAX);
  state.invalidate?.();
}
