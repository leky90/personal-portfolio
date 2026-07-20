/** State chia sẻ DOM ↔ canvas của gravity-toybox (mutable ref). */
export interface ToyboxState {
  /** Token đang bị nắm kéo (-1 = không) */
  grabbed: number;
  /** Token đang hover (-1 = không) */
  hover: number;
  /** Tăng mỗi lần bấm thả lại — scene reset đồng hồ rơi */
  replayNonce: number;
  /** Canvas đẩy nhãn khối lượng ra HUD DOM */
  setLabel: ((tokenIndex: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createToyboxState(): ToyboxState {
  return {
    grabbed: -1,
    hover: -1,
    replayNonce: 0,
    setLabel: null,
    invalidate: null,
    isMobile: false,
  };
}

/** Bắn callback hover — chỉ khi token đổi, không lặp mỗi move. */
export function notifyHover(state: ToyboxState, tokenIndex: number): void {
  if (tokenIndex === state.hover) return;
  state.hover = tokenIndex;
  state.setLabel?.(tokenIndex);
}

/** Thả lại từ đầu: cả tên lẫn 12 đĩa tạ rơi lại. */
export function redrop(state: ToyboxState): void {
  state.replayNonce += 1;
  state.invalidate?.();
}
