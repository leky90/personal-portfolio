"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

interface InvalidateHost {
  invalidate: (() => void) | null;
}

interface DemandDriverProps {
  /** State chia sẻ của concept — driver gắn invalidate() của R3F vào đây */
  state: InvalidateHost;
  /** Chu kỳ ms của nhịp ambient (mặc định 33ms ≈ 30fps) */
  ambientMs?: number;
}

/**
 * Cầu nối cho frameloop="demand": gắn invalidate() vào state chia sẻ để DOM
 * gọi khi có tương tác, giữ nhịp ambient throttle ~30fps khi tab visible,
 * và invalidate theo scroll/resize (drei View cần re-render khi rect đổi).
 */
export function DemandDriver({ state, ambientMs = 33 }: DemandDriverProps) {
  const invalidate = useThree((three) => three.invalidate);

  useEffect(() => {
    state.invalidate = invalidate;

    const tick = window.setInterval(() => {
      if (!document.hidden) {
        invalidate();
      }
    }, ambientMs);
    const onViewportChange = () => invalidate();
    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);

    return () => {
      window.clearInterval(tick);
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      state.invalidate = null;
    };
  }, [state, invalidate, ambientMs]);

  return null;
}
