import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { AsciiMaterial } from "@/features/concepts/resolution/lib/ascii-material";

describe("AsciiMaterial (ShaderMaterial dùng chung cho subject + covers)", () => {
  it("khởi tạo được ngoài WebGL và là ShaderMaterial", () => {
    const material = new AsciiMaterial();
    expect(material).toBeInstanceOf(THREE.ShaderMaterial);
    material.dispose();
  });

  it("khai báo đủ uniform cho pipeline ASCII", () => {
    const material = new AsciiMaterial();
    const keys = Object.keys(material.uniforms);
    for (const key of [
      "uSource",
      "uGlyphs",
      "uBayer",
      "uResolution",
      "uCellPx",
      "uLens",
      "uLensRadius",
      "uLensStrength",
      "uFocus",
      "uAccent",
      "uInk",
      "uBackground",
    ]) {
      expect(keys).toContain(key);
    }
    material.dispose();
  });

  it("nạp sẵn ma trận Bayer 64 giá trị và accent #b4ff39", () => {
    const material = new AsciiMaterial();
    expect(material.uniforms.uBayer.value).toHaveLength(64);
    const accent = material.uniforms.uAccent.value as THREE.Color;
    expect(accent.getHexString()).toBe("b4ff39");
    material.dispose();
  });

  it("lens mặc định tắt (strength 0) để frame đầu render coarse", () => {
    const material = new AsciiMaterial();
    expect(material.uniforms.uLensStrength.value).toBe(0);
    expect(material.uniforms.uFocus.value).toBe(0);
    material.dispose();
  });
});
