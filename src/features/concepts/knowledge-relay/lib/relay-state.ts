import {
  RELAY_YEAR_MIN,
  RELAY_YEAR_SPAN,
} from "@/features/concepts/knowledge-relay/lib/relay-data";

/** State chia sẻ DOM ↔ canvas của knowledge-relay (mutable ref). */
export interface RelayState {
  /** Năm mục tiêu [2014,2026] từ cuộn — canvas damp về giá trị này */
  year: number;
  /** Baton đang được chọn để đọc lineage (-1 = không) */
  selected: number;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createRelayState(): RelayState {
  return {
    year: RELAY_YEAR_MIN,
    selected: -1,
    invalidate: null,
    isMobile: false,
  };
}

/** Map tiến độ cuộn [0,1] → năm [2014,2026], clamp hai biên. */
export function relayYearFromProgress(progress: number): number {
  return (
    RELAY_YEAR_MIN + Math.min(Math.max(progress, 0), 1) * RELAY_YEAR_SPAN
  );
}
