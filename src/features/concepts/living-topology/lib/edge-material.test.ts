import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { EdgeMaterial } from "@/features/concepts/living-topology/lib/edge-material";

describe("EdgeMaterial", () => {
  it("là ShaderMaterial additive trong suốt, khởi tạo ngoài WebGL", () => {
    const material = new EdgeMaterial();
    expect(material).toBeInstanceOf(THREE.ShaderMaterial);
    expect(material.transparent).toBe(true);
    expect(material.blending).toBe(THREE.AdditiveBlending);
    material.dispose();
  });

  it("đủ uniform, mặc định chưa focus hệ thống nào và năm ở trước 2016", () => {
    const material = new EdgeMaterial();
    for (const key of ["uYear", "uFocus", "uInk", "uAccent"]) {
      expect(Object.keys(material.uniforms)).toContain(key);
    }
    expect(material.uniforms.uFocus.value).toBe(-1);
    expect(material.uniforms.uYear.value).toBeLessThan(2016);
    material.dispose();
  });
});
