import * as THREE from "three";
import {
  NOISE_FRAGMENT_SHADER,
  NOISE_VERTEX_SHADER,
} from "@/features/concepts/signal-from-noise/lib/noise-shaders";

/**
 * Material trường hạt — blend THƯỜNG (không additive) để giữ chất
 * graphic ink thay vì glow, đúng art direction chống particle-soup.
 */
export class NoiseMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      glslVersion: THREE.GLSL3,
      vertexShader: NOISE_VERTEX_SHADER,
      fragmentShader: NOISE_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTargets: { value: null },
        uFormA: { value: 0 },
        uFormB: { value: 1 },
        uBlend: { value: 0 },
        uPointer: { value: new THREE.Vector2(999, 999) },
        uPointerStrength: { value: 0 },
        uSize: { value: 4.2 },
        uCold: { value: new THREE.Color("#7dd3fc") },
        uWarm: { value: new THREE.Color("#fbbf24") },
      },
    });
  }

  setPhase(formA: number, formB: number, blend: number): void {
    this.uniforms.uFormA.value = formA;
    this.uniforms.uFormB.value = formB;
    this.uniforms.uBlend.value = blend;
  }

  setPointer(x: number, y: number, strength: number): void {
    (this.uniforms.uPointer.value as THREE.Vector2).set(x, y);
    this.uniforms.uPointerStrength.value = strength;
  }
}
