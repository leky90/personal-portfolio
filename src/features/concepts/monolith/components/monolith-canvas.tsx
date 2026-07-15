"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { MonolithScene } from "@/features/concepts/monolith/components/monolith-scene";
import type { MonolithState } from "@/features/concepts/monolith/lib/monolith-state";

export interface MonolithCanvasProps {
  monolithStateRef: { current: MonolithState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

/**
 * Geometry hoàn toàn tĩnh + frameloop="demand" → khi ngừng cuộn GPU vẽ
 * đúng 0 frame ("0% GPU at rest" — kiểm chứng được trong devtools).
 */
export function MonolithCanvas({ monolithStateRef }: MonolithCanvasProps) {
  const state = monolithStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 42, near: 0.1, far: 160, position: [-7.5, 2.6, -12] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <DemandDriver state={state} ambientMs={250} />
      <MonolithScene monolithState={state} />
    </Canvas>
  );
}
