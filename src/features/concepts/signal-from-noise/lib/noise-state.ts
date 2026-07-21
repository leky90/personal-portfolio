import { FORMS } from "@/features/concepts/signal-from-noise/lib/noise-data";

/** State chia sẻ DOM ↔ canvas của signal-from-noise (mutable ref). */
export interface NoiseState {
  /** Phase mục tiêu [0, số form - 1] — canvas damp về giá trị này */
  phase: number;
  /** Con trỏ chiếu lên mặt phẳng trường hạt (toạ độ world xy) */
  pointer: [number, number];
  /** Cường độ ordering lens mục tiêu (0 = nghỉ) */
  pointerStrength: number;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createNoiseState(): NoiseState {
  return {
    phase: 0,
    pointer: [0, 0],
    pointerStrength: 0,
    invalidate: null,
    isMobile: false,
  };
}

/** Map tiến độ cuộn [0,1] → phase form [0, N-1], clamp hai biên. */
export function noisePhaseFromScroll(scroll: number): number {
  return Math.min(Math.max(scroll, 0), 1) * (FORMS.length - 1);
}
