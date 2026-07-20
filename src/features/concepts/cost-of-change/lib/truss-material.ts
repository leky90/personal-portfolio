import * as THREE from "three";
import {
  TRUSS_FRAGMENT_SHADER,
  TRUSS_VERTEX_SHADER,
} from "@/features/concepts/cost-of-change/lib/truss-shaders";

/**
 * Material chia sẻ cho cả thanh lẫn khớp (2 InstancedMesh, 2 draw call,
 * 1 bộ uniform). Mảng strain là Float32Array mutate tại chỗ mỗi frame —
 * zero allocation trong frame loop.
 */
export class TrussMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      glslVersion: THREE.GLSL3,
      vertexShader: TRUSS_VERTEX_SHADER,
      fragmentShader: TRUSS_FRAGMENT_SHADER,
      uniforms: {
        uYear: { value: 0 },
        uCounterfactual: { value: 0 },
        uTremor: { value: 0 },
        uTime: { value: 0 },
        uFlash: { value: 0 },
        uStrain: { value: new Float32Array(12) },
        uStrainAlt: { value: new Float32Array(12) },
      },
    });
  }

  setYear(value: number): void {
    this.uniforms.uYear.value = value;
  }

  setCounterfactual(value: number): void {
    this.uniforms.uCounterfactual.value = value;
  }
}
