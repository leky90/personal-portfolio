"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { GlyphScene } from "@/features/concepts/glyph-field/components/glyph-scene";
import type { GlyphState } from "@/features/concepts/glyph-field/lib/glyph-state";

export interface GlyphCanvasProps {
  glyphStateRef: { current: GlyphState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function GlyphCanvas({ glyphStateRef, eventSourceRef }: GlyphCanvasProps) {
  const state = glyphStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 40, near: 0.1, far: 40, position: [0, 0, 8.2] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <GlyphScene glyphState={state} />
    </Canvas>
  );
}
