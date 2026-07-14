import * as THREE from "three";
import {
  TERRAIN_FRAGMENT_SHADER,
  TERRAIN_VERTEX_SHADER,
} from "@/features/concepts/terrain/lib/terrain-shaders";

/**
 * Material của ridgeline: đường mảnh additive trên nền tối, alpha theo độ
 * cao + fog, accent hổ phách quét theo era active. Khởi tạo được ngoài WebGL.
 */
export class TerrainMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: TERRAIN_VERTEX_SHADER,
      fragmentShader: TERRAIN_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uHeight: { value: null },
        uAmp: { value: 7.5 },
        uTime: { value: 0 },
        uMotion: { value: 1 },
        uRippleOrigin: { value: new THREE.Vector2(0, -999) },
        uRippleStart: { value: -999 },
        uEraV: { value: -1 },
        uInk: { value: new THREE.Color("#e8e8e8") },
        uAccent: { value: new THREE.Color("#ffb454") },
        uBackground: { value: new THREE.Color("#050505") },
        uFogDensity: { value: 0.022 },
      },
    });
  }
}
