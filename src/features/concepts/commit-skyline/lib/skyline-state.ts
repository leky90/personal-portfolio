/** State chia sẻ DOM ↔ canvas của commit-skyline (mutable ref). */
export interface SkylineState {
  /** Tiến độ cuộn [0,1] — camera bay dọc đại lộ sự nghiệp (2012 → 2026) */
  progress: number;
  /** Toà nhà (ngày) đang hover (-1 = không) */
  hover: number;
  /** Canvas đẩy thông tin ngày + landmark ra HUD DOM */
  setTooltip: ((dayIndex: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createSkylineState(): SkylineState {
  return {
    progress: 0,
    hover: -1,
    setTooltip: null,
    invalidate: null,
    isMobile: false,
  };
}

/** Bắn callback hover — chỉ khi toà nhà đổi, không lặp mỗi move. */
export function notifyBuildingHover(
  state: SkylineState,
  dayIndex: number,
): void {
  if (dayIndex === state.hover) return;
  state.hover = dayIndex;
  state.setTooltip?.(dayIndex);
}
