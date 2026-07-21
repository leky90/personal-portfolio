import * as THREE from "three";
import {
  LENS_FRAGMENT_SHADER,
  LENS_VERTEX_SHADER,
} from "@/features/concepts/phosphor-lens/lib/lens-shaders";

/** Material lớp phosphor — vẽ đè fullscreen, không đụng depth buffer. */
export class LensMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: LENS_VERTEX_SHADER,
      fragmentShader: LENS_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uPointer: { value: new THREE.Vector2(-9999, -9999) },
        uRadius: { value: 170 },
        uCoverage: { value: 1 },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uPhosphor: { value: new THREE.Color("#39ff6e") },
      },
    });
  }

  setPointer(x: number, y: number): void {
    (this.uniforms.uPointer.value as THREE.Vector2).set(x, y);
  }

  setCoverage(value: number): void {
    this.uniforms.uCoverage.value = value;
  }
}
