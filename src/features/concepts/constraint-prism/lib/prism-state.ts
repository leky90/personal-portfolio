/** State chia sẻ DOM ↔ canvas của constraint-prism (mutable ref). */
export interface PrismState {
  /** Bitmask 5 ràng buộc đang active (bit i = CONSTRAINTS[i]) */
  mask: number;
  /** Canvas báo ngược khi user click một wedge */
  onToggle: ((constraintIndex: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createPrismState(): PrismState {
  return {
    mask: 0,
    onToggle: null,
    invalidate: null,
    isMobile: false,
  };
}

/**
 * Mask hiệu dụng: cuộn chèn tuần tự `inserted` ràng buộc đầu tiên,
 * muted loại trừ những cái user chủ động rút khỏi stack.
 */
export function maskWith(
  inserted: number,
  muted: ReadonlySet<number>,
): number {
  let mask = 0;
  for (let i = 0; i < inserted; i += 1) {
    if (!muted.has(i)) mask |= 1 << i;
  }
  return mask;
}

export function isActive(mask: number, index: number): boolean {
  return (mask & (1 << index)) !== 0;
}

export function countActive(mask: number): number {
  let count = 0;
  for (let m = mask; m > 0; m >>= 1) {
    count += m & 1;
  }
  return count;
}
