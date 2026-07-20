import { HEADINGS } from "@/features/concepts/glyph-field/lib/glyph-data";

/** State chia sẻ DOM ↔ canvas của glyph-field (mutable ref). */
export interface GlyphState {
  /** Progress mục tiêu [0, số heading - 1] — canvas damp về giá trị này */
  progress: number;
  /** Con trỏ trên mặt phẳng field (toạ độ world) */
  pointer: [number, number];
  /** Cường độ wake mục tiêu (0 = nghỉ) */
  pointerStrength: number;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createGlyphState(): GlyphState {
  return {
    progress: 0,
    pointer: [0, 0],
    pointerStrength: 0,
    invalidate: null,
    isMobile: false,
  };
}

/** Map tiến độ cuộn [0,1] → progress heading [0, N-1], clamp hai biên. */
export function glyphProgressFromScroll(scroll: number): number {
  return Math.min(Math.max(scroll, 0), 1) * (HEADINGS.length - 1);
}
