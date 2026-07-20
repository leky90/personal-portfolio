import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { MeshLinkMaterial } from "@/features/concepts/monolith-to-mesh/lib/mesh-link-material";

describe("MeshLinkMaterial", () => {
  it("là ShaderMaterial additive trong suốt với uU/uTime mặc định 0", () => {
    const material = new MeshLinkMaterial();
    expect(material).toBeInstanceOf(THREE.ShaderMaterial);
    expect(material.transparent).toBe(true);
    expect(material.blending).toBe(THREE.AdditiveBlending);
    expect(material.uniforms.uU.value).toBe(0);
    expect(material.uniforms.uTime.value).toBe(0);
    material.dispose();
  });
});
