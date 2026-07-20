import * as THREE from "three";
import { DECISIONS } from "@/features/concepts/decision-diff/lib/decisions-data";

/**
 * Hình học được COMPILE từ decision log: trunk lượn nhẹ theo side của từng
 * ADR, mỗi fork mọc một nhánh ma rẽ đúng phía, camera bay dọc trunk.
 * Tất cả bake một lần lúc mount.
 */

const FORK_SPACING = 18;
const FORK_START_Z = 14;

export interface RailFork {
  /** Vị trí fork trên trunk */
  position: THREE.Vector3;
  /** Curve nhánh ma (điểm 0 = fork) */
  ghost: THREE.CatmullRomCurve3;
}

export interface Rail {
  trunk: THREE.CatmullRomCurve3;
  forks: RailFork[];
  cameraPosition: THREE.CatmullRomCurve3;
  cameraTarget: THREE.CatmullRomCurve3;
  depth: number;
}

export function buildRail(): Rail {
  const depth = FORK_START_Z + FORK_SPACING * DECISIONS.length;

  // Trunk lượn về phía side của quyết định sắp tới rồi trả về giữa
  const trunkPoints: THREE.Vector3[] = [new THREE.Vector3(0, 0, -8)];
  const forkPositions: THREE.Vector3[] = [];
  DECISIONS.forEach((decision, index) => {
    const z = FORK_START_Z + index * FORK_SPACING;
    const sway = decision.side === "left" ? -1.4 : 1.4;
    const fork = new THREE.Vector3(sway * 0.5, 0, z);
    forkPositions.push(fork);
    trunkPoints.push(new THREE.Vector3(sway * 0.5, 0, z));
    trunkPoints.push(new THREE.Vector3(sway * -0.3, 0, z + FORK_SPACING * 0.55));
  });
  trunkPoints.push(new THREE.Vector3(0, 0, depth + 10));
  const trunk = new THREE.CatmullRomCurve3(trunkPoints, false, "centripetal");

  const forks: RailFork[] = forkPositions.map((position, index) => {
    const sign = DECISIONS[index].side === "left" ? -1 : 1;
    const ghost = new THREE.CatmullRomCurve3(
      [
        position.clone(),
        new THREE.Vector3(position.x + sign * 2.4, 0.5, position.z + 3.2),
        new THREE.Vector3(position.x + sign * 5.4, 1.2, position.z + 6.4),
        new THREE.Vector3(position.x + sign * 8.2, 1.8, position.z + 9.2),
      ],
      false,
      "centripetal",
    );
    return { position, ghost };
  });

  // Camera bám trunk từ trên-sau, target dẫn trước
  const cameraPoints = trunkPoints.map(
    (p) => new THREE.Vector3(p.x * 0.7, 2.7, p.z - 8),
  );
  const targetPoints = trunkPoints.map(
    (p) => new THREE.Vector3(p.x, 0.5, p.z + 7),
  );

  return {
    trunk,
    forks,
    cameraPosition: new THREE.CatmullRomCurve3(cameraPoints, false, "centripetal"),
    cameraTarget: new THREE.CatmullRomCurve3(targetPoints, false, "centripetal"),
    depth,
  };
}

/** Sample camera vào vector có sẵn — gọi mỗi frame, zero allocation. */
export function sampleRailCamera(
  rail: Rail,
  t: number,
  outPosition: THREE.Vector3,
  outTarget: THREE.Vector3,
): THREE.Vector3 {
  const clamped = Math.min(Math.max(t, 0), 1);
  rail.cameraPosition.getPointAt(clamped, outPosition);
  rail.cameraTarget.getPointAt(clamped, outTarget);
  return outPosition;
}
