/** State chia sẻ DOM ↔ canvas của daily-driver (mutable ref). */
export interface KeyboardState {
  /** Tiến độ cuộn [0,1] — camera 3/4 hero → top-down */
  progress: number;
  /** Hàng đợi index phím DOM đẩy vào, scene drain mỗi frame */
  pressQueue: number[];
  /** Canvas báo ngược khi user click keycap (raycast instanceId) */
  onKeyClick: ((keyIndex: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createKeyboardState(): KeyboardState {
  return {
    progress: 0,
    pressQueue: [],
    onKeyClick: null,
    invalidate: null,
    isMobile: false,
  };
}

/** DOM đẩy một cú nhấn vật lý vào scene; bỏ qua code không có trên board. */
export function pressKey(state: KeyboardState, keyIndex: number): void {
  if (keyIndex < 0) return;
  state.pressQueue.push(keyIndex);
  state.invalidate?.();
}
