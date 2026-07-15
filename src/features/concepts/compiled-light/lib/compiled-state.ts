export interface CompiledLensState {
  active: boolean;
  /** Tọa độ px viewport, gốc dưới-trái (khớp vUv của GL) */
  x: number;
  y: number;
}

/** State chia sẻ DOM ↔ canvas của compiled-light (mutable ref, không re-render). */
export interface CompiledState {
  /** Tiến độ cuộn [0,1] — drive cell size coarse → fine */
  progress: number;
  lens: CompiledLensState;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createCompiledState(): CompiledState {
  return {
    progress: 0,
    lens: { active: false, x: -1000, y: -1000 },
    invalidate: null,
    isMobile: false,
  };
}
