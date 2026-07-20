import * as THREE from "three";
import {
  ROUTE_FRAGMENT_SHADER,
  ROUTE_VERTEX_SHADER,
} from "@/features/concepts/request-lifecycle/lib/route-shaders";
import { SPANS } from "@/features/concepts/request-lifecycle/lib/trace-data";

const queueSpan = SPANS.find((span) => span.kind === "async");

/** Material tube route — xung packet + tint hàng đợi, 1 draw call. */
export class RouteMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: ROUTE_VERTEX_SHADER,
      fragmentShader: ROUTE_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uProgress: { value: 0 },
        uQueueT0: { value: queueSpan?.t0 ?? 0 },
        uQueueT1: { value: queueSpan?.t1 ?? 0 },
        uBaseColor: { value: new THREE.Color("#3a4656") },
        uPulseColor: { value: new THREE.Color("#4ade80") },
        uQueueColor: { value: new THREE.Color("#f59e0b") },
      },
    });
  }

  setProgress(value: number): void {
    this.uniforms.uProgress.value = value;
  }
}
