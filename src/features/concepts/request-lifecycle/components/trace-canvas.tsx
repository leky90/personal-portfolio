"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { TraceScene } from "@/features/concepts/request-lifecycle/components/trace-scene";
import type { TraceState } from "@/features/concepts/request-lifecycle/lib/trace-state";

export interface TraceCanvasProps {
  traceStateRef: { current: TraceState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function TraceCanvas({ traceStateRef, eventSourceRef }: TraceCanvasProps) {
  const state = traceStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 50, near: 0.1, far: 140, position: [1.9, 2.3, 17] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      {/* ambient 400ms ≈ 2.5 render/s: đủ cho nhịp thở packet lúc idle */}
      <DemandDriver state={state} ambientMs={400} />
      <TraceScene traceState={state} />
    </Canvas>
  );
}
