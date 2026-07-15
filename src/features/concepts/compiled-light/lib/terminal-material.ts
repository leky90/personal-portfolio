import * as THREE from "three";
import { BAYER_NORMALIZED } from "@/features/concepts/compiled-light/lib/bayer";
import {
  TERMINAL_FRAGMENT_SHADER,
  TERMINAL_VERTEX_SHADER,
} from "@/features/concepts/compiled-light/lib/terminal-shaders";

/**
 * Material composite của pass terminal. Cell mặc định coarse (22px) —
 * scroll sẽ "compile" dần xuống fine; JS damp giá trị và ghi vào uCellPx.
 */
export class TerminalMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      glslVersion: THREE.GLSL3,
      vertexShader: TERMINAL_VERTEX_SHADER,
      fragmentShader: TERMINAL_FRAGMENT_SHADER,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uSource: { value: null },
        uGlyphs: { value: null },
        uBayer: { value: Array.from(BAYER_NORMALIZED) },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uCellPx: { value: 22 },
        uLens: { value: new THREE.Vector2(-1000, -1000) },
        uLensRadius: { value: 170 },
        uLensStrength: { value: 0 },
        uPhosphor: { value: new THREE.Color("#e6ead9") },
        uBackground: { value: new THREE.Color("#050505") },
      },
    });
  }
}
