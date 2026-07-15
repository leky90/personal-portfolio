import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  createMonolithRig,
  sampleMonolithRig,
} from "@/features/concepts/monolith/lib/monolith-rig";

describe("đường bay camera qua khối chữ", () => {
  it("dolly tiến dọc z gần như đơn điệu (không quay đầu)", () => {
    const rig = createMonolithRig();
    let prevZ = rig.position.getPointAt(0).z;
    for (let i = 1; i <= 24; i += 1) {
      const z = rig.position.getPointAt(i / 24).z;
      expect(z).toBeGreaterThan(prevZ - 1.2);
      prevZ = Math.max(prevZ, z);
    }
  });

  it("target luôn ở phía trước camera trên trục z", () => {
    const rig = createMonolithRig();
    const pos = new THREE.Vector3();
    const target = new THREE.Vector3();
    for (let i = 0; i <= 10; i += 1) {
      sampleMonolithRig(rig, i / 10, pos, target);
      expect(target.z).toBeGreaterThan(pos.z);
    }
  });

  it("sample ghi vào vector có sẵn và kẹp t ngoài [0,1]", () => {
    const rig = createMonolithRig();
    const pos = new THREE.Vector3();
    const target = new THREE.Vector3();
    sampleMonolithRig(rig, 0.5, pos, target);
    const snapshot = pos.clone();
    sampleMonolithRig(rig, 2, pos, target);
    expect(pos.equals(snapshot)).toBe(false);
    expect(() => sampleMonolithRig(rig, -1, pos, target)).not.toThrow();
  });
});
