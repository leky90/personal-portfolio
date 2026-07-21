import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { LensMaterial } from "@/features/concepts/phosphor-lens/lib/lens-material";

describe("LensMaterial — một pass stateless, không FBO", () => {
  it("transparent, không depthWrite/depthTest, coverage mặc định 1", () => {
    const material = new LensMaterial();
    expect(material.transparent).toBe(true);
    expect(material.depthWrite).toBe(false);
    expect(material.depthTest).toBe(false);
    expect(material.uniforms.uCoverage.value).toBe(1);
    expect(material.uniforms.uPointer.value).toBeInstanceOf(THREE.Vector2);
    material.dispose();
  });

  it("setPointer/setCoverage mutate uniform tại chỗ", () => {
    const material = new LensMaterial();
    material.setPointer(320, 240);
    material.setCoverage(0.4);
    const pointer = material.uniforms.uPointer.value as THREE.Vector2;
    expect(pointer.x).toBe(320);
    expect(pointer.y).toBe(240);
    expect(material.uniforms.uCoverage.value).toBeCloseTo(0.4, 5);
    material.dispose();
  });
});
