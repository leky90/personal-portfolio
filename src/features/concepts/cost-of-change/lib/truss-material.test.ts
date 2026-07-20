import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { TrussMaterial } from "@/features/concepts/cost-of-change/lib/truss-material";

describe("TrussMaterial — một material chia sẻ cho thanh + khớp", () => {
  it("GLSL3, uniform mặc định: năm 0, không counterfactual", () => {
    const material = new TrussMaterial();
    expect(material.glslVersion).toBe(THREE.GLSL3);
    expect(material.uniforms.uYear.value).toBe(0);
    expect(material.uniforms.uCounterfactual.value).toBe(0);
    material.dispose();
  });

  it("uStrain/uStrainAlt là Float32Array(12) mutate tại chỗ", () => {
    const material = new TrussMaterial();
    const strain = material.uniforms.uStrain.value as Float32Array;
    const alt = material.uniforms.uStrainAlt.value as Float32Array;
    expect(strain).toBeInstanceOf(Float32Array);
    expect(strain).toHaveLength(12);
    expect(alt).toBeInstanceOf(Float32Array);
    expect(alt).toHaveLength(12);
    material.dispose();
  });

  it("setYear/setCounterfactual mutate uniform tại chỗ", () => {
    const material = new TrussMaterial();
    material.setYear(7.25);
    material.setCounterfactual(0.6);
    expect(material.uniforms.uYear.value).toBeCloseTo(7.25, 5);
    expect(material.uniforms.uCounterfactual.value).toBeCloseTo(0.6, 5);
    material.dispose();
  });
});
