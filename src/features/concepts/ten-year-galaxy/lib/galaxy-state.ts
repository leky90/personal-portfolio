/** State chia sẻ DOM ↔ canvas của ten-year-galaxy (mutable ref). */
export interface GalaxyState {
  /** Tiến độ cuộn [0,1] — mũi tên thời gian của thiên hà */
  progress: number;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createGalaxyState(): GalaxyState {
  return {
    progress: 0,
    invalidate: null,
    isMobile: false,
  };
}
