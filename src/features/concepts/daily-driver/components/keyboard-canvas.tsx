"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { KeyboardScene } from "@/features/concepts/daily-driver/components/keyboard-scene";
import type { KeyboardState } from "@/features/concepts/daily-driver/lib/keyboard-state";

export interface KeyboardCanvasProps {
  keyboardStateRef: { current: KeyboardState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function KeyboardCanvas({
  keyboardStateRef,
  eventSourceRef,
}: KeyboardCanvasProps) {
  const state = keyboardStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 42, near: 0.1, far: 60, position: [0, 4.8, 7.0] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <KeyboardScene keyboardState={state} />
    </Canvas>
  );
}
