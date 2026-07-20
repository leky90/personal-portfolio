import * as THREE from "three";
import {
  TRAIL_FRAGMENT_SHADER,
  TRAIL_VERTEX_SHADER,
} from "@/features/concepts/knowledge-relay/lib/relay-shaders";

/** Material vệt gậy — mọi hành trình 1 draw call additive. */
export class TrailMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: TRAIL_VERTEX_SHADER,
      fragmentShader: TRAIL_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uYear: { value: 2016 },
        uColor: { value: new THREE.Color("#34d399") },
      },
    });
  }

  setYear(value: number): void {
    this.uniforms.uYear.value = value;
  }
}
