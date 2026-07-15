import * as THREE from "three";
import {
  DUNE_FRAGMENT_SHADER,
  DUNE_VERTEX_SHADER,
} from "@/features/concepts/compiled-light/lib/dune-shaders";

/** Material của dune-field nguồn — render vào FBO half-res. */
export class DuneMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: DUNE_VERTEX_SHADER,
      fragmentShader: DUNE_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 1.7 },
        uScale: { value: 0.16 },
        uDrift: { value: 0.045 },
        uLightDir: { value: new THREE.Vector3(-0.82, 0.34, -0.2) },
      },
    });
  }
}
