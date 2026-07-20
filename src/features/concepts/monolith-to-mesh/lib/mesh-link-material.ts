import * as THREE from "three";
import {
  LINK_FRAGMENT_SHADER,
  LINK_VERTEX_SHADER,
} from "@/features/concepts/monolith-to-mesh/lib/mesh-link-shaders";

/** Material filament — additive cyan, reveal theo uU, pulse theo uTime. */
export class MeshLinkMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: LINK_VERTEX_SHADER,
      fragmentShader: LINK_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uU: { value: 0 },
        uTime: { value: 0 },
        uCyan: { value: new THREE.Color("#6ce0ff") },
        uCore: { value: new THREE.Color("#f2feff") },
      },
    });
  }
}
