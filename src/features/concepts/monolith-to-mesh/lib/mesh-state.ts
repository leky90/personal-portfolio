/** State chia sẻ DOM ↔ canvas của monolith-to-mesh (mutable ref). */
export interface MeshState {
  /** Tiến độ cuộn [0,1] — trục thời gian 2012→2026 của cả transformation */
  progress: number;
  /** Index entry đang hover (-1 = không) */
  hover: number;
  /** Pointer NDC [-1,1] cho parallax nhẹ */
  pointer: { x: number; y: number };
  /** Canvas gọi để đẩy ADR whisper ra HUD DOM */
  setServiceHud: ((entryIndex: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

/** Scroll [0,1] → thang u của shader, kẹp biên. */
export function progressToU(progress: number): number {
  return Math.min(Math.max(progress, 0), 1);
}

export function createMeshState(): MeshState {
  return {
    progress: 0,
    hover: -1,
    pointer: { x: 0, y: 0 },
    setServiceHud: null,
    invalidate: null,
    isMobile: false,
  };
}
