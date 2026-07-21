/** State chia sẻ DOM ↔ canvas của desk-version-controlled (mutable ref). */
export interface DeskState {
  /** Tiến độ cuộn [0,1] — scrub timeline 2016→2026 */
  progress: number;
  /** Object đang hover (-1 = không) */
  hover: number;
  /** Canvas đẩy tooltip commit + story ra HUD DOM */
  setTooltip: ((objectIndex: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createDeskState(): DeskState {
  return {
    progress: 0,
    hover: -1,
    setTooltip: null,
    invalidate: null,
    isMobile: false,
  };
}

/** Bắn callback hover — chỉ khi object đổi, không lặp mỗi move. */
export function notifyDeskHover(state: DeskState, objectIndex: number): void {
  if (objectIndex === state.hover) return;
  state.hover = objectIndex;
  state.setTooltip?.(objectIndex);
}
