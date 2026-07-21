/** State chia sẻ DOM ↔ canvas của cabinet-of-shipped-worlds (mutable ref). */
export interface CabinetState {
  /** Ô đang hover (-1 = không) — sương tan, diorama thức dậy */
  hovered: number;
  /** Ô đã bước vào (-1 = đứng ngoài ngắm tủ) */
  entered: number;
  /** Canvas đẩy plaque đồng (title/years/metric) ra HUD DOM */
  setPlaque: ((cellIndex: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createCabinetState(): CabinetState {
  return {
    hovered: -1,
    entered: -1,
    setPlaque: null,
    invalidate: null,
    isMobile: false,
  };
}

/** Bắn plaque khi hover đổi ô — không lặp mỗi pointermove. */
export function notifyCell(state: CabinetState, cellIndex: number): void {
  if (cellIndex === state.hovered) return;
  state.hovered = cellIndex;
  state.setPlaque?.(cellIndex);
}

/** Bước vào một ô; click lại chính nó là lùi ra ngoài tủ. */
export function enterCell(state: CabinetState, cellIndex: number): void {
  state.entered = state.entered === cellIndex ? -1 : cellIndex;
  state.invalidate?.();
}
