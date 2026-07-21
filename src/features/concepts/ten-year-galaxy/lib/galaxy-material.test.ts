import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { GalaxyMaterial } from "@/features/concepts/ten-year-galaxy/lib/galaxy-material";

describe("GalaxyMaterial — 6000 sao một draw call additive", () => {
  it("additive, transparent, không depthWrite, uProgress 0", () => {
    const material = new GalaxyMaterial();
    expect(material.blending).toBe(THREE.AdditiveBlending);
    expect(material.transparent).toBe(true);
    expect(material.depthWrite).toBe(false);
    expect(material.uniforms.uProgress.value).toBe(0);
    material.dispose();
  });

  it("setProgress mutate uniform tại chỗ", () => {
    const material = new GalaxyMaterial();
    material.setProgress(0.72);
    expect(material.uniforms.uProgress.value).toBeCloseTo(0.72, 5);
    material.dispose();
  });
});
