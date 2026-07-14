import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  TERRAIN_DEPTH,
  createCameraPath,
  sampleCameraPath,
} from "@/features/concepts/terrain/lib/camera-path";

describe("camera path dọc trục thời gian", () => {
  it("bắt đầu trước mép địa hình, kết thúc vượt qua ridge cuối", () => {
    const path = createCameraPath();
    const start = path.position.getPointAt(0);
    const end = path.position.getPointAt(1);
    expect(start.z).toBeLessThan(0);
    expect(end.z).toBeGreaterThan(TERRAIN_DEPTH);
  });

  it("tiến dọc trục z gần như đơn điệu theo t (không quay đầu)", () => {
    const path = createCameraPath();
    let prevZ = path.position.getPointAt(0).z;
    for (let i = 1; i <= 24; i += 1) {
      const z = path.position.getPointAt(i / 24).z;
      expect(z).toBeGreaterThan(prevZ - 1.5);
      prevZ = Math.max(prevZ, z);
    }
  });

  it("camera luôn bay phía trên địa hình", () => {
    const path = createCameraPath();
    for (let i = 0; i <= 24; i += 1) {
      expect(path.position.getPointAt(i / 24).y).toBeGreaterThan(2);
    }
  });

  it("sampleCameraPath ghi vào vector có sẵn — zero allocation mỗi frame", () => {
    const path = createCameraPath();
    const pos = new THREE.Vector3();
    const target = new THREE.Vector3();
    sampleCameraPath(path, 0.5, pos, target);
    const posAfterFirst = pos.clone();
    expect(pos.lengthSq()).toBeGreaterThan(0);

    sampleCameraPath(path, 0.9, pos, target);
    expect(pos.equals(posAfterFirst)).toBe(false);
    // target luôn nhìn về phía trước camera trên trục thời gian
    expect(target.z).toBeGreaterThan(pos.z);
  });

  it("t ngoài [0,1] được kẹp lại", () => {
    const path = createCameraPath();
    const pos = new THREE.Vector3();
    const target = new THREE.Vector3();
    expect(() => {
      sampleCameraPath(path, -0.5, pos, target);
      sampleCameraPath(path, 1.5, pos, target);
    }).not.toThrow();
  });
});
