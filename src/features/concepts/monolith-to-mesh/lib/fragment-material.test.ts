import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { FragmentMaterial } from "@/features/concepts/monolith-to-mesh/lib/fragment-material";

describe("FragmentMaterial", () => {
  it("là ShaderMaterial, khởi tạo ngoài WebGL", () => {
    const material = new FragmentMaterial();
    expect(material).toBeInstanceOf(THREE.ShaderMaterial);
    material.dispose();
  });

  it("mặc định: uU 0 (còn nguyên khối), cyan #6ce0ff, chưa hover", () => {
    const material = new FragmentMaterial();
    expect(material.uniforms.uU.value).toBe(0);
    const cyan = material.uniforms.uCyan.value as THREE.Color;
    expect(cyan.getHexString()).toBe("6ce0ff");
    expect(material.uniforms.uHover.value).toBe(-1);
    material.dispose();
  });
});
