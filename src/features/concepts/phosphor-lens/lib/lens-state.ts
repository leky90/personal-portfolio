/** State chia sẻ DOM ↔ canvas của phosphor-lens (mutable ref). */
export interface LensState {
  /** Tiến độ cuộn [0,1] — rack focus toàn cục + xoay vật thể */
  progress: number;
  /** Con trỏ theo pixel canvas */
  pointer: [number, number];
  pointerActive: boolean;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createLensState(): LensState {
  return {
    progress: 0,
    pointer: [0, 0],
    pointerActive: false,
    invalidate: null,
    isMobile: false,
  };
}

/** Cuộn rack focus: lớp phosphor tan dần từ 1 xuống 0.15 ở cuối hero. */
export function coverageFromScroll(progress: number): number {
  const p = Math.min(Math.max(progress, 0), 1);
  return 1 - p * 0.85;
}
