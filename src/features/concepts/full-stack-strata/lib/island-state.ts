import { TRACES } from "@/features/concepts/full-stack-strata/lib/island-data";

/** State chia sẻ DOM ↔ canvas của full-stack-strata (mutable ref). */
export interface IslandState {
  /** Tiến độ cuộn [0,1] — camera tụt dọc lát cắt */
  progress: number;
  /** Trace đang bay (-1 = không) */
  firing: number;
  /** Tiến độ chuyến bay hiện tại [0,1] */
  fireT: number;
  /** Trace kế tiếp cho round-robin */
  nextTrace: number;
  /** Canvas đẩy dòng log trace ra terminal DOM */
  setTraceLine: ((line: string) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createIslandState(): IslandState {
  return {
    progress: 0,
    firing: -1,
    fireT: 0,
    nextTrace: 0,
    setTraceLine: null,
    invalidate: null,
    isMobile: false,
  };
}

/** Bắn một request xuyên stack — round-robin kịch bản, không bắn chồng. */
export function fireRequest(state: IslandState): void {
  if (state.firing >= 0) return;
  state.firing = state.nextTrace % TRACES.length;
  state.nextTrace = (state.nextTrace + 1) % TRACES.length;
  state.fireT = 0;
  state.invalidate?.();
}
