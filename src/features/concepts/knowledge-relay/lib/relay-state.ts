/** State chia sẻ DOM ↔ canvas của knowledge-relay (mutable ref). */
export interface RelayState {
  /** Năm mục tiêu [2016,2026] từ cuộn — canvas damp về giá trị này */
  year: number;
  /** Baton đang được chọn để đọc lineage (-1 = không) */
  selected: number;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createRelayState(): RelayState {
  return {
    year: 2016,
    selected: -1,
    invalidate: null,
    isMobile: false,
  };
}

/** Map tiến độ cuộn [0,1] → năm [2016,2026], clamp hai biên. */
export function relayYearFromProgress(progress: number): number {
  return 2016 + Math.min(Math.max(progress, 0), 1) * 10;
}
