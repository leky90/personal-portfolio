import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { DuneMaterial } from "@/features/concepts/compiled-light/lib/dune-material";

describe("DuneMaterial", () => {
  it("khởi tạo được ngoài WebGL, là ShaderMaterial", () => {
    const material = new DuneMaterial();
    expect(material).toBeInstanceOf(THREE.ShaderMaterial);
    material.dispose();
  });

  it("khai báo đủ uniform của dune-field", () => {
    const material = new DuneMaterial();
    for (const key of ["uTime", "uAmp", "uScale", "uDrift", "uLightDir"]) {
      expect(Object.keys(material.uniforms)).toContain(key);
    }
    material.dispose();
  });
});
