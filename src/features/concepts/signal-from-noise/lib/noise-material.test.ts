import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { NoiseMaterial } from "@/features/concepts/signal-from-noise/lib/noise-material";

describe("NoiseMaterial — một draw call cho toàn bộ trường hạt", () => {
  it("GLSL3, blend thường (không additive) để giữ chất graphic", () => {
    const material = new NoiseMaterial();
    expect(material.glslVersion).toBe(THREE.GLSL3);
    expect(material.blending).toBe(THREE.NormalBlending);
    expect(material.transparent).toBe(true);
    expect(material.uniforms.uTargets.value).toBeNull();
    material.dispose();
  });

  it("setPhase/setPointer mutate uniform tại chỗ", () => {
    const material = new NoiseMaterial();
    material.setPhase(1, 2, 0.35);
    expect(material.uniforms.uFormA.value).toBe(1);
    expect(material.uniforms.uFormB.value).toBe(2);
    expect(material.uniforms.uBlend.value).toBeCloseTo(0.35, 5);
    material.setPointer(0.4, -0.2, 0.9);
    const pointer = material.uniforms.uPointer.value as THREE.Vector2;
    expect(pointer.x).toBeCloseTo(0.4, 5);
    expect(material.uniforms.uPointerStrength.value).toBeCloseTo(0.9, 5);
    material.dispose();
  });
});
