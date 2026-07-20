import { YEAR_SPAN } from "@/features/concepts/cost-of-change/lib/ledger-data";

/** State chia sẻ DOM ↔ canvas của cost-of-change (mutable ref). */
export interface ChangeState {
  /** Năm mục tiêu [0,10] từ cuộn — canvas damp về giá trị này */
  year: number;
  /** Blend counterfactual mục tiêu: 0 = lịch sử thật, 1 = không bao giờ refactor */
  counterfactual: number;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createChangeState(): ChangeState {
  return {
    year: 0,
    counterfactual: 0,
    invalidate: null,
    isMobile: false,
  };
}

/** Map tiến độ cuộn [0,1] → năm [0,10], clamp hai biên. */
export function yearFromProgress(progress: number): number {
  return Math.min(Math.max(progress, 0), 1) * YEAR_SPAN;
}

/** Nhãn năm hiển thị: 0 → 2016, 10 → 2026. */
export function yearLabel(yearFloat: number): number {
  return 2016 + Math.floor(Math.min(Math.max(yearFloat, 0), YEAR_SPAN));
}
