/** State chia sẻ DOM ↔ canvas của decision-diff (mutable ref, không re-render). */
export interface DecisionState {
  /** Tiến độ cuộn [0,1] — camera t trên rail */
  progress: number;
  /** ADR card đang đọc (-1 = hero/kết) — dò theo [data-decision-index] */
  active: number;
  /** Nhánh ma đang materialize (-1 = không) — hover/tap trên canvas */
  materialized: number;
  /** Canvas gọi để đẩy chi phí nhánh bỏ ra HUD DOM */
  setGhostHud: ((index: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createDecisionState(): DecisionState {
  return {
    progress: 0,
    active: -1,
    materialized: -1,
    setGhostHud: null,
    invalidate: null,
    isMobile: false,
  };
}
