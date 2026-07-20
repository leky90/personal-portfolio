import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { GlyphMaterial } from "@/features/concepts/glyph-field/lib/glyph-material";

describe("GlyphMaterial — một material cho đúng một draw call", () => {
  it("GLSL3, mặc định cặp hàng (0,1) blend 0, chưa gắn texture", () => {
    const material = new GlyphMaterial();
    expect(material.glslVersion).toBe(THREE.GLSL3);
    expect(material.uniforms.uRowA.value).toBe(0);
    expect(material.uniforms.uRowB.value).toBe(1);
    expect(material.uniforms.uBlend.value).toBe(0);
    expect(material.uniforms.uTargets.value).toBeNull();
    expect(material.transparent).toBe(true);
    material.dispose();
  });

  it("setRows/setPointer mutate uniform tại chỗ", () => {
    const material = new GlyphMaterial();
    material.setRows(2, 3, 0.4);
    expect(material.uniforms.uRowA.value).toBe(2);
    expect(material.uniforms.uRowB.value).toBe(3);
    expect(material.uniforms.uBlend.value).toBeCloseTo(0.4, 5);

    material.setPointer(1.2, -0.5, 0.8);
    const pointer = material.uniforms.uPointer.value as THREE.Vector2;
    expect(pointer.x).toBeCloseTo(1.2, 5);
    expect(pointer.y).toBeCloseTo(-0.5, 5);
    expect(material.uniforms.uPointerStrength.value).toBeCloseTo(0.8, 5);
    material.dispose();
  });
});
