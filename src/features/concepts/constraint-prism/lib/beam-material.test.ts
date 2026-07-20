import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { BeamMaterial } from "@/features/concepts/constraint-prism/lib/beam-material";

describe("BeamMaterial — tia additive không postprocessing", () => {
  it("GLSL3, additive, 8 control point Vector3", () => {
    const material = new BeamMaterial();
    expect(material.glslVersion).toBe(THREE.GLSL3);
    expect(material.blending).toBe(THREE.AdditiveBlending);
    const points = material.uniforms.uPoints.value as THREE.Vector3[];
    expect(points).toHaveLength(8);
    expect(points[0]).toBeInstanceOf(THREE.Vector3);
    material.dispose();
  });

  it("setPoints ghi vào đúng các Vector3 đã cấp phát sẵn (zero realloc)", () => {
    const material = new BeamMaterial();
    const before = [...(material.uniforms.uPoints.value as THREE.Vector3[])];
    material.setPoints([
      [0, 1, 0],
      [1, 2, 0],
      [2, 3, 0],
      [3, 4, 0],
      [4, 5, 0],
      [5, 6, 0],
      [6, 7, 0],
      [7, 8, 0],
    ]);
    const after = material.uniforms.uPoints.value as THREE.Vector3[];
    for (let i = 0; i < 8; i += 1) {
      expect(after[i]).toBe(before[i]);
      expect(after[i].y).toBe(i + 1);
    }
    material.dispose();
  });

  it("hai vai trò core/glow: nhận width + intensity riêng", () => {
    const glow = new BeamMaterial({ width: 0.3, intensity: 0.35 });
    expect(glow.uniforms.uWidth.value).toBeCloseTo(0.3, 5);
    expect(glow.uniforms.uIntensity.value).toBeCloseTo(0.35, 5);
    glow.dispose();
  });

  it("hai material chia chung một mảng control point khi được cấp", () => {
    const shared = Array.from({ length: 8 }, () => new THREE.Vector3());
    const core = new BeamMaterial({ points: shared });
    const glow = new BeamMaterial({ points: shared });
    expect(core.uniforms.uPoints.value).toBe(shared);
    expect(glow.uniforms.uPoints.value).toBe(shared);
    core.dispose();
    glow.dispose();
  });
});
