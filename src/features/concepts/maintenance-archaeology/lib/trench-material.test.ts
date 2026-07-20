import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { TrenchMaterial } from "@/features/concepts/maintenance-archaeology/lib/trench-material";

describe("TrenchMaterial", () => {
  it("là ShaderMaterial với era ramp DataTexture nạp sẵn", () => {
    const material = new TrenchMaterial();
    expect(material).toBeInstanceOf(THREE.ShaderMaterial);
    expect(material.uniforms.uEraRamp.value).toBeInstanceOf(THREE.DataTexture);
    material.dispose();
  });
});
