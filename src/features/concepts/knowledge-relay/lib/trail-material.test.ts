import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { TrailMaterial } from "@/features/concepts/knowledge-relay/lib/trail-material";

describe("TrailMaterial — mọi vệt gậy trong 1 draw call additive", () => {
  it("khởi tạo uYear = 2014, additive, transparent", () => {
    const material = new TrailMaterial();
    expect(material.uniforms.uYear.value).toBe(2014);
    expect(material.blending).toBe(THREE.AdditiveBlending);
    expect(material.transparent).toBe(true);
    material.dispose();
  });

  it("setYear mutate uniform tại chỗ", () => {
    const material = new TrailMaterial();
    material.setYear(2023.4);
    expect(material.uniforms.uYear.value).toBeCloseTo(2023.4, 5);
    material.dispose();
  });
});
