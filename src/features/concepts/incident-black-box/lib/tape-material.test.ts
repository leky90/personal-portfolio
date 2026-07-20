import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { TapeMaterial } from "@/features/concepts/incident-black-box/lib/tape-material";

describe("TapeMaterial", () => {
  it("là ShaderMaterial, khởi tạo ngoài WebGL, nạp sẵn DataTexture metrics", () => {
    const material = new TapeMaterial();
    expect(material).toBeInstanceOf(THREE.ShaderMaterial);
    expect(material.uniforms.uMetrics.value).toBeInstanceOf(THREE.DataTexture);
    material.dispose();
  });

  it("mặc định: severity 0 (băng nguội)", () => {
    const material = new TapeMaterial();
    expect(material.uniforms.uSeverity.value).toBe(0);
    material.dispose();
  });
});
