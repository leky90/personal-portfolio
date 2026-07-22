import * as THREE from "three";
import {
  EDGE_FRAGMENT_SHADER,
  EDGE_VERTEX_SHADER,
} from "@/features/concepts/living-topology/lib/edge-shaders";

/** Material cạnh graph: mảnh, additive, reveal theo năm + highlight hệ thống. */
export class EdgeMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: EDGE_VERTEX_SHADER,
      fragmentShader: EDGE_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uYear: { value: 2013.5 },
        uFocus: { value: -1 },
        uInk: { value: new THREE.Color("#5a708f") },
        uAccent: { value: new THREE.Color("#4af2a1") },
      },
    });
  }
}
