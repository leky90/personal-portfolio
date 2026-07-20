import * as THREE from "three";
import {
  TRENCH_FRAGMENT_SHADER,
  TRENCH_VERTEX_SHADER,
  buildEraRamp,
} from "@/features/concepts/maintenance-archaeology/lib/trench-shaders";

/** Material vách hố — era ramp bake CPU, shader chỉ sample + grain. */
export class TrenchMaterial extends THREE.ShaderMaterial {
  constructor() {
    const ramp = new THREE.DataTexture(
      buildEraRamp(),
      256,
      1,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
    );
    ramp.minFilter = THREE.LinearFilter;
    ramp.magFilter = THREE.LinearFilter;
    ramp.wrapS = THREE.ClampToEdgeWrapping;
    ramp.wrapT = THREE.ClampToEdgeWrapping;
    ramp.needsUpdate = true;

    super({
      vertexShader: TRENCH_VERTEX_SHADER,
      fragmentShader: TRENCH_FRAGMENT_SHADER,
      uniforms: {
        uEraRamp: { value: ramp },
      },
    });
  }
}
