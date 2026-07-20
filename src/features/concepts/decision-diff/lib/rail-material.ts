import * as THREE from "three";
import {
  RAIL_FRAGMENT_SHADER,
  RAIL_VERTEX_SHADER,
} from "@/features/concepts/decision-diff/lib/rail-shaders";

/** Material của trunk rail — unlit, GitHub-diff palette, fog tự xử lý. */
export class RailMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: RAIL_VERTEX_SHADER,
      fragmentShader: RAIL_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uProgress: { value: 0 },
        uGreen: { value: new THREE.Color("#3fb950") },
        uDim: { value: new THREE.Color("#3a4048") },
        uCore: { value: new THREE.Color("#f0fff4") },
        uBackground: { value: new THREE.Color("#050505") },
        uFogDensity: { value: 0.03 },
      },
    });
  }
}
