import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { RailMaterial } from "@/features/concepts/decision-diff/lib/rail-material";

describe("RailMaterial", () => {
  it("là ShaderMaterial trong suốt, khởi tạo ngoài WebGL", () => {
    const material = new RailMaterial();
    expect(material).toBeInstanceOf(THREE.ShaderMaterial);
    expect(material.transparent).toBe(true);
    material.dispose();
  });

  it("uniform mặc định: progress 0, màu diff-green #3fb950", () => {
    const material = new RailMaterial();
    expect(material.uniforms.uProgress.value).toBe(0);
    const green = material.uniforms.uGreen.value as THREE.Color;
    expect(green.getHexString()).toBe("3fb950");
    material.dispose();
  });
});
