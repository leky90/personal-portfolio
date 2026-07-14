export interface LensState {
  /** Con trỏ đang ở trong vùng hero hay không */
  active: boolean;
  /** Tọa độ px cục bộ trong hero view, gốc dưới-trái (khớp vUv của GL) */
  x: number;
  y: number;
}

/**
 * State chia sẻ giữa DOM (experience) và canvas (R3F) qua mutable ref —
 * pointer/hover chạy 60fps nên KHÔNG đi qua React state để tránh re-render;
 * useFrame đọc trực tiếp và damp về target.
 */
export interface SceneState {
  lens: LensState;
  /** Mức focus target 0|1 của từng cover card (hover/focus DOM ghi vào) */
  cardFocus: number[];
  /** Mobile: tap toggle resolve toàn bề mặt thay cho lens hover */
  tapFine: boolean;
  isCoarsePointer: boolean;
  /** Hệ số phóng cell cho màn hình nhỏ (1 = desktop) */
  cellScale: number;
  /** invalidate() của R3F, canvas gắn vào sau khi mount */
  invalidate: (() => void) | null;
}

export function createSceneState(cardCount: number): SceneState {
  return {
    lens: { active: false, x: -1000, y: -1000 },
    cardFocus: new Array<number>(cardCount).fill(0),
    tapFine: false,
    isCoarsePointer: false,
    cellScale: 1,
    invalidate: null,
  };
}
