import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { TerrainMaterial } from "@/features/concepts/terrain/lib/terrain-material";

describe("TerrainMaterial", () => {
  it("khởi tạo được ngoài WebGL, là ShaderMaterial additive trong suốt", () => {
    const material = new TerrainMaterial();
    expect(material).toBeInstanceOf(THREE.ShaderMaterial);
    expect(material.transparent).toBe(true);
    expect(material.blending).toBe(THREE.AdditiveBlending);
    expect(material.depthWrite).toBe(false);
    material.dispose();
  });

  it("khai báo đủ uniform của pipeline terrain", () => {
    const material = new TerrainMaterial();
    for (const key of [
      "uHeight",
      "uAmp",
      "uTime",
      "uMotion",
      "uRippleOrigin",
      "uRippleStart",
      "uEraV",
      "uInk",
      "uAccent",
      "uBackground",
      "uFogDensity",
    ]) {
      expect(Object.keys(material.uniforms)).toContain(key);
    }
    material.dispose();
  });

  it("accent là hổ phách #ffb454, era mặc định tắt (-1)", () => {
    const material = new TerrainMaterial();
    const accent = material.uniforms.uAccent.value as THREE.Color;
    expect(accent.getHexString()).toBe("ffb454");
    expect(material.uniforms.uEraV.value).toBe(-1);
    material.dispose();
  });
});
