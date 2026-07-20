import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { DECISIONS } from "@/features/concepts/decision-diff/lib/decisions-data";
import {
  buildRail,
  sampleRailCamera,
} from "@/features/concepts/decision-diff/lib/rail-path";

describe("buildRail — hình học compile từ decision log", () => {
  const rail = buildRail();

  it("trunk là curve hợp lệ chạy sâu vào z, mỗi ADR một fork theo z tăng dần", () => {
    expect(rail.trunk).toBeInstanceOf(THREE.CatmullRomCurve3);
    expect(rail.forks).toHaveLength(DECISIONS.length);
    for (let i = 1; i < rail.forks.length; i += 1) {
      expect(rail.forks[i].position.z).toBeGreaterThan(
        rail.forks[i - 1].position.z,
      );
    }
  });

  it("nhánh ma bắt đầu tại fork và rẽ đúng phía theo side", () => {
    rail.forks.forEach((fork, i) => {
      const start = fork.ghost.getPointAt(0);
      expect(start.distanceTo(fork.position)).toBeLessThan(0.5);
      const end = fork.ghost.getPointAt(1);
      const sign = DECISIONS[i].side === "left" ? -1 : 1;
      expect(Math.sign(end.x - fork.position.x)).toBe(sign);
      expect(end.z).toBeGreaterThan(fork.position.z);
    });
  });

  it("camera tiến dọc z gần như đơn điệu, luôn nhìn về phía trước", () => {
    const pos = new THREE.Vector3();
    const target = new THREE.Vector3();
    let prevZ = -Infinity;
    for (let i = 0; i <= 20; i += 1) {
      sampleRailCamera(rail, i / 20, pos, target);
      expect(pos.z).toBeGreaterThan(prevZ - 1);
      prevZ = Math.max(prevZ, pos.z);
      expect(target.z).toBeGreaterThan(pos.z);
    }
  });

  it("sample ghi vào vector có sẵn và kẹp t ngoài [0,1]", () => {
    const pos = new THREE.Vector3();
    const target = new THREE.Vector3();
    const returned = sampleRailCamera(rail, 0.4, pos, target);
    expect(returned).toBe(pos);
    expect(() => sampleRailCamera(rail, -1, pos, target)).not.toThrow();
    expect(() => sampleRailCamera(rail, 2, pos, target)).not.toThrow();
  });
});
