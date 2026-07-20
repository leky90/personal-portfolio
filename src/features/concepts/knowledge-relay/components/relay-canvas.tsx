"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { RelayScene } from "@/features/concepts/knowledge-relay/components/relay-scene";
import type { RelayState } from "@/features/concepts/knowledge-relay/lib/relay-state";

export interface RelayCanvasProps {
  relayStateRef: { current: RelayState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function RelayCanvas({ relayStateRef, eventSourceRef }: RelayCanvasProps) {
  const state = relayStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 42, near: 0.1, far: 70, position: [-3, 1.2, 8.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <RelayScene relayState={state} />
    </Canvas>
  );
}
