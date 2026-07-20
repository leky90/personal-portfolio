import { activeSpanIndex } from "@/features/concepts/request-lifecycle/lib/trace-data";

/** State chia sẻ DOM ↔ canvas của request-lifecycle (mutable ref). */
export interface TraceState {
  /** Tiến độ cuộn [0,1] — vị trí packet trên route */
  progress: number;
  /** Span đã notify lần cuối (-1 = chưa có) */
  activeSpan: number;
  /** Canvas đẩy span active ra rail + HUD DOM */
  setActiveSpan: ((spanIndex: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createTraceState(): TraceState {
  return {
    progress: 0,
    activeSpan: -1,
    setActiveSpan: null,
    invalidate: null,
    isMobile: false,
  };
}

/** Bắn callback span active — chỉ khi span đổi, không lặp mỗi frame. */
export function notifySpan(state: TraceState, progress: number): void {
  const index = activeSpanIndex(progress);
  if (index === state.activeSpan) return;
  state.activeSpan = index;
  state.setActiveSpan?.(index);
}
