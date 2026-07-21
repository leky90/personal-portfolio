import * as THREE from "three";
import { GALAXY_ERAS } from "@/features/concepts/ten-year-galaxy/lib/galaxy-data";
import {
  GALAXY_FRAGMENT_SHADER,
  GALAXY_VERTEX_SHADER,
} from "@/features/concepts/ten-year-galaxy/lib/galaxy-shaders";

/** Material 6000 sao — một draw call additive, sprite mềm không bloom. */
export class GalaxyMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: GALAXY_VERTEX_SHADER,
      fragmentShader: GALAXY_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: 0 },
        uSize: { value: 9 },
        uEra0: { value: new THREE.Color(GALAXY_ERAS[0].color) },
        uEra1: { value: new THREE.Color(GALAXY_ERAS[1].color) },
        uEra2: { value: new THREE.Color(GALAXY_ERAS[2].color) },
        uEra3: { value: new THREE.Color(GALAXY_ERAS[3].color) },
      },
    });
  }

  setProgress(value: number): void {
    this.uniforms.uProgress.value = value;
  }
}
