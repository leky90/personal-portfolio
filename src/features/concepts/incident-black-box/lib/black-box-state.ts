/** State chia sẻ DOM ↔ canvas của incident-black-box (mutable ref). */
export interface BlackBoxState {
  /** Tiến độ cuộn [0,1] — vị trí băng dưới playhead */
  progress: number;
  /** Event cuối cùng đã đi qua playhead (-1 = chưa) */
  docked: number;
  /** Canvas báo cho DOM khi event mới qua vạch đọc */
  setDocked: ((eventIndex: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createBlackBoxState(): BlackBoxState {
  return {
    progress: 0,
    docked: -1,
    setDocked: null,
    invalidate: null,
    isMobile: false,
  };
}
