import * as THREE from "three";
import {
  FRAGMENT_FRAGMENT_SHADER,
  FRAGMENT_VERTEX_SHADER,
} from "@/features/concepts/monolith-to-mesh/lib/fragment-shaders";

/** Material mảnh monolith — graphite + viền kerf cyan, morph GPU-side. */
export class FragmentMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: FRAGMENT_VERTEX_SHADER,
      fragmentShader: FRAGMENT_FRAGMENT_SHADER,
      uniforms: {
        uU: { value: 0 },
        uLift: { value: 1.2 },
        uHover: { value: -1 },
        uCyan: { value: new THREE.Color("#6ce0ff") },
        uGraphite: { value: new THREE.Color("#16171b") },
      },
    });
  }
}
