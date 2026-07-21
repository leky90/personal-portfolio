/** Ngưỡng kéo thẻ xuống (world unit) để kích hoạt pull-to-enter. */
export const PULL_THRESHOLD = 0.55;

/** State chia sẻ DOM ↔ canvas của lanyard-badge (mutable ref). */
export interface BadgeState {
  /** Đang nắm thẻ bằng pointer */
  grabbed: boolean;
  /** Vị trí pointer trên mặt phẳng thẻ (world xy) */
  pointer: [number, number];
  /** Mục tiêu lật thẻ: 0 = mặt trước, 1 = mặt spec */
  flip: number;
  /** Độ kéo giãn xuống hiện tại (world unit, >0 khi kéo quá chiều dây) */
  pull: number;
  /** Kéo quá ngưỡng rồi thả → bước vào site */
  onEnter: (() => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createBadgeState(): BadgeState {
  return {
    grabbed: false,
    pointer: [0, 0],
    flip: 0,
    pull: 0,
    onEnter: null,
    invalidate: null,
    isMobile: false,
  };
}

/** Thả thẻ: nếu đã kéo quá ngưỡng thì bắn pull-to-enter. */
export function releaseBadge(state: BadgeState): void {
  const shouldEnter = state.pull >= PULL_THRESHOLD;
  state.grabbed = false;
  if (shouldEnter) {
    state.pull = 0;
    state.onEnter?.();
  }
  state.invalidate?.();
}
