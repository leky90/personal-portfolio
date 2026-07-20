import * as THREE from "three";
import {
  BEAM_FRAGMENT_SHADER,
  BEAM_VERTEX_SHADER,
} from "@/features/concepts/constraint-prism/lib/prism-shaders";

interface BeamMaterialOptions {
  width?: number;
  intensity?: number;
  color?: string;
  /** Mảng control point chia sẻ giữa core + glow: ghi một lần, hai tia cong theo */
  points?: THREE.Vector3[];
}

/**
 * Material ribbon tia — additive, không depthWrite, không postprocessing.
 * uPoints là 8 Vector3 cấp phát MỘT lần; setPoints mutate tại chỗ.
 */
export class BeamMaterial extends THREE.ShaderMaterial {
  constructor(options: BeamMaterialOptions = {}) {
    super({
      glslVersion: THREE.GLSL3,
      vertexShader: BEAM_VERTEX_SHADER,
      fragmentShader: BEAM_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uPoints: {
          value:
            options.points ??
            Array.from({ length: 8 }, () => new THREE.Vector3()),
        },
        uWidth: { value: options.width ?? 0.07 },
        uIntensity: { value: options.intensity ?? 1 },
        uColor: { value: new THREE.Color(options.color ?? "#f5f7fa") },
      },
    });
  }

  setPoints(points: readonly [number, number, number][]): void {
    const value = this.uniforms.uPoints.value as THREE.Vector3[];
    for (let i = 0; i < value.length && i < points.length; i += 1) {
      value[i].set(points[i][0], points[i][1], points[i][2]);
    }
  }
}
