import * as THREE from "three";
import {
  GLYPH_FRAGMENT_SHADER,
  GLYPH_VERTEX_SHADER,
} from "@/features/concepts/glyph-field/lib/glyph-shaders";

/** Material của toàn bộ hệ chữ — đúng một draw call. */
export class GlyphMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      glslVersion: THREE.GLSL3,
      vertexShader: GLYPH_VERTEX_SHADER,
      fragmentShader: GLYPH_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTargets: { value: null },
        uRowA: { value: 0 },
        uRowB: { value: 1 },
        uBlend: { value: 0 },
        uPointer: { value: new THREE.Vector2() },
        uPointerStrength: { value: 0 },
        uSize: { value: 5 },
        uColor: { value: new THREE.Color("#e2e8f0") },
      },
    });
  }

  setRows(rowA: number, rowB: number, blend: number): void {
    this.uniforms.uRowA.value = rowA;
    this.uniforms.uRowB.value = rowB;
    this.uniforms.uBlend.value = blend;
  }

  setPointer(x: number, y: number, strength: number): void {
    (this.uniforms.uPointer.value as THREE.Vector2).set(x, y);
    this.uniforms.uPointerStrength.value = strength;
  }
}
