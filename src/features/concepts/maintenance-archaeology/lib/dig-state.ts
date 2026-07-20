/** State chia sẻ DOM ↔ canvas của maintenance-archaeology (mutable ref). */
export interface DigState {
  /** Tiến độ cuộn [0,1] — độ sâu đào: 0 = mặt đất 2026, 1 = đá gốc 2016 */
  progress: number;
  /** Artifact đang probe (-1 = không) */
  probed: number;
  /** Canvas đẩy kết quả carbon-dating ra HUD DOM */
  setFindCard: ((artifactIndex: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createDigState(): DigState {
  return {
    progress: 0,
    probed: -1,
    setFindCard: null,
    invalidate: null,
    isMobile: false,
  };
}
