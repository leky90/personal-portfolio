/** State chia sẻ DOM ↔ canvas của monolith (mutable ref, không re-render). */
export interface MonolithState {
  /** Tiến độ cuộn [0,1] — camera t trên spline */
  progress: number;
  /** Pointer NDC [-1,1] cho parallax ±2 độ */
  pointer: { x: number; y: number };
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createMonolithState(): MonolithState {
  return {
    progress: 0,
    pointer: { x: 0, y: 0 },
    invalidate: null,
    isMobile: false,
  };
}
