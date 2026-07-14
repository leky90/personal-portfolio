import * as THREE from "three";
import { BAYER_NORMALIZED } from "@/features/concepts/resolution/lib/bayer";
import {
  ASCII_FRAGMENT_SHADER,
  ASCII_VERTEX_SHADER,
} from "@/features/concepts/resolution/lib/ascii-shaders";

/**
 * ShaderMaterial dùng chung cho subject hero và mọi cover card — cùng một
 * chương trình GL, chỉ khác uniform. Khởi tạo được ngoài WebGL (node/jsdom)
 * vì compile chỉ xảy ra khi render lần đầu.
 */
export class AsciiMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      glslVersion: THREE.GLSL3,
      vertexShader: ASCII_VERTEX_SHADER,
      fragmentShader: ASCII_FRAGMENT_SHADER,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uSource: { value: null },
        uGlyphs: { value: null },
        uBayer: { value: Array.from(BAYER_NORMALIZED) },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uCellPx: { value: 14 },
        uLens: { value: new THREE.Vector2(-1000, -1000) },
        uLensRadius: { value: 180 },
        uLensStrength: { value: 0 },
        uFocus: { value: 0 },
        uAccent: { value: new THREE.Color("#b4ff39") },
        uInk: { value: new THREE.Color("#e8e8e8") },
        uBackground: { value: new THREE.Color("#050505") },
      },
    });
  }
}
