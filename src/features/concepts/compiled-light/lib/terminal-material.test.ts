import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { TerminalMaterial } from "@/features/concepts/compiled-light/lib/terminal-material";

describe("TerminalMaterial (composite ASCII)", () => {
  it("là ShaderMaterial GLSL3, khởi tạo được ngoài WebGL", () => {
    const material = new TerminalMaterial();
    expect(material).toBeInstanceOf(THREE.ShaderMaterial);
    expect(material.glslVersion).toBe(THREE.GLSL3);
    material.dispose();
  });

  it("nạp sẵn Bayer 64 giá trị, lens tắt, cell coarse mặc định", () => {
    const material = new TerminalMaterial();
    expect(material.uniforms.uBayer.value).toHaveLength(64);
    expect(material.uniforms.uLensStrength.value).toBe(0);
    expect(material.uniforms.uCellPx.value).toBeGreaterThanOrEqual(16);
    material.dispose();
  });
});
